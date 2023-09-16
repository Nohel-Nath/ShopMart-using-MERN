import React from "react";
import "./footer.css";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/appstore.jpg";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>
      <div className="midFooter">
        <h1>E-COMMERCE</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2023 &copy; Nohel Kumar Nath</p>
        <p>Build By Nohel Kumar Nath</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Me</h4>
        <a href="https://www.facebook.com/powerboy.nohel/">
          <FaFacebook />
        </a>
        <a href="https://github.com/Nohel-Nath">
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/nohel-nath-7b2157261/">
          <FaLinkedin />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
