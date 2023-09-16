import React, { useState } from "react";
import { TfiFaceSmile } from "react-icons/tfi";
import { MdOutlineMailLock } from "react-icons/md";
import { BiMessageRoundedDots } from "react-icons/bi";
import "./contact.css";
import { useAlert } from "react-alert";
import axios from "axios";
import MetaData from "../MetaData";

function Contact() {
  const alert = useAlert();
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    message: "",
  });

  const getValue = (e) => {
    const { name, value } = e.target;
    setInputValue(() => {
      return {
        ...inputValue,
        [name]: value,
      };
    });
  };

  const sentUserData = async (e) => {
    e.preventDefault();

    const { name, email, message } = inputValue;
    if (name === "") {
      alert.error("Name is require");
    } else if (email === "") {
      alert.error("Email is require");
    } else if (!email.includes("@")) {
      alert.error("invalid email");
    } else {
      try {
        const response = await axios.post(
          "https://shop-mart-xi.vercel.app/contact/message",
          {
            name,
            email,
            message,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          alert.success("Your Response Submitted");
          setInputValue({
            ...inputValue,
            name: "",
            email: "",
            message: "",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <MetaData title="Contact Us..." />
      <div className="contactContainer">
        <h2 style={{ marginTop: "-35px" }}>Contact Us -&gt;</h2>
        <div className="contactBox">
          <form className="contactForm">
            <div className="contactName">
              <TfiFaceSmile />
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={inputValue.name}
                onChange={getValue}
              />
            </div>
            <div className="contactEmail">
              <MdOutlineMailLock />

              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={inputValue.email}
                onChange={getValue}
              />
            </div>
            <div className="contactMessage">
              <BiMessageRoundedDots />

              <input
                type="message"
                placeholder="Message"
                required
                name="message"
                value={inputValue.message}
                onChange={getValue}
              />
            </div>

            <input
              type="submit"
              value="Submit"
              className="contactBtn"
              onClick={sentUserData}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
