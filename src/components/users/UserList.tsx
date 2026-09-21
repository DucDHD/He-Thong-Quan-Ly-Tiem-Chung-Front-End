'use client'

import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
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
  Tooltip,
  Typography
} from '@mui/material'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import type { ChipProps } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

type UserRole = 'admin' | 'doctor' | 'nurse' | 'staff'

type UserStatus = 'active' | 'inactive'

type User = {
  id: number
  username: string
  fullName: string
  identityNumber: string
  address: string
  role: UserRole
  status: UserStatus
}

type Order = 'asc' | 'desc'

type OrderBy =
  'username' | 'fullName' | 'identityNumber' | 'address' | 'role' | 'status'

type RoleFilter = 'all' | UserRole

type RoleConfig = {
  label: string
  color: ChipProps['color']
}

type StatusConfig = {
  label: string
  color: ChipProps['color']
}

const roleMap: Record<UserRole, RoleConfig> = {
  admin: {
    label: 'Quản trị viên',
    color: 'error'
  },
  doctor: {
    label: 'Bác sĩ',
    color: 'primary'
  },
  nurse: {
    label: 'Điều dưỡng',
    color: 'success'
  },
  staff: {
    label: 'Nhân viên',
    color: 'default'
  }
}

const statusMap: Record<UserStatus, StatusConfig> = {
  active: {
    label: 'Đang hoạt động',
    color: 'success'
  },
  inactive: {
    label: 'Ngừng hoạt động',
    color: 'default'
  }
}

const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Nguyễn Văn Quản',
    identityNumber: '048090001234',
    address: 'Hải Châu, Đà Nẵng',
    role: 'admin',
    status: 'active'
  },
  {
    id: 2,
    username: 'nguyenvanminh',
    fullName: 'Nguyễn Văn Minh',
    identityNumber: '048085002345',
    address: 'Sơn Trà, Đà Nẵng',
    role: 'doctor',
    status: 'active'
  },
  {
    id: 3,
    username: 'tranthilan',
    fullName: 'Trần Thị Lan',
    identityNumber: '048092003456',
    address: 'Thanh Khê, Đà Nẵng',
    role: 'nurse',
    status: 'active'
  },
  {
    id: 4,
    username: 'lethihoa',
    fullName: 'Lê Thị Hoa',
    identityNumber: '048094004567',
    address: 'Liên Chiểu, Đà Nẵng',
    role: 'nurse',
    status: 'active'
  },
  {
    id: 5,
    username: 'phamvanhung',
    fullName: 'Phạm Văn Hùng',
    identityNumber: '048088005678',
    address: 'Cẩm Lệ, Đà Nẵng',
    role: 'staff',
    status: 'active'
  },
  {
    id: 6,
    username: 'vothimai',
    fullName: 'Võ Thị Mai',
    identityNumber: '048096006789',
    address: 'Ngũ Hành Sơn, Đà Nẵng',
    role: 'staff',
    status: 'active'
  },
  {
    id: 7,
    username: 'hoangvanan',
    fullName: 'Hoàng Văn An',
    identityNumber: '048087007890',
    address: 'Hải Châu, Đà Nẵng',
    role: 'doctor',
    status: 'active'
  },
  {
    id: 8,
    username: 'dangthithu',
    fullName: 'Đặng Thị Thu',
    identityNumber: '048093008901',
    address: 'Sơn Trà, Đà Nẵng',
    role: 'nurse',
    status: 'inactive'
  },
  {
    id: 9,
    username: 'buivanphuc',
    fullName: 'Bùi Văn Phúc',
    identityNumber: '048089009012',
    address: 'Thanh Khê, Đà Nẵng',
    role: 'staff',
    status: 'active'
  },
  {
    id: 10,
    username: 'nguyenthihuong',
    fullName: 'Nguyễn Thị Hương',
    identityNumber: '048095010123',
    address: 'Cẩm Lệ, Đà Nẵng',
    role: 'nurse',
    status: 'active'
  },
  {
    id: 11,
    username: 'tranvanhai',
    fullName: 'Trần Văn Hải',
    identityNumber: '048086011234',
    address: 'Liên Chiểu, Đà Nẵng',
    role: 'doctor',
    status: 'active'
  },
  {
    id: 12,
    username: 'lequocbao',
    fullName: 'Lê Quốc Bảo',
    identityNumber: '048091012345',
    address: 'Hải Châu, Đà Nẵng',
    role: 'staff',
    status: 'inactive'
  }
]

