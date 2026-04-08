import { Button, Form, Input, InputNumber, Switch } from "antd";
import type { ProductPayload } from "../types/product";

type ProductFormProps = {
  initialValues?: ProductPayload;
  loading?: boolean;
  onFinish: (values: ProductPayload) => void;
};

function ProductForm({
  initialValues,
  loading = false,
  onFinish,
}: ProductFormProps) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        name: "",
        description: "",
        category: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        isActive: true,
        ...initialValues,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Product Name"
        name="name"
        rules={[{ required: true, message: "Please enter product name" }]}
      >
        <Input placeholder="Enter product name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter description" }]}
      >
        <Input.TextArea rows={4} placeholder="Enter product description" />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: "Please enter category" }]}
      >
        <Input placeholder="Enter category" />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Please enter price" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Stock"
        name="stock"
        rules={[{ required: true, message: "Please enter stock" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Image URL" name="imageUrl">
        <Input placeholder="Enter image URL" />
      </Form.Item>

      <Form.Item label="Active" name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Product
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ProductForm;