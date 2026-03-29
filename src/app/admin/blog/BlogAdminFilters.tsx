"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Category { id: string; name: string; slug: string; }

interface Props {
  categories: Category[];
  currentSearch?: string;
  currentCategory?: string;
}

export function BlogAdminFilters({ categories, currentSearch, currentCategory }: Props) {
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
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          defaultValue={currentSearch}
          placeholder="Buscar por título o contenido..."
          className="pl-9"
          onChange={e => {
            const val = e.target.value;
            const t = setTimeout(() => updateParam("q", val), 400);
            return () => clearTimeout(t);
          }}
        />
      </div>
      {categories.length > 0 && (
        <select
          defaultValue={currentCategory ?? ""}
          onChange={e => updateParam("categoria", e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white min-w-[180px]"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}
