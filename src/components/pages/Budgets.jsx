import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import BudgetForm from "@/components/organisms/BudgetForm"
import ProgressBar from "@/components/molecules/ProgressBar"
import CategoryIcon from "@/components/molecules/CategoryIcon"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { formatCurrency, getCurrentMonthKey, calculateProgress } from "@/utils/formatters"
import budgetService from "@/services/api/budgetService"
import transactionService from "@/services/api/transactionService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"

const Budgets = () => {
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const [budgetsData, transactionsData] = await Promise.all([
        budgetService.getAll(),
        transactionService.getAll()
      ])
      
      setBudgets(budgetsData)
      setTransactions(transactionsData)
    } catch (err) {
      setError("Failed to load budget data")
      console.error("Error loading budgets:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddBudget = async (budgetData) => {
    try {
      const newBudget = await budgetService.create(budgetData)
      setBudgets(prev => [...prev, newBudget])
      setShowForm(false)
      toast.success("Budget created successfully!")
    } catch (err) {
      console.error("Error adding budget:", err)
      toast.error("Failed to create budget")
    }
  }

  const handleEditBudget = async (budgetData) => {
    try {
      const updatedBudget = await budgetService.update(editingBudget.Id, budgetData)
      setBudgets(prev => 
        prev.map(b => b.Id === editingBudget.Id ? updatedBudget : b)
      )
      setEditingBudget(null)
      toast.success("Budget updated successfully!")
    } catch (err) {
      console.error("Error updating budget:", err)
      toast.error("Failed to update budget")
    }
  }

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return

    try {
      await budgetService.delete(id)
      setBudgets(prev => prev.filter(b => b.Id !== id))
      toast.success("Budget deleted successfully!")
    } catch (err) {
      console.error("Error deleting budget:", err)
      toast.error("Failed to delete budget")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  // Get current month budgets
  const currentMonth = new Date()
  const currentMonthKey = String(currentMonth.getMonth() + 1).padStart(2, '0')
  const currentYear = currentMonth.getFullYear()
  
  const currentBudgets = budgets.filter(b => 
    b.month === currentMonthKey && b.year === currentYear
  )

  // Calculate spending for each category
  const categorySpending = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === "expense" && 
             transactionDate.getMonth() === currentMonth.getMonth() && 
             transactionDate.getFullYear() === currentYear
    })
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {})

  // Calculate totals
  const totalBudget = currentBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0)
  const remaining = totalBudget - totalSpent

  // Budget status
  const budgetsWithSpending = currentBudgets.map(budget => ({
    ...budget,
    spent: categorySpending[budget.categoryId] || 0,
    remaining: budget.amount - (categorySpending[budget.categoryId] || 0),
    progress: calculateProgress(categorySpending[budget.categoryId] || 0, budget.amount)
  }))

  const overBudgetCount = budgetsWithSpending.filter(b => b.spent > b.amount).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Manage your monthly spending limits</p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Set Budget
        </Button>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(totalBudget)}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <ApperIcon name="Target" className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ApperIcon name="CreditCard" className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className={`text-2xl font-bold ${
                  remaining >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(Math.abs(remaining))}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                remaining >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <ApperIcon 
                  name={remaining >= 0 ? "TrendingUp" : "TrendingDown"} 
                  className={`h-6 w-6 ${
                    remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Over Budget</p>
                <p className="text-2xl font-bold text-orange-600">
                  {overBudgetCount}
                </p>
                <p className="text-xs text-gray-500">
                  {overBudgetCount === 1 ? 'category' : 'categories'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ApperIcon name="AlertTriangle" className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Budget Form */}
      <AnimatePresence>
        {(showForm || editingBudget) && (
          <BudgetForm
            onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
            onCancel={() => {
              setShowForm(false)
              setEditingBudget(null)
            }}
            initialData={editingBudget}
          />
        )}
      </AnimatePresence>

      {/* Budget Progress */}
      {budgetsWithSpending.length === 0 ? (
        <Empty
          title="No budgets set"
          description="Create your first budget to start tracking your spending limits"
          icon="Target"
          action={() => setShowForm(true)}
          actionLabel="Set Budget"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <p className="text-sm text-gray-600">
              Track your spending against monthly budgets
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {budgetsWithSpending.map((budget, index) => (
              <motion.div
                key={budget.Id}
                className="p-6 rounded-lg border hover:border-primary-200 hover:bg-primary-50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CategoryIcon 
                        category={budget.categoryId} 
                        className="h-5 w-5 text-gray-600" 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {budget.categoryId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Monthly budget: {formatCurrency(budget.amount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingBudget(budget)}
                    >
                      <ApperIcon name="Edit2" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBudget(budget.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ProgressBar
                  current={budget.spent}
                  target={budget.amount}
                  label={`Spent: ${formatCurrency(budget.spent)} of ${formatCurrency(budget.amount)}`}
                />

                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className={`font-medium ${
                    budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {budget.remaining >= 0 ? 'Under budget by' : 'Over budget by'} {formatCurrency(Math.abs(budget.remaining))}
                  </span>
                  <span className="text-gray-500">
                    {Math.round(budget.progress)}% used
                  </span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Budgets