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

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên đăng nhập')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),

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
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('')

    // TODO: Thay bằng API login khi làm backend
    console.log('Login:', data)

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock login
    if (data.username === 'admin' && data.password === '123456') {
      router.push('/vaccination-schedules')
      return
    }

    setLoginError('Tên đăng nhập hoặc mật khẩu không chính xác')
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
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            px: 4,
            pb: 4
          }}
        >
          {loginError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2
              }}
            >
              {loginError}
            </Alert>
          )}

          {/* USERNAME */}
          <TextField
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            required
            fullWidth
            autoFocus
            autoComplete="username"
            {...register('username', {
              onChange: () => {
                if (loginError) {
                  setLoginError('')
                }
              }
            })}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleOutlinedIcon color="action" />
                  </InputAdornment>
                )
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
                if (loginError) {
                  setLoginError('')
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
              onClick={() => {
                // TODO: Làm màn quên mật khẩu sau
                console.log('Forgot password')
              }}
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
