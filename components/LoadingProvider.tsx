"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PageLoader from "./PageLoader";

export const LoadingContext = createContext({
  setIsLoading: (v: boolean) => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      // Butonlara tıklayınca loading açılmasın (Favori butonu gibi)
      if (target.closest("button")) return;

      if (
        anchor &&
        anchor.href &&
        !anchor.target.includes("_blank") &&
        !anchor.href.includes("#") &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        // Kendi sitemiz mi kontrolünü daha esnek yapalım
        const url = new URL(anchor.href);
        const isInternal = url.origin === window.location.origin;

        if (isInternal && url.pathname !== window.location.pathname) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ setIsLoading }}>
      {isLoading && <PageLoader />}
      {children}
    </LoadingContext.Provider>
  );
}
