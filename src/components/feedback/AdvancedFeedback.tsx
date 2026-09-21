'use client'

import { useMemo, useState } from 'react'

import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material'

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

type FeedbackType = 'complaint' | 'suggestion' | 'encouragement' | 'other'

type FeedbackStatus = 'pending' | 'processing' | 'completed'

type FeedbackItem = {
  id: number
  createdAt: string
  type: FeedbackType
  content: string
  status: FeedbackStatus
}

type Order = 'asc' | 'desc'

const AdvancedFeedback = () => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('suggestion')

  const [content, setContent] = useState('')

  const [contentError, setContentError] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  // =========================
  // SORT + PAGING
  // =========================

  const [order, setOrder] = useState<Order>('desc')

  const [page, setPage] = useState(0)

  const [rowsPerPage, setRowsPerPage] = useState(5)

  // =========================
  // MOCK DATA
  // =========================

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: 1,
      createdAt: '15/09/2026',
      type: 'suggestion',
      content: 'Đề nghị trung tâm bổ sung thêm khung giờ tiêm vào cuối tuần.',
      status: 'processing'
    },
    {
      id: 2,
      createdAt: '10/09/2026',
      type: 'encouragement',
      content: 'Nhân viên tư vấn nhiệt tình và hỗ trợ người bệnh tốt.',
      status: 'completed'
    }
  ])

  // =========================
  // LABEL
  // =========================

  const getTypeLabel = (type: FeedbackType) => {
    switch (type) {
      case 'complaint':
        return 'Phản ánh'

      case 'suggestion':
        return 'Góp ý'

      case 'encouragement':
        return 'Động viên'

      default:
        return 'Khác'
    }
  }

  const getStatusLabel = (status: FeedbackStatus) => {
    switch (status) {
      case 'pending':
        return 'Chờ tiếp nhận'

      case 'processing':
        return 'Đang xử lý'

      case 'completed':
        return 'Đã xử lý'
    }
  }

  // =========================
  // SORT
  // =========================

  const handleSort = () => {
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))

    setPage(0)
  }

  const sortedFeedbacks = useMemo(() => {
    const convertDate = (date: string) => {
      const [day, month, year] = date.split('/')

      return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
    }

    return [...feedbacks].sort((a, b) => {
      const valueA = convertDate(a.createdAt)

      const valueB = convertDate(b.createdAt)

      return order === 'asc' ? valueA - valueB : valueB - valueA
    })
  }, [feedbacks, order])

  const paginatedFeedbacks = sortedFeedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async () => {
    const value = content.trim()

    if (!value) {
      setContentError('Vui lòng nhập nội dung phản hồi')

      return
    }

    if (value.length > 500) {
      setContentError('Nội dung không được vượt quá 500 ký tự')

      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        type: feedbackType,
        content: value
      }

      console.log('Advanced feedback:', payload)

      // =========================
      // TODO API
      // =========================
      //
      // await fetch('/api/feedbacks', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type':
      //       'application/json'
      //   },
      //   body: JSON.stringify(payload)
      // })

      await new Promise((resolve) => setTimeout(resolve, 600))

      // MOCK
      const newFeedback: FeedbackItem = {
        id: Date.now(),
        createdAt: new Date().toLocaleDateString('vi-VN'),
        type: feedbackType,
        content: value,
        status: 'pending'
      }

      setFeedbacks((prev) => [newFeedback, ...prev])

      setContent('')
      setFeedbackType('suggestion')
      setContentError('')
      setPage(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFeedbackType('suggestion')
    setContent('')
    setContentError('')
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
          {/* =====================
              HEADER
          ====================== */}

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
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FeedbackOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700
                }}
              >
                Phản hồi cấp cao
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Gửi góp ý, phản ánh trực tiếp đến Trung tâm
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* =====================
              FORM
          ====================== */}

          <Box sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2
              }}
            >
              Gửi phản hồi
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '300px minmax(0, 1fr)'
                },
                gap: 2,
                alignItems: 'start'
              }}
            >
              <TextField
                select
                label="Loại phản hồi"
                value={feedbackType}
                onChange={(event) =>
                  setFeedbackType(event.target.value as FeedbackType)
                }
                fullWidth
              >
                <MenuItem value="complaint">Phản ánh</MenuItem>

                <MenuItem value="suggestion">Góp ý</MenuItem>

                <MenuItem value="encouragement">Động viên</MenuItem>

                <MenuItem value="other">Khác</MenuItem>
              </TextField>

              <TextField
                label="Nội dung"
                placeholder="Nhập nội dung phản hồi..."
                value={content}
                onChange={(event) => {
                  const value = event.target.value

                  setContent(value)

                  if (value.trim()) {
                    setContentError('')
                  }
                }}
                fullWidth
                multiline
                minRows={5}
                maxRows={8}
                required
                error={Boolean(contentError)}
                helperText={contentError || `${content.length}/500 ký tự`}
                slotProps={{
                  htmlInput: {
                    maxLength: 500
                  }
                }}
              />
            </Box>

            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'flex-end',
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
                Hủy bỏ
              </Button>

              <Button
                variant="contained"
                startIcon={<SendOutlinedIcon />}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* =====================
              HISTORY
          ====================== */}

          <Box
            sx={{
              px: 3,
              pt: 3,
              pb: 1.5
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700
              }}
            >
              Lịch sử phản hồi
            </Typography>
          </Box>

          <Box
            sx={{
              px: 3,
              pb: 3
            }}
          >
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                boxShadow: 'none'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: '#f8fafc'
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700
                      }}
                    >
                      STT
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700
                      }}
                    >
                      <TableSortLabel
                        active
                        direction={order}
                        onClick={handleSort}
                      >
                        Ngày gửi
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700
                      }}
                    >
                      Loại phản hồi
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700
                      }}
                    >
                      Nội dung
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700
                      }}
                    >
                      Trạng thái
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedFeedbacks.length > 0 ? (
                    paginatedFeedbacks.map((item, index) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.createdAt}
                        </TableCell>

                        <TableCell>{getTypeLabel(item.type)}</TableCell>

                        <TableCell>{item.content}</TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={getStatusLabel(item.status)}
                            color={
                              item.status === 'completed'
                                ? 'success'
                                : item.status === 'processing'
                                  ? 'primary'
                                  : 'warning'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{
                          py: 5,
                          color: 'text.secondary'
                        }}
                      >
                        Chưa có phản hồi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={sortedFeedbacks.length}
                page={page}
                onPageChange={(_event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(Number(event.target.value))

                  setPage(0)
                }}
                rowsPerPageOptions={[5, 10, 20]}
                labelRowsPerPage="Số dòng:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} / ${count}`
                }
              />
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default AdvancedFeedback
