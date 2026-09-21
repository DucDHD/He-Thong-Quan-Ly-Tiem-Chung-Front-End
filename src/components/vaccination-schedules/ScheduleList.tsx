'use client'

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
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
  Tooltip,
  Typography
} from '@mui/material'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

type ScheduleStatus = 'upcoming' | 'full' | 'completed'

type Schedule = {
  id: number
  vaccinationDate: string
  vaccinationTime: string
  vaccine: string
  age: string
  quantity: number
  registered: number
  medicalStaff: string
  status: ScheduleStatus
}

type Order = 'asc' | 'desc'

type OrderBy =
  | 'vaccinationDate'
  | 'vaccinationTime'
  | 'vaccine'
  | 'quantity'
  | 'registered'
  | 'medicalStaff'

// ======================================================
// MOCK DATA
// Sau này có API thì thay phần này bằng dữ liệu từ API
// ======================================================

const initialSchedules: Schedule[] = [
  {
    id: 1,
    vaccinationDate: '2026-09-16',
    vaccinationTime: '14:00',
    vaccine: 'Gardasil 9',
    age: '18 - 26',
    quantity: 30,
    registered: 18,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 2,
    vaccinationDate: '2026-09-18',
    vaccinationTime: '08:00',
    vaccine: 'Influvac Tetra',
    age: '18 - 60',
    quantity: 20,
    registered: 20,
    medicalStaff: 'BS. Trần Văn B',
    status: 'full'
  },
  {
    id: 3,
    vaccinationDate: '2026-09-20',
    vaccinationTime: '09:30',
    vaccine: 'Prevenar 13',
    age: '18 - 65',
    quantity: 25,
    registered: 10,
    medicalStaff: 'BS. Lê Thị C',
    status: 'upcoming'
  },
  {
    id: 4,
    vaccinationDate: '2026-09-22',
    vaccinationTime: '13:30',
    vaccine: 'Gardasil 9',
    age: '18 - 26',
    quantity: 25,
    registered: 15,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 5,
    vaccinationDate: '2026-09-25',
    vaccinationTime: '08:30',
    vaccine: 'Influvac Tetra',
    age: '18 - 60',
    quantity: 30,
    registered: 12,
    medicalStaff: 'BS. Trần Văn B',
    status: 'upcoming'
  },
  {
    id: 6,
    vaccinationDate: '2026-09-27',
    vaccinationTime: '10:00',
    vaccine: 'Prevenar 13',
    age: '18 - 65',
    quantity: 20,
    registered: 20,
    medicalStaff: 'BS. Lê Thị C',
    status: 'full'
  },
  {
    id: 7,
    vaccinationDate: '2026-09-29',
    vaccinationTime: '15:00',
    vaccine: 'Gardasil 9',
    age: '18 - 26',
    quantity: 35,
    registered: 8,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 8,
    vaccinationDate: '2026-10-01',
    vaccinationTime: '07:30',
    vaccine: 'Influvac Tetra',
    age: '18 - 60',
    quantity: 20,
    registered: 9,
    medicalStaff: 'BS. Trần Văn B',
    status: 'upcoming'
  },
  {
    id: 9,
    vaccinationDate: '2026-10-03',
    vaccinationTime: '09:00',
    vaccine: 'Prevenar 13',
    age: '18 - 65',
    quantity: 30,
    registered: 14,
    medicalStaff: 'BS. Lê Thị C',
    status: 'upcoming'
  },
  {
    id: 10,
    vaccinationDate: '2026-10-05',
    vaccinationTime: '14:30',
    vaccine: 'Gardasil 9',
    age: '18 - 26',
    quantity: 25,
    registered: 11,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 11,
    vaccinationDate: '2026-10-08',
    vaccinationTime: '08:00',
    vaccine: 'Influvac Tetra',
    age: '18 - 60',
    quantity: 25,
    registered: 6,
    medicalStaff: 'BS. Trần Văn B',
    status: 'upcoming'
  },
  {
    id: 12,
    vaccinationDate: '2026-10-10',
    vaccinationTime: '10:30',
    vaccine: 'Prevenar 13',
    age: '18 - 65',
    quantity: 20,
    registered: 7,
    medicalStaff: 'BS. Lê Thị C',
    status: 'upcoming'
  },
  {
    id: 13,
    vaccinationDate: '2026-10-12',
    vaccinationTime: '09:00',
    vaccine: 'Gardasil 9',
    age: '18 - 26',
    quantity: 30,
    registered: 14,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 14,
    vaccinationDate: '2026-10-15',
    vaccinationTime: '14:30',
    vaccine: 'Influvac Tetra',
    age: '18 - 60',
    quantity: 25,
    registered: 11,
    medicalStaff: 'BS. Trần Văn B',
    status: 'upcoming'
  },
  {
    id: 15,
    vaccinationDate: '2026-10-18',
    vaccinationTime: '08:00',
    vaccine: 'Prevenar 13',
    age: '18 - 65',
    quantity: 25,
    registered: 6,
    medicalStaff: 'BS. Lê Thị C',
    status: 'upcoming'
  },
  {
    id: 16,
    vaccinationDate: '2026-10-20',
    vaccinationTime: '10:30',
    vaccine: 'Gardasil 9',
    age: '18 - 26',
    quantity: 20,
    registered: 7,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  }
]

