import api from './api'

export interface Vaccine {
  vaccine_id: number
  vaccine_name: string
  vaccine_type: string
  license_number: string
  manufacturer: string
  country: string
  dosage: string
  storage_condition: string
  vaccination_age: string
  unit: string
  price: number
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}


export interface CreateVaccineData {
  vaccine_name: string
  vaccine_type: string
  license_number?: string
  manufacturer: string
  country?: string
  dosage?: string
  storage_condition?: string
  vaccination_age?: string
  unit: string
  price: number
  description?: string
}

export const getVaccinesAPI = async (): Promise<Vaccine[]> => {
  const response = await api.get<Vaccine[]>('/vaccines')

  return response.data
}

export const activeVaccineAPI = async (id: number, isActive: boolean): Promise<Vaccine> => {
  const response = await api.patch<Vaccine>(`/vaccines/active/${id}`, { isActive })
  return response.data
}

export const createVaccineAPI = async ( data: CreateVaccineData ): Promise<Vaccine> => {
  const { data: vaccine } = await api.post<Vaccine>('/vaccines', data)
  return vaccine
}

export const updateVaccineAPI = async ( id: number, data: CreateVaccineData): Promise<Vaccine> => {
  const response = await api.put<Vaccine>(`/vaccines/${id}`, data)
  return response.data
}

export const getVaccineByIdAPI = async ( id: number): Promise<Vaccine> => {
  const response = await api.get<Vaccine>(`/vaccines/${id}`)
  return response.data
}