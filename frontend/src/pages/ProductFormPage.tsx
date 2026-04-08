import { useState } from "react";
import { Alert, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../api/productApi";
import type { ProductPayload } from "../types/product";

const { Title } = Typography;

function ProductFormPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (values: ProductPayload) => {
    try {
      setLoading(true);
      setError("");
      await createProduct(values);
      message.success("Product created successfully");
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "720px", margin: "0 auto" }}>
      <Card>
        <Title level={2}>Create Product</Title>

        {error && (
          <div style={{ marginBottom: "16px" }}>
            <Alert message={error} type="error" showIcon />
          </div>
        )}

        <ProductForm loading={loading} onFinish={handleCreate} />
      </Card>
    </div>
  );
}

export default ProductFormPage;