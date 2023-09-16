import axios from "axios";
import {
  BEST_PRODUCT_FAIL,
  BEST_PRODUCT_REQUEST,
  BEST_PRODUCT_SUCCESS,
  CLEAR_ERRORS,
  LATEST_PRODUCT_FAIL,
  LATEST_PRODUCT_REQUEST,
  LATEST_PRODUCT_SUCCESS,
  HOT_PRODUCT_FAIL,
  HOT_PRODUCT_REQUEST,
  HOT_PRODUCT_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  ALL_REVIEW_REQUEST,
  ALL_REVIEW_SUCCESS,
  ALL_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
} from "../constants/productConstants";

export const bestDeals = () => async (dispatch) => {
  try {
    dispatch({ type: BEST_PRODUCT_REQUEST });
    const { data } = await axios.get(
      "https://shop-mart-xi.vercel.app/products/allProducts/best-deals"
    );
    dispatch({
      type: BEST_PRODUCT_SUCCESS,
      payload: { bestDeals: data.products },
    });
  } catch (error) {
    dispatch({
      type: BEST_PRODUCT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const latestProducts = () => async (dispatch) => {
  try {
    dispatch({ type: LATEST_PRODUCT_REQUEST });
    const { data } = await axios.get(
      "https://shop-mart-xi.vercel.app/products/allProducts/latest-products"
    );
    //console.log(data);
    dispatch({
      type: LATEST_PRODUCT_SUCCESS,
      payload: { latestProducts: data.products },
    });
  } catch (error) {
    dispatch({
      type: LATEST_PRODUCT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const hotDeals = () => async (dispatch) => {
  try {
    dispatch({ type: HOT_PRODUCT_REQUEST });
    const { data } = await axios.get(
      "https://shop-mart-xi.vercel.app/products/allProducts/hot-deals"
    );

    dispatch({
      type: HOT_PRODUCT_SUCCESS,
      payload: { hotDeals: data.products },
    });
  } catch (error) {
    dispatch({
      type: HOT_PRODUCT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(
      `https://shop-mart-xi.vercel.app/products/product/${id}`
    );

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const getAllProducts =
  (
    keyword = "",
    currentPage = 1,
    category = "",
    price = [100, 200000],
    ratings = 0
  ) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCT_REQUEST });
      let link = `https://shop-mart-xi.vercel.app/products/allProducts?keyword=${keyword}&page=${currentPage}`;
      if (category) {
        link += `&category=${category}`;
      }
      if (Array.isArray(price) && price.length === 2) {
        link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      }
      if (ratings) {
        link += `&ratings[gte]=${ratings}`;
      }
      const { data } = await axios.get(link);

      dispatch({
        type: ALL_PRODUCT_SUCCESS,
        payload: {
          getAllProducts: data.products,
          productsCount: data.productsCount,
          resultPerPage: data.resultPerPage,
          filteredProductsCount: data.filteredProductsCount,
          category: data.category,
          price: data.price,
          ratings: data.ratings,
        },
      });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCT_FAIL,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

// Get All Products For Admin
export const getAdminProduct = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      "https://shop-mart-xi.vercel.app/products/adminProducts",
      config
    );

    dispatch({
      type: ADMIN_PRODUCT_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Create Product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `https://shop-mart-xi.vercel.app/products/new`,
      productData,
      config
    );

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Update Product
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `https://shop-mart-xi.vercel.app/products/${id}`,
      productData,
      config
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Delete Product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.delete(
      `https://shop-mart-xi.vercel.app/products/${id}`,
      config
    );

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};
// NEW REVIEW
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      ` https://shop-mart-xi.vercel.app/products/review`,
      reviewData,
      config
    );

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Get All Reviews of a Product
export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEW_REQUEST });

    const { data } = await axios.get(
      `https://shop-mart-xi.vercel.app/products/reviews/${id}`
    );

    dispatch({
      type: ALL_REVIEW_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: ALL_REVIEW_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Delete Review of a Product
export const deleteReviews = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.delete(
      `https://shop-mart-xi.vercel.app/products/deleteReviews?id=${reviewId}&productId=${productId}`,
      config
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
