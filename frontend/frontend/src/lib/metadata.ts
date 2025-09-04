// Metadata de l'application
export const APP_METADATA = {
  TITLE: 'Food Ordering App',
  DESCRIPTION: 'Commander vos repas en ligne au Cameroun',
  KEYWORDS: 'food, ordering, cameroun, restaurant, livraison',
  AUTHOR: 'Votre Nom',
  SITE_URL: 'https://votresite.com',
  TWITTER_HANDLE: '@votrecompte',
  OG_IMAGE: '/images/og-image.jpg',
};

// Configuration des métadonnées par défaut pour Next.js
export const DEFAULT_METADATA = {
  title: {
    default: APP_METADATA.TITLE,
    template: `%s | ${APP_METADATA.TITLE}`,
  },
  description: APP_METADATA.DESCRIPTION,
  keywords: APP_METADATA.KEYWORDS,
  authors: [
    {
      name: APP_METADATA.AUTHOR,
      url: APP_METADATA.SITE_URL,
    },
  ],
  creator: APP_METADATA.AUTHOR,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: APP_METADATA.SITE_URL,
    title: APP_METADATA.TITLE,
    description: APP_METADATA.DESCRIPTION,
    siteName: APP_METADATA.TITLE,
    images: [
      {
        url: `${APP_METADATA.SITE_URL}${APP_METADATA.OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: APP_METADATA.TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_METADATA.TITLE,
    description: APP_METADATA.DESCRIPTION,
    images: [`${APP_METADATA.SITE_URL}${APP_METADATA.OG_IMAGE}`],
    creator: APP_METADATA.TWITTER_HANDLE,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
