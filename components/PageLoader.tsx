"use client";

import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#f5f3ea]/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="relative">
        <Loader2 className="animate-spin text-[#f92743] mb-4" size={48} />
        {/* Daktilo Kağıdı Efekti */}
        <div className="absolute inset-0 bg-[#f92743] blur-2xl opacity-10 animate-pulse" />
      </div>
      <p className="font-mono italic text-slate-500 text-sm tracking-widest animate-pulse">
        Page Loading...
      </p>
    </div>
  );
}
