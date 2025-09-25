import React from "react"
import { motion } from "framer-motion"
import { formatCurrency, calculateProgress } from "@/utils/formatters"

const ProgressBar = ({ current, target, label, color = "primary" }) => {
  const percentage = calculateProgress(current, target)
  const isOverBudget = current > target

  const colors = {
    primary: isOverBudget ? "bg-red-500" : "bg-primary-500",
    success: "bg-green-500",
    warning: "bg-orange-500",
    danger: "bg-red-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={`font-semibold ${isOverBudget ? "text-red-600" : "text-gray-600"}`}>
          {formatCurrency(current)} / {formatCurrency(target)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colors[color]} ${isOverBudget ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-primary-500 to-primary-600"}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className={`${isOverBudget ? "text-red-600" : "text-primary-600"} font-medium`}>
          {Math.round(percentage)}%
        </span>
        {isOverBudget && (
          <span className="text-red-600 font-medium">
            Over by {formatCurrency(current - target)}
          </span>
        )}
      </div>
    </div>
  )
}

export default ProgressBar