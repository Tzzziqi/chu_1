import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import UpdatePasswordPage from './pages/UpdatePasswordPage'
import Header from './components/common/header'
import Footer from './components/common/footer'


const { Content } = Layout
function App() {
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Content style={{ display: 'flex', flex: 1 }}> {/* fill the middle space*/}
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/" element={<Navigate to="/signin" />} />
          {/* 队友后面加自己的路由 */}
        </Routes>
      </Content>

      <Footer />
    </Layout>
  )
}

export default App