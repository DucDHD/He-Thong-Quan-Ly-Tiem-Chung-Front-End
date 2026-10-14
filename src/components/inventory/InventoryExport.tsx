'use client'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import {
  AddCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  Inventory2Outlined,
  RestartAlt
} from '@mui/icons-material'
import {
  exportVaccineAPI,
  getVaccineAvailableAPI,
  type VaccineAvailable
} from '@/services/inventory.type'
import { formatDate } from '@/utils/format'
import { toast } from 'react-toastify'

// ======================================
// HELPERS
// ======================================
const getToday = (): string => {
  const date = new Date()
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}
const validDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  )
}

const detailSchema = z.object({
  inventory_id: z
    .number({
      message: 'Vui lòng chọn vaccine'
    })
    .positive('Vui lòng chọn vaccine'),
  quantity: z
    .number({
      message: 'Vui lòng nhập số lượng'
    })
    .positive('Số lượng phải lớn hơn 0')
})
const exportSchema = z.object({
  export_date: z
    .string()
    .nonempty('Vui lòng chọn ngày xuất')
    .refine(validDate, 'Ngày xuất không hợp lệ'),

  note: z.string(),
  details: z
    .array(detailSchema)
    .nonempty('Phiếu xuất phải có ít nhất một vaccine')
})
const createExportSchema = (inventories: VaccineAvailable[]) =>
  exportSchema.superRefine((data, ctx) => {
    const selectedIds = new Set<number>()
    data.details.forEach((detail, index) => {
      if (detail.inventory_id <= 0) return
      if (selectedIds.has(detail.inventory_id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['details', index, 'inventory_id'],
          message: 'Lô vaccine đã được chọn ở dòng khác'
        })
      }
      selectedIds.add(detail.inventory_id)
      const inventory = inventories.find(
        (item) => Number(item.inventory_id) === detail.inventory_id
      )
      if (!inventory) {
        ctx.addIssue({
          code: 'custom',
          path: ['details', index, 'inventory_id'],
          message: 'Không tìm thấy vaccine trong kho'
        })
        return
      }
      if (inventory.quantity <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['details', index, 'inventory_id'],
          message: 'Lô vaccine đã hết tồn kho'
        })
      }
      if (detail.quantity > inventory.quantity) {
        ctx.addIssue({
          code: 'custom',
          path: ['details', index, 'quantity'],
          message: `Số lượng vượt tồn kho (${inventory.quantity} liều)`
        })
      }
    })
  })
