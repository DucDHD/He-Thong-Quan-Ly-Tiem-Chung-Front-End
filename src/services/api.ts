import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig

    if (!originalRequest) {
      return Promise.reject(error)
    }

    // Không xử lý refresh cho chính API login/refresh
    const isAuthRequest =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh_token') ||
      originalRequest.url?.includes('/auth/logout')

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      console.log('ACCESS TOKEN HẾT HẠN → REFRESH')
      originalRequest._retry = true

      try {
        // Browser tự gửi refreshToken HttpOnly Cookie
        const response = await api.post('/auth/refresh_token')
        console.log('REFRESH THÀNH CÔNG:', response.data)

        // Backend đã set accessToken mới
        // Gọi lại request ban đầu
        return api(originalRequest)
      } catch {
        try {
          await api.post('/auth/logout')
        } finally {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api