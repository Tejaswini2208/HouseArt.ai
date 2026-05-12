export interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url?: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
  tag?: string;
}

const PEXELS_API_KEY = "Ja3kxngrQmFQRNHIiYQqtLZEFCMQD40aEIRmkaTE41nibbLkGFzKliPl";

const SEARCH_MAPPINGS: Record<string, string> = {
  'indian-traditional': 'Indian traditional house home heritage',
  'pooja-room': 'Indian pooja room mandir prayer room',
  'courtyard': 'traditional courtyard house india architecture angan',
  'ethnic-decor': 'Indian ethnic decor brass elements textiles',
  'bedroom': 'modern indian bedroom',
  'hall': 'modern indian living room hall',
  'villa-design': 'luxury indian villa architecture',
  'ceilings': 'Modern Indian False Ceiling Design gypsum POP PVC',
};

export async function fetchInteriorImages(query: string, page = 1) {
  try {
    const refinedQuery = SEARCH_MAPPINGS[query] || query;
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(refinedQuery + " interior")}&per_page=30&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );
    const data = await response.json();
    return data.photos as PexelsImage[];
  } catch (error) {
    console.error("Error fetching Pexels images:", error);
    return [];
  }
}

export async function fetchTrendingImages() {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/curated?per_page=20`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );
    const data = await response.json();
    // Filter for interior looking things if possible, or just return curated
    return data.photos as PexelsImage[];
  } catch (error) {
    console.error("Error fetching Pexels trending:", error);
    return [];
  }
}
