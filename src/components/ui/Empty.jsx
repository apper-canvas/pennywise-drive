import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { Card } from "@/components/atoms/Card"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item",
  icon = "FileText",
  action,
  actionLabel = "Get Started",
  showFiltersMessage = false
}) => {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full">
          <ApperIcon name={icon} className="h-12 w-12 text-primary-600" />
        </div>
        <div className="max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
            {showFiltersMessage && (
              <span className="block mt-2 text-sm text-gray-500">
                Try adjusting your filters to see more results.
              </span>
            )}
          </p>
        </div>
        {action && (
          <Button onClick={action} variant="primary" size="lg" className="mt-4">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default Empty