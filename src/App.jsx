import { useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/Auth/SignupPage';
import LoginPage from './pages/Auth/LoginPage';
import LenderDashboardPage from './pages/Lender/LenderDashboardPage';
import UploadItemPage from './pages/Lender/UploadItemPage';
import PriceResultPage from './pages/Lender/PriceResultPage';
import ProductDisplayPage from './pages/Renter/ProductDisplayPage';
import ProductDetailPage from './pages/Renter/ProductDetailPage';
import CartPage from './pages/Renter/CartPage';
import OrdersPage from './pages/Renter/OrdersPage';
import FaqPage from './pages/Info/FaqPage';
import AboutPage from './pages/Info/AboutPage';
import { getCurrentUser } from './services/store';

function LenderEntryRoute() {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" state={{ redirectTo: '/lender/dashboard' }} replace />;
  }
  return <Navigate to="/lender/dashboard" replace />;
}

function RouteScrollReset({ pathname, search }) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}

function App() {
  const location = useLocation();

  return (
    <>
      <RouteScrollReset pathname={location.pathname} search={location.search} />
      <div className="route-shell">
        <div key={`${location.pathname}${location.search}`} className="route-stage">
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductDisplayPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lender" element={<LenderEntryRoute />} />
            <Route path="/lender/dashboard" element={<LenderDashboardPage />} />
            <Route path="/lender/upload" element={<UploadItemPage />} />
            <Route path="/lender/price" element={<PriceResultPage />} />
            <Route path="/renter/recommendations" element={<Navigate to="/products" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
