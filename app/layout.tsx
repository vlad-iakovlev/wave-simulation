import { Metadata, Viewport } from 'next'
import { EpilepsyWarning } from '../components/layout/EpilepsyWarning.jsx'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Wave Simulation',
  description: 'Cellular automaton for wave simulation',
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/icons/favicon.svg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/icons/favicon.png',
    },
    {
      rel: 'mask-icon',
      color: '#16a34a',
      url: '/icons/mask-icon.svg',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/icons/apple-touch-icon.png',
    },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#18181b',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="touch-pan-y select-none bg-zinc-900 text-zinc-100 [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]">
        {children}
        <EpilepsyWarning />
      </body>
    </html>
  )
}
