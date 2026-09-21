'use client'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
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
  TextField,
  Typography
} from '@mui/material'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { z } from 'zod'

type ScheduleDetailProps = {
  scheduleId: string
}

type Customer = {
  id: number
  fullName: string
  dateOfBirth: string
  gender: string
  phone: string
  identityNumber: string
}

// MOCK - sau này lấy API theo scheduleId
const schedule = {
  id: 1,
  vaccinationDate: '2026-09-18',
  vaccinationTime: '08:00',
  vaccine: 'Influvac Tetra',
  age: '18 - 60',
  quantity: 30,
  registered: 12
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    dateOfBirth: '1998-05-12',
    gender: 'Nam',
    phone: '0901234567',
    identityNumber: '048098001234'
  },
  {
    id: 2,
    fullName: 'Trần Thị Bình',
    dateOfBirth: '1995-08-20',
    gender: 'Nữ',
    phone: '0912345678',
    identityNumber: '048195002345'
  },
  {
    id: 3,
    fullName: 'Lê Văn Cường',
    dateOfBirth: '2000-03-15',
    gender: 'Nam',
    phone: '0923456789',
    identityNumber: '048200003456'
  },
  {
    id: 4,
    fullName: 'Phạm Thị Dung',
    dateOfBirth: '1997-11-25',
    gender: 'Nữ',
    phone: '0934567890',
    identityNumber: '048197004567'
  },
  {
    id: 5,
    fullName: 'Hoàng Văn Em',
    dateOfBirth: '1999-07-09',
    gender: 'Nam',
    phone: '0945678901',
    identityNumber: '048199005678'
  },
  {
    id: 6,
    fullName: 'Nguyễn Thị Hạnh',
    dateOfBirth: '2001-01-18',
    gender: 'Nữ',
    phone: '0956789012',
    identityNumber: '048201006789'
  },
  {
    id: 7,
    fullName: 'Võ Văn Khang',
    dateOfBirth: '1996-09-10',
    gender: 'Nam',
    phone: '0967890123',
    identityNumber: '048196007890'
  },
  {
    id: 8,
    fullName: 'Đặng Thị Lan',
    dateOfBirth: '1994-12-03',
    gender: 'Nữ',
    phone: '0978901234',
    identityNumber: '048194008901'
  },
  {
    id: 9,
    fullName: 'Bùi Văn Minh',
    dateOfBirth: '2002-06-22',
    gender: 'Nam',
    phone: '0989012345',
    identityNumber: '048202009012'
  },
  {
    id: 10,
    fullName: 'Nguyễn Thị Ngọc',
    dateOfBirth: '1998-04-17',
    gender: 'Nữ',
    phone: '0901122334',
    identityNumber: '048198010123'
  },
  {
    id: 11,
    fullName: 'Trần Văn Phúc',
    dateOfBirth: '1993-10-11',
    gender: 'Nam',
    phone: '0911223344',
    identityNumber: '048193011234'
  },
  {
    id: 12,
    fullName: 'Lê Thị Quỳnh',
    dateOfBirth: '2000-02-14',
    gender: 'Nữ',
    phone: '0922334455',
    identityNumber: '048200012345'
  }
]

const customerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự')
    .regex(
      /^[\p{L}\s'.-]+$/u,
      'Họ và tên không được chứa số hoặc ký tự không hợp lệ'
    ),

  dateOfBirth: z
    .string()
    .min(1, 'Vui lòng chọn ngày sinh')
    .refine(
      (value) => {
        const date = dayjs(value)

        return date.isValid() && date.isBefore(dayjs(), 'day')
      },
      {
        message: 'Ngày sinh phải nhỏ hơn ngày hiện tại'
      }
    ),

  gender: z.enum(['male', 'female', 'other'], {
    message: 'Vui lòng chọn giới tính'
  }),

  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^0\d{9}$/, 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0'),

  identityNumber: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập CCCD')
    .regex(/^\d{12}$/, 'CCCD phải gồm đúng 12 chữ số'),

  address: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),

  note: z.string().trim().max(500, 'Ghi chú không được vượt quá 500 ký tự')
})

