import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '시간표',
  description: '학교 시간표를 확인하세요',
  generator: 'Next.js',
  openGraph: {
    type: "website",
    url: "https://timetable.injoon5.com",
    title: "중학교 시간표",
    description: "중학교 시간표 확인",
    siteName: "중학교 시간표",
    images: 'https://og.ij5.dev/api/og/?title=%EC%A4%91%ED%95%99%EA%B5%90%20%EC%8B%9C%EA%B0%84%ED%91%9C&subheading=%ED%99%95%EC%9D%B8%ED%95%B4%20%EB%B3%B4%EC%84%B8%EC%9A%94.%20'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Nav />
        {children}
      </body>
    </html>
  )
}
