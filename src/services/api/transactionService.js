class TransactionService {
  constructor() {
    this.tableName = 'transaction_c'
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error)
      throw error
    }
  }

  async filterTransactions(filters) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      let whereConditions = []
      
      // Search term filter
      if (filters.searchTerm) {
        whereConditions.push({
          "FieldName": "description_c",
          "Operator": "Contains",
          "Values": [filters.searchTerm]
        })
      }
      
      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        whereConditions.push({
          "FieldName": "category_c",
          "Operator": "ExactMatch",
          "Values": filters.categories
        })
      }
      
      // Transaction type filter
      if (filters.type && filters.type !== "all") {
        whereConditions.push({
          "FieldName": "type_c",
          "Operator": "ExactMatch",
          "Values": [filters.type]
        })
      }
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: whereConditions,
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error filtering transactions:", error?.response?.data?.message || error)
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(transaction) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: transaction.description_c || transaction.description || 'Transaction',
          amount_c: parseFloat(transaction.amount_c || transaction.amount),
          type_c: transaction.type_c || transaction.type,
          category_c: transaction.category_c || transaction.category,
          description_c: transaction.description_c || transaction.description,
          date_c: transaction.date_c || transaction.date
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
          throw new Error(failed[0].message || 'Failed to create transaction')
        }
        
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating transaction:", error?.response?.data?.message || error)
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
          Name: data.description_c || data.description || 'Transaction',
          amount_c: parseFloat(data.amount_c || data.amount),
          type_c: data.type_c || data.type,
          category_c: data.category_c || data.category,
          description_c: data.description_c || data.description,
          date_c: data.date_c || data.date
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
          throw new Error(failed[0].message || 'Failed to update transaction')
        }
        
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating transaction:", error?.response?.data?.message || error)
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
          throw new Error(failed[0].message || 'Failed to delete transaction')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getByCategory(category) {
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "ExactMatch",
          "Values": [category]
        }]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching transactions by category:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getByDateRange(startDate, endDate) {
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [{
            "conditions": [
              {"fieldName": "date_c", "operator": "GreaterThanOrEqualTo", "values": [startDate]},
              {"fieldName": "date_c", "operator": "LessThanOrEqualTo", "values": [endDate]}
            ],
            "operator": "AND"
          }]
        }]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching transactions by date range:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default new TransactionService()