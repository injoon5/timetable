import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3학년 4반 시간표',
  description: '2025학년도 3학년 4반 시간표',
  generator: 'Next.js',
  openGraph: {
    type: "website",
    url: "https://timetable.injoon5.com",
    title: "3학년 4반 시간표",
    description: "2025학년도 3학년 4반 시간표",
    siteName: "3학년 4반 시간표",
    images: 'https://og.ij5.dev/api/og/?title=3%ED%95%99%EB%85%84%204%EB%B0%98%20%EC%8B%9C%EA%B0%84%ED%91%9C&subheading=%EB%AA%A9%EC%9A%B4%EC%A4%91%202025%ED%95%99%EB%85%84%EB%8F%84'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
