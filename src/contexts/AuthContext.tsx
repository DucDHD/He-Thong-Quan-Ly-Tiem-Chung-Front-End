'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

import { UserRole } from '@/utils/user-role'
import { getProfileAPI, ProfileResponse } from '@/services/auth.service'

interface AuthContextType {
  user: ProfileResponse | null
  isLoading: boolean
  isAdmin: boolean
  isDoctor: boolean
  isNurse: boolean
  isStaff: boolean
  isPatient: boolean
  setUser: React.Dispatch<React.SetStateAction<ProfileResponse | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = user?.role?.role_code === UserRole.ADMIN
  const isDoctor = user?.role?.role_code === UserRole.DOCTOR
  const isNurse = user?.role?.role_code === UserRole.NURSE
  const isStaff = user?.role?.role_code === UserRole.isStaff
  const isPatient = user?.role?.role_code === UserRole.PATIENT

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileAPI()

        setUser(data)
      } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProfile()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAdmin,
        isDoctor,
        isNurse,
        isStaff,
        isPatient
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider')
  }

  return context
}
