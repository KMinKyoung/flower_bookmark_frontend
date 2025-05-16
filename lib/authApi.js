import axios from 'axios'

const authApi = axios.create({
  baseURL: 'http://localhost:8080/auth',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default authApi
