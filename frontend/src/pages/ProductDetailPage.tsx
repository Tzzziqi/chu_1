import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import type { Product } from "../types/product";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import AddToCartButton from "../components/Cart/AddToCartButton.tsx";

const { Title, Text, Paragraph } = Typography;

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id!);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert message={error || "Product not found"} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* 返回按钮 */}
      <Space style={{ marginBottom: "16px" }}>
        <Button onClick={() => navigate("/products")}>
          ← Back to Products
        </Button>
      </Space>

      <Row gutter={24}>
        {/* 左：图片 */}
        <Col xs={24} md={12}>
          <Card>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "100%", objectFit: "cover" }}
              />
            )}
          </Card>
        </Col>

        {/* 右：信息 */}
        <Col xs={24} md={12}>
          <Title level={2}>{product.name}</Title>

          <Text type="secondary">{product.category}</Text>

          <br />
          <br />

          <Title level={3}>${product.price.toFixed(2)}</Title>

          <Paragraph>{product.description}</Paragraph>

          {/* admin 才能看到 stock */}
          {isAdmin && (
            <>
              <Text>Stock: {product.stock}</Text>
              <br />
              <br />
            </>
          )}

          {/* user */}
          {!isAdmin && (
            <AddToCartButton
              productId={product._id}
              price={product.price}
              stock={product.stock}
              fromCart={false}
            />
          )}

          {/* admin */}
          {isAdmin && (
            <Button onClick={() => navigate(`/products/${product._id}/edit`)}>
              Edit Product
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ProductDetailPage;