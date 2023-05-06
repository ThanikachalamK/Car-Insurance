import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./contexts/auth";
import CommonProvider from "./contexts/common";
import ProductsProvider from "./contexts/products";
import CartProvider from "./contexts/cart";
import CheckoutProvider from "./contexts/checkout";
import ReviewProvider from "./contexts/review";
// import RouteWrapper from "./layouts/RouteWrapper";
import AuthLayout from "./layouts/AuthLayout";
// import CommonLayout from "./layouts/CommonLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthPage from "./pages/auth";
import HomePage from "./pages/home";
import TypesPage from "./pages/types";
import ListPage from "./pages/itemLists";
import CheckoutPage from "./pages/checkout";
import ReviewPage from "./pages/review";
import "./assets/scss/style.scss";
import "./assets/css/style.css";

const App = () => {
  return (
    <AuthProvider>
      <CommonProvider>
        <ProductsProvider>
          <CartProvider>
            <CheckoutProvider>
              <ReviewProvider>
                <BrowserRouter>
                  <Routes>
                    <Route 
                      path="/"
                      exact
                      element={<><HomePage /><Footer /></>}
                      // layout={}
                    />
                    <Route 
                      path="/types"
                      exact
                      element={<><TypesPage /><Footer /></>}
                      // layout={}
                    />
                    <Route 
                      path="/lists"
                      exact
                      element={<><Header /><ListPage /><Footer /></>}
                      // layout={}
                    />
                    <Route 
                      path="/checkout"
                      element={<><Header /><CheckoutPage /><Footer /></>}
                      // layout={<CommonLayout />}
                    />
                    <Route 
                      path="/review"
                      element={<><ReviewPage /><Footer /></>}
                      // layout={<CommonLayout />}
                    />
                    <Route 
                      path="/auth"
                      element={<><AuthPage /><Footer /></>}
                      // layout={<AuthLayout />}
                    />
                  </Routes>
                </BrowserRouter>
              </ReviewProvider>
            </CheckoutProvider>
          </CartProvider>
        </ProductsProvider>
      </CommonProvider>
    </AuthProvider>
  );
};

export default App;
