'use client'

import { Box } from '@mui/material'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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
        <Sidebar />
        <Header />
        {children}
        <Footer />
      </Box>
    </LocalizationProvider>
  )
}

export default AdminLayout
