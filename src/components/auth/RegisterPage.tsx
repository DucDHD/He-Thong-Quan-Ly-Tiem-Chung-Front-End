'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

const registerSchema = z.object({
  username: z
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
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password
    }

    console.log('Register customer:', payload)

    // TODO: Backend
    //
    // await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(payload)
    // })

    await new Promise((resolve) => setTimeout(resolve, 500))

    router.push('/login')
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
          onSubmit={handleSubmit(onSubmit)}
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
            {/* Username */}
            <TextField
              label="Tên đăng nhập"
              placeholder="VD: nguyenvanan"
              fullWidth
              required
              {...register('username')}
              error={Boolean(errors.username)}
              helperText={errors.username?.message}
              slotProps={{
                htmlInput: {
                  maxLength: 30
                }
              }}
            />

            {/* Email */}
            <TextField
              label="Email"
              type="email"
              placeholder="VD: nguyenvanan@gmail.com"
              fullWidth
              required
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              slotProps={{
                htmlInput: {
                  maxLength: 100
                }
              }}
            />

            {/* Password */}
            <TextField
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              fullWidth
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
                  maxLength: 50
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
