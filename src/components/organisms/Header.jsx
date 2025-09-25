import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { getMonthYear } from "@/utils/formatters"

const Header = ({ onMenuToggle, onFilterToggle, filterSidebarOpen, showMenu = true }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {showMenu && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="lg:hidden"
              >
                <ApperIcon name="Menu" className="h-5 w-5" />
              </Button>
            )}
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Financial Overview
              </h1>
              <p className="text-sm text-gray-600">{getMonthYear()}</p>
            </div>
          </div>

<div className="flex items-center space-x-3">
            <Button 
              variant={filterSidebarOpen ? "primary" : "outline"}
              size="sm" 
              onClick={onFilterToggle}
              className="hidden sm:flex"
            >
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              Filters
              {filterSidebarOpen && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-white bg-opacity-20 rounded">
                  On
                </span>
              )}
            </Button>
            
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export
            </Button>
            
<Button variant="primary" size="sm">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header