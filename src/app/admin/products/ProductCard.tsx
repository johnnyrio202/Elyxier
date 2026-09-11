"use client";

import { useState } from "react";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import PhotoDropzone from "./PhotoDropzone";
import {
  updateProductContent,
  addProductPhotos,
  removeProductPhoto,
  moveProductPhoto,
  saveCommerceProduct,
} from "./actions";

const AMBER = "#D4920A";
const CARD = "#141410";
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
const BTN_STYLE: React.CSSProperties = {
  background: AMBER,
  color: "#0A0A08",
  border: "none",
  borderRadius: 4,
  padding: "8px 16px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  cursor: "pointer",
};
const GHOST_BTN_STYLE: React.CSSProperties = {
  background: "transparent",
  border: `1px solid ${AMBER}55`,
  color: "#9A8A70",
  borderRadius: 4,
  padding: "4px 8px",
  fontSize: 10,
  cursor: "pointer",
};

const MAX_BUNDLE_COMPONENTS = 8;

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" in local time, with
// no timezone suffix — this strips the seconds/ms and Z that toISOString gives.
function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type ProductCardData = {
  _id: string;
  name: string;
  slug: string;
  shortDesc: string;
  blurb: string;
  photos: { _key: string; asset?: unknown }[];
  commerce: {
    priceCents: number;
    originalPriceCents: number | null;
    inventoryCount: number;
    active: boolean;
    isBundle: boolean;
    discount: { type: "percent" | "fixed"; value: number; startsAt: string | null; endsAt: string | null } | null;
    bundleItems: { slug: string; quantity: number }[];
  } | null;
};

