import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader/Loading";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Footer from "../layout/Footer/Footer";
import "./account.css";
import axios from "axios";
import { useAlert } from "react-alert";
import { useTheme } from "../../Context/ContextTheme";

function capitalizeFirstChar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Account() {
  const alert = useAlert();
  const history = useHistory();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const userName = user && user.user && user.user.name;
  const capitalizedUserName = userName ? capitalizeFirstChar(userName) : "";

  useEffect(() => {
    if (isAuthenticated === false) {
      history.push("/login");
    }
  }, [history, isAuthenticated]);

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(
        "https://shop-mart-xi.vercel.app/user/deleteAccount",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (res.status === 200 && data.success) {
        const token = data.token;
        // Delete token from local storage
        localStorage.removeItem("token", token);
        // Delete token from cookies

        document.cookie =
          "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        alert.success(data.message);
        history.push("/login"); // Display the success message using alert.success
      }
    } catch (error) {
      alert.error(error.response.data.message);
    }
  };

  const theme = useTheme();

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${capitalizedUserName}'s Profile...`} />
          <div className="profileContainer">
            <div>
              <h1>My Profile</h1>
              <img
                src={user && user.user && user.user.avatar.url}
                alt={user && user.user && user.user.name}
              />
              <Link to="/me/update">Edit Profile</Link>
              <button className="delete" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
            <div>
              <div>
                <h4>Full Name:</h4>
                <p>
                  {user &&
                    user.user &&
                    user.user.name &&
                    user.user.name.charAt(0).toUpperCase() +
                      user.user.name.slice(1)}
                </p>
                <hr />
              </div>
              <div>
                <h4>Email:</h4>
                <p>{user && user.user && user.user.email}</p>
                <hr />
              </div>
              <div>
                <h4>Phone:</h4>
                <p>{user && user.user && user.user.phone}</p>
                <hr />
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default Account;
