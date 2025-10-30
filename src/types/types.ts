export interface EventItem {
    id?: number;
    title: string;
    description: string;
    price: number;
    date: string;
    place: string;
    link?: string;
    status?: string;
    img?: string;
}

export interface SpotlightItem {
    id?: number;
    title: string;
    subtitle: string;
    listen_link: string;
    buy_link: string;
    status?: string;
}