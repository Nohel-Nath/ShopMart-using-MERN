import React, { useEffect, useState } from "react";
import "./bestProducts.css";

import { useSelector, useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";
import { bestDeals, clearErrors } from "../../actions/productAction";
import Loader from "../layout/Loader/Loading.js";
import TopBestProducts from "./TopBestProducts";
import ScrollToTop from "react-scroll-to-top";

function BestProducts() {
  const navigate = useHistory();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.bestDeals);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (error) {
      navigate.push("*");
      dispatch(clearErrors());
    }
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, [error, dispatch, navigate]);

  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);

  useEffect(() => {
    dispatch(bestDeals()); // Dispatch the action to fetch best deals
  }, [dispatch]);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <h2
              className="homeHeading"
              initial={{ y: -250 }}
              animate={{ y: -10 }}
              transition={{ duration: 1 }}
            >
              Best Products
            </h2>
            <div className="bestContainer" id="container">
              {products &&
                products.map((product) => (
                  <TopBestProducts product={product} />
                ))}
            </div>
          </div>
        </>
      )}
      <ScrollToTop
        smooth
        color="white"
        style={{ backgroundColor: "#1e1e2c", borderRadius: "100%" }}
      />
    </div>
  );
}

export default BestProducts;
