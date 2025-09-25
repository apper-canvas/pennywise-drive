import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { formatCurrency } from "@/utils/formatters"
import transactionService from "@/services/api/transactionService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const SpendingTrends = () => {
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
      setError("Failed to load spending trends")
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

  // Get last 6 months of data
  const last6Months = []
  const now = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    last6Months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      date: date
    })
  }

  const monthlyTotals = last6Months.map(month => {
    const monthlyExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date)
        return t.type === "expense" &&
               transactionDate.getMonth() === month.date.getMonth() &&
               transactionDate.getFullYear() === month.date.getFullYear()
      })
      .reduce((sum, t) => sum + t.amount, 0)
    
    return monthlyExpenses
  })

  const chartOptions = {
    chart: {
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      background: 'transparent'
    },
    colors: ['#2E7D32'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#f0f0f0',
      strokeDashArray: 5
    },
    xaxis: {
      categories: last6Months.map(m => m.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value)
      }
    },
    dataLabels: { enabled: false }
  }

  const series = [{
    name: 'Monthly Spending',
    data: monthlyTotals
  }]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
        <p className="text-sm text-gray-600">Last 6 months overview</p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <Chart
            options={chartOptions}
            series={series}
            type="area"
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default SpendingTrends