import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardContent } from "@/components/atoms/Card"
import { formatCurrency } from "@/utils/formatters"

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-400 to-secondary-500",
    success: "from-green-500 to-green-600",
    warning: "from-orange-500 to-orange-600",
    danger: "from-red-500 to-red-600"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof value === "number" ? formatCurrency(value) : value}
              </p>
              {trend && (
                <div className={`flex items-center mt-2 text-sm ${
                  trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
                }`}>
                  <ApperIcon 
                    name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                    className="h-4 w-4 mr-1" 
                  />
                  {trendValue}
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg`}>
              <ApperIcon name={icon} className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default StatCard