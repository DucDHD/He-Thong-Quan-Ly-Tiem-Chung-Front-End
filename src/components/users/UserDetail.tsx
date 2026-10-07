'use client'

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { getUserById, type User } from '@/services/user.service'

import { formatCccd, formatPhone } from '@/utils/format'

// ======================================================
// TYPES
// ======================================================

type UserDetailProps = {
  userId: string
}

type CellProps = {
  children: ReactNode
  history?: boolean
}

// ======================================================
// COMPONENT
// ======================================================

const UserDetail = ({ userId }: UserDetailProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = searchParams.get('currentPage') || '1'

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ====================================================
  // GET USER DETAIL
  // ====================================================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)

        const data = await getUserById(Number(userId))

        setUser(data)
      } catch (error) {
        console.error(error)

        toast.error('Không thể tải thông tin nhân viên')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.push(`/users?page=${currentPage}`)
  }

  // ====================================================
  // EDIT
  // ====================================================

  const handleEdit = () => {
    router.push(`/users/edit/${userId}?currentPage=${currentPage}&from=detail`)
  }

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <Box
        component="main"
        sx={(theme) => ({
          ml: theme.layout.sidebarWidth,
          pt: theme.layout.headerHeight,
          minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
          bgcolor: '#f5f7fb',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })}
      >
        <CircularProgress size={32} />
      </Box>
    )
  }

  // ====================================================
  // NOT FOUND
  // ====================================================

  if (!user) {
    return (
      <Box
        component="main"
        sx={(theme) => ({
          ml: theme.layout.sidebarWidth,
          pt: theme.layout.headerHeight,
          minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
          bgcolor: '#f5f7fb',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })}
      >
        <Box
          sx={{
            textAlign: 'center'
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600
            }}
          >
            Không tìm thấy nhân viên
          </Typography>

          <Button
            onClick={handleBack}
            sx={{
              mt: 1,
              textTransform: 'none'
            }}
          >
            Quay lại danh sách
          </Button>
        </Box>
      </Box>
    )
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
      <Box
        sx={{
          width: '100%',
          p: 3,
          boxSizing: 'border-box'
        }}
      >
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
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

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
              <PersonOutlineOutlinedIcon />
            </Box>

            {/* TITLE */}

            <Box
              sx={{
                flex: 1,
                minWidth: 0
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.25
                }}
              >
                Chi tiết nhân viên
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Thông tin tài khoản nhân viên
              </Typography>
            </Box>

            {/* EDIT */}

            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={handleEdit}
              sx={{
                height: 40,
                px: 2.25,
                flexShrink: 0,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',

                '&:hover': {
                  boxShadow: 'none'
                }
              }}
            >
              Chỉnh sửa
            </Button>
          </Box>

          <Divider />

          {/* ================================================= */}
          {/* CONTENT */}
          {/* ================================================= */}

          <Box
            sx={{
              p: 3
            }}
          >
            {/* =============================================== */}
            {/* SUMMARY */}
            {/* =============================================== */}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: {
                  xs: 2,
                  md: 4
                },
                px: 2.5,
                py: 2,
                bgcolor: '#f8fafc',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              {/* DATE INFORMATION */}

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3
                }}
              >
                {/* NGÀY TẠO */}

                <Box
                  sx={{
                    minWidth: {
                      xs: '100%',
                      sm: 220
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 0.4
                    }}
                  >
                    Ngày tạo
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {user.createdAt
                      ? dayjs(user.createdAt).format('DD/MM/YYYY - HH:mm')
                      : '-'}
                  </Typography>
                </Box>

                {/* CẬP NHẬT LẦN CUỐI */}

                <Box
                  sx={{
                    minWidth: 160
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 0.4
                    }}
                  >
                    Cập nhật lần cuối
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {user.updatedAt
                      ? dayjs(user.updatedAt).format('DD/MM/YYYY - HH:mm')
                      : '-'}
                  </Typography>
                </Box>
              </Box>

              {/* SPACE */}

              <Box
                sx={{
                  minWidth: 220,
                  flex: 1
                }}
              />

              {/* STATUS */}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'text.primary'
                  }}
                >
                  Trạng thái:
                </Typography>

                <Chip
                  label={user.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  color={user.isActive ? 'success' : 'default'}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 12,
                    fontWeight: 500
                  }}
                />
              </Box>
            </Box>
            {/* =============================================== */}
            {/* DETAIL TABLE */}
            {/* =============================================== */}

            <Box
              sx={{
                mt: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              {/* TABLE TITLE */}

              <Box
                sx={{
                  px: 2.5,
                  py: 1.75,
                  bgcolor: '#f8fafc',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'text.primary'
                  }}
                >
                  Thông tin chi tiết
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: 12.5,
                    color: 'text.secondary'
                  }}
                >
                  Thông tin cá nhân và tài khoản nhân viên
                </Typography>
              </Box>

              {/* ============================================= */}
              {/* ONE TABLE */}
              {/* ============================================= */}

              <TableContainer>
                <Table
                  sx={{
                    width: '100%',
                    tableLayout: 'fixed'
                  }}
                >
                  <TableBody>
                    {/* ======================================= */}
                    {/* ROW 1 */}
                    {/* ======================================= */}

                    <TableRow>
                      <LabelCell>Họ và tên</LabelCell>

                      <ValueCell>{user.fullName || '-'}</ValueCell>

                      <LabelCell>Email</LabelCell>

                      <ValueCell>{user.email || '-'}</ValueCell>
                    </TableRow>

                    {/* ======================================= */}
                    {/* ROW 2 */}
                    {/* ======================================= */}

                    <TableRow>
                      <LabelCell>Số điện thoại</LabelCell>

                      <ValueCell>{formatPhone(user.phone)}</ValueCell>

                      <LabelCell>CCCD</LabelCell>

                      <ValueCell>{formatCccd(user.cccd)}</ValueCell>
                    </TableRow>

                    {/* ======================================= */}
                    {/* ROW 3 */}
                    {/* ======================================= */}

                    <TableRow>
                      <LabelCell>Ngày sinh</LabelCell>

                      <ValueCell>
                        {user.dateOfBirth
                          ? dayjs(user.dateOfBirth).format('DD/MM/YYYY')
                          : '-'}
                      </ValueCell>

                      <LabelCell>Giới tính</LabelCell>

                      <ValueCell>{user.gender || '-'}</ValueCell>
                    </TableRow>

                    {/* ======================================= */}
                    {/* ROW 4 */}
                    {/* ======================================= */}

                    <TableRow>
                      <LabelCell>Địa chỉ</LabelCell>

                      <ValueCell>{user.address || '-'}</ValueCell>

                      <LabelCell>Vai trò</LabelCell>

                      <ValueCell>{user.role?.role_name || '-'}</ValueCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

// ======================================================
// LABEL CELL
// ======================================================

const LabelCell = ({ children, history = false }: CellProps) => {
  return (
    <TableCell
      sx={{
        width: '15%',
        px: 2.5,
        py: 1.8,

        // LABEL ĐẬM HƠN
        fontSize: 13,
        fontWeight: 700,
        color: 'text.primary',

        bgcolor: history ? '#f8fafc' : '#fff',

        verticalAlign: 'middle',

        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      {children}
    </TableCell>
  )
}

// ======================================================
// VALUE CELL
// ======================================================

const ValueCell = ({ children, history = false }: CellProps) => {
  return (
    <TableCell
      sx={{
        width: '35%',
        px: 2.5,
        py: 1.8,

        // GIÁ TRỊ ĐẬM NHẸ HƠN LABEL
        fontSize: 14,
        fontWeight: 500,
        color: 'text.primary',

        bgcolor: history ? '#f8fafc' : '#fff',

        verticalAlign: 'middle',

        borderBottom: '1px solid',
        borderColor: 'divider',

        wordBreak: 'break-word'
      }}
    >
      {children || '-'}
    </TableCell>
  )
}

export default UserDetail
