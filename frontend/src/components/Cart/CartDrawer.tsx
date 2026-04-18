import { Drawer, List, Typography, Button, Input, Divider, Space, Spin } from 'antd';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const { Text } = Typography;

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {

    const { items, summary, status } = useSelector((state: RootState) => state.cart);

    return (
        <Drawer
            title={ <div style={ { color: 'white', fontSize: '18px', fontWeight: 'bold' } }>Cart
                ({ summary.itemTotalCount })</div> }
            placement="right"
            onClose={ onClose }
            open={ isOpen }
            size={ 450 }
            styles={ { header: { background: '#5c67f2', border: 'none' } } }
            closeIcon={ <CloseOutlined style={ { color: 'white' } }/> }

            footer={
                <div style={ { padding: '12px 20px 20px 20px', backgroundColor: '#ffffff' } }>
                    <div style={ { marginBottom: '24px' } }>
                        <Text type="secondary"
                              style={ { fontSize: '13px', display: 'block', marginBottom: '8px', color: '#8c8c8c' } }>
                            Promo Code
                        </Text>
                        <div style={ { display: 'flex', gap: '8px' } }>
                            <Input placeholder="20 DOLLAR OFF" style={ { height: '42px' } }/>
                            <Button
                                type="primary"
                                style={ { height: '42px', padding: '0 25px', backgroundColor: '#5c67f2' } }
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

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
                                        <div style={ {
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid #d9d9d9',
                                            borderRadius: '4px',
                                            height: '32px'
                                        } }>
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={ <MinusOutlined style={ { fontSize: '10px' } }/> }
                                            />
                                            <span style={ {
                                                padding: '0 12px',
                                                fontSize: '14px',
                                                minWidth: '40px',
                                                textAlign: 'center'
                                            } }>
                                            { item.quantity }
                                        </span>
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={ <PlusOutlined style={ { fontSize: '10px' } }/> }
                                            />
                                        </div>
                                        <Button type="link" size="small"
                                                style={ { color: '#8c8c8c', textDecoration: 'underline' } }>
                                            Remove
                                        </Button>
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