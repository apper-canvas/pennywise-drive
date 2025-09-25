import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import TransactionForm from "@/components/organisms/TransactionForm"
import CategoryIcon from "@/components/molecules/CategoryIcon"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { formatCurrency, formatDate } from "@/utils/formatters"
import transactionService from "@/services/api/transactionService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filter, setFilter] = useState("all")

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError("")
      
      await new Promise(resolve => setTimeout(resolve, 300))
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (err) {
      setError("Failed to load transactions")
      console.error("Error loading transactions:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const handleAddTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionService.create(transactionData)
      setTransactions(prev => [newTransaction, ...prev])
      setShowForm(false)
      toast.success("Transaction added successfully!")
    } catch (err) {
      console.error("Error adding transaction:", err)
      toast.error("Failed to add transaction")
    }
  }

  const handleEditTransaction = async (transactionData) => {
    try {
      const updatedTransaction = await transactionService.update(editingTransaction.Id, transactionData)
      setTransactions(prev => 
        prev.map(t => t.Id === editingTransaction.Id ? updatedTransaction : t)
      )
      setEditingTransaction(null)
      toast.success("Transaction updated successfully!")
    } catch (err) {
      console.error("Error updating transaction:", err)
      toast.error("Failed to update transaction")
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return

    try {
      await transactionService.delete(id)
      setTransactions(prev => prev.filter(t => t.Id !== id))
      toast.success("Transaction deleted successfully!")
    } catch (err) {
      console.error("Error deleting transaction:", err)
      toast.error("Failed to delete transaction")
    }
  }

  if (loading) return <Loading type="list" />
  if (error) return <Error message={error} onRetry={loadTransactions} />

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true
    return transaction.type === filter
  })

  const monthlyStats = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expenses: 0 }
    }
    
    if (transaction.type === "income") {
      acc[monthKey].income += transaction.amount
    } else {
      acc[monthKey].expenses += transaction.amount
    }
    
    return acc
  }, {})

  const currentMonth = new Date()
  const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
  const currentStats = monthlyStats[currentMonthKey] || { income: 0, expenses: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage your income and expenses</p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary" 
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month's Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(currentStats.income)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ApperIcon name="TrendingUp" className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month's Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(currentStats.expenses)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ApperIcon name="TrendingDown" className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Income</p>
                <p className={`text-2xl font-bold ${
                  (currentStats.income - currentStats.expenses) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(currentStats.income - currentStats.expenses)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ApperIcon name="DollarSign" className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Transaction Form */}
      <AnimatePresence>
        {(showForm || editingTransaction) && (
          <TransactionForm
            onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
            onCancel={() => {
              setShowForm(false)
              setEditingTransaction(null)
            }}
            initialData={editingTransaction}
          />
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            {[
              { key: "all", label: "All", icon: "List" },
              { key: "income", label: "Income", icon: "TrendingUp" },
              { key: "expense", label: "Expenses", icon: "TrendingDown" }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter(tab.key)}
                className="flex-1 sm:flex-none"
              >
                <ApperIcon name={tab.icon} className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Empty
          title="No transactions found"
          description="Start tracking your finances by adding your first transaction"
          icon="Receipt"
          action={() => setShowForm(true)}
          actionLabel="Add Transaction"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {filter === "all" ? "All Transactions" : 
               filter === "income" ? "Income Transactions" : "Expense Transactions"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.Id}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary-200 hover:bg-primary-50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === "income" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    <CategoryIcon 
                      category={transaction.category} 
                      className="h-5 w-5" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.category} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === "income" 
                        ? "text-green-600" 
                        : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {transaction.type}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <ApperIcon name="Edit2" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTransaction(transaction.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Transactions