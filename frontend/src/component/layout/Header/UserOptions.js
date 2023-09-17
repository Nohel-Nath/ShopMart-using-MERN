import React, { Fragment, useState } from "react";
import "./userOptions.css";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../actions/userAction";
import "../Loader/loading.css";
import Loader from "../Loader/Loading";
import Backdrop from "@material-ui/core/Backdrop";
import Cookies from "js-cookie";
function UserOptions({ user }) {
  const [open, setOpen] = useState(false);
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const { cartItems } = useSelector((state) => state.cart);

  const options = [
    {
      icon: <ListAltIcon style={{ color: "black" }} />,
      name: "Orders",
      func: orders,
    },
    {
      icon: <PersonIcon style={{ color: "black" }} />,
      name: "Profile",
      func: account,
    },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "black" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    {
      icon: <ExitToAppIcon style={{ color: "black" }} />,
      name: "Logout",
      func: logoutUser,
    },
  ];

  const isAdmin = user && user.user && user.user.role === "admin";

  if (isAdmin) {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    history.push("/admin/dashboard");
  }
  function orders() {
    history.push("/orders");
  }
  function account() {
    history.push("/account");
  }
  function cart() {
    history.push("/cart");
  }
  function logoutUser() {
    dispatch(logout());
    toast.success("Logout Successfully");
    Cookies.remove("token");
    //localStorage.removeItem("loginCompleted");
    history.push("/");
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Backdrop open={open} style={{ zIndex: "10" }} />
          <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            style={{ zIndex: 11 }}
            open={open}
            direction="down"
            className="speedDial"
            icon={
              <img
                className="speedDialIcon"
                src={user?.user?.avatar?.url || ""}
                alt="Profile"
              />
            }
          >
            {options.map((item) => (
              <SpeedDialAction
                key={item.name}
                icon={item.icon}
                tooltipTitle={item.name}
                onClick={item.func}
                tooltipOpen={window.innerWidth <= 600 ? true : false}
              />
            ))}
          </SpeedDial>
          <ToastContainer />
        </Fragment>
      )}
    </>
  );
}

export default UserOptions;
