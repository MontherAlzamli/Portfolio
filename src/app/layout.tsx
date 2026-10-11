import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://monther-alzamli.com'),
  title: {
    default: 'Monther Alzamli - Full Stack Developer & Software Engineer',
    template: '%s | Monther Alzamli',
  },
  description:
    'Experienced Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. View my portfolio of innovative projects and professional experience.',
  keywords: [
    'Monther Alzamli',
    'Full Stack Developer',
    'Software Engineer',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'Node.js',
    'JavaScript',
    'Web Development',
    'Frontend Developer',
    'Backend Developer',
    'Portfolio',
    'Software Development',
    'Web Applications',
    'Mobile Development',
    'UI/UX Design',
    'Database Design',
    'API Development',
    'Cloud Computing',
    'DevOps',
  ],
  authors: [{ name: 'Monther Alzamli', url: 'https://monther-alzamli.com' }],
  creator: 'Monther Alzamli',
  publisher: 'Monther Alzamli',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://monther-alzamli.com',
    title: 'Monther Alzamli - Full Stack Developer & Software Engineer',
    description:
      'Experienced Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. View my portfolio of innovative projects and professional experience.',
    siteName: 'Monther Alzamli Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Monther Alzamli - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monther Alzamli - Full Stack Developer & Software Engineer',
    description:
      'Experienced Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. View my portfolio of innovative projects and professional experience.',
    images: ['/og-image.jpg'],
    creator: '@montheralzamli',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://monther-alzamli.com',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="toast-container"
        />
      </body>
    </html>
  );
}
