import React, { useEffect, useRef, useState } from "react";
import "./login.css";
import { MdOutlineMailLock } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import { CiFaceSmile } from "react-icons/ci";
import { BsTelephoneInbound } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";

import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  loginUser,
  registerAUser,
} from "../../actions/userAction";
import { useHistory } from "react-router-dom";

import { LOGIN_SUCCESS } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";

function Login() {
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [passShow, setPassShow] = useState(false);

  const location = useLocation();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { name, email, password, phone } = user;

  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    let hasError = false;

    if (loginEmail.trim() === "") {
      form.elements.email.setCustomValidity("Email is required!");
      toast.error("Email is required!", {
        position: "top-center",
      });
      hasError = true;
    } else if (loginPassword.trim() === "") {
      form.elements.password.setCustomValidity("Password is required!");
      toast.error("Password is required!", {
        position: "top-center",
      });
      hasError = true;
    } else if (loginPassword.length < 6) {
      form.elements.password.setCustomValidity(
        "Password must be at least 6 characters long!"
      );
      toast.error("Password must be at least 6 characters long!", {
        position: "top-center",
      });
      hasError = true;
    }

    form.elements.email.setCustomValidity("");
    form.elements.password.setCustomValidity("");

    form.reportValidity();

    if (!hasError) {
      dispatch(loginUser(loginEmail, loginPassword));
    }
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    let hasError = false;

    if (name.trim() === "") {
      form.elements.name.setCustomValidity("Name is required");
      toast.error("Name is required", {
        position: "top-center",
      });
      hasError = true;
    } else if (name.length < 4 || name.length > 30) {
      form.elements.name.setCustomValidity(
        "Name should be between 4 and 30 characters long"
      );
      toast.error("Name should be between 4 and 30 characters long", {
        position: "top-center",
      });
      hasError = true;
    }

    if (email.trim() === "") {
      form.elements.email.setCustomValidity("Email is required");
      toast.error("Email is required", {
        position: "top-center",
      });
      hasError = true;
    }

    if (password.trim() === "") {
      form.elements.password.setCustomValidity("Password is required");
      toast.error("Password is required", {
        position: "top-center",
      });
      hasError = true;
    } else if (password.length < 6) {
      form.elements.password.setCustomValidity(
        "Password must be at least 6 characters long!"
      );
      toast.error("Password must be at least 6 characters long!", {
        position: "top-center",
      });
      hasError = true;
    }

    if (phone.trim() === "") {
      form.elements.phone.setCustomValidity("Phone Number is required");
      toast.error("Phone Number is required", {
        position: "top-center",
      });
      hasError = true;
    } else if (phone.length !== 10) {
      form.elements.phone.setCustomValidity(
        "Phone number should be 10 digits long"
      );
      toast.error("Phone number should be 10 digits long", {
        position: "top-center",
      });
      hasError = true;
    }

    form.elements.name.setCustomValidity("");
    form.elements.email.setCustomValidity("");
    form.elements.password.setCustomValidity("");
    form.elements.phone.setCustomValidity("");

    if (!hasError) {
      const myForm = new FormData();

      myForm.set("name", name);
      myForm.set("email", email);
      myForm.set("phone", phone);
      myForm.set("password", password);
      myForm.set("avatar", avatar);
      localStorage.setItem("loginCompleted", "true");
      dispatch(registerAUser(myForm));
    }
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  //const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    const loginCompleted = localStorage.getItem("loginCompleted");

    if (loginCompleted) {
      localStorage.removeItem("loginCompleted");
      window.location.reload(); // Reload the entire website
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
      });
      dispatch(clearErrors());
    }
    const token = localStorage.getItem("token");
    if (token) {
      dispatch({ type: LOGIN_SUCCESS, payload: { user: null, token } });
    }

    if (isAuthenticated) {
      navigate.push("/");
    }
  }, [dispatch, error, loading, isAuthenticated, navigate]);

  return (
    <>
      <div className="LoginSignUpContainer">
        <MetaData title="User SignIn" />
        <div className="LoginSignUpBox">
          <div class="FirstPart">
            <div className="picture">
              <img
                src={
                  "https://media.istockphoto.com/id/1294997127/vector/welcome-concept-team-of-people.jpg?s=612x612&w=0&k=20&c=iZvXMDaIasddC5_NBgt-V1x80--N5G3pOxAit_S5ttQ="
                }
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: " 0px 120px 120px 0px",
                }}
                alt="10"
              />
            </div>
          </div>
          <div class="SecondPart">
            <div>
              <div className="login_signUp_toggle">
                <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
              </div>
              <button className="switch-button" ref={switcherTab}></button>
            </div>
            <form
              className="loginForm"
              ref={loginTab}
              onSubmit={loginSubmit}
              noValidate
            >
              <div className="loginEmail">
                <MdOutlineMailLock />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="loginPassword">
                <AiOutlineLock />
                <input
                  type={!passShow ? "password" : "text"}
                  placeholder="Password"
                  name="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <div
                  className="password-toggle-icon"
                  onClick={() => setPassShow(!passShow)}
                >
                  {passShow ? <BsEyeSlashFill /> : <BsEyeFill />}
                </div>
              </div>
              <Link to="/password/forgot">Forget Password ?</Link>
              <input type="submit" value="Login" className="loginBtn" />
            </form>
            <form
              className="signUpForm"
              ref={registerTab}
              encType="multipart/form-data"
              onSubmit={registerSubmit}
              noValidate
            >
              <div className="signUpName">
                <CiFaceSmile />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signupEmail">
                <MdOutlineMailLock />

                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signupPhone">
                <BsTelephoneInbound />
                <div className="phoneNumberBox">
                  <span className="phoneNumberPrefix">+880</span>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    required
                    value={phone}
                    onChange={registerDataChange}
                    style={{
                      width: "80%",
                      border: "none",
                      borderRadius: "15px",
                      padding: "10px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
              </div>
              <div className="signupPassword">
                <AiOutlineLock />
                <input
                  type={!passShow ? "password" : "text"}
                  placeholder="Password"
                  name="password"
                  required
                  value={password}
                  onChange={registerDataChange}
                />
                <div
                  className="password-toggle-icon1"
                  onClick={() => setPassShow(!passShow)}
                >
                  {passShow ? <BsEyeSlashFill /> : <BsEyeFill />}
                </div>
              </div>
              <div id="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                />
              </div>
              <input type="submit" value="Register" className="signUpBtn" />
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
