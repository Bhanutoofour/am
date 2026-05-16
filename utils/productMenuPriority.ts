import { titleToSlug } from "@/utils/slug";

const PRODUCT_PRIORITY_GROUPS = [
  ["trenchers", "trencher"],
  ["amphibious-excavator"],
  ["aquatic-weed-harvester", "aquatic-weed-harvesters"],
  ["dredgers", "dredger"],
  ["tractor-attachments", "attachments"],
  ["walk-behind-trenchers", "walk-behind-trencher"],
  [
    "self-propelled-multi-attachments-machine",
    "self-propelled-multi-attachment-machine",
    "self-propelled",
    "agricultural-attachments",
  ],
  ["post-hole-digger", "post-hole-diggers"],
  ["amphibious-work-boats", "amphibious-work-boat"],
  ["barges-floating-pontoon", "barges", "floating-pontoon"],
  ["landscaping-equipment"],
  ["sand-filler"],
  ["pole-stacker"],
];

const productPriority = new Map<string, number>();
const hiddenProductSlugs = new Set(["wheel-trencher", "wheel-trenchers"]);
const dredgerSlugs = new Set(["dredger", "dredgers"]);

const DREDGER_MENU_PLACEHOLDER: ActiveProduct = {
  id: -400,
  title: "Dredger",
  thumbnail: "/favicon.png",
  thumbnailAltText: "Dredger",
  active: true,
};

PRODUCT_PRIORITY_GROUPS.forEach((group, priority) => {
  group.forEach((title) => {
    productPriority.set(titleToSlug(title), priority);
  });
});

function getProductPriority(title: string) {
  const slug = titleToSlug(title);
  return productPriority.get(slug) ?? Number.MAX_SAFE_INTEGER;
}

export function sortProductsByMenuPriority<T extends { title?: string; id?: number }>(
  products: T[] = []
) {
  return products
    .filter((product) => {
      return !hiddenProductSlugs.has(titleToSlug(product.title || ""));
    })
    .sort((first, second) => {
      const firstPriority = getProductPriority(first.title || "");
      const secondPriority = getProductPriority(second.title || "");

      if (firstPriority !== secondPriority) {
        return firstPriority - secondPriority;
      }

      return (first.id ?? 0) - (second.id ?? 0);
    });
}

export function getProductMenuItems(products: ActiveProduct[] = []) {
  const hasDredger = products.some((product) =>
    dredgerSlugs.has(titleToSlug(product.title || ""))
  );

  return sortProductsByMenuPriority(
    hasDredger ? products : [...products, DREDGER_MENU_PLACEHOLDER]
  );
}

export function getProductMenuHref(product: { id?: number; title?: string }) {
  if ((product.id ?? 0) < 0) {
    return "/products";
  }

  return `/products/${titleToSlug(product.title || "")}`;
}

export function getProductMenuLabel(product: { title?: string }) {
  const slug = titleToSlug(product.title || "");

  if (slug === "attachments") {
    return "Tractor Attachments";
  }

  return product.title || "-";
}
