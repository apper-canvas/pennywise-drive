import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { Card } from "@/components/atoms/Card"

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-red-50 rounded-full">
          <ApperIcon name="AlertCircle" className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 max-w-md">{message}</p>
        </div>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="primary" className="mt-4">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  )
}

export default Error