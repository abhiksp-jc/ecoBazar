import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/verifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminProducts from "./pages/admin/Products";
import AdminBanners from "./pages/admin/Banners";
import Products from "./pages/Products.jsx";

import Dashboard from "./pages/dashboard";

import Categories from "./pages/admin/Categories";
import CategoryFormPage from "./pages/admin/categoryFormPage";

import DashboardHome from "./pages/admin/DashboardHome.jsx";

import Staff from "./pages/admin/Staff";
import StaffFormPage from "./pages/admin/StaffFormPage";

import ProtectedRoute from "./components/ProtectedRoute";
import PermissionRoute from "./components/PermissionRoute";
import AdminFAQ from "./pages/admin/FAQ.jsx";
import FAQ from "./pages/FAQ.jsx";
import ContentManagement from "./pages/admin/contentMgt.jsx";
import Terms from "./pages/Terms.jsx";
import NotFound from "./pages/NotFound.jsx";
import UserFrontend from "./pages/User-frontend.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Customers from "./pages/admin/Customers.jsx";
import Messages from "./pages/admin/Messages.jsx";
import AdminTestimonials from "./pages/admin/Testimonials.jsx";
import AdminCoupons from "./pages/admin/Coupons.jsx";
import Settings from "./pages/admin/Settings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp/:token"
          element={<VerifyOtp />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/user-frontend"
          element={<UserFrontend />}
        />

        <Route
          path="/user"
          element={<UserFrontend />}
        />

        <Route
          path="/home"
          element={<UserFrontend />}
        />

        <Route
          path="/shop"
          element={<UserFrontend />}
        />

        <Route
          path="/shop/products"
          element={<Products />}
        />

        <Route
          path="/shop/terms"
          element={<Terms />}
        />

        <Route
          path="/shop/faq"
          element={<FAQ />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<DashboardHome />}
          />

          <Route
            path="categories"
            element={<PermissionRoute module="categories"><Categories /></PermissionRoute>}
          />

          <Route
            path="categories/add"
            element={<PermissionRoute module="categories" action="create"><CategoryFormPage /></PermissionRoute>}
          />

          <Route
            path="categories/:id/edit"
            element={<PermissionRoute module="categories" action="edit"><CategoryFormPage /></PermissionRoute>}
          />

          <Route
            path="staff"
            element={<Staff />}
          />

          <Route
            path="staff/add"
            element={<StaffFormPage />}
          />

          <Route
            path="staff/:id/edit"
            element={<StaffFormPage />}
          />

          <Route
            path="products"
            element={<PermissionRoute module="products"><AdminProducts /></PermissionRoute>}
          />

          <Route
            path="sales"
            element={<AdminBanners />}
          />

          <Route
            path="banners"
            element={<AdminBanners />}
          />

          <Route
            path="orders"
            element={<PermissionRoute module="orders"><Orders /></PermissionRoute>}
          />

          <Route
            path="customers"
            element={<PermissionRoute module="customers"><Customers /></PermissionRoute>}
          />

          <Route
            path="messages"
            element={<Messages />}
          />

          <Route
            path="feedback"
            element={<AdminTestimonials />}
          />

          <Route
            path="testimonials"
            element={<AdminTestimonials />}
          />

          <Route
            path="coupons"
            element={<AdminCoupons />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

          <Route
            path="content-management"
            element={<PermissionRoute module="contentManagement"><ContentManagement /></PermissionRoute>}
          />

          <Route
            path="faq"
            element={<PermissionRoute module="faqs"><AdminFAQ /></PermissionRoute>}
          />
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;