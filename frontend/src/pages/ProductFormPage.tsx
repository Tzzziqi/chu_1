import { useEffect, useState } from "react";
import { Alert, Button, Card, message, Space, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct, getProductById, updateProduct } from "../api/productApi";
import type { ProductPayload } from "../types/product";

const { Title } = Typography;

function ProductFormPage() {
    const { id } = useParams();
    const isEdit = !!id;
    const [initialValues, setInitialValues] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!isEdit || !id) return;

            try {
                setLoading(true);
                const data = await getProductById(id);
                setInitialValues(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, isEdit]);

    const handleSubmit = async (values: ProductPayload) => {
        try {
            setLoading(true);
            setError("");

            if (isEdit && id) {
                await updateProduct(id, values);
                message.success("Product updated successfully");
            } else {
                await createProduct(values);
                message.success("Product created successfully");
            }

            navigate("/products");
        } catch (err) {
            console.error(err);
            setError(isEdit ? "Failed to update product" : "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={ { padding: "24px", maxWidth: "720px", margin: "0 auto" } }>
            <Space style={ { marginBottom: "16px" } }>
                <Button onClick={ () => navigate("/products") }>
                    ← Back to Products
                </Button>
            </Space>
            <Card>
                <Title level={ 2 }>{ isEdit ? "Edit Product" : "Create Product" }</Title>

                { error && (
                    <div style={ { marginBottom: "16px" } }>
                        <Alert message={ error } type="error" showIcon/>
                    </div>
                ) }

                <ProductForm
                    loading={ loading }
                    onFinish={ handleSubmit }
                    initialValues={ initialValues }
                    isEdit={ isEdit }
                />
            </Card>
        </div>
    );
}


export default ProductFormPage;