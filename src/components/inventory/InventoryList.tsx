'use client'

import {
  Box,
  Button,
  Checkbox,
  Chip,
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

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'

import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

import { useRouter } from 'next/navigation'

// ======================================================
// TYPES
// ======================================================

type VaccineStatus = 'available' | 'low' | 'out' | 'expired'

type VaccineInventory = {
  id: number
  vaccineName: string
  vaccineType: string
  importDate: string
  licenseNumber: string
  country: string
  dosage: string
  quantity: number
  expiryDate: string
  storageCondition: string
  ageGroup: string
  status: VaccineStatus
}

type Order = 'asc' | 'desc'

type OrderBy =
  | 'vaccineName'
  | 'vaccineType'
  | 'importDate'
  | 'country'
  | 'quantity'
  | 'expiryDate'

// ======================================================
// MOCK DATA
// ======================================================

const inventoryData: VaccineInventory[] = [
  {
    id: 1,
    vaccineName: 'Phòng bệnh lao',
    vaccineType: 'BCG',
    importDate: '2026-09-01',
    licenseNumber: 'GP001',
    country: 'Việt Nam',
    dosage: '0.1 ml',
    quantity: 500,
    expiryDate: '2027-09-01',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ em',
    status: 'available'
  },
  {
    id: 2,
    vaccineName: 'Phòng viêm gan B',
    vaccineType: 'ENGERIX B',
    importDate: '2026-09-02',
    licenseNumber: 'GP002',
    country: 'Bỉ',
    dosage: '1 ml',
    quantity: 0,
    expiryDate: '2027-09-02',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Người lớn > 20 tuổi',
    status: 'out'
  },
  {
    id: 3,
    vaccineName: 'Phòng viêm gan B',
    vaccineType: 'ENGERIX B',
    importDate: '2026-09-03',
    licenseNumber: 'GP003',
    country: 'Bỉ',
    dosage: '0.5 ml',
    quantity: 20,
    expiryDate: '2027-09-03',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ em < 20 tuổi',
    status: 'low'
  },
  {
    id: 4,
    vaccineName: 'Phòng bệnh uốn ván',
    vaccineType: 'TETAVAX',
    importDate: '2026-09-05',
    licenseNumber: 'GP004',
    country: 'Pháp',
    dosage: '0.5 ml',
    quantity: 500,
    expiryDate: '2027-09-05',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ em',
    status: 'available'
  },
  {
    id: 5,
    vaccineName: 'Phòng bệnh sởi',
    vaccineType: 'TRIMOVAC',
    importDate: '2026-09-06',
    licenseNumber: 'GP005',
    country: 'Pháp',
    dosage: '0.5 ml',
    quantity: 500,
    expiryDate: '2027-09-06',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ em',
    status: 'available'
  },
  {
    id: 6,
    vaccineName: 'Phòng HPV',
    vaccineType: 'Gardasil 9',
    importDate: '2026-09-08',
    licenseNumber: 'GP006',
    country: 'Mỹ',
    dosage: '0.5 ml',
    quantity: 80,
    expiryDate: '2027-12-08',
    storageCondition: '2°C - 8°C',
    ageGroup: '9 - 45 tuổi',
    status: 'available'
  },
  {
    id: 7,
    vaccineName: 'Phòng cúm',
    vaccineType: 'Influvac Tetra',
    importDate: '2026-09-10',
    licenseNumber: 'GP007',
    country: 'Hà Lan',
    dosage: '0.5 ml',
    quantity: 15,
    expiryDate: '2027-08-10',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Từ 6 tháng tuổi',
    status: 'low'
  },
  {
    id: 8,
    vaccineName: 'Phòng phế cầu',
    vaccineType: 'Prevenar 13',
    importDate: '2026-09-11',
    licenseNumber: 'GP008',
    country: 'Mỹ',
    dosage: '0.5 ml',
    quantity: 120,
    expiryDate: '2028-01-11',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ em và người lớn',
    status: 'available'
  },
  {
    id: 9,
    vaccineName: 'Phòng thủy đậu',
    vaccineType: 'Varivax',
    importDate: '2026-09-12',
    licenseNumber: 'GP009',
    country: 'Mỹ',
    dosage: '0.5 ml',
    quantity: 0,
    expiryDate: '2027-10-12',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Từ 12 tháng tuổi',
    status: 'out'
  },
  {
    id: 10,
    vaccineName: 'Phòng viêm não Nhật Bản',
    vaccineType: 'Imojev',
    importDate: '2026-09-13',
    licenseNumber: 'GP010',
    country: 'Pháp',
    dosage: '0.5 ml',
    quantity: 75,
    expiryDate: '2027-11-13',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Từ 9 tháng tuổi',
    status: 'available'
  },
  {
    id: 11,
    vaccineName: 'Phòng bạch hầu - ho gà - uốn ván',
    vaccineType: 'Infanrix Hexa',
    importDate: '2026-09-14',
    licenseNumber: 'GP011',
    country: 'Bỉ',
    dosage: '0.5 ml',
    quantity: 45,
    expiryDate: '2027-09-14',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ em',
    status: 'available'
  },
  {
    id: 12,
    vaccineName: 'Phòng Rotavirus',
    vaccineType: 'Rotarix',
    importDate: '2026-09-15',
    licenseNumber: 'GP012',
    country: 'Bỉ',
    dosage: '1.5 ml',
    quantity: 10,
    expiryDate: '2027-06-15',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ sơ sinh',
    status: 'low'
  }
]

// ======================================================
// STATUS
// ======================================================

const getStatusConfig = (status: VaccineStatus) => {
  switch (status) {
    case 'available':
      return {
        label: 'Còn hàng',
        color: 'success' as const
      }

    case 'low':
      return {
        label: 'Sắp hết',
        color: 'warning' as const
      }

    case 'out':
      return {
        label: 'Hết hàng',
        color: 'error' as const
      }

    case 'expired':
      return {
        label: 'Hết hạn',
        color: 'default' as const
      }

    default:
      return {
        label: 'Không xác định',
        color: 'default' as const
      }
  }
}

// ======================================================
// FORMAT DATE
// ======================================================

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-')

  return `${day}/${month}/${year}`
}

