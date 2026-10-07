'use client'

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { loginAPI } from '@/services/auth.service'
import { toast } from 'react-toastify'
import axios from 'axios'

const loginSchema = z.object({
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

  rememberMe: z.boolean()
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const handleLogin = async (data: LoginFormData) => {
    try {
      setLoginError('')
      await loginAPI(data)

      router.push('/dashboard')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status

        if (status === 401) {
          setError('email', {
            type: 'server',
            message: 'Email hoặc mật khẩu chưa đúng'
          })
          return
        }

        if (status === 403) {
          setError('email', {
            type: 'server',
            message: 'Tài khoản chưa được kích hoạt'
          })
          return
        }
      }

      toast.error('Đăng nhập không thành công')
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f7fb',
        px: 2,
        py: 4,
        boxSizing: 'border-box'
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 430,
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#fff',
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)'
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 4,
            pt: 4,
            pb: 2,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 2,
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <VaccinesOutlinedIcon
              sx={{
                fontSize: 34
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 0.5
            }}
          >
            Đăng nhập
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Hệ thống quản lý tiêm chủng
          </Typography>
        </Box>

        {/* FORM */}
        <Box
          component="form"
          noValidate
          method="post"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void handleSubmit(handleLogin)(event)
          }}
          sx={{
            px: 4,
            pb: 4
          }}
        >
          {/* USERNAME */}
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            autoComplete="email"
            placeholder="VD: admin@gmail.com"
            {...register('email', {
              onChange: () => {
                if (errors.email?.type === 'server') {
                  clearErrors('email')
                }
              }
            })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleOutlinedIcon color="action" />
                  </InputAdornment>
                )
              },
              htmlInput: {
                maxLength: 100
              }
            }}
            sx={{
              mb: 2
            }}
          />

          {/* PASSWORD */}
          <TextField
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            required
            fullWidth
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password', {
              onChange: () => {
                if (errors.email?.type === 'server') {
                  clearErrors('email')
                }
              }
            })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
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

          {/* REMEMBER + FORGOT */}
          <Box
            sx={{
              mt: 0.5,
              mb: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1
            }}
          >
            <FormControlLabel
              control={<Checkbox size="small" {...register('rememberMe')} />}
              label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>}
            />

            <Button
              type="button"
              variant="text"
              size="small"
              sx={{
                textTransform: 'none',
                whiteSpace: 'nowrap'
              }}
              onClick={() => {}}
            >
              Quên mật khẩu?
            </Button>
          </Box>

          {/* LOGIN BUTTON */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting}
            sx={{
              height: 48,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 600
            }}
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          {/* REGISTER */}
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
              Chưa có tài khoản?
            </Typography>

            <Button
              type="button"
              variant="text"
              size="small"
              onClick={() => router.push('/register')}
              sx={{
                minWidth: 'auto',
                p: 0.5,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Đăng ký ngay
            </Button>
          </Box>

          {/* MOCK ACCOUNT */}
          <Box
            sx={{
              mt: 3,
              p: 1.5,
              bgcolor: '#f8fafc',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            ...
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default Login
