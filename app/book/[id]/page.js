'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import Header from '@/components/Header'

export default function BookDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      api.get(`/book/${id}`)
        .then(res => setBook(res.data))
        .catch(err => console.error('도서 조회 실패:', err))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleAddToCart = async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    try {
      await fetch('http://localhost:8080/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: id,
          quantity: 1
        }),
      })

      alert('장바구니에 담았습니다.')
      router.push('/cart')
    } catch (error) {
      console.error('장바구니 추가 실패:', error)
      alert('장바구니 추가 중 오류가 발생했습니다.')
    }
  }

  if (loading) return <p className="p-4">도서 정보를 불러오는 중...</p>
  if (!book) return <p className="p-4 text-red-500">해당 도서를 찾을 수 없습니다.</p>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />

      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6">
        <img
          src={book.imageUrl || '/placeholder.png'}
          alt={book.title}
          className="w-48 h-auto border mb-4 mx-auto"
        />

        <h1 className="text-2xl font-bold mb-2 text-center">{book.title}</h1>
        <p className="text-center text-gray-600">저자: {book.author}</p>
        <p className="text-center text-gray-700 font-bold text-lg mb-4">
          {book.price.toLocaleString()}원
        </p>

        <p className="text-gray-700 mb-6 text-sm">
          {book.description || '도서 설명을 여기에 추가할 수 있습니다.'}
        </p>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            onClick={handleAddToCart}
          >
            🛒 장바구니
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            onClick={() => alert('결제 페이지로 이동합니다.')}
          >
            💳 바로 구매
          </button>
        </div>
      </div>
    </div>
  )
}
