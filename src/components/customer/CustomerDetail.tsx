'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography
} from '@mui/material'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined'

import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { getUserById, type User } from '@/services/user.service'

import { getVaccinationHistoryAPI } from '@/services/vaccination-booking.service'

import { formatCccd, formatPhone } from '@/utils/format'

// =========================
// TYPES
// =========================

type CustomerDetailProps = {
  userId: string
}

type CellProps = {
  children: ReactNode
}

type VaccinationHistoryApi = {
  booking_id: number
  vaccination_date: string
  vaccine_name: string
  location_name: string
  location_address: string
  dose_number: number | null
  vaccinator_name: string | null
  status: 'REGISTERED' | 'COMPLETED'
}

type Vaccination = {
  id: number
  date: string
  time: string
  timestamp: number
  location: string
  address: string
  vaccine: string
  dose: string
  medicalStaff: string
  status: 'completed' | 'upcoming'
}

type SortField =
  'date' | 'time' | 'location' | 'vaccine' | 'dose' | 'medicalStaff' | 'status'

type SortOrder = 'asc' | 'desc'

type HistoryHeaderProps = {
  label: string
  field: SortField
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

// =========================
// HELPERS
// =========================

const mapVaccinationHistory = (
  response: VaccinationHistoryApi[]
): Vaccination[] => {
  return response.map((item) => {
    const vaccinationDate = new Date(item.vaccination_date)
    const validDate = !Number.isNaN(vaccinationDate.getTime())

    return {
      id: item.booking_id,
      date: validDate ? vaccinationDate.toLocaleDateString('vi-VN') : '-',
      time: validDate
        ? vaccinationDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })
        : '-',
      timestamp: validDate ? vaccinationDate.getTime() : 0,
      location: item.location_name || '-',
      address: item.location_address || '-',
      vaccine: item.vaccine_name || '-',
      dose: item.dose_number != null ? `Mũi ${item.dose_number}` : '-',
      medicalStaff: item.vaccinator_name || '-',
      status: item.status === 'COMPLETED' ? 'completed' : 'upcoming'
    }
  })
}

// =========================
// COMPONENT
// =========================

