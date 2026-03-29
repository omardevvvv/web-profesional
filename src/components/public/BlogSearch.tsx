"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useCallback } from "react";
import { Search } from "lucide-react";

interface Category { id: string; name: string; slug: string; }

interface Props {
  categories: Category[];
  currentSearch?: string;
  currentCategory?: string;
}

export function BlogSearch({ categories, currentSearch, currentCategory }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          defaultValue={currentSearch}
          placeholder="Buscar artículos..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-[#C4A882] transition-colors"
          onChange={e => {
            const val = e.target.value;
            const t = setTimeout(() => updateParam("q", val), 400);
            return () => clearTimeout(t);
          }}
        />
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => updateParam("categoria", "")}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              !currentCategory
                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => updateParam("categoria", cat.slug === currentCategory ? "" : cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                currentCategory === cat.slug
                  ? "bg-[#C4A882] text-[#1A1A1A] border-[#C4A882]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
