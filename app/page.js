
'use client'


import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import api from '../lib/api'
import Header from '@/components/Header'

const fetcher = url => api.get(url).then(res => res.data)

export default function Home() {
  const { data: books, error } = useSWR('/book', fetcher)
  const [search, setSearch] = useState('')

  if (error) {
    console.error('Fetch failed:', error)
    return <p className="p-4 text-red-500">도서 불러오기 중 오류가 발생했습니다.</p>
  }
  if (!books) return <p className="p-4">로딩 중…</p>

  const filtered = books.content.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
     <div className="min-h-screen bg-gray-50">
      <Header search={search} setSearch={setSearch} />

      {/* 도서 목록 */}
      <main className="p-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(book => (
              <li key={book.id} className="bg-white rounded shadow p-4" onClick={()=>window.location.href=`/book/${book.id}`}>
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
