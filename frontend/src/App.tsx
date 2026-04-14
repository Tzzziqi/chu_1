import { Routes, Route, Navigate } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import ProductFormPage from "./pages/ProductFormPage";
// import SignInPage from "./pages/SignInPage";
// import SignUpPage from "./pages/SignUpPage";


const { Content } = Layout
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />

      <Route path="/products" element={<ProductPage />} />
      
      <Route path="/products/new" element={<ProductFormPage />} />

      <Route path="/products/:id/edit" element={<ProductFormPage />} />

      {/* <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} /> */}
    </Routes>
  );
}

export default App;