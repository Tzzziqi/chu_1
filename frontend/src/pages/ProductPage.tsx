import { useEffect, useState } from "react";
import { deleteProduct, getAllProducts } from "../api/productApi";
import type { Product } from "../types/product";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
    Alert,
    Button,
    Card,
    Col,
    Empty,
    Input,
    message,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Typography
} from "antd";
import AddToCartButton from "../components/Cart/AddToCartButton";

const { Title, Text } = Typography;


function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"last_added" | "price_asc" | "price_desc">("last_added");
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const isAdmin = user?.role === "admin";

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
        } catch (err) {
            console.error(err);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        try {
            await deleteProduct(productId);
            message.success("Product deleted successfully");

            if (products.length === 1 && page > 1) {
                setPage((prev) => prev - 1);
                return;
            }

            fetchProducts();
        } catch (err) {
            console.error(err);
            message.error("Failed to delete product");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, pageSize, search, sort]);

    if (loading) {
        return (
            <div style={ { padding: "24px", textAlign: "center" } }>
                <Spin size="large"/>
            </div>
        );
    }

    if (error) {
        return (
            <div style={ { padding: "24px" } }>
                <Alert message={ error } type="error" showIcon/>
            </div>
        );
    }

    return (
        <div style={ { padding: "24px" } }>
            <div
                style={ {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    gap: "16px",
                    flexWrap: "wrap",
                } }
            >
                <Title level={ 2 } style={ { margin: 0 } }>
                    Products
                </Title>

                <Space wrap>
                    <Input.Search
                        placeholder="Search products"
                        allowClear
                        onSearch={ (value) => {
                            setPage(1);
                            setSearch(value.trim());
                        } }
                        onChange={ (e) => {
                            if (!e.target.value) {
                                setPage(1);
                                setSearch("");
                            }
                        } }
                        style={ { width: 240 } }
                    />

                    <Select
                        value={ sort }
                        style={ { width: 180 } }
                        onChange={ (value) => {
                            setPage(1);
                            setSort(value);
                        } }
                        options={ [
                            { value: "last_added", label: "Last added" },
                            { value: "price_asc", label: "Price: low to high" },
                            { value: "price_desc", label: "Price: high to low" },
                        ] }
                    />

                    { isAdmin && (
                        <Button type="primary" onClick={ () => navigate("/products/new") }>
                            Add Product
                        </Button>
                    ) }
                </Space>
            </div>

            { products.length === 0 ? (
                <Empty description="No products found"/>
            ) : (
                <>
                    <Row gutter={ [16, 16] }>
                        { products.map((product) => (
                            <Col xs={ 24 } sm={ 12 } md={ 8 } lg={ 6 } key={ product._id }>
                                <Card
                                    hoverable
                                    cover={
                                        product.imageUrl ? (
                                            <img
                                                src={ product.imageUrl }
                                                alt={ product.name }
                                                style={ { height: "220px", objectFit: "cover", cursor: "pointer" } }
                                                onClick={ () => navigate(`/products/${ product._id }`) }
                                            />
                                        ) : undefined
                                    }
                                >
                                    <Title
                                        level={ 4 }
                                        style={ { marginBottom: "8px", cursor: "pointer" } }
                                        onClick={ () => navigate(`/products/${ product._id }`) }
                                    >
                                        { product.name }
                                    </Title>

                                    <Text strong style={ { fontSize: "16px" } }>
                                        ${ product.price.toFixed(2) }
                                    </Text>

                                    <br/>
                                    <br/>

                                    { isAdmin ? (
                                        <Space>
                                            <Button onClick={ () => navigate(`/products/${ product._id }/edit`) }>
                                                Edit
                                            </Button>

                                            <Popconfirm
                                                title="Delete product"
                                                description="Are you sure you want to delete this product?"
                                                okText="Yes"
                                                cancelText="No"
                                                onConfirm={ () => handleDelete(product._id) }
                                            >
                                                <Button danger>
                                                    Delete
                                                </Button>
                                            </Popconfirm>
                                        </Space>
                                    ) : (
                                        <AddToCartButton
                                            productId={ product._id }
                                            price={ product.price }
                                            stock={ product.stock }
                                            fromCart={ false }
                                        />
                                    ) }
                                </Card>
                            </Col>
                        )) }
                    </Row>

                    <div style={ { marginTop: "24px", display: "flex", justifyContent: "center" } }>
                        <Pagination
                            current={ page }
                            pageSize={ pageSize }
                            total={ total }
                            onChange={ (nextPage, nextPageSize) => {
                                setPage(nextPage);
                                setPageSize(nextPageSize);
                            } }
                        />
                    </div>
                </>
            ) }
        </div>
    );
}

export default ProductPage;