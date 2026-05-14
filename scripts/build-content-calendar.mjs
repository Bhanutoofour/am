import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const outputDir = path.resolve("outputs", "content-calendar");
const outputFile = path.join(outputDir, "autocracy-content-calendar.xlsx");

const homeSections = [
  "Landing",
  "Home Page - Landing",
  "Home Page - Industries",
  "Home Page - Description",
  "Home Page - Product",
  "Home Page - Awards",
  "Home Page - Certifications",
  "Home Page - Media",
  "Home Page - Customer Reviews",
  "Home Page - FAQ's",
  "Home Page - Get a Quote",
  "Home Page - Footer Page",
  "Brochure Page",
  "About Us",
  "Career",
  "Privacy Policy",
  "Terms & Conditions",
  "Contact us Page",
  "Find a Dealer Page",
  "Hire a Rental",
  "Product All Pages",
  "Resources - Blogs",
  "Resources - Videos",
];

const staticPages = [
  ["Products", "/products", "All Products Page"],
  ["Industries", "/industries", "All Industries Page"],
  ["Blog", "/blog", "Blog Listing Page"],
  ["Videos", "/videos", "Videos Page"],
  ["Brochure", "/brochure", "Brochure Page"],
  ["About Us", "/about-us", "About Us Page"],
  ["Careers", "/careers", "Career Page"],
  ["Contact Us", "/contact-us", "Contact us Page"],
  ["Find a Dealer", "/find-a-dealer", "Find a Dealer Page"],
  ["Hire Rental", "/hire-rental-industry-equipment", "Hire a Rental Page"],
  ["FAQs", "/faqs", "FAQ's Page"],
  ["Privacy Policy", "/privacy-policy", "Privacy Policy Page"],
  ["Terms & Conditions", "/terms-and-conditions", "Terms & Conditions Page"],
  ["Sitemap", "/sitemap", "Sitemap Page"],
];

