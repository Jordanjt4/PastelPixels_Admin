"use client";

import { useEffect, useRef } from "react";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

interface MultiTextProps {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiText: React.FC<MultiTextProps> = ({
  placeholder,
  value = [],
  onChange,
  onRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const tagify = new Tagify(inputRef.current, {
      enforceWhitelist: false,
    });

    // add tag
    tagify.on("add", (e: any) => {
      onChange(e.detail.data.value);
    });

    // remove tag
    tagify.on("remove", (e: any) => {
      onRemove(e.detail.data.value);
    });

    return () => tagify.destroy();
  }, []);

  return (
    <input
      ref={inputRef}
      defaultValue={value.join(",")}
      placeholder={placeholder}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    />
  );
};

export default MultiText;
