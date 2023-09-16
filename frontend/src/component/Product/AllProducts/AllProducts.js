import React, { useEffect, useRef, useState } from "react";
import "./allProducts.css";
import { useSelector, useDispatch } from "react-redux";

import { useHistory, useParams } from "react-router-dom";

import Pagination from "react-js-pagination";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import Button from "react-bootstrap/Button";

import TopAllProducts from "./TopAllProducts";
import { clearErrors, getAllProducts } from "../../../actions/productAction";
import Loader from "../../layout/Loader/Loading";
import MetaData from "../../layout/MetaData";
import ScrollToTop from "react-scroll-to-top";

const categories = ["Laptop", "Headphone", "Camera", "Watch", "Smartphone"];

function AllProducts({ match }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const { keyword } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([100, 200000]);
  const [manualMinPrice, setManualMinPrice] = useState("");
  const [manualMaxPrice, setManualMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [showLoader, setShowLoader] = useState(true);
  const [ratings, setRatings] = useState(0);
  const applyButtonRef = useRef(null);

  const {
    loading,
    error,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.getAllProducts);

  let count = Math.min(filteredProductsCount, 2);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const handleManualMinPriceChange = (event) => {
    setManualMinPrice(event.target.value);
  };

  const handleManualMaxPriceChange = (event) => {
    setManualMaxPrice(event.target.value);
  };

  const applyManualPrice = () => {
    const minPrice = Number(manualMinPrice);
    const maxPrice = Number(manualMaxPrice);
    setPrice([minPrice, maxPrice]);
  };

  const priceHandler = (event, newPrice) => {
    const [minPrice, maxPrice] = newPrice;
    setPrice(newPrice);
    setManualMinPrice(minPrice);
    setManualMaxPrice(maxPrice);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (manualMinPrice !== "" && manualMaxPrice !== "") {
        applyButtonRef.current.click();
      }
    }
  };
  useEffect(() => {
    if (error) {
      history.push("*");
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
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("page");
    const currentPageFromURL = parseInt(page, 10) || 1;
    setCurrentPage(currentPageFromURL);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", currentPage);
    if (category) {
      queryParams.set("category", category);
    } else {
      queryParams.delete("category");
    }
    if (price[0] !== 100 || price[1] !== 20000) {
      queryParams.set("price[minPrice]", price[0]);
      queryParams.set("price[maxPrice]", price[1]);
    }
    if (ratings) {
      queryParams.set("ratings", ratings);
    } else {
      queryParams.delete("ratings");
    }

    history.push(`?${queryParams.toString()}`);
    dispatch(getAllProducts(keyword, currentPage, category, price, ratings));
  }, [currentPage, history, keyword, dispatch, category, price, ratings]);

  const navigateToPreviousPage2 = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("category");
    urlParams.delete("price[minPrice]");
    urlParams.delete("price[maxPrice]");
    urlParams.delete("ratings");
    history.push(`?${urlParams.toString()}`);
    setCategory(""); // Clear the selected category
    setPrice([100, 20000]); // Reset the price range
    setTimeout(() => {
      setManualMinPrice(""); // Clear the manualMinPrice after navigating
      setManualMaxPrice(""); // Clear the manualMaxPrice after navigating
    }, 0);
    setRatings("");
  };

  return (
    <div>
      {currentPage === 1 && (
        <div className="newGoBack">
          <Button onClick={navigateToPreviousPage2}>
            <BsArrowLeftCircleFill />
          </Button>
          <span className="back-span">Go Back</span>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="All Products..." />
          <div>
            <h2 className="homeHeading3">All Products</h2>
            {products && products.length > 0 ? (
              <div className="AllContainer" id="container">
                {products.map((product) => (
                  <TopAllProducts product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <p className="noProductsMessage">No products found.</p>
            )}
          </div>

          {currentPage === 1 && products && products.length > 0 && (
            <div className="filterBox">
              {category === "" && (
                <>
                  <Typography
                    className="animated-underline"
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "black",
                    }}
                  >
                    Price Range
                  </Typography>

                  <div className="priceInputContainer">
                    <div className="priceContainer1">
                      <div className="priceInputs">
                        <input
                          type="text"
                          value={manualMinPrice}
                          onChange={handleManualMinPriceChange}
                          onKeyPress={handleKeyPress}
                          placeholder="Min"
                          className="priceInput1"
                        />

                        <div className="priceInputSeparator">-</div>

                        <input
                          type="text"
                          value={manualMaxPrice}
                          onChange={handleManualMaxPriceChange}
                          onKeyPress={handleKeyPress}
                          placeholder="Max"
                          className="priceInput2"
                        />
                      </div>
                    </div>
                    <div className="buttonContainer1">
                      <Button
                        ref={applyButtonRef}
                        className="applyButton"
                        onClick={applyManualPrice}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={100}
                    max={200000}
                    className="custom-slider"
                  />
                </>
              )}
              <Typography
                className="animated-underline"
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginTop: "20px",
                  color: "black",
                }}
              >
                Categories
              </Typography>
              <ul className="categoryBox">
                <h className="all">All</h>
                {categories.map((category) => (
                  <div className="category-links">
                    <li
                      className="category-link"
                      key={category}
                      onClick={() => setCategory(category)}
                    >
                      {category}
                    </li>
                  </div>
                ))}
              </ul>
              <fieldset>
                <legend>
                  <Typography
                    className="animated-underline"
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginTop: "10px",
                      color: "black",
                    }}
                  >
                    Ratings Above
                  </Typography>
                </legend>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => {
                    setRatings(newRating);
                  }}
                  step={1}
                  marks
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                  className="ratings-slider"
                />
              </fieldset>
            </div>
          )}

          {category === "" &&
            resultPerPage < productsCount &&
            products.length > 0 && (
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  activeClass="active" // Update class name here
                  activeLinkClass="active"
                  pageRangeDisplayed={count}
                />
              </div>
            )}
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

export default AllProducts;
