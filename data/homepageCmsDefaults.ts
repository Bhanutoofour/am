import { INDUSTRY } from "@/constants/Images/images";
import {
  AwardsData,
  BuildForIndiaContent,
  CertificateData,
  MediaData,
} from "@/data/recognitionsData";
import { clients, testimonials } from "@/data/customerTestimonials";
import type { HomepageCmsContent } from "@/types/homepage";

export const defaultHomeFaqs = [
  {
    question: "What does Autocracy Machinery manufacture?",
    answer:
      "Autocracy Machinery manufactures trencher machines, tractor attachments, solar EPC equipment, aquatic weed harvesters, pontoons, forklifts, and utility machinery for infrastructure and field projects.",
  },
  {
    question: "Which Autocracy Machinery equipment is used for OFC cable laying?",
    answer:
      "Chain trenchers, rock wheel trenchers, and compact trenching machines are used for OFC cable laying, telecom ducts, underground utilities, irrigation pipelines, and solar cable routes.",
  },
  {
    question: "Can Autocracy Machinery help select the right model?",
    answer:
      "Yes. Share your application, soil type, trench width, trench depth, route length, tractor or carrier details, and productivity target for model guidance.",
  },
  {
    question: "Where can I compare Autocracy Machinery products by industry?",
    answer:
      "Use the industries page to compare machines for telecom, water management, solar, agriculture, construction, and more.",
  },
  {
    question: "Do you offer machines for water management?",
    answer:
      "Yes. Autocracy offers aquatic weed harvesters, floating trash collectors, pontoons, lake cleaning machines, and related water body cleaning equipment.",
  },
  {
    question: "Can I request brochures before buying?",
    answer:
      "Yes. Product and model brochures can be requested from the brochure page or relevant product pages.",
  },
  {
    question: "Are machines available for agriculture applications?",
    answer:
      "Yes. Autocracy machines support farm trenching, drip irrigation pipelines, drainage work, landscaping, sod harvesting, sprigging, and other agriculture workflows.",
  },
  {
    question: "Can products be matched to project conditions?",
    answer:
      "Yes. The team can review location, terrain, soil, depth, productivity, and machine-fit requirements.",
  },
  {
    question: "How do I get pricing or a quote?",
    answer:
      "Submit your contact details and project requirements, and the Autocracy team will follow up with guidance.",
  },
  {
    question: "Does Autocracy support multiple industries?",
    answer:
      "Yes. Machines are used across telecom, water, solar, agriculture, defence, construction, and environmental projects.",
  },
];

export const defaultHomepageCmsContent: HomepageCmsContent = {
  srOnlyHeading:
    "Industrial Machinery Manufacturer and Utility Equipment Manufacturer",
  contentBuildTitle:
    "Trencher Machines for Global Projects.\nBuilt for Performance.",
  buildForIndia: BuildForIndiaContent,
  awardsTitle: "Awards",
  awards: AwardsData,
  certificates: CertificateData,
  media: MediaData,
  testimonials,
  clients,
  faqCta: {
    faqEyebrow: "FAQs",
    faqTitle: "Autocracy Machinery Questions",
    faqIntro:
      "Quick answers for buyers comparing trencher machines, solar EPC equipment, water body cleaning machines, agriculture attachments, and model options for real field applications.",
    faqs: defaultHomeFaqs,
    ctaImage: INDUSTRY.SAMPLE_INDUSTRY,
    ctaImageAltText: "Autocracy machinery",
    ctaEyebrow: "Project Support",
    ctaTitle: "Find the right machine for your project",
    ctaIntro:
      "Share your project requirements to compare trenchers, attachments, aquatic weed harvesters, forklifts, and industry-ready model options for your site conditions.",
  },
};
