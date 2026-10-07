import api from './api'

export interface Vaccine {
  vaccine_id: number
  vaccine_name: string
}

export interface VaccinationStaff {
  user_id: number
  fullName: string
}

export interface VaccinationLocation {
  location_id: number
  locationName: string
  address: string
}


export interface CreateVaccinationSchedule {
  vaccination_date: string
  vaccine_id: number
  capacity: number
  age: string
  user_id: number
  note?: string
}

export interface VaccinationSchedule {
  schedule_id: number
  vaccination_date: string
  vaccine_id: number
  vaccine_name: string
  price: number
  capacity: number
  age: string
  user_id: number
  fullName: string

  registered_count: number
  booking_status: 'REGISTERED' | 'COMPLETED' | 'CANCELLED' | null

  location_id: number | null
  location_name: string | null
  address: string | null

  note: string | null
  status: 'UPCOMING' | 'FULL' | 'COMPLETED' | 'CANCELLED'
  created_at: string
  updated_at: string
}

export interface UpdateVaccinationSchedule {
  vaccination_date?: string
  vaccine_id?: number
  capacity?: number
  age?: string
  user_id?: number
  location_id?: number
  note?: string
}


export const getAllVaccineAPI = async (): Promise<Vaccine[]> => {
  const response = await api.get('vaccination-schedules/vaccines')
  return response.data
}

export const getVaccinationStaffAPI = async (): Promise<VaccinationStaff[]> => {
  const response = await api.get('vaccination-schedules/vaccination-staff')
  return response.data
}


export const getVaccinationLocationAPI = async () => {
  const response = await api.get<VaccinationLocation[]>('vaccination-schedules/locations' )

  return response.data
}

export const createVaccinationScheduleAPI = async (data: CreateVaccinationSchedule) => {
  const response = await api.post('/vaccination-schedules', data)
  return response.data
}

export const getVaccinationSchedulesAPI = async (): Promise<VaccinationSchedule[]> => {
  const response = await api.get('/vaccination-schedules')
  return response.data
}

export const getVaccinationScheduleByIdAPI = async (id: number): Promise<VaccinationSchedule> => {
  const response = await api.get(`/vaccination-schedules/${id}`)
  return response.data
}

export const updateVaccinationScheduleAPI = async (id: number, data: UpdateVaccinationSchedule) => {
  const response = await api.patch(`/vaccination-schedules/${id}`, data)
  return response.data
}

export const deleteVaccinationScheduleAPI = async (id: number) => {
  const response = await api.patch(`/vaccination-schedules/cancel/${id}`)
  return response.data
}