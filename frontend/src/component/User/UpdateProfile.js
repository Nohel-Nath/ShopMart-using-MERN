import React, { Fragment, useState, useEffect } from "react";
import "./updateProfile.css";
import { MdOutlineMailLock } from "react-icons/md";

import { CiFaceSmile } from "react-icons/ci";
import { BsTelephoneInbound } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
import {
  clearErrors,
  getUserDetails,
  updateProfile,
} from "../../actions/userAction";
import { useHistory } from "react-router-dom";

import { useAlert } from "react-alert";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loading";

function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useHistory();
  const alert = useAlert();

  const [avatar, setAvatar] = useState();

  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setNewPhone(e.target.value);
  };

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const updateSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", newName);
    myForm.set("email", newEmail);
    myForm.set("phone", newPhone);
    myForm.set("avatar", avatar);

    dispatch(updateProfile(myForm));
  };

  const updateDataChange = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (user) {
      setNewName(user.user && user.user.name);
      setNewEmail(user.user && user.user.email);
      const userPhone = user.user && user.user.phone;
      const phoneWithoutPrefix = userPhone && userPhone.replace("+880", "");
      setNewPhone(phoneWithoutPrefix);
      setAvatarPreview(user.user && user.user.avatar.url);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Profile Updated Successfully");
      dispatch(getUserDetails());
      navigate.push("/account");
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, isUpdated, navigate, error, user, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile..." />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <div className="updateHeading">
                <h2 className="updateProfileHeading">Update Profile</h2>
              </div>
              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateSubmit}
              >
                <div className="updateName">
                  <CiFaceSmile />
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={newName}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="updateEmail">
                  <MdOutlineMailLock />

                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={newEmail}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="updatePhone">
                  <BsTelephoneInbound />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    value={newPhone}
                    onChange={handlePhoneChange}
                  />
                </div>

                <div id="updateImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default UpdateProfile;
