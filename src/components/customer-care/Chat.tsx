'use client'

import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'

import { useState } from 'react'

type Sender = 'bot' | 'user'

type Message = {
  id: number
  sender: Sender
  content: string
  time: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'bot',
    content:
      'Xin chào! Tôi là trợ lý tư vấn tiêm chủng. Bạn có thể hỏi tôi các thông tin về vaccine, lịch tiêm và những lưu ý trước hoặc sau khi tiêm.',
    time: '14:30'
  }
]

const quickQuestions = [
  'Trẻ 6 tháng cần tiêm vaccine gì?',
  'Tiêm vaccine có bị sốt không?',
  'Cần chuẩn bị gì trước khi tiêm?',
  'Sau khi tiêm cần theo dõi bao lâu?'
]

const VaccinationChat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isSending, setIsSending] = useState(false)

  // ====================================================
  // MOCK BOT RESPONSE
  // Sau này thay bằng API chatbot
  // ====================================================

  const getBotResponse = (question: string) => {
    const value = question.toLowerCase()

    if (value.includes('6 tháng')) {
      return 'Lịch tiêm của trẻ phụ thuộc vào các vaccine trẻ đã được tiêm trước đó. Bạn nên kiểm tra hồ sơ tiêm chủng của trẻ để xác định các mũi đến hạn. Nếu cần, nhân viên y tế có thể hỗ trợ kiểm tra lịch tiêm cụ thể.'
    }

    if (value.includes('sốt')) {
      return 'Sau tiêm, một số người có thể gặp phản ứng như đau tại vị trí tiêm, mệt hoặc sốt nhẹ. Cần tiếp tục theo dõi sức khỏe sau tiêm và liên hệ cơ sở y tế nếu xuất hiện dấu hiệu bất thường hoặc triệu chứng nghiêm trọng.'
    }

    if (value.includes('chuẩn bị') || value.includes('trước khi tiêm')) {
      return 'Trước khi tiêm, bạn nên cung cấp đầy đủ thông tin về tình trạng sức khỏe, tiền sử dị ứng, các vaccine đã tiêm và thuốc đang sử dụng cho nhân viên y tế.'
    }

    if (value.includes('theo dõi') || value.includes('sau khi tiêm')) {
      return 'Sau khi tiêm, hãy thực hiện theo hướng dẫn theo dõi của cơ sở tiêm chủng và tiếp tục theo dõi sức khỏe tại nhà. Nếu có dấu hiệu bất thường, cần liên hệ nhân viên y tế để được hướng dẫn.'
    }

    return 'Tôi đã nhận được câu hỏi của bạn. Hiện tại đây là chatbot mô phỏng. Khi kết nối backend hoặc AI, câu hỏi này sẽ được xử lý tự động. Bạn cũng có thể chuyển câu hỏi cho nhân viên tư vấn.'
  }

  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const handleSend = async (content?: string) => {
    const text = (content ?? message).trim()

    if (!text || isSending) return

    const now = new Date()

    const time = now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      content: text,
      time
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage('')
    setIsSending(true)

    // MOCK BOT DELAY
    await new Promise((resolve) => setTimeout(resolve, 700))

    const botMessage: Message = {
      id: Date.now() + 1,
      sender: 'bot',
      content: getBotResponse(text),
      time: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setMessages((prev) => [...prev, botMessage])
    setIsSending(false)
  }

  // ====================================================
  // ENTER TO SEND
  // SHIFT + ENTER TO NEW LINE
  // ====================================================

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      handleSend()
    }
  }

  // ====================================================
  // TRANSFER TO STAFF
  // ====================================================

  const handleTransferToStaff = () => {
    console.log('TRANSFER TO STAFF')

    // TODO:
    // await chatService.transferToStaff(conversationId)
  }

  return (
    <Box
      component="main"
      sx={(theme) => ({
        ml: theme.layout.sidebarWidth,
        pt: theme.layout.headerHeight,
        height: `calc(100vh - ${theme.layout.footerHeight})`,
        bgcolor: '#f5f7fb',
        boxSizing: 'border-box',
        overflow: 'hidden'
      })}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          p: 3,
          boxSizing: 'border-box'
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: '#fff',
            borderRadius: 2.5,
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

          <Box
            sx={{
              px: 2.5,
              py: 2,
              display: 'flex',
              alignItems: {
                xs: 'flex-start',
                sm: 'center'
              },
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              gap: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              flexShrink: 0
            }}
          >
            <Box
              sx={{
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
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SmartToyOutlinedIcon />
              </Box>

              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.3
                    }}
                  >
                    Chat tư vấn tiêm chủng
                  </Typography>

                  <Chip
                    label="Trực tuyến"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.25
                  }}
                >
                  Giải đáp các câu hỏi và thắc mắc về tiêm chủng
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<SupportAgentOutlinedIcon />}
              onClick={handleTransferToStaff}
              sx={{
                height: 40,
                whiteSpace: 'nowrap',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Nhân viên tư vấn
            </Button>
          </Box>

          {/* ============================================= */}
          {/* CHAT BODY */}
          {/* ============================================= */}

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              bgcolor: '#fafbfc',
              px: {
                xs: 2,
                md: 4
              },
              py: 3
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 1000,
                mx: 'auto'
              }}
            >
              {messages.map((item) => {
                const isUser = item.sender === 'user'

                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isUser ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        gap: 1,
                        maxWidth: {
                          xs: '95%',
                          md: '75%'
                        }
                      }}
                    >
                      {/* AVATAR */}

                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: isUser ? 'secondary.main' : 'primary.main'
                        }}
                      >
                        {isUser ? (
                          <PersonOutlineOutlinedIcon fontSize="small" />
                        ) : (
                          <SmartToyOutlinedIcon fontSize="small" />
                        )}
                      </Avatar>

                      {/* MESSAGE */}

                      <Box>
                        <Paper
                          variant="outlined"
                          sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            bgcolor: isUser ? 'primary.main' : '#fff',
                            color: isUser
                              ? 'primary.contrastText'
                              : 'text.primary',
                            borderColor: isUser ? 'primary.main' : 'divider',
                            boxShadow: 'none'
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6
                            }}
                          >
                            {item.content}
                          </Typography>
                        </Paper>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            textAlign: isUser ? 'right' : 'left'
                          }}
                        >
                          {item.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )
              })}

              {/* BOT TYPING */}

              {isSending && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'primary.main'
                    }}
                  >
                    <SmartToyOutlinedIcon fontSize="small" />
                  </Avatar>

                  <Paper
                    variant="outlined"
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderRadius: 2,
                      boxShadow: 'none'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Đang trả lời...
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          </Box>

          {/* ============================================= */}
          {/* QUICK QUESTIONS */}
          {/* ============================================= */}

          {messages.length <= 1 && (
            <Box
              sx={{
                px: {
                  xs: 2,
                  md: 4
                },
                pt: 1.5,
                pb: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff',
                flexShrink: 0
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 1000,
                  mx: 'auto'
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mb: 1
                  }}
                >
                  Câu hỏi gợi ý
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap'
                  }}
                >
                  {quickQuestions.map((question) => (
                    <Chip
                      key={question}
                      label={question}
                      variant="outlined"
                      clickable
                      onClick={() => handleSend(question)}
                      sx={{
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* ============================================= */}
          {/* INPUT */}
          {/* ============================================= */}

          <Box
            sx={{
              px: {
                xs: 2,
                md: 4
              },
              py: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: '#fff',
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 1000,
                mx: 'auto',
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1.5
              }}
            >
              <TextField
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi về tiêm chủng..."
                fullWidth
                multiline
                maxRows={4}
                disabled={isSending}
                slotProps={{
                  htmlInput: {
                    maxLength: 1000
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <IconButton
                color="primary"
                onClick={() => handleSend()}
                disabled={!message.trim() || isSending}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  flexShrink: 0,

                  '&:hover': {
                    bgcolor: 'primary.dark'
                  },

                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground'
                  }
                }}
              >
                <SendRoundedIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                width: '100%',
                maxWidth: 1000,
                mx: 'auto',
                mt: 0.75
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Enter để gửi • Shift + Enter để xuống dòng
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default VaccinationChat
