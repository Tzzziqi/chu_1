import { Button, Divider, Drawer, List, Popconfirm, Space, Spin, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import PromoCodeInput from "./ApplyPromoButton";
import RemoveItem from "./RemoveItemFromCartButton";
import AddToCartButton from "./AddToCartButton";
import styled from "styled-components";
import { clearCart } from "../../store/slices/cartSlice";
import toast from "react-hot-toast";

const { Text } = Typography;

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}


const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const dispatch = useDispatch<AppDispatch>();


    const ClearTheCart = async () => {
        try {
            await dispatch(clearCart()).unwrap();
            toast.dismiss();
            toast.success('Successfully clear the cart!', {
                duration: 3000,
            });
        } catch {
            toast.dismiss();
            toast.error('Failed to clear the cart!', {
                duration: 3000,
                position: 'top-center',
            });
        }
    }

    const { items, summary, status } = useSelector((state: RootState) => state.cart);

    return (
        <Drawer
            title={
                <HeaderContainer>
                    <TitleText>
                        Cart ({ summary.itemTotalCount })
                    </TitleText>
                    { items.length > 0 && (
                        <Popconfirm
                            title='Clear the cart?'
                            description='This will remove all the items in your cart.'
                            onConfirm={ ClearTheCart }
                            okText='Yes, Clear'
                            cancelText='No'
                            okButtonProps={ { danger: true } }
                        >
                            <ClearButton type="text" size="small">
                                Clear All
                            </ClearButton>
                        </Popconfirm>
                    ) }

                </HeaderContainer>

            }
            placement="right"
            onClose={ onClose }
            open={ isOpen }
            size={ 450 }
            styles={ { header: { background: '#5c67f2', border: 'none' } } }
            closeIcon={ <CloseOutlined style={ { color: 'white' } }/> }

            footer={
                <div style={ { padding: '12px 20px 20px 20px', backgroundColor: '#ffffff' } }>
                    <PromoCodeInput/>

                    <Divider style={ { margin: '0 0 20px 0' } }/>


                    <Space orientation="vertical" size={ 12 } style={ { width: '100%', marginBottom: '24px' } }>
                        <div style={ { display: 'flex', justifyContent: 'space-between' } }>
                            <Text style={ { color: '#8c8c8c' } }>Subtotal</Text>
                            <Text strong>${ summary.subtotal }</Text>
                        </div>
                        <div style={ { display: 'flex', justifyContent: 'space-between' } }>
                            <Text style={ { color: '#8c8c8c' } }>Tax</Text>
                            <Text strong>${ summary.tax }</Text>
                        </div>
                        <div style={ { display: 'flex', justifyContent: 'space-between' } }>
                            <Text style={ { color: '#8c8c8c' } }>Discount</Text>
                            <Text strong style={ { color: '#f5222d' } }>-${ summary.discount }</Text>
                        </div>
                    </Space>

                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    } }>
                        <Text strong style={ { fontSize: '18px' } }>Estimated total</Text>
                        <Text strong style={ { fontSize: '24px' } }>${ summary.estimatedTotal }</Text>
                    </div>


                    <Button
                        type="primary"
                        block
                        size="large"
                        style={ {
                            height: '56px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            backgroundColor: '#5c67f2'
                        } }
                    >
                        Continue to checkout
                    </Button>
                </div>
            }
        >
            { status === 'loading' ? (
                <div style={ { textAlign: 'center', padding: '50px' } }>
                    <Spin size='large' tip='loading...'/>
                </div>
            ) : (
                <List
                    dataSource={ items }
                    renderItem={ (item) => (
                        <List.Item
                            key={ item._id }
                            style={ {
                                padding: '16px',
                                border: '1px solid #f0f0f0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                marginBottom: '16px',
                                backgroundColor: '#fff',
                            } }
                        >
                            <div style={ { display: 'flex', gap: '16px', width: '100%' } }>
                                <div style={ {
                                    width: '90px',
                                    height: '90px',
                                    background: '#f5f5f5',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                } }>
                                    <img src={ item.product.imageUrl } alt={ item.product.name }
                                         style={ { width: '100%', height: '100%', objectFit: 'contain' } }/>
                                </div>


                                <div style={ { flex: 1 } }>
                                    <div style={ {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '12px'
                                    } }>
                                        <Text strong
                                              style={ {
                                                  fontSize: '15px',
                                                  maxWidth: '200px'
                                              } }>{ item.product.name }</Text>
                                        <Text style={ {
                                            color: '#5c67f2',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            whiteSpace: 'nowrap'
                                        } }>
                                            ${ (parseFloat(item.product.price) * item.quantity).toFixed(2) }
                                        </Text>
                                    </div>

                                    <div style={ {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    } }>
                                        <AddToCartButton
                                            productId={ item.product._id }
                                            price={ Number(item.product.price) }
                                            stock={ item.product.stock }
                                            fromCart={ true }
                                        />

                                        <RemoveItem
                                            productId={ item.product._id }
                                        />
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    ) }
                />
            ) }

        </Drawer>
    );
};

export default CartDrawer;

const TitleText = styled.div`
    color: white;
    fontSize: 18px;
    font-weight: bold;
`;

const ClearButton = styled(Button)`
    &.ant-btn-text {
        color: rgba(255, 255, 255, 0.85);
        font-size: 13px;
        padding: 0 8px;
        height: 28px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 4px;

        &:hover {
            color: white !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-color: white !important;
        }
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 32px;
`;