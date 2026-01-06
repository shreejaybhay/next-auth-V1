"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Avatar({ src, alt, name, className, size = "default" }) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    default: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Try to fix Google image URLs
  const getOptimizedImageUrl = (url) => {
    if (!url) return url;

    // For Google profile images, try different approaches
    if (url.includes("googleusercontent.com")) {
      // Try removing the size restriction entirely
      let optimizedUrl = url.replace(/=s\d+-c$/, "");
      // If that doesn't work, try a larger size
      if (optimizedUrl === url) {
        optimizedUrl = url.replace(/=s\d+-c$/, "=s200-c");
      }
      console.log("Original Google URL:", url);
      console.log("Optimized Google URL:", optimizedUrl);
      return optimizedUrl;
    }

    return url;
  };

  const handleImageError = (e) => {
    console.error("Avatar image failed to load:", src);
    console.error("Error event:", e);
    setImageError(true);
  };

  const handleImageLoad = (e) => {
    console.log("Avatar image loaded successfully:", src);
    setImageError(false);
  };

  const optimizedSrc = getOptimizedImageUrl(src);

  // Show image if src exists and no error occurred
  if (optimizedSrc && !imageError) {
    return (
      <img
        src={optimizedSrc}
        alt={alt || name || "User avatar"}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className
        )}
        onError={handleImageError}
        onLoad={handleImageLoad}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Fallback to initials
  return (
    <div
      className={cn(
        "rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
