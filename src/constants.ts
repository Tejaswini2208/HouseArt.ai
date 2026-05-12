export type InteriorCategory = 
  | 'bedroom' 
  | 'kitchen' 
  | 'hall' 
  | 'false-ceiling' 
  | 'wardrobe' 
  | 'tv-unit' 
  | 'bathroom' 
  | 'balcony' 
  | 'staircase' 
  | 'villa-design'
  | 'indian-traditional'
  | 'pooja-room'
  | 'courtyard'
  | 'ethnic-decor'
  | 'ceilings';

export interface CategoryInfo {
  id: InteriorCategory;
  labelTe: string;
  labelEn: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'bedroom', labelTe: 'బెడ్రూమ్', labelEn: 'Bedroom', icon: 'Bed' },
  { id: 'kitchen', labelTe: 'వంటగది', labelEn: 'Modular Kitchen', icon: 'ChefHat' },
  { id: 'hall', labelTe: 'హాల్', labelEn: 'Living Room / Hall', icon: 'Sofa' },
  { id: 'false-ceiling', labelTe: 'ఫాల్స్ సీలింగ్', labelEn: 'False Ceiling', icon: 'LayoutTemplate' },
  { id: 'wardrobe', labelTe: 'వార్డ్రోబ్', labelEn: 'Wardrobe', icon: 'DoorClosed' },
  { id: 'tv-unit', labelTe: 'టీవీ యూనిట్', labelEn: 'TV Unit', icon: 'Tv' },
  { id: 'bathroom', labelTe: 'బాత్‌రూమ్', labelEn: 'Bathroom', icon: 'Bath' },
  { id: 'balcony', labelTe: 'బాల్కనీ', labelEn: 'Balcony', icon: 'Trees' },
  { id: 'staircase', labelTe: 'మెట్లు (Staircase)', labelEn: 'Staircase', icon: 'MoveUp' },
  { id: 'villa-design', labelTe: 'విల్లా డిజైన్', labelEn: 'Luxury Villa', icon: 'Home' },
  { id: 'indian-traditional', labelTe: 'భారతీయ సాంప్రదాయం', labelEn: 'Indian Traditional', icon: 'Flower2' },
  { id: 'pooja-room', labelTe: 'పూజ గది', labelEn: 'Pooja Room', icon: 'Flame' },
  { id: 'courtyard', labelTe: 'పడమటి/మధ్య ముంగిలి', labelEn: 'Courtyard', icon: 'Sun' },
  { id: 'ethnic-decor', labelTe: 'ఎత్నిక్ డెకర్', labelEn: 'Ethnic Decor', icon: 'Gem' },
  { id: 'ceilings', labelTe: 'సీలింగ్ డిజైన్స్', labelEn: 'Ceilings', icon: 'Layout' },
];

