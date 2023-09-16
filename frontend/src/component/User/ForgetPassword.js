import React, { Fragment, useState, useRef, useEffect } from "react";
import "./forgetPassword.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import axios from "axios";

function ForgetPassword() {
  const alert = useAlert();
  const submitButtonRef = useRef();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");

    return () => {
      setMessage(""); // Clear the message when the component unmounts
    };
  }, []);

  const sendLink = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://shop-mart-xi.vercel.app/user/password-forgot",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = res.data;
      if (res.status === 200 && data.success) {
        setEmail("");
        alert.success(data.message); // Display the success message using alert.success
      }
    } catch (error) {
      alert.error(error.response.data.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitButtonRef.current.click();
    }
  };

  return (
    <Fragment>
      <MetaData title="Forgot Password..." />
      <div className="forgotPasswordContainer">
        <div className="forgotPasswordBox">
          <h2 className="forgotPasswordHeading">Forgot Password</h2>
          <form className="forgotPasswordForm">
            <div className="forgotPasswordEmail">
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <input
              type="submit"
              value="Send"
              className="forgotPasswordBtn"
              ref={submitButtonRef}
              onClick={sendLink}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default ForgetPassword;
