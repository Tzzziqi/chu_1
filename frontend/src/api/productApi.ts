import axiosInstance from "./axiosInstance";
import type { GetProductsParams, Product, ProductListResponse, ProductPayload } from "../types/product";

export const getAllProducts = async (
    params: GetProductsParams = {}
): Promise<ProductListResponse> => {
    const res = await axiosInstance.get("/products", { params });
    return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const res = await axiosInstance.get(`/products/${ id }`);
    return res.data;
};

export const createProduct = async (data: ProductPayload): Promise<Product> => {
    const res = await axiosInstance.post("/products", data);
    return res.data;
};

export const updateProduct = async (
    id: string,
    data: ProductPayload
): Promise<Product> => {
    const res = await axiosInstance.put(`/products/${ id }`, data);
    return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${ id }`);
};

export const uploadProductImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosInstance.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data.imageUrl;
};