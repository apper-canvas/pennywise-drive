export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatPercent = (value) => {
  return `${Math.round(value)}%`
}

export const getMonthYear = (date = new Date()) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

export const getCurrentMonthKey = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const calculateProgress = (current, target) => {
  if (!target || target === 0) return 0
  return Math.min((current / target) * 100, 100)
}