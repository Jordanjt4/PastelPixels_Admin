"use client";

import { useEffect, useRef } from "react";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

interface MultiTextProps {
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
}

const MultiText: React.FC<MultiTextProps> = ({
  placeholder,
  value = [],
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const tagifyRef = useRef<any>(null); // ✅ FIX

  useEffect(() => {
    if (!inputRef.current) return;

    tagifyRef.current = new Tagify(inputRef.current, {
      enforceWhitelist: false,
    });

    tagifyRef.current.on("change", () => {
      const tags = tagifyRef.current.value.map(
        (tag: any) => tag.value
      );
      onChange(tags);
    });

    return () => tagifyRef.current?.destroy();
  }, []);

  // keep Tagify synced when editing existing values
  useEffect(() => {
    if (!tagifyRef.current) return;

    tagifyRef.current.removeAllTags();
    tagifyRef.current.addTags(value);
  }, [value]);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    />
  );
};

export default MultiText;
