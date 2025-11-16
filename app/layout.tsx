import './globals.css'

export const metadata = {
  title: 'CYS | Change Your Style',
  description: '以創新科技打造時尚品牌',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-neutral-950 text-neutral-200 antialiased">{children}</body>
    </html>
  )
}

