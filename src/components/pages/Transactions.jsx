import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import transactionService from "@/services/api/transactionService";
import { formatCurrency, formatDate } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import TransactionForm from "@/components/organisms/TransactionForm";
import Button from "@/components/atoms/Button";
const Transactions = () => {
const context = useOutletContext()
  const { filterSidebarOpen, setFilterSidebarOpen } = context || {}
  
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filter, setFilter] = useState("all")
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    categories: [],
    amountRange: { min: "", max: "" },
    searchTerm: ""
  })
  const [categories, setCategories] = useState([])
const loadTransactions = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await transactionService.getAll()
      setTransactions(data)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(t => t.category))].sort()
      setCategories(uniqueCategories)
      
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

const applyAdvancedFilters = (transactions, filters, basicFilter) => {
    return transactions.filter(transaction => {
      // Basic type filter
if (basicFilter !== "all" && (transaction.type_c || transaction.type) !== basicFilter) {
        return false
      }
      
      // Search term filter
      if (filters.searchTerm && !(transaction.description_c || transaction.description).toLowerCase()
          .includes(filters.searchTerm.toLowerCase())) {
        return false
      }
      
      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const transactionDate = new Date(transaction.date_c || transaction.date)
        if (filters.dateRange.start && transactionDate < new Date(filters.dateRange.start)) {
          return false
        }
        if (filters.dateRange.end && transactionDate > new Date(filters.dateRange.end)) {
          return false
        }
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(transaction.category_c || transaction.category)) {
        return false
      }
      
      // Amount range filter
      const amount = Math.abs(transaction.amount_c || transaction.amount)
      if (filters.amountRange.min && amount < parseFloat(filters.amountRange.min)) {
        return false
      }
      if (filters.amountRange.max && amount > parseFloat(filters.amountRange.max)) {
        return false
      }
      
      return true
    })
  }

  const filteredTransactions = applyAdvancedFilters(transactions, filters, filter)
  
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.searchTerm) count++
    if (filters.dateRange.start || filters.dateRange.end) count++
    if (filters.categories.length > 0) count++
    if (filters.amountRange.min || filters.amountRange.max) count++
    return count
  }

const monthlyStats = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date_c || transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expenses: 0 }
    }
    
    if ((transaction.type_c || transaction.type) === "income") {
      acc[monthKey].income += (transaction.amount_c || transaction.amount)
    } else {
      acc[monthKey].expenses += (transaction.amount_c || transaction.amount)
    }
    
    return acc
  }, {})

  const currentMonth = new Date()
  const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
  const currentStats = monthlyStats[currentMonthKey] || { income: 0, expenses: 0 }

  return (
<div className="space-y-6">
      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={filterSidebarOpen && window.innerWidth < 1024}
        onClose={() => setFilterSidebarOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        className="lg:hidden"
      />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<h1 className="text-2xl font-bold text-gray-900">
            Transactions
            {getActiveFiltersCount() > 0 && (
              <span className="ml-3 text-sm font-normal text-gray-600">
                ({filteredTransactions.length} of {transactions.length})
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            {getActiveFiltersCount() > 0 ? 
              `Showing filtered results • ${getActiveFiltersCount()} filter${getActiveFiltersCount() !== 1 ? 's' : ''} active` :
              'Manage your income and expenses'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Mobile Filter Toggle */}
          <Button 
            variant={filterSidebarOpen ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterSidebarOpen(prev => !prev)}
            className="lg:hidden"
          >
            <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
            Filter
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-600 text-white rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>
          
          <Button 
            onClick={() => setShowForm(true)} 
            variant="primary" 
            className="w-full sm:w-auto"
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
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
(transaction.type_c || transaction.type) === "income" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    <CategoryIcon 
                      category={transaction.category_c || transaction.category} 
                      className="h-5 w-5" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {transaction.description_c || transaction.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.category_c || transaction.category} • {formatDate(transaction.date_c || transaction.date)}
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