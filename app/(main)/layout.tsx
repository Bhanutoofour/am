import Header from "@/component/header/Header";
import "../../styles/globals.scss";
import Footer from "@/component/Footer/Footer";
import Breadcrumbs from "@/component/breadcrumbs/Breadcrumbs";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Breadcrumbs />
      <main className="main">{children}</main>
      <Footer />
    </>
  );
}
