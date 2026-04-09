import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff, Close } from '@mui/icons-material'
import { message } from 'antd'
import type { RootState, AppDispatch } from '../../store'
import { login, signup, clearError } from '../../store/authSlice'


// the form setting.,
const CONFIG = {
    signin: {
        title: 'Sign in to your account',
        buttonText:'Sign in',
        fields: ['email', 'password'] as const 
    },
    signup: {
        title: 'Sign up for an account',
        buttonText:'Create account',
        fields: ['email', 'password', 'confirmPassword'] as const,
    },
    'update-password': {
        title: 'Update your password',
        buttonText:'Update password',
        fields: ['email'] as const,
    },
}

type AuthMode = keyof typeof CONFIG 
interface AuthFormProps {
    mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>() // disptach is used to active the redux action i wrote before, login/ singup
    const { loading, error} = useSelector((state: RootState) => state.auth)

    // following is the form's states 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [emailSent, setEmailSent] = useState(false) // forget p and when email send, the page will change to alart page
    const [errors, setErrors] = useState<Record<string, string>>({}) //obj: key, vale is String, saved all false info

    const config = CONFIG[mode] 

    // =======chekck the form to see if every charca is leagl====
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'please entre a valid email'
        }
        if (mode !== 'update-password') {
            if (!password) {
                newErrors.password = 'password is required'
            } else if (password.length < 8) {
                newErrors.password = 'password must be at least 8 characters long'
            }
        }
        if (mode === 'signup') {
            if (!confirmPassword) {
                newErrors.confirmPassword = 'please confirm your password'

            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Your entered password do not match your creacted password'
            }
        }
        // put teh setErrors after all checks becuase we can just render the page onece, aviod render page everytime have a errors
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

//==== submit buttom: different mode to match it's Reduc Action ======
const handleSubmit = async () => {
    if (!validate()) return 
    try {
        if (mode === 'signin') {
            await dispatch(login({ email, password})).unwrap() //unwrap is used to get the try/catch from Redux action, otherwise, it will  never catch the error here 
            message.success('Login Successful!') //ant global 
            navigate('/')
        }
        else if (mode === 'signup') {
        await dispatch(signup({ email, password })).unwrap()
        message.success('Account created!')
        navigate('/')
        }
        else {
            setEmailSent(true)
        }
    } catch (error) {
        message.error(error as string || 'Somthing Went Wrong, Please Connect The Tech')
    }
    }

    // ===== password eye sigal: switch to + or - P
    const passwordAdornment = (
    <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
            {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
    </InputAdornment>
)
    // forgoet p and sent email logic...
    if (mode === 'update-password' && emailSent) {
        return (
            <Box sx={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.5)',
            }}>
                <Box sx={{
                    bgcolor: 'white', borderRadius: 2, p: 4, maxWidth: 400, width: '90%',
                    textAlign: 'center', position: 'relative',
                }}>
                    <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => navigate('/signin')}>
                        <Close />
                    </IconButton>
                    <Typography variant="h6" sx={{ mb: 1 }}>Update your password</Typography>
                    <Box sx={{ my: 3, fontSize: 48 }}>&#9993;</Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        We have sent the update password link to your email, please check that!
                    </Typography>
                </Box>
            </Box>
        )
    }

    // ===== HomePage: singup/ signin/ forgetP Form ===== 
    return (
        <Box sx={{
            minHeight: '100vh', display:'flex',alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.5)',
            }}> 
            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 4, maxWidth: 400, width: '90%', position: 'relative',
                }}>

            {/*  the closing buttom */}
            <IconButton sx={{ position:'absolute', top: 8, right: 8 }} onClick={() => navigate('/')}><Close />
            </IconButton>
            
            {/* Show the Title on Page depends on different mode === config.title */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            {config.title}
            </Typography>
            
            {/* emails for three models */}
            <Typography variant= "body2" sx={{ mb: 0.5 }}>Email </Typography>
            <TextField
            fullWidth size="small" placeholder="Enter your email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}          
            helperText={errors.email}       // show the error message at bottom the box
            sx={{ mb: 2 }}
            />

            {mode !== 'update-password' && (
                <>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Password</Typography>
                <TextField
                fullWidth size="small" placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}  
                value={password} onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password} helperText={errors.password} 
                slotProps={{ input: { endAdornment: passwordAdornment } }}
                sx={{ mb: 2 }}
            />
          </>
          )}
            {mode === 'signup' && (
                <>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Password (Type your password again)</Typography>
                <TextField
                fullWidth size="small" placeholder="Confirm your password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword} helperText={errors.confirmPassword}
                slotProps={{ input: { endAdornment: passwordAdornment } }}
                sx={{ mb: 2 }}
            />
          </>
            )}

            <Button 
                fullWidth variant="contained" onClick={handleSubmit}
                disabled={loading} 
                // textTransform: 'none' will help MUI change all butoom to capital 
                sx={{ mb: 2, py: 1.2, textTransform: 'none', fontWeight: 600, bgcolor: '#6C63FF', '&:hover': { bgcolor: '#5A52D5' },        
          }}
            >
                {loading ? 'Loading...' : config.buttonText}
                </Button>
            
            {mode === 'signin' && (
                <Box sx={{ textAlign: 'center', fontSize: 13 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Don't have an account?{' '}
                    <Box component="span" sx={{ color: '#6C63FF', cursor: 'pointer' }}
                        onClick={() => navigate('/signup')}>
                        Sign up
                    </Box>
                    </Typography>
                    <Typography variant="body2">
                    <Box component="span" sx={{ color: '#6C63FF', cursor: 'pointer' }}
                        onClick={() => navigate('/update-password')}>
                        Forgot password?
                    </Box>
                    </Typography>
                </Box>
            )}

            {mode === 'signup' && (
                <Box sx={{ textAlign: 'center', fontSize: 13 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Already have an account? Sign in please{' '}
                    <Box component="span" sx={{ color: '#6C63FF', cursor: 'pointer' }}
                        onClick={() => navigate('/signin')}>
                        Sign in
                    </Box>
                    </Typography>
                    
                </Box>
            )}
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    {error}
                </Typography>
            )}
      </Box>
      </Box>
    )
}