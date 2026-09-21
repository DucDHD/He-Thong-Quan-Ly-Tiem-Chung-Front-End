'use client'

import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'

import { zodResolver } from '@hookform/resolvers/zod'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

// ======================================================
// VALIDATION
// ======================================================

const diseaseSituationSchema = z.object({
  reportDate: z.string().min(1, 'Vui lòng chọn ngày khảo sát'),

  province: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tỉnh/thành phố')
    .max(100, 'Tỉnh/thành phố không được vượt quá 100 ký tự'),

  district: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập quận/huyện')
    .max(100, 'Quận/huyện không được vượt quá 100 ký tự'),

  ward: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập phường/xã')
    .max(100, 'Phường/xã không được vượt quá 100 ký tự'),

  diseaseName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập loại bệnh dịch')
    .max(100, 'Loại bệnh dịch không được vượt quá 100 ký tự'),

  reportedCases: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số người bị nhiễm')
    .refine(
      (value) => {
        const number = Number(value)

        return !Number.isNaN(number) && Number.isInteger(number) && number >= 0
      },
      {
        message: 'Số người bị nhiễm phải là số nguyên từ 0 trở lên'
      }
    ),

  transmission: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập đường lây nhiễm')
    .max(255, 'Đường lây nhiễm không được vượt quá 255 ký tự'),

  healthEffect: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tác hại sức khỏe')
    .max(500, 'Tác hại sức khỏe không được vượt quá 500 ký tự'),

  vaccineName: z
    .string()
    .trim()
    .max(100, 'Tên vaccine không được vượt quá 100 ký tự'),

  status: z.string().min(1, 'Vui lòng chọn trạng thái'),

  note: z.string().trim().max(500, 'Ghi chú không được vượt quá 500 ký tự')
})

type DiseaseSituationForm = z.infer<typeof diseaseSituationSchema>

// ======================================================
// COMPONENT
// ======================================================

