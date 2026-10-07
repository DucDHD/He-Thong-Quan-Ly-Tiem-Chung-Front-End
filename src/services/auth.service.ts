import api from './api'

export interface RegisterData {
  fullName: string
  email: string
  password: string
}

export interface VerifyOtpData {
  email: string
  codeId: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
}

export interface Role {
  role_id: number
  role_code: number
  role_name: string
}

export interface ProfileResponse {
  user_id: number
  fullName: string
  email: string | null
  address: string | null
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
  cccd: string | null
  role: Role

  isActive: boolean
  createdAt: string
  updatedAt: string

}

export interface UpdateProfilePayload {
  fullName: string
  dateOfBirth: string
  gender: string
  phone: string
  address: string
  cccd: string
}


export interface LogoutResponse {
  message: string
}

export const registerAPI = async ( data: RegisterData) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const verifyAPI = async ( data: VerifyOtpData) => {
  const response = await api.post('/auth/verify', data)
  return response.data
}

export const resendAPI = async ( email: string) => {
  const response = await api.post('/auth/resend', { email })
  return response.data
}

export const loginAPI = async ( data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>( '/auth/login', data )
  return response.data
}

export const getProfileAPI = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>('/auth/profile')
  return response.data
}

export const logoutAPI = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/auth/logout')
  return response.data
}

export const updateProfileAPI = async ( data: UpdateProfilePayload): Promise<ProfileResponse> => {
  const response = await api.put<ProfileResponse>( '/auth/profile', data )

  return response.data
}

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh_token')
  return response.data
}