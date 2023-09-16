import React, { Fragment, useState } from "react";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "./resetPassword.css";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const alert = useAlert();
  const { token } = useParams();

  const history = useHistory();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passShow1, setPassShow1] = useState(false);
  const [passShow2, setPassShow2] = useState(false);

  const sendPassword = async (e) => {
    e.preventDefault();

    if (password === "") {
      alert.error("Password is required!");
      return;
    }

    if (confirmPassword === "") {
      alert.error("Confirm Password is required!");
      return;
    }
    if (password.length < 6) {
      alert.error("Password must be at least 6 characters!");
      return;
    }
    if (password !== confirmPassword) {
      alert.error("Password does not match");
      return;
    }

    try {
      await axios.put(
        `https://shop-mart-xi.vercel.app/user/password-reset/${token}`,
        {
          password: password,
          confirmPassword: confirmPassword,
        }
      );

      alert.success("Password changed");
      history.push("/login");
    } catch (error) {
      alert.error(error.response.data.message);
    }
  };

  return (
    <Fragment>
      <MetaData title="Change Password..." />
      <div className="resetPasswordContainer">
        <div className="resetPasswordBox">
          <h2 className="resetPasswordHeading">Update Password</h2>
          <form className="resetPasswordForm" onSubmit={sendPassword}>
            <div>
              <div className="forShow">
                <LockOpenIcon />
                <input
                  type={!passShow1 ? "password" : "text"}
                  placeholder="New Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="showPass"
                  onClick={() => setPassShow1(!passShow1)}
                >
                  {passShow1 ? <BsEyeSlashFill /> : <BsEyeFill />}
                </div>
              </div>
            </div>
            <div className="loginPassword">
              <div className="forShow">
                <LockIcon />
                <input
                  type={!passShow2 ? "password" : "text"}
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div
                  className="showPass"
                  onClick={() => setPassShow2(!passShow2)}
                >
                  {passShow2 ? <BsEyeSlashFill /> : <BsEyeFill />}
                </div>
              </div>
            </div>
            <input type="submit" value="Change" className="resetPasswordBtn" />
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default ResetPassword;
