import api from './api'

export interface CreateVaccinationBooking {
  schedule_id: number
  user_id: number
  note?: string
}

export interface VaccinationBooking {
  booking_id: number
  schedule_id: number
  user_id: number
  status: 'REGISTERED' | 'COMPLETED' | 'CANCELLED'
  note: string | null
  created_at: string
  updated_at: string
}

export interface VaccinationBookingDetail {
  booking_id: number
  schedule_id: number
  user_id: number
  note: string | null
  status: 'REGISTERED' | 'COMPLETED' | 'CANCELLED'
  created_at: string

  vaccination_date: string
  capacity: number
  age: string
  vaccine_name: string
  price: number

  location_id: number | null
  location_name: string | null
  location_address: string | null

  fullName: string
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
  cccd: string | null
  address: string | null
}

export type VaccinationHistory = {
  booking_id: number
  vaccination_date: string
  vaccine_name: string
  location_name: string
  location_address: string
  dose_number: number | null
  vaccinator_name: string | null
  status: 'REGISTERED' | 'COMPLETED'
}

export const createVaccinationBookingAPI = async ( data: CreateVaccinationBooking ): Promise<VaccinationBooking> => {
  const response = await api.post('/vaccination-bookings', data)
  return response.data
}


export const getVaccinationBookingDetailAPI = async (id: number): Promise<VaccinationBookingDetail[]> => {
  const response = await api.get(`/vaccination-bookings/detail/${id}`)
  return response.data
}

export const cancelVaccinationBookingAPI = async (id: number): Promise<{ message: string }> => {
  const response = await api.patch(`/vaccination-bookings/cancel/${id}`)
  return response.data
}


export const completeBooking = async (bookingId: number) => {
  const response = await api.patch( `/vaccination-bookings/complete/${bookingId}`)
  return response.data
}

export const getVaccinationHistoryAPI = async (user_id: number): Promise<VaccinationHistory[]> => {
  const response = await api.get<VaccinationHistory[]>( `/vaccination-bookings/history/${user_id}`)
  return response.data
}