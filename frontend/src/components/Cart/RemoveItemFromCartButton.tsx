import { Button } from "antd";
import type { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { updateItemQuantity } from "../../store/slices/cartSlice.ts";
import toast from "react-hot-toast";

interface RemoveItemProps {
    productId: string;
}

const RemoveItem: React.FC<RemoveItemProps> = ({ productId }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleRemove = async () => {
        try {
            await dispatch(updateItemQuantity({ productId, quantity: 0 })).unwrap();
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to remove the item from cart!', {
                duration: 3000,
                position: 'top-center',
            });
        }
    }


    return (
        <Button type="link" size="small"
                style={ { color: '#8c8c8c', textDecoration: 'underline' } }
                onClick={ handleRemove }
        >
            Remove
        </Button>
    );
};

export default RemoveItem;