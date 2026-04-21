import axiosInstance from "../api/axiosInstance";
import axios from "axios";


export interface UpdateItemProps {
    productId: string;
    quantity: number;
    price?: number;
}

const cartService = {
    getCart: async (promotionCode?: string) => {
        let response;
        if (!promotionCode) {
            response = await axiosInstance.get('/cart');
        } else {
            response = await axiosInstance.get(`/cart?promotionCode=${ promotionCode }`);
        }
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch cart!');
        }
        return response.data.cart;
    },

    updateItemQuantity: async ({ productId, quantity }: UpdateItemProps) => {
        const response = await axiosInstance.patch(`/cart/${ productId }`, { quantity });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to add item to cart!');
        }
        return response.data.cart;
    },

    clearCart: async () => {
        const response = await axiosInstance.delete('/cart');
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to clear the cart!');
        }
        return response.data.cart;
    },

    checkout: async () => {
        try {
            const response = await axiosInstance.delete('/cart/checkout');
            return response.data.cart;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message || '';
                throw new Error(message);
            }
        }
    }
};

export default cartService;