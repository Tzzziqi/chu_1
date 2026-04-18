import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Input, Button, Typography, message } from 'antd'
import { CloseOutlined, MailOutlined } from '@ant-design/icons'
import type { RootState, AppDispatch } from '../../store'
import { login, signup } from '../../store/slices/authSlice'



const { Title, Text, Link } = Typography
// the form setting.,
const CONFIG = {
    signin: {
        title: 'Sign in to your account',
        buttonText:'Sign in',
    },
    signup: {
        title: 'Sign up for an account',
        buttonText:'Create account',
    },
    'update-password': {
        title: 'Update your password',
        buttonText:'Update password',
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

    // Common stlyes for pages
    const overlayStyle: React.CSSProperties = {
        flex: 1, // footer/ header fill teh remaining space 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 32,
        maxWidth: 400,
        width: '90%',
        position: 'relative',
    }

    const closeButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: 12,
        right: 12,
    }

    // forgoet p and sent email logic...
    if (mode === 'update-password' && emailSent) {
    return (
      <div style={overlayStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <Button
            type="text" icon={<CloseOutlined />}
            style={closeButtonStyle}
            onClick={() => navigate('/signin')}
          />
          <Title level={4} style={{ marginBottom: 8 }}>Update your password</Title>
          <MailOutlined style={{ fontSize: 48, color: '#6C63FF', margin: '24px 0' }} />
          <Text type="secondary" style={{ display: 'block' }}>
            We have sent the update password link to your email, please check that!
          </Text>
        </div>
      </div>
    )
  }

    // ===== HomePage: singup/ signin/ forgetP Form ===== 
    return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <Button
          type="text" icon={<CloseOutlined />}
          style={closeButtonStyle}
          onClick={() => navigate('/')}
        />

        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          {config.title}
        </Title>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Email</Text>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            status={errors.email ? 'error' : undefined}
          />
          {errors.email && (
            <Text type="danger" style={{ fontSize: 12 }}>{errors.email}</Text>
          )}
        </div>

        {mode !== 'update-password' && (
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Password</Text>
            <Input.Password
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              status={errors.password ? 'error' : undefined}
            />
            {errors.password && (
              <Text type="danger" style={{ fontSize: 12 }}>{errors.password}</Text>
            )}
          </div>
        )}

        {mode === 'signup' && (
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Password (Please Type Your Password Again)</Text>
            <Input.Password
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              status={errors.confirmPassword ? 'error' : undefined}
            />
            {errors.confirmPassword && (
              <Text type="danger" style={{ fontSize: 12 }}>{errors.confirmPassword}</Text>
            )}
          </div>
        )}

        <Button
          type="primary" block loading={loading}
          onClick={handleSubmit}
          style={{
            height: 42, fontWeight: 600, marginBottom: 16,
            backgroundColor: '#6C63FF', borderColor: '#6C63FF',
          }}
        >
          {config.buttonText}
        </Button>

        {mode === 'signin' && (
          <div style={{ textAlign: 'center' }}>
            <Text>
              Don't have an account?{' '}
              <Link onClick={() => navigate('/signup')}>Sign up</Link>
            </Text>
            <br />
            <Link onClick={() => navigate('/update-password')}>Forgot password?</Link>
          </div>
        )}

        {mode === 'signup' && (
          <div style={{ textAlign: 'center' }}>
            <Text>
              Already have an account?{' '}
              <Link onClick={() => navigate('/signin')}>Sign in</Link>
            </Text>
          </div>
        )}

        {error && (
          <Text type="danger" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
            {error}
          </Text>
        )}
      </div>
    </div>
  )
}