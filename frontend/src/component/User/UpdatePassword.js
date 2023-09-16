import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "./updatePassword.css";
import { clearErrors, updatePassword } from "../../actions/userAction";
import { useHistory } from "react-router-dom";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import Loader from "../layout/Loader/Loading";

function UpdatePassword() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passShow, setPassShow] = useState(false);
  const [passShow1, setPassShow1] = useState(false);
  const [passShow2, setPassShow2] = useState(false);

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Password Updated Successfully");

      history.push("/account");

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, alert, history, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Password..." />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Password</h2>
              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <div className="forShow">
                    <VpnKeyIcon />
                    <input
                      type={!passShow ? "password" : "text"}
                      placeholder="Old Password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <div
                      className="showPass"
                      onClick={() => setPassShow(!passShow)}
                    >
                      {passShow ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </div>
                  </div>
                </div>
                <div className="loginPassword">
                  <div className="forShow">
                    <LockOpenIcon />
                    <input
                      type={!passShow1 ? "password" : "text"}
                      placeholder="New Password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default UpdatePassword;
