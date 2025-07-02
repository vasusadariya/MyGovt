import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "government" | "error"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
      government: "border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-blue-50/30",
      error: "border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30",
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-200",
          variants[variant],
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
