import LavaTypo from '@/components/Design/LavaTypo';
import type { Translations } from './types';

export const fr: Translations = {
  about: {
    title: '"All is about THA Pink Poney"',
    paragraphs: [
      <>
        Lava Bow, c'est un <LavaTypo variant={'accent'}>trio de rock alternatif</LavaTypo> né à Asnières-sur-Seine, aux frontières du chaos sonore et de l'intime viscéral. Composé de Côme (guitare/chant), Sam (violoncelle/chant) et Alexis (batterie). Le groupe décide de <LavaTypo variant={'accent'}>casser les codes du rock traditionnel</LavaTypo> avec une formule audacieuse : <LavaTypo variant={'accent'}>pas de basse, mais un violoncelle amplifié et malmené</LavaTypo>, qui tient autant le groove que les envolées lyriques.
      </>,
      <>
        Naviguant entre <LavaTypo variant={'bold'}>punk progressif, grunge poétique et rock abrasif</LavaTypo>, Lava Bow construit un univers brut et fantaisiste influencé par Nirvana, les Beatles, Red Hot Chili Peppers ou encore Slift. Le groupe développe sa <LavaTypo variant={'accent'}>signature unique mêlant riffs rageurs, chant habité, rythmiques puissantes et textures inattendues</LavaTypo>. Lava Bow se définit aujourd'hui comme un groupe de Post Alternative Progressive Punk (globalement, ils ont beaucoup d'inspiration).
      </>,
      <>
        Depuis leur début en 2017, ils ont sorti <LavaTypo variant='accent'>trois projets</LavaTypo>, une demo DIY enregistrée dans leur chambre d'ado, puis ensuite leur <LavaTypo variant='accent'>premier album studio "Mirrors"</LavaTypo>. Leur dernier projet date de 2020 avec leur <LavaTypo variant='accent'>EP "Attention aux raccourcis"</LavaTypo>.
      </>,
      <>
        Depuis 2020, Lava Bow enchaîne les concerts en région parisienne avec une énergie communicative, des shows intenses et une <LavaTypo variant={'accent'}>proximité désinhibée</LavaTypo> avec le public. Leurs compositions traitent de l'aliénation contemporaine, des rêves bizarres et de l'absurde quotidien, le tout avec une bonne dose d'autodérision.
      </>,
      <>
        En 2025, ils sortent une live session (<LavaTypo variant={'accent'}>"LAVA SESSION #1"</LavaTypo>) qui capture leur volonté de se réinventer sans cesse. On y retrouve notamment leur nouveau single <LavaTypo variant={'accent'}>"Big Fish"</LavaTypo>, annonciateur d'un album pour le printemps 2026, un revival de leur première sortie studio <LavaTypo variant={'accent'}>"Horse Pink Poney?!"</LavaTypo> et une reprise grinçante de <LavaTypo variant={'accent'}>"I Shot the Sheriff"</LavaTypo>.
      </>,
      <>
        En bref, Lava Bow, c'est une proposition live radicale et libre, à contre-courant des formats policés. Leur mot d'ordre : <LavaTypo variant={'accent'}>"All is about tha pink poney"</LavaTypo>.
      </>,
    ],
  },
  music: {
    title: 'Notre Musique',
    singlesHeading: 'LOVE, CHEER & BEERS, les singles',
    findUsEverywhere: 'Tu peux nous trouver partout sinon',
  },
  newsletter: {
    title: 'Newsletter',
    subtitle: 'Deviens un LAVA FAN et ne rate plus aucune actualité !',
    emailPlaceholder: 'Email',
  },
  videos: {
    title: 'Vidéos',
    latest: 'Dernière vidéo',
    featured: 'Absolute Cinéma',
    seeMore: 'Voir plus',
  },
  pictures: {
    title: 'Lava Bow en photos',
  },
  click: {
    title: 'Chauffe ce compteur !',
    unlockTiers: 'Clique et débloque des paliers :',
    clicksSuffix: 'clics',
  },
  contact: {
    title: 'Contact',
    intro: "Pour plus d'infos, une envie de nous programmer, ou même juste pour nous raconter ta meilleure blague, c'est par ici !",
  },
  footer: {
    booking: 'Booking',
    socials: 'Réseaux',
    newsletter: 'Newsletter',
    emailPlaceholder: 'Email',
    copyright: '© 2026 LAVA BOW',
  },
  events: {
    title: 'Retrouve nous en concert',
    noEvents: 'Comme toi, Côme attend patiemment le prochain évènement...',
    followUs: 'En attendant suis nos aventures ici',
    price: 'PRIX',
    free: 'PRIX LIBRE',
    date: 'DATE',
    place: 'LIEU',
    missingDate: "Sam t'as oublié la date",
    missingPlace: "Sam t'as oublié le lieu",
    missingDescription: "Sam t'as encore oublié la description.. spammez le sam@lavabow.fr",
    buyTicket: 'Prendre Ma Place',
    eventTitleFallback: 'Event Title',
    previous: 'Précédent',
    next: 'Suivant',
  },
  menu: {
    contact: 'Contact',
    home: 'Accueil',
    shop: 'Lava Shop',
    menuLabel: 'Menu',
    about: 'À propos',
    music: 'Musique',
    events: 'Évènements',
    videos: 'Vidéos',
    photos: 'Photos',
    close: 'Fermer',
  },
  shop: {
    title: 'Soutiens nous, en étant trop stylé',
    filtersTitle: 'Filtrer la boutique',
    filtersSubtitle: 'Affinez rapidement les produits visibles.',
    filterCount: (n) => `${n} filtre${n > 1 ? 's' : ''}`,
    reset: 'Réinitialiser',
    inStockOnly: 'Disponible seulement',
    inStock: 'En stock',
    categories: 'Catégories',
    categoriesSelected: (n) => `${n} sélectionnée${n > 1 ? 's' : ''}`,
    otherItems: 'Et le reste !',
    emptyState: "Aucun article disponible pour le moment. Restez à l'écoute !",
    outOfStock: 'HORS STOCK',
    outOfStockBuy: 'Hors stock',
    buy: 'Acheter',
    addToCart: 'Ajouter au panier',
  },
  cart: {
    title: 'Panier',
    empty: 'Votre panier est vide.',
    continueShopping: 'Continuer mes achats',
    remove: 'Supprimer',
    clearAll: 'Tout vider',
    clearConfirmTitle: 'Vider le panier ?',
    clearConfirmMessage: 'Tous les articles seront retirés du panier.',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delivery: 'Livraison',
    deliveryInHand: 'Récupération en main propre (gratuit)',
    deliveryShipping: 'Livraison standard (4,99 €)',
    shippingNotice: 'Livraison en France uniquement. Pour une livraison hors France, contactez shop@lavabow.fr',
    subtotal: 'Sous-total',
    shippingLabel: 'Frais de port',
    total: 'Total',
    checkout: 'Passer au paiement',
    expiredToast: 'Votre panier a expiré',
    expiredToastDescription: 'Les articles ont été retirés au bout de 30 minutes.',
    addedToast: 'Article ajouté au panier',
    addedToastDescription: (name) => `« ${name} » a été ajouté à votre panier.`,
    stockReachedToast: 'Stock maximum atteint',
    stockReachedToastDescription: "Vous avez déjà la quantité maximale disponible dans votre panier.",
    viewCart: 'Voir mon panier',
  },
  newsletterMessages: {
    alreadySubscribed: 'Tu es déjà inscrit(e) à la newsletter !',
    invalidEmail: 'Mets un vrai mail par contre !',
    genericError: 'Une erreur est survenue, réessaie !',
    success: 'Inscription réussie !',
    emptyEmail: 'Faut écrire un truc par contre...🤓☝️',
  },
  online: {
    user: 'utilisateur',
    users: 'utilisateurs',
    online: 'en ligne',
  },
};
