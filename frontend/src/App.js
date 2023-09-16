import "./App.css";

import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import Home from "./component/Home/Home";
import Home1 from "./component/Home/Home1";
import Header from "./component/layout/Header/Header";
import Header1 from "./component/layout/Header/Header1";
import Footer from "./component/layout/Footer/Footer";
import HotDeals from "./component/Hot-Deals/HotDeals";
import ImageSlide from "./component/layout/Carousel/ImageSlide";
import SingleProduct from "./component/Product/ProductDetails/SingleProduct";
import ProductsPage from "./component/Product/AllProducts/ProductsPage";
import Login from "./component/User/Login";
import Account from "./component/User/Account";
import store from "./store";
import React, { useEffect, useState } from "react";
import { getUserDetails } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions";
import Loader from "./component/layout/Loader/Loading";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgetPassword from "./component/User/ForgetPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import axios from "axios";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SuccessOrder from "./component/Cart/SuccessOrder";
import MyOrder from "./component/Order/MyOrder";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import AllProducts from "./component/Admin/AllProducts";
import CreateProducts from "./component/Admin/CreateProducts";
import UpdateProduct from "./component/Admin/UpdateProduct";
import AllOrder from "./component/Admin/AllOrder";
import UpdateOrder from "./component/Admin/UpdateOrder";
import UserList from "./component/Admin/UserList";
import UpdateUser from "./component/Admin/UpdateUser";
import BlockList from "./component/Admin/BlockList";
import AllReviews from "./component/Admin/AllReviews";
import Error1 from "./component/Error/Error1";
import About from "./component/layout/About/About";
import Contact from "./component/layout/Contact/Contact";
import { useTheme } from "./Context/ContextTheme";

