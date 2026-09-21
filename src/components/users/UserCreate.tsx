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

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// ======================================================
// VALIDATION
// ======================================================

const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên đăng nhập')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(30, 'Tên đăng nhập không được vượt quá 30 ký tự')
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      'Tên đăng nhập chỉ được chứa chữ, số, dấu chấm, gạch dưới và gạch ngang'
    ),

  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được vượt quá 50 ký tự'),

  role: z.string().min(1, 'Vui lòng chọn phân quyền'),

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

  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^0\d{9}$/, 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0'),

  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập email')
    .max(100, 'Email không được vượt quá 100 ký tự')
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: 'Email không đúng định dạng'
    }),

  identityNumber: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập CCCD')
    .length(12, 'CCCD phải gồm đúng 12 chữ số')
    .regex(/^\d{12}$/, 'CCCD chỉ được chứa chữ số'),

  address: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập nơi ở')
    .min(5, 'Nơi ở phải có ít nhất 5 ký tự')
    .max(255, 'Nơi ở không được vượt quá 255 ký tự'),

  description: z.string().trim().max(500, 'Mô tả không được vượt quá 500 ký tự')
})

type UserFormData = z.infer<typeof userSchema>

// ======================================================
// COMPONENT
// ======================================================

const UserCreate = () => {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),

    mode: 'onTouched',

    defaultValues: {
      username: '',
      password: '',
      role: '',
      fullName: '',
      phone: '',
      email: '',
      identityNumber: '',
      address: '',
      description: ''
    }
  })

  const description = watch('description') ?? ''

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.back()
  }

  // ====================================================
  // SUBMIT
  // ====================================================

  const onSubmit = async (data: UserFormData) => {
    const payload = {
      username: data.username,
      password: data.password,
      role: data.role,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      identityNumber: data.identityNumber,
      address: data.address,
      description: data.description
    }

    console.log('Create user:', payload)

    // ==================================================
    // TODO: CALL API
    // ==================================================
    //
    // Sau này gọi API:
    //
    // await createUser(payload)
    //
    // Sau khi thành công:
    //
    // router.push('/users')

    reset()
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

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
              {/* USERNAME */}
              {/* ========================================= */}

              <TextField
                label="Tên đăng nhập"
                required
                fullWidth
                autoFocus
                placeholder="VD: nguyenvana"
                {...register('username')}
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                slotProps={{
                  htmlInput: {
                    minLength: 3,
                    maxLength: 30
                  }
                }}
              />

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
              {/* ROLE */}
              {/* ========================================= */}

              <TextField
                select
                label="Phân quyền"
                required
                fullWidth
                defaultValue=""
                {...register('role')}
                error={Boolean(errors.role)}
                helperText={errors.role?.message}
              >
                <MenuItem value="">
                  <em>Chọn phân quyền</em>
                </MenuItem>

                <MenuItem value="admin">Quản trị viên</MenuItem>

                <MenuItem value="doctor">Bác sĩ</MenuItem>

                <MenuItem value="nurse">Điều dưỡng</MenuItem>

                <MenuItem value="staff">Nhân viên</MenuItem>
              </TextField>

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
              {/* PHONE */}
              {/* ========================================= */}

              <TextField
                label="Số điện thoại"
                required
                fullWidth
                placeholder="VD: 0901234567"
                {...register('phone', {
                  onChange: (event) => {
                    event.target.value = event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 10)
                  }
                })}
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                slotProps={{
                  htmlInput: {
                    minLength: 10,
                    maxLength: 10,
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
                placeholder="Nhập 12 số CCCD"
                {...register('identityNumber', {
                  onChange: (event) => {
                    event.target.value = event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 12)
                  }
                })}
                error={Boolean(errors.identityNumber)}
                helperText={errors.identityNumber?.message}
                slotProps={{
                  htmlInput: {
                    minLength: 12,
                    maxLength: 12,
                    inputMode: 'numeric'
                  }
                }}
              />

              {/* ========================================= */}
              {/* ADDRESS */}
              {/* ========================================= */}

              <TextField
                label="Nơi ở"
                required
                fullWidth
                placeholder="Nhập nơi ở"
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

              {/* ========================================= */}
              {/* DESCRIPTION */}
              {/* ========================================= */}

              <TextField
                label="Mô tả"
                fullWidth
                multiline
                minRows={3}
                maxRows={5}
                placeholder="Nhập mô tả hoặc ghi chú..."
                {...register('description')}
                error={Boolean(errors.description)}
                helperText={
                  errors.description?.message ||
                  `${description.length}/500 ký tự`
                }
                slotProps={{
                  htmlInput: {
                    maxLength: 500
                  }
                }}
                sx={{
                  gridColumn: {
                    xs: 'auto',
                    md: '1 / -1'
                  }
                }}
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
