import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";


//Master
import User from "../pages/Master/User";
import Category from "../pages/Master/Category";
import Finish from "../pages/Master/Finish";
import Color from "../pages/Master/Color";
import WareHouse from "../pages/Master/Warehouse";
import LedgerCreate from "../pages/Master/LedgerCreate";
import LedgerReport from "../pages/Master/LedgerReport";
import Company from "../pages/Master/Company";
import CompanySearch from '../pages/Master/CompanySearch';

//product 
import Part from "../pages/Part/Part";
import Product from "../pages/Product/Product";

import PhotoOffer from "../pages/PhotoOffer/PhotoOffer";
import Catalogue from "../pages/ManageCatalague/Catalogue";
import Cataloguesearch from "../pages/ManageCatalague/Cataloguesearch";
import Proforma from "../pages/ManagaPI/Proforma";
import AddProforma from "../pages/ManagaPI/AddProforma";
import OrderSearch from "../pages/ManageOrder/OrderSearch";
import Ordercreate from "../pages/ManageOrder/Ordercreate";
import OrderAuthorize from "../pages/ManageOrder/OrderAuthorize";
import Vedorsearch from "../pages/ManageVendor/Vedorsearch";
import Vendorcreate from "../pages/ManageVendor/Vendorcreate";
import VendorAuthorize from "../pages/ManageVendor/VendorAuthorize";
import Vendorporeceive from "../pages/ManageVendor/Vendorporeceive";
import Partissue from "../pages/Partissue/Partissue";
import Productsearch from "../pages/Product/Productsearch";
// Report

import InventoryIssueRegister from "../pages/Report/InventoryIssueRegister";
import InventoryRegister from "../pages/Report/InventoryRegister";
import PartInventory from "../pages/Report/PartInventory";

//comming soon
import ComminSoon from './../pages/ComingSoon/ComingSoon'
import LedgerUpdate from "../pages/Master/LedgerUpdate";
import PermissionPage from "../pages/permissions/permission-page";

const authProtectedRoutes = [

  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  //Masters

  { path: "/user-create", component: <User /> },
  { path: "/category", component: <Category /> },
  { path: "/finish", component: <Finish /> },
  { path: "/color", component: <Color /> },
  { path: "/warehouse", component: <WareHouse /> },
  { path: "/ledger-update", component: <LedgerUpdate /> },
  { path: "/ledger-Create", component: <LedgerCreate /> },
  { path: "/ledger-Search", component: <LedgerReport /> },
  { path: "/company", component: <Company /> },
  { path: "/company-search", component: <CompanySearch /> },

  { path: "/*", component: <ComminSoon /> },
  //product  
  { path: "/part", component: <Part /> },
  { path: "/product", component: <Product /> },
  { path: "/product-search", component: <Productsearch /> },
  { path: "/photo-offer", component: <PhotoOffer /> },
  { path: "/catalogue", component: <Catalogue /> },
  { path: "/catalogue-Search", component: <Cataloguesearch /> },
  { path: "/proforma-Invoice", component: <Proforma /> },
  { path: "/addproforma", component: <AddProforma /> },
  { path: "/order-search", component: <OrderSearch /> },
  { path: "/order-create", component: <Ordercreate /> },
  { path: "/order-authorize", component: <OrderAuthorize /> },
  { path: "/vendor", component: <Vedorsearch /> },
  { path: "/vendor-create", component: <Vendorcreate /> },
  { path: "/vendor-authorize", component: <VendorAuthorize /> },
  { path: "/vendor-po-receive", component: <Vendorporeceive /> },
  { path: "/part-issue", component: <Partissue /> },

  //Report
  { path: "/inventory-issue-Register", component: <InventoryIssueRegister /> },
  { path: "/inventory-Register", component: <InventoryRegister /> },
  { path: "/part-inventory", component: <PartInventory /> },
  { path: "/permission", component: <PermissionPage /> },




  {
    path: "/",
    exact: true,
    component: <Navigate to="/" />,
  },
  { path: "*", component: <Navigate to="/" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

];

export { authProtectedRoutes, publicRoutes };