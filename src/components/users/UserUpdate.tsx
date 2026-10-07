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
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import axios from 'axios'
import { toast } from 'react-toastify'

import {
  getUserById,
  getRoles,
  updateUser,
  type Role
} from '@/services/user.service'
import { useRouter, useSearchParams } from 'next/navigation'

import { formatCccd, formatPhone } from '@/utils/format'

// ======================================================
// VALIDATION
// ======================================================

const userEditSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),

  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .refine(
      (value) => /^0\d{9}$/.test(value.replace(/\D/g, '')),
      'Số điện thoại phải gồm 10 số và bắt đầu bằng 0'
    ),

  cccd: z
    .string()
    .min(1, 'Vui lòng nhập CCCD')
    .refine(
      (value) => /^\d{12}$/.test(value.replace(/\D/g, '')),
      'CCCD phải gồm đúng 12 chữ số'
    ),

  address: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),

  dateOfBirth: z.string().min(1, 'Vui lòng chọn ngày sinh'),

  gender: z.string().min(1, 'Vui lòng chọn giới tính'),

  role_id: z
    .number({
      message: 'Vui lòng chọn vai trò'
    })
    .min(1, 'Vui lòng chọn vai trò')
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
  const [roles, setRoles] = useState<Role[]>([])
  const [email, setEmail] = useState('')

  const searchParams = useSearchParams()
  const currentPage = searchParams.get('currentPage') || '1'
  const from = searchParams.get('from')

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),
    mode: 'onTouched',

    defaultValues: {
      fullName: '',
      phone: '',
      cccd: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      role_id: undefined
    }
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, rolesData] = await Promise.all([
          getUserById(Number(userId)),
          getRoles()
        ])

        setRoles(rolesData.filter((role) => role.role_code !== 5))
        setEmail(user.email || '')

        reset({
          fullName: user.fullName,
          phone: formatPhone(user.phone),
          cccd: formatCccd(user.cccd),
          address: user.address || '',
          dateOfBirth: user.dateOfBirth || '',
          gender: user.gender || '',
          role_id: user.role.role_id
        })
      } catch (error) {
        console.error(error)
        toast.error('Không thể tải thông tin nhân viên')
      }
    }

    fetchData()
  }, [userId, reset])

  const handleBack = () => {
    if (from === 'detail') {
      router.push(`/users/detail/${userId}?currentPage=${currentPage}`)
      return
    }

    router.push(`/users?page=${currentPage}`)
  }

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleUpdate = async (data: UserEditForm) => {
    try {
      const payload = {
        fullName: data.fullName,
        phone: data.phone.replace(/\D/g, ''),
        cccd: data.cccd.replace(/\D/g, ''),
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        role_id: Number(data.role_id)
      }

      await updateUser(Number(userId), payload)

      toast.success('Cập nhật nhân viên thành công')

      if (from === 'detail') {
        router.push(`/users/detail/${userId}?currentPage=${currentPage}`)
        return
      }

      router.push(`/users?page=${currentPage}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const field = error.response?.data?.field
        const message = error.response?.data?.message

        if ((field === 'phone' || field === 'cccd') && message) {
          setError(field, {
            type: 'server',
            message
          })

          return
        }
      }

      toast.error('Cập nhật nhân viên thất bại')
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

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(handleUpdate)}
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
              {/* 1. HỌ VÀ TÊN */}
              <TextField
                label="Họ và tên"
                required
                fullWidth
                placeholder="Nhập họ và tên"
                {...register('fullName')}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  },
                  htmlInput: {
                    minLength: 2,
                    maxLength: 100
                  }
                }}
              />

              {/* 2. PHÂN QUYỀN */}
              <Controller
                name="role_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Vai trò"
                    required
                    fullWidth
                    value={field.value ?? ''}
                    onChange={(event) => {
                      field.onChange(Number(event.target.value))
                    }}
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
                )}
              />
              {/* 3. EMAIL */}
              <TextField
                label="Email"
                required
                fullWidth
                type="email"
                disabled
                value={email}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
              />

              {/* 4. SỐ ĐIỆN THOẠI */}
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
                  inputLabel: {
                    shrink: true
                  },
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* 5. ĐỊA CHỈ */}
              <TextField
                label="Địa chỉ"
                required
                fullWidth
                placeholder="Nhập địa chỉ"
                {...register('address')}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  },
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* 6. CCCD */}
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
                  inputLabel: {
                    shrink: true
                  },
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* 7. GIỚI TÍNH */}
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

              {/* 8. NGÀY SINH */}
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
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    md: 'block'
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
