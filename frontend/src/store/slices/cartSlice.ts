import type { CartItem, CartSummary } from "../../types/cart.ts";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartService, { type UpdateItemProps } from "../../services/cartService";
import axios from "axios";


export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, thunkAPI) => {
        try {
            return await cartService.getCart();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Unknown error');
        }
    }
);

export const getCartWithPromo = createAsyncThunk(
    'cart/getCartWithPromo',
    async (promotionCode: string, thunkAPI) => {
        try {
            return await cartService.getCart(promotionCode);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Unknown error');
        }
    }
);

export const updateItemQuantity = createAsyncThunk(
    'cart/updateItemQuantity',
    async (props: UpdateItemProps, thunkAPI) => {
        try {
            return await cartService.updateItemQuantity(props);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Unknown error');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, thunkAPI) => {
        try {
            return await cartService.clearCart();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Unknown error');
        }
    }
);

export const checkout = createAsyncThunk(
    'cart/checkout',
    async (_, thunkAPI) => {
        try {
            return await cartService.checkout();
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Unknown error');
        }
    }
);

interface CartState {
    items: CartItem[];
    backupItems: CartItem[];
    summary: CartSummary;
    backupSummary: CartSummary | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const emptySummary = {
    'subtotal': '0.00',
    'tax': '0.00',
    'discount': '0.00',
    'estimatedTotal': '0.00',
    'itemTotalCount': 0,
};

const initialState: CartState = {
    items: [],
    backupItems: [],
    summary: emptySummary,
    backupSummary: null,
    status: 'idle',
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateQuantityOptimistically: (state, action) => {
            const { productId, quantity, price, stock } = action.payload;

            if (!state.backupSummary) {
                state.backupItems = JSON.parse(JSON.stringify(state.items));
                state.backupSummary = JSON.parse(JSON.stringify(state.summary));
            }

            const item = state.items.find(item => item.product._id === productId);
            let currentSubtotal = Number(state.summary.subtotal);
            let currentItemTotalCount = Number(state.summary.itemTotalCount);

            if (item) {
                const quantityDiff = quantity - item.quantity;
                currentSubtotal += quantityDiff * price;
                currentItemTotalCount += quantityDiff;
                item.quantity = quantity;
            } else if (price) {
                currentSubtotal += quantity * price;
                currentItemTotalCount += quantity;
                state.items.push({ product: { _id: productId, price: price.toFixed(2), stock }, quantity });
            }

            state.summary.subtotal = currentSubtotal.toFixed(2);
            state.summary.itemTotalCount = currentItemTotalCount;
        }
    },
    extraReducers: (builder) => {
        builder
            // getCart
            .addCase(getCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.summary = action.payload.summary;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // getCartWithPromo
            .addCase(getCartWithPromo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCartWithPromo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.summary = action.payload.summary;
            })
            .addCase(getCartWithPromo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // updateItemQuantity
            .addCase(updateItemQuantity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateItemQuantity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.summary = action.payload.summary;
                state.backupItems = [];
                state.backupSummary = null;
            })
            .addCase(updateItemQuantity.rejected, (state, action) => {
                state.status = 'failed';
                if (state.backupSummary) {
                    state.items = state.backupItems;
                    state.summary = state.backupSummary || emptySummary;
                    state.backupItems = [];
                    state.backupSummary = null;
                }
                state.error = action.payload as string;
            })

            // clearCart
            .addCase(clearCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.summary = action.payload.summary;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // checkout
            .addCase(checkout.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkout.fulfilled, (state) => {
                state.status = 'succeeded';
                state.items = []
                state.summary = emptySummary;
            })
            .addCase(checkout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
    },
});

export const { updateQuantityOptimistically } = cartSlice.actions;
export default cartSlice.reducer;