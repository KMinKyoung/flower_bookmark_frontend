'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import authApi from '../../lib/authApi'
import Header from '@/components/Header'


export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    userId: '',
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await authApi.post('/signup', form)
      router.push('/login')
    } catch (err) {
      setError('회원가입에 실패했습니다. 이미 존재하는 아이디일 수 있어요.')
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

          <h2 className="text-xl font-bold mb-4 text-center text-gray-700">회원가입</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={form.userId}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded text-gray-800 placeholder-gray-700"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded text-gray-800 placeholder-gray-700"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded text-gray-800 placeholder-gray-700"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded text-gray-800 placeholder-gray-700"
              required
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full border p-2 mb-3 rounded text-gray-700 hover:bg-pink-100"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
