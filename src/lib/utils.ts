import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getTranslatedSection(section: string): string {
  const sections: Record<string, string> = {
    'all': 'الكل',
    'news': 'أخبار',
    'economy': 'اقتصاد',
    'culture': 'ثقافة',
    'sports': 'رياضة',
    'technology': 'تكنولوجيا',
    'opinion': 'رأي',
    'editorial': 'افتتاحيات'
  };
  return sections[section] || section;
}

export function getSectionBgColor(section: string): string {
  const colors: Record<string, string> = {
    'news': 'bg-blue-500',
    'economy': 'bg-emerald-500',
    'culture': 'bg-purple-500',
    'sports': 'bg-orange-500',
    'technology': 'bg-cyan-500',
    'opinion': 'bg-amber-500',
    'editorial': 'bg-rose-500'
  };
  return colors[section] || 'bg-gray-500';
}

export function translateAuthorName(name: string): string {
  return name;
}

export function translateAuthorTitle(title: string): string {
  return title;
}

export function getAuthorImage(slug: string): string {
  return `https://ui-avatars.com/api/?name=${slug}&background=10b981&color=fff&rounded=true&size=128`;
}

export function usePageTitle(title: string) {
  React.useEffect(() => {
    document.title = title ? `${title} | MAGHREB24` : 'MAGHREB24';
  }, [title]);
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
