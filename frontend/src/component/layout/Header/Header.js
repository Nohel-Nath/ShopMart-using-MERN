import React from "react";

import { NavLink } from "react-router-dom";

import { BsTelephoneOutbound } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import "./header.css";

function Header() {
  /* 
  
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { useTheme } from "../../../Context/ContextTheme";

    const [theme, setTheme] = useTheme();
  //handle theme
  const handleTheme = () => {
    setTheme((prevState) => (prevState === "light" ? "dark" : "light"));
  };

  // Add a useEffect hook to apply the theme class to the body element
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  <div className={theme === "dark" ? "dark" : ""}> 

    <div className="theme-btn" onClick={handleTheme}>
            {theme === "light" ? (
              <BsFillMoonStarsFill size={18} />
            ) : (
              <BsFillSunFill size={18} />
            )}
          </div>

  </div>*/
  return (
    <div className="Header">
      <div className="Header__topbar space__between">
        <div className="logo pxy__10">
          <NavLink to="/">
            <img
              src="https://png.pngtree.com/template/20210709/ourmid/pngtree-e-commerce-brand-logo-image_545871.jpg"
              alt="logo"
              className="logo"
            />
          </NavLink>
        </div>

        <div className="searchBoxHome">
          <div className="inputBox">
            <span
              style={{
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Welcome to our shop...You can find anything in here as your
              favourites..
            </span>
          </div>
        </div>

        <div className="contactItemPhone">
          <BsTelephoneOutbound className="contactIcon" />
          <span className="contactText">+8801835621465</span>
        </div>
        <div className="contactItemEMail">
          <TfiEmail className="contactIcon" />
          <span className="contactText">nohelcse16@gmail.com</span>
        </div>

        <div className="emptySpace"></div>
      </div>
    </div>
  );
}
export default Header;
