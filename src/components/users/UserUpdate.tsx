'use client'

import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// ======================================================
// VALIDATION
// ======================================================

const userEditSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên đăng nhập')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(30, 'Tên đăng nhập không được vượt quá 30 ký tự'),

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

type UserEditForm = z.infer<typeof userEditSchema>

type UserEditProps = {
  userId: string
}

// ======================================================
// COMPONENT
// ======================================================

const UserEdit = ({ userId }: UserEditProps) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),

    mode: 'onTouched',

    defaultValues: {
      username: '',
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
  // LOAD USER
  // ====================================================

  useEffect(() => {
    // TODO:
    // Sau này gọi API:
    //
    // GET /users/:id

    const user = {
      id: userId,

      username: 'nguyenvanminh',

      role: 'doctor',

      fullName: 'Nguyễn Văn Minh',

      phone: '0901234567',

      email: 'minh.nguyen@gmail.com',

      identityNumber: '048085002345',

      address: 'Sơn Trà, Đà Nẵng',

      description: 'Bác sĩ phụ trách tiêm chủng'
    }

    reset({
      username: user.username,

      role: user.role,

      fullName: user.fullName,

      phone: user.phone,

      email: user.email,

      identityNumber: user.identityNumber,

      address: user.address,

      description: user.description
    })
  }, [userId, reset])

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.back()
  }

  // ====================================================
  // SUBMIT
  // ====================================================

  const onSubmit = async (data: UserEditForm) => {
    const payload = {
      role: data.role,

      fullName: data.fullName,

      phone: data.phone,

      email: data.email,

      identityNumber: data.identityNumber,

      address: data.address,

      description: data.description
    }

    console.log('Update user:', userId, payload)

    // TODO:
    // await updateUser(
    //   userId,
    //   payload
    // )

    // Sau khi cập nhật thành công:
    // router.push('/users')
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
              <EditOutlinedIcon />
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
                Chỉnh sửa nhân viên
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Cập nhật thông tin tài khoản nhân viên
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
                fullWidth
                required
                disabled
                {...register('username')}
                error={Boolean(errors.username)}
                helperText={
                  errors.username?.message || 'Tên đăng nhập không thể thay đổi'
                }
              />

              {/* ========================================= */}
              {/* ROLE */}
              {/* ========================================= */}

              <TextField
                select
                label="Phân quyền"
                fullWidth
                required
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
                fullWidth
                required
                placeholder="VD: Nguyễn Văn Minh"
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
                fullWidth
                required
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
                fullWidth
                required
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
                fullWidth
                required
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
                fullWidth
                required
                placeholder="VD: Sơn Trà, Đà Nẵng"
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
              {/* EMPTY CELL */}
              {/* ========================================= */}

              <Box
                sx={{
                  display: {
                    xs: 'none',
                    md: 'block'
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
                placeholder="Nhập mô tả nếu có..."
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
            {/* ACTIONS */}
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
                startIcon={<SaveOutlinedIcon />}
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

export default UserEdit
