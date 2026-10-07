'use client'

import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import { z } from 'zod'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import dayjs from 'dayjs'

import { createUser, getRoles, type Role } from '@/services/user.service'
import axios from 'axios'
import { toast } from 'react-toastify'
import { formatCccd, formatPhone } from '@/utils/format'

// ======================================================
// VALIDATION
// ======================================================

const userSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),

  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập email')
    .email('Email không đúng định dạng')
    .max(100, 'Email không được vượt quá 100 ký tự'),

  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),

  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^0\d{9}$/, 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0'),

  cccd: z
    .string()
    .min(1, 'Vui lòng nhập CCCD')
    .regex(/^\d{12}$/, 'CCCD phải gồm đúng 12 chữ số'),

  dateOfBirth: z.string().min(1, 'Vui lòng chọn ngày sinh'),

  gender: z.string().min(1, 'Vui lòng chọn giới tính'),

  address: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ')
    .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),

  role_id: z
    .number({
      message: 'Vui lòng chọn vai trò'
    })
    .min(1, 'Vui lòng chọn vai trò')
})

type UserFormData = z.infer<typeof userSchema>

// ======================================================
// COMPONENT
// ======================================================

const UserCreate = () => {
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles()

        // Không hiển thị vai trò Bệnh nhân khi tạo nhân viên
        setRoles(data.filter((role) => role.role_code !== 5))
      } catch (error) {
        console.error('Lỗi lấy danh sách vai trò:', error)
      }
    }

    fetchRoles()
  }, [])

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),

    mode: 'onTouched',

    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      cccd: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      role_id: undefined
    }
  })

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.back()
  }

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleCreate = async (data: UserFormData) => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        cccd: data.cccd,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        address: data.address,
        role_id: data.role_id
      }
      await createUser(payload)

      toast.success('Tạo Nhân viên thành công')
      reset()
      router.push('/users')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { field, message } = error.response?.data || {}

        if (field && message) {
          setError(field as keyof UserFormData, {
            type: 'server',
            message
          })

          return
        }
      }
      toast.error('Tạo nhân viên thất bại')
    }
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

        minHeight: `calc(100vh - ${theme.layout.footerHeight})`,

        bgcolor: '#f5f7fb',

        boxSizing: 'border-box'
      })}
    >
      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <Box
        sx={{
          width: '100%',

          p: 3,

          boxSizing: 'border-box'
        }}
      >
        {/* ================================================= */}
        {/* PAPER FULL WIDTH */}
        {/* ================================================= */}

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
          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

          <Box
            sx={{
              px: 3,

              py: 2,

              display: 'flex',

              alignItems: 'center',

              gap: 1.5
            }}
          >
            {/* BACK */}

            <IconButton
              onClick={handleBack}
              sx={{
                width: 42,

                height: 42,

                flexShrink: 0,

                border: '1px solid',

                borderColor: 'divider',

                bgcolor: '#fff'
              }}
            >
              <ArrowBackOutlinedIcon />
            </IconButton>

            {/* ICON */}

            <Box
              sx={{
                width: 44,

                height: 44,

                flexShrink: 0,

                display: {
                  xs: 'none',
                  sm: 'flex'
                },

                alignItems: 'center',

                justifyContent: 'center',

                borderRadius: 2,

                bgcolor: 'primary.main',

                color: '#fff'
              }}
            >
              <PersonAddAltOutlinedIcon />
            </Box>

            {/* TITLE */}

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,

                  lineHeight: 1.25
                }}
              >
                Tạo tài khoản người dùng
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Tạo tài khoản đăng nhập cho nhân viên sử dụng hệ thống
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* ============================================= */}
          {/* FORM */}
          {/* ============================================= */}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(handleCreate)}
          >
            {/* =========================================== */}
            {/* FORM CONTENT */}
            {/* =========================================== */}

            <Box
              sx={{
                p: 3,

                display: 'grid',

                gridTemplateColumns: {
                  xs: '1fr',

                  md: 'repeat(2, minmax(0, 1fr))'
                },

                columnGap: 2,

                rowGap: 2
              }}
            >
              {/* ========================================= */}
              {/* FULL NAME */}
              {/* ========================================= */}

              <TextField
                label="Họ và tên"
                required
                fullWidth
                placeholder="Nhập họ và tên"
                {...register('fullName')}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName?.message}
                slotProps={{
                  htmlInput: {
                    minLength: 2,
                    maxLength: 100
                  }
                }}
              />

              {/* ========================================= */}
              {/* ROLE */}
              {/* ========================================= */}

              <TextField
                select
                label="vai trò"
                required
                fullWidth
                defaultValue=""
                {...register('role_id', {
                  valueAsNumber: true
                })}
                error={Boolean(errors.role_id)}
                helperText={errors.role_id?.message}
              >
                <MenuItem value="">
                  <em>Chọn vai trò</em>
                </MenuItem>

                {roles.map((role) => (
                  <MenuItem key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </MenuItem>
                ))}
              </TextField>

              {/* ========================================= */}
              {/* PASSWORD */}
              {/* ========================================= */}

              <TextField
                label="Mật khẩu"
                required
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                {...register('password')}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                slotProps={{
                  htmlInput: {
                    minLength: 6,
                    maxLength: 50
                  },

                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          edge="end"
                          aria-label={
                            showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                          }
                          onClick={() => setShowPassword((current) => !current)}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon />
                          ) : (
                            <VisibilityOutlinedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />

              {/* ========================================= */}
              {/* PHONE */}
              {/* ========================================= */}

              <TextField
                label="Số điện thoại"
                required
                fullWidth
                placeholder="0912.345.678"
                {...register('phone', {
                  onChange: (event) => {
                    event.target.value = formatPhone(event.target.value)
                  }
                })}
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 12,
                    inputMode: 'numeric'
                  }
                }}
              />

              {/* ========================================= */}
              {/* EMAIL */}
              {/* ========================================= */}

              <TextField
                label="Email"
                required
                fullWidth
                type="email"
                placeholder="VD: nhanvien@gmail.com"
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* ========================================= */}
              {/* CCCD */}
              {/* ========================================= */}

              <TextField
                label="CCCD"
                required
                fullWidth
                placeholder="4444-4444-4444"
                {...register('cccd', {
                  onChange: (event) => {
                    event.target.value = formatCccd(event.target.value)
                  }
                })}
                error={Boolean(errors.cccd)}
                helperText={errors.cccd?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 14,
                    inputMode: 'numeric'
                  }
                }}
              />
              {/* ========================================= */}
              {/* ADDRESS */}
              {/* ========================================= */}

              <TextField
                label="Địa Chỉ"
                required
                fullWidth
                placeholder="Nhập Địa Chỉ"
                {...register('address')}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                slotProps={{
                  htmlInput: {
                    minLength: 5,
                    maxLength: 255
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
                    value={field.value ?? ''}
                    error={Boolean(errors.gender)}
                    helperText={errors.gender?.message}
                  >
                    <MenuItem value="">
                      <em>Chọn giới tính</em>
                    </MenuItem>

                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                    <MenuItem value="Khác">Khác</MenuItem>
                  </TextField>
                )}
              />
            </Box>

            {/* =========================================== */}
            {/* DIVIDER */}
            {/* =========================================== */}

            <Divider />

            {/* =========================================== */}
            {/* ACTION */}
            {/* =========================================== */}

            <Box
              sx={{
                px: 3,

                py: 2,

                display: 'flex',

                justifyContent: 'flex-end',

                alignItems: 'center',

                gap: 1.5
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={isSubmitting}
                sx={{
                  minWidth: 110,

                  height: 40,

                  textTransform: 'none'
                }}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={<PersonAddAltOutlinedIcon />}
                sx={{
                  minWidth: 140,

                  height: 40,

                  textTransform: 'none',

                  fontWeight: 600
                }}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default UserCreate
