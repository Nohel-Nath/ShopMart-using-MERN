import React from "react";
import "./cartItem.css";
import { Link } from "react-router-dom";

function CartItem({ item, deleteCartItems }) {
  const handleRemove = () => {
    deleteCartItems(item.product);
    window.location.reload(); // Reload the page
  };

  return (
    <div className="CartItemCard">
      <img src={item.image} alt="ssa" />
      <div>
        <Link to={`/product/${item.product}`}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Link>
        <span>{`Price: ₹${item.price}`}</span>
        <p onClick={handleRemove}>Remove</p>
      </div>
    </div>
  );
}

export default CartItem;
