import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import "./productDetail.css";
import "../../layout/Loader/loading.css";

import { BsArrowLeftCircleFill } from "react-icons/bs";
import Loader from "../../layout/Loader/Loading";
import ReviewCard from "./ReviewCard";
import {
  getProductDetails,
  clearErrors,
  newReview,
} from "../../../actions/productAction";
import { addItemsToCart } from "../../../actions/cartAction";
import { useAlert } from "react-alert";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../../constants/productConstants";

function ProductDetails() {
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails.product;

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const options = {
    size: "small",
    value: product && product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };
  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item Added To Cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      history.push("*");
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
    window.scrollTo(0, 0);
  }, [dispatch, id, error, history, reviewError, success, alert]);

  const navigateToPreviousPage = () => {
    history.goBack(); // Navigate back to the previous page
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="productDetails">
              <div className="GoBack">
                <button className="" onClick={navigateToPreviousPage}>
                  <BsArrowLeftCircleFill />
                </button>
                <span>Go Back</span>
              </div>
              <div className="carousel1">
                {product && product.images && product.images.length > 0 && (
                  <Carousel
                    interval={5000}
                    selectedItem={activeIndex}
                    onSelect={handleSelect}
                    infiniteLoop
                    autoPlay
                  >
                    {product.images.map((item, i) => (
                      <img
                        className="CarouselImage1"
                        key={item.url}
                        src={item.url}
                        alt={`${i} Slide`}
                      />
                    ))}
                  </Carousel>
                )}
              </div>

              <div className="product">
                <div className="detailsBlock-1">
                  {product && (
                    <>
                      <h2>
                        {product.name.charAt(0).toUpperCase() +
                          product.name.slice(1)}
                      </h2>
                      <p>Product # {product._id}</p>
                    </>
                  )}
                </div>
                <div className="detailsBlock-2">
                  {product && (
                    <>
                      <Rating {...options} />
                      <span className="detailsBlock-2-span">
                        {product.numOfReviews !== undefined &&
                        product.numOfReviews !== 0
                          ? `${product.numOfReviews} ${
                              product.numOfReviews === 1 ? "Review" : "Reviews"
                            }`
                          : "No Reviews"}
                      </span>
                    </>
                  )}
                </div>
                <div className="detailsBlock-3">
                  {product && product.price && <h1>{`₹${product.price}`}</h1>}
                  <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                      <button onClick={decreaseQuantity}>-</button>
                      <input
                        className="number"
                        type="number"
                        defaultValue="1"
                        value={quantity}
                      />
                      <button onClick={increaseQuantity}>+</button>
                    </div>
                    {product && product.Stock > 0 && (
                      <button onClick={addToCartHandler}>Add To Cart</button>
                    )}
                  </div>
                  {product && product.Stock !== undefined && (
                    <p>
                      Status:
                      <b
                        className={
                          product.Stock <= 0 ? "redColor" : "greenColor"
                        }
                      >
                        {product.Stock <= 0
                          ? `OutOfStock (${product.Stock})`
                          : `InStock (${product.Stock})`}
                      </b>
                    </p>
                  )}
                </div>
                <div className="detailsBlock-4">
                  Category:
                  {product && (
                    <p style={{ fontSize: "1.1vmax" }}>{product.category}</p>
                  )}
                  Description : {product && <p>{product.description}</p>}
                </div>
                <button className="submitReview" onClick={submitReviewToggle}>
                  Submit Review
                </button>
              </div>
            </div>
            <h3 className="reviewsHeading">REVIEWS</h3>

            <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={submitReviewToggle}
            >
              <DialogTitle>Submit Review</DialogTitle>
              <DialogContent className="submitDialog">
                <Rating
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                  size="large"
                />

                <textarea
                  className="submitDialogTextArea"
                  cols="30"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </DialogContent>
              <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                  Cancel
                </Button>
                <Button onClick={reviewSubmitHandler} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>

            {product && product.reviews && product.reviews.length > 0 ? (
              <div className="reviews">
                {product.reviews
                  .slice(-6)
                  .reverse()
                  .map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
              </div>
            ) : (
              <p className="noReviews">No Reviews Yet</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ProductDetails;