const DiseaseSituationCreate = () => {
  const router = useRouter()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DiseaseSituationForm>({
    resolver: zodResolver(diseaseSituationSchema),
    mode: 'onTouched',

    defaultValues: {
      reportDate: dayjs().format('YYYY-MM-DD'),
      province: '',
      district: '',
      ward: '',
      diseaseName: '',
      reportedCases: '',
      transmission: '',
      healthEffect: '',
      vaccineName: '',
      status: 'monitoring',
      note: ''
    }
  })

  // ====================================================
  // SUBMIT
  // ====================================================

  const onSubmit = async (data: DiseaseSituationForm) => {
    const payload = {
      ...data,
      reportedCases: Number(data.reportedCases),
      vaccineName: data.vaccineName || null,
      note: data.note || null
    }

    console.log('CREATE DISEASE SITUATION:', payload)

    // TODO: CALL API
    //
    // await diseaseSituationService.create(payload)

    router.push('/disease-situation')
  }

  // ====================================================
  // CANCEL
  // ====================================================

  const handleCancel = () => {
    router.push('/disease-situation')
  }

  const fieldSx = {
    width: '100%',

    '& .MuiInputBase-root': {
      bgcolor: '#fff'
    }
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
          {/* HEADER */}

          <Box
            sx={{
              px: 3,
              py: 2.25,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#fff'
              }}
            >
              <CoronavirusOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.25
                }}
              >
                Thêm tình hình dịch bệnh
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25 }}
              >
                Thêm thông tin tình hình dịch bệnh tại địa phương
              </Typography>
            </Box>
          </Box>

          {/* FORM */}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                p: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))'
                },
                columnGap: 4,
                rowGap: 2.5
              }}
            >
              {/* NGÀY KHẢO SÁT */}

              <Controller
                name="reportDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Thời điểm khảo sát"
                    format="DD/MM/YYYY"
                    maxDate={dayjs()}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(value) => {
                      field.onChange(value ? value.format('YYYY-MM-DD') : '')
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        onBlur: field.onBlur,
                        error: Boolean(errors.reportDate),
                        helperText: errors.reportDate?.message,
                        sx: fieldSx
                      }
                    }}
                  />
                )}
              />

              {/* BỆNH */}

              <TextField
                label="Loại bệnh dịch"
                placeholder="VD: Sốt xuất huyết"
                fullWidth
                required
                {...register('diseaseName')}
                error={Boolean(errors.diseaseName)}
                helperText={errors.diseaseName?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
                sx={fieldSx}
              />

              {/* TỈNH */}

              <TextField
                label="Tỉnh/Thành phố"
                placeholder="VD: Đà Nẵng"
                fullWidth
                required
                {...register('province')}
                error={Boolean(errors.province)}
                helperText={errors.province?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
                sx={fieldSx}
              />

              {/* QUẬN */}

              <TextField
                label="Quận/Huyện"
                placeholder="VD: Hải Châu"
                fullWidth
                required
                {...register('district')}
                error={Boolean(errors.district)}
                helperText={errors.district?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
                sx={fieldSx}
              />

              {/* PHƯỜNG */}

              <TextField
                label="Phường/Xã"
                placeholder="VD: Hải Châu"
                fullWidth
                required
                {...register('ward')}
                error={Boolean(errors.ward)}
                helperText={errors.ward?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
                sx={fieldSx}
              />

              {/* SỐ CA */}

              <TextField
                label="Số người bị nhiễm"
                placeholder="VD: 25"
                type="number"
                fullWidth
                required
                {...register('reportedCases')}
                error={Boolean(errors.reportedCases)}
                helperText={errors.reportedCases?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1
                  }
                }}
                sx={fieldSx}
              />

              {/* ĐƯỜNG LÂY */}

              <TextField
                label="Đường lây nhiễm"
                placeholder="VD: Muỗi Aedes truyền bệnh"
                fullWidth
                required
                {...register('transmission')}
                error={Boolean(errors.transmission)}
                helperText={errors.transmission?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 255
                  }
                }}
                sx={fieldSx}
              />

              {/* VACCINE */}

              <TextField
                label="Vaccine phòng bệnh"
                placeholder="Nhập tên vaccine nếu có"
                fullWidth
                {...register('vaccineName')}
                error={Boolean(errors.vaccineName)}
                helperText={errors.vaccineName?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
                sx={fieldSx}
              />

              {/* TRẠNG THÁI */}

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Trạng thái"
                    fullWidth
                    required
                    error={Boolean(errors.status)}
                    helperText={errors.status?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="monitoring">Đang theo dõi</MenuItem>

                    <MenuItem value="outbreak">Đang có dịch</MenuItem>

                    <MenuItem value="controlled">Đã kiểm soát</MenuItem>
                  </TextField>
                )}
              />

              {/* TÁC HẠI */}

              <TextField
                label="Tác hại sức khỏe"
                placeholder="Mô tả tác hại của bệnh đối với sức khỏe"
                fullWidth
                required
                multiline
                minRows={3}
                {...register('healthEffect')}
                error={Boolean(errors.healthEffect)}
                helperText={errors.healthEffect?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 500
                  }
                }}
                sx={fieldSx}
              />

              {/* GHI CHÚ */}

              <TextField
                label="Ghi chú"
                placeholder="Nhập ghi chú nếu có"
                fullWidth
                multiline
                minRows={3}
                {...register('note')}
                error={Boolean(errors.note)}
                helperText={errors.note?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 500
                  }
                }}
                sx={fieldSx}
              />
            </Box>

            {/* ACTION */}

            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1.5
              }}
            >
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                startIcon={<CloseOutlinedIcon />}
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={{
                  minWidth: 100,
                  height: 42,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                disabled={isSubmitting}
                sx={{
                  minWidth: 110,
                  height: 42,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default DiseaseSituationCreate
