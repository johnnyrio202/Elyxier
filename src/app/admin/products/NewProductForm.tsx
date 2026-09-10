"use client";

import { useState } from "react";
import PhotoDropzone from "./PhotoDropzone";
import { createProduct } from "./actions";

const AMBER = "#D4920A";
const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: `1px solid ${AMBER}55`,
  borderRadius: 4,
  color: "#FAF7F0",
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "inherit",
};
const LABEL_STYLE: React.CSSProperties = { display: "block", fontSize: 11, color: "#9A8A70", marginBottom: 4 };

export default function NewProductForm() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: `1px dashed ${AMBER}55`, borderRadius: 8, background: "#141410", overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
          background: "transparent",
          border: "none",
          color: AMBER,
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>+ Add New Product</span>
        <span style={{ color: "#9A8A70", fontSize: 18 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <form
          action={createProduct}
          onSubmit={() => setOpen(false)}
          style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div>
            <label style={LABEL_STYLE}>Name</label>
            <input type="text" name="name" required style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Short Description</label>
            <input type="text" name="shortDesc" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Full Blurb</label>
            <textarea name="blurb" rows={3} style={{ ...INPUT_STYLE, resize: "vertical" as const }} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Photos</label>
            <PhotoDropzone />
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
              Price (USD)
              <input type="number" name="price" step="0.01" min="0" required style={{ ...INPUT_STYLE, width: 90 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
              Inventory
              <input type="number" name="inventory" min="0" step="1" defaultValue={0} required style={{ ...INPUT_STYLE, width: 90 }} />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9A8A70", paddingBottom: 10 }}>
              <input type="checkbox" name="active" defaultChecked />
              For sale
            </label>
          </div>
          <button
            type="submit"
            style={{
              alignSelf: "flex-start",
              background: AMBER,
              color: "#0A0A08",
              border: "none",
              borderRadius: 4,
              padding: "10px 20px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Create Product
          </button>
        </form>
      )}
    </div>
  );
}
