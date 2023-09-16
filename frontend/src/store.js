import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  allProductsReducer,
  bestDealsReducer,
  hotProductsReducer,
  latestProductsReducer,
  newProductReducer,
  newReviewReducer,
  productDetailsReducer,
  productReviewsReducer,
  productUpdateOrDeleteReducer,
  reviewReducer,
} from "./reducers/productReducer";
import {
  allUsersReducer,
  blockUsersReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import {
  allOrdersReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderUpdateOrDeleteReducer,
} from "./reducers/orderReducer";

const reducer = combineReducers({
  bestDeals: bestDealsReducer,
  latestProducts: latestProductsReducer,
  hotDeals: hotProductsReducer,
  productDetails: productDetailsReducer,
  getAllProducts: allProductsReducer,
  newProduct: newProductReducer,
  product: productUpdateOrDeleteReducer,
  newReview: newReviewReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer,
  user: userReducer,
  allUsers: allUsersReducer,
  profile: profileReducer,
  userDetails: userDetailsReducer,
  blockList: blockUsersReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  order: orderUpdateOrDeleteReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
