'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import api from '../lib/api'
import Header from '@/components/Header'

const fetcher = url => api.get(url).then(res => res.data)

export default function Home() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [page, setPage] = useState(0)
  const size = 9   // 한 페이지에 몇 개씩 보여줄지


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0)  
    }, 300)
    return () => clearTimeout(handler)
  }, [search])


  const { data: books, error } = useSWR(
    `/book?keyword=${encodeURIComponent(debouncedSearch)}&page=${page}&size=${size}`,
    fetcher
  )

  if (error) {
    console.error('Fetch failed:', error)
    return <p className="p-4 text-red-500">도서 불러오기 중 오류가 발생했습니다.</p>
  }
  if (!books) return <p className="p-4">로딩 중…</p>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header search={search} setSearch={setSearch} />

      <main className="p-4">
        {books.content.length === 0 ? (
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.content.map(book => (
              <li
                key={book.id}
                className="bg-white rounded shadow p-4 cursor-pointer"
                onClick={() => window.location.href = `/book/${book.id}`}
              >
               {book.imageUrl?.trim() ? (
                  <Image
                   src={book.imageUrl}
                   alt={book.title}
                   width={120}
                   height={180}
                 />
                  ) : null}
                <h2 className="mt-2 font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="mt-1 font-bold">{book.price.toLocaleString()}원</p>
              </li>
            ))}
          </ul>
        )}

        {/* 페이징 컨트롤 */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={books.first}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            이전
          </button>
          <span>
            {books.number + 1} / {books.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, books.totalPages - 1))}
            disabled={books.last}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </main>
    </div>
  )
}