export const LANGUAGES = [
  { code: 'te', name: 'తెలుగు' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
];

export const CEILING_DESIGNS = [
  {
    id: 101,
    photographer: "HomeArt AI Curated",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      original: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    },
    alt: "Minimalist Gypsum Tray Ceiling",
    width: 1920,
    height: 1080,
    tag: "Budget: Gypsum"
  },
  {
    id: 102,
    photographer: "Interior Master",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
      original: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg"
    },
    alt: "PVC Wood-finish Fluted Panels",
    width: 1920,
    height: 1080,
    tag: "Premium: PVC"
  },
  {
    id: 103,
    photographer: "Classic Patterns",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg",
      original: "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg"
    },
    alt: "Traditional POP Plus-Minus Pattern",
    width: 1920,
    height: 1080,
    tag: "Budget: POP"
  },
  {
    id: 104,
    photographer: "Sacred Spaces",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg",
      original: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg"
    },
    alt: "Lattice (Jaali) Insert for Pooja Room",
    width: 1920,
    height: 1080,
    tag: "Custom: Wood"
  },
  {
    id: 105,
    photographer: "Modern Cove",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/3773575/pexels-photo-3773575.jpeg",
      original: "https://images.pexels.com/photos/3773575/pexels-photo-3773575.jpeg"
    },
    alt: "Circular Cove Lighting Design",
    width: 1920,
    height: 1080,
    tag: "Mid-Range: POP"
  },
  {
    id: 106,
    photographer: "Designer Attic",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      original: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
    },
    alt: "Industrial Open Grid Ceiling",
    width: 1920,
    height: 1080,
    tag: "Budget: Metal"
  },
  {
    id: 107,
    photographer: "Royal Interiors",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg",
      original: "https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg"
    },
    alt: "Layered Coffered Ceiling",
    width: 1920,
    height: 1080,
    tag: "Premium: Wood"
  },
  {
    id: 108,
    photographer: "Zenith Design",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg",
      original: "https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg"
    },
    alt: "Starlight Fibre Optic Ceiling",
    width: 1920,
    height: 1080,
    tag: "Lux: Multi-material"
  },
  {
    id: 109,
    photographer: "Heritage Homes",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/3316918/pexels-photo-3316918.jpeg",
      original: "https://images.pexels.com/photos/3316918/pexels-photo-3316918.jpeg"
    },
    alt: "Carved Teak Wood Ceiling",
    width: 1920,
    height: 1080,
    tag: "Premium: Teak"
  },
  {
    id: 110,
    photographer: "Eco Design",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg",
      original: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg"
    },
    alt: "Bamboo Mat Grid Ceiling",
    width: 1920,
    height: 1080,
    tag: "Eco: Bamboo"
  },
  {
    id: 111,
    photographer: "Grand Estates",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      original: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
    },
    alt: "Hand-painted Fresco Ceiling",
    width: 1920,
    height: 1080,
    tag: "Luxury: Artisan"
  },
  {
    id: 112,
    photographer: "Urban Living",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      original: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    },
    alt: "Geometric Mirror Inlay Ceiling",
    width: 1920,
    height: 1080,
    tag: "Premium: Glass"
  },
  {
    id: 113,
    photographer: "Budget Decor",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/584399/pexels-photo-584399.jpeg",
      original: "https://images.pexels.com/photos/584399/pexels-photo-584399.jpeg"
    },
    alt: "Simple POP Border with Spotlights",
    width: 1920,
    height: 1080,
    tag: "Budget: POP"
  },
  {
    id: 114,
    photographer: "Modern Craft",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1090637/pexels-photo-1090637.jpeg",
      original: "https://images.pexels.com/photos/1090637/pexels-photo-1090637.jpeg"
    },
    alt: "Suspended Wooden Raft with LED",
    width: 1920,
    height: 1080,
    tag: "Mid-Range: Wood"
  },
  {
    id: 115,
    photographer: "High Life",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg",
      original: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg"
    },
    alt: "Double Height Chandelier Ceiling",
    width: 1920,
    height: 1080,
    tag: "Luxury: Grand"
  },
  {
    id: 116,
    photographer: "Studio Prime",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg",
      original: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg"
    },
    alt: "Veneer Finish Cove Ceiling",
    width: 1920,
    height: 1080,
    tag: "Premium: Veneer"
  },
  {
    id: 117,
    photographer: "Deco Hub",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/2082092/pexels-photo-2082092.jpeg",
      original: "https://images.pexels.com/photos/2082092/pexels-photo-2082092.jpeg"
    },
    alt: "Abstract POP Plus-Minus Design",
    width: 1920,
    height: 1080,
    tag: "Budget: POP"
  },
  {
    id: 118,
    photographer: "Nature Home",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
      original: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg"
    },
    alt: "Reclaimed Wood Beam Ceiling",
    width: 1920,
    height: 1080,
    tag: "Rustic: Wood"
  },
  {
    id: 119,
    photographer: "Elite Spaces",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg",
      original: "https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg"
    },
    alt: "Skylight Integrated False Ceiling",
    width: 1920,
    height: 1080,
    tag: "Premium: Glass"
  },
  {
    id: 120,
    photographer: "Creative Edge",
    url: "#",
    src: {
      large: "https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg",
      original: "https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg"
    },
    alt: "Backlit Fabric Stretch Ceiling",
    width: 1920,
    height: 1080,
    tag: "Mid-Range: Fabric"
  }
];
