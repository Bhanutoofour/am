import Caraousel from "@/component/sections/caraousel/Caraousel";
import Industries from "@/component/sections/Industries/Industries";
import Products from "@/component/sections/products/Products";
import Recognitions from "@/component/sections/recognitions/Recognitions";
import Testimonials from "@/component/sections/testimonials/Testimonials";
import { getActiveProducts } from "@/actions/productAction";
import { getHeroSections } from "@/actions/heroAction";
import { getActiveIndustries } from "@/actions/industryAction";
import {
  AwardsData,
  BuildForIndiaContent,
  CertificateData,
  MediaData,
} from "@/data/recognitionsData";
import { testimonials, clients } from "@/data/customerTestimonials";
import Media from "@/component/sections/media/Media";
import ContentBuild from "@/component/sections/contentBuild/ContentBuild";
import HomeStructuredData from "./HomeStructuredData";
import Certificates from "@/component/sections/certificate/Certificates";
import HomeFaqCta from "./HomeFaqCta";

export default async function HomeContent({
  contentBuildTitle,
}: {
  contentBuildTitle?: React.ReactNode;
}) {
  const products = await getActiveProducts();
  const heroData = await getHeroSections();
  const industries = await getActiveIndustries();

  return (
    <>
      <h1 className="sr-only">
        Built for India - Leading Heavy Machinery and Trencher Manufacturer
      </h1>
      <HomeStructuredData />
      <Caraousel heroData={heroData} />
      <Industries industries={industries} />
      <Products products={products} />
      <ContentBuild data={BuildForIndiaContent} title={contentBuildTitle} />
      <Recognitions data={AwardsData} title="Awards" />
      <Certificates data={CertificateData} />
      <Media data={MediaData} />
      <Testimonials testimonials={testimonials} clients={clients} />
      <HomeFaqCta />
    </>
  );
}
