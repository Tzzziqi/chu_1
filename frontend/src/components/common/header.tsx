import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Button, Badge, Space, Typography } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import type { RootState, AppDispatch } from '../../store'
import { logout } from '../../store/authSlice'

const { Header: AntHeader } = Layout
const { Text } = Typography

export default function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { isLoggedIn, user } = useSelector((state: RootState ) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/signin')
    }
    

    return (
        <AntHeader
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1a1a2e',
            padding: '0 24px',
        }}
        >
        {/* Logo */}
        <div
            onClick={() => navigate('/')}
            style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            }}
        >
            Management
        </div>

            {/* rightside, the buttom area. */}
            <Space size="middle">
            {isLoggedIn ? (
            <>
                <Badge count={0} size="small">
                <ShoppingCartOutlined
                    style={{ color: 'white', fontSize: 20, cursor: 'pointer' }}
                    onClick={() => navigate('/cart')}
                />
                </Badge>
                <Text style={{ color: 'white' }}>{user?.email}</Text>
                <Button type="text" style={{ color: 'white' }} onClick={handleLogout}>
                Sign out
                </Button>
            </>
            ) : (
            <>
                <Button type="text" style={{ color: 'white' }} onClick={() => navigate('/signin')}>
                Sign in
                </Button>
                <Button ghost onClick={() => navigate('/signup')}>
                Sign up
                </Button>
            </>
            )}
        </Space>
        </AntHeader>
    )
    }