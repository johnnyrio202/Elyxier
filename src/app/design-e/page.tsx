import { getDesignEContent } from "@/sanity/queries";
import SerifLuxeClient from "./SerifLuxeClient";

export const revalidate = 60;

export default async function DesignEPage() {
  const content = await getDesignEContent();
  return <SerifLuxeClient content={content} />;
}
