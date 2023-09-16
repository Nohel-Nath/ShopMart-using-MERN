import React from "react";

import "./productDetail.css";

import ProductDetails from "./ProductDetails";
import Footer from "../../layout/Footer/Footer";

export default function SingleProduct() {
  return (
    <div className="single">
      <ProductDetails />
      <div className="slider-container1">
        <div className="space1"></div>
        <Footer />
      </div>
    </div>
  );
}
