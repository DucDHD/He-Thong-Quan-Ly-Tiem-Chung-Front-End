'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  Paper,
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

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import { activeUserAPI, getCustomer, type User } from '@/services/user.service'

type Order = 'asc' | 'desc'
type OrderBy = 'email' | 'fullName' | 'cccd' | 'address' | 'status'

const columns: { key: OrderBy; label: string }[] = [
  { key: 'email', label: 'Email' },
  { key: 'fullName', label: 'Họ và tên' },
  { key: 'cccd', label: 'CCCD' },
  { key: 'address', label: 'Nơi ở' },
  { key: 'status', label: 'Trạng thái' }
]

const CustomerList = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [customers, setCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [activeUser, setActiveUser] = useState<User | null>(null)
  const [activeLoading, setActiveLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<OrderBy>('fullName')
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // URL là nguồn xác định trang hiện tại.
  const pageFromUrl = Number(searchParams.get('page') || '1')

  const requestedPage =
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl - 1 : 0

  // =========================
  // GET CUSTOMERS
  // =========================

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        setLoading(true)

        const data = await getCustomer()

        if (mounted) {
          setCustomers(data)
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách khách hàng:', error)

        if (mounted) {
          toast.error('Không thể tải danh sách khách hàng')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void fetchData()

    return () => {
      mounted = false
    }
  }, [])

  // =========================
  // ACTIVE / DEACTIVE
  // =========================

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

      setCustomers((current) =>
        current.map((user) =>
          user.user_id === activeUser.user_id
            ? { ...user, isActive: newStatus }
            : user
        )
      )

      toast.success(
        newStatus
          ? 'Kích hoạt tài khoản khách hàng thành công'
          : 'Ngừng hoạt động tài khoản khách hàng thành công'
      )

      setActiveUser(null)
    } catch (error) {
      console.error(error)

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
  // RESET PAGE
  // =========================

  const resetPage = () => {
    router.replace('/customer?page=1', {
      scroll: false
    })
  }

  // =========================
  // SORT
  // =========================

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    resetPage()
  }

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = customers.filter((user) => {
      return (
        !keyword ||
        (user.fullName || '').toLowerCase().includes(keyword) ||
        (user.email || '').toLowerCase().includes(keyword) ||
        (user.cccd || '').toLowerCase().includes(keyword) ||
        (user.address || '').toLowerCase().includes(keyword) ||
        String(user.user_id).includes(keyword)
      )
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
          valueA = a.fullName?.toLowerCase() || ''
          valueB = b.fullName?.toLowerCase() || ''
          break

        case 'cccd':
          valueA = a.cccd || ''
          valueB = b.cccd || ''
          break

        case 'address':
          valueA = a.address?.toLowerCase() || ''
          valueB = b.address?.toLowerCase() || ''
          break

        case 'status':
          valueA = a.isActive ? '1' : '0'
          valueB = b.isActive ? '1' : '0'
          break
      }

      const result = valueA.localeCompare(valueB, 'vi', {
        numeric: true
      })

      return order === 'asc' ? result : -result
    })
  }, [customers, search, order, orderBy])

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / rowsPerPage)
  )

  const page = Math.min(requestedPage, totalPages - 1)

  const paginatedCustomers = useMemo(() => {
    const start = page * rowsPerPage

    return filteredCustomers.slice(start, start + rowsPerPage)
  }, [filteredCustomers, page, rowsPerPage])

  const handleChangePage = (_event: unknown, newPage: number) => {
    router.replace(`/customer?page=${newPage + 1}`, {
      scroll: false
    })
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value))
    resetPage()
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    resetPage()
  }

  // =========================
  // NAVIGATION
  // =========================

  const handleView = (userId: number) => {
    router.push(`/customer/detail/${userId}?currentPage=${page + 1}`)
  }

  const handleEdit = (userId: number) => {
    router.push(`/customer/edit/${userId}?currentPage=${page + 1}`)
  }

  // =========================
  // UI
  // =========================

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
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
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
                  Danh sách khách hàng
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Quản lý tài khoản khách hàng sử dụng hệ thống
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => router.push('/customer/create')}
              sx={{
                height: 42,
                px: 2.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Thêm khách hàng
            </Button>
          </Box>

          {/* TOOLBAR */}
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              bgcolor: '#fafbfc',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              flexShrink: 0
            }}
          >
            <TextField
              size="small"
              value={search}
              onChange={handleSearchChange}
              placeholder="Tìm tên, email, CCCD..."
              sx={{
                width: { xs: '100%', sm: 320 },
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
            <Table stickyHeader sx={{ minWidth: 1100 }}>
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

                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <TableSortLabel
                        active={orderBy === column.key}
                        direction={orderBy === column.key ? order : 'asc'}
                        onClick={() => handleSort(column.key)}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          {column.label}
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                  ))}

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 7 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((user, index) => (
                    <TableRow key={user.user_id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {user.email || '-'}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 500,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user.fullName || '-'}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {user.cccd || '-'}
                      </TableCell>

                      <TableCell>{user.address || '-'}</TableCell>

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
                            onClick={() => handleView(user.user_id)}
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
                            onClick={() => handleEdit(user.user_id)}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 7 }}>
                      <PersonOutlineOutlinedIcon
                        sx={{
                          fontSize: 44,
                          color: 'text.disabled',
                          mb: 1
                        }}
                      />

                      <Typography sx={{ fontWeight: 600 }}>
                        Không tìm thấy khách hàng
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
              count={filteredCustomers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={() => `Trang ${page + 1} / ${totalPages}`}
            />
          </Box>

          {/* CONFIRM STATUS DIALOG */}
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
            <DialogContent sx={{ p: 3 }}>
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
                {activeUser?.isActive
                  ? 'sẽ không thể đăng nhập sau khi ngừng hoạt động.'
                  : 'sẽ có thể đăng nhập lại sau khi kích hoạt.'}
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
                    boxShadow: 'none'
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
        </Paper>
      </Box>
    </Box>
  )
}

export default CustomerList
