import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://10.105.2.18:3001',
})
