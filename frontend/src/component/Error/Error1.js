import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./error.css";

const Error1 = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <div className="error-container">
      <TransitionGroup>
        {showContent && (
          <CSSTransition classNames="fade" timeout={500}>
            <img
              src="https://st.depositphotos.com/1006899/2650/i/600/depositphotos_26505551-stock-photo-error-metaphor.jpg"
              alt="Error"
              className="error-image"
            />
          </CSSTransition>
        )}
      </TransitionGroup>
      <TransitionGroup>
        {showContent && (
          <CSSTransition classNames="fade" timeout={500}>
            <h1 className="error-heading">404 Not Found</h1>
          </CSSTransition>
        )}
      </TransitionGroup>
      <NavLink to="/" style={{ fontSize: 18, textDecoration: "underline" }}>
        Back To Home Page
      </NavLink>
      <TransitionGroup>
        {showContent && (
          <CSSTransition classNames="fade" timeout={500}>
            <p className="error-message">
              The requested page could not be found.
            </p>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Error1;
