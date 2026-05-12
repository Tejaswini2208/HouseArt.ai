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

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
  video_pictures: {
    id: number;
    picture: string;
    nr: number;
  }[];
}

const PEXELS_API_KEY = "PCFzYfyNbAxGXLXmkHanwYoc7w8DJXwSujxs8CWK6xctVujCM0ou00OB";

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

export async function fetchInteriorVideos(query: string, page = 1): Promise<{ videos: PexelsVideo[], images?: PexelsImage[], isFallback?: boolean }> {
  try {
    const refinedQuery = SEARCH_MAPPINGS[query] || query;
    const url = `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(refinedQuery + " interior")}&per_page=80&page=${page}`;
    
    let response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API video error: ${response.status} ${response.statusText}`);
    }

    let data = await response.json();
    let videos = (data.videos as PexelsVideo[]) || [];

    // 1. Try Generalized Query if 0 results
    if (videos.length === 0 && page === 1) {
      const generalized = generalizeQuery(query);
      if (generalized !== query) {
        const fallBackUrl = `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(generalized + " interior")}&per_page=80&page=1`;
        response = await fetch(fallBackUrl, {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        });
        if (response.ok) {
          data = await response.json();
          videos = (data.videos as PexelsVideo[]) || [];
        }
      }
    }

    // 2. Fallback to Images if still 0 videos
    if (videos.length === 0 && page === 1) {
      const images = await fetchInteriorImages(query, 1);
      if (images.length > 0) {
        return { videos: [], images, isFallback: true };
      }
    }

    return { videos };
  } catch (error) {
    console.error("Error fetching Pexels videos:", error);
    return { videos: [] };
  }
}

function generalizeQuery(query: string): string {
  const commonWords = ['simple', 'modern', 'luxury', 'indian', 'traditional', 'best', 'top', 'latest', '2024', '2025', 'designs', 'design', 'interior'];
  const words = query.toLowerCase().split(/\s+/).filter(w => !commonWords.includes(w));
  
  if (words.length > 0) {
    return words.join(' ');
  }
  
  return query;
}

export async function fetchInteriorImages(query: string, page = 1) {
  try {
    const refinedQuery = SEARCH_MAPPINGS[query] || query;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(refinedQuery + " interior")}&per_page=30&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API image error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return (data.photos as PexelsImage[]) || [];
  } catch (error) {
    console.error("Error fetching Pexels images:", error);
    return [];
  }
}

export async function fetchTrendingImages() {
  try {
    const url = `https://api.pexels.com/v1/curated?per_page=20`;
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API curated error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return (data.photos as PexelsImage[]) || [];
  } catch (error) {
    console.error("Error fetching Pexels trending:", error);
    return [];
  }
}
