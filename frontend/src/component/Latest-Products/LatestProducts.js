import React, { useEffect, useState } from "react";
import "./latestProducts.css";

import { useSelector, useDispatch } from "react-redux";

import TopLatestProducts from "./TopLatestProducts";
import Loader from "../layout/Loader/Loading";
import { clearErrors, latestProducts } from "../../actions/productAction";
import { useHistory } from "react-router-dom";

function LatestProducts() {
  const navigate = useHistory();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector(
    (state) => state.latestProducts
  );
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
  }, [error]);
  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);

  useEffect(() => {
    dispatch(latestProducts()); // Dispatch the action to fetch best deals
  }, [dispatch]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <h2 className="homeHeading1">Latest Products</h2>
            <div className="latestContainer" id="container">
              {products &&
                products.map((product) => (
                  <TopLatestProducts product={product} />
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default LatestProducts;
