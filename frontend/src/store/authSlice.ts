import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authApi from '../api/authApi'

interface User {
  id: string
  email: string
  role: 'user' | 'admin' // normal user === user and admin user === admin, the User is a type, do not get conufsed.
}

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
}

// initialization. we want to check if there is a token in localStorage when the app starts, 
// if there is, we set the user and token in the state, and set isLoggedIn to true. if there is no token, we set the user and token to null, and set isLoggedIn to false.
// const tokenFromStorage = localStorage.getItem('token')
// const userFromStorage = localStorage.getItem('user')

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
}

// ======= Async action: pending, fulfilled, rejected =======
export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(credentials) // call the API function, which will send a POST request to the backend, and return the response data, which contains the token and user info.
      // after singup, save user's info to local STorage so that the user can stay logged in even after refreshing the page.
      // localStorage.setItem('token', response.data.token)
      // localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data // return data to fulfilled's action payload
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.signin(credentials)
      // localStorage.setItem('token', response.data.token)
      // localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwords: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.updatePassword(passwords) // call the upatePass API. Put request to backend, and return the response data, which contains the new token and user info.
      // localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error: any) { 
      return rejectWithValue(error.response?.data?.message || 'Update failed')
    }
  }
)
 // ======- create Slice ======
const authSlice = createSlice({
  name: 'auth',
  initialState, // initial state, defined above.
  // reducer is synchronous actio, can change the state
  reducers: {
    // logout: clear all state and clear teh localStroage
    logout: (state) => {
      state.user = null
      state.token = null
      state.isLoggedIn = false
      state.error = null
      // localStorage.removeItem('token')
      // localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
  },

  // dea with async actions (crete Async Thunk), has three phase
  extraReducers: (builder) => {
    // signup three phase: pending, fulfilled, rejected.
    builder
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false; state.isLoggedIn = true
        state.user = action.payload.user; state.token = action.payload.token
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string
      })
    
    // login three phase: pending, fulfilled, rejected.
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false; state.isLoggedIn = true
        state.user = action.payload.user; state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string
      })
    
      // updatePassword three phase: pending, fulfilled, rejected.
    builder
      .addCase(updatePassword.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false; state.token = action.payload.token // only upate the token, the user info stay the same
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

/**
 * Store token in TWO places:
Redux (in memory):	For components to read immediately
localStorage (in disk: persistent):To restore login state after page refresh
 */