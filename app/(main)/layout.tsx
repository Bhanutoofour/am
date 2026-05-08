import Header from "@/component/header/Header";
import "../../styles/globals.scss";
import Footer from "@/component/Footer/Footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </>
  );
}
