type HeroSection = {
  id: number;
  title: string;
  description: string;
  image: string;
  altText: string;
};

type IndustryProduct = {
  id: number;
  title: string;
  thumbnail: string;
  thumbnailAltText: string;
};

type ActiveIndustry = {
  id: number;
  title: string;
  active: boolean;
  thumbnail: string;
  thumbnailAltText: string;
  products: IndustryProduct[];
};

type ActiveProduct = {
  id: number;
  title: string;
  thumbnail: string;
  thumbnailAltText: string;
  active: boolean;
};

type ProductWithIndustries = {
  id: number;
  title: string;
  thumbnail: string;
  thumbnailAltText: string;
  active: boolean;
  industries: string[];
};

type RecognitionsDataType = {
  title: string;
  imageSrc: string;
};

type Testimonial = {
  quote: string;
  author: string;
  location: string;
  avatar?: string;
};

type FooterLinkSection = {
  section: string;
  links?: {
    value: string;
    type: string;
  }[];
};

type MegaMenuType = "industry" | "product" | "";

type IndustryDataType = {
  id: number;
  title: string;
  description: string;
  active: boolean;
  thumbnail: string;
  thumbnailAltText: string;
  bannerImages: { imageUrl: string; altText: string }[];
  products: IndustryProduct[];
  brochure: string;
  seoDescription?: string;
  seoMetadata?: {
    pageTitle?: string;
    pageDescription?: string;
    pageKeywords?: string;
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
    structuredData?: {
      type?: string;
      title?: string;
      description?: string;
    };
  };
};

type FilterState = {
  showModelFilter: boolean;
  modelFilterType: string;
  showSeriesFilter: boolean;
  seriesFilterType: string;
};

type ProductDataType = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailAltText: string;
  series: string[];
  active: boolean | null;
  generalImage: string;
  generalImageAltText: string;
  industries: string[];
  models: Model[];
  seoDescription?: string;
  seoMetadata?: {
    pageTitle?: string;
    pageDescription?: string;
    pageKeywords?: string;
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
    structuredData?: {
      type?: string;
      title?: string;
      description?: string;
      brand?: string;
      category?: string;
      hasOfferCatalog?: {
        name?: string;
        description?: string;
        totalModels?: number;
        availableSeries?: string[];
        modelOverview?: {
          name: string;
          description: string;
          series: string;
        }[];
      };
    };
  };
};

type Model = {
  id: number;
  thumbnail: string;
  thumbnailAltText: string;
  modelNumber: string;
  modelTitle: string;
  machineType: string;
  series: string;
  keyFeatures: ModelFeature[];
  productName?: string;
};

type ModelFeature = {
  name: string;
  value: string;
};

type ModelDescription = {
  image: string;
  imageAltText: string;
  title: string;
  description: string[];
  youtubeLink?: string;
};

type SpecsTableIntro = {
  heading?: string;
  paragraph?: string;
};

type ModelObjectTypes = {
  id: number;
  modelNumber: string;
  modelTitle: string;
  machineType: string;
  productName: string;
  series: string;
  coverImage: string;
  coverImageAltText: string;
  keyFeatures: ModelFeature[];
  specsTableIntro?: SpecsTableIntro | null;
  brochure: string | null;
  modelDescription: ModelDescription[];
  seoDescription?: string;
  seoMetadata?: {
    pageTitle?: string;
    pageDescription?: string;
    pageKeywords?: string;
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
    structuredData?: {
      type?: string;
      name?: string;
      description?: string;
      brand?: string;
      sku?: string;
      material?: string;
      condition?: string;
      category?: string;
      offers?: {
        availability?: string;
      };
      aggregateRating?: {
        ratingValue?: number;
        reviewCount?: number;
      };
      certifications?: string[];
      warrantyDuration?: string;
    };
  } | null;
  generalImage: string;
  generalImageAltText?: string;
};

type RecognitionData = {
  imageSrc: string;
  title: string;
};

type MediaDataType = {
  title: string;
  desc: string;
  imageSrc: string;
  link: string;
  width: number;
  height: number;
};

type BuildForIndiaContentType = {
  title: string;
  desc: string;
};

type clientsType = string;

type selectedQuoteValue = {
  industry: string;
  product: string;
  name: string;
  email: string;
  phone: string;
};

type PrivacyPolicyContent = {
  type: "paragraph" | "list";
  text?: string;
  items?: string[];
};

type PrivacyPolicySection = {
  heading: string;
  content: PrivacyPolicyContent[];
};

type PrivacyPolicy = {
  title: string;
  company: string;
  intro: string;
  sections: PrivacyPolicySection[];
  contact: {
    companyName: string;
    email: string;
    address: string;
  };
};
type TermsContent = {
  type: "paragraph" | "list";
  text?: string;
  items?: string[];
};

type TermsSection = {
  heading: string;
  content: TermsContent[];
};

type TermsAndConditions = {
  title: string;
  intro: string[];
  sections: TermsSection[];
  contact: {
    companyName: string;
    email: string;
    address: string;
  };
};

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  faqs: FAQItem[];
};

type contactFormData = {
  name: string;
  email: string;
  mobileNumber: string;
  enquiry: string;
  comments: string;
  agreed: boolean;
};

type Country = {
  country: string;
  flag: string;
  code: string;
};

type RentalModelTypes = {
  id: number;
  modelNumber: string;
  modelTitle: string;
  machineType: string;
  shortDescription: string;
  productName: string;
  thumbnail: string;
  thumbnailAltText: string;
};

type FindADealerForm = {
  name: string;
  countryName: string;
  mobileNumber: string;
  agreed: boolean;
  role: string;
};

type Dealer = {
  id: number;
  name: string;
  country: string;
  state: string;
  contactNumber: string;
  email: string;
  fullAddress: string;
  availability?: string;
};

type VideoWithRelations = {
  id: number;
  title: string;
  embedLink: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  industryIds: number[];
  productIds: number[];
  modelIds: number[];
  industries: { id: number; title: string }[];
  products: { id: number; title: string }[];
  models: { id: number; modelTitle: string }[];
};
