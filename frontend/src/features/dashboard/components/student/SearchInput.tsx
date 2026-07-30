"use client";

import { Search, X } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = "بحث...",
  value,
  onChange,
  debounceMs = 300,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative group">
      <Search
        size={18}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors"
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-surfaceBorder rounded-input py-2.5 pr-11 pl-10 font-ui text-sm text-primary placeholder:text-muted/50 focus:outline-none focus:border-gold/50 focus:bg-surface focus:ring-1 focus:ring-gold/50 transition-all duration-200 shadow-sm"
        aria-label={placeholder}
      />
      {localValue && (
        <button
          onClick={() => handleChange("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors p-0.5 rounded-full hover:bg-primary/5"
          aria-label="مسح البحث"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
