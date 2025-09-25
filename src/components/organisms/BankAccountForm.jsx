import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const BankAccountForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    account_name_c: "",
    institution_name_c: "",
    account_number_c: "",
    balance_c: ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        account_name_c: initialData.account_name_c || "",
        institution_name_c: initialData.institution_name_c || "",
        account_number_c: initialData.account_number_c || "",
        balance_c: initialData.balance_c || ""
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.account_name_c.trim()) {
      newErrors.account_name_c = "Account name is required"
    }

    if (!formData.institution_name_c.trim()) {
      newErrors.institution_name_c = "Institution name is required"
    }

    if (!formData.account_number_c.trim()) {
      newErrors.account_number_c = "Account number is required"
    }

    if (formData.balance_c !== "" && isNaN(parseFloat(formData.balance_c))) {
      newErrors.balance_c = "Balance must be a valid number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      
      const submitData = {
        account_name_c: formData.account_name_c.trim(),
        institution_name_c: formData.institution_name_c.trim(),
        account_number_c: formData.account_number_c.trim(),
        balance_c: formData.balance_c === "" ? 0 : parseFloat(formData.balance_c)
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Plus" className="h-5 w-5 mr-2 text-primary-600" />
            {initialData ? "Edit Bank Account" : "Add Bank Account"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Account Name"
              value={formData.account_name_c}
              onChange={(e) => handleChange("account_name_c", e.target.value)}
              placeholder="e.g., Personal Checking"
              error={errors.account_name_c}
              disabled={loading}
            />

            <FormField
              label="Institution Name"
              value={formData.institution_name_c}
              onChange={(e) => handleChange("institution_name_c", e.target.value)}
              placeholder="e.g., Chase Bank"
              error={errors.institution_name_c}
              disabled={loading}
            />

            <FormField
              label="Account Number"
              value={formData.account_number_c}
              onChange={(e) => handleChange("account_number_c", e.target.value)}
              placeholder="e.g., 1234567890"
              error={errors.account_number_c}
              disabled={loading}
            />

            <FormField
              label="Current Balance"
              type="number"
              step="0.01"
              value={formData.balance_c}
              onChange={(e) => handleChange("balance_c", e.target.value)}
              placeholder="0.00"
              error={errors.balance_c}
              disabled={loading}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    {initialData ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name={initialData ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                    {initialData ? "Update Account" : "Add Account"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BankAccountForm