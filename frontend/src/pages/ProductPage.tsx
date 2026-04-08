import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import type { Product } from "../types/product";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Spin, Empty, Alert, Typography } from "antd";

const { Title, Text } = Typography;

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Products</Title>

      {products.length === 0 ? (
        <Empty description="No products found" />
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Card
                hoverable
                cover={
                  product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  ) : undefined
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <Title level={2} style={{ margin: 0 }}>
                    Products
                  </Title>

                  <Button type="primary" onClick={() => navigate("/products/new")}>
                    Add Product
                  </Button>
                </div>
                <Text type="secondary">{product.category}</Text>
                <br />
                <Text>{product.description}</Text>
                <br />
                <br />
                <Text strong>Price: ${product.price}</Text>
                <br />
                <Text>Stock: {product.stock}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ProductPage;