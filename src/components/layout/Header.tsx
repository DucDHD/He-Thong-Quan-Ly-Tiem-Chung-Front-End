'use client'

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import { Avatar, Box, Divider, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined'
import { logoutAPI } from '@/services/auth.service'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

function Header() {
  const theme = useTheme()
  const { user } = useAuth()

  const SIDEBAR_WIDTH = theme.layout.sidebarWidth
  const router = useRouter()

  const [openProfileMenu, setOpenProfileMenu] = useState(false)

  const handleProfile = () => {
    setOpenProfileMenu(false)
    router.push('/profile')
  }

  const handleLogout = async () => {
    try {
      setOpenProfileMenu(false)

      await logoutAPI()

      router.replace('/login')
      router.refresh()
    } catch {
      toast.error('Đăng xuất thất bại:')
    }
  }
  const handleFeedback = () => {
    setOpenProfileMenu(false)
    router.push('/feedback')
  }

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: SIDEBAR_WIDTH,
        height: 82,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#fff',
        borderBottom: '1px solid #e9edf3',
        zIndex: 1100
      }}
    >
      <Box
        sx={{
          flexGrow: 1
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: '#172b3a'
          }}
        >
          Hệ thống quản lý tiêm chủng
        </Typography>

        <Typography
          sx={{
            mt: 0.3,
            fontSize: 12,
            color: 'text.secondary'
          }}
        >
          Trung tâm y tế dự phòng
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center'
        }}
      >
        {/* Click ra ngoài để đóng menu */}
        {openProfileMenu && (
          <Box
            onClick={() => setOpenProfileMenu(false)}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1101
            }}
          />
        )}

        {/* Profile */}
        <Box
          sx={{
            position: 'relative',
            width: 220,
            zIndex: 1102
          }}
        >
          <Box
            onClick={() => setOpenProfileMenu(!openProfileMenu)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%',
              boxSizing: 'border-box',
              px: 1.8,
              py: 1,
              borderRadius: 2.5,
              cursor: 'pointer',
              userSelect: 'none',
              '&:hover': {
                bgcolor: '#f5f7fa'
              }
            }}
          >
            <Avatar
              src="/images/photo2.png"
              alt="Admin"
              sx={{
                width: 55,
                height: 55,
                bgcolor: '#e8f1ff',
                color: '#2f80ed'
              }}
            >
              <AccountCircleOutlinedIcon
                sx={{
                  fontSize: 28
                }}
              />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#172b3a',
                  lineHeight: 1.3
                }}
              >
                {user?.fullName}
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: 12,
                  color: 'text.secondary'
                }}
              >
                {user?.role?.role_name}
              </Typography>
            </Box>
          </Box>

          {/* Dropdown */}
          {openProfileMenu && (
            <Box
              sx={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                width: '100%',
                boxSizing: 'border-box',
                bgcolor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 2.5,
                boxShadow: '0 10px 35px rgba(31, 55, 78, 0.15)',
                overflow: 'hidden',
                zIndex: 1103
              }}
            >
              <Box
                onClick={handleProfile}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minHeight: 46,
                  px: 2,
                  cursor: 'pointer',
                  color: '#374151',
                  '&:hover': {
                    bgcolor: '#f5f7fa'
                  }
                }}
              >
                <PersonOutlineRoundedIcon
                  sx={{
                    fontSize: 20,
                    color: '#6b7280'
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 14
                  }}
                >
                  Hồ sơ cá nhân
                </Typography>
              </Box>
              <Box
                onClick={handleFeedback}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minHeight: 46,
                  px: 2,
                  cursor: 'pointer',
                  color: '#374151',
                  '&:hover': {
                    bgcolor: '#f5f7fa'
                  }
                }}
              >
                <FeedbackOutlinedIcon
                  sx={{
                    fontSize: 20,
                    color: '#6b7280'
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 14
                  }}
                >
                  Phản hồi cấp cao
                </Typography>
              </Box>

              <Divider />

              <Box
                onClick={handleLogout}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minHeight: 46,
                  px: 2,
                  cursor: 'pointer',
                  color: '#ef4444',
                  '&:hover': {
                    bgcolor: '#fff5f5'
                  }
                }}
              >
                <LogoutRoundedIcon
                  sx={{
                    fontSize: 20
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 14
                  }}
                >
                  Đăng xuất
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

export default Header
