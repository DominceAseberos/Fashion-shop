import { useEffect, useState } from 'react';
import { fetchGarments } from '@/services/strapi';
import { looks as fallbackLooks, type Look } from '@/data/looks';

export function useGarments() {
  const [garments, setGarments] = useState<ReadonlyArray<Look>>(fallbackLooks);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let active = true;
    fetchGarments().then((data) => {
      if (active) {
        setGarments(data);
        setIsLive(data !== fallbackLooks);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { garments, loading, isLive };
}
