import api from './api'


export interface CustomerTransaction {
  invoice_id: number
  vaccination_date: string
  invoice_code: string
  vaccine_name: string
  quantity: number
  fullName: string
  unit_price: number
  status: 'PENDING' | 'PAID'
}


export const getCustomerTransactionsAPI = async () => {
  const response = await api.get<CustomerTransaction[]>('/finance/customer')
  return response.data
}


export const confirmPaymentAPI = async ( invoiceId: number) => {
  const response = await api.patch( `/finance/payment/${invoiceId}`)
  return response.data
}