function App() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");
  const stripePromise = loadStripe(
    "pk_test_51NSN0KKpRdsTErz7maySqZrMydyGp8PERVq7O41BBBHJryGJ6PQtmbCzFSkIRTq56WBqyZkdtENxSAjLrUIvlqOb00PWLD8hWJ"
  );

  const getStripeApiKey = async () => {
    try {
      const { data } = await axios.get(
        "https://shop-mart-xi.vercel.app/payment/stripeApiKey",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  const history = useHistory();
  useEffect(() => {
    store.dispatch(getUserDetails());
    getStripeApiKey();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !user) {
      history.push("/login");
    }
  }, [isAuthenticated, user, history]);
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";
  const isContactPage = location.pathname === "/contact";
  const isHomePage = location.pathname === "/";
  const isHotDealsPage = location.pathname === "/hot-deals";
  const isForgetPasswordPage = location.pathname === "/password/forgot";
  const isUpdateProfilePage = location.pathname === "/me/update";
  const isUpdatePasswordPage = location.pathname === "/password/update";
  const isResetPasswordPage = location.pathname === "/password-reset/token";
  const isCartPage = location.pathname === "/cart";
  const shippingPage = location.pathname === "/shipping";
  const isConfirmPage = location.pathname === "/confirmOrder";
  const isPaymentPage = location.pathname === "/process/payment";
  const isSuccessPage = location.pathname === "/order/success";
  const isOrderPage = location.pathname === "/orders";
  const isOrderDetailsPage = location.pathname.includes("/order/");
  const isErrorPage = location.pathname === "/*";
  const isDashboardPage = location.pathname === "/admin/dashboard";
  const isAllProductsPage = location.pathname === "/admin/products";
  const isNewProductsPage = location.pathname === "/admin/newProduct";
  const isUpdateProductsPage = location.pathname.includes(
    "/admin/updateProducts/"
  );
  const isAllOrderPage = location.pathname === "/admin/orders";
  const isUpdateOrdersPage = location.pathname.includes("/admin/updateOrder/");
  const isAllUsersPage = location.pathname === "/admin/users";
  const isUpdateUsersPage = location.pathname.includes("/admin/updateUser/");
  const isBlockUsersPage = location.pathname === "/admin/blockList";
  const isReviewsPage = location.pathname === "/admin/reviews";
  const showHeaders =
    !isAboutPage &&
    !isContactPage &&
    !isForgetPasswordPage &&
    !isUpdateProfilePage &&
    !isUpdatePasswordPage &&
    !isResetPasswordPage &&
    !isCartPage &&
    !shippingPage &&
    !isConfirmPage &&
    !isPaymentPage &&
    !isSuccessPage &&
    !isOrderPage &&
    !isOrderDetailsPage &&
    !isDashboardPage &&
    !isAllProductsPage &&
    !isNewProductsPage &&
    !isUpdateProductsPage &&
    !isAllOrderPage &&
    !isUpdateOrdersPage &&
    !isAllUsersPage &&
    !isUpdateUsersPage &&
    !isBlockUsersPage &&
    !isReviewsPage &&
    !isErrorPage;

  const theme = useTheme();

  //window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <div>
      <div id={theme}>
        <>
          {showHeaders && (
            <>
              <Header />
              <Header1 />
            </>
          )}

          {loading ? (
            <div>
              <Loader />
            </div>
          ) : isAuthenticated && user ? (
            <UserOptions user={user} />
          ) : null}
        </>

        <div className="content-container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/hot-deals" component={HotDeals} />
            <Route exact path="/product/:id" component={SingleProduct} />
            <Route exact path="/products" component={ProductsPage} />
            <Route exact path="/products/:keyword" component={ProductsPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/password/forgot" component={ForgetPassword} />
            <Route
              exact
              path="/user/password-reset/:token"
              component={ResetPassword}
            />
            <ProtectedRoute
              exact
              path="/order/success"
              component={SuccessOrder}
            />
            <ProtectedRoute
              isAdmin={true}
              exact
              path="/admin/dashboard"
              component={Dashboard}
            />
            <ProtectedRoute
              exact
              path="/admin/products"
              isAdmin={true}
              component={AllProducts}
            />
            <ProtectedRoute
              exact
              path="/admin/newProduct"
              isAdmin={true}
              component={CreateProducts}
            />
            <ProtectedRoute
              exact
              path="/admin/updateProducts/:id"
              isAdmin={true}
              component={UpdateProduct}
            />
            <ProtectedRoute
              exact
              path="/admin/orders"
              isAdmin={true}
              component={AllOrder}
            />
            <ProtectedRoute
              exact
              path="/admin/updateOrder/:id"
              isAdmin={true}
              component={UpdateOrder}
            />
            <ProtectedRoute
              exact
              path="/admin/users"
              isAdmin={true}
              component={UserList}
            />
            <ProtectedRoute
              exact
              path="/admin/blockList"
              isAdmin={true}
              component={BlockList}
            />
            <ProtectedRoute
              exact
              path="/admin/updateUser/:id"
              isAdmin={true}
              component={UpdateUser}
            />
            <ProtectedRoute
              isAdmin={true}
              exact
              path="/admin/reviews"
              component={AllReviews}
            />
            <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
            <ProtectedRoute exact path="/orders" component={MyOrder} />
            <ProtectedRoute exact path="/account" component={Account} />
            <ProtectedRoute exact path="/me/update" component={UpdateProfile} />

            <ProtectedRoute
              exact
              path="/password/update"
              component={UpdatePassword}
            />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/shipping" component={Shipping} />
            <Route exact path="/confirmOrder" component={ConfirmOrder} />
            {stripeApiKey && (
              <Elements stripe={stripePromise}>
                <ProtectedRoute
                  exact
                  path="/process/payment"
                  component={Payment}
                />
              </Elements>
            )}

            <Route exact path="*" component={Error1} />
          </Switch>

          {isHomePage && !isAboutPage && (
            <div style={{ marginTop: "25px" }}>
              <ImageSlide />
            </div>
          )}
          {isHomePage && !isAboutPage && (
            <div style={{ marginTop: "40px" }}>
              <Home1 />
            </div>
          )}
        </div>
        {isHomePage && (
          <div className="slider-container5">
            <Footer />
          </div>
        )}

        {isHotDealsPage && (
          <div className="slider-container">
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
