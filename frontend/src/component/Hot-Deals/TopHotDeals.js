import { Rating } from "@material-ui/lab";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const TopHotDeals = ({ product }) => {
  const options = {
    size: "medium",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  const id = product._id;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 200 * product.index); // Delay each product by 200 milliseconds

    return () => clearTimeout(timeout);
  }, [product.index]);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when component is rendered
  }, []);

  return (
    <Link
      className={`productCard ${isVisible ? "visible" : ""}`}
      to={`/product/${id}`}
    >
      <img src={product.images[0].url} width="150px" alt={product.name} />
      <p>{product.name.charAt(0).toUpperCase() + product.name.slice(1)}</p>
      <div>
        <Rating {...options} />
        <span className="for-reviews">
          {product.numOfReviews === 0
            ? "No Reviews"
            : `${product.numOfReviews} ${
                product.numOfReviews === 1 ? "Review" : "Reviews"
              }`}
        </span>
      </div>

      <div className="priceContainer">
        <span>{`₹${product.price}`}</span>
      </div>
    </Link>
  );
};

export default TopHotDeals;
