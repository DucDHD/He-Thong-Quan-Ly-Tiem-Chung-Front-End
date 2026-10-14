'use client'

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

import { useEffect, useMemo, useState } from 'react'
import { TableSortLabel } from '@mui/material'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'

import {
  getCustomerTransactionsAPI,
  confirmPaymentAPI,
  type CustomerTransaction
} from '@/services/finance.service'
import { formatDate } from '@/utils/format'

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`

type SortField =
  | 'vaccination_date'
  | 'invoice_code'
  | 'vaccine_name'
  | 'quantity'
  | 'fullName'
  | 'unit_price'
  | 'total_amount'
  | 'status'

const CustomerTransactionList = () => {
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orderBy, setOrderBy] = useState<SortField>('vaccination_date')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [confirmInvoiceId, setConfirmInvoiceId] = useState<number | null>(null)
  const [payingId, setPayingId] = useState<number | null>(null)

  const handleSort = (field: SortField) => {
    const isAsc = orderBy === field && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(field)
    setPage(0)
  }

  // LẤY DỮ LIỆU TỪ API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getCustomerTransactionsAPI()
        setTransactions(data)
      } catch {
        setError('Không thể tải danh sách giao dịch')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleConfirmPayment = async () => {
    if (confirmInvoiceId === null || payingId !== null) return

    const invoiceId = confirmInvoiceId

    try {
      setPayingId(invoiceId)

      // Gọi API cập nhật trạng thái thanh toán
      await confirmPaymentAPI(invoiceId)

      // Cập nhật dữ liệu trên bảng sau khi API thành công
      setTransactions((prev) =>
        prev.map((item) =>
          item.invoice_id === invoiceId ? { ...item, status: 'PAID' } : item
        )
      )
      toast.success(' đã thanh toán thành công')
      // Đóng Dialog khi thành công
      setConfirmInvoiceId(null)
    } catch {
      toast.error('Xác nhận thanh toán thất bại:')
    } finally {
      setPayingId(null)
    }
  }

  // TÌM KIẾM
  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return transactions.filter(
      (item) =>
        !keyword ||
        item.invoice_code.toLowerCase().includes(keyword) ||
        item.fullName.toLowerCase().includes(keyword) ||
        item.vaccine_name.toLowerCase().includes(keyword)
    )
  }, [transactions, search])

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const getValue = (item: CustomerTransaction) =>
        orderBy === 'total_amount'
          ? item.quantity * Number(item.unit_price)
          : item[orderBy]

      const aValue = getValue(a)
      const bValue = getValue(b)

      const result =
        typeof aValue === 'number' && typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue), 'vi', {
              numeric: true
            })

      return order === 'asc' ? result : -result
    })
  }, [filteredData, orderBy, order])

  // PHÂN TRANG
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage
    return sortedData.slice(start, start + rowsPerPage)
  }, [sortedData, page, rowsPerPage])

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
              alignItems: 'center',
              gap: 1.5,
              flexShrink: 0
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
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <PointOfSaleOutlinedIcon />
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Giao dịch khách hàng
              </Typography>
            </Box>
          </Box>

          {/* TOOLBAR */}
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              bgcolor: '#fafbfc',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexShrink: 0
            }}
          >
            <TextField
              size="small"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(0)
              }}
              placeholder="Tìm hóa đơn, khách hàng, vaccine..."
              sx={{
                width: { xs: '100%', sm: 380 },
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

          {/* THÔNG BÁO LỖI */}
          {error && (
            <Alert severity="error" sx={{ mx: 2.5, mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* TABLE */}
          <TableContainer
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto'
            }}
          >
            <Table stickyHeader sx={{ minWidth: 1100 }}>
              <TableHead>
                <TableRow>
                  {[
                    { label: 'STT', field: null },
                    { label: 'Ngày tiêm', field: 'vaccination_date' },
                    { label: 'Mã hóa đơn', field: 'invoice_code' },
                    { label: 'Vaccine', field: 'vaccine_name' },
                    { label: 'Số lượng', field: 'quantity' },
                    { label: 'Khách hàng', field: 'fullName' },
                    { label: 'Đơn giá', field: 'unit_price' },
                    { label: 'Trạng thái', field: 'status' }
                  ].map((column) => (
                    <TableCell
                      key={column.label}
                      align={
                        ['Đơn giá', 'Thành tiền'].includes(column.label)
                          ? 'right'
                          : ['Số lượng', 'Trạng thái'].includes(column.label)
                            ? 'center'
                            : 'left'
                      }
                      sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      {column.field ? (
                        <TableSortLabel
                          active={orderBy === column.field}
                          direction={orderBy === column.field ? order : 'asc'}
                          onClick={() => handleSort(column.field as SortField)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                      >
                        Đang tải dữ liệu...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {paginatedData.map((item, index) => (
                      <TableRow key={item.invoice_id} hover>
                        {/* STT */}
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                        {/* NGÀY TIÊM */}
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {formatDate(item.vaccination_date)}
                        </TableCell>

                        {/* MÃ HÓA ĐƠN */}
                        <TableCell
                          sx={{
                            fontWeight: 500,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.invoice_code}
                        </TableCell>

                        {/* VACCINE */}
                        <TableCell>{item.vaccine_name}</TableCell>

                        {/* SỐ LƯỢNG */}
                        <TableCell align="center">{item.quantity}</TableCell>

                        {/* KHÁCH HÀNG */}
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {item.fullName}
                        </TableCell>

                        {/* ĐƠN GIÁ */}
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          {formatPrice(Number(item.unit_price))}
                        </TableCell>
                        {/* TRẠNG THÁI */}
                        {/* TRẠNG THÁI */}
                        <TableCell align="center">
                          {item.status === 'PAID' ? (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              disabled
                              sx={{
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                fontWeight: 600,
                                width: 150,
                                height: 32,
                                '&.Mui-disabled': {
                                  bgcolor: '#2E7D32',
                                  color: '#FFFFFF',
                                  opacity: 1
                                }
                              }}
                            >
                              Đã thanh toán
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              disabled={payingId !== null}
                              onClick={() =>
                                setConfirmInvoiceId(item.invoice_id)
                              }
                              sx={{
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                fontWeight: 600,
                                width: 150,
                                height: 32
                              }}
                            >
                              Thanh toán
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* EMPTY */}
                    {paginatedData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                          <Typography sx={{ fontWeight: 600 }}>
                            Không tìm thấy giao dịch
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            Không có dữ liệu phù hợp với từ khóa tìm kiếm
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
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
              count={filteredData.length}
              page={page}
              onPageChange={(_event, newPage) => {
                setPage(newPage)
              }}
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
                  Math.ceil(filteredData.length / rowsPerPage)
                )

                return `Trang ${page + 1} / ${totalPages}`
              }}
            />
          </Box>
        </Paper>
        <Dialog
          open={confirmInvoiceId !== null}
          onClose={() => {
            if (payingId === null) {
              setConfirmInvoiceId(null)
            }
          }}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Xác nhận thanh toán
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              xác nhận thanh toán cho hóa đơn này
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              color="inherit"
              disabled={payingId !== null}
              onClick={() => setConfirmInvoiceId(null)}
            >
              Hủy
            </Button>

            <Button
              variant="contained"
              color="success"
              disabled={payingId !== null}
              onClick={handleConfirmPayment}
            >
              {payingId !== null ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default CustomerTransactionList
