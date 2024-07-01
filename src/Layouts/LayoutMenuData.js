import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Base_url from "../pages/Base_url/Base_url";
const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isApps, setIsApps] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isMis, setIsMis] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);




  // Pages
  const [isLanding, setIsLanding] = useState(false);

  // Charts

  const [newMemuItems, setNewMemuItems] = useState([])
  const [iscurrentState, setIscurrentState] = useState("Dashboard");
  const [getApiSliderBarData, setGetApiSliderBarData] = useState([])
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;
  const fetchMenus = async () => {
    const data = await axios.get(`${Base_url}/getAllModuleInf`, { headers: { Authorization: Token } })
    setGetApiSliderBarData(data)
  }
  useEffect(() => {
    fetchMenus()
  }, [])
  useEffect(() => {
    const menuItems = getApiSliderBarData.map((item) => {
      if (item.submodule.length) {
        return {
          mdid: item.mdid,
          id: item.modulenm,
          label: item.modulenm,
          icon: item.icon,
          link: item.modurl,
          click: function (e) {
            e.preventDefault();
            console.log(item.label == "Master","kkkkkkkkkkk");
            item.label != "Master" ? setIsPages((prev) => !prev) : setIsMis((prev) => !prev);
            setIscurrentState(item.label != "Master" ? "Pages" : item.modulenm);
            updateIconSidebar(e);
          },
          stateVariables: item.label != "Master" ? isPages : isMis,
          subItems: item.submodule.map((item) => {
            return {
              mdid: item.mdid,
              priority: item.priority,
              submdid: item.submdidm,
              id: item.submodnm,
              label: item.submodnm,
              link: item.submodurl,
              parentId: item.submodnm,
            }
          })
        }
      } else {
        return {
          mdid: item.mdid,
          id: item.modulenm,
          label: item.modulenm,
          icon: item.icon,
          link: item.modurl,
          click: function (e) {
            e.preventDefault();
            setIscurrentState(item.modulenm);
          }
        }
      }
    })
    setNewMemuItems(menuItems)
  }, [isPages, getApiSliderBarData])

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      console.log(ul);
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "Mis") {
      setIsMis(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }
    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState !== "Landing") {
      setIsLanding(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isMis,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
  ]);
  console.log(isPages, isMis);
  // const menuItems = [
  //   {
  //     id: "Master",
  //     label: "Master",
  //     icon: "ri-pages-line",
  //     link: "/#",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIsPages(!isPages);
  //       setIscurrentState("Pages");
  //       updateIconSidebar(e);
  //     },
  //     stateVariables: isPages,
  //     subItems: [
  //       {
  //         id: "Company",
  //         label: "Company",
  //         link: "/company-search",
  //         parentId: "Master",
  //       },
  //       {
  //         id: "User",
  //         label: "User",
  //         link: "/user-create",
  //         parentId: "Master",
  //       },
  //       {
  //         id: "Category",
  //         label: "Category",
  //         link: "/category",
  //         parentId: "Master",
  //       },
  //       {
  //         id: "Finish",
  //         label: "Finish",
  //         link: "/finish",
  //         parentId: "Master",
  //       },
  //       {
  //         id: "Color",
  //         label: "Color",
  //         link: "/color",
  //         parentId: "Master",
  //       },

  //       {
  //         id: "Warehouse",
  //         label: "Warehouse",
  //         link: "/warehouse",
  //         parentId: "Master",
  //       },
  //       {
  //         id: "Ledgercreate",
  //         label: "Ledger Create",
  //         link: "/ledger-Create",
  //         parentId: "Master",
  //       },
  //       {
  //         id: "Ledger Search",
  //         label: "Ledger Search",
  //         link: "/ledger-Search",
  //         parentId: "Master",
  //       },
  //     ],
  //   },

  //   // Modules

  //   {
  //     id: "managepart",
  //     label: "Manage Part",
  //     icon: "ri-honour-line",
  //     link: "/part",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("Manage Part");
  //     },
  //   },

  //   {
  //     id: "Manageproduct",
  //     label: "Manage Product",
  //     icon: "ri-honour-line",
  //     link: "/product-search",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("Manage Product");
  //     },
  //   },

  //   {
  //     id: "ManageManagePI",
  //     label: "Manage PI",
  //     icon: "ri-honour-line",
  //     link: "/proforma-Invoice",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("Manage PI ");
  //     },
  //   },
  //   {
  //     id: "ManageOrder",
  //     label: "Manage Order ",
  //     icon: "ri-honour-line",
  //     link: "/order-search",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("Manage Order ");
  //     },
  //   },

  //   {
  //     id: "Orderauthorize",
  //     label: "Order Authorize",
  //     icon: "ri-honour-line",
  //     link: "/order-authorize",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("Order Authorize ");
  //     },
  //   },

  //   {
  //     id: "MangeVender",
  //     label: "Manage Vendor PO",
  //     icon: "ri-honour-line",
  //     link: "/vendor",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("Mange Vendor");
  //     },
  //   },
  //   {
  //     id: "Vendorauthorize",
  //     label: "Vendor Authorize",
  //     icon: "ri-honour-line",
  //     link: "/vendor-authorize",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("Vendor Authorize ");
  //     },
  //   },
  //   {
  //     id: "VendorPoreceive",
  //     label: "Vendor Po Receive",
  //     icon: "ri-honour-line",
  //     link: "/vendor-po-receive",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("Vendor Po Receive");
  //     },
  //   },

  //   {
  //     id: "permissions",
  //     label: "Assign Modules",
  //     icon: "ri-honour-line",
  //     link: "/permission",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIscurrentState("part-issue");
  //     },
  //   },
  //   {
  //     id: "MIS",
  //     label: "MIS",
  //     icon: "ri-pages-line",
  //     link: "/#",
  //     click: function (e) {
  //       e.preventDefault();
  //       setIsMis(!isMis);
  //       setIscurrentState("Mis");
  //       updateIconSidebar(e);
  //     },
  //     stateVariables: isMis,
  //     subItems: [
  //       {
  //         id: "InventoryRegister",
  //         label: "Inventory Register",
  //         link: "/inventory-Register",
  //         parentId: "MIS",
  //       },
  //       {
  //         id: "InventoryIssu",
  //         label: "Inventory Issue Register",
  //         link: "/inventory-issue-Register",
  //         parentId: "MIS",
  //       },

  //       {
  //         id: "PartInventory",
  //         label: "Part Inventory ",
  //         link: "/part-inventory",
  //         parentId: "MIS",
  //       },
  //     ],
  //   }
  // ];

  // const menuItems = newData
  return <React.Fragment>{newMemuItems}</React.Fragment>;

};
export default Navdata;
