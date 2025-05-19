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

  const [reviewContent, setReviewContent] = useState('')
  const [rating, setRating] = useState('')
  const [reviews, setReviews] = useState([])

  // 도서 및 리뷰 불러오기
  useEffect(() => {
    if (id) {
      // 도서 정보
      api.get(`/book/${id}`)
        .then(res => setBook(res.data))
        .catch(err => console.error('도서 조회 실패:', err))
        .finally(() => setLoading(false))

      // 리뷰 목록 (토큰 포함)
      const token = localStorage.getItem('access_token')

      fetch(`http://localhost:8080/api/books/${id}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error(`리뷰 조회 실패: ${res.status}`)
          return res.json()
        })
        .then(data => {
          console.log('📦 받아온 리뷰:', data)
          setReviews(data)
        })
        .catch(err => console.error('리뷰 불러오기 실패:', err))
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

  const handleOrder = async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    router.push(`/order?bookId=${id}&quantity=1`)
  }

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    if (!reviewContent || !rating) {
      alert('리뷰 내용과 평점을 모두 입력해주세요.')
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/books/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: reviewContent,
          rating: Number(rating)
        }),
      })

      if (!response.ok) {
        throw new Error(`리뷰 등록 실패: ${response.status}`)
      }

      alert('리뷰가 등록되었습니다!')
      setReviewContent('')
      setRating('')

      // 리뷰 다시 불러오기 (토큰 포함)
      fetch(`http://localhost:8080/api/books/${id}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setReviews(data))
    } catch (error) {
      console.error('리뷰 등록 실패:', error)
      alert('리뷰 등록 중 오류가 발생했습니다.')
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

        <div className="flex justify-center gap-4 mt-8">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            onClick={handleAddToCart}
          >
            🛒 장바구니
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            onClick={handleOrder}
          >
            💳 바로 구매
          </button>
        </div>
      </div>

      {/* 리뷰 작성 영역 */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-4">리뷰 작성</h2>

        <textarea
          className="w-full border p-2 rounded mb-4"
          placeholder="도서에 대한 리뷰를 작성해주세요."
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />

        <div className="mb-4">
          <label className="block mb-2 font-medium">평점</label>
          <select
            className="border p-2 rounded w-full"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">별점을 선택하세요</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}점</option>
            ))}
          </select>
        </div>

        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={handleSubmitReview}
        >
          리뷰 등록
        </button>
      </div>

      {/* 리뷰 목록 */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-4">리뷰 목록</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-yellow-500">⭐ {review.rating}점</span>
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
