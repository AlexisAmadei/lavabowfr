export interface EventItem {
    id?: number;
    title: string;
    description: string;
    price: number;
    date: string;
    place: string;
    link?: string;
    status?: string;
    img?: File | string;
}

export interface SpotlightItem {
    id?: number;
    title: string;
    subtitle: string;
    listen_link: string;
    buy_link: string;
    status?: string;
}

export interface PictureItem {
    id?: number;
    title: string;
    description?: string;
    date?: string;
    link?: string;
    place?: string;
    img?: File | string;
    status?: string;
}