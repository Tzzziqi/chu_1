export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
    createdBy?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductPayload {
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
    isActive?: boolean;
}

export interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: "last_added" | "price_asc" | "price_desc";
}

export interface ProductListResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}