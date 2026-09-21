'use client'

import {
  Box,
  Button,
  Chip,
  Paper,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import OutputOutlinedIcon from '@mui/icons-material/OutputOutlined'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// ======================================================
// TYPES
// ======================================================

type InventoryItem = {
  id: number
  vaccineName: string
  vaccineType: string
  importDate: string
  licenseNumber: string
  country: string
  dosage: string
  batchNumber: string
  expiryDate: string
  storageCondition: string
  ageGroup: string
  quantity: number
}

// ======================================================
// MOCK DATA
// ======================================================

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    vaccineName: 'Phòng bệnh lao',
    vaccineType: 'BCG',
    importDate: '2026-09-01',
    licenseNumber: 'GP001',
    country: 'Việt Nam',
    dosage: '0.1 ml',
    batchNumber: 'BCG202601',
    expiryDate: '2027-09-01',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ em',
    quantity: 500
  },
  {
    id: 2,
    vaccineName: 'Phòng Viêm gan B',
    vaccineType: 'ENGERIX B',
    importDate: '2026-09-05',
    licenseNumber: 'GP002',
    country: 'Bỉ',
    dosage: '1 ml',
    batchNumber: 'EGB202602',
    expiryDate: '2027-09-05',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Người lớn > 20 tuổi',
    quantity: 200
  },
  {
    id: 3,
    vaccineName: 'Phòng bệnh uốn ván',
    vaccineType: 'TETAVAX',
    importDate: '2026-09-10',
    licenseNumber: 'GP003',
    country: 'Pháp',
    dosage: '0.5 ml',
    batchNumber: 'TTV202603',
    expiryDate: '2027-09-10',
    storageCondition: '2°C - 8°C',
    ageGroup: 'Trẻ em',
    quantity: 500
  }
]

// ======================================================
// VALIDATION
// ======================================================

const createExportSchema = (availableQuantity: number) =>
  z.object({
    quantity: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập số lượng xuất')
      .refine(
        (value) => {
          const number = Number(value)

          return Number.isInteger(number) && number >= 1
        },
        {
          message: 'Số lượng xuất phải là số nguyên lớn hơn 0'
        }
      )
      .refine((value) => Number(value) <= availableQuantity, {
        message: `Số lượng xuất không được vượt quá tồn kho (${availableQuantity})`
      })
  })

type ExportForm = {
  quantity: string
}

// ======================================================
// COMPONENT
// ======================================================

