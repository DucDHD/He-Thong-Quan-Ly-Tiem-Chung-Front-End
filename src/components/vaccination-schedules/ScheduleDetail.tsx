'use client'

import {
  Box,
  Button,
  Divider,
  IconButton,
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
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import {
  getVaccinationBookingDetailAPI,
  VaccinationBookingDetail,
  cancelVaccinationBookingAPI,
  completeBooking
} from '@/services/vaccination-booking.service'

type ScheduleDetailProps = {
  scheduleId: string
}

type SortField =
  'fullName' | 'dateOfBirth' | 'gender' | 'phone' | 'cccd' | 'address'

type SortOrder = 'asc' | 'desc'

const ScheduleDetail = ({ scheduleId }: ScheduleDetailProps) => {
  const { isAdmin, isDoctor, isNurse } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = searchParams.get('currentPage') || '1'

  const [customers, setCustomers] = useState<VaccinationBookingDetail[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const [sortField, setSortField] = useState<SortField>('fullName')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // PAGINATION
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // CANCEL
  const [cancelCustomer, setCancelCustomer] =
    useState<VaccinationBookingDetail | null>(null)

  const [cancelLoading, setCancelLoading] = useState(false)

  // COMPLETE
  const [completeCustomer, setCompleteCustomer] =
    useState<VaccinationBookingDetail | null>(null)

  const [completeLoading, setCompleteLoading] = useState(false)

  // ====================================================
  // LOAD DETAIL
  // ====================================================

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true)

        const data = await getVaccinationBookingDetailAPI(Number(scheduleId))

        setCustomers(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadDetail()
  }, [scheduleId])

  // ====================================================
  // CANCEL
  // ====================================================

  const handleOpenCancel = (customer: VaccinationBookingDetail) => {
    setCancelCustomer(customer)
  }

  const handleCloseCancel = () => {
    if (cancelLoading) return

    setCancelCustomer(null)
  }

  const handleConfirmCancel = async () => {
    if (!cancelCustomer) return

    try {
      setCancelLoading(true)

      await cancelVaccinationBookingAPI(cancelCustomer.booking_id)

      const remainingCustomers = customers.filter(
        (customer) => customer.booking_id !== cancelCustomer.booking_id
      )

      if (remainingCustomers.length === 0) {
        toast.success('Hủy đăng ký tiêm thành công')

        router.push(`/vaccination-schedules?page=${currentPage}`)

        return
      }

      setCustomers(remainingCustomers)
      setCancelCustomer(null)

      // Nếu hủy khách hàng cuối cùng của trang hiện tại
      const totalPages = Math.ceil(remainingCustomers.length / rowsPerPage)

      if (page >= totalPages && page > 0) {
        setPage(page - 1)
      }

      toast.success('Hủy đăng ký tiêm thành công')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data || {}

        if (message) {
          toast.error(message)
          return
        }
      }

      toast.error('Hủy đăng ký tiêm thất bại')
    } finally {
      setCancelLoading(false)
    }
  }

  // ====================================================
  // COMPLETE
  // ====================================================

  const handleOpenComplete = (customer: VaccinationBookingDetail) => {
    setCompleteCustomer(customer)
  }

  const handleCloseComplete = () => {
    if (completeLoading) return

    setCompleteCustomer(null)
  }

  const handleConfirmComplete = async () => {
    if (!completeCustomer) return

    try {
      setCompleteLoading(true)

      await completeBooking(completeCustomer.booking_id)

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.booking_id === completeCustomer.booking_id
            ? { ...customer, status: 'COMPLETED' }
            : customer
        )
      )

      toast.success('đã tiêm chủng thành công')
      setCompleteCustomer(null)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data || {}

        if (message) {
          toast.error(message)
          return
        }
      }

      toast.error('tiêm chủng thất bại')
    } finally {
      setCompleteLoading(false)
    }
  }

  // ====================================================
  // SCHEDULE
  // ====================================================

  const schedule = customers[0]

  // ====================================================
  // SORT
  // ====================================================

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }

    setPage(0)
  }

  // ====================================================
  // SEARCH + SORT
  // ====================================================

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = customers.filter((customer) => {
      if (!keyword) return true

      return (
        customer.fullName.toLowerCase().includes(keyword) ||
        customer.phone?.toLowerCase().includes(keyword) ||
        customer.cccd?.toLowerCase().includes(keyword) ||
        customer.address?.toLowerCase().includes(keyword)
      )
    })

    return [...filtered].sort((a, b) => {
      const aValue = a[sortField] ?? ''
      const bValue = b[sortField] ?? ''

      if (sortField === 'dateOfBirth') {
        const aTime = aValue ? dayjs(aValue).valueOf() : 0
        const bTime = bValue ? dayjs(bValue).valueOf() : 0

        return sortOrder === 'asc' ? aTime - bTime : bTime - aTime
      }

      return sortOrder === 'asc'
        ? String(aValue).localeCompare(String(bValue), 'vi')
        : String(bValue).localeCompare(String(aValue), 'vi')
    })
  }, [customers, search, sortField, sortOrder])

  // ====================================================
  // PAGINATION
  // ====================================================

  const paginatedCustomers = useMemo(() => {
    const start = page * rowsPerPage

    return filteredCustomers.slice(start, start + rowsPerPage)
  }, [filteredCustomers, page, rowsPerPage])

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.push(`/vaccination-schedules?page=${currentPage}`)
  }

  // ====================================================
  // CHANGE PAGE
  // ====================================================

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

  // ====================================================
  // RENDER
  // ====================================================

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
          {/* ====================================================
              HEADER
          ==================================================== */}

          <Box
            sx={{
              px: 2.5,
              py: 2,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <IconButton
              onClick={handleBack}
              sx={{
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ArrowBackOutlinedIcon />
            </IconButton>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3
                }}
              >
                Chi tiết lịch tiêm
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Quản lý khách hàng đăng ký lịch tiêm
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* ====================================================
              THÔNG TIN LỊCH TIÊM
          ==================================================== */}

          <Box
            sx={{
              px: 2.5,
              py: 2,
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: '0.8fr 0.8fr 1fr 1fr 0.8fr 1.6fr'
                },
                gap: 1.5
              }}
            >
              {/* NGÀY TIÊM */}

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <EventOutlinedIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mt: 0.25 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Ngày tiêm
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {schedule
                        ? dayjs(schedule.vaccination_date).format('DD/MM/YYYY')
                        : '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* GIỜ TIÊM */}

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <AccessTimeOutlinedIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mt: 0.25 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Giờ tiêm
                    </Typography>

                    <Typography sx={{ fontWeight: 600 }}>
                      {schedule
                        ? dayjs(schedule.vaccination_date).format('HH:mm')
                        : '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* VACCINE */}

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <VaccinesOutlinedIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mt: 0.25 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Vaccine
                    </Typography>

                    <Typography sx={{ fontWeight: 600 }}>
                      {schedule?.vaccine_name || '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* GIÁ VACCINE */}

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <VaccinesOutlinedIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mt: 0.25 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Giá vaccine
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {schedule?.price != null
                        ? `${Number(schedule.price).toLocaleString('vi-VN')} đ`
                        : '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* ĐỘ TUỔI */}

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <GroupsOutlinedIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mt: 0.25 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Độ tuổi
                    </Typography>

                    <Typography sx={{ fontWeight: 600 }}>
                      {schedule?.age || '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* ĐỊA ĐIỂM TIÊM */}

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <LocationOnOutlinedIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mt: 0.25 }}
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Địa điểm tiêm
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.25,
                        minWidth: 0
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {schedule?.location_name || '-'}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        — {schedule?.location_address || '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ====================================================
              CUSTOMER TOOLBAR
          ==================================================== */}

          <Box
            sx={{
              px: 2.5,
              pt: 2.5,
              pb: 1.5,
              mt: 1,
              flexShrink: 0,
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: '#fafbfc'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1.5
              }}
            >
              Danh sách khách hàng
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: {
                  xs: 'stretch',
                  sm: 'center'
                },
                justifyContent: 'space-between',
                flexDirection: {
                  xs: 'column',
                  sm: 'row'
                },
                gap: 1.5
              }}
            >
              <TextField
                size="small"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(0)
                }}
                placeholder="Tìm tên, SĐT, CCCD, địa chỉ..."
                sx={{
                  width: {
                    xs: '100%',
                    sm: 340
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

              <Typography
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {filteredCustomers.length} khách hàng
              </Typography>
            </Box>
          </Box>

          {/* ====================================================
              CUSTOMER TABLE
          ==================================================== */}

          <TableContainer
            sx={{
              minHeight: 0,
              flex: rowsPerPage === 5 ? '0 0 auto' : 1,

              overflowX: 'auto',
              overflowY: rowsPerPage === 5 ? 'hidden' : 'auto',

              scrollbarWidth: 'thin',

              '&::-webkit-scrollbar': {
                width: '9px',
                height: '9px'
              },

              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1'
              },

              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#999',
                borderRadius: '10px',
                border: '2px solid #f1f1f1'
              },

              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#777'
              },

              '&::-webkit-scrollbar-button': {
                display: 'none'
              }
            }}
          >
            <Table stickyHeader={rowsPerPage > 5} sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortField === 'fullName'}
                      direction={sortField === 'fullName' ? sortOrder : 'asc'}
                      onClick={() => handleSort('fullName')}
                    >
                      Họ và tên
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortField === 'dateOfBirth'}
                      direction={
                        sortField === 'dateOfBirth' ? sortOrder : 'asc'
                      }
                      onClick={() => handleSort('dateOfBirth')}
                    >
                      Ngày sinh
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortField === 'gender'}
                      direction={sortField === 'gender' ? sortOrder : 'asc'}
                      onClick={() => handleSort('gender')}
                    >
                      Giới tính
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortField === 'phone'}
                      direction={sortField === 'phone' ? sortOrder : 'asc'}
                      onClick={() => handleSort('phone')}
                    >
                      Số điện thoại
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortField === 'cccd'}
                      direction={sortField === 'cccd' ? sortOrder : 'asc'}
                      onClick={() => handleSort('cccd')}
                    >
                      CCCD
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortField === 'address'}
                      direction={sortField === 'address' ? sortOrder : 'asc'}
                      onClick={() => handleSort('address')}
                    >
                      Địa chỉ
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
                {paginatedCustomers.map((customer, index) => (
                  <TableRow key={customer.booking_id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {customer.fullName}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {customer.dateOfBirth
                        ? dayjs(customer.dateOfBirth).format('DD/MM/YYYY')
                        : '-'}
                    </TableCell>

                    <TableCell>{customer.gender || '-'}</TableCell>

                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {customer.phone || '-'}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {customer.cccd || '-'}
                    </TableCell>

                    <TableCell
                      sx={{
                        minWidth: 180,
                        maxWidth: 260
                      }}
                    >
                      {customer.address || '-'}
                    </TableCell>
                    {(isAdmin || isDoctor || isNurse) && (
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            disabled={customer.status === 'COMPLETED'}
                            onClick={() => handleOpenComplete(customer)}
                            sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                          >
                            {customer.status === 'COMPLETED'
                              ? 'Đã tiêm'
                              : 'Xác Nhận'}
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={customer.status === 'COMPLETED'}
                            startIcon={<CancelOutlinedIcon />}
                            onClick={() => handleOpenCancel(customer)}
                            sx={{
                              textTransform: 'none',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Hủy
                          </Button>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                {!loading && paginatedCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <PersonOutlineOutlinedIcon
                        sx={{
                          fontSize: 42,
                          color: 'text.disabled',
                          mb: 1
                        }}
                      />

                      <Typography sx={{ fontWeight: 600 }}>
                        Không tìm thấy khách hàng
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Chưa có khách hàng hoặc không có kết quả phù hợp.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ====================================================
              PAGINATION
          ==================================================== */}

          <Box
            sx={{
              mt: rowsPerPage === 5 ? 'auto' : 0,
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
              labelDisplayedRows={() => {
                const totalPages = Math.max(
                  1,
                  Math.ceil(filteredCustomers.length / rowsPerPage)
                )

                return `Trang ${page + 1} / ${totalPages}`
              }}
            />
          </Box>
        </Paper>

        {/* ====================================================
            DIALOG Xác Nhận
        ==================================================== */}

        <Dialog
          open={Boolean(completeCustomer)}
          onClose={handleCloseComplete}
          fullWidth
          maxWidth="xs"
          slotProps={{
            paper: {
              sx: {
                borderRadius: 2.5
              }
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Xác nhận đã tiêm
            </Typography>
          </DialogTitle>

          <Divider />

          <DialogContent>
            <Typography>
              Bạn có chắc chắn khách hàng{' '}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {completeCustomer?.fullName}
              </Box>{' '}
              đã tiêm tiêm chủng?
            </Typography>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseComplete}
              disabled={completeLoading}
              sx={{ textTransform: 'none' }}
            >
              Đóng
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmComplete}
              disabled={completeLoading}
              sx={{ textTransform: 'none' }}
            >
              {completeLoading ? 'Đang xử lý...' : 'Xác nhận đã tiêm'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ====================================================
            DIALOG HỦY
        ==================================================== */}

        <Dialog
          open={Boolean(cancelCustomer)}
          onClose={handleCloseCancel}
          fullWidth
          maxWidth="xs"
          slotProps={{
            paper: {
              sx: {
                borderRadius: 2.5
              }
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Xác nhận hủy đăng ký
            </Typography>
          </DialogTitle>

          <Divider />

          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn hủy đăng ký tiêm của{' '}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {cancelCustomer?.fullName}
              </Box>
              ?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Khách hàng sẽ được xóa khỏi danh sách đăng ký của lịch tiêm này.
            </Typography>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseCancel}
              disabled={cancelLoading}
              sx={{ textTransform: 'none' }}
            >
              Đóng
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmCancel}
              disabled={cancelLoading}
              sx={{ textTransform: 'none' }}
            >
              {cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default ScheduleDetail
