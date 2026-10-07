'use client'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
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
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import { useEffect, useMemo, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { toast } from 'react-toastify'

import {
  activeVaccineAPI,
  getVaccinesAPI,
  type Vaccine
} from '@/services/vaccine.service'

type Order = 'asc' | 'desc'

type OrderBy =
  | 'vaccine_name'
  | 'vaccine_type'
  | 'manufacturer'
  | 'country'
  | 'vaccination_age'
  | 'price'

const VaccineList = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [vaccines, setVaccines] = useState<Vaccine[]>([])

  const [search, setSearch] = useState('')

  const [order, setOrder] = useState<Order>('asc')

  const [orderBy, setOrderBy] = useState<OrderBy>('vaccine_name')

  const [deleteVaccine, setDeleteVaccine] = useState<Vaccine | null>(null)

  const [deleteLoading, setDeleteLoading] = useState(false)

  const pageFromUrl = Number(searchParams.get('page') || '1')

  const [page, setPage] = useState(Math.max(pageFromUrl - 1, 0))

  const [rowsPerPage, setRowsPerPage] = useState(5)

  // =========================
  // GET VACCINES
  // =========================

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const data = await getVaccinesAPI()

        if (isMounted) {
          setVaccines(data)
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách vaccine:', error)
      }
    }

    void fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  // =========================
  // DELETE DIALOG
  // =========================

  const handleOpenDeleteConfirm = (vaccine: Vaccine) => {
    setDeleteVaccine(vaccine)
  }

  const handleCloseDeleteConfirm = () => {
    if (deleteLoading) return

    setDeleteVaccine(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteVaccine) return

    try {
      setDeleteLoading(true)

      await activeVaccineAPI(deleteVaccine.vaccine_id, false)

      setVaccines((prev) =>
        prev.filter(
          (vaccine) => vaccine.vaccine_id !== deleteVaccine.vaccine_id
        )
      )

      setDeleteVaccine(null)
      toast.success('Xóa vaccine thành công')
    } catch {
      toast.error('Xóa vaccine thất bại')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')

    setOrderBy(property)
    setPage(0)
  }

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredVaccines = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = vaccines.filter((vaccine) => {
      return (
        !keyword ||
        vaccine.vaccine_name.toLowerCase().includes(keyword) ||
        vaccine.vaccine_type.toLowerCase().includes(keyword) ||
        vaccine.manufacturer.toLowerCase().includes(keyword) ||
        (vaccine.country?.toLowerCase().includes(keyword) ?? false) ||
        (vaccine.license_number?.toLowerCase().includes(keyword) ?? false)
      )
    })

    return [...filtered].sort((a, b) => {
      let valueA: string | number = ''

      let valueB: string | number = ''

      switch (orderBy) {
        case 'vaccine_name':
          valueA = a.vaccine_name.toLowerCase()

          valueB = b.vaccine_name.toLowerCase()

          break

        case 'vaccine_type':
          valueA = a.vaccine_type.toLowerCase()

          valueB = b.vaccine_type.toLowerCase()

          break

        case 'manufacturer':
          valueA = a.manufacturer.toLowerCase()

          valueB = b.manufacturer.toLowerCase()

          break

        case 'country':
          valueA = a.country?.toLowerCase() || ''

          valueB = b.country?.toLowerCase() || ''

          break

        case 'vaccination_age':
          valueA = a.vaccination_age?.toLowerCase() || ''

          valueB = b.vaccination_age?.toLowerCase() || ''

          break

        case 'price':
          valueA = a.price ?? 0
          valueB = b.price ?? 0

          break
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return order === 'asc' ? valueA - valueB : valueB - valueA
      }

      const result = String(valueA).localeCompare(String(valueB), 'vi')

      return order === 'asc' ? result : -result
    })
  }, [vaccines, search, order, orderBy])

  // =========================
  // PAGINATION
  // =========================

  const paginatedVaccines = useMemo(() => {
    const start = page * rowsPerPage

    return filteredVaccines.slice(start, start + rowsPerPage)
  }, [filteredVaccines, page, rowsPerPage])

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)

    router.replace(`/vaccines?page=${newPage + 1}`)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value))

    setPage(0)

    router.replace('/vaccines?page=1')
  }

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price: number | null) => {
    if (price === null) {
      return '-'
    }

    return `${new Intl.NumberFormat('vi-VN').format(price)} đ`
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
          {/* ========================= */}
          {/* HEADER */}
          {/* ========================= */}

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
                  justifyContent: 'center'
                }}
              >
                <VaccinesOutlinedIcon />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.3
                  }}
                >
                  Danh sách Vaccine
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Quản lý thông tin vaccine sử dụng trong hệ thống
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => router.push('/vaccines/create')}
              sx={{
                height: 42,
                px: 2.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Thêm Vaccine
            </Button>
          </Box>

          {/* ========================= */}
          {/* TOOLBAR */}
          {/* ========================= */}

          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: 'flex',
              alignItems: {
                xs: 'stretch',
                md: 'center'
              },
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                md: 'row'
              },
              gap: 1.5,
              bgcolor: '#fafbfc',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
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
              placeholder="Tìm tên, loại, nhà sản xuất..."
              sx={{
                width: {
                  xs: '100%',
                  sm: 320
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
          </Box>

          {/* ========================= */}
          {/* TABLE */}
          {/* ========================= */}

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
                minWidth: 1200
              }}
            >
              <TableHead>
                <TableRow>
                  {/* STT */}

                  <TableCell
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    STT
                  </TableCell>

                  {/* NAME */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'vaccine_name'}
                      direction={orderBy === 'vaccine_name' ? order : 'asc'}
                      onClick={() => handleSort('vaccine_name')}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Tên Vaccine
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* TYPE */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'vaccine_type'}
                      direction={orderBy === 'vaccine_type' ? order : 'asc'}
                      onClick={() => handleSort('vaccine_type')}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Loại Vaccine
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* MANUFACTURER */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'manufacturer'}
                      direction={orderBy === 'manufacturer' ? order : 'asc'}
                      onClick={() => handleSort('manufacturer')}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Nhà sản xuất
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* COUNTRY */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'country'}
                      direction={orderBy === 'country' ? order : 'asc'}
                      onClick={() => handleSort('country')}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Nước SX
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* AGE */}

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'vaccination_age'}
                      direction={orderBy === 'vaccination_age' ? order : 'asc'}
                      onClick={() => handleSort('vaccination_age')}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Độ tuổi
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  {/* PRICE */}

                  <TableCell>
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

                  {/* ACTION */}

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
                {paginatedVaccines.map((vaccine, index) => (
                  <TableRow key={vaccine.vaccine_id} hover>
                    {/* STT */}

                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                    {/* NAME */}

                    <TableCell
                      sx={{
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {vaccine.vaccine_name}
                    </TableCell>

                    {/* TYPE */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {vaccine.vaccine_type}
                    </TableCell>

                    {/* MANUFACTURER */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {vaccine.manufacturer}
                    </TableCell>

                    {/* COUNTRY */}

                    <TableCell>{vaccine.country || '-'}</TableCell>

                    {/* AGE */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {vaccine.vaccination_age || '-'}
                    </TableCell>

                    {/* PRICE */}

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatPrice(vaccine.price)}
                    </TableCell>

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
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityOutlinedIcon />}
                          onClick={() => {
                            router.push(
                              `/vaccines/detail/${vaccine.vaccine_id}?currentPage=${page + 1}`
                            )
                          }}
                          sx={{
                            whiteSpace: 'nowrap',
                            textTransform: 'none',
                            color: 'text.secondary',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'text.secondary',
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          Xem
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() =>
                            router.push(
                              `/vaccines/edit/${vaccine.vaccine_id}?currentPage=${page + 1}`
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
                          onClick={() => handleOpenDeleteConfirm(vaccine)}
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

                {/* EMPTY */}

                {paginatedVaccines.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{
                        py: 7
                      }}
                    >
                      <VaccinesOutlinedIcon
                        sx={{
                          fontSize: 44,
                          color: 'text.disabled',
                          mb: 1
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Không tìm thấy vaccine
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Không có dữ liệu phù hợp với điều kiện tìm kiếm.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ========================= */}
          {/* PAGINATION */}
          {/* ========================= */}

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
              count={filteredVaccines.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={() => {
                const totalPages = Math.max(
                  1,
                  Math.ceil(filteredVaccines.length / rowsPerPage)
                )

                return `Trang ${page + 1} / ${totalPages}`
              }}
            />
          </Box>

          {/* ========================= */}
          {/* DELETE CONFIRM */}
          {/* ========================= */}

          <Dialog
            open={Boolean(deleteVaccine)}
            onClose={handleCloseDeleteConfirm}
            maxWidth="xs"
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2.5,
                  maxWidth: 420,
                  m: 2,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.16)'
                }
              }
            }}
          >
            <DialogContent
              sx={{
                p: 3
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  mb: 1
                }}
              >
                Xóa Vaccine?
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'text.secondary'
                }}
              >
                Vaccine{' '}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  {deleteVaccine?.vaccine_name}
                </Box>{' '}
                sẽ không còn hiển thị trong danh sách sau khi xóa.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                  mt: 3
                }}
              >
                <Button
                  onClick={handleCloseDeleteConfirm}
                  disabled={deleteLoading}
                  variant="outlined"
                  color="inherit"
                  sx={{
                    height: 38,
                    px: 2.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Hủy
                </Button>

                <Button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  variant="contained"
                  color="error"
                  sx={{
                    height: 38,
                    px: 2.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none'
                    }
                  }}
                >
                  {deleteLoading ? 'Đang xử lý...' : 'Xóa'}
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Paper>
      </Box>
    </Box>
  )
}

export default VaccineList
