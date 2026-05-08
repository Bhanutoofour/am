import { INDUSTRY } from "@/constants/Images/images";

// Format date to readable string
export const formatDate = (date: Date): string => {
  const d = new Date(date);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Fallback to extract YouTube video ID if thumbnail URL is not provided
export const getYouTubeVideoId = (embedUrl: string): string | null => {
  const match = embedUrl.match(
    /(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/v\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
};

// Check if image exists by loading it
export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    let resolved = false;
    
    img.onload = () => {
      if (!resolved) {
        resolved = true;
        // Check dimensions - maxresdefault should be at least 640px wide
        const isValid = img.naturalWidth >= 640 && img.naturalHeight >= 360;
        resolve(isValid);
      }
    };
    
    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    };
    
    img.src = url;
    
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    }, 2000);
  });
};

// Get thumbnail URL - check if image exists, otherwise return fallback
export const getThumbnailUrl = async (embedLink: string): Promise<string> => {
  // First, try to get YouTube thumbnail from embedLink
  const videoId = getYouTubeVideoId(embedLink);
  if (videoId) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const exists = await checkImageExists(thumbnailUrl);
    return exists ? thumbnailUrl : INDUSTRY.SAMPLE_INDUSTRY;
  }
  // If not YouTube video, use fallback
  return INDUSTRY.SAMPLE_INDUSTRY;
};

