import { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Switch, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { ProductPayload } from "../types/product";
import { uploadProductImage } from "../api/productApi";

type ProductFormProps = {
  initialValues?: ProductPayload;
  loading?: boolean;
  onFinish: (values: ProductPayload) => void;
  isEdit?: boolean;
};

function ProductForm({
  initialValues,
  loading = false,
  onFinish,
  isEdit = false,
}: ProductFormProps) {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      imageUrl: "",
      isActive: true,
      ...initialValues,
    });
  }, [initialValues, form]);

  const handleUpload = async (file: File) => {
  try {
    setUploading(true);
    const imageUrl = await uploadProductImage(file);
    form.setFieldValue("imageUrl", imageUrl);
    message.success("Image uploaded successfully");
  } catch (error) {
    console.error(error);
    message.error("Failed to upload image");
  } finally {
    setUploading(false);
  }

  return false;
};

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
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
        <Input placeholder="Uploaded image URL will appear here" />
      </Form.Item>

      <Form.Item label="Upload Image">
        <Upload
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} loading={uploading}>
            Upload Image
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item shouldUpdate>
        {() => {
          const imageUrl = form.getFieldValue("imageUrl");
          return imageUrl ? (
            <img
              src={imageUrl}
              alt="preview"
              style={{
                width: "160px",
                marginTop: "8px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          ) : null;
        }}
      </Form.Item>

      <Form.Item label="Active" name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? "Update Product" : "Save Product"}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ProductForm;