import React from "react"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import { cn } from "@/utils/cn"

const FormField = ({ label, error, className, children, type = "input", ...props }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={error ? "text-red-600" : "text-gray-700"}>
          {label}
        </Label>
      )}
      
      {type === "select" ? (
        <Select {...props} className={error ? "border-red-500 focus:ring-red-500" : ""}>
          {children}
        </Select>
      ) : (
        <Input {...props} className={error ? "border-red-500 focus:ring-red-500" : ""} />
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormField