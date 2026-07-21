import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { getDesignEContent } from "@/sanity/queries";
import SerifLuxeClient from "./SerifLuxeClient";

export const revalidate = 60;

export default async function DesignEPage() {
  const { isEnabled: preview } = await draftMode();
  const content = await getDesignEContent(preview);
  return (
    <>
      <SerifLuxeClient content={content} />
      {preview && <VisualEditing />}
    </>
  );
}
