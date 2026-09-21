'use client'

import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

import {
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'

type Customer = {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  phone: string
}

const vaccines = [
  'ENGERIX B',
  'TETAVAX',
  'BCG',
  'DPT',
  'MMR',
  'Influenza',
  'HPV'
]

const CustomerPrescription = () => {
  const [customerId, setCustomerId] = useState('')
  const [customer, setCustomer] = useState<Customer | null>(null)

  const [vaccine, setVaccine] = useState('')
  const [vaccinationDate, setVaccinationDate] = useState<Dayjs | null>(null)

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data - sau này thay bằng API
  const mockCustomer: Customer = {
    id: '201485371',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '01/01/2015',
    gender: 'Nam',
    phone: '0903999999'
  }

  const handleSearch = () => {
    const value = customerId.trim()

    if (!value) {
      setError('Vui lòng nhập ID bệnh nhân')
      setCustomer(null)
      return
    }

    setError('')

    // TODO:
    // GET /customers/:id

    if (value === mockCustomer.id) {
      setCustomer(mockCustomer)
      return
    }

    setCustomer(null)
    setError('Không tìm thấy bệnh nhân')
  }

  const handleSubmit = async () => {
    if (!customer) {
      setError('Vui lòng tìm kiếm bệnh nhân trước')
      return
    }

    if (!vaccine || !vaccinationDate) {
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        customerId: customer.id,
        vaccine,
        vaccinationDate: vaccinationDate.format('YYYY-MM-DD')
      }

      console.log('Prescription:', payload)

      // TODO:
      // await fetch('/api/prescriptions', {
      //   method: 'POST',
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
    setCustomer(null)
    setVaccine('')
    setVaccinationDate(null)
    setError('')
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
              <MedicalInformationOutlinedIcon />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Kê Đơn
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Chỉ định vắc-xin và thời gian tiêm cho bệnh nhân
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Tìm bệnh nhân */}
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

          {/* Form kê đơn */}
          <Box
            sx={{
              p: 3
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
                Thông Tin Chỉ Định
              </Typography>
            </Box>

            <Box
              sx={{
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
                label="Họ và tên bệnh nhân"
                value={customer?.fullName ?? ''}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
              />

              <TextField
                label="Số điện thoại"
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
                select
                label="Vắc-xin cần tiêm"
                value={vaccine}
                onChange={(event) => setVaccine(event.target.value)}
                fullWidth
                size="small"
                required
                disabled={!customer}
              >
                {vaccines.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>

              <DatePicker
                label="Thời gian tiêm"
                format="DD/MM/YYYY"
                value={vaccinationDate}
                onChange={(value) => setVaccinationDate(value)}
                minDate={dayjs()}
                disabled={!customer}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    required: true
                  }
                }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Actions */}
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
              onClick={handleSubmit}
              disabled={
                !customer || !vaccine || !vaccinationDate || isSubmitting
              }
            >
              {isSubmitting ? 'Đang lưu...' : 'Kê đơn'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default CustomerPrescription
