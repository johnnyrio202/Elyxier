import { getCatalog } from "@/lib/catalog";
import ElevatedGlam from "./ElevatedGlamClient";

export const revalidate = 60;

export default async function DesignDPage() {
  const products = await getCatalog();
  return <ElevatedGlam products={products} />;
}
