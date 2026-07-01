import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JamiiLink',
    short_name: 'JamiiLink',
    description: 'A centralized platform for preserving generational family history.',
    start_url: '/',
    display: 'standalone',
    background_color: '#031B4E',
    theme_color: '#031B4E',
    icons: [
      {
        src: '/logo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/logo.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
