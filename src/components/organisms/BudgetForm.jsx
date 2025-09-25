import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { toast } from "react-toastify"
import { getCurrentMonthKey } from "@/utils/formatters"

const BudgetForm = ({ onSubmit, onCancel, initialData = null }) => {
const [formData, setFormData] = useState({
    categoryId: initialData?.category_id_c || initialData?.categoryId || "",
    amount: initialData?.amount_c || initialData?.amount || "",
    month: initialData?.month_c || initialData?.month || getCurrentMonthKey().split('-')[1],
    year: initialData?.year_c || initialData?.year || new Date().getFullYear()
  })

  const [errors, setErrors] = useState({})

  const categories = [
    "Food & Dining",
    "Transportation", 
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Health & Medical",
    "Travel",
    "Education",
    "Personal Care",
    "Home & Garden",
    "Other"
  ]

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Budget amount must be greater than 0"
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors below")
      return
    }

const budget = {
      category_id_c: formData.categoryId,
      amount_c: parseFloat(formData.amount),
      month_c: formData.month,
      year_c: parseInt(formData.year)
    }

    onSubmit(budget)
    
    if (!initialData) {
      setFormData({
        categoryId: "",
        amount: "",
        month: getCurrentMonthKey().split('-')[1],
        year: new Date().getFullYear()
      })
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Target" className="h-5 w-5 mr-2 text-primary-600" />
            {initialData ? "Edit Budget" : "Set New Budget"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Category"
                type="select"
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                error={errors.categoryId}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Budget Amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                error={errors.amount}
              />

              <FormField
                label="Month"
                type="select"
                value={formData.month}
                onChange={(e) => handleChange("month", e.target.value)}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Year"
                type="number"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 5}
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {onCancel && (
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary">
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {initialData ? "Update Budget" : "Set Budget"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BudgetForm