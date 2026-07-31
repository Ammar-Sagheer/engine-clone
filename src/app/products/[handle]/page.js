import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/shopify";
import ProductDetail from "./ProductDetail";

export const revalidate = 3600;

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
