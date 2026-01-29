import styles from '@/styles/global.css?inline'
import { Outlet, Scripts, ScrollRestoration } from 'react-router'
import { Providers } from './providers'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Ensure relative URLs resolve from the site root */}
        <base href="/" />

        <title>PianoBender</title>
        <meta name="author" content="Jake Fried" />
        <meta name="description" content="An interactive piano learning application" />

        {/* Open Graph */}
        <meta property="og:title" content="PianoBender" />
        <meta property="og:site_name" content="PianoBender" />
        <meta property="og:description" content="An interactive piano learning application" />
        <meta property="og:image" content="/images/mode_falling_notes_screenshot.png" />
        <meta
          property="og:image:alt"
          content="Sightread demo displaying falling notes visualization"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://sightread.dev/images/mode_falling_notes_screenshot.png"
        />
        <meta
          name="twitter:image:alt"
          content="Sightread demo displaying falling notes visualization"
        />

        {/* Favicons */}
        {/* Use the PNG logo as the favicon. Adding sizes and shortcut icon for broader support */}
        <link rel="icon" href="/images/Logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/images/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/Logo.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Manually inserted styles */}
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}
