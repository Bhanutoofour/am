import Link from "next/link";

const productCategories = [
  "trencher machines",
  "chain trenchers",
  "rock wheel trenchers",
  "solar EPC equipment",
  "aquatic weed harvesters",
  "floating trash collectors",
  "tractor attachments",
  "forklifts",
  "sod harvesters",
  "utility equipment",
];

const industryApplications = [
  "telecom OFC cable laying",
  "solar cable trenching",
  "irrigation pipelines",
  "water management",
  "agriculture",
  "landscaping",
  "construction utilities",
  "defence infrastructure",
  "lake and canal cleaning",
];

export default function HomeRawContent() {
  return (
    <section className="raw-html-summary" aria-label="Autocracy Machinery summary">
      <h2>Autocracy Machinery products and applications</h2>
      <p>
        Autocracy Machinery Private Limited is a Hyderabad, India based
        manufacturer of trenchers, attachments, water body cleaning machines,
        solar EPC equipment, agriculture machinery, and utility equipment for
        infrastructure and field projects.
      </p>
      <h3>Product categories</h3>
      <ul>
        {productCategories.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3>Industry applications</h3>
      <ul>
        {industryApplications.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        Business address: Plot No.72/A, I.D.A. Phase-1, Lane-3, B N Reddy
        Nagar, Cherlapalli, Hyderabad, Telangana - 500051, India. Phone: +91
        87904 73345.
      </p>
      <nav aria-label="Important Autocracy Machinery pages">
        <Link href="/products">Products</Link>
        <Link href="/industries">Industries</Link>
        <Link href="/brochure">Brochures</Link>
        <Link href="/contact-us">Contact</Link>
        <Link href="/llms.txt">llms.txt</Link>
      </nav>
    </section>
  );
}
