import transactionsData from "@/services/mockData/transactions.json"

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
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