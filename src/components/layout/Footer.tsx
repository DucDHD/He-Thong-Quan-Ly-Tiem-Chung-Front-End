'use client'

import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const Footer = () => {
  const theme = useTheme()

  const SIDEBAR_WIDTH = theme.layout.sidebarWidth
  const FOOTER_HEIGHT = theme.layout.footerHeight

  return (
    <Box
      component="footer"
      sx={{
        ml: SIDEBAR_WIDTH,
        height: FOOTER_HEIGHT,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        bgcolor: '#fff',
        borderTop: '1px solid #e9edf3'
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: 'text.secondary'
        }}
      >
        © 2026 Hệ Thống Quản Lý Tiêm Vaccine
      </Typography>

      <Typography
        sx={{
          fontSize: 12,
          color: 'text.secondary'
        }}
      >
        Trung tâm y tế dự phòng
      </Typography>
    </Box>
  )
}

export default Footer
