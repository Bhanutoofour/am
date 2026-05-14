# Autocracy Machinery Image Resolution Inventory

This is the designer handoff for website image replacement. The sizes below are based on the current Next.js components and CSS, not estimated screenshots.

## General Export Rules

- Use JPG/WebP for real photographs and PNG/WebP with transparent background for isolated machine cutouts.
- Keep the machine or main subject centered unless the notes say `cover`. Many site containers crop with `object-fit: cover`.
- For `contain` image areas, leave clean breathing space around the full machine so it does not touch the edges.
- Upload CMS images in the matching admin field. Static recognition and certificate files are defined in `constants/Images/images.ts`.
- Do not add text into the image unless the section specifically needs a media/news/logo graphic.

## CMS Upload Slots

| Image slot | Where it appears | CMS field / upload folder | Current display behavior | Designer export size |
| --- | --- | --- | --- | --- |
| Home hero slider image | Homepage top carousel | `hero` collection, `image`, folder `hero` | Full-width banner, 100% width, fixed 581px desktop height, `object-fit: cover` | Minimum `1920 x 581`; preferred `2400 x 726`; aspect around `3.3:1` |
| Industry thumbnail | Homepage `Choose Your Industry`, `/industries`, related industry cards | `industries.thumbnail`, folder `industries/thumbnails` | Card image, `object-fit: cover`; desktop card height 320px, mobile 200px | Preferred `1200 x 1000`; minimum `800 x 800`; keep subject center-safe |
| Industry page banner | `/industries/[industry]` hero slider | `industries.bannerImages[].imageUrl`, folder `industries/banners` | Wide banner, max 1280px by 440px, `object-fit: cover` | Minimum `1280 x 440`; preferred `2560 x 880`; aspect `2.91:1` |
| Product category thumbnail | Product cards on homepage, `/products`, industry product lists, mega menus | `products.thumbnail`, folder `products/thumbnails` | Mostly `object-fit: contain`; desktop card image area around 245px by 260px | Preferred `1120 x 720`; minimum `560 x 360`; transparent/white background machine cutout |
| Product general image | Product detail intro fallback and some model sections | `products.generalImage`, folder `products/general` | Contained product image, no crop | Preferred `1120 x 720` or `1500 x 900`; keep full machine visible |
| Product SEO/social image | Google/social preview image | `products.seoSocialImage`, folder `products/social` | Metadata only, not a visible page section | `1200 x 630` |
| Model thumbnail | Product model cards, model carousels, mobile model cards | `models.thumbnail`, folder `models/thumbnails` | Desktop model card image is 300px by 118px visual area, `object-fit: contain`; mobile uses wider 500px by 250px source | Preferred `1000 x 500`; minimum `500 x 250`; full machine centered |
| Model cover image | `/product/[model]` and industry model detail hero/media slider | `models.coverImage`, folder `models/covers` | Main model media; desktop often wide 1500px by 768px, also 16:10 in modern layout, `object-fit: cover` | Preferred `3000 x 1536`; minimum `1500 x 768`; keep subject center-safe |
| Model detail / gallery image | Model media carousel and industry application blocks | `models.modelDescription[].image`, folder `models/details` | Used as extra images after cover; can be 16:9/16:10 depending section | Hero/gallery: `3000 x 1536`; application block: `1536 x 864` |
| Model brochure | Brochure buttons/downloads | `models.brochure`, folder `models/brochures` | File download, not a photo slot | PDF, not image |
| Industry brochure | Industry brochure downloads | `industries.brochure`, folder `industries/brochures` | File download, not a photo slot | PDF, not image |
| Blog banner | `/blogs`, `/blog/[slug]`, social preview | `blogs.banner`, folder `blogs/banners` | Blog cards use 16:9, blog detail max height 342px, `object-fit: cover` | Preferred `1600 x 900`; minimum `1200 x 675` |
| Blog SEO/social image | Blog OpenGraph/Twitter preview | `blogs.seoSocialImage` | Metadata only | `1200 x 630` |

## Static / Placeholder Image Slots

