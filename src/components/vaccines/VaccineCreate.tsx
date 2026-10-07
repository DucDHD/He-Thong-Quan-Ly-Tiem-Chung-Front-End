'use client'

import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'

import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { z } from 'zod'
import axios from 'axios'
import { toast } from 'react-toastify'

import { createVaccineAPI } from '@/services/vaccine.service'
import { NumericFormat } from 'react-number-format'

const vaccineSchema = z.object({
  vaccine_name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên vaccine')
    .max(150, 'Tên vaccine không được vượt quá 150 ký tự')
    .regex(/[A-Za-zÀ-ỹ]/, 'Tên vaccine phải chứa ít nhất một chữ cái'),

  vaccine_type: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập loại vaccine')
    .max(100, 'Loại vaccine không được vượt quá 100 ký tự')
    .regex(/[A-Za-zÀ-ỹ]/, 'Loại vaccine phải chứa ít nhất một chữ cái'),

  license_number: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số giấy phép')
    .max(100, 'Số giấy phép không được vượt quá 100 ký tự')
    .regex(/^[A-Za-z0-9À-ỹ/._\-\s]+$/, 'Số giấy phép chứa ký tự không hợp lệ'),

  manufacturer: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập nhà sản xuất')
    .max(150, 'Nhà sản xuất không được vượt quá 150 ký tự')
    .regex(/[A-Za-zÀ-ỹ]/, 'Nhà sản xuất phải chứa ít nhất một chữ cái'),

  country: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập nước sản xuất')
    .max(100, 'Nước sản xuất không được vượt quá 100 ký tự')
    .regex(/^[A-Za-zÀ-ỹ\s.'()-]+$/, 'Nước sản xuất không đúng định dạng'),

  dosage: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập hàm lượng')
    .max(100, 'Hàm lượng không được vượt quá 100 ký tự')
    .regex(/[0-9]/, 'Hàm lượng phải chứa giá trị số')
    .regex(/^[A-Za-zÀ-ỹ0-9.,/%µμ\s\-]+$/, 'Hàm lượng không đúng định dạng'),

  storage_condition: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập điều kiện bảo quản')
    .max(255, 'Điều kiện bảo quản không được vượt quá 255 ký tự'),

  vaccination_age: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập độ tuổi tiêm chủng')
    .max(100, 'Độ tuổi tiêm chủng không được vượt quá 100 ký tự')
    .regex(/[0-9]/, 'Độ tuổi tiêm chủng phải chứa ít nhất một giá trị tuổi')
    .regex(
      /^[A-Za-zÀ-ỹ0-9\s.,+\-–<>/=]+$/,
      'Độ tuổi tiêm chủng không đúng định dạng'
    ),

  unit: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập đơn vị')
    .max(50, 'Đơn vị không được vượt quá 50 ký tự')
    .regex(/^[A-Za-zÀ-ỹ\s]+$/, 'Đơn vị chỉ được chứa chữ cái'),

  price: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập giá vaccine')
    .regex(/^\d+$/, 'Giá vaccine chỉ được chứa số')
    .refine((value) => Number(value) > 0, 'Giá vaccine phải lớn hơn 0')
    .refine(
      (value) => Number(value) <= 999999999,
      'Giá vaccine không được vượt quá 999.999.999 VNĐ'
    ),
  description: z.string().trim()
})
type VaccineFormData = z.infer<typeof vaccineSchema>

const VaccineCreate = () => {
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<VaccineFormData>({
    resolver: zodResolver(vaccineSchema),
    mode: 'onTouched',

    defaultValues: {
      vaccine_name: '',
      vaccine_type: '',
      license_number: '',
      manufacturer: '',
      country: '',
      dosage: '',
      storage_condition: '',
      vaccination_age: '',
      unit: '',
      price: '',
      description: ''
    }
  })

  const handleBack = () => {
    router.back()
  }
  const handleCreate = async (data: VaccineFormData) => {
    try {
      await createVaccineAPI({
        ...data,
        price: Number(data.price),
        description: data.description || undefined
      })

      toast.success('Tạo vaccine thành công')
      reset()
      router.push('/vaccines')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { field, message } = error.response?.data || {}

        if (field && message) {
          setError(field as keyof VaccineFormData, {
            type: 'server',
            message
          })

          return
        }
      }
      toast.error('Tạo vaccine thất bại')
    }
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
      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <Box
        sx={{
          width: '100%',

          p: 3,

          boxSizing: 'border-box'
        }}
      >
        {/* ================================================= */}
        {/* PAPER */}
        {/* ================================================= */}

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
          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

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

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,

                  lineHeight: 1.25
                }}
              >
                Thêm Vaccine
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Thêm thông tin vaccine mới vào hệ thống
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* ============================================= */}
          {/* FORM */}
          {/* ============================================= */}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(handleCreate)}
          >
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
              {/* ========================================= */}
              {/* TÊN VACCINE */}
              {/* ========================================= */}

              <TextField
                label="Tên Vaccine"
                required
                fullWidth
                placeholder="Nhập tên vaccine"
                {...register('vaccine_name')}
                error={Boolean(errors.vaccine_name)}
                helperText={errors.vaccine_name?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 150
                  }
                }}
              />

              {/* ========================================= */}
              {/* LOẠI VACCINE */}
              {/* ========================================= */}

              <TextField
                label="Loại Vaccine"
                required
                fullWidth
                placeholder="VD: HPV, cúm, viêm gan B..."
                {...register('vaccine_type')}
                error={Boolean(errors.vaccine_type)}
                helperText={errors.vaccine_type?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* ========================================= */}
              {/* SỐ GIẤY PHÉP */}
              {/* ========================================= */}

              <TextField
                label="Số giấy phép"
                required
                fullWidth
                placeholder="Nhập số giấy phép"
                {...register('license_number')}
                error={Boolean(errors.license_number)}
                helperText={errors.license_number?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* ========================================= */}
              {/* NHÀ SẢN XUẤT */}
              {/* ========================================= */}

              <TextField
                label="Nhà sản xuất"
                required
                fullWidth
                placeholder="Nhập nhà sản xuất"
                {...register('manufacturer')}
                error={Boolean(errors.manufacturer)}
                helperText={errors.manufacturer?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 150
                  }
                }}
              />

              {/* ========================================= */}
              {/* NƯỚC SẢN XUẤT */}
              {/* ========================================= */}

              <TextField
                label="Nước sản xuất"
                required
                fullWidth
                placeholder="VD: Mỹ"
                {...register('country')}
                error={Boolean(errors.country)}
                helperText={errors.country?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* ========================================= */}
              {/* HÀM LƯỢNG */}
              {/* ========================================= */}

              <TextField
                label="Hàm lượng"
                required
                fullWidth
                placeholder="VD: 0.5 ml"
                {...register('dosage')}
                error={Boolean(errors.dosage)}
                helperText={errors.dosage?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* ========================================= */}
              {/* ĐỘ TUỔI TIÊM CHỦNG */}
              {/* ========================================= */}

              <TextField
                label="Độ tuổi tiêm chủng"
                required
                fullWidth
                placeholder="VD: 9 - 45 tuổi"
                {...register('vaccination_age')}
                error={Boolean(errors.vaccination_age)}
                helperText={errors.vaccination_age?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* ========================================= */}
              {/* ĐƠN VỊ */}
              {/* ========================================= */}

              <TextField
                label="Đơn vị"
                required
                fullWidth
                placeholder="VD: Liều"
                {...register('unit')}
                error={Boolean(errors.unit)}
                helperText={errors.unit?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 50
                  }
                }}
              />

              {/* ========================================= */}
              {/* ĐIỀU KIỆN BẢO QUẢN */}
              {/* ========================================= */}

              <TextField
                label="Điều kiện bảo quản"
                required
                fullWidth
                placeholder="VD: Bảo quản ở 2 - 8°C"
                {...register('storage_condition')}
                error={Boolean(errors.storage_condition)}
                helperText={errors.storage_condition?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 255
                  }
                }}
              />

              {/* ========================================= */}
              {/* GIÁ VACCINE */}
              {/* ========================================= */}

              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    customInput={TextField}
                    label="Giá Vaccine"
                    required
                    fullWidth
                    placeholder="VD: 1.500.000"
                    value={field.value}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={0}
                    allowNegative={false}
                    allowLeadingZeros={false}
                    suffix=" VNĐ"
                    onBlur={field.onBlur}
                    onValueChange={(values) => {
                      field.onChange(values.value)
                    }}
                    isAllowed={(values) => {
                      const value = values.floatValue

                      return value === undefined || value <= 999999999
                    }}
                    error={Boolean(errors.price)}
                    helperText={errors.price?.message}
                  />
                )}
              />

              {/* ========================================= */}
              {/* MÔ TẢ */}
              {/* ========================================= */}

              <TextField
                label="Mô tả"
                required
                fullWidth
                multiline
                minRows={3}
                placeholder="Nhập mô tả vaccine"
                {...register('description')}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 500
                  }
                }}
                sx={{
                  gridColumn: {
                    xs: 'auto',
                    md: '1 / -1'
                  }
                }}
              />
            </Box>

            <Divider />

            {/* =========================================== */}
            {/* ACTION */}
            {/* =========================================== */}

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
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={isSubmitting}
                sx={{
                  minWidth: 110,

                  height: 40,

                  textTransform: 'none'
                }}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={<SaveOutlinedIcon />}
                sx={{
                  minWidth: 140,

                  height: 40,

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

export default VaccineCreate
