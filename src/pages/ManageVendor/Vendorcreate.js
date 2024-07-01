import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";
import Select from "react-select";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainers";
import DeleteModal from "../../Components/Common/DeleteModal";
import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";

//Import actions
import {
  getOrders as onGetOrders,
  deleteOrder as onDeleteOrder,
} from "../../slices/thunks";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Token from "../Token/Base_Token";
import url from "../Base_url/Base_url";
import ExportCSVModal from "./../../Components/Common/ExportCSVModal";
import { createSelector } from "reselect";

const formatDate = (dateString) => {
  return dateString;
};


function dateFormat(inputDate) {
  const date = new Date(inputDate);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because it's 0-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

const Vendorcreate = () => {
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;

  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Ecommerce;
  const selectLayoutProperties = createSelector(selectLayoutState, (ecom) => ({
    orders: ecom.orders,
    isOrderSuccess: ecom.isOrderSuccess,
    error: ecom.error,
  }));
  // Inside your component
  const { orders, isOrderSuccess, error } = useSelector(selectLayoutProperties);

  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState([]);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  useEffect(() => {
    if (!isEmpty(orders)) setOrderList(orders);
  }, [orders]);

  useEffect(() => {
    if (orders && !orders.length) {
      dispatch(onGetOrders());
    }
  }, [dispatch, orders]);

  useEffect(() => {
    setOrder(orders);
  }, [orders]);

  useEffect(() => {
    if (!isEmpty(orders)) {
      setOrder(orders);
      setIsEdit(false);
    }
  }, [orders]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  const handleOrderClicks = () => {
    setOrder("");
    setIsEdit(false);
    toggle();
  };

  const handleOrderClick = useCallback(
    (arg) => {
      const order = arg;
      setOrder({
        _id: order._id,
        orderId: order.orderId,
        customer: order.customer,
        product: order.product,
        orderDate: order.orderDate,
        ordertime: order.ordertime,
        amount: order.amount,
        payment: order.payment,
        status: order.status,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".orderCheckBox");
    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }

    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allItemIndexes = tabledata.map((row) => row.rwid);
      setSelectedItems(allItemIndexes);
      setCheckedRows(allItemIndexes);
    } else {
      setSelectedItems([]);
      setCheckedRows([]);
    }
  };

  const handleCheckboxChange = (index, checked) => {
    let updatedSelectedItems = [...selectedItems];
    if (checked) {
      const isAlreadyAdded = addedItems.some((item) => item.rwid === index);
      if (isAlreadyAdded) {
        alert("This item has already been added.");
        return;
      }
      updatedSelectedItems.push(index);
    } else {
      updatedSelectedItems = updatedSelectedItems.filter(
        (item) => item !== index
      );
    }

    setCheckedRows((prevCheckedRows) => {
      if (prevCheckedRows.includes(index)) {
        return prevCheckedRows.filter((row) => row !== index);
      } else {
        return [...prevCheckedRows, index];
      }
    });

    setSelectedItems(updatedSelectedItems);
  };

  const handleCellChange = (event, rowId, field, value) => {
    event.preventDefault();
    setTabledata((prevData) => {
      return prevData.map((row) => {
        if (row.rwid === rowId) {
          let newRow = { ...row, [field]: value };
  
          if (field === "issueQty") {
            let tempissueqty = value - row.issueQty || 0;
  
            // Remove validation check
            newRow.issueQty = value;
            newRow.pendingQty -= tempissueqty;
            newRow.amount = (newRow.rate || 0) * value;
            newRow.totalAmount =
              newRow.amount +
              (((newRow.amount || 0) * (newRow.tax || 0)) / 100 || 0);
  
          } else if (field === "rate") {
            newRow.rate = value;
            newRow.amount = newRow.issueQty * value;
            newRow.totalAmount =
              newRow.amount +
              (((newRow.issueQty || 0) * value * (newRow.tax || 0)) / 100 || 0);
          } else if (field === "tax") {
            newRow.tax = value;
            newRow.totalAmount =
              newRow.amount + (((newRow.amount || 0) * value) / 100 || 0);
          }
  
          return newRow;
        } else {
          return row;
        }
      });
    });
  };
  const [checkedRows, setCheckedRows] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  console.log("addedItems------", addedItems)

  const handledelete = (index) => {
    const newArray = [...addedItems];
    newArray.splice(index, 1);
    setAddedItems(newArray);

    const dataarr = [...addedItems];
    dataarr.splice(index + 1, 1);
    const totalamt = dataarr.reduce(
      (total, item) => Number(item.totalAmount || 0),
      0
    );
    Setdata((prevData) => ({
      ...prevData,
      netamount: Number(prevData.netamount) - Number(totalamt),
    }));
  };
  // Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            className="form-check-input"
            onClick={handleSelectAll}
          //
          />
        ),
        Cell: ({ row }) => {
          return (
            <input
              type="checkbox"
              className="form-check-input"
              checked={checkedRows.includes(row.original.rwid)}
              onChange={(event) =>
                handleCheckboxChange(row.original.rwid, event.target.checked)
              }
            />
          );
        },
        id: "#",
      },
      {
        Header: "image",
        accessor: "image",
        filterable: false,
        Cell: ({ row }) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 ">
                <img
                  src={row.original.image}
                  alt=""
                  className="avatar-xs rounded-circle image-zoom"
                />
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Order Code",
        accessor: "ordercd",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Product/Part Code",
        accessor: "productPartcd",
        filterable: false,
      },

      {
        Header: "Description",
        accessor: "description",
        filterable: false,
      },
      {
        Header: "Size",
        accessor: "size",
        filterable: false,
      },
      {
        Header: "Buyer Po",
        accessor: "buyerpo",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Dispatch Date",
        accessor: "dispatchdate",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
        // Cell: ({ value }) => {
        //   const date = new Date(value);
        //   const formattedDate = `${date.getDate()}/${date.getMonth() + 1
        //     }/${date.getFullYear()}`;
        //   return formattedDate;
        // },
      },
      {
        Header: "Order Qty",
        accessor: "orderQty",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Pending Qty",
        accessor: "pendingQty",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
        // Cell: ({ row }) => {
        //   return (
        //     <Input
        //       style={{ width: "5rem" }}
        //       type="number"
        //       value={row.original.pendingQty}
        //       disabled={!checkedRows.includes(row.original.rwid)}
        //     />
        //   );
        // },
      },
      {
        Header: "Issue Qty",
        accessor: "issueQty",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.issueQty}
              disabled={!checkedRows.includes(row.original.rwid)}
              onChange={(e) =>
                handleCellChange(
                  e,
                  row.original.rwid,
                  "issueQty",
                  e.target.value
                )
              }
            />
          );
        },
      },

      {
        Header: "Rate",
        accessor: "rate",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.rate}
              disabled={!checkedRows.includes(row.original.rwid)}
              onChange={(e) =>
                handleCellChange(e, row.original.rwid, "rate", e.target.value)
              }
            />
          );
        },
      },
      {
        Header: "Amount ",
        accessor: "amount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.amount}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "GST ",
        accessor: "tax",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.tax}
              disabled={!checkedRows.includes(row.original.rwid)}
              onChange={(e) =>
                handleCellChange(e, row.original.rwid, "tax", e.target.value)
              }
            />
          );
        },
      },
      {
        Header: "Total Amount",
        accessor: "totalAmount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.totalAmount}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Remark",
        accessor: "remark",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="text"
              value={row.original.remark}
              disabled={!checkedRows.includes(row.original.rwid)}
              onChange={(e) =>
                handleCellChange(e, row.original.rwid, "remark", e.target.value)
              }
            />
          );
        },
      },
    ],
    [checkedRows, addedItems]
  );

  const Addcolumns = useMemo(
    () => [
      {
        Header: "image",
        accessor: "image",
        filterable: false,
        Cell: ({ row }) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 ">
                <img
                  src={row.original.image}
                  alt=""
                  className="avatar-xs rounded-circle image-zoom"
                />
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Order Code",
        accessor: "ordercd",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Product/Part Code",
        accessor: "productPartcd",
        filterable: false,
      },

      {
        Header: "Description",
        accessor: "description",
        filterable: false,
      },
      {
        Header: "Size",
        accessor: "size",
        filterable: false,
      },
      {
        Header: "Buyer Po",
        accessor: "buyerpo",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Dispatch Date",
        accessor: "dispatchdate",
        filterable: false,
        // Cell: ({ value }) => {
        //   const date = new Date(value);
        //   const formattedDate = `${date.getDate()}/${date.getMonth() + 1
        //     }/${date.getFullYear()}`;
        //   return formattedDate;
        // },
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Order Qty",
        accessor: "orderQty",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Pending Qty",
        accessor: "pendingQty",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Issue Qty",
        accessor: "issueQty",
        filterable: false,
      },

      {
        Header: "Rate",
        accessor: "rate",
        filterable: false,
      },
      {
        Header: "Amount ",
        accessor: "amount",
        filterable: false,
      },
      {
        Header: "GST ",
        accessor: "tax",
        filterable: false,
      },
      {
        Header: "Total Amount",
        accessor: "totalAmount",
        filterable: false,
      },
      {
        Header: "Remark",
        accessor: "remark",
        filterable: false,
      },
      {
        Header: "Action",
        accessor: "actionId",
        filterable: false,
        Cell: (row) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <i
                  class="ri-delete-bin-5-fill fs-16"
                  style={{ color: "red" }}
                  onClick={() => handledelete(row.index)}
                ></i>
              </li>
            </ul>
          );
        },
      },
    ],
    [handledelete]
  );

  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Order";

  const [prdcodevalue, setPrdcodevalue] = useState(null);
  const [prdcatvalue, setPrdcatvalue] = useState(null);
  const [prdaliasvalue, setPrdaliasvalue] = useState(null);
  const [prddescriptionvalue, setPrddescriptionvalue] = useState(null);
  const [partcodevalue, setPartcodevalue] = useState(null);
  const [partnamevalue, setPartnamevalue] = useState(null);
  const [buyerpovalue, setBuyerpovalue] = useState(null);
  const [clientnamevalue, setClientnamevalue] = useState(null);
  const [ordercodevalue, setOrdercodevalue] = useState(null);
  const [category, setCategory] = useState([]);
  const [productcode, setProductcode] = useState([]);
  const [prdalias, setPrdalias] = useState([]);
  const [description, setDiscription] = useState([]);
  const [partcode, setPartcode] = useState([]);
  const [partname, setPartname] = useState([]);
  const [ordercode, setOrdercode] = useState([]);
  const [clientname, setClientname] = useState([]);
  const [buyerpo, setBuyerpo] = useState([]);

  const [buyerdata, setBuyerdata] = useState([]);
  const [buyername, setBuyername] = useState([]);
  const [addressName, setAddressName] = useState([]);
  const [alldetailsofbuyer, setAlldetailsofbuyer] = useState([]);
  const [buyerSearchCompleted, setBuyerSearchCompleted] = useState(false);
  const [allProductFetched, setAllProductFetched] = useState(false);

  const [buyernameoption, setBuyernameoption] = useState(null);
  const [addlessvalue, setAddlessvalue] = useState({
    label: "Add",
    value: "Add",
  });
  const [type, setType] = useState({ label: "Order", value: "Order" });
  const [orderFilters, setOrderFilters] = useState(true);
  const [stockFilters, setStockFilters] = useState(false);
  const [tabledata, setTabledata] = useState([]);
  console.log("tabledata=======", tabledata)
  const [data, Setdata] = useState({
    from: type,
    vendorName: "",
    deliverydate: "",
    remark: "",
    netamount: "",
    addLess: "Add",
    addlessAmount: "",
    cartageAmount: "",
    cartageTax: "",
    grandAmount: "",
    createBy: "",
    updateBy: "",
  });

  const Types = [
    {
      options: [
        { label: "Order", value: "Order" },
        { label: "Stock", value: "Stock" },
      ],
    },
  ];

  const buyernames = [
    {
      options: [
        { label: "Select", value: "" },
        ...buyername.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allproductcode = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...productcode.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allproductcategory = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...category.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allproductalias = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...prdalias.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allproductdescription = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...description.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allpartcode = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...partcode.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allpartname = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...partname.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allbuyerpo = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...buyerpo.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allclientname = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...clientname.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allordercode = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...ordercode.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const addless = [
    {
      options: [
        { label: "Add", value: "Add" },
        { label: "Less", value: "Less" },
      ],
    },
  ];

  const handlefilterchange = (e) => {
    Setdata((prevData) => ({
      ...prevData,
      type: e.value,
    }));
  };

  const handlefilterchange1 = (e) => {
    if (e.value == "Order") {
      setOrderFilters(true);
      setStockFilters(false);
      setTabledata([]);
    } else if (e.value == "Stock") {
      setOrderFilters(false);
      setStockFilters(true);
      setTabledata([]);
    }
  };

  const location = useLocation();

  useEffect(() => {
    const buyersearch = async () => {
      const response = await fetch(`${url}/getAllLedger`, {
        headers: { Authorization: Token },
      });
      const Buyer = await response.json();
      const buyerNames = Buyer.filter(
        (item) => item.partytype === "Vendor"
      ).map((item) => item.lednm);
      setBuyername(buyerNames);
      setBuyerdata(Buyer);
      setBuyerSearchCompleted(true);
    };
    buyersearch();
    fetchalldataproductandpart();
  }, []);

  const fetchImageUrls = async (productorpart, imageUrlType) => {
    let urls = {};
    for (const item of productorpart) {
      try {
        const imageUrlResponse = await fetch(
          `${url}/image/${imageUrlType}/${item}`
        );
        const imageUrlBlob = await imageUrlResponse.blob();
        const imageUrl = URL.createObjectURL(imageUrlBlob);
        urls[item] = imageUrl;
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    }
    setAdditemsimage((prevState) => ({ ...prevState, ...urls }));
  };

  const fetchalldataproductandpart = async () => {
    try {
      const [Part, Product] = await Promise.all([
        fetch(`${url}/getAllParts`, { headers: { Authorization: Token } }),
        fetch(`${url}/getAllProduct`, { headers: { Authorization: Token } }),
      ]);
      const part = await Part.json();
      const products = await Product.json();
      setAllproduct(products);
      setAllparts(part);
      setAllProductFetched(true);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (buyerSearchCompleted) {
      const queryParams = new URLSearchParams(location.search);
      const encodedData = queryParams.get("data");
      if (encodedData == null) {
      } else {
        const decodedData = decodeURIComponent(encodedData);
        const VendorPodata = JSON.parse(decodedData);
        Setdata(VendorPodata);

        const productcd = VendorPodata.vendorPoDetails.filter((item) => item.productPartcd.startsWith("PRD")).map((item) => item.productPartcd);
        const partcd = VendorPodata.vendorPoDetails.filter((item) => item.productPartcd.startsWith("PART")).map((item) => item.productPartcd);

        fetchImageUrls(productcd, "ProductImages");
        fetchImageUrls(partcd, "PartImages");
        setAddedItems(VendorPodata.vendorPoDetails);
        setBuyernameoption({ label: VendorPodata.vendorName, value: VendorPodata.vendorName })
      }
    }
  }, [location.search, buyerSearchCompleted, allProductFetched]);

  const [tempadd, setTempadd] = useState({ label: "Add", value: "Add" });

  const handlecalculateGrandtotal = (fieldname, value) => {
    if (fieldname == "addLess") {
      setTempadd(value);
      finalresult(value);
    }

    if (fieldname == "addlessAmount") {

      console.log("tempadd");
      console.log(tempadd);

      let netamount = data.netamount;
      let addlessAmount = fieldname === "addlessAmount" ? value : data.addlessAmount || 0;
      let grandAmount123 = tempadd === "Less" ? Number(netamount) - Number(addlessAmount) : Number(netamount) + Number(addlessAmount);
      let addLessValue = fieldname === "addlessAmount" ? "Add" : value;

      Setdata((prevData) => ({
        ...prevData,
        addlessAmount: addlessAmount,
        grandAmount: grandAmount123,
        addLess: addLessValue,
      }));
    }
  };

  const finalresult = (value) => {

    let netamount = data.netamount;
    let addlessAmount = data.addlessAmount;
    let grandAmount123 = value === "Less" ? Number(netamount) - Number(addlessAmount) : Number(netamount) + Number(addlessAmount);
    let addLessValue = data.addlessAmount === "addlessAmount" ? "Add" : value;

    Setdata((prevData) => ({
      ...prevData,
      addlessAmount: addlessAmount,
      grandAmount: grandAmount123,
      addLess: addLessValue,
    }));
  };


  const handleCartagevalue = (fieldname, value) => {
    let Cartageamt = fieldname === "cartageAmount" ? value : 0;
    let cartageDiff = Cartageamt - (data.cartageAmount || 0);
    let newGrandAmount = Number(data.grandAmount) + Number(cartageDiff);

    Setdata((prevData) => ({
      ...prevData,
      cartageAmount: Cartageamt,
      cartageTax: fieldname === "cartageTax" ? value : prevData.cartageTax,
      grandAmount: newGrandAmount,
    }));
  };

  const handleCartageTax = (fieldname, value) => {
    let cartageTax = fieldname === "cartageTax" ? value : 0;
    let cartageTaxDiff = cartageTax - (data.cartageTax || 0);
    let cartageAmount = data.cartageAmount || 0;
    let grandAmountChange = (cartageAmount * cartageTaxDiff) / 100;
    let newGrandAmount = Number(data.grandAmount) + Number(grandAmountChange);
    Setdata((prevData) => ({
      ...prevData,
      cartageTax: cartageTax,
      grandAmount: newGrandAmount,
    }));
  };

  // table data according to from filter
  const [temptabledata, setTemptabledata] = useState([]);
  const [temptableupdateddata, setTemptableupdateddata] = useState([]);

  const [dropdownfilter, setDropdownfilter] = useState([
    {
      partcode: "",
      partname: "",
      productcode: "",
      productCategory: "",
      productAlias: "",
      productdesc: "",
      buyerpo: "",
      ordercode: "",
      buyername: "",
    },
  ]);

  const dropdownHandlechange = (e) => {
    setDropdownfilter({ ...dropdownfilter, [e.target.name]: e.target.value });
  };

  const [allproduct, setAllproduct] = useState([]);
  const [allparts, setAllparts] = useState([]);

  const tableshowdata = (orderdetaildata, temptabledata) => {
    console.log("orderdetaildataaaa======" ,orderdetaildata)
    console.log("temptabledataaaaaa" ,temptabledata)
    
    return orderdetaildata.map((item) => {
      const matchingItem = temptabledata.find(
        (temptableItem) => temptableItem.ordcd === item.ordcd
      );
      // let img = null;
      // if (partcodevalue) {
      //   img = `${url}/image/PartImages/${item.productPartCd}`;
      // } else {
      //   img = `${url}/image/ProductImages/${item.productPartCd}`;
      // }
      let images = [];
      if (partcodevalue) {
        images.push(`${url}/image/PartImages/${item.productPartCd}`);
      }
      images.push(`${url}/image/ProductImages/${item.productPartCd}`);
    
      return {
        ...tabledata,
        rwid: item.rwid,
        productPartcd: item.productPartCd,
        image: `${url}/image/PartImages/${item.productPartCd}` || `${url}/image/ProductImages/${item.productPartCd}`, 
        image:images,         
        description: item.description,
        buyerpo: matchingItem ? matchingItem.buyerPo : "",
        dispatchdate: matchingItem
          ? matchingItem.dispatchdate
            ? formatDate(matchingItem.dispatchdate)
            : ""
          : "",
        ordercd: item.ordcd,
        subordcd: item.subordcd,
        orderQty: item.qty,
        size: item.size,
        pendingQty: item.qty - item.vendorissueQty,
        vendorissueQty: item.vendorissueQty,
        issueQty: "",
      };
    });
  };

///mastersearch start

  const masterSearch = async (e) => {
    e.preventDefault();

    if (
      (dropdownfilter.partcode === "" || typeof dropdownfilter.partcode === "undefined") &&
      (dropdownfilter.partname === "" || typeof dropdownfilter.partname === "undefined") &&
      (dropdownfilter.productcode === "" || typeof dropdownfilter.productcode === "undefined") &&
      (dropdownfilter.productCategory === "" || typeof dropdownfilter.productCategory === "undefined") &&
      (dropdownfilter.productAlias === "" || typeof dropdownfilter.productAlias === "undefined") &&
      (dropdownfilter.productdesc === "" || typeof dropdownfilter.productdesc === "undefined") &&
      (dropdownfilter.ordercode === "" || typeof dropdownfilter.ordercode === "undefined") &&
      (dropdownfilter.buyername === "" || typeof dropdownfilter.buyername === "undefined") &&
      (dropdownfilter.buyerpo === "" || typeof dropdownfilter.buyerpo === "undefined")
    ) {
      const orderdetaildata = temptabledata.reduce((acc, item) => [...acc, ...item.orderDetails], []);
      const updatedTabledata = tableshowdata(orderdetaildata, temptabledata);
     
      setTabledata(updatedTabledata);
      console.log("updatedTabledataghghghghghghgh===========" , updatedTabledata)
      setTemptableupdateddata(updatedTabledata);
      console.log(updatedTabledata);
      const productcd = orderdetaildata.filter((item) => item.productPartCd.startsWith("PRD")).map((item) => item.productPartCd);
      const partcd = orderdetaildata.filter((item) => item.productPartCd.startsWith("PART")).map((item) => item.productPartCd);
      //  for image
      const fetchAndSetImageUrls = async (urls, items, imageUrlBase) => {
        for (const item of items) {
          const imageUrlResponse = await fetch(`${imageUrlBase}/${item}`);
          const imageUrlBlob = await imageUrlResponse.blob();
          const imageUrl = URL.createObjectURL(imageUrlBlob);
          urls[item] = imageUrl;
        }
      };
      let urls = {};
      await Promise.all([
        fetchAndSetImageUrls(urls, productcd, `${url}/image/ProductImages`),
        fetchAndSetImageUrls(urls, partcd, `${url}/image/PartImages`),
      ]);
      setImageUrls((prevImageUrls) => ({ ...prevImageUrls, ...urls }));
      setAdditemsimage((prevState) => ({ ...prevState, ...urls }));
    } else {
      if (
        (dropdownfilter.ordercode === "" || typeof dropdownfilter.ordercode === "undefined") &&
        (dropdownfilter.buyername === "" || typeof dropdownfilter.buyername === "undefined") &&
        (dropdownfilter.buyerpo === "" || typeof dropdownfilter.buyerpo === "undefined")
      ) {
        const orderdetaildata = temptabledata.reduce((acc, item) => [...acc, ...item.orderDetails], []);
        const filteredData = orderdetaildata.filter((item) => {
          const partcodematch = dropdownfilter.partcode ? item.productPartCd.toLowerCase() === dropdownfilter.partcode.toLowerCase() : true;
          const partnamematch = dropdownfilter.partname ? item.description.toLowerCase() === dropdownfilter.partname.toLowerCase() : true;
          const productcodematch = dropdownfilter.productcode ? item.productPartCd.toLowerCase() === dropdownfilter.productcode.toLowerCase() : true;
          const productnamematch = dropdownfilter.productdesc ? item.description.toLowerCase() === dropdownfilter.productdesc.toLowerCase() : true;

          return ( partcodematch && partnamematch && productcodematch && productnamematch);
        });

        const updatedTabledata = tableshowdata(filteredData, temptabledata);
        setTabledata(updatedTabledata);
        setTemptableupdateddata(updatedTabledata);
     

        const productcd = orderdetaildata.filter((item) => item.productPartCd.startsWith("PRD")).map((item) => item.productPartCd);
        const partcd = orderdetaildata.filter((item) => item.productPartCd.startsWith("PART")).map((item) => item.productPartCd);
        //  for image
        const fetchAndSetImageUrls = async (urls, items, imageUrlBase) => {
          for (const item of items) {
            const imageUrlResponse = await fetch(`${imageUrlBase}/${item}`);
            const imageUrlBlob = await imageUrlResponse.blob();
            const imageUrl = URL.createObjectURL(imageUrlBlob);
            urls[item] = imageUrl;
          }
        };
        let urls = {};
        await Promise.all([
          fetchAndSetImageUrls(urls, productcd, `${url}/image/ProductImages`),
          fetchAndSetImageUrls(urls, partcd, `${url}/image/PartImages`),
        ]);
        setImageUrls((prevImageUrls) => ({ ...prevImageUrls, ...urls }));
        setAdditemsimage((prevState) => ({ ...prevState, ...urls }));
      } else {
        const filteredData = temptabledata.filter((item) => {
          const ordercodematch = dropdownfilter.ordercode? item.ordcd.toLowerCase().includes(dropdownfilter.ordercode.toLowerCase()): true;
          const clientnamematch = dropdownfilter.buyername? item.buyername.toLowerCase().includes(dropdownfilter.buyername.toLowerCase()): true;
          const buyerpomatch = dropdownfilter.buyerpo? item.buyerPo.toLowerCase().includes(dropdownfilter.buyerpo.toLowerCase()): true;

          return ordercodematch && clientnamematch && buyerpomatch;
        });

        const orderdetaildata = filteredData.reduce(
          (acc, item) => [...acc, ...item.orderDetails],
          []
        );
        const updatedTabledata = tableshowdata(orderdetaildata, temptabledata);
        setTabledata(updatedTabledata);
        setTemptableupdateddata(updatedTabledata);

        console.log("updatedTabledata=====", updatedTabledata);

        const productcd = orderdetaildata.filter((item) => item.productPartCd.startsWith("PRD")).map((item) => item.productPartCd);
        const partcd = orderdetaildata.filter((item) => item.productPartCd.startsWith("PART")).map((item) => item.productPartCd);
        //  for image
        const fetchAndSetImageUrls = async (urls, items, imageUrlBase) => {
          for (const item of items) {
            const imageUrlResponse = await fetch(`${imageUrlBase}/${item}`);
            const imageUrlBlob = await imageUrlResponse.blob();
            const imageUrl = URL.createObjectURL(imageUrlBlob);
            urls[item] = imageUrl;
          }
        };
        let urls = {};
        await Promise.all([
          fetchAndSetImageUrls(urls, productcd, `${url}/image/ProductImages`),
          fetchAndSetImageUrls(urls, partcd, `${url}/image/PartImages`),
        ]);
        setImageUrls((prevImageUrls) => ({ ...prevImageUrls, ...urls }));
        setAdditemsimage((prevState) => ({ ...prevState, ...urls }));
      }
    }
  };

  /////mastersearch end
  
  
  const [imageUrls, setImageUrls] = useState({});
  const [Additemsimage, setAdditemsimage] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${url}/getAllOrder`, {
        headers: { Authorization: Token },
      });
      const filterorder = await response.json();
      const Order = filterorder.filter(
        (item) => item.autherizestatus != "Pending"
      );
      const ordercode = [...new Set(Order.map((item) => item.ordcd))];
      const buyername = [...new Set(Order.map((item) => item.buyername))];
      const buyerpo = [...new Set(Order.map((item) => item.buyerPo))];
      setOrdercode(ordercode);
      setClientname(buyername);
      setBuyerpo(buyerpo);
      setTemptabledata(Order);

      const allproduct = await fetch(`${url}/getAllProduct`, {
        headers: { Authorization: Token },
      });
      const product = await allproduct.json();
      const prdcd = product.map((item) => item.prdcd);
      const categoryNames = [
        ...new Set(product.map((item) => item.categorynm)),
      ];
      const prdaliases = [...new Set(product.map((item) => item.prdalias))];
      const descriptions = [...new Set(product.map((item) => item.prdnm))];

      setProductcode(prdcd);
      setCategory(categoryNames);
      setPrdalias(prdaliases);
      setDiscription(descriptions);

      setAllproduct(product);
      const allpart = await fetch(`${url}/getAllParts`, {
        headers: { Authorization: Token },
      });
      const part = await allpart.json();
      const partcode = [...new Set(part.map((item) => item.partCode))];
      const partname = [...new Set(part.map((item) => item.partName))];
      setPartcode(partcode);
      setPartname(partname);
      setAllparts(part);
    } catch (error) {
      console.log("some error occured during search ");
    }
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const isItemAdded = (index) => {
    return addedItems.some((item) => item.rwid === index);
  };

  const handleAddToList = () => {
    if (selectedItems.length === 0) {
      alert("first select at least one item");
    } else {
      const itemsToAdd = selectedItems.filter((item) => !isItemAdded(item));
      const newAddedItems = itemsToAdd.map((item) => {
        const selectedRow = tabledata.find((row) => row.rwid === item);
        return selectedRow;
      });

      let missingData = false;
      let issueQty = 0;
      let price = 0;
      newAddedItems.forEach((item) => {
        if (item.issueQty === "") {
          issueQty++;
          missingData = true;
        } else if (item.price === "") {
          price++;
          missingData = true;
        }
      });

      if (issueQty > 0) {
        alert("Enter Issue Quantity");
      }

      if (price > 0) {
        alert("Enter Price");
      }

      if (!missingData) {
        const totalamt = newAddedItems.reduce(
          (total, item) => Number(total) + Number(item.totalAmount || 0),
          0
        );
        Setdata((prevData) => ({
          ...prevData,
          netamount: Number(prevData.netamount) + Number(totalamt),
          grandAmount: Number(prevData.grandAmount) + Number(totalamt),
        }));

        setAddedItems((prevAddedItems) => [
          ...prevAddedItems,
          ...newAddedItems,
        ]);
        setSelectedItems([]);
        setCheckedRows([]);
      }
    }
  };

  // vendor save
  const dataforsave = {
    from: data.from,
    vendorName: data.vendorName,
    deliverydate: data.deliverydate,
    remark: data.remark,
    netamount: data.netamount,
    addLess: data.addLess,
    addlessAmount: data.addlessAmount,
    cartageAmount: data.cartageAmount,
    cartageTax: data.cartageTax,
    grandAmount: data.grandAmount,
    createBy: "kuldeep",
    updateBy: "kuldeep",
    vendorPoDetails: addedItems,
  };

  const dataforupdate = {
    rwid: data.rwid,
    from: data.from,
    vendorName: data.vendorName,
    deliverydate: formatDate(data.deliverydate),
    remark: data.remark,
    netamount: data.netamount,
    addLess: data.addLess,
    addlessAmount: data.addlessAmount,
    cartageAmount: data.cartageAmount,
    cartageTax: data.cartageTax,
    grandAmount: data.grandAmount,
    createBy: "kuldeep",
    updateBy: "kuldeep",
    vendorPoDetails: addedItems,
  };

  const history = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (addedItems.length === 0) {
      alert("Please add  some item ");
    } else {
      if (data.rwid == null) {
        dataforsave.vendorPoDetails.map((item) => {
          delete item.rwid;
        });
        const jsondata = JSON.stringify(dataforsave);
        // console.log("jsondata");
        // console.log(jsondata);
        fetch(`${url}/VendorPo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
          body: jsondata,
        })
          .then((response) => response.json())
          .then((data) => {

            toast.success("Vendor PO Create Successfully", {
              autoClose: 1000, onClose: () => { history("/vendor"); },
            });
          })
          .catch((error) => {
            toast.error("vendor PO Create Failed", { autoClose: 1000, onClose: () => { history("/vendor") } })
          });
      } else {
        dataforupdate.vendorPoDetails.map((item) => {
          delete item.rwid;
        });

        const jsondata = JSON.stringify(dataforupdate);
        console.log("jsondata");
        console.log(jsondata);
        fetch(`${url}/VendorPo/${data.rwid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
          body: jsondata,
        })
          .then((response) => response.json())
          .then((data) => {

            toast.success("Vendor PO Update Successfully", {
              autoClose: 1000,
              onClose: () => { history("/vendor"); },
            });
          })
          .catch((error) => {
            toast.error("vendor PO Update Failed", { autoClose: 1000, onClose: () => { history("/vendor") } })
          });
      }
      Setdata({
        from: "Order",
        vendorName: "",
        deliverydate: "",
        remark: "",
        netamount: "",
        addLess: "Add",
        addlessAmount: "",
        cartageAmount: "",
        cartageTax: "",
        grandAmount: "",
        createBy: "",
        updateBy: "",
      });

      setAddedItems([]);
    }
  };

  return (
    <div className="page-content" style={{overflow:"hidden"}}>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={orderList}
      />
      <form onSubmit={handleSubmit}>
        <Container fluid>
          <BreadCrumb 
          // title="Vendor Create" pageTitle="Manage Vendor" 
           pageName="Vendor Create" vendorCreate="Vendor PO Detail" subTitle="Vendor Create"
          />

          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="border-0">
                  <Row>
                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Type">
                          Type
                        </Label>
                        <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                          <Select
                            value={type}
                            onChange={(e) => {
                              setType(e);
                              handlefilterchange1(e);
                              Setdata({ ...data, from: e.value });
                            }}
                            options={Types}
                            id="Type"
                            className="js-example-basic-single mb-0"
                            name="Type"
                          />
                        </div>
                      </div>
                    </div>
                    {orderFilters && (
                      <>
                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Part Code">
                              Part Code
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={partcodevalue}
                                onChange={(e) => {
                                  setPartcodevalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    partcode: e.value,
                                  });
                                }}
                                options={Allpartcode}
                                id="Part Code"
                                className="js-example-basic-single mb-0"
                                name="Part Code"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Part Name">
                              Part Name
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={partnamevalue}
                                onChange={(e) => {
                                  setPartnamevalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    partname: e.value,
                                  });
                                }}
                                options={Allpartname}
                                id="Part Name"
                                className="js-example-basic-single mb-0"
                                name="Part Name"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="  Product Code"
                            >
                              Product Code
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={prdcodevalue}
                                onChange={(e) => {
                                  setPrdcodevalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    productcode: e.value,
                                  });
                                }}
                                options={Allproductcode}
                                id="Product Code"
                                className="js-example-basic-single mb-0"
                                name="Product Code"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="productdesc">
                              Product Description
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={prddescriptionvalue}
                                onChange={(e) => {
                                  setPrddescriptionvalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    productdesc: e.value,
                                  });
                                }}
                                options={Allproductdescription}
                                id="productdesc"
                                className="js-example-basic-single mb-0"
                                name="productdesc"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor=" Buyer Po.">
                              Buyer Po.
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={buyerpovalue}
                                onChange={(e) => {
                                  setBuyerpovalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    buyerpo: e.value,
                                  });
                                }}
                                options={Allbuyerpo}
                                id="Buyer Po."
                                className="js-example-basic-single mb-0"
                                name="Buyer Po."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Order Code">
                              Order Code
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={ordercodevalue}
                                onChange={(e) => {
                                  setOrdercodevalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    ordercode: e.value,
                                  });
                                }}
                                options={Allordercode}
                                id="Order Code"
                                className="js-example-basic-single mb-0"
                                name="Order Code"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Buyer Name">
                              Buyer Name
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={clientnamevalue}
                                onChange={(e) => {
                                  setClientnamevalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    clientname: e.value,
                                  });
                                }}
                                options={Allclientname}
                                id="Buyer Name"
                                className="js-example-basic-single mb-0"
                                name="Buyer Name"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {stockFilters && (
                      <>
                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor=" Part Code">
                              Part Code
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={partcodevalue}
                                onChange={(e) => {
                                  setPartcodevalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    partcode: e.value,
                                  });
                                }}
                                options={Allpartcode}
                                id="Part Code"
                                className="js-example-basic-single mb-0"
                                name="Part Code"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor=" Part Name">
                              Part Name
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={partnamevalue}
                                onChange={(e) => {
                                  setPartnamevalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    partname: e.value,
                                  });
                                }}
                                options={Allpartname}
                                id=" Part Name"
                                className="js-example-basic-single mb-0"
                                name="from"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="  Product Code"
                            >
                              Product Code
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={prdcodevalue}
                                onChange={(e) => {
                                  setPrdcodevalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    productcode: e.value,
                                  });
                                }}
                                options={Allproductcode}
                                id="Product Code"
                                className="js-example-basic-single mb-0"
                                name="Product Code"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="productdesc">
                              Product Description
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={prddescriptionvalue}
                                onChange={(e) => {
                                  setPrddescriptionvalue(e);
                                  setDropdownfilter({
                                    ...dropdownfilter,
                                    productdesc: e.value,
                                  });
                                }}
                                options={Allproductdescription}
                                id="productdesc"
                                className="js-example-basic-single mb-0"
                                name="productdesc"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    

                    <div className="col-md-2 " style={{ marginTop: "1.8rem" }}>
                      <Button
                        className="btn btn-success "
                        onClick={masterSearch}
                      >
                        Search
                      </Button>
                    </div>
                  </Row>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    {tabledata ? (
                      <TableContainer
                        columns={columns}
                        data={tabledata || []}
                        customPageSize={10000}
                        divClass="table-responsive table-card mb-1"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light text-muted "
                        handleOrderClick={handleOrderClicks}
                        SearchPlaceholder="Search  something..."
                      />
                    ) : (
                      <TableContainer
                        columns={columns}
                        data={[]}
                        customPageSize={10000}
                        divClass="table-responsive table-card mb-1"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light text-muted text-uppercase"
                        handleOrderClick={handleOrderClicks}
                        SearchPlaceholder="Search  something..."
                      />
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      className="btn btn-success mb-4"
                      onClick={handleAddToList}
                      size="sm"
                    >
                      Add To List
                    </Button>
                  </div>

                  <div>
                    {addedItems ? (
                      <TableContainer
                        columns={Addcolumns}
                        data={addedItems || []}
                        customPageSize={10000}
                        divClass="table-responsive table-card mb-1"
                        tableClass="align-middle table-nowrap sticky"
                        theadClass="table-light text-muted"
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>

                  <Row>
                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Vendor-Name">
                          Vendor Name
                        </Label>
                        <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                          <Select
                            value={buyernameoption}
                            onChange={(e) => {
                              setBuyernameoption(e);
                              handlefilterchange(e, "buyername");
                              Setdata({ ...data, vendorName: e.value });
                            }}
                            options={buyernames}
                            id="Vendor-Name"
                            className="js-example-basic-single mb-0"
                            name="Vendor-Name"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Delivery Date">
                          Delivery Date
                        </Label>
                        <Input
                          type="date"
                          className="form-control"
                          id="Delivery Date "
                          onChange={(e) => {
                            Setdata({ ...data, deliverydate: e.target.value });
                          }}
                          name="deliverydate"
                          value={dateFormat(data.deliverydate)}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Net Amount">
                          Net Amount
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="Net Amount"
                          placeholder="Enter Net Amount "
                          name="netamount"
                          value={data.netamount}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Category">
                          Add/Less
                        </Label>
                        <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                          <Select
                            value={addlessvalue}
                            onChange={(e) => {
                              setAddlessvalue(e);
                              Setdata({ ...data, addLess: e.value });
                              handlecalculateGrandtotal("addLess", e.value);
                            }}
                            options={addless}
                            id="Category"
                            className="js-example-basic-single mb-0"
                            name="from"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor=" Add/Less">
                          Add/Less (Rs)
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Add/Less"
                          placeholder="Enter Add/Less Amount"
                          onChange={(e) =>
                            handlecalculateGrandtotal(
                              "addlessAmount",
                              e.target.value
                            )
                          }
                          name="addlessAmount"
                          value={data.addlessAmount}
                        />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Cartage Charges">
                          Cartage Charges
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Cartage Charges"
                          placeholder="Enter Add/Less Amount"
                          onChange={(e) =>
                            handleCartagevalue("cartageAmount", e.target.value)
                          }
                          name="cartageAmount"
                          value={data.cartageAmount}
                        />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Cartage Tax %">
                          Cartage Tax %
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Cartage Tax %"
                          placeholder="Enter Add/Less Amount"
                          onChange={(e) =>
                            handleCartageTax("cartageTax", e.target.value)
                          }
                          name="cartageTax"
                          value={data.cartageTax}
                        />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Total Amount">
                          Total Amount
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Total Amount "
                          name="grandAmount"
                          placeholder="Enter Total amount"
                          value={data.grandAmount}
                        />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Remark">
                          Remark
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Remark"
                          placeholder="Enter Remark"
                          value={data.remark}
                          onChange={(e) =>
                            Setdata({ ...data, remark: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </Row>

                  <div
                    style={{ display: "flex", justifyContent: "end" }}
                    className="mt-4"
                  >
                    <Button className="btn btn-success mb-4" size="sm">Save</Button>
                  </div>

                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </form>
    </div>
  );
};
export default Vendorcreate;
