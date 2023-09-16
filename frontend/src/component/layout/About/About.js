import React from "react";
import "./AboutPage.css";
import MetaData from "../MetaData";

import { Button, Avatar } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";

const About = () => {
  const visitGithub = () => {
    window.location = "https://github.com/Nohel-Nath";
  };
  return (
    <div className="aboutSection">
      <MetaData title="About Us..." />
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <h1>About Us</h1>

        <div>
          <div>
            <Avatar
              style={{ width: "15vmax", height: "15vmax", margin: "2vmax 0" }}
              src="/Nohel.jpg"
              alt="Founder"
            />
            <h style={{ color: "black", fontSize: "1.2rem" }}>
              Nohel Kumar Nath
            </h>
            <Button onClick={visitGithub} color="primary">
              Visit Github
            </Button>
            <span>This is a e-commerce website made by @nohelnath.</span>
          </div>
          <div className="aboutSectionContainer2">
            <h1 style={{ color: "black" }}>Our Brands</h1>
            <a href="https://www.facebook.com/powerboy.nohel/" target="blank">
              <FacebookIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://www.instagram.com/nohel_nath/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
