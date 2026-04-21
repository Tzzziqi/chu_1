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
import Checkout from "./CheckoutButton";

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
                <FooterContainer>
                    <PromoCodeInput/>

                    <Divider style={ { margin: '0 0 20px 0' } }/>


                    <StyledSpace orientation="vertical" size={ 12 }>
                        <SummaryRow>
                            <LabelText>Subtotal</LabelText>
                            <Text strong>${ summary.subtotal }</Text>
                        </SummaryRow>
                        <SummaryRow>
                            <LabelText>Tax</LabelText>
                            <Text strong>${ summary.tax }</Text>
                        </SummaryRow>
                        <SummaryRow>
                            <DiscountValue>Discount</DiscountValue>
                            <Text strong style={ { color: '#f5222d' } }>-${ summary.discount }</Text>
                        </SummaryRow>
                    </StyledSpace>

                    <EstimatedTotalContainer>
                        <Text strong style={ { fontSize: '18px' } }>Estimated total</Text>
                        <Text strong style={ { fontSize: '24px' } }>${ summary.estimatedTotal }</Text>
                    </EstimatedTotalContainer>

                    <Checkout/>

                </FooterContainer>
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
                        <ListItemContainer key={ item._id }>
                            <ItemCardContainer>
                                <ImageContainer>
                                    <ProductImage src={ item.product.imageUrl } alt={ item.product.name }/>
                                </ImageContainer>


                                <ContentWrapper>
                                    <DetailRow>
                                        <ProductName>{ item.product.name }</ProductName>
                                        <PriceText>
                                            ${ (parseFloat(item.product.price) * item.quantity).toFixed(2) }
                                        </PriceText>
                                    </DetailRow>

                                    <ActionRow>
                                        <AddToCartButton
                                            productId={ item.product._id }
                                            price={ Number(item.product.price) }
                                            stock={ item.product.stock }
                                            fromCart={ true }
                                        />

                                        <RemoveItem
                                            productId={ item.product._id }
                                        />
                                    </ActionRow>
                                </ContentWrapper>
                            </ItemCardContainer>
                        </ListItemContainer>
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
    && {
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

const FooterContainer = styled.div`
    padding: 12px 20px 20px 20px;
    background-color: '#ffffff'
`;

const StyledSpace = styled(Space)`
    && {
        width: 100%;
        margin-bottom: 24px;
    }
`;

const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LabelText = styled(Text)`
    && {
        color: #8c8c8c;
    }
`;

const DiscountValue = styled(Text)`
    && {
        color: #f5222d;
    }
`;

const EstimatedTotalContainer = styled(Text)`
    && {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }
`;

const ListItemContainer = styled(List.Item)`
    && {
        padding: 16px;
        border: 1px solid #f0f0f0;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        margin-bottom: 16px;
        background-color: #fff;
    }
`;

const ItemCardContainer = styled.div`
    display: flex;
    gap: 16px;
    width: 100%
`;

const ImageContainer = styled.div`
    width: 90px;
    height: 90px;
    background: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0
`;

const ProductImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const ContentWrapper = styled.div`
    flex: 1;
`;

const DetailRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
`;

const ActionRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ProductName = styled(Text)`
    && {
        font-size: 15px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const PriceText = styled(Text)`
    && {
        color: #5c67f2;
        font-weight: bold;
        font-size: 16px;
        white-space: nowrap;
    }
`;