class BudgetService {
  constructor() {
    this.tableName = 'budget_c'
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
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error)
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
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(budget) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: `${budget.category_id_c || budget.categoryId} Budget`,
          category_id_c: budget.category_id_c || budget.categoryId,
          amount_c: parseFloat(budget.amount_c || budget.amount),
          month_c: budget.month_c || budget.month,
          year_c: parseInt(budget.year_c || budget.year)
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
          throw new Error(failed[0].message || 'Failed to create budget')
        }
        
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error)
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
          Name: `${data.category_id_c || data.categoryId} Budget`,
          category_id_c: data.category_id_c || data.categoryId,
          amount_c: parseFloat(data.amount_c || data.amount),
          month_c: data.month_c || data.month,
          year_c: parseInt(data.year_c || data.year)
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
          throw new Error(failed[0].message || 'Failed to update budget')
        }
        
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error)
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
          throw new Error(failed[0].message || 'Failed to delete budget')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getByMonth(month, year) {
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
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ],
        where: [
          {"FieldName": "month_c", "Operator": "ExactMatch", "Values": [month]},
          {"FieldName": "year_c", "Operator": "ExactMatch", "Values": [year.toString()]}
        ]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching budgets by month:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getByCategory(categoryId) {
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
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ],
        where: [{
          "FieldName": "category_id_c",
          "Operator": "ExactMatch",
          "Values": [categoryId]
        }]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching budgets by category:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default new BudgetService()