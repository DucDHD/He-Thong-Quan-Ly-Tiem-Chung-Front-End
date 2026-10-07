'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'

import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
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
  Typography
} from '@mui/material'

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import { getVaccinationHistoryAPI } from '@/services/vaccination-booking.service'
import axios from 'axios'

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
  location: string
  address: string
  vaccine: string
  dose: string
  medicalStaff: string
  status: 'completed' | 'upcoming'
}

type Order = 'asc' | 'desc'

type OrderBy =
  'date' | 'time' | 'location' | 'vaccine' | 'dose' | 'medicalStaff' | 'status'

type VaccinationHistoryDialogProps = {
  open: boolean
  onClose: () => void
  userId: number
}

const VaccinationHistoryDialog = ({
  open,
  onClose,
  userId
}: VaccinationHistoryDialogProps) => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])

  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(0)

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [order, setOrder] = useState<Order>('desc')

  const [orderBy, setOrderBy] = useState<OrderBy>('date')

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open || !userId) return

    const fetchVaccinationHistory = async () => {
      try {
        setLoading(true)

        const response = await getVaccinationHistoryAPI(userId)

        const data: Vaccination[] = response.map((item) => {
          const vaccinationDate = new Date(item.vaccination_date)

          const date = vaccinationDate.toLocaleDateString('vi-VN')

          const time = vaccinationDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })

          return {
            id: item.booking_id,
            date,
            time,
            location: item.location_name || '-',
            address: item.location_address || '-',
            vaccine: item.vaccine_name || '-',
            dose: item.dose_number !== null ? `Mũi ${item.dose_number}` : '-',
            medicalStaff: item.vaccinator_name || '-',
            status: item.status === 'COMPLETED' ? 'completed' : 'upcoming'
          }
        })

        setVaccinations(data)
        setPage(0)
      } catch (error) {
        console.error('Lỗi lấy lịch sử tiêm chủng:', error)
        setVaccinations([])
      } finally {
        setLoading(false)
      }
    }

    fetchVaccinationHistory()
  }, [open, userId])

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(0)
  }

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  const filteredVaccinations = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return vaccinations
    }

    return vaccinations.filter((item) => {
      const statusLabel = item.status === 'completed' ? 'đã tiêm' : 'sắp tiêm'

      return [
        item.date,
        item.time,
        item.location,
        item.address,
        item.vaccine,
        item.dose,
        item.medicalStaff,
        statusLabel
      ].some((value) => value.toLowerCase().includes(keyword))
    })
  }, [vaccinations, search])

  const sortedVaccinations = useMemo(() => {
    return [...filteredVaccinations].sort((a, b) => {
      let valueA = ''
      let valueB = ''

      if (orderBy === 'date') {
        const [dayA, monthA, yearA] = a.date.split('/')
        const [dayB, monthB, yearB] = b.date.split('/')

        valueA = `${yearA}-${monthA}-${dayA}`
        valueB = `${yearB}-${monthB}-${dayB}`
      } else {
        valueA = String(a[orderBy] ?? '').toLowerCase()
        valueB = String(b[orderBy] ?? '').toLowerCase()
      }

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1
      }

      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1
      }

      return 0
    })
  }, [filteredVaccinations, order, orderBy])

  const paginatedVaccinations = sortedVaccinations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleCloseHistory = () => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseHistory}
      fullWidth
      maxWidth="xl"
      slotProps={{
        paper: {
          sx: {
            width: '95vw',
            maxWidth: '1400px',
            height: '85vh',
            maxHeight: '85vh',
            borderRadius: 2
          }
        }
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25
            }}
          >
            <VaccinesOutlinedIcon color="primary" />

            <Box>
              <Typography
                component="div"
                sx={{
                  fontSize: '18px',
                  fontWeight: 700
                }}
              >
                Hồ sơ tiêm chủng
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Lịch sử các mũi đã tiêm và lịch tiêm sắp tới
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={handleCloseHistory} aria-label="Đóng">
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}
      >
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'flex-start'
          }}
        >
          <TextField
            value={search}
            onChange={handleSearch}
            placeholder="Tìm kiếm..."
            size="small"
            sx={{
              width: {
                xs: '100%',
                sm: 350
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Box>

        <Paper
          variant="outlined"
          sx={{
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            flex: 1
          }}
        >
          <TableContainer
            sx={{
              flex: 1,
              overflow: 'auto'
            }}
          >
            <Table
              stickyHeader
              sx={{
                minWidth: 1100
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      bgcolor: '#f8fafc'
                    }}
                  >
                    STT
                  </TableCell>

                  <SortableHeader
                    label="Ngày"
                    property="date"
                    order={order}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Giờ"
                    property="time"
                    order={order}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Địa điểm"
                    property="location"
                    order={order}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Vắc xin"
                    property="vaccine"
                    order={order}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Liều"
                    property="dose"
                    order={order}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Người tiêm"
                    property="medicalStaff"
                    order={order}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Trạng thái"
                    property="status"
                    order={order}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={30} />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1.5 }}
                      >
                        Đang tải lịch sử tiêm chủng...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedVaccinations.length > 0 ? (
                  paginatedVaccinations.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

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

                      <TableCell
                        sx={{
                          minWidth: 230
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          {item.location}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mt: 0.25
                          }}
                        >
                          {item.address}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.vaccine}
                        </Typography>
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
                            item.status === 'completed' ? 'Đã tiêm' : 'Sắp tiêm'
                          }
                          color={
                            item.status === 'completed' ? 'success' : 'primary'
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
                      {search
                        ? 'Không tìm thấy dữ liệu phù hợp'
                        : 'Chưa có thông tin tiêm chủng'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <TablePagination
            component="div"
            count={sortedVaccinations.length}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={() => {
              const totalPages = Math.max(
                1,
                Math.ceil(sortedVaccinations.length / rowsPerPage)
              )

              return `Trang ${page + 1} / ${totalPages}`
            }}
          />
        </Paper>
      </DialogContent>
    </Dialog>
  )
}

type SortableHeaderProps = {
  label: string
  property: OrderBy
  order: Order
  orderBy: OrderBy
  onSort: (property: OrderBy) => void
}

const SortableHeader = ({
  label,
  property,
  order,
  orderBy,
  onSort
}: SortableHeaderProps) => {
  return (
    <TableCell
      sx={{
        fontWeight: 700,
        whiteSpace: 'nowrap',
        bgcolor: '#f8fafc'
      }}
    >
      <TableSortLabel
        active={orderBy === property}
        direction={orderBy === property ? order : 'asc'}
        onClick={() => onSort(property)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  )
}

export default VaccinationHistoryDialog
