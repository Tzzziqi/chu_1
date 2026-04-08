import axiosInstance from "./axiosInstance";
import type { Product, ProductPayload } from "../types/product";

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get("/products");
  return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get(`/products/${id}`);
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
  const res = await axiosInstance.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};