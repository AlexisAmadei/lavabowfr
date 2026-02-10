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
  storage_ref?: string;
  date?: string;
  link?: string;
  place?: string;
  img?: File | string;
  status?: string;
}
export type BeerGaugeProps = {
  palier: {
    id: number;
  };
  index: number;
  getProgressPercentage: (index: number) => number;
  IconBeer: string;
};
export interface EmailContact {
  id: string | number;
  email: string;
  created_at: string;
  firstName: string;
  lastName: string;
  status: string;
}

export interface ClicksItem {
  id: number;
  name: string;
  target: number;
}
export interface Video {
  id?: number
  description?: string
  url?: string
  status?: string
  order?: number
  created_at: string
  updated_at: string
}
