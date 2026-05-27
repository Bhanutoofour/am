import { permanentRedirect } from "next/navigation";

interface TypoProductModelPageProps {
  params: Promise<{ slug: string; modelSlug: string }>;
}

export default async function TypoProductModelPage({
  params,
}: TypoProductModelPageProps) {
  const { slug, modelSlug } = await params;

  permanentRedirect(`/products/${slug}/${modelSlug}`);
}
