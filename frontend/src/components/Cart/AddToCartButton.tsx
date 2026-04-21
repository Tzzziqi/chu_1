import { Button, Typography } from "antd";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import type { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { updateItemQuantity, updateQuantityOptimistically } from "../../store/slices/cartSlice";
import { useEffect, useMemo, useState } from "react";
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import styled, { css } from 'styled-components';


const { Text } = Typography;

interface AddToCartButtonProps {
    productId: string;
    price: number;
    stock: number;
    fromCart: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, price, stock, fromCart }) => {
    const dispatch = useDispatch<AppDispatch>();

    const reduxQuantity = useSelector((state: RootState) => state.cart.items.find(item => item.product._id === productId)?.quantity || 0);
    const [quantity, setQuantity] = useState(reduxQuantity);

    useEffect(() => {
        setQuantity(reduxQuantity);
    }, [reduxQuantity]);

    const debouncedDispatch = useMemo(
        () =>
            debounce(async (newQty: number) => {
                try {
                    await dispatch(updateItemQuantity({ productId, quantity: newQty, price })).unwrap();
                    toast.dismiss();
                    toast.success('Successfully update the cart!', {
                        duration: 3000,
                    });
                } catch {
                    toast.dismiss();
                    toast.error('Failed to update the cart!', {
                        duration: 3000,
                        position: 'top-center',
                    });
                }
            }, 500),
        [dispatch, productId, price]
    )

    const handleUpdate = async (newQty: number) => {
        if (newQty <= stock) {
            setQuantity(newQty);
            dispatch(updateQuantityOptimistically({ productId, quantity: newQty, price }));
            debouncedDispatch(newQty);
        } else {
            toast.dismiss();
            toast.error('You have reached the stock limit', {
                duration: 1000
            });
        }
    }

    return (
        <Container $fromCart={ fromCart }>
            { quantity === 0 && !fromCart ?
                <Button
                    type="primary"
                    block
                    icon={ <ShoppingCartOutlined/> }
                    style={ { borderRadius: '8px', backgroundColor: '#5c67f2' } }
                    onClick={ () => handleUpdate(1) }
                >
                    Add
                </Button>
                :
                <SelectorContainer $fromCart={ fromCart }>
                    <ActionButton
                        type="text"
                        size="small"
                        icon={ <MinusOutlined style={ { fontSize: fromCart ? '10px' : '12px' } }/> }
                        onClick={ () => handleUpdate(quantity - 1) }
                        $fromCart={ fromCart }
                    />

                    <QuantityValue $fromCart={ fromCart }>
                        { quantity }
                    </QuantityValue>

                    <ActionButton
                        type="text"
                        size="small"
                        icon={ <PlusOutlined style={ { fontSize: fromCart ? '10px' : '12px' } }/> }
                        onClick={ () => handleUpdate(quantity + 1) }
                        $fromCart={ fromCart }
                    />
                </SelectorContainer>
            }
        </Container>
    )
}

export default AddToCartButton;

const Container = styled.div<{ $fromCart?: boolean }>`
    width: ${ props => (props.$fromCart ? '35%' : '25%') };
`;

const SelectorContainer = styled.div<{ $fromCart?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;

    ${ props => props.$fromCart
            ? css`
                border-radius: 4px;
                background-color: transparent;
                border: 1px solid #d9d9d9;
                padding: 0;
            `
            : css`
                border-radius: 8px;
                background-color: #5c67f2;
                border: 1px solid #5c67f2;
                padding: 0 8px;
                color: white;
            ` }
`;

const QuantityValue = styled(Text)<{ $fromCart?: boolean }>`
    && {
        display: inline-block;
        white-space: nowrap;
        text-align: center;
        font-weight: bold;

        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        ${ props =>
                props.$fromCart
                        ? css`
                            color: rgba(0, 0, 0, 0.88);
                            min-width: 40px;
                            font-size: 14px;
                            padding: 0 8px;
                            height: 100%;
                        `
                        : css`
                            color: white;
                            padding: 0 4px;
                        ` }
    }
`;

const ActionButton = styled(Button)<{ $fromCart?: boolean }>`
    && {
        color: ${ props => (props.$fromCart ? 'inherit' : 'white') };
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;