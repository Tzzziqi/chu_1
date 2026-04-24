export interface CartItem {
    _id?: string;
    user?: string;
    product: {
        _id: string;
        name?: string;
        imageUrl?: string;
        price: string;
        stock: number;
    }
    quantity: number;
}

export interface CartSummary {
    subtotal: string;
    tax: string;
    discount: string;
    estimatedTotal: string;
    itemTotalCount: number;
}

export interface Cart {
    items: CartItem[];
    summary: CartSummary;
}

export interface CartResponse {
    success: boolean;
    message?: string;
    cart: Cart;
}