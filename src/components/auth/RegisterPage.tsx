'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { registerAPI } from '@/services/auth.service'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(30, 'Tên đăng nhập không được vượt quá 30 ký tự')
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      'Tên đăng nhập chỉ gồm chữ, số, dấu chấm, gạch dưới hoặc gạch ngang'
    ),

  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập email')
    .max(100, 'Email không được vượt quá 100 ký tự')
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: 'Email không đúng định dạng'
    }),

  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được vượt quá 50 ký tự')
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  })

  const handleRegister = async (data: RegisterFormData) => {
    const user = {
      fullName: data.fullName,
      email: data.email,
      password: data.password
    }
    try {
      const response = await registerAPI(user)

      sessionStorage.setItem('codeExpiredAt', response.codeExpiredAt)
      Cookies.set('pendingVerify', 'true', {
        expires: 5 / (24 * 60),
        path: '/'
      })

      toast.success('Đăng ký tài khoản thành công')

      router.push(`/verify?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data?.message

        if (status === 409) {
          setError('email', { type: 'server', message: message })
        }
        return
      }
      toast.error('Đăng ký tài khoản thất bại')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f7fb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 460,
          bgcolor: '#fff',
          borderRadius: 3,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 4,
            pt: 3.5,
            pb: 2,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5
            }}
          >
            <PersonAddAlt1OutlinedIcon />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 0.5
            }}
          >
            Đăng Ký Tài Khoản
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Đăng ký tài khoản khách hàng
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(handleRegister)}
          noValidate
          sx={{
            px: 4,
            pb: 3.5
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {/* fullName */}
            <TextField
              label="Họ và Tên"
              fullWidth
              autoComplete="off"
              required
              {...register('fullName')}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
              slotProps={{
                htmlInput: {
                  maxLength: 30,
                  autoComplete: 'off'
                }
              }}
            />

            {/* Email */}
            <TextField
              label="Email"
              type="email"
              fullWidth
              autoComplete="off"
              required
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              slotProps={{
                htmlInput: {
                  maxLength: 100,
                  autoComplete: 'off'
                }
              }}
            />

            {/* Password */}
            <TextField
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              fullWidth
              autoComplete="off"
              required
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                },
                htmlInput: {
                  maxLength: 50,
                  autoComplete: 'off'
                }
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            startIcon={<PersonAddAlt1OutlinedIcon />}
            disabled={isSubmitting}
            sx={{
              mt: 3,
              height: 48,
              fontWeight: 600
            }}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>

          <Box
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?
            </Typography>

            <Button
              type="button"
              size="small"
              startIcon={<LoginOutlinedIcon />}
              onClick={() => router.push('/login')}
              sx={{
                textTransform: 'none'
              }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default RegisterPage
