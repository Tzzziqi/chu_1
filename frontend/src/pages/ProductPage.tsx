import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import type { Product } from "../types/product";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Button, Card, Col, Row, Spin, Empty, Alert, Typography,
  Input, Select, Pagination, Space, } from "antd";

const { Title, Text } = Typography;


function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("last_added");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);


  const handleDecrease = (productId: string) => {
    setQuantityMap((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) - 1, 1),
    }));
  };

  const handleIncrease = (productId: string, stock: number) => {
    setQuantityMap((prev) => ({
      ...prev,
      [productId]: Math.min((prev[productId] || 1) + 1, stock),
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProducts({
          page,
          limit: pageSize,
          search,
          sort,
        });

        setProducts(data.products);
        setTotal(data.total);

        setQuantityMap((prev) => {
          const nextQuantityMap: Record<string, number> = {};
          data.products.forEach((product: Product) => {
            nextQuantityMap[product._id] = prev[product._id] || 1;
          });
          return nextQuantityMap;
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize, search, sort]);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Products
        </Title>

        <Space wrap>
          <Input.Search
            placeholder="Search products"
            allowClear
            onSearch={(value) => {
              setPage(1);
              setSearch(value.trim());
            }}
            onChange={(e) => {
              if (!e.target.value) {
                setPage(1);
                setSearch("");
              }
            }}
            style={{ width: 240 }}
          />

          <Select
            value={sort}
            style={{ width: 180 }}
            onChange={(value) => {
              setPage(1);
              setSort(value);
            }}
            options={[
              { value: "last_added", label: "Last added" },
              { value: "price_asc", label: "Price: low to high" },
              { value: "price_desc", label: "Price: high to low" },
            ]}
          />

          {isAdmin && (
            <Button type="primary" onClick={() => navigate("/products/new")}>
              Add Product
            </Button>
          )}
        </Space>
      </div>

      {products.length === 0 ? (
        <Empty description="No products found" />
      ) : (
        <>
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
                        style={{ height: "220px", objectFit: "cover", cursor: "pointer" }}
                        onClick={() => navigate(`/products/${product._id}`)}
                      />
                    ) : undefined
                  }
                >
                  <Title
                    level={4}
                    style={{ marginBottom: "8px", cursor: "pointer" }}
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {product.name}
                  </Title>

                  <Text strong style={{ fontSize: "16px" }}>
                    Price: ${product.price}
                  </Text>

                  <br />
                  <br />

                  {isAdmin ? (
                    <Button onClick={() => navigate(`/products/${product._id}/edit`)}>
                      Edit
                    </Button>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid #d9d9d9",
                          borderRadius: "8px",
                          overflow: "hidden",
                          marginBottom: "12px",
                        }}
                      >
                        <Button
                          type="text"
                          onClick={() => handleDecrease(product._id)}
                          style={{ borderRadius: 0 }}
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
                          {quantityMap[product._id] || 1}
                        </div>

                        <Button
                          type="text"
                          onClick={() => handleIncrease(product._id, product.stock)}
                          style={{ borderRadius: 0 }}
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

                          const quantity = quantityMap[product._id] || 1;
                          console.log("Add to cart:", product._id, "quantity:", quantity);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(nextPage, nextPageSize) => {
                setPage(nextPage);
                setPageSize(nextPageSize);
              }}
              showSizeChanger
              pageSizeOptions={["4", "8", "12", "16"]}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductPage;