"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "react-loading-skeleton/dist/skeleton.css";

import BrochureDownloadModal from "@/component/GetQuoteModal/BrochureDownloadModal";
import GetQuoteModal from "@/component/GetQuoteModal/GetQuoteModal";
import IndustryCard from "@/component/molecules/industryCard/IndustryCard";
import ProductCard from "@/component/molecules/productCard/ProductCard";
import { SCREENS } from "@/constants";
import { ICONS } from "@/constants/Images/images";
import useWindowSize from "@/hooks/useWindowSize";
import { titleToSlug } from "@/utils/slug";

import styles from "./industry.module.scss";

type IndustryTheme = {
  lead: string;
  applications: string[];
  outcomes: string[];
  selectionNotes: string[];
};

const fallbackImage = "/images/default-industry.jpg";

function getIndustryTheme(title: string, isIndiaLocale: boolean): IndustryTheme {
  const normalizedTitle = title.toLowerCase();
  const market = isIndiaLocale ? "Indian" : "international";
  const locationPhrase = isIndiaLocale ? "across India" : "across global sites";

  if (
    normalizedTitle.includes("ofc") ||
    normalizedTitle.includes("telecom")
  ) {
    return {
      lead: `Purpose-built machinery for OFC trenching, duct routes, and telecom utility corridors ${locationPhrase}.`,
      applications: [
        "OFC cable trenching",
        "Duct and pipeline routes",
        "Urban and rural utility corridors",
        "Roadside restoration work",
      ],
      outcomes: [
        "Cleaner trench alignment for long cable runs",
        "Reduced manual digging at telecom sites",
        "Better productivity in mixed soil conditions",
        "Model options for tractor-mounted and compact work",
      ],
      selectionNotes: [
        "Match trench depth and width to cable duct requirements.",
        "Choose tractor compatibility based on available horsepower.",
        "Use compact models where access roads or village routes are narrow.",
      ],
    };
  }

  if (normalizedTitle.includes("water")) {
    return {
      lead: `Rugged equipment for irrigation lines, drainage work, water bodies, and pipeline infrastructure on ${market} project sites.`,
      applications: [
        "Water pipeline trenching",
        "Irrigation and drainage routes",
        "Lake and canal maintenance",
        "Utility rehabilitation projects",
      ],
      outcomes: [
        "Faster trenching for long water lines",
        "Improved worksite control in wet or soft areas",
        "Cleaner operation for maintenance teams",
        "Equipment fit for rural and infrastructure contractors",
      ],
      selectionNotes: [
        "Confirm soil condition and expected trench depth before selection.",
        "Use aquatic equipment for weed, trash, and floating debris work.",
        "Plan machine access around bunds, banks, and soft ground.",
      ],
    };
  }

  if (normalizedTitle.includes("solar")) {
    return {
      lead: `Field-ready machinery for solar farms, cable routes, pile-area preparation, and utility support ${locationPhrase}.`,
      applications: [
        "Solar cable trenching",
        "Internal utility routes",
        "Panel field access work",
        "Site preparation support",
      ],
      outcomes: [
        "Consistent trench profiles for power cable runs",
        "Reduced dependency on manual excavation",
        "Better pace across large open sites",
        "Attachment choices for multi-stage project work",
      ],
      selectionNotes: [
        "Map cable routing before matching trench width and depth.",
        "Prioritize machines that suit open-field movement.",
        "Consider attachments for site handling beyond trenching.",
      ],
    };
  }

  if (normalizedTitle.includes("agriculture")) {
    return {
      lead: `Practical machinery for farm trenching, irrigation, drainage, land preparation, and tractor-based field work ${locationPhrase}.`,
      applications: [
        "Farm irrigation trenches",
        "Drainage channels",
        "Land preparation",
        "Tractor attachment work",
      ],
      outcomes: [
        "Lower manual effort for repetitive field jobs",
        "Better machine utilization with tractor compatibility",
        "Cleaner work for irrigation and drainage teams",
        "Durable equipment for varied soil conditions",
      ],
      selectionNotes: [
        "Match attachments to the tractors already available on site.",
        "Plan trenching depth around crop, water, and drainage needs.",
        "Choose simple serviceable models for repeated rural operation.",
      ],
    };
  }

  if (normalizedTitle.includes("construction")) {
    return {
      lead: `Heavy-duty utility machinery for construction sites, infrastructure corridors, and equipment handling requirements ${locationPhrase}.`,
      applications: [
        "Utility trenching",
        "Material handling",
        "Site preparation",
        "Pipeline and duct routes",
      ],
      outcomes: [
        "More controlled excavation for utility lines",
        "Flexible attachments for site support work",
        "Reduced downtime from rugged machine design",
        "Better productivity for contractors and project teams",
      ],
      selectionNotes: [
        "Review site access, soil, and utility drawings before deployment.",
        "Select attachments around the most frequent site tasks.",
        "Balance machine size with movement space and transport needs.",
      ],
    };
  }

  if (normalizedTitle.includes("defence")) {
    return {
      lead: `Reliable utility and field-support machinery for demanding terrain, quick deployment, and controlled infrastructure work.`,
      applications: [
        "Remote utility routes",
        "Field infrastructure work",
        "Rough-terrain trenching",
        "Equipment support operations",
      ],
      outcomes: [
        "Rugged build suited to difficult operating conditions",
        "Faster execution where manual work is slow",
        "Adaptable models for different terrain profiles",
        "Dependable support for secure project sites",
      ],
      selectionNotes: [
        "Prioritize durability, transportability, and field service access.",
        "Match machine footprint to terrain and deployment constraints.",
        "Review trenching or handling requirements before model selection.",
      ],
    };
  }

  if (normalizedTitle.includes("landscap")) {
    return {
      lead: `Specialized machinery for turf, sod, land preparation, and professional landscaping operations ${locationPhrase}.`,
      applications: [
        "Sod harvesting",
        "Sod sprigging",
        "Ground preparation",
        "Landscape maintenance support",
      ],
      outcomes: [
        "Neater output for professional landscape projects",
        "Reduced manual handling for turf teams",
        "More repeatable field productivity",
        "Equipment matched to organized site workflows",
      ],
      selectionNotes: [
        "Choose machines around turf type, soil condition, and field size.",
        "Plan transport and turning space before deployment.",
        "Use model guidance to match output expectations.",
      ],
    };
  }

  if (
    normalizedTitle.includes("environment") ||
    normalizedTitle.includes("sustain")
  ) {
    return {
      lead: `Machines for aquatic weed removal, floating trash collection, and cleaner environmental maintenance projects ${locationPhrase}.`,
      applications: [
        "Aquatic weed removal",
        "Floating trash collection",
        "Lake and canal cleaning",
        "Wetland maintenance support",
      ],
      outcomes: [
        "Cleaner water-body maintenance with mechanized collection",
        "Reduced manual exposure in difficult environments",
        "Better coverage for lakes, canals, and ponds",
        "Purpose-built equipment for environmental contractors",
      ],
      selectionNotes: [
        "Map water depth, access points, and debris type before selection.",
        "Choose equipment based on collection volume and travel area.",
        "Plan service access for long-duration maintenance programs.",
      ],
    };
  }

  return {
    lead: `Industry-ready machinery for demanding ${market} projects that need durable equipment, practical model guidance, and reliable field support.`,
    applications: [
      "Utility and infrastructure work",
      "Site preparation",
      "Material handling",
      "Field maintenance support",
    ],
    outcomes: [
      "Cleaner execution with purpose-built machines",
      "Reduced manual effort on repetitive site tasks",
      "Model options suited to varied terrain and access",
      "Support for brochures, specifications, and quote planning",
    ],
    selectionNotes: [
      "Start with site condition, required output, and available carrier power.",
      "Match the product line to depth, width, access, and operating environment.",
      "Use Autocracy support for model fit, brochure details, and pricing.",
    ],
  };
}

