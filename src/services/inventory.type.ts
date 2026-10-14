import api from './api'

export interface VaccineImportDetail {
  vaccine_id: number
  lot_code: string
  expiry_date: string
  quantity: number
  unit_price: number
}

export interface CreateInventoryData {
  import_date: string
  note?: string
  details: VaccineImportDetail[]
}

export interface InventoryResponse {
  message: string
  import_id: number
  total_amount: number
  inventories: Inventory[]
  details: VaccineImportDetailResponse[]
  expense: FinancialTransaction
}

export interface Inventory {
  inventory_id: number
  vaccine_id: number
  lot_code: string
  expiry_date: string
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
}

export interface VaccineImportDetailResponse extends VaccineImportDetail {
  import_detail_id: number
  import_id: number
}

export interface FinancialTransaction {
  transaction_id: number
  type: 'INCOME' | 'EXPENSE'
  amount: number
  category: string
  reference_id: number | null
  reference_type: string | null
  user_id: number
  transaction_date: string
  note: string | null
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  inventory_id: number
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
  description: string
  isActive: boolean
  vaccine_created_at: string
  lot_code: string
  expiry_date: string
  quantity: number
  unit_price: number
  inventory_created_at: string
  inventory_updated_at: string
}


export interface InventoryHistoryRow {
  id: number
  code: string
  date: string
  lot_code: string
  quantity: number
  unit_price: number
  note: string | null
}

export interface VaccineExportDetail {
  inventory_id: number
  quantity: number
}


export interface VaccineAvailable {
  inventory_id: number
  vaccine_id: number
  vaccine_name: string
  lot_code: string
  expiry_date: string
  quantity: number
}

export interface CreateVaccineExport {
  export_date: string
  note: string
  details: {
    inventory_id: number
    quantity: number
  }[]
}

export interface VaccinationStockItem {
  stock_id: number
  vaccine_id: number
  vaccine_name: string
  vaccine_type: string
  lot_code: string
  expiry_date: string
  quantity: number
  unit_price: number
}

export const insertInventoryAPI = async ( data: CreateInventoryData): Promise<InventoryResponse> => {
  const response = await api.post<InventoryResponse>('/inventory/imports', data )
  return response.data
}

export const getAllInventoryAPI = async (): Promise<InventoryItem[]> => {
  const response = await api.get<InventoryItem[]>('/inventory')
  return response.data
}


export const getImportHistoryAPI = async ( inventoryId: number ): Promise<InventoryHistoryRow[]> => {
  const response = await api.get<InventoryHistoryRow[]>(`/inventory/import-history/${inventoryId}`)
  return response.data
}

export const exportVaccineAPI = async (data: CreateVaccineExport) => {
  const response = await api.post('/inventory/exports', data)
  return response.data
}

export const getVaccineAvailableAPI = async (): Promise<VaccineAvailable[ ]> => {
  const response = await api.get<VaccineAvailable[]>( '/inventory/available')
  return response.data
}

export const getExportHistoryAPI = async (inventoryId: number) => {
  const response = await api.get( `/inventory/export-history/${inventoryId}` )
  return response.data
}


export const getAllVaccinationStocksAPI = async (): Promise< VaccinationStockItem[]> => {
  const response = await api.get<VaccinationStockItem[]>( '/inventory/stocks')
  return response.data
}