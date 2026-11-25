import './globals.css';

export const metadata = {
  title: 'Assure',
  description: 'Keep every warranty you own in one place, see what expires next, and get help filing a claim.',
  icons: {
    // Required: defining an `icons` object suppresses the file-based
    // app/icon.png link, so the favicon must be declared explicitly here.
    icon: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-touch-icon-120.png', sizes: '120x120', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Assure',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'theme-color': '#0b0b0a',
    'google-site-verification': '9_JzOdfOk3oOJkfW-pZ7t_XjlRBABpYdauzpEX9h1i0',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0b0a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/CabinetGrotesk-500.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap" />
        <script dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.classList.add('js');
            if (typeof window !== 'undefined' && window.process === undefined) {
              console.log = function() {};
              console.warn = function() {};
              console.error = function() {};
              console.info = function() {};
              console.debug = function() {};
            }
          `
        }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
