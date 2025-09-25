import transactionsData from "@/services/mockData/transactions.json"

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData]
  }

async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async filterTransactions(filters) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const allTransactions = await this.getAll()
    
    return allTransactions.filter(transaction => {
      // Search term filter
      if (filters.searchTerm && !transaction.description.toLowerCase()
          .includes(filters.searchTerm.toLowerCase())) {
        return false
      }
      
      // Date range filter
      if (filters.dateRange) {
        const transactionDate = new Date(transaction.date)
        if (filters.dateRange.start && transactionDate < new Date(filters.dateRange.start)) {
          return false
        }
        if (filters.dateRange.end && transactionDate > new Date(filters.dateRange.end)) {
          return false
        }
      }
      
      // Category filter
      if (filters.categories && filters.categories.length > 0 && 
          !filters.categories.includes(transaction.category)) {
        return false
      }
      
      // Amount range filter
      if (filters.amountRange) {
        const amount = Math.abs(transaction.amount)
        if (filters.amountRange.min && amount < parseFloat(filters.amountRange.min)) {
          return false
        }
        if (filters.amountRange.max && amount > parseFloat(filters.amountRange.max)) {
          return false
        }
      }
      
      // Transaction type filter
      if (filters.type && filters.type !== "all" && transaction.type !== filters.type) {
        return false
      }
      
      return true
    })
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.transactions.find(t => t.Id === parseInt(id))
  }

  async create(transaction) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newTransaction = {
      ...transaction,
      Id: Math.max(...this.transactions.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    
    this.transactions.push(newTransaction)
    return { ...newTransaction }
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.transactions.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error("Transaction not found")
    
    this.transactions[index] = { ...this.transactions[index], ...data }
    return { ...this.transactions[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.transactions.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error("Transaction not found")
    
    this.transactions.splice(index, 1)
    return true
  }

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.transactions.filter(t => t.category === category)
  }

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return this.transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= start && transactionDate <= end
    })
  }
}

export default new TransactionService()