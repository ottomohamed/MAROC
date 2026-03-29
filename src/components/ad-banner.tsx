import { useAds } from "@/hooks/use-ads";

interface AdBannerProps {
  position: "header_home" | "sidebar" | "footer" | "in_article";
  className?: string;
}

export function AdBanner({ position, className = "" }: AdBannerProps) {
  const { ads } = useAds();
  const ad = ads.find(a => a.position === position && a.active);
  
  if (!ad) return null;

  return (
    <div className={`ad-banner overflow-hidden ${className}`}>
      <p className="text-[10px] text-gray-400 dark:text-zinc-600 text-center mb-1">إعلان</p>
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
        />
      </a>
    </div>
  );
}