const InventoryExport = () => {
  const router = useRouter()

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedItem = useMemo(
    () => inventoryData.find((item) => item.id === selectedId) ?? null,
    [selectedId]
  )

  const schema = useMemo(
    () => createExportSchema(selectedItem?.quantity ?? 0),
    [selectedItem]
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ExportForm>({
    resolver: zodResolver(schema),
    mode: 'onTouched',

    defaultValues: {
      quantity: ''
    }
  })

  // ====================================================
  // SELECT VACCINE
  // ====================================================

  const handleSelect = (id: number) => {
    setSelectedId(id)

    reset({
      quantity: ''
    })
  }

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.push('/inventory')
  }

  // ====================================================
  // SUBMIT
  // ====================================================

  const onSubmit = async (data: ExportForm) => {
    if (!selectedItem) {
      return
    }

    const payload = {
      inventoryId: selectedItem.id,

      batchNumber: selectedItem.batchNumber,

      vaccineName: selectedItem.vaccineName,

      quantity: Number(data.quantity),

      exportDate: dayjs().format('YYYY-MM-DD'),

      exportTime: dayjs().format('HH:mm')
    }

    console.log('EXPORT VACCINE:', payload)

    // TODO:
    //
    // Sau này gọi API:
    //
    // await inventoryService.exportVaccine(
    //   payload
    // )

    router.push('/inventory')
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
              <OutputOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,

                  lineHeight: 1.25
                }}
              >
                Xuất vaccine
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Chọn vaccine và số lượng cần xuất khỏi kho
              </Typography>
            </Box>
          </Box>

          {/* ============================================= */}
          {/* TABLE */}
          {/* ============================================= */}

          <Box
            sx={{
              p: 3
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1.5,

                fontWeight: 600
              }}
            >
              Chọn vaccine cần xuất
            </Typography>

            <TableContainer
              sx={{
                border: '1px solid',

                borderColor: 'divider',

                borderRadius: 2,

                maxHeight: 420
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={60} align="center">
                      Chọn
                    </TableCell>

                    <TableCell>Tên vaccine</TableCell>

                    <TableCell>Loại vaccine</TableCell>

                    <TableCell>Số lô</TableCell>

                    <TableCell>Ngày nhập</TableCell>

                    <TableCell>Hạn sử dụng</TableCell>

                    <TableCell align="right">Tồn kho</TableCell>

                    <TableCell>Điều kiện bảo quản</TableCell>

                    <TableCell>Độ tuổi</TableCell>

                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {inventoryData.map((item) => {
                    const selected = selectedId === item.id

                    return (
                      <TableRow
                        key={item.id}
                        hover
                        selected={selected}
                        onClick={() => handleSelect(item.id)}
                        sx={{
                          cursor: 'pointer'
                        }}
                      >
                        <TableCell align="center">
                          <Radio
                            checked={selected}
                            onChange={() => handleSelect(item.id)}
                            value={item.id}
                          />
                        </TableCell>

                        <TableCell>{item.vaccineName}</TableCell>

                        <TableCell>{item.vaccineType}</TableCell>

                        <TableCell>{item.batchNumber}</TableCell>

                        <TableCell>
                          {dayjs(item.importDate).format('DD/MM/YYYY')}
                        </TableCell>

                        <TableCell>
                          {dayjs(item.expiryDate).format('DD/MM/YYYY')}
                        </TableCell>

                        <TableCell align="right">
                          <Typography
                            sx={{
                              fontWeight: 600
                            }}
                          >
                            {item.quantity}
                          </Typography>
                        </TableCell>

                        <TableCell>{item.storageCondition}</TableCell>

                        <TableCell>{item.ageGroup}</TableCell>

                        <TableCell>
                          <Chip
                            label={item.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                            color={item.quantity > 0 ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* ============================================= */}
          {/* EXPORT FORM */}
          {/* ============================================= */}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                px: 3,

                pb: 3,

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
                label="Vaccine đã chọn"
                fullWidth
                disabled
                value={
                  selectedItem
                    ? `${selectedItem.vaccineName} - Lô ${selectedItem.batchNumber}`
                    : ''
                }
                placeholder="Chưa chọn vaccine"
              />

              <TextField
                label="Số lượng xuất"
                type="number"
                required
                fullWidth
                disabled={!selectedItem}
                placeholder="Nhập số lượng xuất"
                {...register('quantity')}
                error={Boolean(errors.quantity)}
                helperText={
                  errors.quantity?.message ||
                  (selectedItem
                    ? `Tồn kho hiện tại: ${selectedItem.quantity}`
                    : 'Vui lòng chọn vaccine trước')
                }
                slotProps={{
                  htmlInput: {
                    min: 1,

                    max: selectedItem?.quantity ?? undefined,

                    step: 1
                  }
                }}
              />
            </Box>

            {/* =========================================== */}
            {/* ACTION */}
            {/* =========================================== */}

            <Box
              sx={{
                px: 3,

                py: 2,

                borderTop: '1px solid',

                borderColor: 'divider',

                display: 'flex',

                justifyContent: 'flex-end',

                alignItems: 'center',

                gap: 1.5
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
                startIcon={<OutputOutlinedIcon />}
                disabled={!selectedItem || isSubmitting}
                sx={{
                  minWidth: 130,

                  height: 42,

                  textTransform: 'none',

                  fontWeight: 600
                }}
              >
                {isSubmitting ? 'Đang xuất...' : 'Xuất'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default InventoryExport
