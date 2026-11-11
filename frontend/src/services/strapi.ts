import { looks as fallbackLooks, type Look } from '@/data/looks';

const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

export function getStrapiMediaUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${STRAPI_BASE_URL}${path}`;
}

export async function fetchGarments(): Promise<ReadonlyArray<Look>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${STRAPI_BASE_URL}/api/garments?populate=*&sort=index:asc`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Strapi returned ${res.status}`);
    const body = await res.json();

    const items = body.data || [];
    if (!items.length) return fallbackLooks;

    return items.map((item: any, idx: number) => {
      // Find fallback matching image if Strapi has no image uploaded yet
      const fallback = fallbackLooks[idx] || fallbackLooks[0];
      const imageUrl = item.image?.url ? getStrapiMediaUrl(item.image.url) : fallback.image;

      return {
        id: item.documentId || String(item.id),
        index: item.index || fallback.index,
        name: item.name || fallback.name,
        subtitle: item.subtitle || fallback.subtitle,
        notes: [
          { label: 'Fabric', value: item.fabric || fallback.notes[0]?.value || 'Fine Fabric' },
          { label: 'Origin', value: item.origin || fallback.notes[1]?.value || 'Italy' },
          { label: 'Edition', value: item.edition || fallback.notes[2]?.value || 'Limited' },
        ],
        image: imageUrl,
        alt: item.alt || fallback.alt,
        story: item.story || fallback.story,
      };
    });
  } catch (err) {
    console.warn('[Strapi API] Running in offline demo mode using local catalogue:', err);
    return fallbackLooks;
  }
}

export async function submitReservation(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  garmentName: string;
  garmentIndex: string;
  notes?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`${STRAPI_BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    });
    return res.ok;
  } catch (err) {
    console.error('[Strapi API] Reservation submission failed:', err);
    return false;
  }
}
