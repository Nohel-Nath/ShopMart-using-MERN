import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";

import { clearErrors, getBlockUsers } from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import axios from "axios";

function BlockList() {
  const dispatch = useDispatch();

  const alert = useAlert();

  const history = useHistory();

  const { error, blockedUsers } = useSelector((state) => state.blockList);

  const handleUnblockAccount = async (userId) => {
    try {
      const response = await axios.put(
        `https://shop-mart-xi.vercel.app/user/${userId}/unblock`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert.success(response.data.message);
        history.push("/admin/users");
      } else {
        // Error occurred while blocking the user
        alert.error(response.data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getBlockUsers());
  }, [dispatch, alert, error]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.6 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.6,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() =>
                handleUnblockAccount(params.getValue(params.id, "id"))
              }
            >
              <CancelPresentationIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  blockedUsers &&
    blockedUsers.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">BLOCK USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
}

export default BlockList;
