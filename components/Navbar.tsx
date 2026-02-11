"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  PenSquare,
  Search,
  LogOut,
  X,
  User,
  ChevronDown,
  Languages,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profil dropdown durumu
  const searchRef = useRef<HTMLDivElement>(null);

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

  const getLocalizedPath = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale; // /[locale]/... yapısında 1. index dil kodudur
    return segments.join("/");
  };

  const closeSearch = useCallback(() => {
    setIsSearching(false);
    setSearchValue("");
    setResults([]);

    // router.replace yerine tarayıcı geçmişini doğrudan güncelliyoruz (Anında temizler)
    if (window.location.search.includes("search=")) {
      window.history.replaceState(null, "", pathname);
      // Filtreleme bileşenini tetiklemek için küçük bir "dispatch" yapıyoruz
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [pathname]);

  // 1. DİNAMİK ARAMA MANTIĞI
  useEffect(() => {
    const isMainPage =
      pathname === "/" || pathname === "/tr" || pathname === "/en";

    // Ana sayfadaysak DEBOUNCE OLMADAN anında URL güncelle
    if (isSearching && isMainPage) {
      const params = new URLSearchParams(window.location.search);
      if (searchValue.trim().length > 0) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }

      // router.replace yerine direkt history kullanıyoruz: 0ms gecikme!
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }

    // Sadece diğer sayfalar için API sonuçlarını debounce ile çekmeye devam et
    const delayDebounceFn = setTimeout(async () => {
      if (isSearching && !isMainPage && searchValue.trim().length >= 2) {
        setSearchLoading(true);
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchValue)}`,
          );
          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, isSearching, pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Profil dropdown kontrolü
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }

      // Arama kutusu kontrolü: Dışarı tıklandıysa kapat
      if (
        isSearching &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearching, closeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?search=${encodeURIComponent(searchValue.trim())}`);
      setIsSearching(false);
      setSearchValue("");
    }
  };

  return (
    <nav
      className={`w-full sticky top-0 z-50 border-b border-slate-200/50 backdrop-blur-md transition-colors duration-300 bg-[#f5f3ea]/90!`}
    >
      {" "}
      <div className="max-w-7xl mx-auto px-4 md:px-12 h-20 relative">
        {/* 1. ARAMA MODU (Aktifse kaplar) */}
        {/* 1. ARAMA MODU */}
        {isSearching && (
          <div
            ref={searchRef}
            className="absolute inset-0 bg-white z-60 flex flex-col shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="h-20 flex items-center px-4 md:px-12"
            >
              <Search className="text-slate-400 mr-4" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Type to search..."
                className="flex-1 bg-transparent border-none outline-none text-lg font-mono text-slate-900"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setIsSearching(false)}
                className="p-2 text-slate-400"
              >
                <X size={24} />
              </button>
            </form>

            {/* 2. ANA SAYFA DIŞINDA ÇIKACAK SONUÇ LİSTESİ */}
            {pathname !== "/" && results.length > 0 && (
              <div className="absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 max-h-[70vh] overflow-y-auto shadow-2xl py-4 px-4 md:px-12">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Search Results
                </p>
                <div className="grid gap-4">
                  {results.map((post: any) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={() => setIsSearching(false)}
                      className="group flex flex-col p-3 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <h4 className="font-bold text-slate-900 group-hover:text-[#f92743] transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-mono">
                        {post.author} •{" "}
                        {new Intl.DateTimeFormat("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(post.createdAt))}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Durumu */}
            {searchLoading && (
              <div className="px-12 py-4 italic text-sm text-slate-400 font-mono">
                Searching daktilo archives...
              </div>
            )}
          </div>
        )}

        {/* 2. STANDART NAVBAR */}
        <div className="h-full flex items-center justify-between">
          {/* SOL: Masaüstü Menüler (Mobilde gizli) */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-[#f92743] transition-colors"
            >
              {t("articles")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-slate-600 hover:text-[#f92743] transition-colors"
            >
              {t("about")}
            </Link>
          </div>

          {/* ORTA: Logo */}
          <div className="flex-1 md:flex-none flex justify-start md:justify-center">
            <Link
              href="/"
              className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter"
            >
              Be Log<span className="text-[#f92743]">.</span>
            </Link>
          </div>

          {/* SAĞ: Aksiyonlar */}
          <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
            {/* Masaüstü Dil Değiştirici (Desktop Only) */}
            <div className="hidden md:flex items-center gap-2 mr-2 text-[11px] font-bold tracking-tighter text-slate-400">
              <Link
                href={getLocalizedPath("tr")}
                className={`hover:text-[#f92743] ${pathname.startsWith("/tr") ? "text-[#f92743]" : ""}`}
              >
                TR
              </Link>
              <span className="opacity-30">|</span>
              <Link
                href={getLocalizedPath("en")}
                className={`hover:text-[#f92743] ${pathname.startsWith("/en") ? "text-[#f92743]" : ""}`}
              >
                EN
              </Link>
            </div>
            {/* Yaz Butonu (Mobilde sadece ikon) */}
            {session && (
              <Link
                href="/blog/new/editor"
                className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-[#f92743] text-white rounded-full text-xs font-bold hover:bg-[#f92743] hover:scale-105 transition-all shadow-md"
              >
                <PenSquare size={18} />
                <span className="hidden md:inline">{t("write")}</span>
              </Link>
            )}

            {/* Arama Butonu */}
            <button
              onClick={() => setIsSearching(true)}
              className="p-2 hover:bg-slate-200/50 cursor-pointer rounded-full transition-all text-slate-600"
            >
              <Search size={20} />
            </button>

            <div className="h-6 w-[1px] bg-slate-300 mx-1 hidden md:block"></div>

            {/* PROFIL / AUTH DROPDOWN */}
            <div className="relative" ref={profileRef}>
              {session ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 p-1 cursor-pointer hover:bg-slate-200/50 rounded-full transition-all"
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
                          {t("account")}
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {session.user?.name}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#f92743] transition-colors"
                      >
                        <User size={16} /> {t("myProfile")}
                      </Link>
                      {/* Mobil Dil Değiştirici (Mobile Only) */}
                      <div className="md:hidden flex items-center gap-3 px-4 py-2 border-t border-slate-100 mt-1 bg-amber-50/30">
                        <Languages size={14} className="text-slate-400" />
                        <div className="flex gap-2 text-[10px] font-bold">
                          <Link
                            href={getLocalizedPath("tr")}
                            className={
                              pathname.startsWith("/tr")
                                ? "text-[#f92743]"
                                : "text-slate-400"
                            }
                          >
                            TR
                          </Link>
                          <span className="text-slate-200">|</span>
                          <Link
                            href={getLocalizedPath("en")}
                            className={
                              pathname.startsWith("/en")
                                ? "text-[#f92743]"
                                : "text-slate-400"
                            }
                          >
                            EN
                          </Link>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center cursor-pointer gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> {t("logout")}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        {t("login")}
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm font-bold text-[#f92743] hover:bg-slate-50"
                      >
                        {t("joinNow")}
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
