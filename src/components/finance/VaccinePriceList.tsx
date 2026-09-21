'use client'

import {
  Box,
  Button,
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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

type VaccinePrice = {
  id: number
  vaccineCode: string
  vaccineName: string
  unit: string
  price: number
  updatedAt: string
}

type Order = 'asc' | 'desc'

type OrderBy = 'vaccineCode' | 'vaccineName' | 'unit' | 'price' | 'updatedAt'

const initialData: VaccinePrice[] = [
  {
    id: 1,
    vaccineCode: 'VAC001',
    vaccineName: 'Cúm mùa',
    unit: 'Liều',
    price: 350000,
    updatedAt: '18/09/2026'
  },
  {
    id: 2,
    vaccineCode: 'VAC002',
    vaccineName: 'Viêm gan B',
    unit: 'Liều',
    price: 280000,
    updatedAt: '17/09/2026'
  },
  {
    id: 3,
    vaccineCode: 'VAC003',
    vaccineName: 'HPV',
    unit: 'Liều',
    price: 1500000,
    updatedAt: '15/09/2026'
  },
  {
    id: 4,
    vaccineCode: 'VAC004',
    vaccineName: 'Phế cầu',
    unit: 'Liều',
    price: 950000,
    updatedAt: '12/09/2026'
  },
  {
    id: 5,
    vaccineCode: 'VAC005',
    vaccineName: 'Thủy đậu',
    unit: 'Liều',
    price: 750000,
    updatedAt: '10/09/2026'
  }
]

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`

const VaccinePriceList = () => {
  const router = useRouter()

  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<OrderBy>('vaccineName')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = data.filter(
      (item) =>
        !keyword ||
        item.vaccineCode.toLowerCase().includes(keyword) ||
        item.vaccineName.toLowerCase().includes(keyword)
    )

    return [...filtered].sort((a, b) => {
      let result = 0

      if (orderBy === 'price') {
        result = a.price - b.price
      } else {
        result = String(a[orderBy]).localeCompare(String(b[orderBy]), 'vi')
      }

      return order === 'asc' ? result : -result
    })
  }, [data, search, order, orderBy])

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage

    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

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
              alignItems: {
                xs: 'flex-start',
                sm: 'center'
              },
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
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
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <PaymentsOutlinedIcon />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600
                  }}
                >
                  Quản lý giá vaccine
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Quản lý và cập nhật giá các loại vaccine
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => router.push('/finance/vaccine-prices/create')}
              sx={{
                height: 42,
                px: 2.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              Thêm mới
            </Button>
          </Box>

          {/* SEARCH */}

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
              placeholder="Tìm mã hoặc tên vaccine..."
              sx={{
                width: {
                  xs: '100%',
                  sm: 350
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
              {filteredData.length} vaccine
            </Typography>
          </Box>

          {/* TABLE */}

          <TableContainer
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto'
            }}
          >
            <Table
              stickyHeader
              sx={{
                minWidth: 950
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: 70,
                      fontWeight: 600
                    }}
                  >
                    STT
                  </TableCell>

                  <TableCell
                    sx={{
                      minWidth: 140
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === 'vaccineCode'}
                      direction={orderBy === 'vaccineCode' ? order : 'asc'}
                      onClick={() => handleSort('vaccineCode')}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Mã vaccine
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    sx={{
                      minWidth: 200
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === 'vaccineName'}
                      direction={orderBy === 'vaccineName' ? order : 'asc'}
                      onClick={() => handleSort('vaccineName')}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Tên vaccine
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    sx={{
                      width: 120,
                      fontWeight: 600
                    }}
                  >
                    Đơn vị
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      width: 180
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === 'price'}
                      direction={orderBy === 'price' ? order : 'asc'}
                      onClick={() => handleSort('price')}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Giá
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    sx={{
                      width: 160,
                      fontWeight: 600
                    }}
                  >
                    Ngày cập nhật
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      width: 200,
                      fontWeight: 600
                    }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      '&:last-child td': {
                        borderBottom: 0
                      }
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                    <TableCell>{item.vaccineCode}</TableCell>

                    <TableCell>{item.vaccineName}</TableCell>

                    <TableCell>{item.unit}</TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatPrice(item.price)}
                    </TableCell>

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.updatedAt}
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() =>
                            router.push(
                              `/finance/vaccine-prices/edit/${item.id}`
                            )
                          }
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
                          onClick={() => handleDelete(item.id)}
                          sx={{
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                          }}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
                        Không tìm thấy vaccine
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Không có dữ liệu phù hợp
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
              count={filteredData.length}
              page={page}
              onPageChange={(_event, newPage) => setPage(newPage)}
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

export default VaccinePriceList
