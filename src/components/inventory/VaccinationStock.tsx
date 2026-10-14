'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  Box,
  Button,
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
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material'

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import {
  getAllVaccinationStocksAPI,
  type VaccinationStockItem
} from '@/services/inventory.type'

import { formatDate } from '@/utils/format'

type SortKey =
  | 'vaccine_name'
  | 'vaccine_type'
  | 'lot_code'
  | 'expiry_date'
  | 'quantity'
  | 'unit_price'

type Order = 'asc' | 'desc'

const sortColumns: {
  key: SortKey
  label: string
  width: string
}[] = [
  { key: 'vaccine_name', label: 'Tên vaccine', width: '24%' },
  { key: 'vaccine_type', label: 'Loại vaccine', width: '17%' },
  { key: 'lot_code', label: 'Mã lô', width: '13%' },
  { key: 'expiry_date', label: 'Hạn sử dụng', width: '15%' },
  { key: 'quantity', label: 'Số lượng tồn', width: '15%' }
]

const VaccinationStockList = () => {
  const router = useRouter()

  const [stockData, setStockData] = useState<VaccinationStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<SortKey>('vaccine_name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAllVaccinationStocksAPI()

        if (active) setStockData(data)
      } catch (err) {
        console.error('Lỗi tải stock:', err)

        if (active) {
          setError('Không thể tải danh sách tồn kho tiêm chủng.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi-VN')

    return stockData
      .filter(
        (item) =>
          !keyword ||
          [item.vaccine_name, item.vaccine_type, item.lot_code].some((value) =>
            String(value ?? '')
              .toLocaleLowerCase('vi-VN')
              .includes(keyword)
          )
      )
      .sort((a, b) => {
        let comparison = 0

        if (orderBy === 'quantity' || orderBy === 'unit_price') {
          comparison = Number(a[orderBy]) - Number(b[orderBy])
        } else if (orderBy === 'expiry_date') {
          comparison =
            new Date(a.expiry_date).getTime() -
            new Date(b.expiry_date).getTime()
        } else {
          comparison = String(a[orderBy] ?? '').localeCompare(
            String(b[orderBy] ?? ''),
            'vi',
            { numeric: true }
          )
        }

        return order === 'asc' ? comparison : -comparison
      })
  }, [stockData, search, order, orderBy])

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  )

  const handleSort = (property: SortKey) => {
    setOrder(orderBy === property && order === 'asc' ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

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
          px: 3,
          py: 2,
          boxSizing: 'border-box'
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2.5,
            boxShadow: 'none',
            overflow: 'hidden',
            minHeight: 550
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              px: 2.5,
              py: 1.75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: '#fff'
                }}
              >
                <Inventory2OutlinedIcon />
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Danh sách tồn kho tiêm chủng
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Theo dõi số lượng vaccine tại khu vực tiêm chủng
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* SEARCH */}
          <Box
            sx={{
              px: 2.5,
              py: 1.25,
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <TextField
              size="small"
              value={search}
              placeholder="Tìm tên vaccine, loại vaccine, mã lô..."
              sx={{ width: 380, maxWidth: '100%' }}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(0)
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

          {/* TOTAL */}
          <Box sx={{ px: 2.5, py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tìm thấy{' '}
              <Box
                component="span"
                sx={{ fontWeight: 700, color: 'text.primary' }}
              >
                {filteredData.length}
              </Box>{' '}
              lô vaccine
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mx: 2.5, mb: 1 }}>
              {error}
            </Alert>
          )}

          {/* TABLE */}
          <Box sx={{ px: 2.5, flex: 1, minHeight: 0 }}>
            <TableContainer
              sx={{
                overflowX: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <Table
                stickyHeader
                size="small"
                sx={{
                  minWidth: 1050,
                  tableLayout: 'fixed',
                  '& .MuiTableCell-root': {
                    px: 1.25,
                    py: 1.5,
                    fontSize: '0.82rem'
                  },
                  '& .MuiTableCell-head': {
                    fontWeight: 700,
                    bgcolor: '#f8fafc'
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    {sortColumns.map((col) => (
                      <TableCell key={col.key} sx={{ width: col.width }}>
                        <TableSortLabel
                          active={orderBy === col.key}
                          direction={orderBy === col.key ? order : 'asc'}
                          onClick={() => handleSort(col.key)}
                        >
                          {col.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}

                    <TableCell sx={{ width: '16%' }}>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length ? (
                    paginatedData.map((item) => (
                      <TableRow key={item.stock_id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {item.vaccine_name || '—'}
                        </TableCell>

                        <TableCell>{item.vaccine_type || '—'}</TableCell>

                        <TableCell>{item.lot_code}</TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {formatDate(item.expiry_date)}
                        </TableCell>

                        <TableCell>
                          {Number(item.quantity).toLocaleString('vi-VN')}
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            variant="outlined"
                            color={
                              Number(item.quantity) > 0 ? 'success' : 'error'
                            }
                            label={
                              Number(item.quantity) > 0
                                ? 'Còn hàng'
                                : 'Hết hàng'
                            }
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Inventory2OutlinedIcon
                          sx={{
                            fontSize: 42,
                            color: 'text.disabled',
                            mb: 1
                          }}
                        />

                        <Typography sx={{ fontWeight: 600 }}>
                          Không tìm thấy vaccine
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Thử thay đổi từ khóa tìm kiếm.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* PAGINATION */}
          <Box
            sx={{
              flexShrink: 0,
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 2
            }}
          >
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={(_event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10))
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
              sx={{
                '& .MuiTablePagination-toolbar': {
                  minHeight: 50
                },
                '& .MuiTablePagination-selectLabel': { mb: 0 },
                '& .MuiTablePagination-displayedRows': { mb: 0 }
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default VaccinationStockList
