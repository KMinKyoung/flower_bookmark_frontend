// app/layout.tsx
import './globals.css'   // Tailwind나 전역 CSS가 있으면 여기에 import
import { ReactNode } from 'react'

export const metadata = {
  title: 'Page Turner',
  description: '도서 구매 사이트',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
