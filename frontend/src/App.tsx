import { Routes, Route, Navigate } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
// import SignInPage from "./pages/SignInPage";
// import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />

      <Route path="/products" element={<ProductPage />} />

      {/* <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} /> */}
    </Routes>
  );
}

export default App;