const productRows = [
  ["Product", "/products", "All Products"],
  ["Trenchers", "/products/trenchers", "Trencher Product Page"],
  ["Trenchers - Model", "/products/trenchers/rudra-100", "Rudra 100"],
  ["Trenchers - Model", "/products/trenchers/rudra-100-xt", "Rudra 100 XT"],
  ["Trenchers - Model", "/products/trenchers/rudra-100-t", "Rudra 100 T"],
  ["Trenchers - Model", "/products/trenchers/rudra-150-xt", "Rudra 150 XT"],
  ["Trenchers - Model", "/products/trenchers/gaja-100", "Gaja 100"],
  ["Trenchers - Model", "/products/trenchers/gaja-100-xt", "Gaja 100 XT"],
  ["Trenchers - Model", "/products/trenchers/gaja-200-xt", "Gaja 200 XT"],
  ["Trenchers - Model", "/products/trenchers/gaja-300-xt", "Gaja 300 XT"],
  ["Trenchers - Model", "/products/trenchers/gaja-300-xc", "Gaja 300 XC"],
  ["Trenchers - Model", "/products/trenchers/mayura-to", "Mayura TO"],
  ["Trenchers - Model", "/products/trenchers/mayura-tw", "Mayura TW"],
  ["Trenchers - Model", "/products/trenchers/mayura-tl", "Mayura TL"],
  ["Trenchers - Model", "/products/trenchers/mayura-t", "Mayura T"],
  ["Trenchers - Model", "/products/trenchers/wheel-trencher-chakra-rs100", "Wheel Trencher Chakra RS100"],
  ["Walk Behind Trencher", "/products/walk-behind-trencher", "Walk Behind Trencher Product Page"],
  ["Walk Behind Trenchers - Model", "/products/walk-behind-trencher/dhruva-100", "Dhruva 100"],
  ["Walk Behind Trenchers - Model", "/products/walk-behind-trencher/dhruva-hyt", "Dhruva HYT"],
  ["Post Hole Digger", "/products/post-hole-digger", "Post Hole Digger Product Page"],
  ["Post Hole Digger - Model", "/products/post-hole-digger/vendan-50", "Vendan 50"],
  ["Post Hole Digger - Model", "/products/post-hole-digger/vendan-100", "Vendan 100"],
  ["Post Hole Digger - Model", "/products/post-hole-digger/vendan-150", "Vendan 150"],
  ["Post Hole Digger - Model", "/products/post-hole-digger/earth-augers", "Earth Augers"],
  ["Post Hole Digger - Model", "/products/post-hole-digger/mayura-p", "Mayura P"],
  ["Aquatic Weed Harvester", "/products/aquatic-weed-harvester", "Aquatic Weed Harvester Product Page"],
  ["Aquatic Weed Harvester - Model", "/products/aquatic-weed-harvester/rudra-aquamax-100", "Rudra Aquamax 100"],
  ["Aquatic Weed Harvester - Model", "/products/aquatic-weed-harvester/rudra-aquamax-100x", "Rudra Aquamax 100X"],
  ["Aquatic Weed Harvester - Model", "/products/aquatic-weed-harvester/rudra-aquamax-150x", "Rudra Aquamax 150X"],
  ["Aquatic Weed Harvester - Model", "/products/aquatic-weed-harvester/rudra-aquamax-200x", "Rudra Aquamax 200X"],
  ["Amphibious Excavator", "/products/amphibious-excavator", "Amphibious Excavator Product Page"],
  ["Amphibious Excavator - Model", "/products/amphibious-excavator/rudra-amphimax-100ex", "Rudra Amphimax 100EX"],
  ["Amphibious Excavator - Model", "/products/amphibious-excavator/rudra-amphimax-150ex", "Rudra Amphimax 150EX"],
  ["Amphibious Excavator - Model", "/products/amphibious-excavator/rudra-amphimax-200ex", "Rudra Amphimax 200EX"],
  ["Amphibious Excavator - Model", "/products/amphibious-excavator/rudra-amphimax-250ex", "Rudra Amphimax 250EX"],
  ["Amphibious Excavator - Model", "/products/amphibious-excavator/rudra-amphimax-300ex", "Rudra Amphimax 300EX"],
  ["Amphibious Excavator - Model", "/products/amphibious-excavator/undercarriage-rudra-amphimax-x", "Undercarriage Rudra Amphimax X"],
  ["Amphibious Work Boats", "/products/amphibious-work-boats", "Amphibious Work Boats Product Page"],
  ["Amphibious Work Boats - Model", "/products/amphibious-work-boats/rudra-aqua-boat", "Rudra Aqua Boat"],
  ["Barges / Floating Pontoon", "/products/barges", "Barges / Floating Pontoon Product Page"],
  ["Barges / Floating Pontoon - Model", "/products/barges/rudra-amphipod-px100", "Rudra Amphipod PX100"],
  ["Landscaping Equipment", "/products/landscaping-equipment", "Landscaping Equipment Product Page"],
  ["Landscaping Equipment - Model", "/products/landscaping-equipment/sod-harvester", "Sod Harvester"],
  ["Landscaping Equipment - Model", "/products/landscaping-equipment/sod-sprigger", "Sod Sprigger"],
  ["Tractor Attachments", "/products/tractor-attachments", "Tractor Attachments Product Page"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/forklift-5t", "Forklift 5T"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/forklift-3t", "Forklift 3T"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/dozer-single-blade", "Dozer Single Blade"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/dozer-2-blade", "Dozer 2 Blade"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/heavy-duty-dozer-18t", "Heavy Duty Dozer 18T"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/back-hoe", "Back Hoe"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/decoiler", "Decoiler"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/breaker", "Breaker"],
  ["Tractor Attachments - Model", "/products/tractor-attachments/front-loader-bucket", "Front Loader Bucket"],
  ["Stone Picker", "/products/stone-picker", "Stone Picker"],
  ["Sand Filler", "/products/sand-filler", "Sand Filler Product Page"],
  ["Sand Filler - Model", "/products/sand-filler/sand-filler", "Sand Filler"],
  ["Pole Stacker", "/products/pole-stacker", "Pole Stacker Product Page"],
  ["Pole Stacker - Model", "/products/pole-stacker/pole-stacker-100x", "Pole Stacker 100X"],
  ["Pole Stacker - Model", "/products/pole-stacker/pole-stacker-100xc", "Pole Stacker 100XC"],
];

