import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'CYS | Change Your Style - 台灣總代理專業包膜服務',
    template: '%s | CYS | Change Your Style'
  },
  description: 'CYS 台灣總代理，專業汽車包膜服務。提供頂級膜料、精緻工藝、完整保固服務。專業包膜技術，讓您的愛車展現獨特風格。',
  keywords: ['CYS', '汽車包膜', '車體包膜', '台灣總代理', '包膜服務', '改色膜', '保護膜', '犀牛皮', 'TPU', '保固查詢'],
  authors: [{ name: 'CYS | Change Your Style' }],
  creator: 'CYS | Change Your Style',
  publisher: 'CYS | Change Your Style',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cyswrap.com.tw'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://cyswrap.com.tw',
    siteName: 'CYS | Change Your Style',
    title: 'CYS | Change Your Style - 台灣總代理專業包膜服務',
    description: 'CYS 台灣總代理，專業汽車包膜服務。提供頂級膜料、精緻工藝、完整保固服務。',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'CYS | Change Your Style',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CYS | Change Your Style - 台灣總代理專業包膜服務',
    description: 'CYS 台灣總代理，專業汽車包膜服務。提供頂級膜料、精緻工藝、完整保固服務。',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 如果将来有 Google Search Console，可以添加验证码
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="canonical" href="https://cyswrap.com.tw" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}

