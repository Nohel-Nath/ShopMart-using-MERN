import React, { useEffect, useState } from "react";
import "./hotDeals.css";

import { useSelector, useDispatch } from "react-redux";

import { clearErrors, hotDeals } from "../../actions/productAction";

import Loader from "../layout/Loader/Loading";
import TopHotDeals from "./TopHotDeals";
import { useHistory } from "react-router-dom";
import MetaData from "../layout/MetaData";
import ScrollToTop from "react-scroll-to-top";

function HotDeals() {
  const navigate = useHistory();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.hotDeals);
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
  }, []);
  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);

  useEffect(() => {
    dispatch(hotDeals()); // Dispatch the action to fetch best deals
  }, [dispatch]);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <MetaData title="Hot Deals..." />
            <h2 className="homeHeading2">Your Hot Deals</h2>
            <div className="container2" id="container">
              {products &&
                products.map((product) => <TopHotDeals product={product} />)}
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

export default HotDeals;
