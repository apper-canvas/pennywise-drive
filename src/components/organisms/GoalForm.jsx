import React, { useState } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { toast } from "react-toastify"

const GoalForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
name: initialData?.name_c || initialData?.name || "",
    targetAmount: initialData?.target_amount_c || initialData?.targetAmount || "",
    currentAmount: initialData?.current_amount_c || initialData?.currentAmount || "",
    deadline: initialData?.deadline_c ? new Date(initialData.deadline_c).toISOString().split('T')[0] : initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : ""
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Goal name is required"
    }
    
    if (!formData.targetAmount || formData.targetAmount <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0"
    }

    if (formData.currentAmount < 0) {
      newErrors.currentAmount = "Current amount cannot be negative"
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required"
    } else {
      const deadline = new Date(formData.deadline)
      const today = new Date()
      if (deadline <= today) {
        newErrors.deadline = "Deadline must be in the future"
      }
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

    const goal = {
name_c: formData.name,
      target_amount_c: parseFloat(formData.targetAmount),
      current_amount_c: parseFloat(formData.currentAmount || 0),
      deadline_c: new Date(formData.deadline).toISOString()
    }

    onSubmit(goal)
    
    if (!initialData) {
setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: ""
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
            <ApperIcon name="Trophy" className="h-5 w-5 mr-2 text-primary-600" />
            {initialData ? "Edit Savings Goal" : "Create New Goal"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Goal Name"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Target Amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) => handleChange("targetAmount", e.target.value)}
                error={errors.targetAmount}
              />

              <FormField
                label="Current Amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => handleChange("currentAmount", e.target.value)}
                error={errors.currentAmount}
              />

              <FormField
                label="Target Date"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                error={errors.deadline}
              />

              <div className="flex items-end">
                <div className="w-full p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                  <p className="text-sm text-primary-600 font-medium">Progress</p>
                  <p className="text-lg font-bold text-primary-800">
                    {formData.targetAmount && formData.currentAmount ? 
                      Math.round((parseFloat(formData.currentAmount || 0) / parseFloat(formData.targetAmount)) * 100) : 0
                    }%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {onCancel && (
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary">
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {initialData ? "Update Goal" : "Create Goal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default GoalForm