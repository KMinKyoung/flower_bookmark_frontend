'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import authApi from '../../lib/authApi'
import Header from '@/components/Header'

export default function LoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await authApi.post('/login', { userId, password })
      const { accessToken, refreshToken } = res.data

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)

      // JWT 디코드하여 역할 확인
      const decoded = jwtDecode(accessToken)
      const role = decoded?.auth || decoded?.role

      if (role === 'ROLE_ADMIN') {
        router.push('/admin') // ✅ 폴더 구조에 맞게 경로 수정
      } else {
        router.push('/')
      }
    } catch {
      setError('아이디 또는 비밀번호가 틀렸습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showSearch={false} showAuthButtons={false} />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-sm p-6 bg-white rounded shadow">
          {/* 로고 + 사이트 이름 */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-lg font-semibold text-gray-700 mt-2">🪻flower Bookmark</h1>
          </div>

          <h2 className="text-xl font-bold mb-4 text-center text-gray-700">로그인</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border p-2 mb-3 rounded text-gray-700 placeholder-gray-700"
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 mb-3 rounded text-gray-700 placeholder-gray-700"
              required
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full border p-2 mb-3 rounded text-gray-700 hover:bg-pink-100"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}