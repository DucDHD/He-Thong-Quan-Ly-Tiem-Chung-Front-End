'use client'

import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// ======================================================
// VALIDATION
// ======================================================

const reminderSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập email')
    .max(100, 'Email không được vượt quá 100 ký tự')
    .email('Email không đúng định dạng')
})

type ReminderForm = z.infer<typeof reminderSchema>

// ======================================================
// TYPES
// ======================================================

type VaccinationHistory = {
  id: number
  date: string
  vaccineName: string
}

type UpcomingVaccination = {
  id: number
  date: string
  time: string
  vaccineName: string
  price: number
}

// ======================================================
// MOCK DATA
// Sau này lấy theo customer từ API
// ======================================================

const vaccinationHistory: VaccinationHistory[] = [
  {
    id: 1,
    date: '12/06/2026',
    vaccineName: 'Viêm gan B'
  },
  {
    id: 2,
    date: '15/07/2026',
    vaccineName: 'Bạch hầu - Ho gà - Uốn ván'
  },
  {
    id: 3,
    date: '20/08/2026',
    vaccineName: 'Cúm mùa'
  }
]

const upcomingVaccinations: UpcomingVaccination[] = [
  {
    id: 1,
    date: '25/09/2026',
    time: '08:00',
    vaccineName: 'Cúm mùa',
    price: 350000
  },
  {
    id: 2,
    date: '15/10/2026',
    time: '09:30',
    vaccineName: 'Viêm gan B',
    price: 280000
  }
]

// ======================================================
// FORMAT PRICE
// ======================================================

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ'
}

// ======================================================
// COMPONENT
// ======================================================

const VaccinationReminder = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ReminderForm>({
    resolver: zodResolver(reminderSchema),
    mode: 'onTouched',

    defaultValues: {
      email: ''
    }
  })

  // ====================================================
  // SUBMIT
  // ====================================================

  const onSubmit = async (data: ReminderForm) => {
    const payload = {
      email: data.email,
      vaccinationHistory,
      upcomingVaccinations
    }

    console.log('SEND VACCINATION REMINDER:', payload)

    // TODO: CALL API
    //
    // await reminderService.send(payload)

    // Sau khi gửi thành công:
    //
    // router.push('/customer-care')
  }

  // ====================================================
  // CANCEL
  // ====================================================

  const handleCancel = () => {
    router.back()
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
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <Box
            sx={{
              px: 3,
              py: 2.25,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <NotificationsActiveOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.25
                }}
              >
                Nhắc lịch tiêm chủng
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Gửi thông tin nhắc lịch tiêm chủng cho khách hàng
              </Typography>
            </Box>
          </Box>

          {/* ================================================= */}
          {/* FORM */}
          {/* ================================================= */}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                p: 3
              }}
            >
              {/* ============================================= */}
              {/* EMAIL */}
              {/* ============================================= */}

              <Box
                sx={{
                  mb: 3
                }}
              >
                <Typography
                  sx={{
                    mb: 1,
                    fontWeight: 600
                  }}
                >
                  Thông tin người nhận
                </Typography>

                <TextField
                  label="Email khách hàng"
                  placeholder="VD: nguyenvana@gmail.com"
                  type="email"
                  fullWidth
                  required
                  {...register('email')}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 100
                    },
                    input: {
                      startAdornment: (
                        <EmailOutlinedIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            color: 'text.secondary'
                          }}
                        />
                      )
                    }
                  }}
                  sx={{
                    maxWidth: 600
                  }}
                />
              </Box>

              {/* ============================================= */}
              {/* VACCINATION HISTORY */}
              {/* ============================================= */}

              <Box
                sx={{
                  mb: 3
                }}
              >
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600
                    }}
                  >
                    Lịch sử tiêm chủng
                  </Typography>

                  <Chip
                    label={`${vaccinationHistory.length} lần tiêm`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    boxShadow: 'none',
                    borderRadius: 2
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: '#fafbfc'
                        }}
                      >
                        <TableCell
                          sx={{
                            width: 80,
                            fontWeight: 600
                          }}
                        >
                          STT
                        </TableCell>

                        <TableCell
                          sx={{
                            width: 180,
                            fontWeight: 600
                          }}
                        >
                          Ngày tiêm
                        </TableCell>

                        <TableCell
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Loại vaccine
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {vaccinationHistory.map((item, index) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{index + 1}</TableCell>

                          <TableCell
                            sx={{
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.date}
                          </TableCell>

                          <TableCell>{item.vaccineName}</TableCell>
                        </TableRow>
                      ))}

                      {vaccinationHistory.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            align="center"
                            sx={{
                              py: 4,
                              color: 'text.secondary'
                            }}
                          >
                            Chưa có lịch sử tiêm chủng
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* ============================================= */}
              {/* UPCOMING VACCINATION */}
              {/* ============================================= */}

              <Box>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600
                    }}
                  >
                    Lịch tiêm sắp tới
                  </Typography>

                  <Chip
                    label={`${upcomingVaccinations.length} lịch`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    boxShadow: 'none',
                    borderRadius: 2
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: '#fafbfc'
                        }}
                      >
                        <TableCell
                          sx={{
                            width: 80,
                            fontWeight: 600
                          }}
                        >
                          STT
                        </TableCell>

                        <TableCell
                          sx={{
                            width: 180,
                            fontWeight: 600
                          }}
                        >
                          Ngày
                        </TableCell>

                        <TableCell
                          sx={{
                            width: 120,
                            fontWeight: 600
                          }}
                        >
                          Giờ
                        </TableCell>

                        <TableCell
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Loại vaccine
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            width: 180,
                            fontWeight: 600
                          }}
                        >
                          Giá
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {upcomingVaccinations.map((item, index) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{index + 1}</TableCell>

                          <TableCell
                            sx={{
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.date}
                          </TableCell>

                          <TableCell>{item.time}</TableCell>

                          <TableCell>{item.vaccineName}</TableCell>

                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 500,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {formatPrice(item.price)}
                          </TableCell>
                        </TableRow>
                      ))}

                      {upcomingVaccinations.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                            sx={{
                              py: 4,
                              color: 'text.secondary'
                            }}
                          >
                            Không có lịch tiêm sắp tới
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            {/* ================================================= */}
            {/* ACTION */}
            {/* ================================================= */}

            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1.5
              }}
            >
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                startIcon={<CloseOutlinedIcon />}
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={{
                  minWidth: 100,
                  height: 42,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<SendOutlinedIcon />}
                disabled={isSubmitting}
                sx={{
                  minWidth: 120,
                  height: 42,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi nhắc'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default VaccinationReminder