type ExportFormValues = z.infer<typeof exportSchema>
// ======================================
// DEFAULT VALUES
// ======================================
const createDefaultValues = (): ExportFormValues => ({
  export_date: getToday(),
  note: '',
  details: [
    {
      inventory_id: 0,
      quantity: 0
    }
  ]
})
// ======================================
// COMPONENT
// ======================================
export default function VaccineExport() {
  const [inventories, setInventories] = useState<VaccineAvailable[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  // ======================================
  // ZOD RESOLVER
  // ======================================
  const schema = useMemo(() => createExportSchema(inventories), [inventories])
  // ======================================
  // REACT HOOK FORM
  // ======================================
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors, isSubmitting, submitCount }
  } = useForm<ExportFormValues>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: createDefaultValues()
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details'
  })
  const watchedDetails = useWatch({
    control,
    name: 'details'
  })
  const details = watchedDetails ?? []
  // ======================================
  // LOAD INVENTORIES
  // ======================================
  useEffect(() => {
    let active = true
    const fetchInventories = async () => {
      try {
        setLoading(true)
        setLoadError('')
        const data = await getVaccineAvailableAPI()
        if (active) {
          setInventories(data)
        }
      } catch (error) {
        console.error('Lỗi tải vaccine:', error)
        if (active) {
          setLoadError('Không thể tải danh sách vaccine.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }
    void fetchInventories()
    return () => {
      active = false
    }
  }, [])
  // ======================================
  // TOTAL QUANTITY
  // ======================================
  const totalQuantity = useMemo(() => {
    return details.reduce((sum, detail) => {
      const quantity = Number(detail.quantity)
      return (
        sum + (Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 0)
      )
    }, 0)
  }, [details])
  // ======================================
  // FIND INVENTORY
  // ======================================
  const findInventory = (inventoryId: number): VaccineAvailable | undefined => {
    return inventories.find((item) => Number(item.inventory_id) === inventoryId)
  }
  // ======================================
  // ADD ROW
  // ======================================
  const handleAddRow = () => {
    append({
      inventory_id: 0,
      quantity: 0
    })
  }
  // ======================================
  // REMOVE ROW
  // ======================================
  const handleRemoveRow = (index: number) => {
    if (fields.length <= 1) return
    remove(index)
    if (submitCount > 0) {
      setTimeout(() => {
        void trigger('details')
      }, 0)
    }
  }
  // ======================================
  // RESET
  // ======================================
  const handleReset = () => {
    reset(createDefaultValues())
  }
  // ======================================
  // SUBMIT
  // ======================================
  const onSubmit = async (data: ExportFormValues) => {
    if (loading || loadError) return

    const payload = {
      export_date: data.export_date,
      note: data.note,
      details: data.details.map((detail) => ({
        inventory_id: detail.inventory_id,
        quantity: detail.quantity
      }))
    }

    try {
      await exportVaccineAPI(payload)
      toast.success('Xuất vaccine Thành công')
      reset(createDefaultValues())
      // TODO: Hiển thị thông báo xuất kho thành công
    } catch (error) {
      console.error('Lỗi xuất kho:', error)
      // TODO: Hiển thị thông báo xuất kho thất bại
    }
  }
  // ======================================
  // RENDER
  // ======================================
  return (
    <Box
      component="main"
      sx={(theme) => ({
        ml: theme.layout.sidebarWidth,
        pt: theme.layout.headerHeight,
        height: `calc(100dvh - ${theme.layout.footerHeight})`,
        overflow: 'hidden',
        bgcolor: '#f5f7fb',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      })}
    >
      <Box
        sx={{
          width: '100%',
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, md: 3 },
          py: 1,
          minHeight: 0,
          boxSizing: 'border-box'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            border: '1px solid #e5eaf2',
            bgcolor: '#fff',
            minHeight: 0,
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              pt: 2,
              pb: 4,
              flexShrink: 0
            }}
          >
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1.25,
                mb: 1
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  bgcolor: '#eaf2ff',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Inventory2Outlined
                  sx={{
                    color: '#2563eb',
                    fontSize: 25
                  }}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0
                }}
              >
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#172033'
                  }}
                >
                  Xuất vaccine
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: 'text.secondary',
                    mt: 0.3
                  }}
                >
                  Tạo phiếu xuất vaccine từ kho tổng sang kho tiêm chủng
                </Typography>
              </Box>
              <Chip
                label="Phiếu mới"
                size="small"
                sx={{
                  bgcolor: '#f1f5f9',
                  fontWeight: 500
                }}
              />
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {/* NGÀY XUẤT */}
            <Controller
              name="export_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày xuất vaccine"
                  size="small"
                  type="date"
                  required
                  fullWidth
                  error={Boolean(errors.export_date)}
                  helperText={errors.export_date?.message}
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    }
                  }}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 380,
                      md: 420
                    },
                    maxWidth: '100%'
                  }}
                />
              )}
            />
          </Box>
          <Divider />
          {/* DANH SÁCH VACCINE */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              px: { xs: 2, md: 3 },
              py: 1.5,
              minWidth: 0
            }}
          >
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
                mb: 1.25
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700
                }}
              >
                Danh sách vaccine xuất
              </Typography>
              <Chip
                label={`${fields.length} vaccine`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
              }}
            >
              {fields.map((item, index) => {
                const detail = details[index]
                const selectedInventory = detail?.inventory_id
                  ? findInventory(detail.inventory_id)
                  : undefined
                return (
                  <Box
                    key={item.id}
                    sx={{
                      border: '1px solid #dce2ea',
                      borderRadius: 2,
                      bgcolor: '#fafbfc',
                      p: { xs: 1.25, md: 1.5 }
                    }}
                  >
                    {/* HEADER ROW */}
                    <Stack
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      {fields.length > 1 && (
                        <IconButton
                          type="button"
                          color="error"
                          size="small"
                          sx={{ ml: 'auto' }}
                          onClick={() => handleRemoveRow(index)}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                    {/* VACCINE + SỐ LƯỢNG */}
                    <Stack
                      sx={{
                        display: 'flex',
                        flexDirection: {
                          xs: 'column',
                          md: 'row'
                        },
                        gap: 1.5
                      }}
                    >
                      {/* CHỌN VACCINE */}

                      <Controller
                        name={`details.${index}.inventory_id`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            select
                            label="Chọn vaccine"
                            size="small"
                            required
                            fullWidth
                            disabled={loading || isSubmitting}
                            name={field.name}
                            value={field.value ? Number(field.value) : ''}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            onChange={(event) => {
                              field.onChange(Number(event.target.value) || 0)
                              setValue(`details.${index}.quantity`, 0)

                              if (submitCount > 0) {
                                void trigger('details')
                              }
                            }}
                            error={Boolean(
                              errors.details?.[index]?.inventory_id
                            )}
                            helperText={
                              errors.details?.[index]?.inventory_id?.message ||
                              ' '
                            }
                            sx={{
                              flex: '1 1 0',
                              minWidth: 0
                            }}
                          >
                            <MenuItem value="">
                              <em>Chọn vaccine</em>
                            </MenuItem>

                            {inventories
                              .filter(
                                (inventory) =>
                                  inventory.quantity > 0 ||
                                  Number(inventory.inventory_id) ===
                                    Number(field.value)
                              )
                              .map((inventory) => (
                                <MenuItem
                                  key={inventory.inventory_id}
                                  value={Number(inventory.inventory_id)}
                                >
                                  {inventory.vaccine_name}
                                </MenuItem>
                              ))}
                          </TextField>
                        )}
                      />

                      {/* SỐ LƯỢNG XUẤT */}
                      <Controller
                        name={`details.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Số lượng xuất"
                            size="small"
                            type="number"
                            required
                            fullWidth
                            disabled={isSubmitting}
                            name={field.name}
                            value={field.value || ''}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            onChange={(event) => {
                              const value = event.target.value
                              field.onChange(value === '' ? 0 : Number(value))
                            }}
                            error={Boolean(errors.details?.[index]?.quantity)}
                            helperText={
                              errors.details?.[index]?.quantity?.message || ' '
                            }
                            slotProps={{
                              htmlInput: {
                                min: 1,
                                step: 1,
                                max: selectedInventory?.quantity
                              }
                            }}
                            sx={{
                              flex: '1 1 0',
                              minWidth: 0
                            }}
                          />
                        )}
                      />
                    </Stack>
                    {/* Chừa sẵn chỗ cho thông tin lô: chọn vaccine không đổi chiều cao dòng */}
                    <Box
                      sx={{
                        mt: 1,
                        height: 64,
                        minHeight: 64,
                        overflow: 'hidden'
                      }}
                    >
                      {selectedInventory && (
                        <TableContainer
                          sx={{
                            border: '1px solid #e2e8f0',
                            borderRadius: 1,
                            bgcolor: '#fff'
                          }}
                        >
                          <Table size="small" sx={{ tableLayout: 'fixed' }}>
                            <TableHead>
                              <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                                {['Mã lô', 'Hạn sử dụng', 'Số lượng tồn'].map(
                                  (label) => (
                                    <TableCell
                                      key={label}
                                      sx={{
                                        width: '33.33%',
                                        py: 0.5,
                                        px: 1,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: '#64748b'
                                      }}
                                    >
                                      {label}
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow
                                sx={{ '&:last-child td': { borderBottom: 0 } }}
                              >
                                <TableCell
                                  sx={{ py: 0.5, px: 1, fontSize: 12 }}
                                >
                                  {selectedInventory.lot_code}
                                </TableCell>
                                <TableCell
                                  sx={{ py: 0.5, px: 1, fontSize: 12 }}
                                >
                                  {formatDate(selectedInventory.expiry_date)}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    py: 0.5,
                                    px: 1,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: '#16a34a'
                                  }}
                                >
                                  {selectedInventory.quantity} liều
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </Box>
                )
              })}
            </Stack>
            {/* THÊM VACCINE */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 1
              }}
            >
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddCircleOutlined />}
                onClick={handleAddRow}
                sx={{
                  textTransform: 'none',
                  borderRadius: 1.5,
                  px: 2
                }}
              >
                Thêm vaccine
              </Button>
            </Box>
            {/* GHI CHÚ */}
            <Box sx={{ mt: 1.5 }}>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ghi chú"
                    size="small"
                    placeholder="Nhập ghi chú (không bắt buộc)"
                    fullWidth
                    multiline
                    minRows={3}
                    error={Boolean(errors.note)}
                    helperText={errors.note?.message || ' '}
                    sx={{
                      '& .MuiInputBase-inputMultiline': {
                        resize: 'vertical',
                        overflow: 'auto'
                      }
                    }}
                  />
                )}
              />
            </Box>
            {/* LỖI TẢI API */}
            {loadError && (
              <Alert
                severity="error"
                sx={{
                  mt: 2
                }}
              >
                {loadError}
              </Alert>
            )}
          </Box>
          <Divider />
          {/* FOOTER */}
          <Box
            sx={{
              px: {
                xs: 2,
                md: 3
              },
              py: 1.25,
              flexShrink: 0,
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
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  color: 'text.secondary'
                }}
              >
                Tổng số liều xuất
              </Typography>
              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: '#2563eb'
                }}
              >
                {totalQuantity} liều
              </Typography>
            </Box>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 1.5
              }}
            >
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                startIcon={<RestartAlt />}
                onClick={handleReset}
                sx={{
                  textTransform: 'none',
                  borderRadius: 1.5,
                  px: 2.5
                }}
              >
                Làm mới
              </Button>
              <Button
                type="button"
                variant="contained"
                startIcon={<CheckCircleOutlined />}
                onClick={handleSubmit(onSubmit)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 1.5,
                  fontWeight: 600,
                  px: 2.5
                }}
              >
                xuất kho
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
