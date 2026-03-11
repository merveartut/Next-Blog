"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function PostCategories({
  categories,
}: {
  categories: string[];
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const visibleCategories = categories.slice(0, 3);
  const hiddenCategories = categories.slice(3);

  return (
    <div className="flex items-center gap-2 relative">
      {/* İlk 3 Kategori */}
      {visibleCategories.map((cat, i) => (
        <span
          key={cat}
          className={`px-2 md:px-3 py-1 rounded-md text-[10px] md:text-xs font-bold text-white shadow-sm whitespace-nowrap
            ${["bg-indigo-400", "bg-emerald-500", "bg-rose-400"][i % 3]}`}
        >
          {cat}
        </span>
      ))}

      {/* + Butonu ve Tooltip */}
      {hiddenCategories.length > 0 && (
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <Plus size={14} strokeWidth={3} />
          </button>

          {/* Tooltip Paneli */}
          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 p-3 bg-slate-900 rounded-xl shadow-2xl z-50 flex flex-wrap gap-2 min-w-[150px] animate-in fade-in zoom-in-95 duration-200">
              <div className="absolute -top-1 right-3 w-3 h-3 bg-slate-900 rotate-45" />
              {hiddenCategories.map((cat, i) => (
                <span
                  key={cat}
                  className="px-2 py-1 rounded-md text-[10px] font-bold text-white bg-slate-700 whitespace-nowrap"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
