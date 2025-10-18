// types/CardData.ts

export interface MetaData {
    /** SEO title for the page or modal */
    title: string;

    /** SEO description for meta tags */
    description: string;

    /** SEO keywords for meta tags */
    keywords: string;
}

export interface CardData {
    /** Unique ID for the card */
    id: number;

    /** Title displayed on the card */
    title: string;

    /** Small category label (e.g., “Outdoor Activity”) */
    category: string;

    /** Short paragraph used in detailed view or modal */
    description: string;

    /** Multiple image URLs for detailed gallery */
    images: string[];

    /** SEO meta details for this item */
    meta: MetaData;
}
