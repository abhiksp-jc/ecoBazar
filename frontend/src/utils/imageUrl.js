export const getImageUrl = (imgPath, fallback = "") => {
  if (!imgPath) return fallback;
  if (typeof imgPath !== "string") return fallback;
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }
  if (imgPath.startsWith("/uploads/")) {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
    return `${serverUrl}${imgPath}`;
  }
  if (imgPath.startsWith("uploads/")) {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
    return `${serverUrl}/${imgPath}`;
  }
  return imgPath;
};
