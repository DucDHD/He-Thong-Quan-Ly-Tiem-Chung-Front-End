'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'react-toastify'
import { NumericFormat } from 'react-number-format'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import type { FieldPath } from 'react-hook-form'

import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'

import { insertInventoryAPI } from '@/services/inventory.type'
import {
  getAllVaccineAPI,
  type Vaccine
} from '@/services/vaccination-schedule.service'

// ======================================================
// VALIDATION
// ======================================================

const validDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00Z`)

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  )
}

const detailSchema = z.object({
  vaccine_id: z
    .number({ message: 'Vui lòng chọn vaccine' })
    .int('Mã vaccine phải là số nguyên')
    .positive('Vui lòng chọn vaccine'),

  lot_code: z
    .string()
    .trim()
    .nonempty('Vui lòng nhập mã lô')
    .max(100, 'Mã lô không được vượt quá 100 ký tự'),

  expiry_date: z
    .string()
    .nonempty('Vui lòng chọn ngày hết hạn')
    .refine(validDate, 'Ngày hết hạn không hợp lệ'),

  quantity: z
    .number({ message: 'Vui lòng nhập số lượng' })
    .int('Số lượng phải là số nguyên')
    .positive('Số lượng phải lớn hơn 0'),

  unit_price: z
    .number({ message: 'Vui lòng nhập đơn giá' })
    .finite('Đơn giá không hợp lệ')
    .nonnegative('Đơn giá không được âm')
})

const inventorySchema = z.object({
  import_date: z
    .string()
    .nonempty('Vui lòng chọn ngày nhập')
    .refine(validDate, 'Ngày nhập không hợp lệ'),

  note: z.string().trim().max(500, 'Ghi chú không được vượt quá 500 ký tự'),

  details: z
    .array(detailSchema)
    .nonempty('Phiếu nhập phải có ít nhất một vaccine')
})

type InventoryFormData = z.infer<typeof inventorySchema>

// ======================================================
// FIELD STYLE
// ======================================================

const fieldSx = {
  '& .MuiFormHelperText-root': {
    minHeight: 20,
    marginTop: '4px',
    marginLeft: '4px',
    lineHeight: '16px',
    fontSize: 12
  }
}

// ======================================================
// INITIAL DATA
// ======================================================

const emptyDetail = (): InventoryFormData['details'][number] => ({
  vaccine_id: 0,
  lot_code: '',
  expiry_date: '',
  quantity: 1,
  unit_price: 0
})

const localToday = () => {
  const now = new Date()

  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

// ======================================================
// COMPONENT
// ======================================================

const InventoryImport = () => {
  const router = useRouter()

  const [vaccines, setVaccines] = useState<Vaccine[]>([])

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    mode: 'onTouched',
    defaultValues: {
      import_date: localToday(),
      note: '',
      details: [emptyDetail()]
    }
  })

  // ====================================================
  // FETCH VACCINES
  // ====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vaccinesData = await getAllVaccineAPI()
        setVaccines(vaccinesData)
      } catch (error) {
        console.error('Lỗi lấy danh sách vaccine:', error)
        toast.error('Không thể tải danh sách vaccine')
      }
    }

    fetchData()
  }, [])

  // ====================================================
  // FIELD ARRAY
  // ====================================================

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details'
  })

  const details =
    useWatch({
      control,
      name: 'details'
    }) ?? []

  const totalAmount = details.reduce(
    (total, detail) =>
      total + (Number(detail.quantity) || 0) * (Number(detail.unit_price) || 0),
    0
  )

  // ====================================================
  // HANDLERS
  // ====================================================

  const handleBack = () => {
    router.push('/inventory')
  }

  const handleCreate = async (data: InventoryFormData) => {
    try {
      await insertInventoryAPI(data)

      toast.success('Nhập vaccine thành công')

      reset()
      router.push('/inventory')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { field, message } = error.response?.data || {}

        if (field && typeof message === 'string') {
          setError(field as FieldPath<InventoryFormData>, {
            type: 'server',
            message
          })

          return
        }
      }

      toast.error('Nhập vaccine thất bại')
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
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      })}
    >
      <Box
        sx={{
          width: '100%',
          px: 3,
          py: 1.5,
          boxSizing: 'border-box',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* MAIN PAPER */}

        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            flex: 1,
            bgcolor: '#fff',
            borderRadius: 2.5,
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              px: 3,
              py: 2,
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
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#fff',
                flexShrink: 0
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
                sx={{
                  color: 'text.secondary',
                  mt: 0.25
                }}
              >
                Tạo phiếu nhập và cập nhật số lượng vaccine trong kho
              </Typography>
            </Box>
          </Box>

          {/* FORM */}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(handleCreate)}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* THÔNG TIN PHIẾU NHẬP */}

            <Box sx={{ px: 3, py: 2 }}>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  mb: 2
                }}
              >
                Thông tin phiếu nhập
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: '1fr 2fr'
                  },
                  gap: 2,
                  alignItems: 'start'
                }}
              >
                {/* IMPORT DATE */}

                <Controller
                  name="import_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Ngày nhập"
                      format="DD/MM/YYYY"
                      disabled={isSubmitting}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        field.onChange(
                          date?.isValid() ? date.format('YYYY-MM-DD') : ''
                        )
                      }}
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                          error: Boolean(errors.import_date),
                          helperText: errors.import_date?.message || ' ',
                          sx: fieldSx
                        }
                      }}
                    />
                  )}
                />

                {/* NOTE */}

                <TextField
                  label="Ghi chú"
                  fullWidth
                  placeholder="Nhập ghi chú cho phiếu nhập (nếu có)"
                  disabled={isSubmitting}
                  {...register('note')}
                  error={Boolean(errors.note)}
                  helperText={errors.note?.message || ' '}
                  sx={fieldSx}
                  slotProps={{
                    htmlInput: {
                      maxLength: 500
                    }
                  }}
                />
              </Box>
            </Box>

            <Divider />

            {/* DANH SÁCH VACCINE */}

            <Box
              sx={{
                px: 3,
                py: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  mb: 2
                }}
              >
                Danh sách vaccine
              </Typography>

              {errors.details?.root?.message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.details.root.message}
                </Alert>
              )}

              {/* VACCINE ITEMS */}

              <Stack sx={{ gap: 2 }}>
                {fields.map((item, index) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: '#fafafa'
                    }}
                  >
                    {/* ITEM HEADER */}

                    <Stack
                      sx={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 14
                        }}
                      >
                        Vaccine #{index + 1}
                      </Typography>

                      <IconButton
                        type="button"
                        color="error"
                        disabled={fields.length === 1 || isSubmitting}
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                    {/* ITEM FIELDS */}

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: 'repeat(2, minmax(0, 1fr))',
                          md: 'repeat(3, minmax(0, 1fr))'
                        },
                        columnGap: 2,
                        rowGap: 1
                      }}
                    >
                      {/* VACCINE SELECT */}

                      <Controller
                        name={`details.${index}.vaccine_id`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            select
                            label="Loại vaccine"
                            required
                            fullWidth
                            disabled={isSubmitting}
                            name={field.name}
                            value={field.value}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            onChange={(event) =>
                              field.onChange(Number(event.target.value))
                            }
                            error={Boolean(errors.details?.[index]?.vaccine_id)}
                            helperText={
                              errors.details?.[index]?.vaccine_id?.message ||
                              ' '
                            }
                            sx={fieldSx}
                          >
                            <MenuItem value={0}>
                              <em>Chọn vaccine</em>
                            </MenuItem>

                            {vaccines.map((vaccine) => (
                              <MenuItem
                                key={vaccine.vaccine_id}
                                value={vaccine.vaccine_id}
                              >
                                {vaccine.vaccine_name}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />

                      {/* LOT CODE */}

                      <TextField
                        label="Mã lô"
                        required
                        fullWidth
                        disabled={isSubmitting}
                        {...register(`details.${index}.lot_code`)}
                        error={Boolean(errors.details?.[index]?.lot_code)}
                        helperText={
                          errors.details?.[index]?.lot_code?.message || ' '
                        }
                        sx={fieldSx}
                        slotProps={{
                          htmlInput: {
                            maxLength: 100
                          }
                        }}
                      />

                      {/* EXPIRY DATE */}

                      <Controller
                        name={`details.${index}.expiry_date`}
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label="Ngày hết hạn"
                            format="DD/MM/YYYY"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => {
                              field.onChange(
                                date?.isValid() ? date.format('YYYY-MM-DD') : ''
                              )
                            }}
                            disabled={isSubmitting}
                            slotProps={{
                              textField: {
                                required: true,
                                fullWidth: true,
                                error: Boolean(
                                  errors.details?.[index]?.expiry_date
                                ),
                                helperText:
                                  errors.details?.[index]?.expiry_date
                                    ?.message || ' ',
                                sx: fieldSx
                              }
                            }}
                          />
                        )}
                      />

                      {/* QUANTITY */}

                      <TextField
                        label="Số lượng"
                        type="number"
                        required
                        fullWidth
                        disabled={isSubmitting}
                        {...register(`details.${index}.quantity`, {
                          valueAsNumber: true
                        })}
                        error={Boolean(errors.details?.[index]?.quantity)}
                        helperText={
                          errors.details?.[index]?.quantity?.message || ' '
                        }
                        sx={fieldSx}
                        slotProps={{
                          htmlInput: {
                            min: 1,
                            step: 1
                          }
                        }}
                      />

                      {/* UNIT PRICE */}

                      <Controller
                        name={`details.${index}.unit_price`}
                        control={control}
                        render={({ field }) => (
                          <NumericFormat
                            customInput={TextField}
                            label="Đơn giá"
                            required
                            fullWidth
                            placeholder="VD: 400.000"
                            value={field.value}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={0}
                            allowNegative={false}
                            allowLeadingZeros={false}
                            suffix=" VNĐ"
                            disabled={isSubmitting}
                            onBlur={field.onBlur}
                            getInputRef={field.ref}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? NaN)
                            }}
                            isAllowed={(values) => {
                              const value = values.floatValue

                              return value === undefined || value <= 999999999
                            }}
                            error={Boolean(errors.details?.[index]?.unit_price)}
                            helperText={
                              errors.details?.[index]?.unit_price?.message ||
                              ' '
                            }
                            sx={fieldSx}
                          />
                        )}
                      />

                      {/* TOTAL PRICE */}

                      <TextField
                        label="Thành tiền"
                        value={
                          (
                            (Number(details[index]?.quantity) || 0) *
                            (Number(details[index]?.unit_price) || 0)
                          ).toLocaleString('vi-VN') + ' đ'
                        }
                        fullWidth
                        helperText=" "
                        slotProps={{
                          input: {
                            readOnly: true
                          }
                        }}
                        sx={{
                          ...fieldSx,
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#f1f5f9'
                          },
                          '& .MuiInputBase-input': {
                            fontWeight: 600
                          }
                        }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Stack>

              {/* ADD VACCINE BUTTON */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 1.5
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    append(emptyDetail(), {
                      shouldFocus: false
                    })
                  }
                  disabled={isSubmitting}
                  sx={{
                    textTransform: 'none',
                    height: 40
                  }}
                >
                  Thêm vaccine
                </Button>
              </Box>
            </Box>

            {/* TOTAL + ACTION */}

            <Box
              sx={{
                px: 3,
                py: 2,
                mt: 'auto',
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  sm: 'row'
                },
                justifyContent: 'space-between',
                alignItems: {
                  xs: 'stretch',
                  sm: 'center'
                },
                gap: 2
              }}
            >
              {/* TOTAL AMOUNT */}

              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: 'text.secondary'
                  }}
                >
                  Tổng tiền phiếu nhập
                </Typography>

                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'primary.main'
                  }}
                >
                  {totalAmount.toLocaleString('vi-VN')} đ
                </Typography>
              </Box>

              {/* ACTION BUTTONS */}

              <Stack
                sx={{
                  flexDirection: 'row',
                  gap: 1.5,
                  justifyContent: {
                    xs: 'flex-end',
                    sm: 'flex-start'
                  }
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<ArrowBackOutlinedIcon />}
                  onClick={handleBack}
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 110,
                    height: 42,
                    textTransform: 'none'
                  }}
                >
                  Hủy
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 150,
                    height: 42,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu phiếu nhập'}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default InventoryImport
