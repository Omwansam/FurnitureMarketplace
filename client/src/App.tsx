import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AuthPage from "./pages/auth-page";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <Switch>
      {/* Customer Routes */}
      <Route path="/">
        {() => (
          <>
            <Header />
            <Home />
            <Footer />
          </>
        )}
      </Route>
      
      <Route path="/shop">
        {() => (
          <>
            <Header />
            <Shop />
            <Footer />
          </>
        )}
      </Route>
      
      <Route path="/shop/:categorySlug">
        {(params) => (
          <>
            <Header />
            <Shop categorySlug={params.categorySlug} />
            <Footer />
          </>
        )}
      </Route>
      
      <Route path="/product/:productSlug">
        {(params) => (
          <>
            <Header />
            <ProductDetail productSlug={params.productSlug} />
            <Footer />
          </>
        )}
      </Route>
      
      {/* Authentication Route */}
      <Route path="/auth">
        <AuthPage />
      </Route>
      
      {/* Protected Routes */}
      <ProtectedRoute 
        path="/checkout" 
        component={() => (
          <>
            <Header />
            <Checkout />
            <Footer />
          </>
        )} 
      />
      
      {/* Admin Routes */}
      <Route path="/admin/login">
        <AdminLogin />
      </Route>
      
      <Route path="/admin">
        <AdminDashboard />
      </Route>
      
      <Route path="/admin/products">
        <AdminProducts />
      </Route>
      
      <Route path="/admin/orders">
        <AdminOrders />
      </Route>
      
      {/* Fallback to 404 */}
      <Route>
        {() => (
          <>
            <Header />
            <NotFound />
            <Footer />
          </>
        )}
      </Route>
    </Switch>
  );
}

export default App;
