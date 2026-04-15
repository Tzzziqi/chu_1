import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productApi";
import type { Product } from "../types/product";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  Card,
  Typography,
  Spin,
  Alert,
  Button,
  Row,
  Col,
} from "antd";

const { Title, Text, Paragraph } = Typography;

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

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
      <Row gutter={24}>
        {/* 左边：图片 */}
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

        {/* 右部分 */}
        <Col xs={24} md={12}>
          <Title level={2}>{product.name}</Title>

          <Text type="secondary">{product.category}</Text>

          <br />
          <br />

          <Title level={3}>${product.price}</Title>

          <Paragraph>{product.description}</Paragraph>

          {/* admin才能看到stock */}
          {isAdmin && (
            <>
              <Text>Stock: {product.stock}</Text>
              <br />
              <br />
            </>
          )}

          {/* user */}
          {!isAdmin && (
            <>
              {/* 数量选择 */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "16px",
                }}
              >
                <Button
                  type="text"
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                >
                  -
                </Button>

                <div
                  style={{
                    minWidth: "40px",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {quantity}
                </div>

                <Button
                  type="text"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </Button>
              </div>

              <br />

              <Button
                type="primary"
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/signin");
                    return;
                  }

                  console.log("Add to cart:", product._id, quantity);
                  // TODO: 接 cart API / redux
                }}
              >
                Add to Cart
              </Button>
            </>
          )}

          {/* admin */}
          {isAdmin && (
            <Button
              onClick={() => navigate(`/products/${product._id}/edit`)}
            >
              Edit Product
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ProductDetailPage;