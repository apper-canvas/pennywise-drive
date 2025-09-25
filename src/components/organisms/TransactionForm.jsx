import React, { useState } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { toast } from "react-toastify"

const TransactionForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || "",
    type: initialData?.type || "expense",
    category: initialData?.category || "",
    description: initialData?.description || "",
    date: initialData?.date || new Date().toISOString().split('T')[0]
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
    "Investments",
    "Gifts & Donations",
    "Personal Care",
    "Home & Garden",
    "Other"
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
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

    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    }

    onSubmit(transaction)
    
    if (!initialData) {
      setFormData({
        amount: "",
        type: "expense",
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
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
            <ApperIcon name="Plus" className="h-5 w-5 mr-2 text-primary-600" />
            {initialData ? "Edit Transaction" : "Add New Transaction"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                error={errors.amount}
              />

              <FormField
                label="Type"
                type="select"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                error={errors.type}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </FormField>

              <FormField
                label="Category"
                type="select"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                error={errors.category}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                error={errors.date}
              />
            </div>

            <FormField
              label="Description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              error={errors.description}
            />

            <div className="flex justify-end space-x-3 pt-4">
              {onCancel && (
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary">
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {initialData ? "Update Transaction" : "Add Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TransactionForm