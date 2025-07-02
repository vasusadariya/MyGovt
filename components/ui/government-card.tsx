import * as React from "react"
import { cn } from "../../lib/utils"
import { Shield, CheckCircle } from "lucide-react"

interface GovernmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "official" | "secure" | "verified"
  children: React.ReactNode
}

const GovernmentCard = React.forwardRef<HTMLDivElement, GovernmentCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-white border-2 border-slate-300 shadow-lg",
      official: "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-xl",
      secure: "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 shadow-xl",
      verified: "bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 shadow-xl",
    }

    const icons = {
      default: null,
      official: <Shield className="w-5 h-5 text-blue-600" />,
      secure: <CheckCircle className="w-5 h-5 text-green-600" />,
      verified: <Shield className="w-5 h-5 text-purple-600" />,
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
          variants[variant],
          className,
        )}
        {...props}
      >
        {icons[variant] && <div className="flex items-center justify-end mb-2">{icons[variant]}</div>}
        {children}
      </div>
    )
  },
)
GovernmentCard.displayName = "GovernmentCard"

export { GovernmentCard }
