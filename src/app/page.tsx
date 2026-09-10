import { getCatalog } from "@/lib/catalog";
import { getSiteContent } from "@/sanity/queries";
import ElevatedGlam from "./ElevatedGlamClient";

export const revalidate = 60;

export default async function Home() {
  const [products, siteContent] = await Promise.all([getCatalog(), getSiteContent()]);
  return <ElevatedGlam products={products} siteContent={siteContent} />;
}