const UserList = () => {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<OrderBy>('fullName')

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = initialUsers.filter((user) => {
      const matchesSearch =
        !keyword ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword) ||
        user.identityNumber.includes(keyword) ||
        user.address.toLowerCase().includes(keyword)

      const matchesRole = roleFilter === 'all' || user.role === roleFilter

      return matchesSearch && matchesRole
    })

    return [...filtered].sort((a, b) => {
      let valueA = ''
      let valueB = ''

      switch (orderBy) {
        case 'username':
          valueA = a.username.toLowerCase()
          valueB = b.username.toLowerCase()
          break

        case 'fullName':
          valueA = a.fullName.toLowerCase()
          valueB = b.fullName.toLowerCase()
          break

        case 'identityNumber':
          valueA = a.identityNumber
          valueB = b.identityNumber
          break

        case 'address':
          valueA = a.address.toLowerCase()
          valueB = b.address.toLowerCase()
          break

        case 'role':
          valueA = roleMap[a.role].label.toLowerCase()
          valueB = roleMap[b.role].label.toLowerCase()
          break

        case 'status':
          valueA = statusMap[a.status].label.toLowerCase()
          valueB = statusMap[b.status].label.toLowerCase()
          break
      }

      const result = valueA.localeCompare(valueB, 'vi')

      return order === 'asc' ? result : -result
    })
  }, [search, roleFilter, order, orderBy])

  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage

    return filteredUsers.slice(start, start + rowsPerPage)
  }, [filteredUsers, page, rowsPerPage])

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
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
              Tạo tài khoản
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
                placeholder="Tìm tên, username, CCCD..."
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
                    setRoleFilter(event.target.value as RoleFilter)
                    setPage(0)
                  }}
                >
                  <MenuItem value="all">Tất cả phân quyền</MenuItem>

                  <MenuItem value="admin">Quản trị viên</MenuItem>

                  <MenuItem value="doctor">Bác sĩ</MenuItem>

                  <MenuItem value="nurse">Điều dưỡng</MenuItem>

                  <MenuItem value="staff">Nhân viên</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {filteredUsers.length} nhân viên
            </Typography>
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

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'username'}
                      direction={orderBy === 'username' ? order : 'asc'}
                      onClick={() => handleSort('username')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        Tên đăng nhập
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

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

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'identityNumber'}
                      direction={orderBy === 'identityNumber' ? order : 'asc'}
                      onClick={() => handleSort('identityNumber')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        CCCD
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

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

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'role'}
                      direction={orderBy === 'role' ? order : 'asc'}
                      onClick={() => handleSort('role')}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        Phân quyền
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

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
                {paginatedUsers.map((user, index) => {
                  const role = roleMap[user.role]
                  const status = statusMap[user.status]

                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 500,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user.username}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 500,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user.fullName}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user.identityNumber}
                      </TableCell>

                      <TableCell>{user.address}</TableCell>

                      <TableCell>
                        <Chip
                          label={role.label}
                          color={role.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                          }}
                        >
                          {/* EDIT */}

                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<EditOutlinedIcon />}
                            onClick={() => {
                              router.push(`/users/edit/${user.id}`)
                            }}
                            sx={{
                              whiteSpace: 'nowrap',
                              textTransform: 'none'
                            }}
                          >
                            Sửa
                          </Button>

                          {/* DELETE */}

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteOutlineOutlinedIcon />}
                            onClick={() => {
                              router.push(`/users/${user.id}`)
                            }}
                            sx={{
                              whiteSpace: 'nowrap',
                              textTransform: 'none'
                            }}
                          >
                            Xóa
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}

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
                        Không tìm thấy nhân viên
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
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} / ${count}`
              }
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default UserList
