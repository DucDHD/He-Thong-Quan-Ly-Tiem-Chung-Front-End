'use client'

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'

import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded'
import { Divider, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'

import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
  {
    label: 'Tổng quan',
    path: '/dashboard',
    icon: <DashboardRoundedIcon />
  },
  {
    label: 'Lịch tiêm chủng',
    icon: <CalendarMonthOutlinedIcon />,
    children: [
      {
        label: 'Đăng ký lịch tiêm',
        path: '/vaccination-schedules/create'
      },
      {
        label: 'Danh Sách Lịch Tiêm',
        path: '/vaccination-schedules'
      }
    ]
  },
  {
    label: 'Nhân viên y tế',
    icon: <MedicalServicesOutlinedIcon />,
    children: [
      {
        label: 'Đăng Ký Nhân Viên',
        path: '/users/create'
      },
      {
        label: 'Danh Sách Nhân Viên',
        path: '/users'
      }
    ]
  },
  {
    label: 'Quản lý kho',
    icon: <Inventory2OutlinedIcon />,
    children: [
      {
        label: 'Xem Tình Hình Kho',
        path: '/inventory'
      },
      {
        label: 'Nhập Vắc Xin',
        path: '/inventory/import'
      },
      {
        label: 'Xuất Vắc Xin',
        path: '/inventory/export'
      }
    ]
  },
  {
    label: 'Quản Lý Bệnh Nhân',
    icon: <PeopleAltOutlinedIcon />,
    children: [
      {
        label: 'Xem Hồ Sơ Bệnh Án',
        path: '/customer/detail'
      },
      {
        label: 'Cập Nhập Hồ Sơ',
        path: '/customer/edit'
      },
      {
        label: 'Kê Đơn',
        path: '/customer/prescription'
      }
    ]
  },
  {
    label: 'Tra cứu dịch bệnh',
    icon: <CoronavirusOutlinedIcon />,
    children: [
      {
        label: 'Tra cứu dịch bệnh tại địa phương',
        path: '/disease-situation/'
      },
      {
        label: 'Thêm tra cứu bệnh dịch',
        path: '/disease-situation/create'
      }
    ]
  },
  {
    label: 'Tài chính',
    icon: <AccountBalanceWalletOutlinedIcon />,
    children: [
      {
        label: 'Quản lý giá Vaccine',
        path: '/finance/vaccine-prices'
      },
      {
        label: 'Quản Lý Giao Dịch với Khách hàng',
        path: '/finance/transaction-customer'
      },
      {
        label: 'Quản Lý Giao Dịch với Nhà Cung Cấp',
        path: '/finance/transaction-supplier'
      }
    ]
  },

  {
    label: 'Chăm sóc khách hàng',
    icon: <PeopleAltOutlinedIcon />,
    children: [
      {
        label: 'Nhắc Lịch Tiêm',
        path: '/customer-care/reminder'
      },
      {
        label: 'Tư Vấn Khách Hàng',
        path: '/customer-care/chat'
      }
    ]
  },
  {
    label: 'Feedback khách hàng',
    path: '/feedback',
    icon: <FeedbackOutlinedIcon />
  }
]

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const SIDEBAR_WIDTH = theme.layout.sidebarWidth

  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <Box
      component="aside"
      sx={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: SIDEBAR_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0f2942',
        color: '#fff',
        zIndex: 1200
      }}
    >
      {/* Logo */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          height: 82,
          px: 3,
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            borderRadius: 3,
            bgcolor: '#2f80ed'
          }}
        >
          <VaccinesRoundedIcon />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.2
            }}
          >
            Vaccine
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 11,
              color: '#91a6ba'
            }}
          >
            Hệ Thống Quản Lý
          </Typography>
        </Box>
      </Stack>

      <Divider
        sx={{
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      />

      {/* Menu */}
      <Box
        sx={{
          px: 2,
          pt: 3
        }}
      >
        <Typography
          sx={{
            px: 1.5,
            mb: 1.5,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 1,
            color: '#7890a6'
          }}
        >
          QUẢN LÝ
        </Typography>

        <List disablePadding>
          {menuItems.map((item) => {
            const hasChildren = Boolean(item.children?.length)

            const active = hasChildren
              ? item.children?.some((child) => pathname === child.path)
              : pathname === item.path

            const open = openMenu === item.label

            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => {
                    if (hasChildren) {
                      setOpenMenu(open ? null : item.label)
                    } else if (item.path) {
                      router.push(item.path)
                    }
                  }}
                  sx={{
                    minHeight: 48,
                    mb: 0.7,
                    px: 1.5,
                    borderRadius: 2.5,
                    color: active ? '#fff' : '#a9bbcb',
                    bgcolor: active
                      ? 'rgba(47, 128, 237, 0.22)'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: active
                        ? 'rgba(47, 128, 237, 0.28)'
                        : 'rgba(255, 255, 255, 0.06)'
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active ? '#5da2ff' : '#8ca2b5'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: 14,
                        fontWeight: active ? 600 : 400
                      }
                    }}
                  />

                  {hasChildren &&
                    (open ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    ))}
                </ListItemButton>

                {hasChildren && (
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {item.children?.map((child) => {
                        const childActive = pathname === child.path

                        return (
                          <ListItemButton
                            key={child.path}
                            onClick={() => router.push(child.path)}
                            sx={{
                              minHeight: 40,
                              mb: 0.5,
                              pl: 6.5,
                              borderRadius: 2,
                              color: childActive ? '#fff' : '#8ca2b5',
                              bgcolor: childActive
                                ? 'rgba(47, 128, 237, 0.15)'
                                : 'transparent',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.06)'
                              }
                            }}
                          >
                            <ListItemText
                              primary={child.label}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: 13,
                                  fontWeight: childActive ? 600 : 400
                                }
                              }}
                            />
                          </ListItemButton>
                        )
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            )
          })}
        </List>
      </Box>

      <Box
        sx={{
          flexGrow: 1
        }}
      />
    </Box>
  )
}

export default Sidebar
