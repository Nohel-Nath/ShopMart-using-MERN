import axios from "axios";

import {
  CLEAR_ERRORS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  UPDATE_USER_REQUEST,
  DELETE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_FAIL,
  BLOCK_USERS_FAIL,
  BLOCK_USERS_SUCCESS,
  BLOCK_USERS_REQUEST,
} from "../constants/userConstants";
import Cookies from "js-cookie";
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `https://shop-mart-xi.vercel.app/user/login`,
      { email, password },
      config
    );
    const token = data.token; // Extract the token from the response data

    // Save the token to local storage
    localStorage.setItem("token", token);

    dispatch({ type: LOGIN_SUCCESS, payload: { user: data.user, token } });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const registerAUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `https://shop-mart-xi.vercel.app/user/registration`,
      userData,
      config
    );
    const token = data.token; // Extract the token from the response data

    // Save the token to local storage
    localStorage.setItem("token", token);

    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: { user: data.user, token },
    });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_SUCCESS });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.get(
      `https://shop-mart-xi.vercel.app/user/logout`,
      config
    );
    //const token = data.token;
    //localStorage.removeItem("token", token);
    // Remove the token from localStorage
    localStorage.removeItem("token");

    /*document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=shop-mart-xi.vercel.app;";
      */
    /*const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Calculate the date 7 days from now

    const formattedDate = sevenDaysLater.toUTCString(); // Format the date as a UTC string

    document.cookie = `token=; expires=${formattedDate}; path=/; domain=shop-mart-xi.vercel.app;`;*/
    Cookies.remove("token");
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const getUserDetails = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    //const token = localStorage.getItem("token");
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://shop-mart-xi.vercel.app/user/details`,
      config
    );

    dispatch({ type: LOAD_USER_SUCCESS, payload: { user: data } });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `https://shop-mart-xi.vercel.app/user/profileUpdate`,
      userData,
      config
    );

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Update Password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `https://shop-mart-xi.vercel.app/user/passwordUpdate`,
      passwords,
      config
    );

    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// get All Users
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://shop-mart-xi.vercel.app/user/allUsers`,
      config
    );

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({
      type: ALL_USERS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// get  User Details
export const getUserDetailsAdmin = (userId) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.get(
      `https://shop-mart-xi.vercel.app/user/details/${userId}`,
      config
    );

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Update User
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `https://shop-mart-xi.vercel.app/user/roleUpdate/${id}`,
      userData,
      config
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Delete User
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.delete(
      `https://shop-mart-xi.vercel.app/user/userDelete/${id}`,
      config
    );

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const getBlockUsers = () => async (dispatch) => {
  try {
    dispatch({ type: BLOCK_USERS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://shop-mart-xi.vercel.app/user/blockList`,
      config
    );

    dispatch({
      type: BLOCK_USERS_SUCCESS,
      payload: data.blockedUsers,
    });
  } catch (error) {
    dispatch({
      type: BLOCK_USERS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
