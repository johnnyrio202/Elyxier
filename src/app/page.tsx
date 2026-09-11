import { getCatalog } from "@/lib/catalog";
import { getSiteContent } from "@/sanity/queries";
import { getShippingSettings } from "@/db/shipping";
import { getLiveStatus } from "@/db/liveStatus";
import ElevatedGlam from "./ElevatedGlamClient";

export const revalidate = 60;

export default async function Home() {
  const [products, siteContent, shipping, liveStatus] = await Promise.all([
    getCatalog(),
    getSiteContent(),
    getShippingSettings(),
    getLiveStatus(),
  ]);
  return <ElevatedGlam products={products} siteContent={siteContent} shipping={shipping} liveStatus={liveStatus} />;
}
