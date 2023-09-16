import React from "react";
import { Rating } from "@material-ui/lab";
import "./productDetail.css";

function ReviewCard({ review }) {
  const options = {
    size: "medium",
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };

  const words = review.name.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const capitalizedName = capitalizedWords.join(" ");
  return (
    <div className="reviewCard">
      <img
        src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
        alt="User"
      />

      <p>{capitalizedName}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
}

export default ReviewCard;
