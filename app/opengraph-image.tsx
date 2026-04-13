import { ogImageAlt, ogImageSize, ogImageContentType, generateOgImage } from "./lib/og-image";

export const runtime = "edge";
export const alt = ogImageAlt;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return generateOgImage();
}
