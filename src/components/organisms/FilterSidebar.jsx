import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  categories = [],
  className 
}) => {
  const [localFilters, setLocalFilters] = useState({
    dateRange: { start: "", end: "" },
    categories: [],
    amountRange: { min: "", max: "" },
    searchTerm: "",
    ...filters
  })

  // Sync with parent filters
  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }))
  }, [filters])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: { start: "", end: "" },
      categories: [],
      amountRange: { min: "", max: "" },
      searchTerm: ""
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.searchTerm) count++
    if (localFilters.dateRange.start || localFilters.dateRange.end) count++
    if (localFilters.categories.length > 0) count++
    if (localFilters.amountRange.min || localFilters.amountRange.max) count++
    return count
  }

  const handleDatePreset = (preset) => {
    const today = new Date()
    let start, end

    switch (preset) {
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case "last3Months":
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1)
        end = today
        break
      case "thisYear":
        start = new Date(today.getFullYear(), 0, 1)
        end = today
        break
      default:
        return
    }

    handleFilterChange("dateRange", {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Filter Transactions</h2>
            <p className="text-sm text-gray-600">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="lg:hidden"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>
        
        {getActiveFilterCount() > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllFilters}
            className="mt-3 w-full"
          >
            <ApperIcon name="X" className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Search</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField>
              <Input
                placeholder="Search descriptions..."
                value={localFilters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                className="w-full"
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Date Range */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Date Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDatePreset("thisMonth")}
              >
                This Month
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDatePreset("lastMonth")}
              >
                Last Month
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDatePreset("last3Months")}
              >
                Last 3 Months
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDatePreset("thisYear")}
              >
                This Year
              </Button>
            </div>
            
            {/* Custom Date Range */}
            <div className="space-y-3">
              <FormField label="Start Date" type="date">
                <Input
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => handleFilterChange("dateRange", {
                    ...localFilters.dateRange,
                    start: e.target.value
                  })}
                />
              </FormField>
              <FormField label="End Date" type="date">
                <Input
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => handleFilterChange("dateRange", {
                    ...localFilters.dateRange,
                    end: e.target.value
                  })}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField type="select">
              <Select
                multiple
                value={localFilters.categories}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value)
                  handleFilterChange("categories", values)
                }}
                className="min-h-[120px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormField>
            
            {localFilters.categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {localFilters.categories.map(category => (
                  <span 
                    key={category}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {category}
                    <button
                      onClick={() => handleFilterChange("categories", 
                        localFilters.categories.filter(c => c !== category)
                      )}
                      className="ml-1 hover:text-primary-900"
                    >
                      <ApperIcon name="X" className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amount Range */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Amount Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField label="Min Amount">
              <Input
                type="number"
                placeholder="0.00"
                value={localFilters.amountRange.min}
                onChange={(e) => handleFilterChange("amountRange", {
                  ...localFilters.amountRange,
                  min: e.target.value
                })}
              />
            </FormField>
            <FormField label="Max Amount">
              <Input
                type="number"
                placeholder="No limit"
                value={localFilters.amountRange.max}
                onChange={(e) => handleFilterChange("amountRange", {
                  ...localFilters.amountRange,
                  max: e.target.value
                })}
              />
            </FormField>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-shrink-0 transition-all duration-300",
        isOpen ? "lg:w-80" : "lg:w-0",
        className
      )}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col w-80 bg-white border-r border-gray-200 shadow-sm overflow-hidden"
            >
              <SidebarContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-600 bg-opacity-75" 
              onClick={onClose} 
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FilterSidebar