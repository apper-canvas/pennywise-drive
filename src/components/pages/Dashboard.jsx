import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import StatCard from "@/components/molecules/StatCard"
import SpendingChart from "@/components/organisms/SpendingChart"
import SpendingTrends from "@/components/organisms/SpendingTrends"
import CategoryIcon from "@/components/molecules/CategoryIcon"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { formatCurrency, formatDate, getCurrentMonthKey } from "@/utils/formatters"
import transactionService from "@/services/api/transactionService"
import budgetService from "@/services/api/budgetService"
import goalService from "@/services/api/goalService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const [transactionsData, budgetsData, goalsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        goalService.getAll()
      ])
      
      setTransactions(transactionsData)
      setBudgets(budgetsData)
      setGoals(goalsData)
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error("Error loading dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  // Calculate current month stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date_c || t.date)
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear
  })

  const monthlyIncome = currentMonthTransactions
    .filter(t => (t.type_c || t.type) === "income")
    .reduce((sum, t) => sum + (t.amount_c || t.amount), 0)

  const monthlyExpenses = currentMonthTransactions
    .filter(t => (t.type_c || t.type) === "expense")
    .reduce((sum, t) => sum + (t.amount_c || t.amount), 0)

  const totalBudget = budgets
    .filter(b => (b.month_c || b.month) === String(currentMonth + 1).padStart(2, '0') && (b.year_c || b.year) === currentYear)
    .reduce((sum, b) => sum + (b.amount_c || b.amount), 0)

  const totalGoals = goals.reduce((sum, g) => sum + (g.target_amount_c || g.targetAmount), 0)
  const goalProgress = goals.reduce((sum, g) => sum + (g.current_amount_c || g.currentAmount), 0)
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatCard
          title="Monthly Income"
          value={monthlyIncome}
          icon="TrendingUp"
          color="success"
          trend="up"
          trendValue="+12% from last month"
        />
        
        <StatCard
          title="Monthly Expenses"
          value={monthlyExpenses}
          icon="TrendingDown"
          color="danger"
          trend="down"
          trendValue="-5% from last month"
        />
        
        <StatCard
          title="Budget Remaining"
          value={Math.max(0, totalBudget - monthlyExpenses)}
          icon="Target"
          color="warning"
          trend={totalBudget > monthlyExpenses ? "up" : "down"}
          trendValue={`${Math.round((monthlyExpenses / totalBudget) * 100)}% used`}
        />
        
        <StatCard
          title="Savings Progress"
          value={goalProgress}
          icon="Trophy"
          color="primary"
          trend="up"
          trendValue={`${Math.round((goalProgress / totalGoals) * 100)}% of goals`}
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SpendingChart type="donut" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SpendingTrends />
        </motion.div>
      </div>

      {/* Recent Transactions & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Transactions</span>
                <ApperIcon name="ChevronRight" className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((transaction) => (
                <motion.div
                  key={transaction.Id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
(transaction.type_c || transaction.type) === "income" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      <CategoryIcon 
                        category={transaction.category_c || transaction.category} 
                        className="h-4 w-4" 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description_c || transaction.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.category_c || transaction.category} • {formatDate(transaction.date_c || transaction.date)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    (transaction.type_c || transaction.type) === "income" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {(transaction.type_c || transaction.type) === "income" ? "+" : "-"}{formatCurrency(transaction.amount_c || transaction.amount)}
                  </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <motion.button
                className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <ApperIcon name="Plus" className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add Transaction</p>
                    <p className="text-sm text-gray-600">Record income or expense</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary-100 rounded-lg group-hover:bg-secondary-200 transition-colors">
                    <ApperIcon name="Target" className="h-4 w-4 text-secondary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Set Budget</p>
                    <p className="text-sm text-gray-600">Create monthly budget</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <ApperIcon name="Trophy" className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">New Goal</p>
                    <p className="text-sm text-gray-600">Create savings goal</p>
                  </div>
                </div>
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard