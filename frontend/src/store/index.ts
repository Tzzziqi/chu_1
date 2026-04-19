// use redux presit to auto save data to localStorage but it's wrapped with Redux

// import storage from 'redux-persist/lib/storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
// 队友后面加：
// import productReducer from './productSlice'

// because the commonJs and ES Module compatibility problems, has to hand write the storge, import it's not working
const storage = {
    getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
}
// in lS: key is 'presist:root' and all JSON file. storage means use LS as save engine and redux will read from it
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'product', 'cart']
}


const rootReducer = combineReducers({
    auth: authReducer, // refresh the page, still remember your info
    // product: productReducer,
    cart: cartReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch