import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5002',
    withCredentials: true,
    timeout: 300000
})

export { instance }