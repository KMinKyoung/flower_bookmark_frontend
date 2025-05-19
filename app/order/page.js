'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import api from '@/lib/api'

export default function OrderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [orderMode, setOrderMode] = useState(null)
  const [bookId, setBookId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [book, setBook] = useState(null)
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const rawBookId = searchParams.get('bookId')
    const rawQuantity = searchParams.get('quantity')

    if (rawBookId) {
      setBookId(Number(rawBookId))
      setQuantity(Number(rawQuantity) || 1)
      setOrderMode('single')
    } else {
      setOrderMode('cart')
    }
  }, [searchParams])

  useEffect(() => {
    if (orderMode === 'single' && bookId) {
      api.get(`/book/${bookId}`)
        .then(res => setBook(res.data))
        .catch(err => console.error('[도서 정보 실패]', err))
    }

    if (orderMode === 'cart') {
      const token = localStorage.getItem('access_token')
      fetch('http://localhost:8080/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setCartItems(data))
        .catch(err => console.error('[장바구니 정보 실패]', err))
    }
  }, [orderMode, bookId])

  const shippingFee = 2500
  const totalPriceSingle = book ? book.price * quantity : 0
  const totalPriceCart = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const finalPrice =
    orderMode === 'single'
      ? totalPriceSingle + shippingFee
      : totalPriceCart + shippingFee

  const handlePayment = () => {
    alert('주문 상세로 이동합니다.')
    router.push(`/order/detail/123`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} showAuthButtons={false} />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-6">📦 주문서</h1>

        {orderMode === 'single' && book && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={book.image_url || '/placeholder.png'}
                alt={book.title}
                className="w-32 h-auto border"
              />
              <div>
                <h2 className="text-xl font-bold">{book.title}</h2>
                <p className="text-gray-600">저자: {book.author}</p>
                <p className="text-gray-800 font-semibold">{book.price.toLocaleString()}원</p>
              </div>
            </div>

            <table className="w-full text-left mb-6 text-black">
              <thead>
                <tr className="border-b font-semibold">
                  <th>도서정보</th>
                  <th>수량</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 font-medium">{book.title}</td>
                  <td>{quantity}</td>
                  <td>{(book.price * quantity).toLocaleString()}원</td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {orderMode === 'cart' && cartItems.length > 0 && (
          <>
            <table className="w-full text-left mb-6 text-black">
              <thead>
                <tr className="border-b font-semibold">
                  <th>도서정보</th>
                  <th>수량</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.cartId} className="border-b">
                    <td className="py-4 font-medium">{item.bookTitle}</td>
                    <td>{item.quantity}</td>
                    <td>{(item.price * item.quantity).toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="text-right text-black space-y-1 mb-6">
          <p>상품 금액: {(orderMode === 'single' ? totalPriceSingle : totalPriceCart).toLocaleString()}원</p>
          <p>배송비: {shippingFee.toLocaleString()}원</p>
          <p className="text-xl font-bold">총 결제 금액: {finalPrice.toLocaleString()}원</p>
        </div>

        <div className="text-center">
          <button
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 text-lg font-semibold"
            onClick={handlePayment}
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  )
}
