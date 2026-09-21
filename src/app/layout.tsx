'use client'

import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import './globals.css'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <title>Hệ thống quản lý tiêm chủng</title>
        <meta name="description" content="Hệ thống quản lý tiêm chủng" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
