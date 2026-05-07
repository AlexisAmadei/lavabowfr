import type { ReactNode } from 'react';

export type Language = 'fr' | 'en';

export interface Translations {
  about: {
    title: string;
    paragraphs: ReactNode[];
  };
  music: {
    title: string;
    singlesHeading: string;
    findUsEverywhere: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
    emailPlaceholder: string;
  };
  videos: {
    title: string;
    latest: string;
    featured: string;
    seeMore: string;
  };
  pictures: {
    title: string;
  };
  click: {
    title: string;
    unlockTiers: string;
    clicksSuffix: string;
  };
  contact: {
    title: string;
    intro: string;
  };
  footer: {
    booking: string;
    socials: string;
    newsletter: string;
    emailPlaceholder: string;
    copyright: string;
  };
  events: {
    title: string;
    noEvents: string;
    followUs: string;
    price: string;
    free: string;
    date: string;
    place: string;
    missingDate: string;
    missingPlace: string;
    missingDescription: string;
    buyTicket: string;
    eventTitleFallback: string;
    previous: string;
    next: string;
  };
  menu: {
    contact: string;
    home: string;
    shop: string;
    menuLabel: string;
    about: string;
    music: string;
    events: string;
    videos: string;
    photos: string;
    close: string;
  };
  shop: {
    title: string;
    filtersTitle: string;
    filtersSubtitle: string;
    filterCount: (n: number) => string;
    reset: string;
    inStockOnly: string;
    inStock: string;
    categories: string;
    categoriesSelected: (n: number) => string;
    otherItems: string;
    emptyState: string;
    outOfStock: string;
    outOfStockBuy: string;
    buy: string;
    addToCart: string;
  };
  cart: {
    title: string;
    empty: string;
    continueShopping: string;
    remove: string;
    clearAll: string;
    clearConfirmTitle: string;
    clearConfirmMessage: string;
    cancel: string;
    confirm: string;
    delivery: string;
    deliveryInHand: string;
    deliveryShipping: string;
    shippingNotice: string;
    subtotal: string;
    shippingLabel: string;
    total: string;
    checkout: string;
    expiredToast: string;
    expiredToastDescription: string;
    addedToast: string;
    addedToastDescription: (name: string) => string;
    stockReachedToast: string;
    stockReachedToastDescription: string;
    viewCart: string;
  };
  checkout: {
    title: string;
    summary: string;
    payCta: string;
    payingCta: string;
    backToCart: string;
    errorOutOfStock: string;
    errorInsufficientStock: (available: number) => string;
    errorMissing: string;
    errorInactive: string;
    errorGeneric: string;
  };
  orderSuccess: {
    title: string;
    thanks: string;
    orderIdLabel: string;
    receiptNote: string;
    pendingNote: string;
    backToShop: string;
    notFound: string;
  };
  newsletterMessages: {
    alreadySubscribed: string;
    invalidEmail: string;
    genericError: string;
    success: string;
    emptyEmail: string;
  };
  online: {
    user: string;
    users: string;
    online: string;
  };
}
