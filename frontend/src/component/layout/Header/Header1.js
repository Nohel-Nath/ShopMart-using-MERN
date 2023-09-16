import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { FaSearch, FaRegUserCircle } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import "./header1.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

function Header1() {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const history = useHistory();
  const [keyword, setKeyword] = useState("");
  //const [isSearchVisible, setIsSearchVisible] = useState(true);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/products/${keyword}`);
    } else {
      history.push("/products");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsNavbarFixed(scrollTop > 0);
      //setIsSearchVisible(scrollTop === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );*/

  /*<div className="navbar-middle">
          {isSearchVisible && (
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
          )}
        </div>
        style={{
        backgroundColor: isNavbarFixed ? "white" : "transparent",
        width: "100%",
      }}
        */

  return (
    <div className={`header1 ${isNavbarFixed ? "navbar-fixed" : ""}`}>
      <nav className="navbar">
        <div className="navbar-left">
          <ul className="nav-links">
            <li className="nav-item">
              <NavLink to="/" exact activeClassName="active">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" activeClassName="active">
                About Us
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/contact" activeClassName="active">
                Contact Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products" activeClassName="active">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/hot-deals" activeClassName="active">
                Hot Deals
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="navbar-middle">
          <form className="search-container" onSubmit={searchSubmitHandler}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Products ..."
              className="search-input"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>
        <NavLink to="/cart" className="cart-container">
          <BsCart2 className="cart-icon" />
          <span className="cart-count">{cartItems.length}</span>
          <span className="cart-name">CART</span>
        </NavLink>
        <div className="cart-container1">
          {isAuthenticated ? (
            <NavLink to="/account" className="profile-container">
              <FaRegUserCircle className="profile-icon" />
              <span className="profile-name">
                {user && user.user && user.user.role === "admin"
                  ? "ADMIN"
                  : "USER"}
              </span>
            </NavLink>
          ) : (
            <NavLink to="/login" className="profile-container">
              <FaRegUserCircle className="profile-icon" />
              <span className="profile-name">ROLE</span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header1;