const CustomerDetail = ({ userId }: CustomerDetailProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Trang danh sách trước khi vào chi tiết.
  const pageParam = Number(searchParams.get('currentPage') || '1')

  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  // =========================
  // CUSTOMER STATE
  // =========================

  const [customer, setCustomer] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [customerError, setCustomerError] = useState('')

  // =========================
  // HISTORY STATE
  // =========================

  const [showHistory, setShowHistory] = useState(false)

  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')

  const [loadedHistoryUserId, setLoadedHistoryUserId] = useState<number | null>(
    null
  )

  // =========================
  // HISTORY PAGINATION + SORT
  // =========================

  const [page, setPage] = useState(0)
  const rowsPerPage = 5

  const [sortField, setSortField] = useState<SortField>('date')

  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // =========================
  // GET CUSTOMER DETAIL
  // =========================

  useEffect(() => {
    let active = true

    const fetchCustomer = async () => {
      try {
        setLoading(true)
        setCustomerError('')

        const id = Number(userId)

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error('Mã khách hàng không hợp lệ')
        }

        const data = await getUserById(id)

        if (active) {
          setCustomer(data)
        }
      } catch (error) {
        console.error('Lỗi lấy chi tiết khách hàng:', error)

        if (active) {
          setCustomer(null)
          setCustomerError('Không thể tải thông tin khách hàng')
          toast.error('Không thể tải thông tin khách hàng')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void fetchCustomer()

    return () => {
      active = false
    }
  }, [userId])

  // =========================
  // GET VACCINATION HISTORY
  // =========================

  useEffect(() => {
    if (!showHistory || !customer?.user_id) return

    const customerId = customer.user_id

    if (loadedHistoryUserId === customerId) return

    let active = true

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true)
        setHistoryError('')

        const response: VaccinationHistoryApi[] =
          await getVaccinationHistoryAPI(customerId)

        if (active) {
          setVaccinations(mapVaccinationHistory(response))

          setLoadedHistoryUserId(customerId)
          setPage(0)
        }
      } catch (error) {
        console.error('Lỗi lấy lịch sử tiêm chủng:', error)

        if (active) {
          setVaccinations([])
          setHistoryError('Không thể tải lịch sử tiêm chủng')
        }
      } finally {
        if (active) {
          setHistoryLoading(false)
        }
      }
    }

    void fetchHistory()

    return () => {
      active = false
    }
  }, [showHistory, customer?.user_id, loadedHistoryUserId])

  // =========================
  // BACK
  // =========================

  const handleBack = () => {
    router.push(`/customer?page=${currentPage}`)
  }

  // =========================
  // EDIT
  // =========================

  const handleEdit = () => {
    router.push(
      `/customer/edit/${userId}?currentPage=${currentPage}&from=detail`
    )
  }

  // =========================
  // TOGGLE HISTORY
  // =========================

  const handleToggleHistory = () => {
    setShowHistory((prev) => !prev)
  }

  // =========================
  // SORT HISTORY
  // =========================

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }

    setPage(0)
  }

  const sortedVaccinations = useMemo(() => {
    return [...vaccinations].sort((a, b) => {
      if (sortField === 'date' || sortField === 'time') {
        const result = a.timestamp - b.timestamp

        return sortOrder === 'asc' ? result : -result
      }

      const valueA = String(a[sortField] ?? '')
      const valueB = String(b[sortField] ?? '')

      return sortOrder === 'asc'
        ? valueA.localeCompare(valueB, 'vi', {
            numeric: true
          })
        : valueB.localeCompare(valueA, 'vi', {
            numeric: true
          })
    })
  }, [vaccinations, sortField, sortOrder])

  const totalHistoryPages = Math.max(
    1,
    Math.ceil(sortedVaccinations.length / rowsPerPage)
  )

  const historyPage = Math.min(page, totalHistoryPages - 1)

  const paginatedVaccinations = useMemo(() => {
    const start = historyPage * rowsPerPage

    return sortedVaccinations.slice(start, start + rowsPerPage)
  }, [sortedVaccinations, historyPage])

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Box
        component="main"
        sx={(theme) => ({
          ml: theme.layout.sidebarWidth,
          pt: theme.layout.headerHeight,
          minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
          bgcolor: '#f5f7fb',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })}
      >
        <CircularProgress size={32} />
      </Box>
    )
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!customer) {
    return (
      <Box
        component="main"
        sx={(theme) => ({
          ml: theme.layout.sidebarWidth,
          pt: theme.layout.headerHeight,
          minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
          bgcolor: '#f5f7fb',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600
            }}
          >
            {customerError || 'Không tìm thấy khách hàng'}
          </Typography>

          <Button
            onClick={handleBack}
            sx={{
              mt: 1,
              textTransform: 'none'
            }}
          >
            Quay lại danh sách
          </Button>
        </Box>
      </Box>
    )
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
        minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
        bgcolor: '#f5f7fb',
        boxSizing: 'border-box'
      })}
    >
      <Box
        sx={{
          width: '100%',
          p: 3,
          boxSizing: 'border-box'
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            bgcolor: '#fff',
            borderRadius: 2.5,
            boxShadow: 'none',
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <IconButton
              onClick={handleBack}
              sx={{
                width: 42,
                height: 42,
                flexShrink: 0,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff'
              }}
            >
              <ArrowBackOutlinedIcon />
            </IconButton>

            <Box
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                display: {
                  xs: 'none',
                  sm: 'flex'
                },
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#fff'
              }}
            >
              <PersonOutlineOutlinedIcon />
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 0
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.25
                }}
              >
                Chi tiết khách hàng
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mt: 0.25
                }}
              >
                Thông tin tài khoản khách hàng
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={handleEdit}
              sx={{
                height: 40,
                px: 2.25,
                flexShrink: 0,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }}
            >
              Chỉnh sửa
            </Button>
          </Box>

          <Divider />

          {/* CONTENT */}
          <Box sx={{ p: 3 }}>
            {/* SUMMARY */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: {
                  xs: 2,
                  md: 4
                },
                px: 2.5,
                py: 2,
                bgcolor: '#f8fafc',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3
                }}
              >
                <Box
                  sx={{
                    minWidth: {
                      xs: '100%',
                      sm: 220
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 0.4
                    }}
                  >
                    Ngày tạo
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {customer.createdAt
                      ? dayjs(customer.createdAt).format('DD/MM/YYYY - HH:mm')
                      : '-'}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 160 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 0.4
                    }}
                  >
                    Cập nhật lần cuối
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {customer.updatedAt
                      ? dayjs(customer.updatedAt).format('DD/MM/YYYY - HH:mm')
                      : '-'}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  minWidth: 220,
                  flex: 1
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'text.primary'
                  }}
                >
                  Trạng thái:
                </Typography>

                <Chip
                  label={
                    customer.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'
                  }
                  color={customer.isActive ? 'success' : 'default'}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 12,
                    fontWeight: 500
                  }}
                />
              </Box>
            </Box>

            {/* DETAIL TABLE */}
            <Box
              sx={{
                mt: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.75,
                  bgcolor: '#f8fafc',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'text.primary'
                  }}
                >
                  Thông tin chi tiết
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: 12.5,
                    color: 'text.secondary'
                  }}
                >
                  Thông tin cá nhân và tài khoản khách hàng
                </Typography>
              </Box>

              <TableContainer>
                <Table
                  sx={{
                    width: '100%',
                    tableLayout: 'fixed'
                  }}
                >
                  <TableBody>
                    <TableRow>
                      <LabelCell>Họ và tên</LabelCell>
                      <ValueCell>{customer.fullName || '-'}</ValueCell>

                      <LabelCell>Email</LabelCell>
                      <ValueCell>{customer.email || '-'}</ValueCell>
                    </TableRow>

                    <TableRow>
                      <LabelCell>Số điện thoại</LabelCell>
                      <ValueCell>{formatPhone(customer.phone)}</ValueCell>

                      <LabelCell>CCCD</LabelCell>
                      <ValueCell>{formatCccd(customer.cccd)}</ValueCell>
                    </TableRow>

                    <TableRow>
                      <LabelCell>Ngày sinh</LabelCell>
                      <ValueCell>
                        {customer.dateOfBirth
                          ? dayjs(customer.dateOfBirth).format('DD/MM/YYYY')
                          : '-'}
                      </ValueCell>

                      <LabelCell>Giới tính</LabelCell>
                      <ValueCell>{customer.gender || '-'}</ValueCell>
                    </TableRow>

                    <TableRow>
                      <LabelCell>Địa chỉ</LabelCell>
                      <ValueCell>{customer.address || '-'}</ValueCell>

                      <LabelCell>Vai trò</LabelCell>
                      <ValueCell>{customer.role?.role_name || '-'}</ValueCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* VACCINATION HISTORY */}
            <Box
              sx={{
                mt: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              {/* HISTORY HEADER */}
              <Box
                sx={{
                  px: 2.5,
                  py: 1.75,
                  bgcolor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  borderBottom: showHistory ? '1px solid' : 'none',
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: 0
                  }}
                >
                  <VaccinesOutlinedIcon
                    sx={{
                      color: 'primary.main',
                      fontSize: 22,
                      flexShrink: 0
                    }}
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'text.primary'
                      }}
                    >
                      Lịch sử tiêm chủng
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: 12.5,
                        color: 'text.secondary'
                      }}
                    >
                      Thông tin các lần đăng ký và tiêm chủng của khách hàng
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleToggleHistory}
                  aria-expanded={showHistory}
                  endIcon={
                    showHistory ? (
                      <KeyboardArrowUpOutlinedIcon />
                    ) : (
                      <KeyboardArrowDownOutlinedIcon />
                    )
                  }
                  sx={{
                    flexShrink: 0,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 1.5,
                    px: 2,
                    height: 36
                  }}
                >
                  {showHistory ? 'Thu gọn' : 'Xem thêm'}
                </Button>
              </Box>

              {/* COLLAPSE CONTENT */}
              <Collapse in={showHistory} timeout="auto" unmountOnExit>
                {historyError && (
                  <Box sx={{ px: 2.5, pt: 2 }}>
                    <Alert severity="error">{historyError}</Alert>
                  </Box>
                )}

                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table
                    size="small"
                    sx={{
                      minWidth: 1000,
                      '& .MuiTableCell-root': {
                        px: 1.5
                      }
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            bgcolor: '#fff',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          STT
                        </TableCell>

                        <HistoryHeader
                          label="Ngày"
                          field="date"
                          sortField={sortField}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                        />

                        <HistoryHeader
                          label="Giờ"
                          field="time"
                          sortField={sortField}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                        />

                        <HistoryHeader
                          label="Địa điểm"
                          field="location"
                          sortField={sortField}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                        />

                        <HistoryHeader
                          label="Vắc xin"
                          field="vaccine"
                          sortField={sortField}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                        />

                        <HistoryHeader
                          label="Liều"
                          field="dose"
                          sortField={sortField}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                        />

                        <HistoryHeader
                          label="Người tiêm"
                          field="medicalStaff"
                          sortField={sortField}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                        />

                        <HistoryHeader
                          label="Trạng thái"
                          field="status"
                          sortField={sortField}
                          sortOrder={sortOrder}
                          onSort={handleSort}
                        />
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {historyLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                            <CircularProgress size={26} />

                            <Typography
                              sx={{
                                mt: 1,
                                fontSize: 13,
                                color: 'text.secondary'
                              }}
                            >
                              Đang tải lịch sử tiêm chủng...
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : paginatedVaccinations.length > 0 ? (
                        paginatedVaccinations.map((item, index) => (
                          <TableRow
                            key={item.id}
                            hover
                            sx={{
                              '& td': {
                                py: 1.1,
                                fontSize: 13
                              }
                            }}
                          >
                            <TableCell>
                              {historyPage * rowsPerPage + index + 1}
                            </TableCell>

                            <TableCell
                              sx={{
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.date}
                            </TableCell>

                            <TableCell
                              sx={{
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.time}
                            </TableCell>

                            <TableCell sx={{ minWidth: 200 }}>
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600
                                }}
                              >
                                {item.location}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.25,
                                  fontSize: 12,
                                  color: 'text.secondary'
                                }}
                              >
                                {item.address}
                              </Typography>
                            </TableCell>

                            <TableCell
                              sx={{
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.vaccine}
                            </TableCell>

                            <TableCell
                              sx={{
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.dose}
                            </TableCell>

                            <TableCell
                              sx={{
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.medicalStaff}
                            </TableCell>

                            <TableCell>
                              <Chip
                                size="small"
                                label={
                                  item.status === 'completed'
                                    ? 'Đã tiêm'
                                    : 'Sắp tiêm'
                                }
                                color={
                                  item.status === 'completed'
                                    ? 'success'
                                    : 'primary'
                                }
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            align="center"
                            sx={{
                              py: 5,
                              color: 'text.secondary'
                            }}
                          >
                            Chưa có lịch sử tiêm chủng
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* HISTORY PAGINATION */}
                <Box
                  sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <TablePagination
                    component="div"
                    count={sortedVaccinations.length}
                    page={historyPage}
                    onPageChange={(_event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5]}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    labelDisplayedRows={() =>
                      `Trang ${historyPage + 1} / ${totalHistoryPages}`
                    }
                  />
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

// =========================
// LABEL CELL
// =========================

const LabelCell = ({ children }: CellProps) => {
  return (
    <TableCell
      sx={{
        width: '15%',
        px: 2.5,
        py: 1.8,
        fontSize: 13,
        fontWeight: 700,
        color: 'text.primary',
        bgcolor: '#fff',
        verticalAlign: 'middle',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      {children}
    </TableCell>
  )
}

// =========================
// VALUE CELL
// =========================

const ValueCell = ({ children }: CellProps) => {
  return (
    <TableCell
      sx={{
        width: '35%',
        px: 2.5,
        py: 1.8,
        fontSize: 14,
        fontWeight: 500,
        color: 'text.primary',
        bgcolor: '#fff',
        verticalAlign: 'middle',
        borderBottom: '1px solid',
        borderColor: 'divider',
        wordBreak: 'break-word'
      }}
    >
      {children || '-'}
    </TableCell>
  )
}

// =========================
// HISTORY HEADER
// =========================

const HistoryHeader = ({
  label,
  field,
  sortField,
  sortOrder,
  onSort
}: HistoryHeaderProps) => {
  return (
    <TableCell
      sx={{
        fontWeight: 700,
        bgcolor: '#fff',
        whiteSpace: 'nowrap'
      }}
    >
      <TableSortLabel
        active={sortField === field}
        direction={sortField === field ? sortOrder : 'asc'}
        onClick={() => onSort(field)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  )
}

export default CustomerDetail
