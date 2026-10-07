'use client'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Paper,
  Stack,
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
  Chip
} from '@mui/material'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import {
  getVaccinationSchedulesAPI,
  deleteVaccinationScheduleAPI,
  type VaccinationSchedule
} from '@/services/vaccination-schedule.service'

import { createVaccinationBookingAPI } from '@/services/vaccination-booking.service'

type Order = 'asc' | 'desc'

type OrderBy =
  | 'vaccination_date'
  | 'vaccination_time'
  | 'vaccine_id'
  | 'age'
  | 'price'
  | 'capacity'
  | 'user_id'
  | 'location'

// ======================================================
// STATUS
// ======================================================

// ======================================================
// COMPONENT
// ======================================================

const ScheduleList = () => {
  const router = useRouter()

  const { user, isAdmin, isDoctor, isNurse, isPatient } = useAuth()

  const searchParams = useSearchParams()
  // DATA
  const [schedules, setSchedules] = useState<VaccinationSchedule[]>([])

  // SEARCH
  const [search, setSearch] = useState('')

  // SORT
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<OrderBy>('vaccination_date')

  // PAGINATION
  const [page, setPage] = useState(() => {
    const currentPage = Number(searchParams.get('page')) || 1
    return currentPage - 1
  })
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // DELETE
  const [deleteSchedule, setDeleteSchedule] =
    useState<VaccinationSchedule | null>(null)

  const [bookingSchedule, setBookingSchedule] =
    useState<VaccinationSchedule | null>(null)
  const [bookingNote, setBookingNote] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getVaccinationSchedulesAPI()
        setSchedules(data)
      } catch (error) {
        console.error('Lỗi lấy danh sách lịch tiêm:', error)
        toast.error('Không thể tải danh sách lịch tiêm')
      }
    }

    fetchSchedules()
  }, [])

  // ====================================================
  // CREATE
  // ====================================================

  const handleCreate = () => {
    router.push('/vaccination-schedules/create')
  }

  // ====================================================
  // DETAIL
  // ====================================================

  const handleDetail = (schedule_id: number) => {
    router.push(`/vaccination-schedules/${schedule_id}?currentPage=${page + 1}`)
  }

  // ====================================================
  // EDIT
  // ====================================================

  const handleEdit = (schedule_id: number) => {
    router.push(
      `/vaccination-schedules/edit/${schedule_id}?currentPage=${page + 1}`
    )
  }

  // ====================================================
  // DELETE
  // ====================================================

  const handleOpenDelete = (schedule: VaccinationSchedule) => {
    setDeleteSchedule(schedule)
  }

  const handleCloseDelete = () => {
    setDeleteSchedule(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteSchedule) return

    try {
      await deleteVaccinationScheduleAPI(deleteSchedule.schedule_id)

      setSchedules((prev) =>
        prev.filter(
          (schedule) => schedule.schedule_id !== deleteSchedule.schedule_id
        )
      )

      toast.success('Xóa lịch tiêm thành công')
      setDeleteSchedule(null)
    } catch {
      toast.error('Xóa lịch tiêm thất bại')
    }
  }

  const handleOpenBooking = (schedule: VaccinationSchedule) => {
    setBookingSchedule(schedule)
    setBookingNote('')
  }

  const handleCloseBooking = () => {
    setBookingSchedule(null)
    setBookingNote('')
  }
  const handleConfirmBooking = async () => {
    if (!bookingSchedule || !user) return

    try {
      setBookingLoading(true)

      await createVaccinationBookingAPI({
        schedule_id: bookingSchedule.schedule_id,
        user_id: user.user_id,
        note: bookingNote.trim() || undefined
      })
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.schedule_id === bookingSchedule.schedule_id
            ? {
                ...schedule,
                registered_count: Number(schedule.registered_count ?? 0) + 1,
                booking_status: 'REGISTERED'
              }
            : schedule
        )
      )

      toast.success('Đăng ký lịch tiêm thành công')

      setBookingSchedule(null)
      setBookingNote('')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { field, message } = error.response?.data || {}

        if (field === 'schedule_id' && message) {
          toast.error(message)
          return
        }
      }
    } finally {
      setBookingLoading(false)
    }
  }

  // ====================================================
  // SORT
  // ====================================================

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  // ====================================================
  // PAGINATION
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
  // FILTER + SORT
  // ====================================================

  const filteredSchedules = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = schedules.filter((schedule) => {
      const matchesSearch =
        !keyword ||
        schedule.age.toLowerCase().includes(keyword) ||
        schedule.vaccine_name?.toLowerCase().includes(keyword) ||
        schedule.fullName?.toLowerCase().includes(keyword) ||
        dayjs(schedule.vaccination_date).format('DD/MM/YYYY').includes(keyword)

      return matchesSearch
    })

    return [...filtered].sort((a, b) => {
      let valueA: string | number
      let valueB: string | number

      switch (orderBy) {
        case 'vaccination_date':
          valueA = dayjs(a.vaccination_date).valueOf()
          valueB = dayjs(b.vaccination_date).valueOf()
          break

        case 'vaccination_time':
          valueA = dayjs(a.vaccination_date).format('HH:mm')
          valueB = dayjs(b.vaccination_date).format('HH:mm')
          break

        case 'vaccine_id':
          valueA = a.vaccine_id
          valueB = b.vaccine_id
          break

        case 'price':
          valueA = Number(a.price) || 0
          valueB = Number(b.price) || 0
          break

        case 'age':
          valueA = a.age?.toLowerCase() || ''
          valueB = b.age?.toLowerCase() || ''
          break

        case 'capacity':
          valueA = a.capacity
          valueB = b.capacity
          break

        case 'user_id':
          valueA = a.user_id
          valueB = b.user_id
          break

        case 'location':
          valueA = a.location_name?.toLowerCase() || ''
          valueB = b.location_name?.toLowerCase() || ''
          break

        default:
          valueA = a.schedule_id
          valueB = b.schedule_id
      }

      if (valueA < valueB) return order === 'asc' ? -1 : 1
      if (valueA > valueB) return order === 'asc' ? 1 : -1

      return 0
    })
  }, [schedules, search, order, orderBy])
  // ====================================================
  // PAGINATION DATA
  // ====================================================

  const paginatedSchedules = useMemo(() => {
    const start = page * rowsPerPage

    return filteredSchedules.slice(start, start + rowsPerPage)
  }, [filteredSchedules, page, rowsPerPage])

  // ====================================================
  // UI
  // ====================================================

  return (
    <>
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
                py: 2.5,
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: {
                  xs: 'flex-start',
                  sm: 'center'
                },
                flexDirection: {
                  xs: 'column',
                  sm: 'row'
                },
                gap: 2
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: 'center' }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.08)'
                  }}
                >
                  <CalendarMonthOutlinedIcon color="primary" />
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.3
                    }}
                  >
                    Lịch tiêm chủng
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Quản lý danh sách lịch tiêm chủng
                  </Typography>
                </Box>
              </Stack>
              {(isAdmin || isDoctor || isNurse) && (
                <Button
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  onClick={handleCreate}
                  sx={{
                    flexShrink: 0,
                    minHeight: 42,
                    px: 2.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Tạo lịch tiêm
                </Button>
              )}
            </Box>

            {/* SEARCH + FILTER */}

            <Box
              sx={{
                px: 2.5,
                py: 2,
                flexShrink: 0,
                borderTop: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fafbfc'
              }}
            >
              <Stack
                direction={{
                  xs: 'column',
                  md: 'row'
                }}
                spacing={2}
              >
                <TextField
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(0)
                  }}
                  size="small"
                  placeholder="Tìm ID vaccine, nhân viên, độ tuổi, ngày tiêm..."
                  sx={{
                    flex: 1,
                    maxWidth: {
                      md: 500
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
              </Stack>
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
                  minWidth: 1050
                }}
              >
                <TableHead>
                  <TableRow>
                    {/* DATE */}

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'vaccination_date'}
                        direction={
                          orderBy === 'vaccination_date' ? order : 'asc'
                        }
                        onClick={() => handleSort('vaccination_date')}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Ngày tiêm
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    {/* TIME */}

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'vaccination_time'}
                        direction={
                          orderBy === 'vaccination_time' ? order : 'asc'
                        }
                        onClick={() => handleSort('vaccination_time')}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Giờ
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    {/* VACCINE */}

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'vaccine_id'}
                        direction={orderBy === 'vaccine_id' ? order : 'asc'}
                        onClick={() => handleSort('vaccine_id')}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Vaccine
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    {/* AGE */}

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'age'}
                        direction={orderBy === 'age' ? order : 'asc'}
                        onClick={() => handleSort('age')}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Độ tuổi
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    {/* CAPACITY */}

                    <TableCell align="center">
                      <TableSortLabel
                        active={orderBy === 'capacity'}
                        direction={orderBy === 'capacity' ? order : 'asc'}
                        onClick={() => handleSort('capacity')}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Số lượng
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    {/* STAFF */}
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'price'}
                        direction={orderBy === 'price' ? order : 'asc'}
                        onClick={() => handleSort('price')}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Giá vaccine
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'user_id'}
                        direction={orderBy === 'user_id' ? order : 'asc'}
                        onClick={() => handleSort('user_id')}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Nhân viên y tế
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'location'}
                        direction={orderBy === 'location' ? order : 'asc'}
                        onClick={() => handleSort('location')}
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Địa Điểm Tiêm
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    {(isPatient || isAdmin) && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          minWidth: 110
                        }}
                      >
                        Đăng ký
                      </TableCell>
                    )}

                    {/* ACTION */}

                    {(isAdmin || isDoctor || isNurse) && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          minWidth: 130
                        }}
                      >
                        Thao tác
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedSchedules.map((schedule) => {
                    return (
                      <TableRow key={schedule.schedule_id} hover>
                        {/* DATE */}

                        <TableCell
                          sx={{
                            fontWeight: 500,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {dayjs(schedule.vaccination_date).format(
                            'DD/MM/YYYY'
                          )}
                        </TableCell>

                        {/* TIME */}

                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {dayjs(schedule.vaccination_date).format('HH:mm')}
                        </TableCell>

                        {/* VACCINE */}

                        <TableCell
                          sx={{
                            fontWeight: 500,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {schedule.vaccine_name}
                        </TableCell>

                        {/* AGE */}

                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {schedule.age}
                        </TableCell>

                        {/* CAPACITY */}

                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <Chip
                              label={
                                Number(schedule.registered_count) >=
                                schedule.capacity
                                  ? 'Đã đầy'
                                  : 'Còn chỗ'
                              }
                              color={
                                Number(schedule.registered_count) >=
                                schedule.capacity
                                  ? 'error'
                                  : 'success'
                              }
                              size="small"
                            />

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: 500 }}
                            >
                              {Number(schedule.registered_count)} /{' '}
                              {schedule.capacity}
                            </Typography>
                          </Box>
                        </TableCell>
                        {/* STAFF */}
                        <TableCell>
                          {Number(schedule.price).toLocaleString('vi-VN')} đ
                        </TableCell>

                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {schedule.fullName}
                        </TableCell>

                        {/* STATUS */}

                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {schedule.location_name || 'Chưa cập nhật'}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500 }}
                            color="text.secondary"
                          >
                            {schedule.address || ''}
                          </Typography>
                        </TableCell>

                        {(isPatient || isAdmin) && (
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="contained"
                              disabled={
                                schedule.booking_status === 'REGISTERED' ||
                                schedule.booking_status === 'COMPLETED' ||
                                Number(schedule.registered_count) >=
                                  Number(schedule.capacity)
                              }
                              onClick={(event) => {
                                event.stopPropagation()
                                handleOpenBooking(schedule)
                              }}
                              sx={{
                                whiteSpace: 'nowrap',
                                textTransform: 'none',
                                minWidth: 90
                              }}
                            >
                              {schedule.booking_status === 'COMPLETED'
                                ? 'Đã tiêm'
                                : schedule.booking_status === 'REGISTERED'
                                  ? 'Đã đăng ký'
                                  : Number(schedule.registered_count) >=
                                      Number(schedule.capacity)
                                    ? 'Đã đầy'
                                    : 'Đăng ký'}
                            </Button>
                          </TableCell>
                        )}

                        {(isAdmin || isDoctor || isNurse) && (
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
                                color="inherit"
                                endIcon={<ChevronRightOutlinedIcon />}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleDetail(schedule.schedule_id)
                                }}
                                sx={{
                                  whiteSpace: 'nowrap',
                                  textTransform: 'none',
                                  color: 'text.secondary',
                                  borderColor: 'divider'
                                }}
                              >
                                Chi tiết
                              </Button>

                              {isAdmin && (
                                <>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<EditOutlinedIcon />}
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      handleEdit(schedule.schedule_id)
                                    }}
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      textTransform: 'none'
                                    }}
                                  >
                                    Sửa
                                  </Button>

                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteOutlineOutlinedIcon />}
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      handleOpenDelete(schedule)
                                    }}
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      textTransform: 'none'
                                    }}
                                  >
                                    Xóa
                                  </Button>
                                </>
                              )}
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}

                  {paginatedSchedules.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          8 +
                          (isPatient || isAdmin ? 1 : 0) +
                          (isAdmin || isDoctor || isNurse ? 1 : 0)
                        }
                        align="center"
                        sx={{ py: 7 }}
                      >
                        <CalendarMonthOutlinedIcon
                          sx={{
                            fontSize: 42,
                            color: 'text.disabled',
                            mb: 1
                          }}
                        />

                        <Typography sx={{ fontWeight: 600 }}>
                          Không tìm thấy lịch tiêm
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Thử thay đổi từ khóa hoặc bộ lọc.
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
                count={filteredSchedules.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
                labelRowsPerPage="Số dòng mỗi trang:"
                labelDisplayedRows={() => {
                  const totalPages = Math.max(
                    1,
                    Math.ceil(filteredSchedules.length / rowsPerPage)
                  )

                  return `Trang ${page + 1} / ${totalPages}`
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* DELETE CONFIRM */}

      <Dialog
        open={Boolean(deleteSchedule)}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(211, 47, 47, 0.08)',
                color: 'error.main'
              }}
            >
              <WarningAmberOutlinedIcon />
            </Box>

            <Typography component="span" variant="h6" sx={{ fontWeight: 600 }}>
              Xác nhận xóa
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa lịch tiêm vaccine{' '}
            <strong>{deleteSchedule?.vaccine_name}</strong> ngày{' '}
            <strong>
              {deleteSchedule
                ? dayjs(deleteSchedule.vaccination_date).format(
                    'DD/MM/YYYY HH:mm'
                  )
                : ''}
            </strong>
            ?
          </DialogContentText>

          <Typography variant="body2" color="error.main" sx={{ mt: 1.5 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCloseDelete}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>

          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            sx={{ textTransform: 'none' }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      {/* BOOKING DIALOG */}

      <Dialog
        open={Boolean(bookingSchedule)}
        onClose={handleCloseBooking}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2.5
            }
          }
        }}
      >
        <DialogTitle>
          <Typography component="span" variant="h6" sx={{ fontWeight: 600 }}>
            Đăng ký lịch tiêm
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* THÔNG TIN LỊCH TIÊM */}
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
                Thông tin lịch tiêm
              </Typography>

              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: '1fr 1fr'
                    },
                    gap: 2
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Vaccine
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {bookingSchedule?.vaccine_name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Độ tuổi
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {bookingSchedule?.age}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ngày tiêm
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {bookingSchedule
                        ? dayjs(bookingSchedule.vaccination_date).format(
                            'DD/MM/YYYY'
                          )
                        : ''}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Giờ tiêm
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {bookingSchedule
                        ? dayjs(bookingSchedule.vaccination_date).format(
                            'HH:mm'
                          )
                        : ''}
                    </Typography>
                  </Box>

                  <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                    <Typography variant="caption" color="text.secondary">
                      Nhân viên y tế phụ trách
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {bookingSchedule?.fullName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* THÔNG TIN NGƯỜI ĐĂNG KÝ */}
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
                Thông tin người đăng ký
              </Typography>

              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: '1fr 1fr'
                    },
                    gap: 2
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Họ và tên
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {user?.fullName || 'Chưa cập nhật'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Số điện thoại
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {user?.phone || 'Chưa cập nhật'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ngày sinh
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {user?.dateOfBirth
                        ? dayjs(user.dateOfBirth).format('DD/MM/YYYY')
                        : 'Chưa cập nhật'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Giới tính
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {user?.gender || 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* GHI CHÚ */}
            <TextField
              label="Ghi chú"
              value={bookingNote}
              onChange={(event) => setBookingNote(event.target.value)}
              placeholder="Nhập ghi chú nếu có"
              multiline
              rows={3}
              fullWidth

              helperText={`${bookingNote.length}/500`}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseBooking}
            disabled={bookingLoading}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={bookingLoading}
            sx={{ textTransform: 'none' }}
          >
            {bookingLoading ? 'Đang đăng ký...' : 'Xác nhận đăng ký'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ScheduleList
