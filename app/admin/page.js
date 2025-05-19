'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'

export default function AdminBookPage() {
  const [books, setBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null)
  const [form, setForm] = useState({
    title: '',
    author: '',
    publisher: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    description: ''
  })
  const token = localStorage.getItem('access_token')

  useEffect(() => {
    fetch('http://localhost:8080/api/book/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('도서 불러오기 실패:', err))
  }, [])

  const handleDelete = async (bookId) => {
    if (!confirm('정말 이 책을 삭제하시겠습니까?')) return

    await fetch(`http://localhost:8080/api/book/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    setBooks(books.filter(book => book.id !== bookId))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const method = editingBook ? 'PUT' : 'POST'
    const url = editingBook
      ? `http://localhost:8080/api/book/${editingBook.id}`
      : `http://localhost:8080/api/book`

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: form.title,
        author: form.author,
        publisher: form.publisher,
        price: parseInt(form.price),
        stock_quantity: parseInt(form.stock_quantity),
        image_url: form.image_url,
        description: form.description
      })
    })

    const savedBook = await response.json()

    if (editingBook) {
      setBooks(books.map(b => b.id === savedBook.id ? savedBook : b))
      setEditingBook(null)
    } else {
      setBooks([...books, savedBook])
    }

    setForm({
      title: '',
      author: '',
      publisher: '',
      price: '',
      stock_quantity: '',
      image_url: '',
      description: ''
    })
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher || '',
      price: book.price.toString(),
      stock_quantity: book.stock_quantity?.toString() || '',
      image_url: book.image_url || '',
      description: book.description || ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header showSearch={false} />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">📚 도서 관리</h1>

        {books.length === 0 ? (
          <p className="text-gray-800">등록된 도서가 없습니다.</p>
        ) : (
          <table className="w-full border mb-8 text-gray-900">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">제목</th>
                <th className="p-2">저자</th>
                <th className="p-2">가격</th>
                <th className="p-2">수정</th>
                <th className="p-2">삭제</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} className="text-center border-t">
                  <td className="p-2 text-gray-900">{book.title}</td>
                  <td className="p-2 text-gray-900">{book.author}</td>
                  <td className="p-2 text-gray-900">{book.price.toLocaleString()}원</td>
                  <td>
                    <button
                      className="bg-yellow-400 px-3 py-1 rounded text-gray-900"
                      onClick={() => handleEdit(book)}
                    >
                      수정
                    </button>
                  </td>
                  <td>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(book.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          {editingBook ? '✏️ 도서 수정' : '➕ 새 도서 등록'}
        </h2>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 text-gray-900">
          <div>
            <label className="block mb-1 font-medium text-gray-900">제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2 rounded text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-900">저자</label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full border p-2 rounded text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-900">출판사</label>
            <input
              type="text"
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              className="w-full border p-2 rounded text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-900">가격</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 rounded text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-900">재고 수량</label>
            <input
              type="number"
              name="stock_quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-900">이미지 URL</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="w-full border p-2 rounded text-gray-900"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-900">설명</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded text-gray-900"
              rows="3"
              placeholder="도서에 대한 간단한 설명을 입력하세요"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editingBook ? '도서 수정 완료' : '도서 등록'}
            </button>
            {editingBook && (
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditingBook(null)
                  setForm({
                    title: '',
                    author: '',
                    publisher: '',
                    price: '',
                    stock_quantity: '',
                    image_url: '',
                    description: ''
                  })
                }}
              >
                수정 취소
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