| Image slot | Where it appears | Current source | Current display behavior | Designer export size |
| --- | --- | --- | --- | --- |
| Home FAQ CTA image | Homepage FAQ + lead form section | `INDUSTRY.SAMPLE_INDUSTRY` -> `assets/hero_section/multi-chain-trencher.png` | Left container min-height 448px desktop, 352px mobile, `object-fit: contain` | Preferred `1520 x 1040`; minimum `760 x 520`; transparent/white background |
| Recognition awards carousel photos | Homepage/About recognition section | `IMAGES.RECOGNITION.AWARDS.AWARD_07/08` in `constants/Images/images.ts` | Large carousel image 704px by 344px desktop, 353px by 178px mobile, `object-fit: cover` | Preferred `1408 x 688`; minimum `704 x 344`; aspect `2.05:1` |
| Award logos | Recognition award cards | `data/recognitionsData.ts` -> `assets/recognitions/Awards/*.svg` | Logo card image around 118px by 118px, `object-fit: contain` | SVG preferred; PNG fallback `300 x 300` |
| Certificate logos | `Our Certifications` section | `data/recognitionsData.ts` -> `assets/recognitions/certificates/*.svg` | Rendered around 150px by 150px, `object-fit: contain` | SVG preferred; PNG fallback `300 x 300` |
| Media/news logos | Recognition media cards | `data/recognitionsData.ts` -> `assets/recognitions/media/*.svg` | Small logo/card image, contained | SVG preferred; PNG fallback `300 x 300` |
| Client logos | Testimonials/client logo strip | `constants/Images/images.ts` -> `assets/recognitions/clients/*.svg` | Contained logo strip, max height about 70px | SVG preferred; PNG fallback `480 x 140` |
| Header logo | Header/nav | `IMAGES.LOGO` -> `assets/icons/logo.svg` | Around 162px wide by 37px high | SVG preferred; current size is fine |
| Footer logo | Footer | `IMAGES.LOGO` | Around 170px by 40px | SVG preferred; current size is fine |

## Page-Specific Placement Notes

| Page / section | Image source | File reference | Notes for designer |
| --- | --- | --- | --- |
| `/` homepage hero | CMS hero `image` | `component/sections/caraousel/Caraousel.tsx`, `component/sections/caraousel/styles.module.scss` | Banner crops to fill. Avoid placing important product details at the far edges. |
| `/` Choose Your Industry | CMS industry `thumbnail` | `component/sections/Industries/Industries.tsx`, `component/molecules/industryCard/IndustryCard.tsx` | Cards crop on desktop/mobile. Subject should sit in the center 70% of the image. |
| `/` Our Products Lineups | CMS product `thumbnail` | `component/sections/products/Products.tsx`, `component/molecules/productCard/ProductCard.tsx` | Use isolated product cutouts. White/transparent background works best. |
| `/` FAQ CTA | Static placeholder machine image | `app/(main)/HomeFaqCta.tsx` | Replace `INDUSTRY.SAMPLE_INDUSTRY` image if the designer wants a stronger CTA machine photo. |
| `/products` listing | CMS product `thumbnail` | `app/(main)/products/ProductsClient.tsx`, `component/molecules/productCard/ProductCard.tsx` | Same asset as product cards; export with enough white space for all machines. |
| `/products/[slug]` product page top image | CMS product `thumbnail` or `generalImage` | `app/(main)/products/[slug]/ProductClient.tsx` | Display source is `560 x 360`, but provide `1120 x 720` for retina/zoom. |
| `/product/[model]` model page main media | CMS model `coverImage` plus detail images | `app/(main)/product/[slug]/ProductModalClient.tsx`, `app/(main)/product/[slug]/modalStyles.module.scss` | This is the most important model image. Wide field/action photo works better than a tight crop. |
| `/industries/[slug]` industry hero | CMS industry `bannerImages` | `app/(main)/industries/[slug]/IndustryClient.tsx` | Use a clean wide banner. Product/site context should remain visible after cropping. |
| `/industries/[slug]/[productSlug]` industry product page | CMS product/model images | `app/(main)/industries/[slug]/[productSlug]` routes | Same product/model image rules apply. |
| `/blog` and `/blog/[slug]` | CMS blog `banner` | `app/(main)/blog/BlogsClient.tsx`, `app/(main)/blog/[slug]` | Export 16:9 feature images; avoid text-heavy graphics. |
| `/brochure` cards | Product/model brochure cover or thumbnails | `component/molecules/brochureCard/BrochureCard.tsx` | If creating brochure cover thumbnails, use `200 x 282` A-series style ratio. |
| `/hire-rental-industry-equipment` cards | Rental equipment `thumbnail` | `app/(main)/hire-rental-industry-equipment/HireEquipmentClient.tsx` | Rendered around `496 x 335` desktop; export `992 x 670`. |
| `/about-us` imagery | Static/about page images | `app/(main)/about-us/AboutUsClient.tsx`, `app/(main)/about-us/aboutStyles.module.scss` | Mixed cover images. Use high-quality 16:9 or square images depending exact block. |
| `/careers` imagery | Static careers images | `app/(main)/careers/CareersClient.tsx`, `app/(main)/careers/careersStyles.module.scss` | Mixed decorative photos. Export at least 2x the declared component sizes. |

## Quick Designer Checklist

1. Hero/banner images: deliver `2400 x 726` for homepage and `2560 x 880` for industry banners.
2. Product/model machine cutouts: deliver `1120 x 720` for product cards and `1000 x 500` for model cards.
3. Model detail hero/gallery photos: deliver `3000 x 1536`.
4. Industry thumbnails: deliver `1200 x 1000` with subject centered.
5. Blog images: deliver `1600 x 900` and social image `1200 x 630`.
6. Recognition/certificate/client logos: SVG preferred; PNG fallback square or logo-safe at 2x display size.