export default function ProductCard({ product, allProducts }: { product: ProductCardData; allProducts: { slug: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [isBundle, setIsBundle] = useState(product.commerce?.isBundle ?? false);
  const hasPhotos = product.photos && product.photos.length > 0;
  const isLive = Boolean(product.commerce?.active && hasPhotos);
  // The commerce row's priceCents is the *effective* (post-discount) price —
  // editing that back in would corrupt the base price. originalPriceCents is
  // only set while a discount is active, so falling back to priceCents when
  // it's null always recovers the true stored price either way.
  const basePriceCents = product.commerce?.originalPriceCents ?? product.commerce?.priceCents;
  const discount = product.commerce?.discount ?? null;
  const otherProducts = allProducts.filter((p) => p.slug !== product.slug);
  const bundleItems = product.commerce?.bundleItems ?? [];

  return (
    <div style={{ border: `1px solid ${AMBER}33`, borderRadius: 8, background: CARD, overflow: "hidden" }}>
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
          color: "#FAF7F0",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>{product.name}</p>
          <p style={{ margin: "2px 0 0", color: "#9A8A70", fontSize: 12 }}>/{product.slug}</p>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: 999,
                background: isLive ? `${AMBER}22` : "#5A1F1F",
                color: isLive ? AMBER : "#E09090",
              }}
            >
              {isLive
                ? "Live"
                : product.commerce?.active && !hasPhotos
                  ? "Needs a photo"
                  : product.commerce
                    ? "Inactive"
                    : "Not sellable yet"}
            </span>
            {product.commerce?.isBundle && (
              <span style={{ display: "inline-block", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 999, background: "transparent", border: `1px solid ${AMBER}55`, color: AMBER }}>
                Bundle
              </span>
            )}
            {product.commerce?.originalPriceCents && (
              <span style={{ display: "inline-block", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 999, background: `${AMBER}22`, color: AMBER }}>
                On Sale
              </span>
            )}
          </div>
        </div>
        <span style={{ color: "#9A8A70", fontSize: 18 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Content */}
          <form action={updateProductContent} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input type="hidden" name="id" value={product._id} />
            <div>
              <label style={LABEL_STYLE}>Name</label>
              <input type="text" name="name" defaultValue={product.name} required style={INPUT_STYLE} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Short Description</label>
              <input type="text" name="shortDesc" defaultValue={product.shortDesc} style={INPUT_STYLE} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Full Blurb</label>
              <textarea name="blurb" defaultValue={product.blurb} rows={3} style={{ ...INPUT_STYLE, resize: "vertical" as const }} />
            </div>
            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Content
            </button>
          </form>

          {/* Photos */}
          <div>
            <label style={LABEL_STYLE}>Photos</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              {product.photos.map((photo, i) => (
                <div key={photo._key} style={{ position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor(photo as SanityImageSource).width(96).height(96).url()}
                    alt=""
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4, border: `1px solid ${AMBER}33`, display: "block" }}
                  />
                  <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                    <form action={moveProductPhoto}>
                      <input type="hidden" name="id" value={product._id} />
                      <input type="hidden" name="photoKey" value={photo._key} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" disabled={i === 0} style={{ ...GHOST_BTN_STYLE, opacity: i === 0 ? 0.3 : 1 }}>
                        ←
                      </button>
                    </form>
                    <form action={moveProductPhoto}>
                      <input type="hidden" name="id" value={product._id} />
                      <input type="hidden" name="photoKey" value={photo._key} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={i === product.photos.length - 1}
                        style={{ ...GHOST_BTN_STYLE, opacity: i === product.photos.length - 1 ? 0.3 : 1 }}
                      >
                        →
                      </button>
                    </form>
                    <form action={removeProductPhoto}>
                      <input type="hidden" name="id" value={product._id} />
                      <input type="hidden" name="photoKey" value={photo._key} />
                      <button type="submit" style={{ ...GHOST_BTN_STYLE, color: "#E09090" }}>
                        ✕
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
            <form action={addProductPhotos} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 420 }}>
              <input type="hidden" name="id" value={product._id} />
              <PhotoDropzone label="Add more photos — drop here or click to browse" />
              <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
                Upload
              </button>
            </form>
          </div>

          {/* Commerce */}
          <form action={saveCommerceProduct} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input type="hidden" name="slug" value={product.slug} />

            <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
                Price (USD)
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  defaultValue={basePriceCents !== undefined ? (basePriceCents / 100).toFixed(2) : ""}
                  required
                  style={{ ...INPUT_STYLE, width: 90 }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
                {isBundle ? "Inventory (computed from components)" : "Inventory"}
                <input
                  type="number"
                  name="inventory"
                  min="0"
                  step="1"
                  disabled={isBundle}
                  defaultValue={product.commerce ? product.commerce.inventoryCount : 0}
                  required
                  style={{ ...INPUT_STYLE, width: 90, opacity: isBundle ? 0.5 : 1 }}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9A8A70", paddingBottom: 10 }}>
                <input type="checkbox" name="active" defaultChecked={product.commerce?.active ?? true} />
                For sale
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9A8A70", paddingBottom: 10 }}>
                <input type="checkbox" name="isBundle" checked={isBundle} onChange={(e) => setIsBundle(e.target.checked)} />
                This is a bundle
              </label>
            </div>

            {isBundle && (
              <div>
                <label style={LABEL_STYLE}>
                  Bundle Components — inventory is the minimum any component allows (e.g. 2× of a component with 10 left caps the bundle at 5)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Array.from({ length: MAX_BUNDLE_COMPONENTS }, (_, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <select name={`component${i}Slug`} defaultValue={bundleItems[i]?.slug ?? ""} style={{ ...INPUT_STYLE, flex: 1 }}>
                        <option value="">—</option>
                        {otherProducts.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input type="number" name={`component${i}Qty`} min="1" step="1" defaultValue={bundleItems[i]?.quantity ?? ""} placeholder="Qty" style={{ ...INPUT_STYLE, width: 70 }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label style={LABEL_STYLE}>Discount</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
                  Type
                  <select name="discountType" defaultValue={discount?.type ?? ""} style={{ ...INPUT_STYLE, width: 140 }}>
                    <option value="">No discount</option>
                    <option value="percent">Percent off</option>
                    <option value="fixed">Dollar amount off</option>
                  </select>
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
                  Value
                  <input
                    type="number"
                    name="discountValue"
                    step="0.01"
                    min="0"
                    defaultValue={discount ? (discount.type === "fixed" ? (discount.value / 100).toFixed(2) : discount.value) : ""}
                    placeholder={discount?.type === "fixed" ? "$ off" : "% off"}
                    style={{ ...INPUT_STYLE, width: 90 }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
                  Starts
                  <input type="datetime-local" name="discountStartsAt" defaultValue={toDatetimeLocalValue(discount?.startsAt)} style={{ ...INPUT_STYLE, width: 190 }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
                  Ends (blank = runs until stopped)
                  <input type="datetime-local" name="discountEndsAt" defaultValue={toDatetimeLocalValue(discount?.endsAt)} style={{ ...INPUT_STYLE, width: 190 }} />
                </label>
              </div>
            </div>

            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Price &amp; Inventory
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
