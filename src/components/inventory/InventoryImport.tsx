'use client'

import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

import { useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { DatePicker } from '@mui/x-date-pickers'

import dayjs from 'dayjs'

import { z } from 'zod'

// ======================================================
// VALIDATION
// ======================================================

const inventoryImportSchema = z
  .object({
    vaccineName: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập tên vaccine')
      .max(100, 'Tên vaccine không được vượt quá 100 ký tự'),

    vaccineType: z.string().trim().min(1, 'Vui lòng chọn loại vaccine'),

    importDate: z.string().min(1, 'Vui lòng chọn ngày nhập'),

    licenseNumber: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập số giấy phép')
      .max(50, 'Số giấy phép không được vượt quá 50 ký tự'),

    country: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập nước sản xuất')
      .max(100, 'Nước sản xuất không được vượt quá 100 ký tự'),

    price: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập đơn giá')
      .refine(
        (value) => {
          const number = Number(value)

          return !Number.isNaN(number) && number > 0
        },
        {
          message: 'Đơn giá phải lớn hơn 0'
        }
      ),

    dosage: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập hàm lượng')
      .max(50, 'Hàm lượng không được vượt quá 50 ký tự'),

    batchNumber: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập số lô')
      .max(50, 'Số lô không được vượt quá 50 ký tự'),

    expiryDate: z.string().min(1, 'Vui lòng chọn hạn sử dụng'),

    storageCondition: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập điều kiện bảo quản')
      .max(100, 'Điều kiện bảo quản không được vượt quá 100 ký tự'),

    ageGroup: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập độ tuổi tiêm chủng')
      .max(100, 'Độ tuổi tiêm chủng không được vượt quá 100 ký tự')
  })
  .refine(
    (data) => {
      if (!data.importDate || !data.expiryDate) {
        return true
      }

      return dayjs(data.expiryDate).isAfter(dayjs(data.importDate), 'day')
    },
    {
      message: 'Hạn sử dụng phải sau ngày nhập',
      path: ['expiryDate']
    }
  )

type InventoryImportForm = z.infer<typeof inventoryImportSchema>

// ======================================================
// VACCINE TYPES
// ======================================================

const vaccineTypes = [
  'BCG',
  'Viêm gan B',
  'Bạch hầu - Ho gà - Uốn ván',
  'Bại liệt',
  'Hib',
  'Sởi',
  'Sởi - Rubella',
  'Viêm não Nhật Bản',
  'Cúm',
  'HPV',
  'Phế cầu',
  'Thủy đậu',
  'Rotavirus',
  'Khác'
]

// ======================================================
// COMPONENT
// ======================================================

const InventoryImport = () => {
  const router = useRouter()

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<InventoryImportForm>({
    resolver: zodResolver(inventoryImportSchema),

    mode: 'onTouched',

    defaultValues: {
      vaccineName: '',
      vaccineType: '',
      importDate: dayjs().format('YYYY-MM-DD'),
      licenseNumber: '',
      country: '',
      price: '',
      dosage: '',
      batchNumber: '',
      expiryDate: '',
      storageCondition: '',
      ageGroup: ''
    }
  })

  const importDate = watch('importDate')

  // ====================================================
  // SUBMIT
  // ====================================================

  const onSubmit = async (data: InventoryImportForm) => {
    const payload = {
      ...data,

      price: Number(data.price)
    }

    console.log('IMPORT VACCINE:', payload)

    // ==================================================
    // TODO: CALL API
    // ==================================================
    //
    // Sau này:
    //
    // await inventoryService.importVaccine(payload)

    router.push('/inventory')
  }

  // ====================================================
  // CANCEL
  // ====================================================

  const handleCancel = () => {
    router.push('/inventory')
  }

  // ====================================================
  // COMMON TEXTFIELD STYLE
  // ====================================================

  const fieldSx = {
    width: '100%',

    '& .MuiInputBase-root': {
      bgcolor: '#fff'
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

          px: 3,

          py: 3,

          boxSizing: 'border-box'
        }}
      >
        {/* ================================================= */}
        {/* CARD */}
        {/* ================================================= */}

        <Paper
          variant="outlined"
          sx={{
            width: '100%',

            borderRadius: 2.5,

            boxShadow: 'none',

            bgcolor: '#fff',

            overflow: 'hidden'
          }}
        >
          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

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
              <Inventory2OutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,

                  lineHeight: 1.25
                }}
              >
                Nhập vaccine
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Thêm thông tin vaccine mới vào kho
              </Typography>
            </Box>
          </Box>

          {/* ============================================= */}
          {/* FORM */}
          {/* ============================================= */}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                px: 3,

                py: 3
              }}
            >
              {/* ========================================= */}
              {/* 2 COLUMNS */}
              {/* ========================================= */}

              <Box
                sx={{
                  display: 'grid',

                  gridTemplateColumns: {
                    xs: '1fr',

                    md: 'repeat(2, minmax(0, 1fr))'
                  },

                  columnGap: 4,

                  rowGap: 2.5
                }}
              >
                {/* ======================================= */}
                {/* VACCINE NAME */}
                {/* ======================================= */}

                <TextField
                  label="Tên vaccine"
                  placeholder="Nhập tên vaccine"
                  fullWidth
                  required
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

                {/* ======================================= */}
                {/* DOSAGE */}
                {/* ======================================= */}

                <TextField
                  label="Hàm lượng"
                  placeholder="VD: 0.5 ml"
                  fullWidth
                  required
                  {...register('dosage')}
                  error={Boolean(errors.dosage)}
                  helperText={errors.dosage?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 50
                    }
                  }}
                  sx={fieldSx}
                />

                {/* ======================================= */}
                {/* VACCINE TYPE */}
                {/* ======================================= */}

                <Controller
                  name="vaccineType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Loại vaccine"
                      fullWidth
                      required
                      error={Boolean(errors.vaccineType)}
                      helperText={errors.vaccineType?.message}
                      sx={fieldSx}
                    >
                      <MenuItem value="">
                        <em>Chọn loại vaccine</em>
                      </MenuItem>

                      {vaccineTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                {/* ======================================= */}
                {/* BATCH NUMBER */}
                {/* ======================================= */}

                <TextField
                  label="Số lô"
                  placeholder="Nhập số lô"
                  fullWidth
                  required
                  {...register('batchNumber')}
                  error={Boolean(errors.batchNumber)}
                  helperText={errors.batchNumber?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 50
                    }
                  }}
                  sx={fieldSx}
                />

                {/* ======================================= */}
                {/* IMPORT DATE */}
                {/* DD/MM/YYYY */}
                {/* ======================================= */}

                <Controller
                  name="importDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Ngày nhập"
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

                          error: Boolean(errors.importDate),

                          helperText: errors.importDate?.message,

                          sx: fieldSx
                        }
                      }}
                    />
                  )}
                />

                {/* ======================================= */}
                {/* EXPIRY DATE */}
                {/* DD/MM/YYYY */}
                {/* ======================================= */}

                <Controller
                  name="expiryDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Hạn sử dụng"
                      format="DD/MM/YYYY"
                      minDate={
                        importDate
                          ? dayjs(importDate).add(1, 'day')
                          : dayjs().add(1, 'day')
                      }
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(value) => {
                        field.onChange(value ? value.format('YYYY-MM-DD') : '')
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,

                          required: true,

                          onBlur: field.onBlur,

                          error: Boolean(errors.expiryDate),

                          helperText: errors.expiryDate?.message,

                          sx: fieldSx
                        }
                      }}
                    />
                  )}
                />

                {/* ======================================= */}
                {/* LICENSE */}
                {/* ======================================= */}

                <TextField
                  label="Số giấy phép"
                  placeholder="Nhập số giấy phép"
                  fullWidth
                  required
                  {...register('licenseNumber')}
                  error={Boolean(errors.licenseNumber)}
                  helperText={errors.licenseNumber?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 50
                    }
                  }}
                  sx={fieldSx}
                />

                {/* ======================================= */}
                {/* STORAGE */}
                {/* ======================================= */}

                <TextField
                  label="Điều kiện bảo quản"
                  placeholder="VD: 2°C - 8°C"
                  fullWidth
                  required
                  {...register('storageCondition')}
                  error={Boolean(errors.storageCondition)}
                  helperText={errors.storageCondition?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 100
                    }
                  }}
                  sx={fieldSx}
                />

                {/* ======================================= */}
                {/* COUNTRY */}
                {/* ======================================= */}

                <TextField
                  label="Nước sản xuất"
                  placeholder="Nhập nước sản xuất"
                  fullWidth
                  required
                  {...register('country')}
                  error={Boolean(errors.country)}
                  helperText={errors.country?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 100
                    }
                  }}
                  sx={fieldSx}
                />

                {/* ======================================= */}
                {/* AGE GROUP */}
                {/* ======================================= */}

                <TextField
                  label="Độ tuổi tiêm chủng"
                  placeholder="VD: Trẻ em, Người lớn"
                  fullWidth
                  required
                  {...register('ageGroup')}
                  error={Boolean(errors.ageGroup)}
                  helperText={errors.ageGroup?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 100
                    }
                  }}
                  sx={fieldSx}
                />

                {/* ======================================= */}
                {/* PRICE */}
                {/* ======================================= */}

                <TextField
                  label="Đơn giá"
                  placeholder="Nhập đơn giá"
                  type="number"
                  fullWidth
                  required
                  {...register('price')}
                  error={Boolean(errors.price)}
                  helperText={errors.price?.message}
                  slotProps={{
                    htmlInput: {
                      min: 1,

                      max: 100000000,

                      step: 1000
                    },

                    input: {
                      endAdornment: (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            ml: 1
                          }}
                        >
                          VNĐ
                        </Typography>
                      )
                    }
                  }}
                  sx={fieldSx}
                />
              </Box>
            </Box>

            {/* ============================================= */}
            {/* ACTION */}
            {/* ============================================= */}

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
                startIcon={<SaveOutlinedIcon />}
                disabled={isSubmitting}
                sx={{
                  minWidth: 110,
                  height: 42,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {isSubmitting ? 'Đang nhập...' : 'Nhập'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default InventoryImport
