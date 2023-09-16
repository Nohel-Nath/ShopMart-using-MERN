import React from "react";

import LatestProducts from "../Latest-Products/LatestProducts";
import "../../App.css";
import BestProducts from "../BestProducts/BestProducts";

function Home1() {
  return (
    <div>
      <BestProducts />
      <div style={{ marginTop: "50px" }}>
        <LatestProducts />
      </div>
    </div>
  );
}

export default Home1;