export default function IndustryClient({
  industryData,
  industries,
  industryId,
  basePath = "",
}: {
  industryData: IndustryDataType | null;
  industries: ActiveIndustry[];
  industryId: number;
  basePath?: string;
}) {
  const { width } = useWindowSize();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const title = industryData?.title || "Industry Solutions";
  const isIndiaLocale = basePath === "/en-in";
  const marketSuffix = isIndiaLocale ? " in India" : "";
  const theme = useMemo(
    () => getIndustryTheme(title, isIndiaLocale),
    [title, isIndiaLocale]
  );

  const products = industryData?.products || [];
  const heroImages = useMemo(() => {
    const bannerImages =
      industryData?.bannerImages
        ?.map((item) => ({
          imageUrl: item?.imageUrl || "",
          altText: item?.altText || title,
        }))
        .filter((item) => item.imageUrl) || [];

    if (bannerImages.length > 0) return bannerImages;
    if (industryData?.thumbnail) {
      return [
        {
          imageUrl: industryData.thumbnail,
          altText: industryData.thumbnailAltText || title,
        },
      ];
    }
    return [{ imageUrl: fallbackImage, altText: title }];
  }, [industryData, title]);

  const [industrySliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: width && width > SCREENS.MOBILE_PORTRAIT ? 4.25 : 2.15,
      spacing: width && width > SCREENS.MOBILE_PORTRAIT ? 18 : 12,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const [bannerSliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: heroImages.length > 1,
      slides: {
        perView: 1,
      },
    },
    [
      (slider) => {
        if (heroImages.length <= 1) return;

        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 3600);
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const filteredIndustries = useMemo(() => {
    if (!industries || !industryId) return industries;
    return industries.filter((industry) => industry.id !== Number(industryId));
  }, [industries, industryId]);

  const slidesOption = instanceRef.current?.options?.slides;
  const perViewValue =
    typeof slidesOption === "number"
      ? slidesOption
      : typeof slidesOption === "object" &&
          slidesOption !== null &&
          "perView" in slidesOption
        ? Number(slidesOption.perView || 0)
        : 0;
  const maxSlide = Math.max(
    0,
    (instanceRef.current?.track?.details?.slides.length || 0) - perViewValue
  );

  return (
    <section className={styles.industryHome}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Industry Solutions</p>
          <h2>{title}</h2>
          <p className={styles.heroLead}>
            {industryData?.description || theme.lead}
          </p>
          <p className={styles.heroSupport}>{theme.lead}</p>
          <div className={styles.heroActions}>
            <button
              className={styles.quoteButton}
              onClick={() => setShowQuoteModal(true)}
            >
              GET A QUOTE
            </button>
            <button
              className={styles.brochureButton}
              disabled={!industryData?.brochure}
              onClick={() => setShowBrochureModal(true)}
            >
              <Image
                src={ICONS.DOWNLOAD_ICON_WHITE}
                alt="Download brochure"
                width={18}
                height={18}
              />
              BROCHURE
            </button>
          </div>
        </div>

        <div className={styles.heroMedia}>
          {heroImages.length > 1 ? (
            <div
              ref={bannerSliderRef}
              className={`keen-slider ${styles.bannerSlider}`}
            >
              {heroImages.map((item, index) => (
                <div
                  key={`${item.imageUrl}-${index}`}
                  className={`keen-slider__slide ${styles.bannerSlide}`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.altText}
                    width={920}
                    height={560}
                    priority={index === 0}
                    className={styles.bannerImage}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Image
              src={heroImages[0].imageUrl}
              alt={heroImages[0].altText}
              width={920}
              height={560}
              priority
              className={styles.staticHeroImage}
            />
          )}
        </div>
      </section>

      <section className={styles.metricsBand} aria-label={`${title} overview`}>
        <div>
          <span>{products.length || "Custom"}</span>
          <p>Recommended product lines</p>
        </div>
        <div>
          <span>Site-ready</span>
          <p>Solutions for soil, access, output, and terrain needs</p>
        </div>
        <div>
          <span>End-to-end</span>
          <p>Brochure guidance, model selection, and quote support</p>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Application Fit</p>
          <h2>{title} Equipment{marketSuffix}</h2>
          <p>
            Autocracy Machinery supports teams with practical equipment choices
            for real site conditions, from trench profiles and carrier power to
            access routes, debris type, and required daily output.
          </p>
        </div>

        <div className={styles.applicationGrid}>
          {theme.applications.map((application) => (
            <article key={application} className={styles.applicationCard}>
              <span />
              <h3>{application}</h3>
              <p>
                Designed to help teams complete this work with cleaner
                execution, better control, and reduced manual dependency.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.splitSection}>
        <div className={styles.darkPanel}>
          <p className={styles.eyebrow}>Why It Works</p>
          <h2>Built around project-site realities</h2>
          <div className={styles.outcomeList}>
            {theme.outcomes.map((outcome) => (
              <p key={outcome}>{outcome}</p>
            ))}
          </div>
        </div>
        <div className={styles.selectionPanel}>
          <p className={styles.eyebrow}>Selection Notes</p>
          <h2>How to choose the right machine</h2>
          <ol>
            {theme.selectionNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ol>
        </div>
      </section>

      <section id="industry-products" className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <div>
            <p className={styles.eyebrow}>Recommended Products</p>
            <h2>Machines for {title}</h2>
          </div>
          <p>
            Explore product families matched to this industry and continue into
            model pages for specifications, media, brochures, and quote actions.
          </p>
        </div>

        <div className={styles.productHolder}>
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`${basePath}/industries/${titleToSlug(title)}/${titleToSlug(product?.title ?? "")}`}
              >
                <ProductCard
                  title={product.title}
                  imageSrc={product.thumbnail}
                  altText={product.thumbnailAltText || product.title}
                  isProductPage
                />
              </Link>
            ))
          ) : (
            <div className={styles.industryEmptyState}>
              <p>
                Product recommendations for this industry are being updated.
                Contact Autocracy Machinery for the current model fit.
              </p>
              <button
                className={styles.quoteButton}
                onClick={() => setShowQuoteModal(true)}
              >
                GET A QUOTE
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div>
          <p className={styles.eyebrow}>Project Support</p>
          <h2>Need help matching a machine to your {title.toLowerCase()} site?</h2>
        </div>
        <div className={styles.ctaActions}>
          <button
            className={styles.quoteButton}
            onClick={() => setShowQuoteModal(true)}
          >
            GET A QUOTE
          </button>
          <button
            className={styles.brochureButton}
            disabled={!industryData?.brochure}
            onClick={() => setShowBrochureModal(true)}
          >
            <Image
              src={ICONS.DOWNLOAD_ICON_WHITE}
              alt="Download brochure"
              width={18}
              height={18}
            />
            BROCHURE
          </button>
        </div>
      </section>

      <section className={styles.sliderWrapper}>
        <div className={styles.carouselHeader}>
          <div>
            <p className={styles.eyebrow}>Explore More</p>
            <h2 className={styles.caraouselHeading}>More Industries</h2>
          </div>
          <div className={styles.navButtons}>
            <button
              className={`${styles.arrowButton} ${
                currentSlide === 0 ? styles.disabled : ""
              }`}
              onClick={() => instanceRef.current?.prev()}
              disabled={currentSlide === 0}
              aria-label="Previous industries"
            >
              <Image
                src={ICONS.CAROUSEL_ARROW}
                alt=""
                width={15}
                height={15}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>
            <button
              className={`${styles.arrowButton} ${
                currentSlide >= maxSlide ? styles.disabled : ""
              }`}
              onClick={() => instanceRef.current?.next()}
              disabled={currentSlide >= maxSlide}
              aria-label="Next industries"
            >
              <Image src={ICONS.CAROUSEL_ARROW} alt="" width={15} height={15} />
            </button>
          </div>
        </div>

        {filteredIndustries && filteredIndustries.length > 0 && (
          <div
            ref={industrySliderRef}
            className={`${styles.industryCarousel} keen-slider`}
          >
            {filteredIndustries.map((industry, index) => (
              <IndustryCard
                key={industry?.id}
                title={industry?.title}
                imageSrc={industry?.thumbnail}
                id={industry?.id}
                isIndustryPage
                isLastCard={index === filteredIndustries.length - 1}
                altText={industry?.thumbnailAltText}
                basePath={basePath}
              />
            ))}
          </div>
        )}
      </section>

      {showBrochureModal && (
        <BrochureDownloadModal
          industry={industryData?.title}
          setShowModal={setShowBrochureModal}
          downloadUrl={industryData?.brochure || ""}
        />
      )}
      {showQuoteModal && (
        <GetQuoteModal
          showModal={showQuoteModal}
          setShowModal={setShowQuoteModal}
        />
      )}
    </section>
  );
}
