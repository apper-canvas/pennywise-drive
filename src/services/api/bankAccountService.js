class BankAccountService {
  constructor() {
    this.tableName = 'bank_account_c'
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
          {"field": {"Name": "account_name_c"}},
          {"field": {"Name": "balance_c"}},
          {"field": {"Name": "account_number_c"}},
          {"field": {"Name": "institution_name_c"}}
        ],
        orderBy: [{"fieldName": "account_name_c", "sorttype": "ASC"}]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching bank accounts:", error?.response?.data?.message || error)
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
          {"field": {"Name": "account_name_c"}},
          {"field": {"Name": "balance_c"}},
          {"field": {"Name": "account_number_c"}},
          {"field": {"Name": "institution_name_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching bank account ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(account) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: account.account_name_c || 'Bank Account',
          account_name_c: account.account_name_c,
          balance_c: parseFloat(account.balance_c || 0),
          account_number_c: account.account_number_c,
          institution_name_c: account.institution_name_c
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
          throw new Error(failed[0].message || 'Failed to create bank account')
        }
        
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating bank account:", error?.response?.data?.message || error)
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
          Name: data.account_name_c || 'Bank Account',
          account_name_c: data.account_name_c,
          balance_c: parseFloat(data.balance_c || 0),
          account_number_c: data.account_number_c,
          institution_name_c: data.institution_name_c
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
          throw new Error(failed[0].message || 'Failed to update bank account')
        }
        
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating bank account:", error?.response?.data?.message || error)
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
          throw new Error(failed[0].message || 'Failed to delete bank account')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting bank account:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getByInstitution(institution) {
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
          {"field": {"Name": "account_name_c"}},
          {"field": {"Name": "balance_c"}},
          {"field": {"Name": "account_number_c"}},
          {"field": {"Name": "institution_name_c"}}
        ],
        where: [{
          "FieldName": "institution_name_c",
          "Operator": "ExactMatch",
          "Values": [institution]
        }]
      }
      
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching accounts by institution:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default new BankAccountService()