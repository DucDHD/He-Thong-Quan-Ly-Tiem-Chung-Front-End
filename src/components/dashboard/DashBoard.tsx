'use client'

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import { useAuth } from '@/contexts/AuthContext'

const featureCards = [
  {
    title: 'Tài chính',
    description: 'Quản lý thu chi và thông tin tài chính',
    path: '/finance',
    icon: <AccountBalanceWalletOutlinedIcon />
  },
  {
    title: 'Kho vaccine',
    description: 'Theo dõi vaccine và quản lý kho bãi',
    path: '/warehouse',
    icon: <Inventory2OutlinedIcon />
  },
  {
    title: 'Nhân viên y tế',
    description: 'Quản lý thông tin nhân viên y tế',
    path: '/medical-staff',
    icon: <MedicalServicesOutlinedIcon />
  },
  {
    title: 'Chăm sóc khách hàng',
    description: 'Quản lý và hỗ trợ khách hàng',
    path: '/customer-care',
    icon: <PeopleAltOutlinedIcon />
  },
  {
    title: 'Lịch tiêm chủng',
    description: 'Theo dõi và quản lý lịch tiêm',
    path: '/vaccination-schedules',
    icon: <CalendarMonthOutlinedIcon />
  },
  {
    title: 'Feedback khách hàng',
    description: 'Tiếp nhận và quản lý phản hồi',
    path: '/feedback',
    icon: <FeedbackOutlinedIcon />
  }
]

function DashBoard() {
  const theme = useTheme()
  const router = useRouter()

  const { user } = useAuth()

  const SIDEBAR_WIDTH = theme.layout.sidebarWidth
  const HEADER_HEIGHT = theme.layout.headerHeight
  const FOOTER_HEIGHT = theme.layout.footerHeight

  return (
    <Box
      component="main"
      sx={{
        ml: SIDEBAR_WIDTH,
        pt: '82px',
        minHeight: `calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT})`
      }}
    >
      <Box
        sx={{
          maxWidth: 1500,
          mx: 'auto',
          p: 4
        }}
      >
        {/* Title */}
        <Box sx={{ mb: 3 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: '#172b3a'
            }}
          >
            Tổng quan
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 14,
              color: 'text.secondary'
            }}
          >
            Chào mừng bạn quay trở lại hệ thống quản lý tiêm chủng.
          </Typography>
        </Box>

        {/* Welcome banner */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            mb: 4,
            p: {
              xs: 3,
              md: 4
            },
            borderRadius: 4,
            color: '#fff',
            background: 'linear-gradient(120deg, #1769aa 0%, #2f80ed 100%)'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -110,
              right: -50,
              width: 240,
              height: 240,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.08)'
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              right: 160,
              bottom: -100,
              width: 150,
              height: 150,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.06)'
            }}
          />

          <Box
            sx={{
              position: 'relative'
            }}
          >
            <Typography
              sx={{
                mb: 1,
                fontSize: 13,
                opacity: 0.8
              }}
            >
              HỆ THỐNG QUẢN LÝ TIÊM VACCINE
            </Typography>

            <Typography
              sx={{
                mb: 1,
                fontSize: {
                  xs: 26,
                  md: 34
                },
                fontWeight: 700
              }}
            >
              Xin chào, {user?.fullName}
            </Typography>
          </Box>
        </Box>

        {/* Feature heading */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: '#172b3a'
            }}
          >
            Chức năng quản lý
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: 13,
              color: 'text.secondary'
            }}
          >
            Truy cập nhanh các chức năng của hệ thống
          </Typography>
        </Box>

        {/* Feature cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 2.5
          }}
        >
          {featureCards.map((item) => (
            <Card
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{
                border: '1px solid #e8edf3',
                borderRadius: 3,
                boxShadow: '0 3px 14px rgba(31, 55, 78, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#cddff5',
                  boxShadow: '0 10px 30px rgba(31, 55, 78, 0.10)'
                }
              }}
            >
              <CardContent
                sx={{
                  p: '24px !important'
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      borderRadius: 3,
                      bgcolor: '#edf5ff',
                      color: '#2f80ed'
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Box
                    sx={{
                      flexGrow: 1
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#253746'
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 12,
                        lineHeight: 1.5,
                        color: 'text.secondary'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>

                  <ChevronRightRoundedIcon
                    sx={{
                      color: '#a7b4c0'
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default DashBoard
