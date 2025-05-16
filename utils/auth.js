// utils/auth.js
export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token'); // ✅ access_token 으로 수정!
  }
  return null;
}
