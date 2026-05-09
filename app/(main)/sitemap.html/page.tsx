import Link from "next/link";
import { Metadata } from "next";
import { getActiveBlogs } from "@/actions/blogAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import { titleToSlug } from "@/utils/slug";
import styles from "./sitemapHtml.module.scss";

export const metadata: Metadata = {
  title: "Sitemap | Autocracy Machinery",
  description:
    "Browse Autocracy Machinery website pages, products, industries, blogs, videos, brochures, and support links.",
  alternates: {
    canonical: "https://autocracymachinery.com/sitemap.html",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const mainPages = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Brochure", href: "/brochure" },
  { label: "Videos", href: "/videos" },
  { label: "Blog", href: "/blog" },
];

const companyPages = [
  { label: "About us", href: "/about-us" },
  { label: "Careers", href: "/careers" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact us", href: "/contact-us" },
  { label: "Find a dealer", href: "/find-a-dealer" },
  { label: "Hire on rent", href: "/hire-rental-industry-equipment" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

function SitemapGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <section className={styles.group}>
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function SitemapHtmlPage() {
  const [industries, products, blogs] = await Promise.all([
    getActiveIndustries(),
    getActiveProducts(),
    getActiveBlogs(),
  ]);

  const industryLinks = industries.map((industry) => ({
    label: industry.title ?? "Industry",
    href: `/industries/${titleToSlug(industry.title ?? "")}`,
  }));

  const productLinks = products.map((product) => ({
    label: product.title ?? "Product",
    href: `/products/${titleToSlug(product.title ?? "")}`,
  }));

  const blogLinks = blogs.map((blog) => ({
    label: blog.title,
    href: `/blog/${blog.slug}`,
  }));

  return (
    <main className={styles.sitemapPage}>
      <div className={styles.header}>
        <p>Sitemap</p>
        <h1>Autocracy Machinery Sitemap</h1>
      </div>
      <div className={styles.grid}>
        <SitemapGroup title="Main Pages" links={mainPages} />
        <SitemapGroup title="Company" links={companyPages} />
        <SitemapGroup title="Industries" links={industryLinks} />
        <SitemapGroup title="Products" links={productLinks} />
        <SitemapGroup title="Blogs" links={blogLinks} />
        <SitemapGroup
          title="Search Engine Sitemap"
          links={[{ label: "XML Sitemap", href: "/sitemap.xml" }]}
        />
      </div>
    </main>
  );
}
