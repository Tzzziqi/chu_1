// for everyone to use axios instance
import axios from 'axios'
import { store } from '../store'

// create an axios instance so every API can use it and the setting is centralized.
const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000, // 10 sec
    headers: { 'Content-Type': 'application/json' }
}) // tell the backend(web server- express) we are sending json data, and the backend can parse it correctly.

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token')
        const token = store.getState().auth.token // read from redux
        if (token) {
            config.headers.Authorization = `Bearer ${ token }`
        }
        return config // has to return the config, otherwise the request will not be sent.
    },
    (error) => Promise.reject(error)
)

// Response Interceptor: 401 Unauthorized, token expired, etc.
axiosInstance.interceptors.response.use(
    (response) => response, // success response with 2xx code, just return it, do not need to do anything.
    (error) => {
        // 401 = Unauthorized, which means the token is invalid or expired, we need to remove the token and user info from localStorage, and redirect to signin page.
        if (error.response?.status == 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/signin'
        }
        return Promise.reject(error) // need to return the rejected promise, otherwise the error will not be propagated to the component that made the API call, and the component will not know that there is an error and cannot show the error message to the user.
    })
export default axiosInstance