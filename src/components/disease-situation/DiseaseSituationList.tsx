'use client'

import { ChangeEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  MenuItem,
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

import type { ChipProps } from '@mui/material/Chip'

// ======================================================
// TYPES
// ======================================================

type DiseaseStatus = 'monitoring' | 'outbreak' | 'controlled'

type DiseaseSituation = {
  id: number
  reportDate: string
  province: string
  district: string
  ward: string
  diseaseName: string
  reportedCases: number
  transmission: string
  healthEffect: string
  vaccineName: string
  status: DiseaseStatus
  note: string
}

type Order = 'asc' | 'desc'

type OrderBy =
  'reportDate' | 'diseaseName' | 'location' | 'reportedCases' | 'status'

// ======================================================
// SORTABLE HEADER
// ======================================================

type SortableHeaderProps = {
  label: string
  property: OrderBy
  order: Order
  orderBy: OrderBy
  align?: 'left' | 'center' | 'right'
  onSort: (property: OrderBy) => void
}

const SortableHeader = ({
  label,
  property,
  order,
  orderBy,
  align = 'left',
  onSort
}: SortableHeaderProps) => {
  return (
    <TableCell
      align={align}
      sx={{
        fontWeight: 700,
        whiteSpace: 'nowrap'
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

// ======================================================
// DETAIL ITEM
// ======================================================

type DetailItemProps = {
  label: string
  value?: string | number
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          mb: 0.5
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: '#172b3a'
        }}
      >
        {value || '-'}
      </Typography>
    </Box>
  )
}

// ======================================================
// MOCK DATA
// Sau này thay bằng API
// ======================================================

const initialDiseaseSituations: DiseaseSituation[] = [
  {
    id: 1,
    reportDate: '18/09/2026',
    province: 'Đà Nẵng',
    district: 'Hải Châu',
    ward: 'Hải Châu',
    diseaseName: 'Sốt xuất huyết',
    reportedCases: 25,
    transmission: 'Muỗi Aedes truyền bệnh',
    healthEffect:
      'Có thể gây sốt cao, đau đầu, đau cơ và biến chứng xuất huyết.',
    vaccineName: 'Vắc xin phòng sốt xuất huyết',
    status: 'monitoring',
    note: 'Tiếp tục theo dõi tình hình tại địa phương.'
  },
  {
    id: 2,
    reportDate: '17/09/2026',
    province: 'Đà Nẵng',
    district: 'Sơn Trà',
    ward: 'An Hải',
    diseaseName: 'Cúm mùa',
    reportedCases: 18,
    transmission: 'Đường hô hấp',
    healthEffect:
      'Gây sốt, ho, đau họng, mệt mỏi và có thể gây biến chứng hô hấp.',
    vaccineName: 'Vắc xin cúm',
    status: 'monitoring',
    note: ''
  },
  {
    id: 3,
    reportDate: '15/09/2026',
    province: 'Đà Nẵng',
    district: 'Ngũ Hành Sơn',
    ward: 'Mỹ An',
    diseaseName: 'Thủy đậu',
    reportedCases: 12,
    transmission: 'Đường hô hấp hoặc tiếp xúc trực tiếp với dịch tiết',
    healthEffect: 'Gây sốt, phát ban dạng phỏng nước và có thể gây biến chứng.',
    vaccineName: 'Vắc xin thủy đậu',
    status: 'controlled',
    note: 'Tình hình đã được kiểm soát.'
  },
  {
    id: 4,
    reportDate: '12/09/2026',
    province: 'Đà Nẵng',
    district: 'Cẩm Lệ',
    ward: 'Hòa Xuân',
    diseaseName: 'Tay chân miệng',
    reportedCases: 20,
    transmission: 'Đường tiêu hóa và tiếp xúc với dịch tiết của người bệnh',
    healthEffect: 'Gây sốt, loét miệng, tổn thương da ở tay và chân.',
    vaccineName: 'Chưa có',
    status: 'monitoring',
    note: 'Tăng cường vệ sinh cá nhân và môi trường.'
  },
  {
    id: 5,
    reportDate: '10/09/2026',
    province: 'Đà Nẵng',
    district: 'Liên Chiểu',
    ward: 'Hòa Khánh',
    diseaseName: 'Sởi',
    reportedCases: 8,
    transmission: 'Đường hô hấp',
    healthEffect: 'Gây sốt, phát ban và có thể gây biến chứng viêm phổi.',
    vaccineName: 'Vắc xin sởi',
    status: 'controlled',
    note: ''
  },
  {
    id: 6,
    reportDate: '08/09/2026',
    province: 'Đà Nẵng',
    district: 'Thanh Khê',
    ward: 'Thanh Khê',
    diseaseName: 'Cúm mùa',
    reportedCases: 15,
    transmission: 'Đường hô hấp',
    healthEffect: 'Gây sốt, ho, đau họng, đau cơ và mệt mỏi.',
    vaccineName: 'Vắc xin cúm',
    status: 'controlled',
    note: ''
  }
]

// ======================================================
// HELPERS
// ======================================================

const getLocation = (item: DiseaseSituation) => {
  return `${item.ward}, ${item.district}, ${item.province}`
}

const convertDate = (date: string) => {
  const [day, month, year] = date.split('/')

  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

const getStatusLabel = (status: DiseaseStatus): string => {
  switch (status) {
    case 'outbreak':
      return 'Có dịch'

    case 'monitoring':
      return 'Đang theo dõi'

    case 'controlled':
      return 'Đã kiểm soát'

    default:
      return ''
  }
}

const getStatusColor = (status: DiseaseStatus): ChipProps['color'] => {
  switch (status) {
    case 'outbreak':
      return 'error'

    case 'monitoring':
      return 'warning'

    case 'controlled':
      return 'success'

    default:
      return 'default'
  }
}

// ======================================================
// COMPONENT
// ======================================================

const DiseaseSituationList = () => {
  const router = useRouter()

  // =========================
  // DATA
  // =========================

  const [diseaseSituations, setDiseaseSituations] = useState<
    DiseaseSituation[]
  >(initialDiseaseSituations)

  // =========================
  // SEARCH + FILTER
  // =========================

  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('all')
  const [disease, setDisease] = useState('all')

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // =========================
  // SORT
  // =========================

  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<OrderBy>('reportDate')

  // =========================
  // DETAIL
  // =========================

  const [detailOpen, setDetailOpen] = useState(false)

  const [selectedDisease, setSelectedDisease] =
    useState<DiseaseSituation | null>(null)

  // =========================
  // DELETE
  // =========================

  const [deleteOpen, setDeleteOpen] = useState(false)

  const [selectedDelete, setSelectedDelete] = useState<DiseaseSituation | null>(
    null
  )

  const [isDeleting, setIsDeleting] = useState(false)

  // =========================
  // FILTER OPTIONS
  // =========================

  const districtOptions = useMemo(() => {
    return [...new Set(diseaseSituations.map((item) => item.district))]
  }, [diseaseSituations])

  const diseaseOptions = useMemo(() => {
    return [...new Set(diseaseSituations.map((item) => item.diseaseName))]
  }, [diseaseSituations])

  // =========================
  // FILTER DATA
  // =========================

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return diseaseSituations.filter((item) => {
      const location = getLocation(item).toLowerCase()

      const matchSearch =
        !keyword ||
        item.diseaseName.toLowerCase().includes(keyword) ||
        location.includes(keyword) ||
        item.vaccineName.toLowerCase().includes(keyword)

      const matchDistrict = district === 'all' || item.district === district

      const matchDisease = disease === 'all' || item.diseaseName === disease

      return matchSearch && matchDistrict && matchDisease
    })
  }, [diseaseSituations, search, district, disease])

  // =========================
  // SORT DATA
  // =========================

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valueA: string | number
      let valueB: string | number

      switch (orderBy) {
        case 'reportDate':
          valueA = convertDate(a.reportDate)
          valueB = convertDate(b.reportDate)
          break

        case 'diseaseName':
          valueA = a.diseaseName.toLowerCase()
          valueB = b.diseaseName.toLowerCase()
          break

        case 'location':
          valueA = getLocation(a).toLowerCase()
          valueB = getLocation(b).toLowerCase()
          break

        case 'reportedCases':
          valueA = a.reportedCases
          valueB = b.reportedCases
          break

        case 'status':
          valueA = getStatusLabel(a.status)
          valueB = getStatusLabel(b.status)
          break

        default:
          valueA = ''
          valueB = ''
      }

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1
      }

      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1
      }

      return 0
    })
  }, [filteredData, order, orderBy])

  // =========================
  // PAGINATION
  // =========================

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // =========================
  // SORT
  // =========================

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  // =========================
  // SEARCH
  // =========================

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(0)
  }

  // =========================
  // PAGINATION
  // =========================

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  // =========================
  // CREATE
  // =========================

  const handleCreate = () => {
    router.push('/disease-situation/create')
  }

  // =========================
  // DETAIL
  // =========================

  const handleOpenDetail = (item: DiseaseSituation) => {
    setSelectedDisease(item)
    setDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
  }

  // =========================
  // EDIT
  // =========================

  const handleEdit = (id: number) => {
    router.push(`/disease-situation/edit/${id}`)
  }

  // =========================
  // DELETE
  // =========================

  const handleOpenDelete = (item: DiseaseSituation) => {
    setSelectedDelete(item)
    setDeleteOpen(true)
  }

  const handleCloseDelete = () => {
    if (isDeleting) return

    setDeleteOpen(false)
    setSelectedDelete(null)
  }

  const handleDelete = async () => {
    if (!selectedDelete) return

    try {
      setIsDeleting(true)

      const deletedId = selectedDelete.id

      // ==========================================
      // TODO: DELETE API
      //
      // await fetch(
      //   `/api/disease-situations/${deletedId}`,
      //   {
      //     method: 'DELETE'
      //   }
      // )
      // ==========================================

      await new Promise((resolve) => {
        setTimeout(resolve, 500)
      })

      // MOCK DELETE
      setDiseaseSituations((prev) =>
        prev.filter((item) => item.id !== deletedId)
      )

      setDeleteOpen(false)
      setSelectedDelete(null)

      // Nếu xóa dòng cuối cùng của trang hiện tại
      // thì quay về trang trước
      const remainingItems = sortedData.length - 1

      const lastPage = Math.max(0, Math.ceil(remainingItems / rowsPerPage) - 1)

      if (page > lastPage) {
        setPage(lastPage)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
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
            {/* ==================================================
                HEADER
            ================================================== */}

            <Box
              sx={{
                px: 3,
                py: 2.5,
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
                gap: 2
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
                    flexShrink: 0,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CoronavirusOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#172b3a'
                    }}
                  >
                    Tình hình dịch bệnh tại địa phương
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Quản lý và tra cứu thông tin dịch bệnh tại địa phương
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleCreate}
                sx={{
                  textTransform: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                Thêm mới
              </Button>
            </Box>

            <Divider />

            {/* ==================================================
                SEARCH + FILTER
            ================================================== */}

            <Box
              sx={{
                p: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'minmax(280px, 1fr) 240px 240px'
                },
                gap: 2
              }}
            >
              <TextField
                value={search}
                onChange={handleSearchChange}
                placeholder="Tìm theo tên bệnh, địa phương, vắc xin..."
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <TextField
                select
                label="Địa phương"
                value={district}
                onChange={(event) => {
                  setDistrict(event.target.value)
                  setPage(0)
                }}
                size="small"
                fullWidth
              >
                <MenuItem value="all">Tất cả địa phương</MenuItem>

                {districtOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Loại bệnh"
                value={disease}
                onChange={(event) => {
                  setDisease(event.target.value)
                  setPage(0)
                }}
                size="small"
                fullWidth
              >
                <MenuItem value="all">Tất cả bệnh</MenuItem>

                {diseaseOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* ==================================================
                TABLE
            ================================================== */}

            <Box
              sx={{
                px: 3,
                pb: 3
              }}
            >
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  boxShadow: 'none',
                  overflowX: 'auto'
                }}
              >
                <Table
                  sx={{
                    minWidth: 1250
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: '#f8fafc'
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 700,
                          width: 70,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        STT
                      </TableCell>

                      <SortableHeader
                        label="Ngày cập nhật"
                        property="reportDate"
                        order={order}
                        orderBy={orderBy}
                        onSort={handleSort}
                      />

                      <SortableHeader
                        label="Địa phương"
                        property="location"
                        order={order}
                        orderBy={orderBy}
                        onSort={handleSort}
                      />

                      <SortableHeader
                        label="Loại bệnh"
                        property="diseaseName"
                        order={order}
                        orderBy={orderBy}
                        onSort={handleSort}
                      />

                      <SortableHeader
                        label="Số ca"
                        property="reportedCases"
                        order={order}
                        orderBy={orderBy}
                        onSort={handleSort}
                        align="center"
                      />

                      <TableCell
                        sx={{
                          fontWeight: 700,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Vắc xin phòng bệnh
                      </TableCell>

                      <SortableHeader
                        label="Trạng thái"
                        property="status"
                        order={order}
                        orderBy={orderBy}
                        onSort={handleSort}
                        align="center"
                      />

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 700,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item, index) => (
                        <TableRow key={item.id} hover>
                          {/* STT */}

                          <TableCell align="center">
                            {page * rowsPerPage + index + 1}
                          </TableCell>

                          {/* DATE */}

                          <TableCell
                            sx={{
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.reportDate}
                          </TableCell>

                          {/* LOCATION */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500
                              }}
                            >
                              {item.ward}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.district}, {item.province}
                            </Typography>
                          </TableCell>

                          {/* DISEASE */}

                          <TableCell
                            sx={{
                              fontWeight: 600
                            }}
                          >
                            {item.diseaseName}
                          </TableCell>

                          {/* CASES */}

                          <TableCell align="center">
                            {item.reportedCases}
                          </TableCell>

                          {/* VACCINE */}

                          <TableCell>{item.vaccineName}</TableCell>

                          {/* STATUS */}

                          <TableCell align="center">
                            <Chip
                              size="small"
                              variant="outlined"
                              label={getStatusLabel(item.status)}
                              color={getStatusColor(item.status)}
                            />
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
                                color="secondary"
                                startIcon={<VisibilityOutlinedIcon />}
                                onClick={() => handleOpenDetail(item)}
                                sx={{
                                  whiteSpace: 'nowrap',
                                  textTransform: 'none'
                                }}
                              >
                                Chi tiết
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<EditOutlinedIcon />}
                                onClick={() => handleEdit(item.id)}
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
                                startIcon={<DeleteOutlineRoundedIcon />}
                                onClick={() => handleOpenDelete(item)}
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          align="center"
                          sx={{
                            py: 6,
                            color: 'text.secondary'
                          }}
                        >
                          Không tìm thấy thông tin dịch bệnh
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* PAGINATION */}

                <TablePagination
                  component="div"
                  count={sortedData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 20]}
                  labelRowsPerPage="Số dòng:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} / ${count}`
                  }
                />
              </TableContainer>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* ==================================================
          DETAIL DIALOG
      ================================================== */}

      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: '#172b3a'
          }}
        >
          Chi tiết tình hình dịch bệnh
        </DialogTitle>

        <Divider />

        <DialogContent>
          {selectedDisease && (
            <Box
              sx={{
                pt: 1,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))'
                },
                columnGap: 4,
                rowGap: 3
              }}
            >
              <DetailItem
                label="Thời điểm khảo sát"
                value={selectedDisease.reportDate}
              />

              <DetailItem
                label="Loại bệnh dịch"
                value={selectedDisease.diseaseName}
              />

              <DetailItem
                label="Địa chỉ"
                value={getLocation(selectedDisease)}
              />

              <DetailItem
                label="Số người bị nhiễm"
                value={`${selectedDisease.reportedCases} người`}
              />

              <DetailItem
                label="Đường lây nhiễm"
                value={selectedDisease.transmission}
              />

              <DetailItem
                label="Loại vắc xin phòng bệnh"
                value={selectedDisease.vaccineName}
              />

              <Box
                sx={{
                  gridColumn: {
                    xs: 'auto',
                    sm: '1 / -1'
                  }
                }}
              >
                <DetailItem
                  label="Tác hại sức khỏe"
                  value={selectedDisease.healthEffect}
                />
              </Box>

              <DetailItem
                label="Trạng thái"
                value={getStatusLabel(selectedDisease.status)}
              />

              <DetailItem label="Ghi chú" value={selectedDisease.note || '-'} />
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5
          }}
        >
          <Button
            variant="contained"
            onClick={handleCloseDetail}
            sx={{
              textTransform: 'none'
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================================================
          DELETE DIALOG
      ================================================== */}

      <Dialog
        open={deleteOpen}
        onClose={handleCloseDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: '#172b3a'
          }}
        >
          Xác nhận xóa
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa thông tin dịch bệnh{' '}
            <Box
              component="span"
              sx={{
                fontWeight: 700
              }}
            >
              {selectedDelete?.diseaseName}
            </Box>
            ?
          </Typography>

          {selectedDelete && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: 2
              }}
            >
              <Typography variant="body2">
                <Box
                  component="span"
                  sx={{
                    fontWeight: 600
                  }}
                >
                  Địa phương:
                </Box>{' '}
                {getLocation(selectedDelete)}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.75
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: 600
                  }}
                >
                  Ngày cập nhật:
                </Box>{' '}
                {selectedDelete.reportDate}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.75
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: 600
                  }}
                >
                  Số ca:
                </Box>{' '}
                {selectedDelete.reportedCases}
              </Typography>
            </Box>
          )}

          <Typography
            variant="body2"
            color="error"
            sx={{
              mt: 2
            }}
          >
            Dữ liệu sau khi xóa sẽ không thể khôi phục.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            gap: 1
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCloseDelete}
            disabled={isDeleting}
            sx={{
              textTransform: 'none'
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={handleDelete}
            disabled={isDeleting}
            sx={{
              textTransform: 'none'
            }}
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DiseaseSituationList
