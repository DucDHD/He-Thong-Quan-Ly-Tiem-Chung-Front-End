'use client'

import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

import { formatDate } from '@/utils/format'

export interface InventoryHistoryRow {
  id: number
  code: string
  date: string
  lot_code?: string
  quantity: number
  unit_price?: number | null
  note?: string | null
}

interface Props {
  open: boolean
  onClose: () => void
  vaccineName: string
  lotCode: string
  imports: InventoryHistoryRow[]
  exports: InventoryHistoryRow[]
  loading?: boolean
  error?: string
  historyConnected?: boolean
  exportHistoryConnected?: boolean
}

const formatMoney = (value?: number | null) =>
  value == null ? '—' : `${Number(value).toLocaleString('vi-VN')} VNĐ`

export default function InventoryHistoryDialog({
  open,
  onClose,
  vaccineName,
  lotCode,
  imports,
  exports,
  loading = false,
  error = '',
  historyConnected = false,
  exportHistoryConnected = false
}: Props) {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleClose = () => {
    setTab(0)
    setSearch('')
    setPage(0)
    onClose()
  }

  const currentConnected = tab === 0 ? historyConnected : exportHistoryConnected

  const filtered = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi-VN')

    return (tab === 0 ? imports : exports).filter((row) => {
      if (!keyword) return true

      return [row.code, row.lot_code, row.note].some((value) =>
        String(value ?? '')
          .toLocaleLowerCase('vi-VN')
          .includes(keyword)
      )
    })
  }, [tab, imports, exports, search])

  const paginatedRows = useMemo(
    () => filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [filtered, page, rowsPerPage]
  )

  const showData = currentConnected && !loading && !error

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            width: '100%',
            maxWidth: 1200,
            height: 600,
            maxHeight: 'calc(100dvh - 32px)',
            borderRadius: 2.5,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 3,
          py: 2,
          flexShrink: 0
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Lịch sử nhập / xuất kho
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            Vaccine:{' '}
            <Box
              component="span"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {vaccineName}
            </Box>
            {'  -  '}
            Mã lô:{' '}
            <Box
              component="span"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {lotCode}
            </Box>
          </Typography>
        </Box>

        <IconButton aria-label="Đóng" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={tab}
          onChange={(_event, value: number) => {
            setTab(value)
            setPage(0)
            setSearch('')
          }}
          sx={{ mb: 2, flexShrink: 0 }}
        >
          <Tab label="Lịch sử nhập kho" />
          <Tab label="Lịch sử xuất kho" />
        </Tabs>

        <TextField
          size="small"
          value={search}
          placeholder="Tìm kiếm theo mã phiếu..."
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(0)
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }
          }}
          sx={{
            mb: 2,
            width: 300,
            maxWidth: '100%',
            flexShrink: 0,
            '& .MuiOutlinedInput-root': {
              height: 40,
              borderRadius: 2
            }
          }}
        />

        {!currentConnected && !loading && !error && (
          <Alert severity="info" sx={{ mb: 2, flexShrink: 0 }}>
            {tab === 0
              ? 'Chưa kết nối API lịch sử nhập kho.'
              : 'Chưa kết nối API lịch sử xuất kho.'}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>
            {error}
          </Alert>
        )}

        <TableContainer
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: 310,
            flexShrink: 0,
            overflow: 'hidden'
          }}
        >
          <Table
            size="small"
            sx={{
              width: '100%',
              tableLayout: 'fixed',
              '& .MuiTableCell-root': {
                px: 1.5,
                py: 1.5,
                fontSize: '0.82rem'
              },
              '& .MuiTableCell-head': {
                fontWeight: 700,
                bgcolor: '#f8fafc'
              }
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '22%' }}>Mã phiếu</TableCell>

                <TableCell sx={{ width: '19%' }}>
                  Ngày {tab === 0 ? 'nhập' : 'xuất'}
                </TableCell>

                <TableCell align="right" sx={{ width: '14%' }}>
                  Số lượng
                </TableCell>

                <TableCell align="right" sx={{ width: '21%' }}>
                  Đơn giá
                </TableCell>

                <TableCell align="right" sx={{ width: '24%' }}>
                  Tổng giá
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ height: 240 }}>
                    Đang tải lịch sử...
                  </TableCell>
                </TableRow>
              ) : !showData || filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      height: 240,
                      color: 'text.secondary'
                    }}
                  >
                    {!currentConnected
                      ? 'Chưa có dữ liệu để hiển thị.'
                      : 'Không có giao dịch phù hợp.'}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {paginatedRows.map((row) => (
                    <TableRow
                      key={`${tab}-${row.id}`}
                      hover
                      sx={{ height: 48 }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{row.code}</TableCell>

                      <TableCell>{formatDate(row.date)}</TableCell>

                      <TableCell align="right">
                        {Number(row.quantity).toLocaleString('vi-VN')}
                      </TableCell>

                      <TableCell align="right">
                        {formatMoney(row.unit_price)}
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {row.unit_price == null
                          ? '—'
                          : formatMoney(
                              Number(row.quantity) * Number(row.unit_price)
                            )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {Array.from({
                    length: Math.max(0, 5 - paginatedRows.length)
                  }).map((_, index) => (
                    <TableRow key={`empty-${index}`} sx={{ height: 48 }}>
                      <TableCell colSpan={5}> </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={showData ? filtered.length : 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={() =>
            `Trang ${page + 1} / ${Math.max(
              1,
              Math.ceil((showData ? filtered.length : 0) / rowsPerPage)
            )}`
          }
          sx={{
            flexShrink: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 1,
            '& .MuiTablePagination-selectLabel': { mb: 0 },
            '& .MuiTablePagination-displayedRows': { mb: 0 }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
