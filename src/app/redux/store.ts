import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import menuReducer from './features/menu/menuSlice'
import paymentDataReducer from './features/payment/paymentDataSlice'
import policyReducer from './features/policy/policySlice'
import customerQuoteReducer from './features/policy/customerQuoteSlice'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'

import { apiSlice } from './rtkQuerySlice/apiSlice'
import propertyReducer from './features/property/propertySlice'
import encryptedMobEmailReducer from './features/encryptedMobEmail/encryptedMobEmail'

const persistConfig = {
    key: 'root',
    blacklist: [
        apiSlice.reducerPath,
        paymentDataReducer.name,
        menuReducer.name,
        encryptedMobEmailReducer.name
    ],
    version: 1,
    storage
}

const reducer = combineReducers({
    auth: authReducer,
    menu: menuReducer,
    policy: policyReducer,
    updateProperty: propertyReducer,
    payment: paymentDataReducer,
    customerQuotation: customerQuoteReducer,
    encryptedMobEmail:encryptedMobEmailReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
