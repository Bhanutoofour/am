export type HomepageFaq = {
  question: string;
  answer: string;
};

export type HomepageFaqCtaContent = {
  faqEyebrow: string;
  faqTitle: string;
  faqIntro: string;
  faqs: HomepageFaq[];
  ctaImage: string;
  ctaImageAltText: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaIntro: string;
};

export type HomepageCmsContent = {
  srOnlyHeading: string;
  contentBuildTitle: string;
  buildForIndia: BuildForIndiaContentType[];
  awardsTitle: string;
  awards: RecognitionsDataType[];
  certificates: RecognitionsDataType[];
  media: MediaDataType[];
  testimonials: Testimonial[];
  clients: string[];
  faqCta: HomepageFaqCtaContent;
};
