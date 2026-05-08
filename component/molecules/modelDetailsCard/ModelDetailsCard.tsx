import Image from "next/image";
import styles from "./modelDetails.module.scss";

interface ModelOverviewProps {
  data: ModelDescription;
}

// Helper function to convert YouTube watch URL to embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return "";

  // If it's already an embed URL, return as is
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // Extract video ID from various YouTube URL formats
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );

  if (videoIdMatch) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return url; // Return original URL if we can't parse it
};

const ModelOverview: React.FC<ModelOverviewProps> = ({ data }) => {
  const {
    title = "-",
    image = "",
    description = [],
    imageAltText = "",
    youtubeLink = "",
  } = data;

  const embedUrl = getYouTubeEmbedUrl(youtubeLink);
  return (
    <section className={styles.modelOverviewWrapper}>
      <div className={styles.contentBox}>
        <h2>{title || "-"}</h2>
        <div className={styles.paragraphHolder}>
          {description &&
            description.length > 0 &&
            description.map((paragraph: string, ind: number) => (
              <p key={`paragraph -- ${ind}`}>{paragraph || "-"}</p>
            ))}
        </div>
      </div>
      <div className={styles.imageBox}>
        {youtubeLink && embedUrl ? (
          <iframe
            src={embedUrl}
            title={title || "Model video"}
            width={912}
            height={486}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`${styles.trencherImage} ${styles.trencherVideo}`}
          />
        ) : (
          <Image
            src={image || ""}
            alt={imageAltText || "Modal image"}
            width={912}
            height={486}
            className={styles.trencherImage}
          />
        )}
      </div>
    </section>
  );
};

export default ModelOverview;
