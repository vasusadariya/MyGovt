import Link from 'next/link'
import { CheckSquare, InboxIcon, House,LogOut} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/app/firebase/config'

const navigation = [
  { name: 'Home', icon: House, href: '/' },
  { name: 'Tasks', icon: CheckSquare, href: '/tasks' },
  { name: 'Inbox', icon: InboxIcon, href: '/inbox' },
]

export function Sidebar() {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/"); // Redirect to login page after sign-out
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };
  return (
    <div className="mt-14 fixed inset-y-0 left-0 w-64 bg-black text-white dark:bg-gray-900 p-4">
      <div className="space-y-1">
        <p className="text-xs text-gray-400 uppercase mb-2 ">Navigation</p>

        <div className=" hover:bg-white/10 hover:text-purple-500 dark:hover:text-green-400">
        <Link href="/Inbox">
        <button className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg">
          <span>Inbox</span>
        </button>
        </Link>
        </div>
        
        <div className=" hover:bg-white/10 hover:text-purple-500 dark:hover:text-green-400">
        <button className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg"
        onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        </div>
       
      </div>  
    </div>
  )
}