type CustomerFormData = z.infer<typeof customerSchema>

const ScheduleDetail = ({ scheduleId }: ScheduleDetailProps) => {
  const router = useRouter()

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [openAddCustomer, setOpenAddCustomer] = useState(false)

  const rowsPerPage = 10

  const handleAddPatient = () => {
    router.push(`/vaccination-schedules/${scheduleId}/patients/create`)
  }

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: 'male',
      phone: '',
      identityNumber: '',
      address: '',
      note: ''
    }
  })

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return customers
    }

    return customers.filter((customer) => {
      return (
        customer.fullName.toLowerCase().includes(keyword) ||
        customer.phone.includes(keyword) ||
        customer.identityNumber.includes(keyword)
      )
    })
  }, [customers, search])

  const paginatedCustomers = useMemo(() => {
    const start = page * rowsPerPage

    return filteredCustomers.slice(start, start + rowsPerPage)
  }, [filteredCustomers, page])

  const handleBack = () => {
    router.push('/vaccination-schedules')
  }

  const handleOpenAddCustomer = () => {
    reset()
    setOpenAddCustomer(true)
  }

  const handleCloseAddCustomer = () => {
    setOpenAddCustomer(false)
    reset()
  }

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const onSubmit = async (data: CustomerFormData) => {
    const payload = {
      scheduleId,
      ...data
    }

    console.log('Add customer:', payload)

    // TODO: gọi API thêm KH vào lịch tiêm

    const newCustomer: Customer = {
      id:
        customers.length > 0
          ? Math.max(...customers.map((customer) => customer.id)) + 1
          : 1,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender:
        data.gender === 'male'
          ? 'Nam'
          : data.gender === 'female'
            ? 'Nữ'
            : 'Khác',
      phone: data.phone,
      identityNumber: data.identityNumber
    }

    setCustomers((current) => [newCustomer, ...current])

    setPage(0)
    setSearch('')
    handleCloseAddCustomer()
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
              flexShrink: 0,
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
              <IconButton
                onClick={handleBack}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ArrowBackOutlinedIcon />
              </IconButton>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.3
                  }}
                >
                  Chi tiết lịch tiêm
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Quản lý khách hàng đăng ký lịch tiêm
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={handleOpenAddCustomer}
              sx={{
                minHeight: 42,
                px: 2.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Thêm khách hàng
            </Button>
          </Box>

          <Divider />

          {/* THÔNG TIN LỊCH TIÊM */}
          <Box
            sx={{
              px: 2.5,
              py: 2,
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <EventOutlinedIcon color="primary" fontSize="small" />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ngày tiêm
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600
                      }}
                    >
                      {dayjs(schedule.vaccinationDate).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <AccessTimeOutlinedIcon color="primary" fontSize="small" />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Giờ tiêm
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600
                      }}
                    >
                      {schedule.vaccinationTime}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <VaccinesOutlinedIcon color="primary" fontSize="small" />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Vaccine
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600
                      }}
                    >
                      {schedule.vaccine}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <PersonOutlineOutlinedIcon color="primary" fontSize="small" />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Đăng ký
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600
                      }}
                    >
                      {customers.length}/{schedule.quantity}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* CUSTOMER TOOLBAR */}
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              flexShrink: 0,
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: '#fafbfc',
              display: 'flex',
              alignItems: {
                xs: 'stretch',
                sm: 'center'
              },
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              gap: 1.5
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 600
                }}
              >
                Danh sách khách hàng
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {filteredCustomers.length} khách hàng
              </Typography>
            </Box>

            <TextField
              size="small"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(0)
              }}
              placeholder="Tìm tên, SĐT, CCCD..."
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

          {/* CUSTOMER TABLE */}
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
                minWidth: 900
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>Họ và tên</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>Ngày sinh</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>Giới tính</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>Số điện thoại</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>CCCD</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCustomers.map((customer, index) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 500
                      }}
                    >
                      {customer.fullName}
                    </TableCell>

                    <TableCell>
                      {dayjs(customer.dateOfBirth).format('DD/MM/YYYY')}
                    </TableCell>

                    <TableCell>{customer.gender}</TableCell>

                    <TableCell>{customer.phone}</TableCell>

                    <TableCell>{customer.identityNumber}</TableCell>
                  </TableRow>
                ))}

                {paginatedCustomers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{
                        py: 6
                      }}
                    >
                      <PersonOutlineOutlinedIcon
                        sx={{
                          fontSize: 42,
                          color: 'text.disabled',
                          mb: 1
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Không tìm thấy khách hàng
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Chưa có khách hàng hoặc không có kết quả phù hợp.
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
              count={filteredCustomers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} / ${count}`
              }
            />
          </Box>
        </Paper>
      </Box>

      {/* ADD CUSTOMER DIALOG */}
      <Dialog
        open={openAddCustomer}
        onClose={handleCloseAddCustomer}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2.5
            }
          }
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pr: 1
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600
                }}
              >
                Thêm khách hàng
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {schedule.vaccine}
                {' • '}
                {dayjs(schedule.vaccinationDate).format('DD/MM/YYYY')}
                {' • '}
                {schedule.vaccinationTime}
              </Typography>
            </Box>

            <IconButton onClick={handleCloseAddCustomer}>
              <CloseOutlinedIcon />
            </IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)'
                },
                gap: 2,
                pt: 1
              }}
            >
              <TextField
                label="Họ và tên"
                required
                fullWidth
                {...register('fullName')}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Ngày sinh"
                    format="DD/MM/YYYY"
                    disableFuture
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(value) =>
                      field.onChange(value ? value.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: Boolean(errors.dateOfBirth),
                        helperText: errors.dateOfBirth?.message
                      }
                    }}
                  />
                )}
              />

              <TextField
                select
                label="Giới tính"
                required
                fullWidth
                defaultValue=""
                {...register('gender')}
                error={Boolean(errors.gender)}
                helperText={errors.gender?.message}
              >
                <MenuItem value="male">Nam</MenuItem>

                <MenuItem value="female">Nữ</MenuItem>

                <MenuItem value="other">Khác</MenuItem>
              </TextField>

              <TextField
                label="Số điện thoại"
                required
                fullWidth
                placeholder="VD: 0901234567"
                {...register('phone')}
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 10,
                    inputMode: 'numeric'
                  }
                }}
              />

              <TextField
                label="CCCD"
                required
                fullWidth
                placeholder="Nhập 12 số CCCD"
                {...register('identityNumber')}
                error={Boolean(errors.identityNumber)}
                helperText={errors.identityNumber?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 12,
                    inputMode: 'numeric'
                  }
                }}
              />

              <TextField
                label="Địa chỉ"
                required
                fullWidth
                {...register('address')}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
              />

              <TextField
                label="Ghi chú"
                fullWidth
                multiline
                minRows={3}
                {...register('note')}
                error={Boolean(errors.note)}
                helperText={errors.note?.message}
                sx={{
                  gridColumn: {
                    xs: 'auto',
                    md: '1 / -1'
                  }
                }}
              />
            </Box>
          </DialogContent>

          <Divider />

          <DialogActions
            sx={{
              px: 3,
              py: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCloseAddCustomer}
              sx={{
                minWidth: 100,
                textTransform: 'none'
              }}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={<AddOutlinedIcon />}
              sx={{
                minWidth: 150,
                textTransform: 'none'
              }}
            >
              Đăng Ký Tiêm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

export default ScheduleDetail
