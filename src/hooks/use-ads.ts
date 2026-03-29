import { useState, useEffect } from 'react';

export interface Ad {
  id: string;
  title: string;
  position: 'header_home' | 'sidebar' | 'footer' | 'in_article';
  imageUrl: string;
  linkUrl: string;
  active: boolean;
}

const DEFAULT_ADS: Ad[] = [
  { id: '1', title: 'إعلان رئيسي الصفحة الأولى', position: 'header_home', imageUrl: 'https://placehold.co/970x100?text=Advertisement', linkUrl: '#', active: true },
  { id: '2', title: 'إعلان جانبي في المقالات', position: 'sidebar', imageUrl: 'https://placehold.co/300x600?text=Advertisement', linkUrl: '#', active: true },
];

export function useAds() {
  const [ads, setAdsState] = useState<Ad[]>(() => {
    try {
      const stored = localStorage.getItem('maghrib24_ads');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_ADS;
  });

  const setAds = (newAds: Ad[] | ((prev: Ad[]) => Ad[])) => {
    setAdsState((prev: any) => {
      const updated = typeof newAds === 'function' ? newAds(prev) : newAds;
      localStorage.setItem('maghrib24_ads', JSON.stringify(updated));
      // Dispatch event to sync other components
      window.dispatchEvent(new Event('ads_updated'));
      return updated;
    });
  };

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('maghrib24_ads');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Only update if length or active status changes to prevent infinite loops, 
          // but for simple sync, we just set state.
          if (JSON.stringify(parsed) !== JSON.stringify(ads)) {
             setAdsState(parsed);
          }
        }
      } catch {}
    };
    window.addEventListener('ads_updated', handleUpdate);
    return () => window.removeEventListener('ads_updated', handleUpdate);
  }, [ads]);

  const updateAd = (id: string, updates: Partial<Ad>) => {
    setAds(current => current.map(ad => ad.id === id ? { ...ad, ...updates } : ad));
  };

  const addAd = (ad: Omit<Ad, 'id'>) => {
    setAds(current => [...current, { ...ad, id: Date.now().toString() }]);
  };

  const deleteAd = (id: string) => {
    setAds(current => current.filter(ad => ad.id !== id));
  };

  return { ads, updateAd, addAd, deleteAd };
}
