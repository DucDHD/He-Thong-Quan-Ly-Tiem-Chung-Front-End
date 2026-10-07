'use client'

import {
  Box,
  Button,
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
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { getVaccineByIdAPI, type Vaccine } from '@/services/vaccine.service'

// ======================================================
// TYPES
// ======================================================

type VaccineDetailProps = {
  vaccineId: string
}

type CellProps = {
  children: ReactNode
}

// ======================================================
// COMPONENT
// ======================================================

const VaccineDetail = ({ vaccineId }: VaccineDetailProps) => {
  const router = useRouter()

  const searchParams = useSearchParams()

  const currentPage = searchParams.get('currentPage') || '1'

  const [vaccine, setVaccine] = useState<Vaccine | null>(null)
  const [loading, setLoading] = useState(true)

  // ====================================================
  // GET VACCINE DETAIL
  // ====================================================

  useEffect(() => {
    const fetchVaccine = async () => {
      try {
        setLoading(true)

        const data = await getVaccineByIdAPI(Number(vaccineId))

        setVaccine(data)
      } catch {
        toast.error('Không thể tải thông tin vaccine')
      } finally {
        setLoading(false)
      }
    }

    fetchVaccine()
  }, [vaccineId])

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.push(`/vaccines?page=${currentPage}`)
  }

  // ====================================================
  // EDIT
  // ====================================================

  const handleEdit = () => {
    router.push(
      `/vaccines/edit/${vaccineId}?currentPage=${currentPage}&from=detail`
    )
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

  if (!vaccine) {
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
            Không tìm thấy vaccine
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
              <VaccinesOutlinedIcon />
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
                Chi tiết vaccine
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Thông tin chi tiết vaccine
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

          <Box sx={{ p: 3 }}>
            {/* ================================================= */}
            {/* SUMMARY */}
            {/* ================================================= */}

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
                    {vaccine.createdAt
                      ? dayjs(vaccine.createdAt).format('DD/MM/YYYY - HH:mm')
                      : '-'}
                  </Typography>
                </Box>

                {/* CẬP NHẬT LẦN CUỐI */}

                <Box
                  sx={{
                    minWidth: 180
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
                    {vaccine.updatedAt
                      ? dayjs(vaccine.updatedAt).format('DD/MM/YYYY - HH:mm')
                      : '-'}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  minWidth: 220,
                  flex: 1
                }}
              />
            </Box>

            {/* ================================================= */}
            {/* DETAIL TABLE */}
            {/* ================================================= */}

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
                  Thông tin vaccine và hướng dẫn sử dụng
                </Typography>
              </Box>

              <TableContainer>
                <Table
                  sx={{
                    width: '100%',
                    tableLayout: 'fixed'
                  }}
                >
                  <TableBody>
                    {/* ROW 1 */}

                    <TableRow>
                      <LabelCell>Tên Vaccine</LabelCell>

                      <ValueCell>{vaccine.vaccine_name}</ValueCell>

                      <LabelCell>Loại Vaccine</LabelCell>

                      <ValueCell>{vaccine.vaccine_type}</ValueCell>
                    </TableRow>

                    {/* ROW 2 */}

                    <TableRow>
                      <LabelCell>Số giấy phép</LabelCell>

                      <ValueCell>{vaccine.license_number}</ValueCell>

                      <LabelCell>Nhà sản xuất</LabelCell>

                      <ValueCell>{vaccine.manufacturer}</ValueCell>
                    </TableRow>

                    {/* ROW 3 */}

                    <TableRow>
                      <LabelCell>Nước sản xuất</LabelCell>

                      <ValueCell>{vaccine.country}</ValueCell>

                      <LabelCell>Hàm lượng</LabelCell>

                      <ValueCell>{vaccine.dosage}</ValueCell>
                    </TableRow>

                    {/* ROW 4 */}

                    <TableRow>
                      <LabelCell>Độ tuổi tiêm chủng</LabelCell>

                      <ValueCell>{vaccine.vaccination_age}</ValueCell>

                      <LabelCell>Đơn vị</LabelCell>

                      <ValueCell>{vaccine.unit}</ValueCell>
                    </TableRow>

                    {/* ROW 5 */}

                    <TableRow>
                      <LabelCell>Giá Vaccine</LabelCell>

                      <ValueCell>
                        {vaccine.price
                          ? `${Number(vaccine.price).toLocaleString(
                              'vi-VN'
                            )} VNĐ`
                          : '-'}
                      </ValueCell>

                      <LabelCell>Điều kiện bảo quản</LabelCell>

                      <ValueCell>{vaccine.storage_condition}</ValueCell>
                    </TableRow>

                    {/* ROW 6 */}

                    <TableRow>
                      <LabelCell>Mô tả</LabelCell>

                      <TableCell
                        colSpan={3}
                        sx={{
                          px: 2.5,
                          py: 1.8,
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'text.primary',
                          verticalAlign: 'middle',
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          wordBreak: 'break-word'
                        }}
                      >
                        {vaccine.description || '-'}
                      </TableCell>
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

const LabelCell = ({ children }: CellProps) => {
  return (
    <TableCell
      sx={{
        width: '15%',
        px: 2.5,
        py: 1.8,

        fontSize: 13,
        fontWeight: 700,
        color: 'text.primary',

        bgcolor: '#fff',

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

const ValueCell = ({ children }: CellProps) => {
  return (
    <TableCell
      sx={{
        width: '35%',
        px: 2.5,
        py: 1.8,

        fontSize: 14,
        fontWeight: 500,
        color: 'text.primary',

        bgcolor: '#fff',

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

export default VaccineDetail
