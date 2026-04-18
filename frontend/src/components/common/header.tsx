import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Button, Badge, Space, Typography } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import type { RootState, AppDispatch } from '../../store'
import { logout } from '../../store/slices/authSlice'
import { useEffect, useState } from "react";
import { getCart } from "../../store/slices/cartSlice";
import CartDrawer from "../Cart/CartDrawer";

const { Header: AntHeader } = Layout
const { Text } = Typography

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
    const { subtotal, itemTotalCount } = useSelector((state: RootState) => state.cart?.summary);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout())
        navigate('/signin')
    }

    const handleOpenCart = () => {
        setIsCartOpen(true);
    }

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getCart());
        }
    }, [dispatch, isLoggedIn]);


    return (
        <AntHeader
            style={ {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1a1a2e',
                padding: '0 24px',
            } }
        >
            {/* Logo */ }
            <div
                onClick={ () => navigate('/') }
                style={ {
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: 'pointer',
                } }
            >
                Management
            </div>

            {/* rightside, the buttom area. */ }
            <Space size="middle">
                { isLoggedIn ? (
                    <>
                        <Text style={ { color: 'white' } }>{ user?.email }</Text>
                        <Button type="text" style={ { color: 'white' } } onClick={ handleLogout }>
                            Sign out
                        </Button>
                        <div onClick={ handleOpenCart } style={ {
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        } }>
                            <Badge count={ itemTotalCount } size="small" color="#f5222d">
                                <ShoppingCartOutlined style={ { fontSize: '26px', color: 'white' } }/>
                            </Badge>
                            <span style={ { fontWeight: 'bold', fontSize: '16px' } }>${ subtotal }</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Button type="text" style={ { color: 'white' } } onClick={ () => navigate('/signin') }>
                            Sign in
                        </Button>
                        <Button ghost onClick={ () => navigate('/signup') }>
                            Sign up
                        </Button>
                    </>
                ) }
            </Space>
            <CartDrawer
                isOpen={ isCartOpen }
                onClose={ () => setIsCartOpen(false) }
            />
        </AntHeader>
    )
}