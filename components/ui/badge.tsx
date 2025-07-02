import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-md",
        secondary: "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200 shadow-md",
        destructive: "border-red-200 bg-red-100 text-red-800 hover:bg-red-200 shadow-md",
        success: "border-green-200 bg-green-100 text-green-800 hover:bg-green-200 shadow-md",
        warning: "border-orange-200 bg-orange-100 text-orange-800 hover:bg-orange-200 shadow-md",
        outline: "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-md",
        government:
          "border-blue-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105",
        official:
          "border-green-300 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105",
        secure:
          "border-purple-300 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:scale-105",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
