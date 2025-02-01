import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface ProductCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export function ProductCard({ title, description, icon: Icon, href }: ProductCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white dark:bg-gray-800 border-2 border-[#000000] 
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
    >
      <div className="flex gap-4 items-start">
        <div className="p-2 border-2 border-black dark:border-gray-600">
          <Icon className="w-6 h-6 dark:text-gray-300 text-black" />
        </div>
        <div>
          <h3 className="font-bold text-lg dark:text-white text-black">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  )
}