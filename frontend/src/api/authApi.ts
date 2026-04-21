/**
 * Encapsulate Auth API requests into functions.
 Call `authApi.signin(...)` directly within `authSlice`.
 If the API path changes, you only need to modify this single file.
 */

import axiosInstance from './axiosInstance'

const authApi = {
    signup: async (data: { email: string; password: string }) => {
        const response = await axiosInstance.post('/auth/signup', data)
        return response.data
    },
    signin: async (data: { email: string; password: string }) => {
        const response = await axiosInstance.post('/auth/signin', data)
        return response.data
    },
    updatePassword: async (data: { oldPassword: string; newPassword: string }) => {
        const response = await axiosInstance.put('/auth/password', data)
        return response.data
    },
}

export default authApi

