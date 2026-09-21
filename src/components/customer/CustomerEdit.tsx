'use client'

import { useState } from 'react'

import {
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

type Customer = {
  id: string
  fullName: string
  gender: string
  age: string
  guardian: string
  address: string
  phone: string
}

const emptyCustomer: Customer = {
  id: '',
  fullName: '',
  gender: '',
  age: '',
  guardian: '',
  address: '',
  phone: ''
}

const CustomerEdit = () => {
  const [customerId, setCustomerId] = useState('')
  const [customer, setCustomer] = useState<Customer>(emptyCustomer)
  const [error, setError] = useState('')
  const [found, setFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock - sau này thay bằng API
  const mockCustomer: Customer = {
    id: '201485371',
    fullName: 'Nguyễn Văn A',
    gender: 'Nam',
    age: '1',
    guardian: 'Nguyễn Văn B (cha)',
    address: 'Hải Châu - Đà Nẵng',
    phone: '0903999999'
  }

  const handleSearch = () => {
    const value = customerId.trim()

    if (!value) {
      setError('Vui lòng nhập ID bệnh nhân')
      setCustomer(emptyCustomer)
      setFound(false)
      return
    }

    setError('')

    // TODO: Sau này gọi API:
    // GET /customers/:id

    if (value === mockCustomer.id) {
      setCustomer(mockCustomer)
      setFound(true)
      return
    }

    setCustomer(emptyCustomer)
    setFound(false)
    setError('Không tìm thấy bệnh nhân')
  }

  const handleChange = (field: keyof Customer, value: string) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUpdate = async () => {
    if (!found) {
      setError('Vui lòng tìm kiếm bệnh nhân trước')
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        ...customer
      }

      console.log('Update customer:', payload)

      // TODO:
      // await fetch(`/api/customers/${customer.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(payload)
      // })

      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setCustomerId('')
    setCustomer(emptyCustomer)
    setError('')
    setFound(false)
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
          {/* Header */}
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
                justifyContent: 'center'
              }}
            >
              <EditOutlinedIcon />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Cập Nhật Hồ Sơ Bệnh Án
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Tìm kiếm và cập nhật thông tin bệnh nhân
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Tìm kiếm */}
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

          {/* Form */}
          <Box
            sx={{
              p: 3,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, minmax(0, 1fr))'
              },
              columnGap: 2,
              rowGap: 2
            }}
          >
            <TextField
              label="Họ và tên"
              value={customer.fullName}
              onChange={(event) => handleChange('fullName', event.target.value)}
              fullWidth
              size="small"
              disabled={!found}
            />

            <TextField
              select
              label="Giới tính"
              value={customer.gender}
              onChange={(event) => handleChange('gender', event.target.value)}
              fullWidth
              size="small"
              disabled={!found}
            >
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
              <MenuItem value="Khác">Khác</MenuItem>
            </TextField>

            <TextField
              label="Tuổi"
              value={customer.age}
              onChange={(event) => handleChange('age', event.target.value)}
              fullWidth
              size="small"
              disabled={!found}
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
                  maxLength: 3
                }
              }}
            />

            <TextField
              label="Người giám hộ"
              value={customer.guardian}
              onChange={(event) => handleChange('guardian', event.target.value)}
              fullWidth
              size="small"
              disabled={!found}
            />

            <TextField
              label="Điện thoại"
              value={customer.phone}
              onChange={(event) => handleChange('phone', event.target.value)}
              fullWidth
              size="small"
              disabled={!found}
              slotProps={{
                htmlInput: {
                  maxLength: 10,
                  inputMode: 'numeric'
                }
              }}
            />

            <TextField
              label="Địa chỉ"
              value={customer.address}
              onChange={(event) => handleChange('address', event.target.value)}
              fullWidth
              size="small"
              disabled={!found}
            />
          </Box>

          <Divider />

          {/* Action */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CloseOutlinedIcon />}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Hủy
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleUpdate}
              disabled={!found || isSubmitting}
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default CustomerEdit
