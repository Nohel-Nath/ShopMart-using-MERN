import React from "react";

import "./allProducts.css";

import AllProducts from "./AllProducts";
import Footer from "../../layout/Footer/Footer";

function ProductsPage() {
  return (
    <>
      <div className="products">
        <AllProducts />
        <Footer />
      </div>
    </>
  );
}

export default ProductsPage;
