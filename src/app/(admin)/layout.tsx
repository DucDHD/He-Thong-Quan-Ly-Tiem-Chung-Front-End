'use client'

import { Box } from '@mui/material'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AuthProvider } from '@/contexts/AuthContext'

const AdminLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f5f7fb'
        }}
      >
        <AuthProvider>
          <Sidebar />
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </Box>
    </LocalizationProvider>
  )
}

export default AdminLayout
