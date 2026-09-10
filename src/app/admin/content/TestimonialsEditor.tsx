"use client";

import { useState } from "react";
import { saveTestimonial, deleteTestimonial, moveTestimonial } from "./actions";

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
  padding: "4px 10px",
  fontSize: 11,
  cursor: "pointer",
};

type Testimonial = { _id: string; quote: string; name: string };

export default function TestimonialsEditor({ testimonials }: { testimonials: Testimonial[] }) {
  const [addingNew, setAddingNew] = useState(false);

  return (
    <section style={{ border: `1px solid ${AMBER}33`, borderRadius: 8, background: CARD, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Testimonials</h2>
        <button type="button" onClick={() => setAddingNew((v) => !v)} style={GHOST_BTN_STYLE}>
          {addingNew ? "Cancel" : "+ Add Testimonial"}
        </button>
      </div>

      {addingNew && (
        <form
          action={saveTestimonial}
          onSubmit={() => setAddingNew(false)}
          style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, paddingBottom: 20, borderBottom: `1px dashed ${AMBER}33` }}
        >
          <div>
            <label style={LABEL_STYLE}>Quote</label>
            <textarea name="quote" rows={2} required style={{ ...INPUT_STYLE, resize: "vertical" as const }} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Customer Name</label>
            <input type="text" name="name" required style={INPUT_STYLE} />
          </div>
          <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
            Add
          </button>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {testimonials.map((tItem, i) => (
          <form key={tItem._id} action={saveTestimonial} style={{ border: `1px solid ${AMBER}22`, borderRadius: 6, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <input type="hidden" name="id" value={tItem._id} />
            <textarea name="quote" defaultValue={tItem.quote} rows={2} required style={{ ...INPUT_STYLE, resize: "vertical" as const }} />
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input type="text" name="name" defaultValue={tItem.name} required style={{ ...INPUT_STYLE, flex: 1, minWidth: 160 }} />
              <button type="submit" style={GHOST_BTN_STYLE}>
                Save
              </button>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="submit" formAction={moveTestimonial} name="direction" value="up" disabled={i === 0} style={{ ...GHOST_BTN_STYLE, opacity: i === 0 ? 0.3 : 1 }}>
                ↑ Move Up
              </button>
              <button type="submit" formAction={moveTestimonial} name="direction" value="down" disabled={i === testimonials.length - 1} style={{ ...GHOST_BTN_STYLE, opacity: i === testimonials.length - 1 ? 0.3 : 1 }}>
                ↓ Move Down
              </button>
              <button type="submit" formAction={deleteTestimonial} style={{ ...GHOST_BTN_STYLE, color: "#E09090" }}>
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
