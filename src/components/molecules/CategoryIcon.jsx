import React from "react"
import ApperIcon from "@/components/ApperIcon"

const CategoryIcon = ({ category, className = "h-5 w-5" }) => {
  const categoryIcons = {
    "Food & Dining": "Utensils",
    "Transportation": "Car",
    "Shopping": "ShoppingBag",
    "Entertainment": "Film",
    "Bills & Utilities": "Receipt",
    "Health & Medical": "Heart",
    "Travel": "Plane",
    "Education": "GraduationCap",
    "Investments": "TrendingUp",
    "Gifts & Donations": "Gift",
    "Personal Care": "Sparkles",
    "Home & Garden": "Home",
    "Pets": "Dog",
    "Insurance": "Shield",
    "Taxes": "FileText",
    "Business": "Briefcase",
    "Other": "MoreHorizontal"
  }

  return (
    <ApperIcon 
      name={categoryIcons[category] || "Circle"} 
      className={className}
    />
  )
}

export default CategoryIcon