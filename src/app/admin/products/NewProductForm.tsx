"use client";

import { useState } from "react";
import PhotoDropzone from "./PhotoDropzone";
import { createProduct } from "./actions";

const AMBER = "var(--admin-accent)";
const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "1px solid var(--admin-border-strong)",
  borderRadius: 4,
  color: "var(--admin-ink)",
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "inherit",
};
const LABEL_STYLE: React.CSSProperties = { display: "block", fontSize: 11, color: "var(--admin-muted)", marginBottom: 4 };

const MAX_BUNDLE_COMPONENTS = 8;

export default function NewProductForm({ allProducts }: { allProducts: { slug: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [isBundle, setIsBundle] = useState(false);

  return (
    <div style={{ border: "1px dashed var(--admin-border-strong)", borderRadius: 8, background: "var(--admin-card)", overflow: "hidden" }}>
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
        <span style={{ color: "var(--admin-muted)", fontSize: 18 }}>{open ? "−" : "+"}</span>
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
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--admin-muted)" }}>
              Price (USD)
              <input type="number" name="price" step="0.01" min="0" required style={{ ...INPUT_STYLE, width: 90 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--admin-muted)" }}>
              {isBundle ? "Inventory (computed)" : "Inventory"}
              <input type="number" name="inventory" min="0" step="1" defaultValue={0} disabled={isBundle} required style={{ ...INPUT_STYLE, width: 90, opacity: isBundle ? 0.5 : 1 }} />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--admin-muted)", paddingBottom: 10 }}>
              <input type="checkbox" name="active" defaultChecked />
              For sale
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--admin-muted)", paddingBottom: 10 }}>
              <input type="checkbox" name="isBundle" checked={isBundle} onChange={(e) => setIsBundle(e.target.checked)} />
              This is a bundle
            </label>
          </div>

          {isBundle && (
            <div>
              <label style={LABEL_STYLE}>Bundle Components (pick existing products + how many of each)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Array.from({ length: MAX_BUNDLE_COMPONENTS }, (_, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <select name={`component${i}Slug`} defaultValue="" style={{ ...INPUT_STYLE, flex: 1 }}>
                      <option value="">—</option>
                      {allProducts.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <input type="number" name={`component${i}Qty`} min="1" step="1" placeholder="Qty" style={{ ...INPUT_STYLE, width: 70 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={LABEL_STYLE}>Discount (optional)</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--admin-muted)" }}>
                Type
                <select name="discountType" defaultValue="" style={{ ...INPUT_STYLE, width: 140 }}>
                  <option value="">No discount</option>
                  <option value="percent">Percent off</option>
                  <option value="fixed">Dollar amount off</option>
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--admin-muted)" }}>
                Value
                <input type="number" name="discountValue" step="0.01" min="0" style={{ ...INPUT_STYLE, width: 90 }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--admin-muted)" }}>
                Starts
                <input type="datetime-local" name="discountStartsAt" style={{ ...INPUT_STYLE, width: 190 }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--admin-muted)" }}>
                Ends (blank = runs until stopped)
                <input type="datetime-local" name="discountEndsAt" style={{ ...INPUT_STYLE, width: 190 }} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            style={{
              alignSelf: "flex-start",
              background: "var(--admin-accent)",
              color: "var(--admin-accent-ink)",
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
