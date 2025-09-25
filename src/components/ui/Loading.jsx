import React from "react"
import { Card } from "@/components/atoms/Card"

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Overview Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Chart and Transactions Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-4"></div>
              <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}

export default Loading