// ======================================================
// COMPONENT
// ======================================================

const InventoryList = () => {
  const router = useRouter()

  const [search, setSearch] = useState('')

  const [statusFilter, setStatusFilter] = useState<VaccineStatus | 'all'>('all')

  const [order, setOrder] = useState<Order>('asc')

  const [orderBy, setOrderBy] = useState<OrderBy>('vaccineName')

  const [page, setPage] = useState(0)

  const [selected, setSelected] = useState<number[]>([])

  // ====================================================
  // 5 RECORD / PAGE
  // ====================================================

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))

    setPage(0)
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
  // SEARCH
  // ====================================================

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)

    setPage(0)
  }

  // ====================================================
  // STATUS FILTER
  // ====================================================

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value as VaccineStatus | 'all')

    setPage(0)
  }

  // ====================================================
  // PAGINATION
  // ====================================================

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // ====================================================
  // FILTER + SORT
  // ====================================================

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = inventoryData.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.vaccineName.toLowerCase().includes(keyword) ||
        item.vaccineType.toLowerCase().includes(keyword) ||
        item.country.toLowerCase().includes(keyword) ||
        item.licenseNumber.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter

      return matchesSearch && matchesStatus
    })

    return [...filtered].sort((a, b) => {
      let valueA: string | number
      let valueB: string | number

      switch (orderBy) {
        case 'vaccineName':
          valueA = a.vaccineName.toLowerCase()

          valueB = b.vaccineName.toLowerCase()

          break

        case 'vaccineType':
          valueA = a.vaccineType.toLowerCase()

          valueB = b.vaccineType.toLowerCase()

          break

        case 'importDate':
          valueA = new Date(a.importDate).getTime()

          valueB = new Date(b.importDate).getTime()

          break

        case 'country':
          valueA = a.country.toLowerCase()

          valueB = b.country.toLowerCase()

          break

        case 'quantity':
          valueA = a.quantity
          valueB = b.quantity

          break

        case 'expiryDate':
          valueA = new Date(a.expiryDate).getTime()

          valueB = new Date(b.expiryDate).getTime()

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
  }, [search, statusFilter, order, orderBy])

  // ====================================================
  // CURRENT PAGE
  // ====================================================

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // ====================================================
  // SELECT
  // ====================================================

  const currentPageIds = paginatedData.map((item) => item.id)

  const isAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selected.includes(id))

  const isSomeSelected =
    currentPageIds.some((id) => selected.includes(id)) && !isAllSelected

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)))

      return
    }

    setSelected((prev) => [...new Set([...prev, ...currentPageIds])])
  }

  const handleSelectOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // ====================================================
  // UI
  // ====================================================

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
      {/* ================================================= */}
      {/* PAGE WRAPPER */}
      {/* ================================================= */}

      <Box
        sx={{
          width: '100%',

          height: '100%',

          px: 3,

          py: 2,

          boxSizing: 'border-box',

          overflow: 'hidden'
        }}
      >
        {/* ================================================= */}
        {/* CARD */}
        {/* ================================================= */}

        <Paper
          variant="outlined"
          sx={{
            width: '100%',

            height: '100%',

            display: 'flex',

            flexDirection: 'column',

            borderRadius: 2.5,

            boxShadow: 'none',

            bgcolor: '#fff',

            overflow: 'hidden'
          }}
        >
          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

          <Box
            sx={{
              px: 2.5,

              py: 1.75,

              flexShrink: 0,

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'space-between',

              gap: 2
            }}
          >
            {/* TITLE */}

            <Box
              sx={{
                display: 'flex',

                alignItems: 'center',

                gap: 1.5,

                minWidth: 0
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

                  bgcolor: 'primary.main',

                  color: '#fff'
                }}
              >
                <Inventory2OutlinedIcon />
              </Box>

              <Box
                sx={{
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
                  Quản lý kho vaccine
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.25
                  }}
                >
                  Theo dõi số lượng và tình trạng vaccine trong kho
                </Typography>
              </Box>
            </Box>

            {/* ACTION */}

            <Box
              sx={{
                display: 'flex',

                alignItems: 'center',

                gap: 1
              }}
            >
              <Button
                variant="outlined"
                startIcon={<AddOutlinedIcon />}
                onClick={() => router.push('/inventory/import')}
                sx={{
                  height: 40,

                  textTransform: 'none',

                  fontWeight: 600,

                  whiteSpace: 'nowrap'
                }}
              >
                Nhập vaccine
              </Button>

              <Button
                variant="contained"
                startIcon={<FileDownloadOutlinedIcon />}
                onClick={() => router.push('/inventory/export')}
                sx={{
                  height: 40,

                  textTransform: 'none',

                  fontWeight: 600,

                  whiteSpace: 'nowrap'
                }}
              >
                Xuất vaccine
              </Button>
            </Box>
          </Box>

          {/* ============================================= */}
          {/* FILTER */}
          {/* ============================================= */}

          <Box
            sx={{
              px: 2.5,

              py: 1.25,

              flexShrink: 0,

              borderTop: '1px solid',

              borderBottom: '1px solid',

              borderColor: 'divider',

              display: 'flex',

              alignItems: 'center',

              gap: 1.5
            }}
          >
            {/* SEARCH */}

            <TextField
              value={search}
              onChange={handleSearchChange}
              placeholder="Tìm tên vaccine, loại, số giấy phép..."
              size="small"
              sx={{
                width: 380
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

            {/* STATUS */}

            <TextField
              select
              value={statusFilter}
              onChange={handleStatusChange}
              size="small"
              sx={{
                width: 190
              }}
            >
              <MenuItem value="all">Tất cả tình trạng</MenuItem>

              <MenuItem value="available">Còn hàng</MenuItem>

              <MenuItem value="low">Sắp hết</MenuItem>

              <MenuItem value="out">Hết hàng</MenuItem>

              <MenuItem value="expired">Hết hạn</MenuItem>
            </TextField>

            {/* SELECTED */}

            {selected.length > 0 && (
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  ml: 'auto',

                  fontWeight: 600,

                  whiteSpace: 'nowrap'
                }}
              >
                Đã chọn {selected.length} vaccine
              </Typography>
            )}
          </Box>

          {/* ============================================= */}
          {/* RESULT */}
          {/* ============================================= */}

          <Box
            sx={{
              px: 2.5,

              py: 1,

              flexShrink: 0
            }}
          >
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
              vaccine
            </Typography>
          </Box>

          {/* ============================================= */}
          {/* TABLE AREA */}
          {/* ============================================= */}

          <Box
            sx={{
              px: 2.5,

              flex: 1,

              minHeight: 0,

              display: 'flex',

              flexDirection: 'column',

              overflow: 'hidden'
            }}
          >
            <TableContainer
              sx={{
                width: '100%',

                flex: 1,

                minHeight: 0,

                // Chỉ scroll dọc nếu thiếu chiều cao
                overflowY: 'auto',

                // Desktop không scroll ngang
                overflowX: 'hidden',

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

                  tableLayout: 'fixed',

                  '& .MuiTableCell-root': {
                    px: 0.75,

                    py: 1.25,

                    fontSize: '0.76rem',

                    lineHeight: 1.3,

                    verticalAlign: 'middle'
                  },

                  '& .MuiTableCell-head': {
                    fontWeight: 700,

                    bgcolor: '#f8fafc',

                    whiteSpace: 'normal'
                  }
                }}
              >
                {/* ======================================= */}
                {/* TABLE HEAD */}
                {/* ======================================= */}

                <TableHead>
                  <TableRow>
                    {/* CHECKBOX */}

                    <TableCell
                      padding="checkbox"
                      sx={{
                        width: 42,

                        textAlign: 'center'
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={handleSelectAll}
                      />
                    </TableCell>

                    {/* VACCINE NAME */}

                    <TableCell
                      sx={{
                        width: '13%'
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'vaccineName'}
                        direction={orderBy === 'vaccineName' ? order : 'asc'}
                        onClick={() => handleSort('vaccineName')}
                      >
                        Tên vaccine
                      </TableSortLabel>
                    </TableCell>

                    {/* TYPE */}

                    <TableCell
                      sx={{
                        width: '10%'
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'vaccineType'}
                        direction={orderBy === 'vaccineType' ? order : 'asc'}
                        onClick={() => handleSort('vaccineType')}
                      >
                        Loại vaccine
                      </TableSortLabel>
                    </TableCell>

                    {/* IMPORT */}

                    <TableCell
                      sx={{
                        width: '8%'
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'importDate'}
                        direction={orderBy === 'importDate' ? order : 'asc'}
                        onClick={() => handleSort('importDate')}
                      >
                        Ngày nhập
                      </TableSortLabel>
                    </TableCell>

                    {/* LICENSE */}

                    <TableCell
                      sx={{
                        width: '8%'
                      }}
                    >
                      Số giấy phép
                    </TableCell>

                    {/* COUNTRY */}

                    <TableCell
                      sx={{
                        width: '8%'
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'country'}
                        direction={orderBy === 'country' ? order : 'asc'}
                        onClick={() => handleSort('country')}
                      >
                        Nước SX
                      </TableSortLabel>
                    </TableCell>

                    {/* DOSAGE */}

                    <TableCell
                      sx={{
                        width: '7%'
                      }}
                    >
                      Hàm lượng
                    </TableCell>

                    {/* QUANTITY */}

                    <TableCell
                      align="center"
                      sx={{
                        width: '6%'
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'quantity'}
                        direction={orderBy === 'quantity' ? order : 'asc'}
                        onClick={() => handleSort('quantity')}
                      >
                        SL
                      </TableSortLabel>
                    </TableCell>

                    {/* EXPIRY */}

                    <TableCell
                      sx={{
                        width: '9%'
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'expiryDate'}
                        direction={orderBy === 'expiryDate' ? order : 'asc'}
                        onClick={() => handleSort('expiryDate')}
                      >
                        Hạn dùng
                      </TableSortLabel>
                    </TableCell>

                    {/* STORAGE */}

                    <TableCell
                      sx={{
                        width: '10%'
                      }}
                    >
                      Bảo quản
                    </TableCell>

                    {/* AGE */}

                    <TableCell
                      sx={{
                        width: '12%'
                      }}
                    >
                      Độ tuổi
                    </TableCell>

                    {/* STATUS */}

                    <TableCell
                      sx={{
                        width: '9%'
                      }}
                    >
                      Trạng thái
                    </TableCell>
                  </TableRow>
                </TableHead>

                {/* ======================================= */}
                {/* TABLE BODY */}
                {/* ======================================= */}

                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => {
                      const status = getStatusConfig(item.status)

                      const isSelected = selected.includes(item.id)

                      return (
                        <TableRow
                          key={item.id}
                          hover
                          selected={isSelected}
                          onClick={() => handleSelectOne(item.id)}
                          sx={{
                            cursor: 'pointer'
                          }}
                        >
                          {/* CHECKBOX */}

                          <TableCell padding="checkbox" align="center">
                            <Checkbox
                              size="small"
                              checked={isSelected}
                              onClick={(event) => event.stopPropagation()}
                              onChange={() => handleSelectOne(item.id)}
                            />
                          </TableCell>

                          {/* NAME */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              title={item.vaccineName}
                              sx={{
                                fontSize: 'inherit',

                                fontWeight: 600,

                                lineHeight: 1.3,

                                overflow: 'hidden',

                                display: '-webkit-box',

                                WebkitLineClamp: 2,

                                WebkitBoxOrient: 'vertical',

                                wordBreak: 'break-word'
                              }}
                            >
                              {item.vaccineName}
                            </Typography>
                          </TableCell>

                          {/* TYPE */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              title={item.vaccineType}
                              sx={{
                                fontSize: 'inherit',

                                lineHeight: 1.3,

                                overflow: 'hidden',

                                display: '-webkit-box',

                                WebkitLineClamp: 2,

                                WebkitBoxOrient: 'vertical',

                                wordBreak: 'break-word'
                              }}
                            >
                              {item.vaccineType}
                            </Typography>
                          </TableCell>

                          {/* IMPORT DATE */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: 'inherit',

                                whiteSpace: 'nowrap'
                              }}
                            >
                              {formatDate(item.importDate)}
                            </Typography>
                          </TableCell>

                          {/* LICENSE */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: 'inherit',

                                overflow: 'hidden',

                                textOverflow: 'ellipsis',

                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.licenseNumber}
                            </Typography>
                          </TableCell>

                          {/* COUNTRY */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: 'inherit',

                                overflow: 'hidden',

                                textOverflow: 'ellipsis',

                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.country}
                            </Typography>
                          </TableCell>

                          {/* DOSAGE */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: 'inherit',

                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.dosage}
                            </Typography>
                          </TableCell>

                          {/* QUANTITY */}

                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: 'inherit',

                                fontWeight: 700
                              }}
                            >
                              {item.quantity}
                            </Typography>
                          </TableCell>

                          {/* EXPIRY */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: 'inherit',

                                whiteSpace: 'nowrap'
                              }}
                            >
                              {formatDate(item.expiryDate)}
                            </Typography>
                          </TableCell>

                          {/* STORAGE */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              title={item.storageCondition}
                              sx={{
                                fontSize: 'inherit',

                                lineHeight: 1.3,

                                overflow: 'hidden',

                                display: '-webkit-box',

                                WebkitLineClamp: 2,

                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {item.storageCondition}
                            </Typography>
                          </TableCell>

                          {/* AGE */}

                          <TableCell>
                            <Typography
                              variant="body2"
                              title={item.ageGroup}
                              sx={{
                                fontSize: 'inherit',

                                lineHeight: 1.3,

                                overflow: 'hidden',

                                display: '-webkit-box',

                                WebkitLineClamp: 2,

                                WebkitBoxOrient: 'vertical',

                                wordBreak: 'break-word'
                              }}
                            >
                              {item.ageGroup}
                            </Typography>
                          </TableCell>

                          {/* STATUS */}

                          <TableCell>
                            <Chip
                              label={status.label}
                              color={status.color}
                              size="small"
                              variant="outlined"
                              sx={{
                                maxWidth: '100%',

                                height: 24,

                                fontSize: '0.7rem',

                                fontWeight: 600,

                                '& .MuiChip-label': {
                                  px: 0.75,

                                  overflow: 'hidden',

                                  textOverflow: 'ellipsis'
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        align="center"
                        sx={{
                          py: 6
                        }}
                      >
                        <Inventory2OutlinedIcon
                          sx={{
                            fontSize: 42,

                            color: 'text.disabled',

                            mb: 1
                          }}
                        />

                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Không tìm thấy vaccine
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5
                          }}
                        >
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* ============================================= */}
          {/* PAGINATION */}
          {/* ============================================= */}

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

              rowsPerPage={rowsPerPage}

              onPageChange={handleChangePage}

              onRowsPerPageChange={handleChangeRowsPerPage}

              rowsPerPageOptions={[5, 10, 20]}

              labelRowsPerPage="Hiển thị:"

              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} / ${count}`
              }

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
