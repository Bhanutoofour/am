import Caraousel from "@/component/sections/caraousel/Caraousel";
import Industries from "@/component/sections/Industries/Industries";
import Products from "@/component/sections/products/Products";
import Recognitions from "@/component/sections/recognitions/Recognitions";
import Testimonials from "@/component/sections/testimonials/Testimonials";
import { getActiveProducts } from "@/actions/productAction";
import { getHeroSections } from "@/actions/heroAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { getHomepageCmsContent } from "@/actions/homepageAction";
import Media from "@/component/sections/media/Media";
import ContentBuild from "@/component/sections/contentBuild/ContentBuild";
import HomeStructuredData from "./HomeStructuredData";
import Certificates from "@/component/sections/certificate/Certificates";
import HomeFaqCta from "./HomeFaqCta";
import HomeRawContent from "./HomeRawContent";

function titleWithBreaks(value: string) {
  const parts = value.split("\n");
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

export default async function HomeContent({
  contentBuildTitle,
  srOnlyHeading = "Built for India - Leading Heavy Machinery and Trencher Manufacturer",
}: {
  contentBuildTitle?: React.ReactNode;
  srOnlyHeading?: string;
}) {
  const products = await getActiveProducts();
  const heroData = await getHeroSections();
  const industries = await getActiveIndustries();
  const homepageContent = await getHomepageCmsContent();
  const resolvedContentBuildTitle =
    contentBuildTitle || titleWithBreaks(homepageContent.contentBuildTitle);

  return (
    <>
      <h1 className="sr-only">
        {homepageContent.srOnlyHeading || srOnlyHeading}
      </h1>
      <HomeStructuredData />
      <HomeRawContent />
      <Caraousel heroData={heroData} />
      <Industries industries={industries} />
      <Products products={products} />
      <ContentBuild
        data={homepageContent.buildForIndia}
        title={resolvedContentBuildTitle}
      />
      <Recognitions
        data={homepageContent.awards}
        title={homepageContent.awardsTitle}
      />
      <Certificates data={homepageContent.certificates} />
      <Media data={homepageContent.media} />
      <Testimonials
        testimonials={homepageContent.testimonials}
        clients={homepageContent.clients}
      />
      <HomeFaqCta content={homepageContent.faqCta} />
    </>
  );
}
