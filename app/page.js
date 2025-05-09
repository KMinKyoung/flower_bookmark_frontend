// app/page.jsx
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import api from '../lib/api'

// fetcher 함수: URL을 받아 api.get().then(data) 반환
const fetcher = url => api.get(url).then(res => res.data)

export default function Home() {
  const { data: books, error } = useSWR('/book', fetcher)
  const [search, setSearch] = useState('')

  if (error) {
    console.error('Fetch failed:', error)
    return <p className="p-4 text-red-500">도서 불러오기 중 오류가 발생했습니다.</p>
  }
  if (!books) return <p className="p-4">로딩 중…</p>

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <div className="flex items-center">
          <Image
            src="/logo.png"        // public/logo.png 파일 준비
            alt="Page Turner Logo"
            width={48}
            height={48}
            style={{ height: 'auto' }}
          />
          <h1 className="ml-2 text-2xl font-bold">flower Bookmark</h1>
        </div>
        <input
          type="text"
          placeholder="도서를 검색해보세요…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-1/3 focus:outline-none"
        />
      </header>

      {/* 도서 목록 */}
      <main className="p-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(book => (
              <li key={book.id} className="bg-white rounded shadow p-4">
                <Image
                  src={book.imageUrl || '/placeholder.png'}
                  alt={book.title}
                  width={120}
                  height={180}
                  style={{ height: 'auto' }}
                />
                <h2 className="mt-2 font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="mt-1 font-bold">{book.price.toLocaleString()}원</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
