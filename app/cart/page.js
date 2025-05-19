'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    fetch('http://localhost:8080/cart', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setCartItems(data))
  }, [])

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + ((item.price || 0) * item.quantity),
    0
  )
  const shippingFee = 2500
  const discount = 6000
  const finalPrice = totalPrice + shippingFee - discount
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header showSearch={false} showAuthButtons={false} />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-black">🛒 장바구니</h1>

          {cartItems.length === 0 ? (
            <p className="text-center text-lg text-gray-700">장바구니가 비어있습니다.</p>
          ) : (
            <>
              <table className="w-full text-left mb-6 text-black">
                <thead>
                  <tr className="border-b font-semibold">
                    <th className="py-2">선택</th>
                    <th>도서정보</th>
                    <th>수량</th>
                    <th>가격</th>
                    <th>배송</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.cartId} className="border-b">
                      <td><input type="checkbox" /></td>
                      <td className="py-4 font-medium">{item.bookTitle}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {typeof item.price === 'number'
                          ? `${item.price.toLocaleString()}원`
                          : '가격 정보 없음'}
                      </td>
                      <td>
                        {item.price >= 30000 ? '무료' : '2,500원'}
                      </td>
                      <td>
                        <button className="text-red-600 hover:underline font-semibold">삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 가격 요약 */}
              <div className="text-right space-y-1 mb-6 text-black">
                <p>상품 가격: {totalPrice.toLocaleString()}원</p>
                <p>배송비: {shippingFee.toLocaleString()}원</p>
                <p>할인: -{discount.toLocaleString()}원</p>
                <p className="text-xl font-bold">
                  결제 금액: {finalPrice.toLocaleString()}원
                </p>
              </div>

              {/* 주문 버튼 */}
              <div className="text-center">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold" 
                onClick={()=> router.push('/order')}>
                  주문하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
