import Link from 'next/link'

interface ArticleCardProps {
  tag: string
  title: string
  description: string
  href: string
}

export function ArticleCard({ tag, title, description, href }: ArticleCardProps) {
  return (
    <div className="block p-6 bg-white dark:bg-gray-800 border-2 border-[#000000] 
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      <span className="inline-block px-3 py-1 text-sm border-2 border-black dark:border-gray-600 mb-4 text-black dark:text-gray-300">
        {tag}
      </span>
      <h3 className="font-bold text-xl mb-2 dark:text-white text-black">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <Link 
        href={href}
        className="inline-flex items-center text-sm font-semibold hover:underline text-gray-400 hover:text-purple-500 dark:text-gray-300 dark:hover:text-green-400"
      >
        Read more
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  )
}