const industryRows = [
  ["Industry", "/industries", "All Industry Pages"],
  ["OFC Telecommunications", "/industries/ofc-telecommunications", "Industry Landing"],
  ["OFC - Trenchers", "/industries/ofc-telecommunications/trenchers", "Trencher Industry Product Page"],
  ["OFC - Trenchers Model", "/industries/ofc-telecommunications/trenchers/rudra-100", "Rudra 100"],
  ["OFC - Trenchers Model", "/industries/ofc-telecommunications/trenchers/rudra-150", "Rudra 150"],
  ["OFC - Trenchers Model", "/industries/ofc-telecommunications/trenchers/gaja-100-xt", "Gaja 100 XT"],
  ["OFC - Trenchers Model", "/industries/ofc-telecommunications/trenchers/wheel-trencher-chakra-rs100", "Wheel Trencher Chakra RS100"],
  ["OFC - Trenchers Model", "/industries/ofc-telecommunications/trenchers/mayura-to", "Mayura TO"],
  ["OFC - Post Hole Digger", "/industries/ofc-telecommunications/post-hole-digger", "Post Hole Digger Industry Product Page"],
  ["OFC - Post Hole Digger Model", "/industries/ofc-telecommunications/post-hole-digger/mayura-p", "Mayura P"],
  ["OFC - Attachments", "/industries/ofc-telecommunications/attachments", "Attachments Industry Product Page"],
  ["OFC - Attachments Model", "/industries/ofc-telecommunications/attachments/forklift-5t", "Forklift 5T"],
  ["OFC - Attachments Model", "/industries/ofc-telecommunications/attachments/forklift-3t", "Forklift 3T"],
  ["Water Management", "/industries/water-management", "Industry Landing"],
  ["Water Management - Trenchers", "/industries/water-management/trenchers", "Trencher Industry Product Page"],
  ["Water Management - Trenchers Model", "/industries/water-management/trenchers/rudra-100", "Rudra 100"],
  ["Water Management - Trenchers Model", "/industries/water-management/trenchers/rudra-100-xt", "Rudra 100 XT"],
  ["Water Management - Trenchers Model", "/industries/water-management/trenchers/gaja-100-xt", "Gaja 100 XT"],
  ["Water Management - Trenchers Model", "/industries/water-management/trenchers/gaja-200-xt", "Gaja 200 XT"],
  ["Water Management - Trenchers Model", "/industries/water-management/trenchers/mayura-tw", "Mayura TW"],
  ["Water Management - Trenchers Model", "/industries/water-management/trenchers/gaja-200-xc", "Gaja 200 XC"],
  ["Water Management - Walk Behind Trenchers", "/industries/water-management/walk-behind-trencher/dhruva-hyt", "Dhruva HYT"],
  ["Water Management - Walk Behind Trenchers", "/industries/water-management/walk-behind-trencher/rudra-prime-mini", "Rudra Prime Mini"],
  ["Solar", "/industries/solar", "Industry Landing"],
  ["Environmental Sustainability", "/industries/environmental-sustainability", "Industry Landing"],
  ["Landscaping", "/industries/landscaping", "Industry Landing"],
  ["Defence", "/industries/defence", "Industry Landing"],
  ["Construction", "/industries/construction", "Industry Landing"],
  ["Agriculture", "/industries/agriculture", "Industry Landing"],
];

function withPrefix(route, prefix) {
  if (!prefix) return route;
  if (route === "/") return prefix;
  return `${prefix}${route}`;
}

