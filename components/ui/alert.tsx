import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

const alertVariants = cva(
  "relative w-full rounded-lg border-2 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-blue-50 text-blue-900 border-blue-200 [&>svg]:text-blue-600",
        destructive: "bg-red-50 text-red-900 border-red-200 [&>svg]:text-red-600",
        success: "bg-green-50 text-green-900 border-green-200 [&>svg]:text-green-600",
        warning: "bg-orange-50 text-orange-900 border-orange-200 [&>svg]:text-orange-600",
        government: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border-blue-300 [&>svg]:text-blue-700 shadow-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {getIcon()}
      {children}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-medium [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
