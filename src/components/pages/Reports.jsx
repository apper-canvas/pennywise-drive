import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SpendingChart from "@/components/organisms/SpendingChart"
import SpendingTrends from "@/components/organisms/SpendingTrends"
import CategoryIcon from "@/components/molecules/CategoryIcon"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { formatCurrency, formatDate, getMonthYear } from "@/utils/formatters"
import transactionService from "@/services/api/transactionService"
import budgetService from "@/services/api/budgetService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const Reports = () => {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const [transactionsData, budgetsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll()
      ])
      
      setTransactions(transactionsData)
      setBudgets(budgetsData)
    } catch (err) {
      setError("Failed to load reports data")
      console.error("Error loading reports:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  // Calculate current month data
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
    .reduce((sum, t) => sum + t.amount, 0)

  // Category breakdown
  const categoryTotals = currentMonthTransactions
.filter(t => (t.type_c || t.type) === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category_c || transaction.category
      const amount = transaction.amount_c || transaction.amount
      acc[category] = (acc[category] || 0) + amount
      return acc
    }, {})

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  // Calculate spending velocity (daily average)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const currentDay = new Date().getDate()
  const dailyAverage = monthlyExpenses / currentDay

  // Get last 6 months comparison
  const last6MonthsData = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1)
const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date_c || t.date)
      return transactionDate.getMonth() === date.getMonth() && 
             transactionDate.getFullYear() === date.getFullYear()
    })
    
    const monthlyIncome = monthTransactions
      .filter(t => (t.type_c || t.type) === "income")
      .reduce((sum, t) => sum + (t.amount_c || t.amount), 0)
    
    const monthlyExpenses = monthTransactions
      .filter(t => (t.type_c || t.type) === "expense")
      .reduce((sum, t) => sum + (t.amount_c || t.amount), 0)

    last6MonthsData.push({
      month: getMonthYear(date),
      income: monthlyIncome,
      expenses: monthlyExpenses,
      net: monthlyIncome - monthlyExpenses
    })
  }

  const averageMonthlyIncome = last6MonthsData.reduce((sum, m) => sum + m.income, 0) / 6
  const averageMonthlyExpenses = last6MonthsData.reduce((sum, m) => sum + m.expenses, 0) / 6

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-600">Detailed insights into your spending patterns and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Income (Month)</p>
                  <p className={`text-2xl font-bold ${
                    (monthlyIncome - monthlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(monthlyIncome - monthlyExpenses)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ApperIcon name="TrendingUp" className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Daily Average Spend</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(dailyAverage)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <ApperIcon name="Calendar" className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">6-Month Avg Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(averageMonthlyIncome)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ApperIcon name="PiggyBank" className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">6-Month Avg Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(averageMonthlyExpenses)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ApperIcon name="CreditCard" className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SpendingChart type="pie" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SpendingTrends />
        </motion.div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
              <p className="text-sm text-gray-600">Current month breakdown</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCategories.map(([category, amount], index) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CategoryIcon category={category} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category}</p>
                      <p className="text-sm text-gray-600">
                        {Math.round((amount / monthlyExpenses) * 100)}% of total
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>6-Month Overview</CardTitle>
              <p className="text-sm text-gray-600">Income vs Expenses</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {last6MonthsData.slice(-3).map((monthData, index) => (
                <div key={monthData.month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{monthData.month}</span>
                    <span className={`font-semibold ${
                      monthData.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {monthData.net >= 0 ? '+' : ''}{formatCurrency(monthData.net)}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Income</span>
                      <span className="text-green-600">{formatCurrency(monthData.income)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expenses</span>
                      <span className="text-red-600">{formatCurrency(monthData.expenses)}</span>
                    </div>
                  </div>
                  
                  {index < 2 && <hr className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Financial Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Financial Health Insights</CardTitle>
            <p className="text-sm text-gray-600">Key observations from your spending data</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <ApperIcon name="TrendingUp" className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-blue-900">Savings Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-600 mt-1">of income saved</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <ApperIcon name="Shield" className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-900">Expense Trend</p>
                <p className="text-2xl font-bold text-green-600">
                  {averageMonthlyExpenses > 0 ? 
                    (monthlyExpenses > averageMonthlyExpenses ? '+' : '') + 
                    Math.round(((monthlyExpenses - averageMonthlyExpenses) / averageMonthlyExpenses) * 100) + '%'
                    : '0%'
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">vs 6-month average</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <ApperIcon name="Target" className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-purple-900">Days of Expenses</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dailyAverage > 0 ? Math.round((monthlyIncome - monthlyExpenses) / dailyAverage) : 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">covered by surplus</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <h4 className="font-semibold text-primary-900 mb-2">💡 Financial Tips</h4>
              <ul className="space-y-1 text-sm text-primary-800">
                <li>• Aim to save at least 20% of your income for long-term financial health</li>
                <li>• Track your largest expense categories to identify potential savings</li>
                <li>• Build an emergency fund covering 3-6 months of expenses</li>
                <li>• Review and adjust your budgets monthly based on spending patterns</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Reports