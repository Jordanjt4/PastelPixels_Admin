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
  onChange: (id: string) => void;
  onRemove: (id: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
  onRemove,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const tagifyRef = useRef<any>(null);
  const syncing = useRef(false);
  const prevValues = useRef<string[]>([]);

  useEffect(() => {
    if (!inputRef.current || tagifyRef.current) return;

    tagifyRef.current = new Tagify(inputRef.current, {
      enforceWhitelist: true,
      tagTextProp: "label",
      dropdown: {
        enabled: 1,
        closeOnSelect: true,
        searchKeys: ["label"],
        mapValueTo: "label",
      },
    });

    tagifyRef.current.on("add", (e: any) => {
      if (syncing.current) return;

      const id = String(e.detail?.data?.value ?? "");
      if (id && !value.includes(id)) onChange(id);
    });

    tagifyRef.current.on("remove", () => {
      if (syncing.current) return;

      const current = tagifyRef.current.value.map(
        (t: any) => String(t.value)
      );

      const removed = prevValues.current.find(
        (id) => !current.includes(id)
      );

      if (removed) onRemove(removed);
    });

    return () => {
      tagifyRef.current?.destroy();
      tagifyRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!tagifyRef.current) return;

    tagifyRef.current.settings.whitelist = collections.map((c) => ({
      value: String(c._id),
      label: c.title,
    }));
  }, [collections]);

  useEffect(() => {
    if (!tagifyRef.current) return;

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

    if (tags.length) tagifyRef.current.addTags(tags);

    syncing.current = false;
    prevValues.current = value;
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
