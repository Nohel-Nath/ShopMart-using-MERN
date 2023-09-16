import React, { useState } from "react";

import Carousel from "react-bootstrap/Carousel";

import "./image.css";

function ImageSlide() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <Carousel
      activeIndex={activeIndex}
      onSelect={handleSelect}
      interval={1000}
      className="carouse"
    >
      <Carousel.Item>
        <img
          className="d-block  mx-auto w-100"
          src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          alt="First slide"
          height="550px"
        />

        <Carousel.Caption>
          <p2>Welcome to our online store!.</p2>
        </Carousel.Caption>
        <Carousel.Caption>
          <div className="caption-content">
            <h2>Buy 2 Get 1 Free</h2>

            <h3>Fashionable</h3>
            <h4>Collection</h4>
            <button className="btn">Shop Now</button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.unsplash.com/photo-1533022139390-e31c488d69e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80"
          alt="Second slide"
          height="550px"
        />

        <Carousel.Caption>
          <p>
            Stay up to date with the latest trends and stay inspired by the
            captivating imagery on display.
          </p>
        </Carousel.Caption>
        <Carousel.Caption>
          <div className="caption-content">
            <h2>Buy 2 Get 1 Free</h2>
            <h3>Fashionable</h3>
            <h4>Collection</h4>
            <button className="btn">Shop Now</button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.unsplash.com/photo-1635405074683-96d6921a2a68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
          alt="Third slide"
          height="550px"
        />

        <Carousel.Caption>
          <p>
            Start your shopping journey now and experience the joy of finding
            your perfect match
          </p>
        </Carousel.Caption>
        <Carousel.Caption>
          <div className="caption-content">
            <h2>Buy 2 Get 1 Free</h2>
            <h3>Fashionable</h3>
            <h4>Collection</h4>
            <button className="btn">Shop Now</button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.unsplash.com/photo-1505739718967-6df30ff369c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          alt="Third slide"
          height="550px"
        />

        <Carousel.Caption>
          <p1>Happy shopping!</p1>
        </Carousel.Caption>
        <Carousel.Caption>
          <div className="caption-content">
            <h2>Buy 2 Get 1 Free</h2>
            <h3>Fashionable</h3>
            <h4>Collection</h4>
            <button className="btn">Shop Now</button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ImageSlide;
