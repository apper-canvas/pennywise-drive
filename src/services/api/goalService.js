class GoalService {
  constructor() {
    this.tableName = 'goal_c'
  }

  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "deadline_c", "sorttype": "ASC"}]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching goals:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching goal ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(goal) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: goal.name_c || goal.name,
          name_c: goal.name_c || goal.name,
          target_amount_c: parseFloat(goal.target_amount_c || goal.targetAmount),
          current_amount_c: parseFloat(goal.current_amount_c || goal.currentAmount || 0),
          deadline_c: goal.deadline_c || goal.deadline,
          created_at_c: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed)
          throw new Error(failed[0].message || 'Failed to create goal')
        }
        
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating goal:", error?.response?.data?.message || error)
      throw error
    }
  }

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.name_c || data.name,
          name_c: data.name_c || data.name,
          target_amount_c: parseFloat(data.target_amount_c || data.targetAmount),
          current_amount_c: parseFloat(data.current_amount_c || data.currentAmount),
          deadline_c: data.deadline_c || data.deadline
        }]
      }
      
      const response = await apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed)
          throw new Error(failed[0].message || 'Failed to update goal')
        }
        
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating goal:", error?.response?.data?.message || error)
      throw error
    }
  }

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = { 
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed)
          throw new Error(failed[0].message || 'Failed to delete goal')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting goal:", error?.response?.data?.message || error)
      throw error
    }
  }

  async updateProgress(id, amount) {
    try {
      // First get the current goal data
      const goal = await this.getById(id)
      if (!goal) throw new Error("Goal not found")
      
      const newAmount = Math.max(0, (goal.current_amount_c || 0) + amount)
      
      // Update with new current amount
      return await this.update(id, {
        name_c: goal.name_c,
        target_amount_c: goal.target_amount_c,
        current_amount_c: newAmount,
        deadline_c: goal.deadline_c
      })
    } catch (error) {
      console.error("Error updating goal progress:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default new GoalService()