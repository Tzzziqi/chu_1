import { Button } from "antd";
import type { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { updateItemQuantity } from "../../store/slices/cartSlice.ts";
import toast from "react-hot-toast";
import styled from "styled-components";

interface RemoveItemProps {
    productId: string;
}

const RemoveItem: React.FC<RemoveItemProps> = ({ productId }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleRemove = async () => {
        try {
            await dispatch(updateItemQuantity({ productId, quantity: 0 })).unwrap();
            toast.dismiss();
            toast.success('Remove item Successfully!', {
                duration: 3000,
                position: 'top-center',
            });
        } catch {
            toast.dismiss();
            toast.error('Failed to remove the item from cart!', {
                duration: 3000,
                position: 'top-center',
            });
        }
    }


    return (
        <RemoveItemButton
            type="link"
            size="small"
            onClick={ handleRemove }
        >
            Remove
        </RemoveItemButton>
    );
};

export default RemoveItem;

const RemoveItemButton = styled(Button)`
    && {
        color: #8c8c8c !important;
        text-decoration: underline;
    }

    &:hover {
        color: #595959 !important;
    }
`;