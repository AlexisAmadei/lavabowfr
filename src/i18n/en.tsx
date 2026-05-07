import LavaTypo from '@/components/Design/LavaTypo';
import type { Translations } from './types';

export const en: Translations = {
  about: {
    title: '"ALL IS ABOUT THA PINK PONEY"',
    paragraphs: [
      <>
        Lava Bow is an <LavaTypo variant={'accent'}>alternative rock trio</LavaTypo> born in Asnières-sur-Seine, on the borders of sonic chaos and visceral intimacy. Made up of Côme (guitar/vocals), Sam (cello/vocals) and Alexis (drums). The band decided to <LavaTypo variant={'accent'}>break the codes of traditional rock</LavaTypo> with a daring formula: <LavaTypo variant={'accent'}>no bass, but an amplified and roughed-up cello</LavaTypo>, holding both the groove and the lyrical flights.
      </>,
      <>
        Navigating between <LavaTypo variant={'bold'}>progressive punk, poetic grunge and abrasive rock</LavaTypo>, Lava Bow builds a raw and whimsical universe influenced by Nirvana, the Beatles, Red Hot Chili Peppers or Slift. The band develops its <LavaTypo variant={'accent'}>unique signature mixing furious riffs, haunted vocals, powerful rhythms and unexpected textures</LavaTypo>. Lava Bow now defines itself as a Post Alternative Progressive Punk band (basically, they have a lot of inspiration).
      </>,
      <>
        Since their beginning in 2017, they have released <LavaTypo variant='accent'>three projects</LavaTypo>: a DIY demo recorded in their teenage bedroom, then their <LavaTypo variant='accent'>first studio album "Mirrors"</LavaTypo>. Their latest project dates back to 2020 with their <LavaTypo variant='accent'>EP "Attention aux raccourcis"</LavaTypo>.
      </>,
      <>
        Since 2020, Lava Bow has been chaining concerts around Paris with infectious energy, intense shows and an <LavaTypo variant={'accent'}>uninhibited closeness</LavaTypo> with the audience. Their compositions deal with contemporary alienation, weird dreams and everyday absurdity, all with a healthy dose of self-mockery.
      </>,
      <>
        In 2025, they release a live session (<LavaTypo variant={'accent'}>"LAVA SESSION #1"</LavaTypo>) that captures their endless will to reinvent themselves. It features their new single <LavaTypo variant={'accent'}>"Big Fish"</LavaTypo>, foreshadowing an album for spring 2026, a revival of their first studio release <LavaTypo variant={'accent'}>"Horse Pink Poney?!"</LavaTypo> and a snarling cover of <LavaTypo variant={'accent'}>"I Shot the Sheriff"</LavaTypo>.
      </>,
      <>
        In short, Lava Bow is a radical and free live offering, going against the grain of polished formats. Their motto: <LavaTypo variant={'accent'}>"All is about tha pink poney"</LavaTypo>.
      </>,
    ],
  },
  music: {
    title: 'Our Music',
    singlesHeading: 'LOVE, CHEER & BEERS, the singles',
    findUsEverywhere: 'You can find us everywhere else too',
  },
  newsletter: {
    title: 'Newsletter',
    subtitle: 'Become a LAVA FAN and never miss any news!',
    emailPlaceholder: 'Email',
  },
  videos: {
    title: 'Videos',
    latest: 'Latest video',
    featured: 'Absolute Cinema',
    seeMore: 'See more',
  },
  pictures: {
    title: 'Lava Bow in pictures',
  },
  click: {
    title: 'Crank up the counter!',
    unlockTiers: 'Click and unlock tiers:',
    clicksSuffix: 'clicks',
  },
  contact: {
    title: 'Contact',
    intro: 'For more info, to book us, or even just to tell us your best joke, this way!',
  },
  footer: {
    booking: 'Booking',
    socials: 'Socials',
    newsletter: 'Newsletter',
    emailPlaceholder: 'Email',
    copyright: '© 2026 LAVA BOW',
  },
  events: {
    title: 'Catch us live',
    noEvents: 'Just like you, Côme is patiently waiting for the next event...',
    followUs: 'In the meantime, follow our adventures here',
    price: 'PRICE',
    free: 'FREE PRICE',
    date: 'DATE',
    place: 'PLACE',
    missingDate: 'Sam forgot the date',
    missingPlace: 'Sam forgot the place',
    missingDescription: 'Sam forgot the description again.. spam sam@lavabow.fr',
    buyTicket: 'Get My Ticket',
    eventTitleFallback: 'Event Title',
    previous: 'Previous',
    next: 'Next',
  },
  menu: {
    contact: 'Contact',
    home: 'Home',
    shop: 'Lava Shop',
    menuLabel: 'Menu',
    about: 'About',
    music: 'Music',
    events: 'Events',
    videos: 'Videos',
    photos: 'Photos',
    close: 'Close',
  },
  shop: {
    title: 'Support us, in style',
    filtersTitle: 'Filter the shop',
    filtersSubtitle: 'Quickly refine the visible products.',
    filterCount: (n) => `${n} filter${n > 1 ? 's' : ''}`,
    reset: 'Reset',
    inStockOnly: 'In stock only',
    inStock: 'In stock',
    categories: 'Categories',
    categoriesSelected: (n) => `${n} selected`,
    otherItems: 'And the rest!',
    emptyState: 'No items available for now. Stay tuned!',
    outOfStock: 'OUT OF STOCK',
    outOfStockBuy: 'Out of Stock',
    buy: 'Buy',
    addToCart: 'Add to cart',
  },
  cart: {
    title: 'Cart',
    empty: 'Your cart is empty.',
    continueShopping: 'Continue shopping',
    remove: 'Remove',
    clearAll: 'Clear cart',
    clearConfirmTitle: 'Clear cart?',
    clearConfirmMessage: 'All items will be removed from the cart.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delivery: 'Delivery',
    deliveryInHand: 'In-person pickup (free)',
    deliveryShipping: 'Standard shipping (€4.99)',
    shippingNotice: 'Shipping within France only. For shipping outside France, contact shop@lavabow.fr',
    subtotal: 'Subtotal',
    shippingLabel: 'Shipping',
    total: 'Total',
    checkout: 'Proceed to checkout',
    expiredToast: 'Your cart expired',
    expiredToastDescription: 'Items were removed after 30 minutes of inactivity.',
    addedToast: 'Added to cart',
    addedToastDescription: (name) => `"${name}" was added to your cart.`,
    stockReachedToast: 'Stock limit reached',
    stockReachedToastDescription: 'You already have the maximum available quantity in your cart.',
    viewCart: 'View cart',
  },
  checkout: {
    title: 'Order summary',
    summary: 'Items',
    payCta: 'Pay with Stripe',
    payingCta: 'Redirecting…',
    backToCart: 'Back to cart',
    errorOutOfStock: 'This item is no longer available.',
    errorInsufficientStock: (available) => `Only ${available} unit${available > 1 ? 's' : ''} left in stock.`,
    errorMissing: 'This item no longer exists.',
    errorInactive: 'This item is no longer for sale.',
    errorGeneric: 'Could not start checkout. Please try again in a moment.',
  },
  orderSuccess: {
    title: 'Thanks for your order!',
    thanks: 'Your payment was received. A confirmation email and the official Stripe invoice are on their way.',
    orderIdLabel: 'Order number',
    receiptNote: 'The Stripe receipt and PDF invoice will arrive in your inbox.',
    pendingNote: 'Payment is still being confirmed — this can take a few seconds.',
    backToShop: 'Back to the shop',
    notFound: 'Order not found.',
  },
  newsletterMessages: {
    alreadySubscribed: 'You are already subscribed to the newsletter!',
    invalidEmail: 'Use a real email please!',
    genericError: 'An error occurred, please try again!',
    success: 'Successfully subscribed!',
    emptyEmail: 'You have to write something though...🤓☝️',
  },
  online: {
    user: 'user',
    users: 'users',
    online: 'online',
  },
};
