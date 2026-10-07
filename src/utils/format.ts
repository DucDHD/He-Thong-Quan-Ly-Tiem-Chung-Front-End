import dayjs from 'dayjs'

export const formatDate = (date?: string | null) => {
  if (!date) return '-'

  const value = dayjs(date)

  if (!value.isValid()) return '-'

  return value.format('DD/MM/YYYY')
}

export const formatEmail = (email?: string | null) => {
  if (!email) return '-'

  const [name, domain] = email.split('@')

  if (!name || !domain) return email

  return `${name.slice(0, 2)}...@${domain}`
}


export const formatCccd = (cccd?: string | null) => {
  if (!cccd) return ''

  const numbers = cccd.replace(/\D/g, '').slice(0, 12)

  return numbers
    .replace(/(\d{4})(?=\d)/g, '$1-')
}

export const formatPhone = (phone?: string | null) => {
  if (!phone) return ''

  const numbers = phone.replace(/\D/g, '').slice(0, 10)

  if (numbers.length <= 4) {
    return numbers
  }

  if (numbers.length <= 7) {
    return `${numbers.slice(0, 4)}.${numbers.slice(4)}`
  }

  return `${numbers.slice(0, 4)}.${numbers.slice(4, 7)}.${numbers.slice(7)}`
}