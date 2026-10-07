'use client'

import { useState } from 'react'

import {
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import VaccinationHistoryDialog from '@/components/profile/VaccinationHistoryDialog'
import {
  formatDate,
  formatEmail,
  formatCccd,
  formatPhone
} from '@/utils/format'
import { updateProfileAPI } from '@/services/auth.service'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),

  dateOfBirth: z.string().min(1, 'Vui lòng chọn ngày sinh'),

  gender: z.string().min(1, 'Vui lòng chọn giới tính'),

  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^0\d{9}$/, 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0'),

  address: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ')
    .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),

  cccd: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập CCCD')
    .regex(/^\d{12}$/, 'CCCD phải gồm đúng 12 chữ số')
})

type ProfileFormData = z.infer<typeof profileSchema>

const Profile = () => {
  const router = useRouter()
  const { user, setUser, isLoading, isPatient, isDoctor, isNurse } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [vaccinationHistoryOpen, setVaccinationHistoryOpen] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      address: '',
      cccd: ''
    }
  })

  const handleEdit = () => {
    if (!user) return

    reset({
      fullName: user.fullName ?? '',
      dateOfBirth: user.dateOfBirth ?? '',
      gender: user.gender ?? '',
      phone: user.phone ?? '',
      address: user.address ?? '',
      cccd: user.cccd ?? ''
    })

    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    reset()
    setIsEditing(false)
  }

  const handleSaveProfile = async (data: ProfileFormData) => {
    if (!user) return

    try {
      const payload = {
        fullName: data.fullName.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone.trim(),
        address: data.address.trim(),
        cccd: data.cccd.trim()
      }

      const updatedUser = await updateProfileAPI(payload)
      setUser(updatedUser)

      toast.success('Cập nhập thông tin hồ sơ thành công')
      // Tạm thời cập nhật Context
      setUser((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          ...payload
        }
      })

      setIsEditing(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError('cccd', {
          message: error.response?.data?.message
        })
      }
      toast.error('Cập nhập thông tin hồ sơ Không thành công')
    }
  }

  if (isLoading) {
    return (
      <Box
        component="main"
        sx={(theme) => ({
          ml: theme.layout.sidebarWidth,
          pt: theme.layout.headerHeight,
          minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
          bgcolor: '#f5f7fb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })}
      >
        <Typography color="text.secondary">Đang tải thông tin...</Typography>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box
        component="main"
        sx={(theme) => ({
          ml: theme.layout.sidebarWidth,
          pt: theme.layout.headerHeight,
          minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
          bgcolor: '#f5f7fb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })}
      >
        <Typography color="error">Không thể tải thông tin tài khoản</Typography>
      </Box>
    )
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
          {/* HEADER PROFILE */}
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
                alt={user.fullName}
                sx={{
                  width: 52,
                  height: 52,
                  fontSize: 20,
                  fontWeight: 700,
                  bgcolor: 'primary.main'
                }}
              />

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700
                  }}
                >
                  {user.fullName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Thông tin tài khoản
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

          {/* PROFILE */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2.5
              }}
            >
              Thông Tin Hồ Sơ
            </Typography>

            {!isEditing ? (
              /* ================= VIEW ================= */
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, minmax(0, 1fr))'
                  },
                  columnGap: 8,
                  rowGap: 3
                }}
              >
                <InfoItem label="Họ và tên" value={user.fullName ?? ''} />

                <InfoItem
                  label="Ngày sinh"
                  value={formatDate(user.dateOfBirth)}
                />

                <InfoItem label="Giới tính" value={user.gender ?? ''} />

                <InfoItem
                  label="Số điện thoại"
                  value={formatPhone(user.phone)}
                />

                <InfoItem label="CCCD" value={formatCccd(user.cccd)} />

                <InfoItem label="Email" value={formatEmail(user.email)} />

                <InfoItem label="Địa chỉ" value={user.address ?? ''} />

                <InfoItem label="Vai trò" value={user?.role?.role_name || ''} />
              </Box>
            ) : (
              /* ================= EDIT ================= */
              <Box component="form" onSubmit={handleSubmit(handleSaveProfile)}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(2, minmax(0, 1fr))'
                    },
                    gap: 2
                  }}
                >
                  <TextField
                    label="Họ và tên"
                    fullWidth
                    size="small"
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
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(value) => {
                          field.onChange(
                            value && value.isValid()
                              ? value.format('YYYY-MM-DD')
                              : ''
                          )
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: Boolean(errors.dateOfBirth),
                            helperText: errors.dateOfBirth?.message
                          }
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Giới tính"
                        fullWidth
                        size="small"
                        value={field.value ?? ''}
                        error={Boolean(errors.gender)}
                        helperText={errors.gender?.message}
                      >
                        <MenuItem value="Nam">Nam</MenuItem>

                        <MenuItem value="Nữ">Nữ</MenuItem>

                        <MenuItem value="Khác">Khác</MenuItem>
                      </TextField>
                    )}
                  />

                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    size="small"
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
                    fullWidth
                    size="small"
                    {...register('cccd', {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, '')
                      }
                    })}
                    error={Boolean(errors.cccd)}
                    helperText={errors.cccd?.message}
                    slotProps={{
                      htmlInput: {
                        maxLength: 12,
                        inputMode: 'numeric'
                      }
                    }}
                  />

                  <TextField
                    label="Email"
                    value={user.email ?? ''}
                    disabled
                    fullWidth
                    size="small"
                  />

                  <TextField
                    label="Địa chỉ"
                    fullWidth
                    size="small"
                    {...register('address')}
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message}
                    slotProps={{
                      htmlInput: {
                        maxLength: 255
                      }
                    }}
                  />

                  <TextField
                    label="Vai trò"
                    value={user?.role.role_name || ''}
                    disabled
                    fullWidth
                    size="small"
                  />
                </Box>

                {/* BUTTON */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1.5,
                    mt: 3
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    startIcon={<CloseOutlinedIcon />}
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveOutlinedIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          <Divider />

          {/* HỒ SƠ TIÊM CHỦNG */}
          {isPatient && (
            <Box sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Hồ sơ tiêm chủng
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  boxShadow: 'none'
                }}
              >
                <Box
                  sx={{
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
                    <VaccinesOutlinedIcon color="primary" />

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        Lịch sử và hồ sơ đã tiêm
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Xem các mũi đã tiêm, lịch sắp tiêm và phản hồi sau tiêm.
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    onClick={() => setVaccinationHistoryOpen(true)}
                  >
                    Xem hồ sơ
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}
        </Paper>
      </Box>
      {user && (
        <VaccinationHistoryDialog
          open={vaccinationHistoryOpen}
          onClose={() => setVaccinationHistoryOpen(false)}
          userId={user.user_id}
        />
      )}
    </Box>
  )
}

type InfoItemProps = {
  label: string
  value: string
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '120px 12px minmax(0, 1fr)',
        alignItems: 'center',
        minWidth: 0
      }}
    >
      <Typography
        sx={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'text.primary'
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: '15px',
          color: 'text.secondary'
        }}
      ></Typography>

      <Typography
        sx={{
          fontSize: '15px',
          fontWeight: 500,
          color: 'text.primary',
          overflowWrap: 'anywhere'
        }}
      >
        {value || '-'}
      </Typography>
    </Box>
  )
}
export default Profile
