import budgetsData from "@/services/mockData/budgets.json"

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.budgets]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.budgets.find(b => b.Id === parseInt(id))
  }

  async create(budget) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newBudget = {
      ...budget,
      Id: Math.max(...this.budgets.map(b => b.Id)) + 1
    }
    
    this.budgets.push(newBudget)
    return { ...newBudget }
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.budgets.findIndex(b => b.Id === parseInt(id))
    if (index === -1) throw new Error("Budget not found")
    
    this.budgets[index] = { ...this.budgets[index], ...data }
    return { ...this.budgets[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.budgets.findIndex(b => b.Id === parseInt(id))
    if (index === -1) throw new Error("Budget not found")
    
    this.budgets.splice(index, 1)
    return true
  }

  async getByMonth(month, year) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.budgets.filter(b => b.month === month && b.year === year)
  }

  async getByCategory(categoryId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.budgets.filter(b => b.categoryId === categoryId)
  }
}

export default new BudgetService()