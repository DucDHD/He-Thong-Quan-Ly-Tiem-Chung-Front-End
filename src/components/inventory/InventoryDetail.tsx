'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Typography
} from '@mui/material'

import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'

import {
  getAllInventoryAPI,
  getImportHistoryAPI,
  getExportHistoryAPI,
  type InventoryItem
} from '@/services/inventory.type'

import type { InventoryHistoryRow } from './InventoryHistoryDialog'
import InventoryHistoryDialog from './InventoryHistoryDialog'

import { formatDate } from '@/utils/format'

const money = (value?: number | null) =>
  value == null ? '—' : `${Number(value).toLocaleString('vi-VN')} VNĐ`

export default function InventoryDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()

  // =========================
  // CURRENT PAGE - GIỐNG USER DETAIL
  // =========================

  const currentPage = searchParams.get('currentPage') || '1'

  // =========================
  // STATE
  // =========================

  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)

  const [imports, setImports] = useState<InventoryHistoryRow[]>([])
  const [exports, setExports] = useState<InventoryHistoryRow[]>([])

  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyConnected, setHistoryConnected] = useState(false)

  // =========================
  // GET INVENTORY DETAIL
  // =========================

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAllInventoryAPI()

        if (active) {
          setItem(
            data.find((row) => Number(row.inventory_id) === Number(id)) ?? null
          )
        }
      } catch (err) {
        console.error('Lỗi tải tồn kho:', err)

        if (active) {
          setError('Không thể tải thông tin lô vaccine.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [id])

  // =========================
  // BACK - GIỮ TRANG HIỆN TẠI
  // =========================

  const handleBack = () => {
    router.push(`/inventory?page=${currentPage}`)
  }

  // =========================
  // HISTORY
  // =========================

  const handleOpenHistory = async () => {
    if (!item) return

    setHistoryOpen(true)
    setHistoryLoading(true)
    setHistoryConnected(false)
    setImports([])
    setExports([])

    try {
      const [importData, exportData] = await Promise.all([
        getImportHistoryAPI(item.inventory_id),
        getExportHistoryAPI(item.inventory_id)
      ])

      setImports(importData)
      setExports(exportData)
      setHistoryConnected(true)
    } catch (error) {
      console.error('Lỗi tải lịch sử nhập / xuất:', error)
    } finally {
      setHistoryLoading(false)
    }
  }

  // =========================
  // DETAILS
  // =========================

  const details: [string, string | number | null | undefined][] = item
    ? [
        ['Tên vaccine', item.vaccine_name],
        ['Loại vaccine', item.vaccine_type],
        ['Số giấy phép', item.license_number],
        ['Nhà sản xuất', item.manufacturer],
        ['Nước sản xuất', item.country],
        ['Độ tuổi tiêm', item.vaccination_age],
        ['Hàm lượng', item.dosage],
        ['Điều kiện bảo quản', item.storage_condition],
        ['Đơn vị', item.unit],
        ['Giá vaccine', money(item.unit_price)],
        ['Mô tả', item.description],
        ['Đang hoạt động', item.isActive ? 'Có' : 'Không']
      ]
    : []

  // =========================
  // UI
  // =========================

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
      <Box sx={{ p: { xs: 1.5, md: 3 } }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 2.5
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 2
            }}
          >
            {/* BACK */}
            <IconButton
              onClick={handleBack}
              sx={{
                width: 42,
                height: 42,
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                flexShrink: 0
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
              <Inventory2OutlinedIcon />
            </Box>

            {/* TITLE */}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.25
                }}
              >
                Chi tiết tồn kho vaccine
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25 }}
              >
                Xem thông tin vaccine và lịch sử nhập xuất kho
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : !item ? (
            <Alert severity="warning">Không tìm thấy lô vaccine.</Alert>
          ) : (
            <>
              {/* VACCINE INFORMATION */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 2
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Thông tin vaccine
                </Typography>

                <Chip
                  size="small"
                  variant="outlined"
                  color={Number(item.quantity) > 0 ? 'success' : 'error'}
                  label={Number(item.quantity) > 0 ? 'Còn hàng' : 'Hết hàng'}
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    lg: 'repeat(3, minmax(0, 1fr))'
                  },
                  columnGap: 3,
                  rowGap: 2
                }}
              >
                {details.map(([label, value]) => (
                  <Box key={label} sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#475569',
                        mb: 0.5
                      }}
                    >
                      {label}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#111827',
                        lineHeight: 1.5,
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {value == null || value === '' ? '—' : value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2.5 }} />

              {/* INVENTORY INFORMATION */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1.5
                }}
              >
                Thông tin lô tồn kho
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(3, minmax(0, 1fr))'
                  },
                  gap: 1.5
                }}
              >
                {(
                  [
                    ['Mã lô', item.lot_code],
                    [
                      'Số lượng tồn',
                      Number(item.quantity).toLocaleString('vi-VN')
                    ],
                    ['Hạn sử dụng', formatDate(item.expiry_date)]
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <Box
                    key={label}
                    sx={{
                      px: 1.75,
                      py: 1.25,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary'
                      }}
                    >
                      {label}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* HISTORY BUTTON */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  flexWrap: 'wrap',
                  mt: 2
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<HistoryOutlinedIcon />}
                  onClick={handleOpenHistory}
                  disabled={historyLoading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Xem lịch sử nhập / xuất
                </Button>
              </Box>

              {/* HISTORY DIALOG */}
              <InventoryHistoryDialog
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                vaccineName={item.vaccine_name}
                lotCode={item.lot_code}
                imports={imports}
                exports={exports}
                historyConnected={historyConnected}
                exportHistoryConnected={historyConnected}
              />
            </>
          )}
        </Paper>
      </Box>
    </Box>
  )
}
