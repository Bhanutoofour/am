import type { Metadata } from "next";
import NotFoundClient from "./NotFoundClient";
import styles from "./notFound.module.scss";

export const metadata: Metadata = {
  title: "404 – Page Not Found | Autocracy Machinery",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <NotFoundClient />
    </div>
  );
}
