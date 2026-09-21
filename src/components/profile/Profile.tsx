'use client'

import { useMemo, useState } from 'react'

import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'

// =========================
// TYPES
// =========================

type VaccinationStatus = 'completed' | 'upcoming'

type Vaccination = {
  id: number
  date: string
  time: string
  location: string
  vaccine: string
  dose: string
  medicalStaff: string
  status: VaccinationStatus
  result: string
  note: string
  hasFeedback: boolean
}

type ProfileData = {
  username: string
  fullName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  address: string
  avatarUrl: string
  role: string
}

type ProfileFormData = {
  fullName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  address: string
}

type Order = 'asc' | 'desc'

type OrderBy =
  | 'date'
  | 'time'
  | 'location'
  | 'vaccine'
  | 'dose'
  | 'medicalStaff'
  | 'status'
  | 'result'

// =========================
// COMPONENT
// =========================

const Profile = () => {
  // =========================
  // PROFILE
  // =========================

  const [profile, setProfile] = useState<ProfileData>({
    username: 'nguyenvana',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '20/08/1993',
    gender: 'Nam',
    phone: '0901234567',
    email: 'nguyenvana@gmail.com',
    address: '193 Nguyễn Lương Bằng, Đà Nẵng',
    avatarUrl: '/images/photo2.png',
    role: 'CUSTOMER'
  })

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: profile.fullName,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    phone: profile.phone,
    email: profile.email,
    address: profile.address
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // =========================
  // TABLE
  // =========================

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<OrderBy>('date')

  // =========================
  // FEEDBACK
  // =========================

  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const [selectedVaccination, setSelectedVaccination] =
    useState<Vaccination | null>(null)

  const [feedbackContent, setFeedbackContent] = useState('')

  const [feedbackError, setFeedbackError] = useState('')

  const [isSendingFeedback, setIsSendingFeedback] = useState(false)

  // =========================
  // MOCK VACCINATIONS
  // =========================

  const [vaccinations, setVaccinations] = useState<Vaccination[]>([
    {
      id: 1,
      date: '18/09/2026',
      time: '09:30',
      location: 'Trung tâm Y tế dự phòng',
      vaccine: 'ENGERIX B',
      dose: 'Mũi 1',
      medicalStaff: 'BS. Nguyễn Văn Minh',
      status: 'completed',
      result: 'Tốt',
      note: '',
      hasFeedback: false
    },
    {
      id: 2,
      date: '15/09/2026',
      time: '08:30',
      location: 'Trung tâm Y tế dự phòng',
      vaccine: 'Influenza',
      dose: 'Mũi 1',
      medicalStaff: 'ĐD. Trần Thị Lan',
      status: 'completed',
      result: 'Tốt',
      note: '',
      hasFeedback: false
    },
    {
      id: 3,
      date: '20/09/2026',
      time: '08:00',
      location: 'Trung tâm Y tế dự phòng',
      vaccine: 'TETAVAX',
      dose: 'Mũi 2',
      medicalStaff: 'ĐD. Trần Thị Lan',
      status: 'upcoming',
      result: '',
      note: '',
      hasFeedback: false
    },
    {
      id: 4,
      date: '25/09/2026',
      time: '08:30',
      location: 'Trung tâm Y tế dự phòng',
      vaccine: 'Influenza',
      dose: 'Mũi 2',
      medicalStaff: 'BS. Nguyễn Văn Minh',
      status: 'upcoming',
      result: '',
      note: '',
      hasFeedback: false
    },
    {
      id: 5,
      date: '10/10/2026',
      time: '09:00',
      location: 'Trung tâm Y tế dự phòng',
      vaccine: 'MMR',
      dose: 'Mũi 1',
      medicalStaff: 'ĐD. Trần Thị Lan',
      status: 'upcoming',
      result: '',
      note: '',
      hasFeedback: false
    },
    {
      id: 6,
      date: '15/10/2026',
      time: '10:00',
      location: 'Trung tâm Y tế dự phòng',
      vaccine: 'HPV',
      dose: 'Mũi 1',
      medicalStaff: 'BS. Nguyễn Văn Minh',
      status: 'upcoming',
      result: '',
      note: '',
      hasFeedback: false
    },
    {
      id: 7,
      date: '20/10/2026',
      time: '08:00',
      location: 'Trung tâm Y tế dự phòng',
      vaccine: 'HPV',
      dose: 'Mũi 2',
      medicalStaff: 'BS. Nguyễn Văn Minh',
      status: 'upcoming',
      result: '',
      note: '',
      hasFeedback: false
    }
  ])

  // =========================
  // PROFILE HANDLERS
  // =========================

  const handleEdit = () => {
    setFormData({
      fullName: profile.fullName,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      phone: profile.phone,
      email: profile.email,
      address: profile.address
    })

    setIsEditing(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancelEdit = () => {
    setFormData({
      fullName: profile.fullName,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      phone: profile.phone,
      email: profile.email,
      address: profile.address
    })

    setIsEditing(false)
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)

      const payload = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      }

      console.log('Update profile:', payload)

      // TODO:
      // await updateProfile(payload)

      await new Promise((resolve) => setTimeout(resolve, 500))

      setProfile((prev) => ({
        ...prev,
        ...payload
      }))

      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  // =========================
  // FEEDBACK HANDLERS
  // =========================

  const handleOpenFeedback = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination)
    setFeedbackContent('')
    setFeedbackError('')
    setFeedbackOpen(true)
  }

  const handleCloseFeedback = () => {
    if (isSendingFeedback) return

    setFeedbackOpen(false)
    setSelectedVaccination(null)
    setFeedbackContent('')
    setFeedbackError('')
  }

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setFeedbackContent(value)

    if (value.trim()) {
      setFeedbackError('')
    }
  }

  const handleSubmitFeedback = async () => {
    if (!selectedVaccination) return

    const content = feedbackContent.trim()

    if (!content) {
      setFeedbackError('Vui lòng nhập nội dung phản hồi')

      return
    }

    if (content.length > 500) {
      setFeedbackError('Nội dung phản hồi không được vượt quá 500 ký tự')

      return
    }

    try {
      setIsSendingFeedback(true)

      const payload = {
        vaccinationId: selectedVaccination.id,
        content
      }

      console.log('Feedback payload:', payload)

      // TODO:
      // await createVaccinationFeedback(payload)

      await new Promise((resolve) => setTimeout(resolve, 700))

      setVaccinations((prev) =>
        prev.map((item) =>
          item.id === selectedVaccination.id
            ? {
                ...item,
                hasFeedback: true
              }
            : item
        )
      )

      setFeedbackOpen(false)
      setSelectedVaccination(null)
      setFeedbackContent('')
      setFeedbackError('')
    } finally {
      setIsSendingFeedback(false)
    }
  }

  // =========================
  // SORT
  // =========================

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  const sortedVaccinations = useMemo(() => {
    return [...vaccinations].sort((a, b) => {
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
  }, [vaccinations, order, orderBy])

  // =========================
  // PAGING
  // =========================

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value))

    setPage(0)
  }

  const paginatedVaccinations = sortedVaccinations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // =========================
  // RENDER
  // =========================

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
            {/* =========================
                HEADER
            ========================== */}

            <Box
              sx={{
                px: 3,
                py: 2.5,
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
                  gap: 1.5
                }}
              >
                <Avatar
                  src={profile.avatarUrl || undefined}
                  alt={profile.fullName}
                  sx={{
                    width: 52,
                    height: 52,
                    fontSize: 20,
                    fontWeight: 700,
                    bgcolor: 'primary.main'
                  }}
                >
                  {!profile.avatarUrl &&
                    profile.fullName
                      .split(' ')
                      .map((word) => word[0])
                      .slice(-2)
                      .join('')
                      .toUpperCase()}
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700
                    }}
                  >
                    {profile.fullName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Hồ sơ và thông tin tiêm chủng
                  </Typography>
                </Box>
              </Box>

              {!isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={handleEdit}
                >
                  Cập nhật thông tin
                </Button>
              )}
            </Box>

            <Divider />

            {/* =========================
                PROFILE
            ========================== */}

            <Box sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Thông Tin Hồ Sơ
              </Typography>

              {!isEditing ? (
                /* =====================
                   VIEW PROFILE
                ====================== */

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                      lg: 'repeat(4, minmax(0, 1fr))'
                    },
                    gap: 2
                  }}
                >
                  <InfoItem label="Họ và tên" value={profile.fullName} />

                  <InfoItem label="Ngày sinh" value={profile.dateOfBirth} />

                  <InfoItem label="Giới tính" value={profile.gender} />

                  <InfoItem label="Số điện thoại" value={profile.phone} />

                  <InfoItem label="Tên đăng nhập" value={profile.username} />

                  <InfoItem label="Email" value={profile.email} />

                  <Box
                    sx={{
                      gridColumn: {
                        xs: 'auto',
                        sm: 'span 2'
                      }
                    }}
                  >
                    <InfoItem label="Địa chỉ" value={profile.address} />
                  </Box>
                </Box>
              ) : (
                /* =====================
                   EDIT PROFILE
                ====================== */

                <Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(4, minmax(0, 1fr))'
                      },
                      gap: 2
                    }}
                  >
                    <TextField
                      label="Họ và tên"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      slotProps={{
                        htmlInput: {
                          maxLength: 100
                        }
                      }}
                    />

                    <TextField
                      label="Ngày sinh"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      placeholder="DD/MM/YYYY"
                    />

                    <TextField
                      select
                      label="Giới tính"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="Nam">Nam</MenuItem>

                      <MenuItem value="Nữ">Nữ</MenuItem>

                      <MenuItem value="Khác">Khác</MenuItem>
                    </TextField>

                    <TextField
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      slotProps={{
                        htmlInput: {
                          maxLength: 10,
                          inputMode: 'numeric'
                        }
                      }}
                    />

                    <TextField
                      label="Tên đăng nhập"
                      value={profile.username}
                      fullWidth
                      size="small"
                      disabled
                    />

                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      slotProps={{
                        htmlInput: {
                          maxLength: 100
                        }
                      }}
                    />

                    <TextField
                      label="Địa chỉ"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      slotProps={{
                        htmlInput: {
                          maxLength: 255
                        }
                      }}
                      sx={{
                        gridColumn: {
                          xs: 'auto',
                          sm: 'span 2'
                        }
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      mt: 2.5,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: 1.5
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<CloseOutlinedIcon />}
                      disabled={isSaving}
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<SaveOutlinedIcon />}
                      disabled={isSaving}
                      onClick={handleSaveProfile}
                    >
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            <Divider />

            {/* =========================
                TABLE TITLE
            ========================== */}

            <Box
              sx={{
                px: 3,
                pt: 3,
                pb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <VaccinesOutlinedIcon color="primary" />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700
                }}
              >
                Thông Tin Lịch Tiêm
              </Typography>
            </Box>

            {/* =========================
                TABLE
            ========================== */}

            <TableContainer
              sx={{
                px: 3,
                pb: 3,
                boxSizing: 'border-box'
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  boxShadow: 'none',
                  overflowX: 'auto'
                }}
              >
                <Table
                  sx={{
                    minWidth: 1200
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: '#f8fafc'
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 700
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

                      <SortableHeader
                        label="Kết quả"
                        property="result"
                        order={order}
                        orderBy={orderBy}
                        onSort={handleSort}
                      />

                      <TableCell
                        sx={{
                          fontWeight: 700
                        }}
                      >
                        Ghi chú
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 700,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Phản hồi
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedVaccinations.length > 0 ? (
                      paginatedVaccinations.map((item, index) => (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            {page * rowsPerPage + index + 1}
                          </TableCell>

                          <TableCell
                            sx={{
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.date}
                          </TableCell>

                          <TableCell>{item.time}</TableCell>

                          <TableCell>{item.location}</TableCell>

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

                          <TableCell>{item.result || '-'}</TableCell>

                          <TableCell>{item.note || '-'}</TableCell>

                          {/* =====================
                                FEEDBACK BUTTON
                            ====================== */}

                          <TableCell align="center">
                            {item.status === 'completed' ? (
                              item.hasFeedback ? (
                                <Chip
                                  label="Đã phản hồi"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<FeedbackOutlinedIcon />}
                                  onClick={() => handleOpenFeedback(item)}
                                  sx={{
                                    whiteSpace: 'nowrap',
                                    textTransform: 'none'
                                  }}
                                >
                                  Phản hồi
                                </Button>
                              )
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          align="center"
                          sx={{
                            py: 5,
                            color: 'text.secondary'
                          }}
                        >
                          Chưa có thông tin lịch tiêm
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* =========================
                    PAGINATION
                ========================== */}

                <TablePagination
                  component="div"
                  count={sortedVaccinations.length}
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
              </Paper>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      {/* =====================================
          FEEDBACK DIALOG
          Chỉ mở sau khi click "Phản hồi"
      ====================================== */}

      <Dialog
        open={feedbackOpen}
        onClose={isSendingFeedback ? undefined : handleCloseFeedback}
        fullWidth
        maxWidth="sm"
      >
        {/* HEADER */}

        <DialogTitle
          sx={{
            px: 3,
            py: 2.5
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <FeedbackOutlinedIcon color="primary" />

            <Typography
              component="span"
              variant="h6"
              sx={{
                fontWeight: 700
              }}
            >
              Phản hồi sau khi tiêm
            </Typography>
          </Box>
        </DialogTitle>

        <Divider />

        {/* CONTENT */}

        <DialogContent
          sx={{
            px: 3,
            py: 3
          }}
        >
          {selectedVaccination && (
            <Box>
              {/* =====================
                  VACCINATION INFO
              ====================== */}

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))'
                  },
                  gap: 2,
                  mb: 3
                }}
              >
                <TextField
                  label="Tên vắc xin"
                  value={selectedVaccination.vaccine}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Liều tiêm"
                  value={selectedVaccination.dose}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Thời gian tiêm"
                  value={`${selectedVaccination.date} - ${selectedVaccination.time}`}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Địa điểm tiêm"
                  value={selectedVaccination.location}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Nhân viên phụ trách"
                  value={selectedVaccination.medicalStaff}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                  sx={{
                    gridColumn: {
                      xs: 'auto',
                      sm: 'span 2'
                    }
                  }}
                />
              </Box>

              {/* =====================
                  FEEDBACK CONTENT
              ====================== */}

              <TextField
                label="Kết quả (triệu chứng nếu có)"
                placeholder="Nhập triệu chứng hoặc phản hồi sau khi tiêm..."
                value={feedbackContent}
                onChange={handleFeedbackChange}
                fullWidth
                multiline
                minRows={5}
                maxRows={8}
                required
                disabled={isSendingFeedback}
                error={Boolean(feedbackError)}
                helperText={
                  feedbackError || `${feedbackContent.length}/500 ký tự`
                }
                slotProps={{
                  htmlInput: {
                    maxLength: 500
                  }
                }}
              />
            </Box>
          )}
        </DialogContent>

        <Divider />

        {/* ACTION */}

        <DialogActions
          sx={{
            px: 3,
            py: 2
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CloseOutlinedIcon />}
            disabled={isSendingFeedback}
            onClick={handleCloseFeedback}
          >
            Hủy bỏ
          </Button>

          <Button
            variant="contained"
            startIcon={<SendOutlinedIcon />}
            disabled={isSendingFeedback}
            onClick={handleSubmitFeedback}
          >
            {isSendingFeedback ? 'Đang gửi...' : 'Gửi phản hồi'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

// =========================
// INFO ITEM
// =========================

type InfoItemProps = {
  label: string
  value: string
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 0.5,
          fontWeight: 600
        }}
      >
        {value || '-'}
      </Typography>
    </Box>
  )
}

// =========================
// SORTABLE HEADER
// =========================

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

export default Profile