function marketRows(country, prefix) {
  const rows = [];
  homeSections.forEach((section) => {
    rows.push([country, "Home Page", withPrefix("/", prefix), section]);
  });
  staticPages.forEach(([page, route, section]) => {
    rows.push([country, page, withPrefix(route, prefix), section]);
  });
  productRows.forEach(([page, route, section]) => {
    rows.push([country, page, withPrefix(route, prefix), section]);
  });
  industryRows.forEach(([page, route, section]) => {
    rows.push([country, page, withPrefix(route, prefix), section]);
  });
  return rows;
}

const rows = [
  ["Country", "Page", "Page Route", "Section"],
  ...marketRows("India (/en-in)", "/en-in"),
  ...marketRows("Global (/)", ""),
];

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function columnName(index) {
  let name = "";
  let n = index + 1;
  while (n > 0) {
    const mod = (n - 1) % 26;
    name = String.fromCharCode(65 + mod) + name;
    n = Math.floor((n - mod) / 26);
  }
  return name;
}

function cellXml(value, rowIndex, colIndex) {
  const ref = `${columnName(colIndex)}${rowIndex + 1}`;
  const style = rowIndex === 0 ? 1 : 0;
  return `<c r="${ref}" t="inlineStr" s="${style}"><is><t>${escapeXml(value)}</t></is></c>`;
}

function sheetXml() {
  const body = rows
    .map((row, r) => `<row r="${r + 1}">${row.map((cell, c) => cellXml(cell, r, c)).join("")}</row>`)
    .join("");
  const lastRow = rows.length;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:D${lastRow}"/>
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <cols><col min="1" max="1" width="20" customWidth="1"/><col min="2" max="2" width="36" customWidth="1"/><col min="3" max="3" width="58" customWidth="1"/><col min="4" max="4" width="42" customWidth="1"/></cols>
  <sheetData>${body}</sheetData>
  <autoFilter ref="A1:D${lastRow}"/>
</worksheet>`;
}

const files = {
  "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
  "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`,
  "docProps/app.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Autocracy Content Calendar</Application></Properties>`,
  "docProps/core.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Autocracy Content Calendar</dc:title><dc:creator>Autocracy Machinery</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">2026-05-13T00:00:00Z</dcterms:created></cp:coreProperties>`,
  "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Content Calendar" sheetId="1" r:id="rId1"/></sheets></workbook>`,
  "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF01060A"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
  "xl/worksheets/sheet1.xml": sheetXml(),
};

const crcTable = new Uint32Array(256).map((_, i) => {
  let c = i;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function u16(value) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(value);
  return b;
}

function u32(value) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(value >>> 0);
  return b;
}

function createZip(fileMap) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const { dosTime, dosDate } = dosDateTime();

  for (const [name, content] of Object.entries(fileMap)) {
    const nameBuffer = Buffer.from(name);
    const raw = Buffer.from(content, "utf8");
    const compressed = zlib.deflateRawSync(raw);
    const crc = crc32(raw);
    const localHeader = Buffer.concat([
      u32(0x04034b50), u16(20), u16(0), u16(8), u16(dosTime), u16(dosDate),
      u32(crc), u32(compressed.length), u32(raw.length), u16(nameBuffer.length), u16(0), nameBuffer,
    ]);
    localParts.push(localHeader, compressed);
    centralParts.push(Buffer.concat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(8), u16(dosTime), u16(dosDate),
      u32(crc), u32(compressed.length), u32(raw.length), u16(nameBuffer.length), u16(0), u16(0),
      u16(0), u16(0), u32(0), u32(offset), nameBuffer,
    ]));
    offset += localHeader.length + compressed.length;
  }

  const centralDir = Buffer.concat(centralParts);
  const end = Buffer.concat([
    u32(0x06054b50), u16(0), u16(0), u16(centralParts.length), u16(centralParts.length),
    u32(centralDir.length), u32(offset), u16(0),
  ]);
  return Buffer.concat([...localParts, centralDir, end]);
}

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(outputFile, createZip(files));
console.log(`Created ${outputFile}`);
console.log(`Rows: ${rows.length - 1}`);
