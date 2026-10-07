import api from './api'


export interface Role {
  role_id: number
  role_code: number
  role_name: string
}

export interface User {
  user_id: number
  fullName: string
  email: string
  phone: string | null
  cccd: string | null
  dateOfBirth: string | null
  gender: string | null
  address: string | null
  isActive: boolean
  role: Role
  createdAt: string
  updatedAt: string
}

export interface UserPayload {
  fullName: string
  password?: string
  phone: string
  cccd: string
  dateOfBirth?: string
  gender?: string
  address: string
  role_id: number
}

// Danh sách nhân viên
export const getUsers = async () => {
  const response = await api.get<User[]>('/users')
  return response.data
}

// Chi tiết nhân viên
export const getUserById = async (id: number) => {
  const response = await api.get<User>(`/users/${id}`)
  return response.data
}

// Danh sách vai trò
export const getRoles = async () => {
  const response = await api.get<Role[]>('/users/roles')
  return response.data
}

// Thêm nhân viên
export const createUser = async (data: UserPayload) => {
  const response = await api.post<User>('/users', data)
  return response.data
}

// Cập nhật nhân viên
export const updateUser = async ( id: number, data: UserPayload) => {
  const response = await api.patch<User>(`/users/${id}`, data)
  return response.data
}

// Kích hoạt tài khoản
export const activeUserAPI = async (id: number, isActive: boolean) => {
  const response = await api.patch(`/users/active/${id}`, { isActive })
  return response.data
}