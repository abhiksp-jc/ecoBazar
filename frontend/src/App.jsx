import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Billing from "./pages/Billing";
import MyOrders from "./pages/MyOrders";
import Auth from "./pages/Auth";
import Faqs from "./pages/Faqs";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AccountDashboard from "./pages/AccountDashboard";
import OrderDetails from "./pages/OrderDetails";
import AccountSettings from "./pages/AccountSettings";
import Feedback from "./pages/Feedback";
import CartDrawer from "./components/cart/CartDrawer";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <ScrollToTop />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<AccountDashboard />} />
            <Route path="/account/dashboard" element={<AccountDashboard />} />
            <Route path="/account/orders" element={<MyOrders />} />
            <Route path="/account/orders/:id" element={<OrderDetails />} />
            <Route path="/account/settings" element={<AccountSettings />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/dashboard" element={<AccountDashboard />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/my-orders/:id" element={<OrderDetails />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/watchlist" element={<Wishlist />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/checkout" element={<Billing />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/signin" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/faq" element={<Faqs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/reviews" element={<Feedback />} />
          </Routes>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
