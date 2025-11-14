import Image from "next/image";
import clsx from "clsx";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 48, className }: AvatarProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-full border border-slate-800",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}
