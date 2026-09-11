"use client";

import { useRef, useState } from "react";

export default function PhotoDropzone({ label = "Drop photos here, or click to browse" }: { label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  function updateFromFileList(files: FileList | null) {
    if (!inputRef.current) return;
    if (files && files.length > 0) {
      inputRef.current.files = files;
      setFileNames(Array.from(files).map((f) => f.name));
    }
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          updateFromFileList(e.dataTransfer.files);
        }}
        style={{
          border: `1.5px dashed ${dragOver ? "var(--admin-accent)" : "var(--admin-border-strong)"}`,
          borderRadius: 6,
          padding: "18px 14px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "var(--admin-border-faint)" : "transparent",
          color: "var(--admin-muted)",
          fontSize: 12,
        }}
      >
        {fileNames.length > 0 ? `${fileNames.length} photo(s) selected: ${fileNames.join(", ")}` : label}
      </div>
      <input
        ref={inputRef}
        type="file"
        name="photos"
        accept="image/*"
        multiple
        onChange={(e) => setFileNames(Array.from(e.target.files ?? []).map((f) => f.name))}
        style={{ display: "none" }}
      />
    </div>
  );
}