// ======================================================
// STATUS
// ======================================================

const getStatus = (status: ScheduleStatus) => {
  switch (status) {
    case 'full':
      return {
        label: 'Đã đủ',
        color: 'warning' as const
      }

    case 'completed':
      return {
        label: 'Đã hoàn thành',
        color: 'success' as const
      }

    default:
      return {
        label: 'Sắp diễn ra',
        color: 'primary' as const
      }
  }
}

// ======================================================
// COMPONENT
// ======================================================

const ScheduleList = () => {
  const router = useRouter()

  // DATA
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)

  // SEARCH
  const [search, setSearch] = useState('')

  // FILTER
  const [statusFilter, setStatusFilter] = useState('all')

  // SORT
  const [order, setOrder] = useState<Order>('asc')

  const [orderBy, setOrderBy] = useState<OrderBy>('vaccinationDate')

  // PAGINATION
  const [page, setPage] = useState(0)

  const [rowsPerPage, setRowsPerPage] = useState(10)

  // DELETE DIALOG
  const [deleteSchedule, setDeleteSchedule] = useState<Schedule | null>(null)

  // ====================================================
  // CREATE
  // ====================================================

  const handleCreate = () => {
    router.push('/vaccination-schedules/create')
  }

  // ====================================================
  // DETAIL
  // ====================================================

  const handleDetail = (id: number) => {
    router.push(`/vaccination-schedules/${id}`)
  }

  // ====================================================
  // EDIT
  // Route: /vaccination-schedules/edit/1
  // ====================================================

  const handleEdit = (id: number) => {
    router.push(`/vaccination-schedules/edit/${id}`)
  }

  // ====================================================
  // DELETE
  // ====================================================

  const handleOpenDelete = (schedule: Schedule) => {
    setDeleteSchedule(schedule)
  }

  const handleCloseDelete = () => {
    setDeleteSchedule(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteSchedule) return

    // TODO:
    // Khi có API thì gọi API DELETE ở đây.

    setSchedules((prev) =>
      prev.filter((schedule) => schedule.id !== deleteSchedule.id)
    )

    setDeleteSchedule(null)
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
        schedule.vaccine.toLowerCase().includes(keyword) ||
        schedule.medicalStaff.toLowerCase().includes(keyword) ||
        dayjs(schedule.vaccinationDate).format('DD/MM/YYYY').includes(keyword)

      const matchesStatus =
        statusFilter === 'all' || schedule.status === statusFilter

      return matchesSearch && matchesStatus
    })

    return [...filtered].sort((a, b) => {
      let valueA: string | number
      let valueB: string | number

      switch (orderBy) {
        case 'vaccinationDate':
          valueA = dayjs(`${a.vaccinationDate} ${a.vaccinationTime}`).valueOf()

          valueB = dayjs(`${b.vaccinationDate} ${b.vaccinationTime}`).valueOf()

          break

        case 'vaccinationTime':
          valueA = a.vaccinationTime
          valueB = b.vaccinationTime
          break

        case 'vaccine':
          valueA = a.vaccine.toLowerCase()

          valueB = b.vaccine.toLowerCase()

          break

        case 'quantity':
          valueA = a.quantity
          valueB = b.quantity
          break

        case 'registered':
          valueA = a.registered
          valueB = b.registered
          break

        case 'medicalStaff':
          valueA = a.medicalStaff.toLowerCase()

          valueB = b.medicalStaff.toLowerCase()

          break

        default:
          valueA = a.id
          valueB = b.id
      }

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1
      }

      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1
      }

      return 0
    })
  }, [schedules, search, statusFilter, order, orderBy])

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

          height: `calc(
            100vh - ${theme.layout.footerHeight}
          )`,

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
            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

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
                sx={{
                  alignItems: 'center'
                }}
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
            </Box>

            {/* ========================================= */}
            {/* SEARCH + FILTER */}
            {/* ========================================= */}

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
                  placeholder="Tìm vaccine, nhân viên, ngày tiêm..."
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

                <TextField
                  select
                  size="small"
                  label="Trạng thái"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value)

                    setPage(0)
                  }}
                  sx={{
                    width: {
                      xs: '100%',
                      md: 190
                    },

                    bgcolor: '#fff'
                  }}
                >
                  <MenuItem value="all">Tất cả trạng thái</MenuItem>

                  <MenuItem value="upcoming">Sắp diễn ra</MenuItem>

                  <MenuItem value="full">Đã đủ</MenuItem>

                  <MenuItem value="completed">Đã hoàn thành</MenuItem>
                </TextField>
              </Stack>
            </Box>

            {/* ========================================= */}
            {/* TABLE */}
            {/* ========================================= */}

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
                  minWidth: 1250
                }}
              >
                {/* ===================================== */}
                {/* TABLE HEADER */}
                {/* ===================================== */}

                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'vaccinationDate'}
                        direction={
                          orderBy === 'vaccinationDate' ? order : 'asc'
                        }
                        onClick={() => handleSort('vaccinationDate')}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Ngày tiêm
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'vaccinationTime'}
                        direction={
                          orderBy === 'vaccinationTime' ? order : 'asc'
                        }
                        onClick={() => handleSort('vaccinationTime')}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Giờ
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'vaccine'}
                        direction={orderBy === 'vaccine' ? order : 'asc'}
                        onClick={() => handleSort('vaccine')}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Vaccine
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Độ tuổi
                    </TableCell>

                    <TableCell align="center">
                      <TableSortLabel
                        active={orderBy === 'quantity'}
                        direction={orderBy === 'quantity' ? order : 'asc'}
                        onClick={() => handleSort('quantity')}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Số lượng
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell align="center">
                      <TableSortLabel
                        active={orderBy === 'registered'}
                        direction={orderBy === 'registered' ? order : 'asc'}
                        onClick={() => handleSort('registered')}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Đã đăng ký
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'medicalStaff'}
                        direction={orderBy === 'medicalStaff' ? order : 'asc'}
                        onClick={() => handleSort('medicalStaff')}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Nhân viên y tế
                        </Typography>
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 600,

                        whiteSpace: 'nowrap'
                      }}
                    >
                      Trạng thái
                    </TableCell>

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
                  </TableRow>
                </TableHead>

                {/* ===================================== */}
                {/* TABLE BODY */}
                {/* ===================================== */}

                <TableBody>
                  {paginatedSchedules.map((schedule) => {
                    const status = getStatus(schedule.status)

                    const isFull = schedule.registered >= schedule.quantity

                    return (
                      <TableRow
                        key={schedule.id}
                        hover
                        onClick={() => handleDetail(schedule.id)}
                        sx={{
                          cursor: 'pointer'
                        }}
                      >
                        {/* DATE */}

                        <TableCell
                          sx={{
                            fontWeight: 500,

                            whiteSpace: 'nowrap'
                          }}
                        >
                          {dayjs(schedule.vaccinationDate).format('DD/MM/YYYY')}
                        </TableCell>

                        {/* TIME */}

                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {schedule.vaccinationTime}
                        </TableCell>

                        {/* VACCINE */}

                        <TableCell
                          sx={{
                            fontWeight: 500,

                            whiteSpace: 'nowrap'
                          }}
                        >
                          {schedule.vaccine}
                        </TableCell>

                        {/* AGE */}

                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {schedule.age} tuổi
                        </TableCell>

                        {/* QUANTITY */}

                        <TableCell align="center">
                          {schedule.quantity}
                        </TableCell>

                        {/* REGISTERED */}

                        <TableCell align="center">
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 600,

                              color: isFull ? 'warning.main' : 'primary.main'
                            }}
                          >
                            {schedule.registered}/{schedule.quantity}
                          </Typography>
                        </TableCell>

                        {/* MEDICAL STAFF */}

                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {schedule.medicalStaff}
                        </TableCell>

                        {/* STATUS */}

                        <TableCell>
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>

                        {/* ACTION */}

                        {/* ACTION */}

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
                            {/* EDIT */}

                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<EditOutlinedIcon />}
                              onClick={(event) => {
                                event.stopPropagation()

                                handleEdit(schedule.id)
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

                            {/* DETAIL */}

                            <Button
                              size="small"
                              variant="outlined"
                              color="inherit"
                              endIcon={<ChevronRightOutlinedIcon />}
                              onClick={(event) => {
                                event.stopPropagation()

                                handleDetail(schedule.id)
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
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  {/* =================================== */}
                  {/* EMPTY */}
                  {/* =================================== */}

                  {paginatedSchedules.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        align="center"
                        sx={{
                          py: 7
                        }}
                      >
                        <CalendarMonthOutlinedIcon
                          sx={{
                            fontSize: 42,

                            color: 'text.disabled',

                            mb: 1
                          }}
                        />

                        <Typography
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Không tìm thấy lịch tiêm
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5
                          }}
                        >
                          Thử thay đổi từ khóa hoặc bộ lọc.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ========================================= */}
            {/* PAGINATION */}
            {/* ========================================= */}

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
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} / ${count}`
                }
              />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* =============================================== */}
      {/* DELETE CONFIRM DIALOG */}
      {/* =============================================== */}

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

            <Typography
              component="span"
              variant="h6"
              sx={{
                fontWeight: 600
              }}
            >
              Xác nhận xóa
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa lịch tiêm{' '}
            <strong>{deleteSchedule?.vaccine}</strong> ngày{' '}
            <strong>
              {deleteSchedule
                ? dayjs(deleteSchedule.vaccinationDate).format('DD/MM/YYYY')
                : ''}
            </strong>
            ?
          </DialogContentText>

          <Typography
            variant="body2"
            color="error.main"
            sx={{
              mt: 1.5
            }}
          >
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5
          }}
        >
          <Button
            onClick={handleCloseDelete}
            color="inherit"
            sx={{
              textTransform: 'none'
            }}
          >
            Hủy
          </Button>

          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            sx={{
              textTransform: 'none'
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ScheduleList
