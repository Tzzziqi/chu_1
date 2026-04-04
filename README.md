
# Product Management System

A full-stack product management system that supports role-based access control, including **admin** and **regular users**, with features such as authentication, product CRUD operations, and cart management.

---

## Project Overview

This system simulates a real-world B2C platform (e.g., Amazon, Walmart), where:

- **Admin users (vendors)** can create, edit, and delete products
- **Regular users (customers)** can browse products and manage their cart

The system is designed with a focus on:
- Reusable components
- Clean API design
- State consistency
- Responsive UI

---

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- React Router
- Axios
- React Hook Form + Zod (form validation)

### Backend
- Node.js + Express
- JWT Authentication
- bcrypt (password hashing)

---

## Features

### 🔐 Authentication (Yu Ma)
- Sign up / Sign in / Update password
- Role-based access (admin vs user)
- Persistent login state (localStorage or token)

### 🛍️ Product Management (Ziqi)
- Product list (with pagination & search)
- Product detail page
- Create / Edit / Delete products (admin only)
- Reusable form component

### 🛒 Cart System (Shaoen)
- Add to cart
- Update quantity
- Remove items
- Price calculation with promotion code
- Cart persistence (localStorage or backend)

### ⚠️ Error Handling
- Global error boundary (frontend)
- Structured API error responses

---

## Project Structure


