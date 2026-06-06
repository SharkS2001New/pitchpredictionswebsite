import Image from "next/image";
import {
  canUseNextImage,
  normalizeImageSrc,
  parseDimension,
} from "../../lib/blog/image-utils";

export default function BlogPostImage({
  src,
  alt = "",
  width,
  height,
  className,
  priority = false,
}) {
  const normalizedSrc = normalizeImageSrc(src);
  if (!normalizedSrc) return null;

  const imageWidth = parseDimension(width, 850);
  const imageHeight = parseDimension(height, Math.round(imageWidth * 0.5625));

  if (canUseNextImage(normalizedSrc)) {
    return (
      <Image
        src={normalizedSrc}
        alt={alt}
        width={imageWidth}
        height={imageHeight}
        className={className}
        priority={priority}
        sizes="(max-width: 850px) 100vw, 850px"
      />
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      className={className}
      width={width || undefined}
      height={height || undefined}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
