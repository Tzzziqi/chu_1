import { Button, Typography } from "antd";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import type { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { updateItemQuantity } from "../../store/slices/cartSlice.ts";
import { useEffect } from "react";
import { useState } from "react";
import toast from 'react-hot-toast';


const { Text } = Typography;

interface AddToCartButtonProps {
    productId: string;
    price: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, price }) => {
    const dispatch = useDispatch<AppDispatch>();

    const reduxQuantity = useSelector((state: RootState) => state.cart.items.find(item => item.product._id === productId)?.quantity || 0);
    const [quantity, setQuantity] = useState(reduxQuantity);

    useEffect(() => {
        setQuantity(reduxQuantity);
    }, [reduxQuantity]);

    const handleUpdate = async (newQty: number) => {
        setQuantity(newQty);
        try {
            await dispatch(updateItemQuantity({ productId, quantity: newQty, price })).unwrap();
            toast.success('Successfully updated to cart!');
        } catch (error) {
            toast.error('Failed to update the cart!', {
                duration: 3000,
                position: 'top-center',
            });
        }

    }

    return (
        <div style={ { width: '25%' } }>
            { quantity === 0 ?
                <Button
                    type="primary"
                    block
                    icon={<ShoppingCartOutlined />}
                    style={{ borderRadius: '8px', backgroundColor: '#5c67f2' }}
                    onClick={ () => handleUpdate(1) }
                >
                    Add
                </Button>
                :
                <div style={ {
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: '#5c67f2', borderRadius: '8px', padding: '0 8px', height: '32px', color: 'white'
                } }>
                    <MinusOutlined
                        style={ { cursor: 'pointer', fontSize: '12px' } }
                        onClick={ () => handleUpdate(quantity - 1) }
                    />
                    <Text style={ { color: 'white', fontWeight: 'bold' } }>{ quantity }</Text>
                    <PlusOutlined
                        style={ { cursor: 'pointer', fontSize: '12px' } }
                        onClick={ () => handleUpdate(quantity + 1) }
                    />
                </div> }
        </div>
    )
}

export default AddToCartButton;