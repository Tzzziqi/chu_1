import axiosInstance from "../api/axiosInstance";


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
    }
};

export default cartService;