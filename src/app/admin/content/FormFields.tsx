export const AMBER = "#D4920A";
export const CARD = "#141410";
export const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: `1px solid ${AMBER}55`,
  borderRadius: 4,
  color: "#FAF7F0",
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "inherit",
};
export const LABEL_STYLE: React.CSSProperties = { display: "block", fontSize: 11, color: "#9A8A70", marginBottom: 4 };
export const BTN_STYLE: React.CSSProperties = {
  background: AMBER,
  color: "#0A0A08",
  border: "none",
  borderRadius: 4,
  padding: "10px 20px",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  cursor: "pointer",
};

export function HeadlineLinesFields({ lines, max = 4 }: { lines: { text: string; emphasis: boolean }[]; max?: number }) {
  return (
    <div>
      <label style={LABEL_STYLE}>Headline Lines (up to {max} — leave text blank to skip a slot)</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="text" name={`line${i}Text`} defaultValue={lines[i]?.text ?? ""} placeholder={`Line ${i + 1}`} style={{ ...INPUT_STYLE, flex: 1 }} />
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9A8A70", whiteSpace: "nowrap" }}>
              <input type="checkbox" name={`line${i}Emphasis`} defaultChecked={lines[i]?.emphasis ?? false} />
              Emphasize
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LabelHrefListFields({
  items,
  prefix,
  max = 6,
  label,
  labelPlaceholder = "Label",
  hrefPlaceholder = "Link",
}: {
  items: { label?: string; platform?: string; href: string }[];
  prefix: string;
  max?: number;
  label: string;
  labelPlaceholder?: string;
  hrefPlaceholder?: string;
}) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              name={`${prefix}${i}Label`}
              defaultValue={items[i]?.label ?? items[i]?.platform ?? ""}
              placeholder={labelPlaceholder}
              style={{ ...INPUT_STYLE, flex: 1 }}
            />
            <input type="text" name={`${prefix}${i}Href`} defaultValue={items[i]?.href ?? ""} placeholder={hrefPlaceholder} style={{ ...INPUT_STYLE, flex: 1 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TextListFields({ items, prefix, max, label, rows }: { items: string[]; prefix: string; max: number; label: string; rows?: number }) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: max }, (_, i) =>
          rows ? (
            <textarea key={i} name={`${prefix}${i}`} defaultValue={items[i] ?? ""} placeholder={`#${i + 1}`} rows={rows} style={{ ...INPUT_STYLE, resize: "vertical" as const }} />
          ) : (
            <input key={i} type="text" name={`${prefix}${i}`} defaultValue={items[i] ?? ""} placeholder={`#${i + 1}`} style={INPUT_STYLE} />
          )
        )}
      </div>
    </div>
  );
}

export function TitleBodyListFields({ items, prefix, max, label }: { items: { title: string; body: string }[]; prefix: string; max: number; label: string }) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, border: `1px solid ${AMBER}22`, borderRadius: 4, padding: 8 }}>
            <input type="text" name={`${prefix}${i}Title`} defaultValue={items[i]?.title ?? ""} placeholder={`Title ${i + 1}`} style={INPUT_STYLE} />
            <textarea name={`${prefix}${i}Body`} defaultValue={items[i]?.body ?? ""} placeholder="Body" rows={2} style={{ ...INPUT_STYLE, resize: "vertical" as const }} />
          </div>
        ))}
      </div>
    </div>
  );
}
