import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import BankAccountForm from "@/components/organisms/BankAccountForm"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { formatCurrency } from "@/utils/formatters"
import bankAccountService from "@/services/api/bankAccountService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)

  const loadAccounts = async () => {
    try {
      setLoading(true)
      setError("")
      
      await new Promise(resolve => setTimeout(resolve, 300))
      const data = await bankAccountService.getAll()
      setAccounts(data)
    } catch (err) {
      setError("Failed to load bank accounts")
      console.error("Error loading bank accounts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const handleAddAccount = async (accountData) => {
    try {
      const newAccount = await bankAccountService.create(accountData)
      setAccounts(prev => [...prev, newAccount].sort((a, b) => a.account_name_c?.localeCompare(b.account_name_c)))
      setShowForm(false)
      toast.success("Bank account added successfully!")
    } catch (err) {
      console.error("Error adding account:", err)
      toast.error("Failed to add bank account")
    }
  }

  const handleEditAccount = async (accountData) => {
    try {
      const updatedAccount = await bankAccountService.update(editingAccount.Id, accountData)
      setAccounts(prev => 
        prev.map(a => a.Id === editingAccount.Id ? updatedAccount : a)
          .sort((a, b) => a.account_name_c?.localeCompare(b.account_name_c))
      )
      setEditingAccount(null)
      toast.success("Bank account updated successfully!")
    } catch (err) {
      console.error("Error updating account:", err)
      toast.error("Failed to update bank account")
    }
  }

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) return

    try {
      await bankAccountService.delete(id)
      setAccounts(prev => prev.filter(a => a.Id !== id))
      toast.success("Bank account deleted successfully!")
    } catch (err) {
      console.error("Error deleting account:", err)
      toast.error("Failed to delete bank account")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadAccounts} />

  // Calculate summary statistics
  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance_c || 0), 0)
  const totalAccounts = accounts.length
  const institutionCount = new Set(accounts.map(a => a.institution_name_c).filter(Boolean)).size
  const highestBalance = accounts.length > 0 ? Math.max(...accounts.map(a => a.balance_c || 0)) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1>
          <p className="text-gray-600">Manage your bank accounts and track balances</p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <ApperIcon name="Wallet" className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Accounts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalAccounts}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ApperIcon name="CreditCard" className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Institutions</p>
                <p className="text-2xl font-bold text-green-600">
                  {institutionCount}
                </p>
                <p className="text-xs text-gray-500">
                  Different banks
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ApperIcon name="Building2" className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Highest Balance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(highestBalance)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ApperIcon name="TrendingUp" className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Account Form */}
      <AnimatePresence>
        {(showForm || editingAccount) && (
          <BankAccountForm
            onSubmit={editingAccount ? handleEditAccount : handleAddAccount}
            onCancel={() => {
              setShowForm(false)
              setEditingAccount(null)
            }}
            initialData={editingAccount}
          />
        )}
      </AnimatePresence>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <Empty
          title="No bank accounts yet"
          description="Add your first bank account to start tracking your finances"
          icon="Wallet"
          action={() => setShowForm(true)}
          actionLabel="Add Account"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account, index) => (
            <motion.div
              key={account.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <ApperIcon name="CreditCard" className="h-5 w-5 mr-2 text-primary-600" />
                      {account.account_name_c || 'Unnamed Account'}
                    </CardTitle>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAccount(account)}
                      >
                        <ApperIcon name="Edit2" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Balance */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Current Balance</p>
                      <p className={`text-3xl font-bold ${
                        (account.balance_c || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(account.balance_c || 0)}
                      </p>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Institution</span>
                        <span className="font-medium text-gray-900">
                          {account.institution_name_c || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Account Number</span>
                        <span className="font-medium text-gray-900">
                          {account.account_number_c ? 
                            `****${account.account_number_c.slice(-4)}` : 
                            'Not specified'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center pt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        (account.balance_c || 0) >= 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <ApperIcon 
                          name={(account.balance_c || 0) >= 0 ? "CheckCircle" : "AlertCircle"} 
                          className="h-3 w-3 mr-1" 
                        />
                        {(account.balance_c || 0) >= 0 ? 'Positive Balance' : 'Negative Balance'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BankAccounts