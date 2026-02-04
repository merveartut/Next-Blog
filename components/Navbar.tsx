"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { PenSquare, Search, LogOut, X, User, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profil dropdown durumu

  // Dropdown'ı dışarı tıklandığında kapatmak için
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Arama sonuçlarını getirme mantığı (Mevcut kodun aynısı)
  useEffect(() => {
    const fetchResults = async () => {
      if (pathname !== "/" && searchValue.length > 1) {
        setSearchLoading(true);
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchValue)}`,
          );
          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error(error);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setResults([]);
      }
    };
    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchValue, pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?search=${encodeURIComponent(searchValue.trim())}`);
      setIsSearching(false);
      setSearchValue("");
    }
  };

  return (
    <nav className="w-full bg-[#f6efde]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 md:px-12 h-20 relative">
        {/* 1. ARAMA MODU (Aktifse kaplar) */}
        {isSearching && (
          <div className="absolute inset-0 bg-amber-50 z-[60] flex flex-col shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <form
              onSubmit={handleSearchSubmit}
              className="h-20 flex items-center px-4 md:px-6"
            >
              <Search className="text-slate-400 mr-4" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent border-none outline-none text-lg font-mono text-slate-900 placeholder:text-slate-300"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearching(false);
                  setSearchValue("");
                }}
                className="p-2 text-slate-400 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </form>
            {/* ... Arama Sonuçları Listesi (Mevcut kodun aynısı) ... */}
          </div>
        )}

        {/* 2. STANDART NAVBAR */}
        <div className="h-full flex items-center justify-between">
          {/* SOL: Masaüstü Menüler (Mobilde gizli) */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            <Link
              href="/"
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
          </div>

          {/* ORTA: Logo */}
          <div className="flex-1 md:flex-none flex justify-start md:justify-center">
            <Link
              href="/"
              className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter"
            >
              Be Log<span className="text-blue-600">.</span>
            </Link>
          </div>

          {/* SAĞ: Aksiyonlar */}
          <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
            {/* Yaz Butonu (Mobilde sadece ikon) */}
            {session && (
              <Link
                href="/blog/new/editor"
                className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-md"
              >
                <PenSquare size={18} />
                <span className="hidden md:inline">Write</span>
              </Link>
            )}

            {/* Arama Butonu */}
            <button
              onClick={() => setIsSearching(true)}
              className="p-2 hover:bg-slate-200/50 rounded-full transition-all text-slate-600"
            >
              <Search size={20} />
            </button>

            <div className="h-6 w-[1px] bg-slate-300 mx-1 hidden md:block"></div>

            {/* PROFIL / AUTH DROPDOWN */}
            <div className="relative" ref={profileRef}>
              {session ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 p-1 hover:bg-slate-200/50 rounded-full transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.charAt(0)}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 hover:bg-slate-200/50 rounded-full text-slate-600"
                >
                  <User size={20} />
                </button>
              )}

              {/* DROPDOWN MENU */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  {session ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Account
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {session.user?.name}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm font-bold text-blue-600 hover:bg-slate-50"
                      >
                        Join Now
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
