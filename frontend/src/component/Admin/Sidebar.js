import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddIcon from "@material-ui/icons/Add";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import RateReviewIcon from "@material-ui/icons/RateReview";
import BlockIcon from "@material-ui/icons/Block";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">
        <img
          src="https://png.pngtree.com/template/20210709/ourmid/pngtree-e-commerce-brand-logo-image_545871.jpg"
          alt="ECommerce"
        />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
      <div className="linkI" style={{ color: "rgba(0, 0, 0, 0.493)" }}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ImportExportIcon />}
        >
          <TreeItem nodeId="1" label="Products">
            <Link to="/admin/products">
              <TreeItem nodeId="2" label="All" icon={<PostAddIcon />} />
            </Link>

            <Link to="/admin/newProduct">
              <TreeItem nodeId="3" label="Create" icon={<AddIcon />} />
            </Link>
          </TreeItem>
        </TreeView>
      </div>

      <Link to="/admin/orders">
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>

      <div className="linkI2">
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ImportExportIcon />}
        >
          <TreeItem nodeId="1" label="Users">
            <Link to="/admin/users">
              <TreeItem nodeId="2" label="All Users" icon={<PeopleIcon />} />
            </Link>

            <Link to="/admin/blockList">
              <TreeItem nodeId="3" label="Block List" icon={<BlockIcon />} />
            </Link>
          </TreeItem>
        </TreeView>
      </div>

      <Link to="/admin/reviews">
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
    </div>
  );
}

export default Sidebar;
