import { Navigate, Route, Routes } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import ProductFormPage from "./pages/ProductFormPage";
import { Layout } from "antd";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { Toaster } from 'react-hot-toast';


const { Content } = Layout;

function App() {
    return (
        <Layout style={ { minHeight: "100vh" } }>
            <Header/>

            <Content style={ { padding: "24px" } }>
                <Toaster/>
                <Routes>
                    <Route path="/" element={ <Navigate to="/products" replace/> }/>

                    <Route path="/products" element={ <ProductPage/> }/>
                    <Route path="/products/:id" element={ <ProductDetailPage/> }/>
                    <Route path="/products/new" element={ <ProductFormPage/> }/>
                    <Route path="/products/:id/edit" element={ <ProductFormPage/> }/>

                    <Route path="/signin" element={ <SignInPage/> }/>
                    <Route path="/signup" element={ <SignUpPage/> }/>
                    <Route path="/update-password" element={ <UpdatePasswordPage/> }/>
                </Routes>
            </Content>

            <Footer/>
        </Layout>
    );
}

export default App;