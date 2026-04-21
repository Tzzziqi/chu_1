import type { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { checkout } from "../../store/slices/cartSlice.ts";
import toast from "react-hot-toast";
import { Button } from "antd";
import styled from "styled-components";

const Checkout = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handleCheckout = async () => {
        try {
            await dispatch(checkout()).unwrap();
            toast.dismiss();
            toast.success('Checkout Successfully!', {
                duration: 3000,
                position: 'top-center',
            });
        } catch (error) {
            toast.dismiss();
            toast.error(`Failed to checkout the item from cart! ${error}`, {
                duration: 3000,
                position: 'top-center',
            });
        }
    }

    return (
        <CheckoutButton
            type="primary"
            block
            size="large"
            onClick={ handleCheckout }
        >
            Continue to checkout
        </CheckoutButton>
    )
}

export default Checkout;

const CheckoutButton = styled(Button)`
    && {
        height: 56px;
        font-size: 18px;
        font-weight: bold;
        border-radius: 8px;
        background-color: #5c67f2; 
    }
`;