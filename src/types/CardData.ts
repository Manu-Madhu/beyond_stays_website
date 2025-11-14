// types/CardData.ts

export interface MetaData {
    title: string;
    description: string;
    keywords: string;
}
export interface PricingData {
    startFrom: string;
    description: string;
    note: string
}

export interface NearToVisitProps {
    title: string;
    distance: string
    time: string
    description: string
}

export interface CardData {
    id: number;
    slug?: string;
    about?: string;
    nearToVisit?: NearToVisitProps[]
    title: string;
    pricing?: PricingData;
    location?: string;
    inclusions?: string[];
    whatExpect?: string[];
    activities?: string[]
    category: string;
    description: string;
    images: string[];
    roomImages?: string[];
    meta: MetaData;
}
