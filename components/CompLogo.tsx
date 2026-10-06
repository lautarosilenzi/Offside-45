import Image from "next/image";
import LOGOS from "@/lib/data/comps.generated.json";

// Logo de una competencia (public/comps, ver scripts/comps/logos.ts). Sin logo, no muestra nada.
export default function CompLogo({ id, size = 24, className = "" }: { id: string; size?: number; className?: string }) {
  const logo = (LOGOS as Record<string, { file: string }>)[id];
  if (!logo) return null;
  return (
    <Image
      src={logo.file}
      alt=""
      width={size}
      height={size}
      className={`logo-img shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
