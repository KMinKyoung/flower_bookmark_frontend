'use client'

import { getToken } from '../utils/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header({ search, setSearch, showSearch = true, showAuthButtons = true }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

useEffect(() => {
  const token = getToken();
  console.log('[Header] 현재 토큰:', token); 
  if (token) {
    setIsLoggedIn(true);
  }
}, []);


  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      {/* 로고 + 제목 클릭 시 홈으로 */}
      <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
        <h1 className="ml-2 text-2xl font-bold">🪻flower Bookmark</h1>
      </div>

      {/* 검색창 */}
      {showSearch && (
        <input
          type="text"
          placeholder="도서를 검색해보세요…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-1/3 focus:outline-none"
        />
      )}

      {/* 로그인 상태에 따라 버튼을 다르게 표시 */}
      {showAuthButtons && (
        <div className="space-x-2">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                로그인
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/cart')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                장바구니
              </button>
              <button
                onClick={() => router.push('/orders')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                주문내역
              </button>
              <button
                 onClick={() => {
                 localStorage.removeItem('access_token');
                 localStorage.removeItem('refresh_token');
                 router.push('/');
                 location.reload(); 
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                로그아웃
                </button>

            </>
          )}
        </div>
      )}
    </header>
  )
}
