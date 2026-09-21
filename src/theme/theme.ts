import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    layout: {
      sidebarWidth: string
      headerHeight: string
      footerHeight: string
    }
  }

  interface ThemeOptions {
    layout?: {
      sidebarWidth?: string
      headerHeight?: string
      footerHeight?: string
    }
  }
}

const theme = createTheme({
  layout: {
    sidebarWidth: '270px',
    headerHeight: '82px',
    footerHeight: '48px'
  },

  palette: {
    primary: {
      main: '#2f80ed'
    },
    background: {
      default: '#f5f7fb'
    }
  },

  shape: {
    borderRadius: 8
  }
})

export default theme