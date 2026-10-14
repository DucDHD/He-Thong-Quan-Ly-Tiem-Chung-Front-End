'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import {
  getAllInventoryAPI,
  type InventoryItem
} from '@/services/inventory.type'

import { formatDate } from '@/utils/format'

type StockStatus = 'available' | 'out'

type SortKey =
  | 'vaccine_name'
  | 'vaccine_type'
  | 'license_number'
  | 'expiry_date'
  | 'vaccination_age'
  | 'quantity'

type Order = 'asc' | 'desc'

const getStatus = (item: InventoryItem): StockStatus =>
  Number(item.quantity) > 0 ? 'available' : 'out'

const sortColumns: {
  key: SortKey
  label: string
  width?: string
}[] = [
  { key: 'vaccine_name', label: 'Tên vaccine', width: '23%' },
  { key: 'vaccine_type', label: 'Loại vaccine', width: '17%' },
  { key: 'license_number', label: 'Giấy phép', width: '16%' },
  { key: 'expiry_date', label: 'Hạn sử dụng', width: '15%' },
  { key: 'vaccination_age', label: 'Độ tuổi', width: '17%' }
]

const InventoryList = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // =========================
  // DATA
  // =========================

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =========================
  // SEARCH + SORT
  // =========================

  const [search, setSearch] = useState('')
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<SortKey>('vaccine_name')

  // =========================
  // PAGINATION - GIỐNG USER
  // =========================

  const pageFromUrl = Number(searchParams.get('page') || '1')

  const [page, setPage] = useState(
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl - 1 : 0
  )

  const [rowsPerPage, setRowsPerPage] = useState(5)

  // =========================
  // GET INVENTORY
  // =========================

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAllInventoryAPI()

        if (active) {
          setInventoryData(data)
        }
      } catch (err) {
        console.error('Lỗi tải tồn kho:', err)

        if (active) {
          setError('Không thể tải danh sách vaccine trong kho.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi-VN')

    return inventoryData
      .filter((item) => {
        const matchSearch =
          !keyword ||
          [
            item.vaccine_name,
            item.vaccine_type,
            item.license_number,
            item.lot_code,
            item.vaccination_age
          ].some((value) =>
            String(value ?? '')
              .toLocaleLowerCase('vi-VN')
              .includes(keyword)
          )

        return matchSearch
      })
      .sort((a, b) => {
        const left = a[orderBy]
        const right = b[orderBy]

        const comparison =
          orderBy === 'quantity'
            ? Number(left) - Number(right)
            : String(left ?? '').localeCompare(String(right ?? ''), 'vi', {
                numeric: true
              })

        return order === 'asc' ? comparison : -comparison
      })
  }, [inventoryData, search, order, orderBy])

  // =========================
  // PAGINATED DATA
  // =========================

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage

    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

  // =========================
  // CHANGE PAGE
  // =========================

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)

    router.replace(`/inventory?page=${newPage + 1}`, {
      scroll: false
    })
  }

  // =========================
  // CHANGE ROWS PER PAGE
  // =========================

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value))
    setPage(0)

    router.replace('/inventory?page=1', {
      scroll: false
    })
  }

  // =========================
  // SORT
  // =========================

  const handleSort = (property: SortKey) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)

    router.replace('/inventory?page=1', {
      scroll: false
    })
  }

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(0)

    router.replace('/inventory?page=1', {
      scroll: false
    })
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
          px: 3,
          py: 2,
          boxSizing: 'border-box'
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2.5,
            boxShadow: 'none',
            overflow: 'hidden'
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
                  Quản lý kho vaccine
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Theo dõi số lượng và tình trạng vaccine trong kho
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddOutlinedIcon />}
                onClick={() => router.push('/inventory/import')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Nhập vaccine
              </Button>

              <Button
                variant="contained"
                startIcon={<FileDownloadOutlinedIcon />}
                onClick={() => router.push('/inventory/export')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Xuất vaccine
              </Button>
            </Box>
          </Box>

          {/* SEARCH */}
          <Box
            sx={{
              px: 2.5,
              py: 1.25,
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap'
            }}
          >
            <TextField
              size="small"
              value={search}
              placeholder="Tìm tên vaccine, loại, giấy phép, mã lô..."
              sx={{ width: 380 }}
              onChange={handleSearch}
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
                sx={{
                  fontWeight: 700,
                  color: 'text.primary'
                }}
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
          <Box
            sx={{
              px: 2.5,
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <TableContainer
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
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
                  width: '100%',
                  minWidth: 850,
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

                    <TableCell sx={{ width: '12%' }}>Trạng thái</TableCell>

                    <TableCell align="center" sx={{ width: 110 }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item) => {
                      const status = getStatus(item)

                      return (
                        <TableRow key={item.inventory_id} hover>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              overflowWrap: 'anywhere'
                            }}
                          >
                            {item.vaccine_name || '—'}
                          </TableCell>

                          <TableCell
                            sx={{
                              overflowWrap: 'anywhere'
                            }}
                          >
                            {item.vaccine_type || '—'}
                          </TableCell>

                          <TableCell
                            sx={{
                              overflowWrap: 'anywhere'
                            }}
                          >
                            {item.license_number || '—'}
                          </TableCell>

                          <TableCell
                            sx={{
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {formatDate(item.expiry_date)}
                          </TableCell>

                          <TableCell
                            sx={{
                              overflowWrap: 'anywhere'
                            }}
                          >
                            {item.vaccination_age || '—'}
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              variant="outlined"
                              color={
                                status === 'available' ? 'success' : 'error'
                              }
                              label={
                                status === 'available' ? 'Còn hàng' : 'Hết hàng'
                              }
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityOutlinedIcon />}
                              onClick={() =>
                                router.push(
                                  `/inventory/detail/${item.inventory_id}?currentPage=${page + 1}`
                                )
                              }
                              sx={{
                                textTransform: 'none',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
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
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
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
              borderColor: 'divider'
            }}
          >
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
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
                '& .MuiTablePagination-selectLabel': {
                  mb: 0
                },
                '& .MuiTablePagination-displayedRows': {
                  mb: 0
                }
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default InventoryList
