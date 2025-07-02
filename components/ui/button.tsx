import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl border-2 border-blue-600 hover:border-blue-700",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl border-2 border-red-600 hover:border-red-700",
        outline:
          "border-2 border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 shadow-md hover:shadow-lg",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border-2 border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg",
        ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-700",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
        government:
          "bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950 shadow-xl hover:shadow-2xl border-2 border-blue-800 hover:border-blue-900 transform hover:scale-[1.02] transition-all duration-200",
        success:
          "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-lg hover:shadow-xl border-2 border-green-600 hover:border-green-700",
        warning:
          "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 shadow-lg hover:shadow-xl border-2 border-orange-600 hover:border-orange-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
