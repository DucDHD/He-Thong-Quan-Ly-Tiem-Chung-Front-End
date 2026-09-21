'use client'

import {
  Box,
  Chip,
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

import { useMemo, useState } from 'react'

type TransactionStatus = 'paid' | 'pending'

type CustomerTransaction = {
  id: number
  date: string
  invoiceCode: string
  vaccineCode: string
  vaccineName: string
  quantity: number
  customerName: string
  unitPrice: number
  totalAmount: number
  status: TransactionStatus
}

const transactions: CustomerTransaction[] = [
  {
    id: 1,
    date: '18/09/2026',
    invoiceCode: 'HD0001',
    vaccineCode: 'VAC001',
    vaccineName: 'Cúm mùa',
    quantity: 1,
    customerName: 'Nguyễn Văn An',
    unitPrice: 350000,
    totalAmount: 350000,
    status: 'paid'
  },
  {
    id: 2,
    date: '17/09/2026',
    invoiceCode: 'HD0002',
    vaccineCode: 'VAC003',
    vaccineName: 'HPV',
    quantity: 1,
    customerName: 'Trần Thị Lan',
    unitPrice: 1500000,
    totalAmount: 1500000,
    status: 'paid'
  },
  {
    id: 3,
    date: '16/09/2026',
    invoiceCode: 'HD0003',
    vaccineCode: 'VAC004',
    vaccineName: 'Phế cầu',
    quantity: 2,
    customerName: 'Lê Minh Hùng',
    unitPrice: 950000,
    totalAmount: 1900000,
    status: 'pending'
  }
]

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`

const CustomerTransactionList = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // ======================================================
  // FILTER
  // ======================================================

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return transactions.filter(
      (item) =>
        !keyword ||
        item.invoiceCode.toLowerCase().includes(keyword) ||
        item.customerName.toLowerCase().includes(keyword) ||
        item.vaccineCode.toLowerCase().includes(keyword) ||
        item.vaccineName.toLowerCase().includes(keyword)
    )
  }, [search])

  // ======================================================
  // PAGINATION
  // ======================================================

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage

    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

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
      {/* ================================================== */}
      {/* CONTENT WRAPPER */}
      {/* ================================================== */}

      <Box
        sx={{
          width: '100%',
          height: '100%',

          p: 3,

          // QUAN TRỌNG:
          // padding không làm tăng chiều cao của Box
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
          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <Box
            sx={{
              px: 2.5,
              py: 2,

              display: 'flex',
              alignItems: 'center',

              gap: 1.5,

              // Không cho Header bị co lại
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
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600
                }}
              >
                Giao dịch khách hàng
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Theo dõi các giao dịch tiêm chủng của khách hàng
              </Typography>
            </Box>
          </Box>

          {/* ================================================== */}
          {/* TOOLBAR */}
          {/* ================================================== */}

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

              // Không cho toolbar bị co
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
                width: {
                  xs: '100%',
                  sm: 380
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
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: 'nowrap'
              }}
            >
              {filteredData.length} giao dịch
            </Typography>
          </Box>

          {/* ================================================== */}
          {/* TABLE */}
          {/* ================================================== */}

          <TableContainer
            sx={{
              // Table chiếm toàn bộ khoảng trống còn lại
              flex: 1,

              // QUAN TRỌNG với flex
              minHeight: 0,

              // Chỉ table scroll
              overflow: 'auto'
            }}
          >
            <Table
              stickyHeader
              sx={{
                minWidth: 1250
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    'STT',
                    'Ngày',
                    'Mã hóa đơn',
                    'Mã vaccine',
                    'Vaccine',
                    'Số lượng',
                    'Khách hàng',
                    'Đơn giá',
                    'Thành tiền',
                    'Trạng thái'
                  ].map((label) => (
                    <TableCell
                      key={label}
                      align={
                        label === 'Đơn giá' || label === 'Thành tiền'
                          ? 'right'
                          : label === 'Số lượng' || label === 'Trạng thái'
                            ? 'center'
                            : 'left'
                      }
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow key={item.id} hover>
                    {/* STT */}

                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                    {/* NGÀY */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.date}
                    </TableCell>

                    {/* MÃ HÓA ĐƠN */}

                    <TableCell
                      sx={{
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.invoiceCode}
                    </TableCell>

                    {/* MÃ VACCINE */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.vaccineCode}
                    </TableCell>

                    {/* VACCINE */}

                    <TableCell>{item.vaccineName}</TableCell>

                    {/* SỐ LƯỢNG */}

                    <TableCell align="center">{item.quantity}</TableCell>

                    {/* KHÁCH HÀNG */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.customerName}
                    </TableCell>

                    {/* ĐƠN GIÁ */}

                    <TableCell
                      align="right"
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatPrice(item.unitPrice)}
                    </TableCell>

                    {/* THÀNH TIỀN */}

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatPrice(item.totalAmount)}
                    </TableCell>

                    {/* TRẠNG THÁI */}

                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={
                          item.status === 'paid'
                            ? 'Đã thanh toán'
                            : 'Chờ thanh toán'
                        }
                        color={item.status === 'paid' ? 'success' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {/* EMPTY */}

                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      align="center"
                      sx={{
                        py: 6
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Không tìm thấy giao dịch
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5
                        }}
                      >
                        Không có dữ liệu phù hợp với từ khóa tìm kiếm
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ================================================== */}
          {/* PAGINATION */}
          {/* ================================================== */}

          <Box
            sx={{
              // Không để Pagination bị table đẩy xuống
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

export default CustomerTransactionList
