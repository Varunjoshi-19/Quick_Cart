import { useAuthStore } from "./context";
import AppLayout from "./layouts/AppLayout";
import { useRipple } from "./modules/Ripple";
import Cart from "./pages/cart";
import DashBoard from "./pages/dashboard";
import Product from "./pages/Product";
import SignIn from "./pages/SignIn";
import Signup from "./pages/SignUp";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SingleProduct from "./pages/SingleProduct";
import MyAccount from "./pages/MyAccount";
import Orders from "./pages/Orders";
import MyList from "./pages/MyList";
import ProtectedRoutes from "./router/ProtectedRoutes";
import Checkout from "./pages/checkout";
const App = () => {

  const { userData } = useAuthStore();

  useRipple();

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={userData ? <Navigate to="/" /> : <SignIn />} />
        <Route path="/signup" element={userData ? <Navigate to="/" /> : <Signup />} />

        <Route path="/" element={<AppLayout />}>

          <Route index element={<DashBoard />} />


          <Route element={<ProtectedRoutes />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout/>} />
            <Route path="my-list" element={<MyList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="my-account" element={<MyAccount />} />
          </Route>


          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/products/category/:category" element={<Product />} />

        </Route>



      </Routes>
    </BrowserRouter>

  )

}

export default App;