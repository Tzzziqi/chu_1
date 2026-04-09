import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material'
import { ShoppingCart } from '@mui/icons-material'
import type { RootState, AppDispatch } from '../../store'
import { logout } from '../../store/authSlice'

export default function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { isLoggedIn, user } = useSelector((state: RootState ) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/signin')
    }
    return (
        <AppBar position="static" sx={{ bgcolor: '#1a1a2e' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography
                    variant="h6" 
                    sx={{ fontWeight: 700, cursor: 'pointer' }}   
                    onClick={() => navigate('/')}
                    >
                    Management
                </Typography>
                {/* rightside, the buttom area. */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                
                {/* Render base on conditions */}
                {isLoggedIn ? (
                    <>
                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                    {/* need 队友 写 正确的badgeCOunt 这里我写死的 === 0 */}
                    <Badge badgeContent={0} color="error">
                        <ShoppingCart />
                    </Badge>
                </IconButton>
    

                <Typography variant="body2">{user?.email}</Typography> {/* user?.email, if no email return undefined to avaiod error */}
                    
                   
                    <Button color="inherit" size="small" onClick={handleLogout}> Sign out </Button>
                    </>
                ): (
                   
                    <>
                    {/* Not register yet: display sign in + Sign up */}
                    <Button color="inherit" size="small" onClick={() => navigate('/signin')}> Sign In</Button>

                    <Button variant="outlined" size="small" sx={{ color: 'white', borderColor: 'white' }} onClick={() => navigate('/signup')}> 
                    Sign Up </Button>
                    </>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  )
}