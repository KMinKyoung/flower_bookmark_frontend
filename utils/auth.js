// utils/auth.js
export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token'); 
  }
  return null;
}
