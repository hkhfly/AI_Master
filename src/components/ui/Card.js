import React from "react"
import { cn } from "../../lib/utils"
import './Components.css'

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ui-card", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("ui-card-content", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardContent }
