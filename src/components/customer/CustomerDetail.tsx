'use client'

import { useState } from 'react'

import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'

type Customer = {
  id: string
  fullName: string
  gender: string
  age: number
  guardian: string
  address: string
  phone: string
  vaccinatedVaccine: string
  vaccinatedDate: string
  reaction: string
  nextVaccine: string
  nextTime: string
}

const CustomerDetail = () => {
  const [customerId, setCustomerId] = useState('')
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [error, setError] = useState('')

  // Mock data - sau này thay bằng dữ liệu từ API
  const mockCustomer: Customer = {
    id: '201485371',
    fullName: 'Nguyễn Văn A',
    gender: 'Nam',
    age: 1,
    guardian: 'Nguyễn Văn B (cha)',
    address: 'Hải Châu - Đà Nẵng',
    phone: '0903999999',
    vaccinatedVaccine: 'ENGERIX B',
    vaccinatedDate: '02/01/2015',
    reaction: 'Bình thường',
    nextVaccine: 'TETAVAX',
    nextTime: '6 tháng'
  }

  const handleSearch = () => {
    const value = customerId.trim()

    if (!value) {
      setError('Vui lòng nhập ID bệnh nhân')
      setCustomer(null)
      return
    }

    setError('')

    // ==========================================================
    // TODO: Sau này có backend thì thay phần mock bên dưới bằng:
    //
    // const response = await fetch(`/api/customers/${value}`)
    // const data = await response.json()
    // setCustomer(data)
    //
    // ==========================================================

    if (value === mockCustomer.id) {
      setCustomer(mockCustomer)
      return
    }

    setCustomer(null)
    setError('Không tìm thấy bệnh nhân')
  }

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
          {/* ================= HEADER ================= */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <PersonSearchOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700
                }}
              >
                Xem Hồ Sơ Bệnh Án
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Tra cứu thông tin và lịch sử tiêm chủng của bệnh nhân
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* ================= TÌM KIẾM ================= */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              bgcolor: '#fafafa'
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mb: 1.5
              }}
            >
              Tìm kiếm bệnh nhân
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                width: '100%',
                maxWidth: 650
              }}
            >
              <TextField
                label="ID bệnh nhân"
                placeholder="VD: 201485371"
                size="small"
                fullWidth
                value={customerId}
                onChange={(event) => {
                  setCustomerId(event.target.value)

                  if (error) {
                    setError('')
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSearch()
                  }
                }}
                error={Boolean(error)}
                helperText={error}
              />

              <Button
                type="button"
                variant="contained"
                startIcon={<SearchOutlinedIcon />}
                onClick={handleSearch}
                sx={{
                  height: 40,
                  px: 3,
                  whiteSpace: 'nowrap'
                }}
              >
                Tìm kiếm
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* ================= NỘI DUNG HỒ SƠ ================= */}
          {/* ================= NỘI DUNG HỒ SƠ ================= */}
          <Box
            sx={{
              p: 3,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'repeat(3, minmax(0, 1fr))'
              },
              gap: 2,
              alignItems: 'start'
            }}
          >
            {/* ================= THÔNG TIN BỆNH NHÂN ================= */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 'none'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <PersonSearchOutlinedIcon color="primary" />

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Thông Tin Bệnh Nhân
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                <TextField
                  label="Họ và tên"
                  value={customer?.fullName ?? ''}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1.5
                  }}
                >
                  <TextField
                    label="Giới tính"
                    value={customer?.gender ?? ''}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true
                      }
                    }}
                  />

                  <TextField
                    label="Tuổi"
                    value={customer?.age ?? ''}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true
                      }
                    }}
                  />
                </Box>

                <TextField
                  label="Người giám hộ"
                  value={customer?.guardian ?? ''}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Điện thoại"
                  value={customer?.phone ?? ''}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Địa chỉ"
                  value={customer?.address ?? ''}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />
              </Box>
            </Paper>

            {/* ================= THÔNG TIN TIÊM CHỦNG ================= */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 'none'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <VaccinesOutlinedIcon color="primary" />

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Thông Tin Tiêm Chủng
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                <TextField
                  label="Vắc-xin đã tiêm"
                  value={customer?.vaccinatedVaccine ?? ''}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Thời gian tiêm"
                  value={customer?.vaccinatedDate ?? ''}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Phản ứng sau khi tiêm"
                  value={customer?.reaction ?? ''}
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />
              </Box>
            </Paper>

            {/* ================= MŨI TIÊM TIẾP THEO ================= */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 'none'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <VaccinesOutlinedIcon color="primary" />

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Mũi Tiêm Tiếp Theo
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                <TextField
                  label="Vắc-xin cần tiêm"
                  value={customer?.nextVaccine ?? ''}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                <TextField
                  label="Thời gian"
                  value={customer?.nextTime ?? ''}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default CustomerDetail
