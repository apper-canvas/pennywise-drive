import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
})

Card.displayName = "Card"

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
      {...props}
    />
  )
})

CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("font-semibold text-gray-900 leading-none tracking-tight", className)}
      {...props}
    />
  )
})

CardTitle.displayName = "CardTitle"

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
})

CardContent.displayName = "CardContent"

const CardDescription = forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 leading-relaxed", className)}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

export { Card, CardHeader, CardTitle, CardDescription, CardContent }