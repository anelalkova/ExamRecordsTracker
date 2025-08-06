import './App.css'
import Register from "./ui/components/auth/Register/Register.jsx";
import Login from "./ui/components/auth/Login/Login.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./ui/components/layout/Layout/Layout.jsx";
import HomePage from "./ui/pages/HomePage/HomePage.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>
                  {/*  <Route element={<ProtectedRoute/>}>
                        <Route path="products" element={<ProductsPage/>}/>
                        <Route path="products/:id" element={<ProductDetails/>}/>
                        <Route path="shopping-cart" element={<ShoppingCart/>}/>
                    </Route>*/}
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default App;
