import Link from "next/link";
import { Search, User } from "lucide-react"; // npm install lucide-react (ikonlar için)

export default function Navbar() {
  return (
    <nav className="w-full bg-amber-50/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 grid grid-cols-3 items-center">
        {/* SOL: Menüler */}
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Articles
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Projects
          </Link>
        </div>

        {/* ORTA: Logo */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="text-2xl font-black text-slate-900 tracking-tighter"
          >
            Be Log<span className="text-blue-600">.</span>
          </Link>
        </div>

        {/* SAĞ: Search ve Login */}
        <div className="flex items-center justify-end gap-4">
          <button className="p-2 hover:bg-slate-200/50 rounded-full transition-all text-slate-600">
            <Search size={20} />
          </button>

          <div className="h-6 w-[1px] bg-slate-300 mx-2 hidden md:block"></div>

          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <User size={18} />
            <span className="hidden md:inline">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
