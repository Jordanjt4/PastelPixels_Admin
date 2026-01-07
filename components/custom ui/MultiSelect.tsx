"use client";

import { useEffect, useRef } from "react";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

interface CollectionType {
  _id: string;
  title: string;
}

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[];
  value: string[];
  onChange: (ids: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const tagifyRef = useRef<any>(null);
  const syncing = useRef(false);

  // init Tagify ONCE
  useEffect(() => {
    if (!inputRef.current) return;

    tagifyRef.current = new Tagify(inputRef.current, {
      enforceWhitelist: true,
      tagTextProp: "label",
      dropdown: {
        enabled: 1,
        closeOnSelect: false,
        searchKeys: ["label"],
        mapValueTo: "label",
      },
    });

    tagifyRef.current.on("change", () => {
      if (syncing.current) return;

      const ids = tagifyRef.current.value.map(
        (t: any) => String(t.value)
      );

      onChange(ids);
    });

    return () => {
      tagifyRef.current?.destroy();
      tagifyRef.current = null;
    };
  }, []);

  // update whitelist
  useEffect(() => {
    if (!tagifyRef.current) return;

    tagifyRef.current.settings.whitelist = collections.map((c) => ({
      value: String(c._id),
      label: c.title,
    }));
  }, [collections]);

  // sync RHF → Tagify
  useEffect(() => {
    if (!tagifyRef.current) return;

    const current = tagifyRef.current.value.map((t: any) => t.value);

    if (JSON.stringify(current) === JSON.stringify(value)) return;

    syncing.current = true;

    tagifyRef.current.removeAllTags();

    const tags = value
      .map((id) => {
        const item = collections.find(
          (c) => String(c._id) === String(id)
        );
        return item
          ? { value: String(item._id), label: item.title }
          : null;
      })
      .filter(Boolean);

    tagifyRef.current.addTags(tags);
    syncing.current = false;
  }, [value, collections]);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
    />
  );
};

export default MultiSelect;
