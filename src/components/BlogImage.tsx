"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface BlogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

// Placeholder SVG for missing images (base64 encoded)
const placeholderSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UyZThmMCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkltYWdlPC90ZXh0Pgo8L3N2Zz4=`;

const normalizeSrc = (rawSrc: string): string => {
  if (!rawSrc) {
    return placeholderSvg;
  }

  const src = rawSrc.trim();

  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  try {
    // Absolute URLs should pass without modification
    new URL(src);
    return src;
  } catch {
    // Relative paths must start with a leading slash for next/image
    const sanitized = src.replace(/^\/+/, "");
    return `/${sanitized}`;
  }
};

export default function BlogImage({
  src,
  alt,
  fill = false,
  className = "",
  width,
  height,
}: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(() => normalizeSrc(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setImgSrc(normalizeSrc(src));
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(placeholderSvg);
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        unoptimized={hasError}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={hasError}
    />
  );
}

