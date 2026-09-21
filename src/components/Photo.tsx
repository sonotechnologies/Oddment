import Image from "next/image";

import type { ShopImage } from "@/lib/images";

type PhotoProps = {
  image: ShopImage | null;
  /** Shown in the placeholder chip when no photograph is present yet. */
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  variant?: "default" | "deep" | "map";
  chipClassName?: string;
};

const FILLS = {
  default: "od-placeholder",
  deep: "od-placeholder-deep",
  map: "od-placeholder-map",
} as const;

export function Photo({
  image,
  label,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  variant = "default",
  chipClassName = "bg-paper",
}: PhotoProps) {
  if (image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={image.src}
          alt={image.alt || label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-end p-3 ${FILLS[variant]} ${className}`}>
      <span
        className={`font-mono text-[10px] leading-snug text-[rgba(43,43,43,0.6)] px-[7px] py-[5px] ${chipClassName}`}
      >
        {label}
      </span>
    </div>
  );
}
