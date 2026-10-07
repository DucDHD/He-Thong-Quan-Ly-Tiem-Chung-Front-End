'use client'

import {
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material'

import { Dialog, DialogContent } from '@mui/material'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { useEffect, useMemo, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  activeUserAPI,
  getUsers,
  getRoles,
  type User,
  type Role
} from '@/services/user.service'
import { toast } from 'react-toastify'

type Order = 'asc' | 'desc'

type OrderBy = 'email' | 'fullName' | 'cccd' | 'address' | 'role' | 'status'

type RoleFilter = 'all' | number

const UserList = () => {
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])

  const [activeUser, setActiveUser] = useState<User | null>(null)
  const [activeLoading, setActiveLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<OrderBy>('fullName')

  const searchParams = useSearchParams()

  const pageFromUrl = Number(searchParams.get('page') || '1')

  const [page, setPage] = useState(Math.max(pageFromUrl - 1, 0))
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // =========================
  // GET USERS
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          getUsers(),
          getRoles()
        ])

        setUsers(usersData)

        // Không lấy vai trò Bệnh nhân
        setRoles(rolesData.filter((role) => role.role_code !== 5))
      } catch (error) {
        console.error('Lỗi lấy dữ liệu:', error)
      }
    }

    fetchData()
  }, [])

  const handleOpenStatusConfirm = (user: User) => {
    setActiveUser(user)
  }

  const handleCloseStatusConfirm = () => {
    if (activeLoading) return

    setActiveUser(null)
  }

  const handleConfirmActiveUser = async () => {
    if (!activeUser) return

    try {
      setActiveLoading(true)

      const newStatus = !activeUser.isActive

      await activeUserAPI(activeUser.user_id, newStatus)

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.user_id === activeUser.user_id
            ? { ...user, isActive: newStatus }
            : user
        )
      )

      toast.success(
        newStatus
          ? 'Kích hoạt tài khoản thành công'
          : 'Ngừng hoạt động tài khoản thành công'
      )

      setActiveUser(null)
    } catch {
      toast.error(
        activeUser.isActive
          ? 'Ngừng hoạt động tài khoản thất bại'
          : 'Kích hoạt tài khoản thất bại'
      )
    } finally {
      setActiveLoading(false)
    }
  }

  // =========================
  // SORT
  // =========================

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = users.filter((user) => {
      const matchesSearch =
        !keyword ||
        user.fullName.toLowerCase().includes(keyword) ||
        (user.email?.toLowerCase().includes(keyword) ?? false) ||
        (user.cccd?.includes(keyword) ?? false) ||
        (user.address?.toLowerCase().includes(keyword) ?? false)

      const matchesRole =
        roleFilter === 'all' || user.role?.role_code === roleFilter

      return matchesSearch && matchesRole
    })

    return [...filtered].sort((a, b) => {
      let valueA = ''
      let valueB = ''

      switch (orderBy) {
        case 'email':
          valueA = a.email?.toLowerCase() || ''
          valueB = b.email?.toLowerCase() || ''
          break

        case 'fullName':
          valueA = a.fullName.toLowerCase()
          valueB = b.fullName.toLowerCase()
          break

        case 'cccd':
          valueA = a.cccd || ''
          valueB = b.cccd || ''
          break

        case 'address':
          valueA = a.address?.toLowerCase() || ''
          valueB = b.address?.toLowerCase() || ''
          break

        case 'role':
          valueA = a.role?.role_name?.toLowerCase() || ''
          valueB = b.role?.role_name?.toLowerCase() || ''
          break

        case 'status':
          valueA = a.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'
          valueB = b.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'
          break
      }

      const result = valueA.localeCompare(valueB, 'vi')

      return order === 'asc' ? result : -result
    })
  }, [users, search, roleFilter, order, orderBy])

  // =========================
  // PAGINATION
  // =========================

  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage

    return filteredUsers.slice(start, start + rowsPerPage)
  }, [filteredUsers, page, rowsPerPage])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)

    router.replace(`/users?page=${newPage + 1}`)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  return (
    <Box
      component="main"
      sx={(theme) => ({
        ml: theme.layout.sidebarWidth,
        pt: theme.layout.headerHeight,
        height: `calc(100vh - ${theme.layout.footerHeight})`,
        bgcolor: '#f5f7fb',
        boxSizing: 'border-box',
        overflow: 'hidden'
      })}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          p: 3,
          boxSizing: 'border-box'
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: '#fff',
            borderRadius: 2.5,
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              px: 2.5,
              py: 2,
              display: 'flex',
              alignItems: {
                xs: 'flex-start',
                sm: 'center'
              },
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              gap: 2,
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PersonOutlineOutlinedIcon />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.3
                  }}
                >
                  Danh sách nhân viên
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Quản lý tài khoản nhân viên sử dụng hệ thống
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => router.push('/users/create')}
              sx={{
                height: 42,
                px: 2.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Thêm Nhân Viên
            </Button>
          </Box>

          {/* TOOLBAR */}

          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: 'flex',
              alignItems: {
                xs: 'stretch',
                md: 'center'
              },
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                md: 'row'
              },
              gap: 1.5,
              bgcolor: '#fafbfc',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexDirection: {
                  xs: 'column',
                  sm: 'row'
                }
              }}
            >
              <TextField
                size="small"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(0)
                }}
                placeholder="Tìm tên, email, CCCD..."
                sx={{
                  width: {
                    xs: '100%',
                    sm: 320
                  },
                  bgcolor: '#fff'
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <FormControl
                size="small"
                sx={{
                  minWidth: 180,
                  bgcolor: '#fff'
                }}
              >
                <Select
                  value={roleFilter}
                  onChange={(event) => {
                    const value = event.target.value

                    setRoleFilter(value === 'all' ? 'all' : Number(value))
                    setPage(0)
                  }}
                >
                  <MenuItem value="all">Tất cả vai trò</MenuItem>

                  {roles.map((role) => (
                    <MenuItem key={role.role_id} value={role.role_code}>
                      {role.role_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* TABLE */}

          <TableContainer
            sx={{
              width: '100%',
              flex: 1,
              minHeight: 0,
              overflowX: 'auto',
              overflowY: 'auto'
            }}
          >
            <Table
              stickyHeader
              sx={{
                minWidth: 1200
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    STT
                  </TableCell>

                  {/* EMAIL */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        Email
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* FULL NAME */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'fullName'}
                      direction={orderBy === 'fullName' ? order : 'asc'}
                      onClick={() => handleSort('fullName')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        Họ và tên
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* CCCD */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'cccd'}
                      direction={orderBy === 'cccd' ? order : 'asc'}
                      onClick={() => handleSort('cccd')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        CCCD
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* ADDRESS */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'address'}
                      direction={orderBy === 'address' ? order : 'asc'}
                      onClick={() => handleSort('address')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        Nơi ở
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* ROLE */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'role'}
                      direction={orderBy === 'role' ? order : 'asc'}
                      onClick={() => handleSort('role')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        Vai trò
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* STATUS */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        Trạng thái
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedUsers.map((user, index) => (
                  <TableRow key={user.user_id} hover>
                    {/* STT */}

                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                    {/* EMAIL */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {user.email || '-'}
                    </TableCell>

                    {/* FULL NAME */}

                    <TableCell
                      sx={{
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {user.fullName}
                    </TableCell>

                    {/* CCCD */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {user.cccd || '-'}
                    </TableCell>

                    {/* ADDRESS */}

                    <TableCell>{user.address || '-'}</TableCell>

                    {/* ROLE */}

                    <TableCell>
                      <Chip
                        label={user.role?.role_name || '-'}
                        color={
                          user.role?.role_code === 1
                            ? 'error'
                            : user.role?.role_code === 2
                              ? 'primary'
                              : user.role?.role_code === 3
                                ? 'success'
                                : 'default'
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <Chip
                        label={
                          user.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'
                        }
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                        clickable
                        onClick={() => handleOpenStatusConfirm(user)}
                      />
                    </TableCell>

                    {/* ACTION */}

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityOutlinedIcon />}
                          onClick={() => {
                            router.push(
                              `/users/detail/${user.user_id}?currentPage=${page + 1}`
                            )
                          }}
                          sx={{
                            whiteSpace: 'nowrap',
                            textTransform: 'none',
                            color: 'text.secondary',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'text.secondary',
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          Xem
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => {
                            router.push(
                              `/users/edit/${user.user_id}?currentPage=${page + 1}`
                            )
                          }}
                          sx={{
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                          }}
                        >
                          Sửa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 7 }}>
                      <PersonOutlineOutlinedIcon
                        sx={{
                          fontSize: 44,
                          color: 'text.disabled',
                          mb: 1
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Không tìm thấy người dùng
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Không có dữ liệu phù hợp với điều kiện tìm kiếm.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}

          <Box
            sx={{
              flexShrink: 0,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: '#fff'
            }}
          >
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={() => {
                const totalPages = Math.max(
                  1,
                  Math.ceil(filteredUsers.length / rowsPerPage)
                )

                return `Trang ${page + 1} / ${totalPages}`
              }}
            />
            <Dialog
              open={Boolean(activeUser)}
              onClose={handleCloseStatusConfirm}
              maxWidth="xs"
              fullWidth
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: 2.5,
                    maxWidth: 420,
                    m: 2,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.16)'
                  }
                }
              }}
            >
              <DialogContent
                sx={{
                  p: 3
                }}
              >
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  {activeUser?.isActive
                    ? 'Ngừng hoạt động tài khoản?'
                    : 'Kích hoạt tài khoản?'}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: 'text.secondary'
                  }}
                >
                  {activeUser?.isActive ? (
                    <>
                      Tài khoản của{' '}
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary'
                        }}
                      >
                        {activeUser?.fullName}
                      </Box>{' '}
                      sẽ không thể đăng nhập sau khi ngừng hoạt động.
                    </>
                  ) : (
                    <>
                      Tài khoản của{' '}
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary'
                        }}
                      >
                        {activeUser?.fullName}
                      </Box>{' '}
                      sẽ có thể đăng nhập lại sau khi kích hoạt.
                    </>
                  )}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    mt: 3
                  }}
                >
                  <Button
                    onClick={handleCloseStatusConfirm}
                    disabled={activeLoading}
                    variant="outlined"
                    color="inherit"
                    sx={{
                      height: 38,
                      px: 2.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Hủy
                  </Button>

                  <Button
                    onClick={handleConfirmActiveUser}
                    disabled={activeLoading}
                    variant="contained"
                    color={activeUser?.isActive ? 'error' : 'success'}
                    sx={{
                      height: 38,
                      px: 2.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {activeLoading
                      ? 'Đang xử lý...'
                      : activeUser?.isActive
                        ? 'Ngừng hoạt động'
                        : 'Kích hoạt'}
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default UserList
