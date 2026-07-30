"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SearchInput } from "@/src/features/dashboard/components/student/SearchInput";

export function CoursesSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <SearchInput 
        value={searchParams.get("q") || ""} 
        onChange={handleSearch} 
        placeholder="ابحث عن كورس (مثال: علم النفس، الذكاء الاصطناعي...)"
      />
    </div>
  );
}
