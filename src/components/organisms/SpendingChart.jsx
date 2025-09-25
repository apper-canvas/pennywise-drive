import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { formatCurrency } from "@/utils/formatters"
import transactionService from "@/services/api/transactionService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const SpendingChart = ({ type = "pie" }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError("")
      
      await new Promise(resolve => setTimeout(resolve, 300))
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (err) {
      setError("Failed to load spending data")
      console.error("Error loading transactions:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTransactions} />

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return t.type === "expense" && 
           transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear
  })

  const categoryTotals = currentMonthTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
    return acc
  }, {})

  const categories = Object.keys(categoryTotals)
  const amounts = Object.values(categoryTotals)

  if (categories.length === 0) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">No expenses found for this month</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartOptions = {
    chart: {
      type: type,
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false }
    },
    labels: categories,
    colors: [
      '#2E7D32', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7',
      '#FF9800', '#FFB74D', '#FFCC02', '#FFC107', '#FFD54F',
      '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB'
    ],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontWeight: 500
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value)
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 320 },
        legend: { position: 'bottom' }
      }
    }]
  }

  if (type === "donut") {
    chartOptions.plotOptions = {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#2E7D32',
              formatter: () => formatCurrency(amounts.reduce((a, b) => a + b, 0))
            }
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <p className="text-sm text-gray-600">Current month breakdown</p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <Chart
            options={chartOptions}
            series={amounts}
            type={type}
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default SpendingChart