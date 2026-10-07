'use client'

import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import { toast } from 'react-toastify'
import { resendAPI, verifyAPI } from '@/services/auth.service'

const OTP_LENGTH = 6

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = searchParams.get('email') ?? ''

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))

  const [expiredAt, setExpiredAt] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  const [loading, setLoading] = useState(false)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const [otpError, setOtpError] = useState('')

  // Countdown dựa vào thời gian hết hạn backend trả về
  const calculateTimeLeft = (expiredTime: string) => {
    return Math.max(
      0,
      Math.ceil((new Date(expiredTime).getTime() - Date.now()) / 1000)
    )
  }

  useEffect(() => {
    const storedExpiredAt = sessionStorage.getItem('codeExpiredAt')

    const timeout = setTimeout(() => {
      setExpiredAt(storedExpiredAt)

      if (storedExpiredAt) {
        setTimeLeft(calculateTimeLeft(storedExpiredAt))
      } else {
        setTimeLeft(0)
      }
    }, 0)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!expiredAt) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiredAt))
    }, 1000)

    return () => clearInterval(timer)
  }, [expiredAt])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Nhập từng số OTP
  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/\D/g, '')

    const newOtp = [...otp]

    if (!value) {
      newOtp[index] = ''
      setOtp(newOtp)

      return
    }

    newOtp[index] = value.slice(-1)

    setOtp(newOtp)

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Backspace quay về ô trước
  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Copy / Paste toàn bộ OTP
  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()

    const pastedValue = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH)

    if (!pastedValue) return

    const newOtp = Array(OTP_LENGTH).fill('')

    pastedValue.split('').forEach((number, index) => {
      newOtp[index] = number
    })

    setOtp(newOtp)

    const focusIndex = Math.min(pastedValue.length, OTP_LENGTH)

    inputRefs.current[
      focusIndex === OTP_LENGTH ? OTP_LENGTH - 1 : focusIndex
    ]?.focus()
  }

  // Verify OTP
  const handleVerify = async () => {
    const codeId = otp.join('')

    try {
      setLoading(true)
      await verifyAPI({ email, codeId: codeId })

      sessionStorage.removeItem('codeExpiredAt')
      toast.success('Xác thực tài khoản thành công')

      router.push('/login')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message

        setOtpError(
          Array.isArray(message)
            ? message[0]
            : message || 'Xác thực tài khoản thất bại'
        )
        return
      }
      toast.error('Mã OTP không chính xác hoặc đã hết hạn')
    } finally {
      setLoading(false)
    }
  }

  // Gửi lại OTP
  const handleResend = async () => {
    try {
      setLoading(true)

      const response = await resendAPI(email)

      const newExpiredAt = response.codeExpiredAt

      sessionStorage.setItem('codeExpiredAt', newExpiredAt)

      setExpiredAt(newExpiredAt)
      setTimeLeft(calculateTimeLeft(newExpiredAt))

      setOtp(Array(OTP_LENGTH).fill(''))
      setOtpError('')

      toast.success(response.message)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message

        setOtpError(
          Array.isArray(message)
            ? message[0]
            : message || 'Xác thực tài khoản thất bại'
        )
        return
      }
    } finally {
      setLoading(false)
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
        p: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: 4,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack
          sx={{
            gap: 3,
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              width: 54,
              height: 54,
              bgcolor: 'primary.main',
              color: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MarkEmailReadOutlinedIcon />
          </Box>

          <Box
            sx={{
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700
              }}
            >
              Xác thực tài khoản
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 1
              }}
            >
              Mã xác thực đã được gửi đến
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mt: 0.5
              }}
            >
              {email}
            </Typography>
          </Box>

          <Stack
            sx={{
              flexDirection: 'row',
              gap: 1,
              justifyContent: 'center'
            }}
          >
            {otp.map((value, index) => (
              <Box
                key={index}
                component="input"
                ref={(element: HTMLInputElement | null) => {
                  inputRefs.current[index] = element
                }}
                value={value}
                inputMode="numeric"
                maxLength={1}
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                sx={{
                  width: 48,
                  height: 52,
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  outline: 'none',
                  bgcolor: '#fff',
                  transition: '0.2s',
                  '&:focus': {
                    borderColor: 'primary.main',
                    borderWidth: 2
                  }
                }}
              />
            ))}
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary'
            }}
          >
            {timeLeft === null ? (
              'Đang kiểm tra...'
            ) : timeLeft <= 0 ? (
              <Box
                component="span"
                sx={{
                  color: 'error.main',
                  fontWeight: 600
                }}
              >
                Mã OTP đã hết hạn
              </Box>
            ) : otpError ? (
              <Box
                component="span"
                sx={{
                  color: 'error.main',
                  fontWeight: 600
                }}
              >
                {otpError}
              </Box>
            ) : (
              <>
                Mã còn hiệu lực:{' '}
                <Box
                  component="span"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700
                  }}
                >
                  {formatTime(timeLeft)}
                </Box>
              </>
            )}
          </Typography>

          <Button
            type="button"
            variant="contained"
            fullWidth
            disabled={
              loading || timeLeft <= 0 || otp.join('').length !== OTP_LENGTH
            }
            onClick={handleVerify}
            sx={{
              height: 48,
              fontWeight: 600
            }}
          >
            {loading ? 'Đang xác thực...' : 'Xác thực'}
          </Button>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary'
              }}
            >
              Chưa nhận được mã?
            </Typography>

            <Button
              type="button"
              variant="text"
              size="small"
              disabled={timeLeft > 0}
              onClick={handleResend}
              sx={{
                ml: 0.5,
                textTransform: 'none'
              }}
            >
              {loading
                ? 'Đang gửi...'
                : timeLeft > 0
                  ? `Gửi lại mã sau: ${formatTime(timeLeft)}`
                  : 'Gửi lại mã'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
