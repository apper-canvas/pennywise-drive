import React from "react"
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Transactions", href: "/transactions", icon: "Receipt" },
    { name: "Budgets", href: "/budgets", icon: "Target" },
    { name: "Goals", href: "/goals", icon: "Trophy" },
    { name: "Reports", href: "/reports", icon: "PieChart" }
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="DollarSign" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">PennyWise</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon name={item.icon} className="mr-3 h-5 w-5" />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-4"
                  >
                    <div className="h-2 w-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
          <div className="h-8 w-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500">Premium Account</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 bg-white border-r border-gray-200 shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  )
}

export default Sidebar