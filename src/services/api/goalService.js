import goalsData from "@/services/mockData/goals.json"

class GoalService {
  constructor() {
    this.goals = [...goalsData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.goals].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.goals.find(g => g.Id === parseInt(id))
  }

  async create(goal) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newGoal = {
      ...goal,
      Id: Math.max(...this.goals.map(g => g.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    
    this.goals.push(newGoal)
    return { ...newGoal }
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.goals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) throw new Error("Goal not found")
    
    this.goals[index] = { ...this.goals[index], ...data }
    return { ...this.goals[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.goals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) throw new Error("Goal not found")
    
    this.goals.splice(index, 1)
    return true
  }

  async updateProgress(id, amount) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const goal = this.goals.find(g => g.Id === parseInt(id))
    if (!goal) throw new Error("Goal not found")
    
    goal.currentAmount = Math.max(0, goal.currentAmount + amount)
    return { ...goal }
  }
}

export default new GoalService()