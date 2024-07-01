import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainers";
//redux
import { useDispatch, useSelector } from "react-redux";
import url from "../Base_url/Base_url";

import {
  getOrders as onGetOrders
} from "../../slices/thunks";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createSelector } from "reselect";
import ExportCSVModal from "./../../Components/Common/ExportCSVModal";

function dateFormat(inputDate) {
  const date = new Date(inputDate);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because it's 0-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

const AddProforma = () => {

  const data = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${data.jwtToken}`;


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


  const [precarriagebyoption, setPrecarriagebyoption] = useState("");
  const Precarriage = [
    {
      options: [
        { label: "BY Rail", value: "BY Rail" },
        { label: "BY Road", value: "BY Road" },

      ],
    },
  ];


  const [shippingOption, setShippingOption] = useState("");
  const shippingtype = [
    {
      options: [
        { label: "BY Air", value: "BY Air" },
        { label: "BY Courier", value: "BY Courier" },
        { label: "BY Sea", value: "BY Sea" },

      ],
    },
  ];

  const [shipmenttypeoption, setShipmenttypeoption] = useState("");
  const shipmenttype = [
    {
      options: [
        { label: "CAD", value: "CAD" },
        { label: "CIF", value: "CIF" },
        { label: "DDP", value: "DDP" },
        { label: "DDU", value: "DDU" },
        { label: "FOB", value: "FOB" },

      ],
    },
  ];
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
// function handleCellEdit(value, rowIndex, accessor) {
//   // Get the previous items from state
//   setAddedItems(prevItems =>
//     prevItems.map((item, index) => {
//       // If the edited row is found, update its value for the accessor
//       if (index === rowIndex) {
//         // Create a new object with updated value
//         return { ...item, [accessor]: value };
//       }
//       // Otherwise, return the original item
//       return item;
//     })
//   );
// }


const [table, setTable] = useState([]);
console.log("tableeeeeee", table);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItemsshow, setAddedItemsShow] = useState([]);
  const [addedItems, setAddedItems] = useState([]);

console.log("addedItems=====" , addedItems);

  const [tableData, setTableData] = useState([ ]);
// console.log("tableDat......a");
// console.log(tableData);
  const handleCheckboxChange = (index, checked) => {
    let updatedSelectedItems = [...selectedItems];

    if (checked) {
      const isAlreadyAdded = addedItems.some(item => item.rwid === index);
      if (isAlreadyAdded) {
        alert("This item has already been added.");
        return;
      }
      if (!updatedSelectedItems.includes(index)) {
        updatedSelectedItems.push(index);
      }
    } else {
      updatedSelectedItems = updatedSelectedItems.filter(item => item !== index);
    }

    setCheckedRows(prevCheckedRows => {
      if (checked) {
        return [...prevCheckedRows, index];
      } else {
        return prevCheckedRows.filter(row => row !== index);
      }
    });

    setSelectedItems(updatedSelectedItems);
  };

  const handleSelectAll = event => {
    const isChecked = event.target.checked;
    const newCheckedRows = isChecked ? tableData.map(row => row.rwid) : [];
    setCheckedRows(newCheckedRows);
    setSelectedItems(isChecked ? tableData.map(row => row.rwid) : []);
  };

  // const handledelete = (index) => {
  //   // Create a copy of addedItems
  //   const newArray = [...addedItems];
  
  //   // Remove the item at the specified index
  //   newArray.splice(index, 1);
  // console.log("addedItems")
  // console.log(addedItems)
  //   // Calculate total amount after deletion
  //   // const totalamt = newArray.reduce((total, item) => Number(total) + Number(item.totalamount), 0);
  
  //   // console.log("Total Amount after deletion:", totalamt);
  
  //   // // Update inputs state with the new total amount and grand total
  //   // setinputs((prevData) => ({
  //   //   ...prevData,
  //   //   totalamount: Number(totalamt),
  //   //   grandtotal: Number(totalamt), // Assuming grandtotal is also based on totalamt
  //   // }));
  
  //   // Update addedItems state with the updated newArray
  //   // setAddedItems(newArray);
  // };
  const handledelete = (rowIndex) => {
    setAddedItems((prevItems) => prevItems.filter((_, index) => index !== rowIndex));
  };

  const [inputs, setinputs] = useState([
    {
      clientCode: "",
      clientName: "",
      alias: "",
      buyerOderDate: "",
      delivaryDate: "",
      buyerpo: "",
      remark: "",
      totalamount: "",
      discount: "",
      addamount: "",
      grandtotal: "",
      advance: "",
    },
  ]);
console.log("inputs========", inputs);
  // Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            className="form-check-input"
            // checked={checkedRows.length === tableData.length}
            checked={checkedRows.length === tableData.length && tableData.length > 0}
            onChange={handleSelectAll}
            style={{ cursor: "pointer" }}
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
              style={{cursor:"pointer" }}
            />
          );
        },
        id: "#",
      },
      {
        Header: "Image",
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
        Header: "Product Alias",
        accessor: "prdalias",
        filterable: false,
      },
      {
        Header: "Product Name",
        accessor: "prdname",
        filterable: false,
      },

      {
        Header: "Size",
        accessor: (item) =>
          `${item.prdlen}x${item.prdwid}x${item.prdheight} ${item.prdunit}`,
        filterable: false,
      },
     
      {
        Header: "Net wgt",
        accessor: "prdnetWgt",
        filterable: false,
      },
      {
        Header: "Grs wgt",
        accessor: "prdGrsWgt",
        filterable: false,
      },
      
      {
        Header: "Qty",
        accessor: "prdqty",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.prdqty}
              onChange={(e) => handleqtyChange(row.original.rwid, e.target.value)}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Price",
        accessor: "price",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.price}
              onChange={(e) => handlePricePrChange(row.original.rwid, e.target.value)}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Amount",
        accessor: "amnt",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.amnt}
              disabled
            />
          );
        },
      },
      {
        Header: "Discount (%)",
        accessor: "discntPercent",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.discntPercent}
              onChange={(e) =>
                handleDiscntPercentChange(e, row.original.rwid, "discntPercent", e.target.value)
              }
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Discount (RS)",
        accessor: "discount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.discount}
              onChange={(e) => handleDiscountChange(row.original.rwid, e.target.value)}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },

      {
        Header: "Net Amount",
        accessor: "netamount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.netamount}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "GST",
        accessor: "gst",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.gst}
              onChange={(e) => handlegst(row.original.rwid, e.target.value)}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "T.Amt",
        accessor: "totalamount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.totalamount}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "CBM/PC",
        accessor: "cbmpc",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.cbmperpcs}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "T.CBM",
        accessor: "totalcbm",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.totalcbm}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      }
    ],
    [ checkedRows, addedItems, tableData]
  );

  const [isValueTrue, setIsValueTrue] = useState(false);
  const Addcolumns = useMemo(
    
    () => [

      {
        Header: "Image",
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
        Header: "Product Alias",
        accessor: "prdalias",
        filterable: false,
      },
      {
        Header: "Product Name",
        accessor: "prdname",
        filterable: false,
      },
      {
        Header: "Size",
        accessor: (item) =>
          `${item.prdlen}x${item.prdwid}x${item.prdheight} ${item.prdunit}`,
        filterable: false,
      },
      {
        Header: "Net wgt",
        accessor: "prdnetWgt",
        filterable: false,
        
      },
      {
        Header: "Grs wgt",
        accessor: "prdGrsWgt",
        filterable: false,
      },
      {
        Header: "Qty",
        accessor: "prdqty",
        filterable: false,
         Cell: ({ row }) => {    
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.prdqty}
              onChange={(e) => handleqtyChangee(row.original.rwid, e.target.value)}
            />
          );
        },
       
      },
      {
        Header: "Price",
        accessor: "price", // Adjust the accessor based on your data structure
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.price} // Access the nested price property
              onChange={(e) => handlePricePrChangee(row.original.rwid, e.target.value)}
              // enable={!checkedRows.includes(row.original.rwid)}
              
            />
          );
        },
      },
      {
        Header: "Amount",
        accessor: "amnt",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.amnt}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Discount (%)",
        accessor: "discntPercent",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.discntPercent}
              onChange={(e) =>
                handleDiscntPercentChangee(e, row.original.rwid, "discntPercent", e.target.value)
              }
           
            />
          );
        },
      },
       {
        Header: "Discount (RS)",
        accessor: "discount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.discount}
              onChange={(e) => handleDiscountChangee(row.original.rwid, e.target.value)}
            />
          );
        },
      },
      {
        Header: "Net Amount",
        accessor: "netamount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.netamount}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "GST",
        accessor: "gst",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.gst}
              onChange={(e) => handlegstt(row.original.rwid, e.target.value)}
              // enable={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "T.Amt",
        accessor: "totalamount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.totalamount}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "CBM/PC",
        accessor: "cbmperpcs",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.cbmperpcs}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },

      },
      {
        Header: "T.CBM",
        accessor: "totalcbm", // Make sure this matches your data structure
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.totalcbm}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      
      {
        Header: "Action",
        accessor: "actionId",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
      
              <li className="list-inline-item edit" title="Call">
                <i
                  class="ri-delete-bin-5-fill fs-16" style={{ color: 'red', cursor:"pointer" }}
                  onClick={() => handledelete(row.index)}
                ></i>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Proforma Invoice";

  const [prdcodevalue, setPrdcodevalue] = useState(null);
  const [prdcatvalue, setPrdcatvalue] = useState(null);
  const [prdaliasvalue, setPrdaliasvalue] = useState(null);
  const [prddescriptionvalue, setPrddescriptionvalue] = useState(null);
  const [prdpinovalue, setPrdpinovalue] = useState(null);

  const [category, setCategory] = useState([]);
  const [prdalias, setPrdalias] = useState([]);
  const [description, setDiscription] = useState([]);
  const [pino, setPino] = useState([]);
  const [prdcd, setPrdcd] = useState([]);

  const [temptable, setTemptable] = useState([]);
  const [buyername, setBuyername] = useState([]);
  const [buyerdata, setBuyerdata] = useState([]);
console.log("buyername");
console.log(buyername);
  const [buyernameoption, setBuyernameoption] = useState(null);
  const [addressnameoption, setAddressnameoption] = useState(null);

  const [addressName, setAddressName] = useState([]);
  const [alldetailsofbuyer, setAlldetailsofbuyer] = useState([]);
  const [buyerAliasonchange, setBuyerAliasonchange] = useState('')
  const [modalProject, setModalProject] = useState(false);
//  console.log("temptable");
//  console.log(temptable);
  const addless = [
    {
      options: [
        { label: "Add", value: "Add" },
        { label: "Less", value: "Less" },
      ],
    },
  ];


  const buyernames = [
    {
      options: [
        { label: "Select", value: "" },
        ...buyername.map((item) => {
          return { label: item.lednm, value: item.ledcd };
        }),
      ],
    },
  ];

  const alladdressname = [
    {
      options: [
        { label: "Select", value: "" },
        ...addressName.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const Allproductcode = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...prdcd.map((item) => {
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

  const Allpinos = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...pino.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  useEffect(() => {
    const buyersearch = async () => {
      const response = await fetch(`${url}/getAllLedger`, {
        headers: { Authorization: Token },
      });
      const Buyer = await response.json();
      console.log("Buyer", Buyer);
      const buyerNames = Buyer.filter((item) => item.partytype === "Buyer").map(item => ({ ledcd: item.ledcd, lednm: item.lednm }));
      setBuyername(buyerNames);
      setBuyerdata(Buyer);
    };
    buyersearch();
  }, []);

  const isItemAdded = (index) => {
    return addedItems.some((item) => item.rwid === index);
  };


  const handleAddToList = () => {
    if (selectedItems.length === 0) {
      alert("Select some Items");
    } else {
      const itemsToAdd = selectedItems.filter((item) => !isItemAdded(item));
      const newAddedItems = itemsToAdd.map((item) => {
        const selectedRow = table.find((row) => row.rwid === item);
        return selectedRow;
      });

      // console.log("newAddedItems");
      // console.log(newAddedItems);

      let missingData = false;
      let prdqty = 0;
      let price = 0;
      newAddedItems.forEach((item) => {
        if (item.prdqty === "") {
          prdqty++;
          missingData = true;
        } else if (item.price === "") {
          price++;
          missingData = true;
        }
      });
      if (prdqty > 0) {
        alert("Enter Quantity");
      }

      if (price > 0) {
        alert("Enter Price");
      }

      
      if (!missingData) {
        const totalamt = newAddedItems.reduce((total, item) => Number(total) + Number(item.totalamount).toFixed(2), 0);
        setinputs((prevData) => ({
          ...prevData,
          totalamount: Number(prevData.totalamount || 0) + Number(totalamt),
          grandtotal: Number(prevData.totalamount) + Number(totalamt + prevData.addamount) - Number(prevData.discount),
        }));

        setAddedItems((prevAddedItems) => [
          ...prevAddedItems,
          ...newAddedItems,
        ]);
        setCheckedRows([]);
        setSelectedItems([]);
      }
    }
  };



  // add less handle

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    const add = addlessInputs.filter((item) => item.addless === "Add");
    const less = addlessInputs.filter((item) => item.addless === "Less");

    // const sumforaddmount = add.reduce((total, item) =>total + (item.discountAmt === 0 ? item.percentAmt : item.discountAmt),0);
    // const sumfordiscount = less.reduce((total, item) =>total + (item.discountAmt === 0 ? item.percentAmt : item.discountAmt),0);
    // const grandtotalamt = sumforaddmount - sumfordiscount || 0;

    const sumforaddmount = add.reduce((total, item) => total + (item.discountAmt === 0 ? item.percentAmt : item.discountAmt), 0);
    const sumfordiscount = less.reduce((total, item) => total + (item.discountAmt === 0 ? item.percentAmt : item.discountAmt), 0);
    const grandtotalamt = (sumforaddmount - sumfordiscount);

    const sumforaddmountRounded = Number(sumforaddmount).toFixed(2);
    const sumfordiscountRounded = Number(sumfordiscount).toFixed(2);





    // if(inputs.totalamount>grandtotalamt){

    //   setinputs((prevData) => ({
    //     ...prevData,
    //     discount: 0,
    //     addamount: 0,
    //     grandtotal: 0, 
    //   }));
    //   setAddlessinputs([
    //     {
    //       addless: "",
    //       discountname: "",
    //       discountAmt: 0,
    //       discountpercent: 0,
    //       addlesson: "",
    //       percentAmt: 0,
    //       disablefieldPercent: false,
    //       disablefieldamount: false,
    //     },
    //   ]) 
    //   toast.error("Discount Amount Can Not Be Greater Than Total Amount" ,{ autoClose:2000,position:'top-center'})
    //   setModalProject(false);

    //   return
    // }

    setinputs((prevData) => {
      const roundedGrandTotal = (prevData.totalamount + grandtotalamt).toFixed(2);
      return {
        ...prevData,
        discount: sumfordiscountRounded,
        addamount: sumforaddmountRounded,
        grandtotal: roundedGrandTotal,
      };
    });

    setModalProject(false);
  };

///////////////////////////columns

  function handleBuyerCodeChange(rowId, value) {
    setTable((prevData) =>
      prevData.map((row) =>
        row.rwid === rowId ? { ...row, buyercode: value } : row
      )
    );
  }

  function handleqtyChange(rowId, value) {

    if (value === "") {
      setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, prdqty: "", netamount: "", totalamount: '', totalcbm: '' } : row));
    } else {
      setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, prdqty: value } : row));
      setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, netamount: row.prdqty * row.price } : row));

      setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, totalamount: row.gst ? row.netamount + (row.netamount * (parseFloat(row.gst) / 100)) : row.netamount } : row));
      setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, totalcbm: (row.cbmperpcs * value).toFixed(2) } : row));
    }

  }

  function handlePricePrChange(rowId, value) {
    if (value === "") {
      setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, price: "", amnt:"", netamount: "", totalamount: '' } : row));
    } else {
      const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(value);
      if (isValidDecimal) {
        setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, price: value, amnt: row.prdqty * value, } : row));
        setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, price: value, netamount: row.prdqty * value, } : row));
        setTable((prevData) =>
          prevData.map((row) => row.rwid === rowId ? {
            ...row, totalamount:
              row.gst ? row.netamount + (row.netamount * (parseFloat(row.gst) / 100)) : row.netamount
          } : row)
        );
      }
    }
  }


  function calculateTotalAmount(netAmount, gst) {
    if (gst) {
      const netAmountWithGST = netAmount + (netAmount * parseFloat(gst)) / 100;
      return parseFloat(netAmountWithGST.toFixed(2));
    } else {
      return parseFloat(netAmount.toFixed(2));
    }
  }
 
  function handleDiscntPercentChange(event, rowId) {
    const discntPercent = event.target.value; // Get the value from the input field
  
    setTable((prevData) =>
      prevData.map((row) => {
        if (row.rwid === rowId) {
          const newRow = { ...row };
  
          // Parse discntPercent to ensure it's a valid number
          const percent = parseFloat(discntPercent);
          if (!isNaN(percent)) {
            // Calculate discount based on the percentage
            const discount = (percent / 100) * (newRow.prdqty * newRow.price);
            newRow.discount = discount.toFixed(2); // Set discount amount
            newRow.discntPercent = discntPercent; // Update discntPercent
            newRow.netamount = (newRow.prdqty * newRow.price) - discount; // Recalculate net amount
            newRow.totalamount = calculateTotalAmount(newRow.netamount, newRow.gst); // Recalculate total amount
          } else {
            // If discntPercent is not a valid number, clear discount and recalculate
            newRow.discount = "";
            newRow.discntPercent = "";
            newRow.netamount = newRow.prdqty * newRow.price;
            newRow.totalamount = calculateTotalAmount(newRow.netamount, newRow.gst);
          }
  
          return newRow;
        } else {
          return row;
        }
      })
    );
  }

  function handleDiscountChange(rowId, value) {
    if (value === "") {
      // If the value is empty, clear the discount and recalculate the net amount.
      setTable((prevData) =>
        prevData.map((row) =>
          row.rwid === rowId
            ? {
                ...row,
                discount: "",
                netamount: row.prdqty * row.price,
                totalamount: calculateTotalAmount(row.prdqty * row.price, row.gst),
              }
            : row
        )
      );
    } else {
      const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(value);
  
      if (isValidDecimal) {
        // Update the discount and recalculate the net amount.
        setTable((prevData) =>
          prevData.map((row) =>
            row.rwid === rowId
              ? {
                  ...row,
                  discount: value,
                  netamount: row.prdqty * row.price - parseFloat(value),
                  totalamount: calculateTotalAmount(row.prdqty * row.price - parseFloat(value), row.gst),
                }
              : row
          )
        );
      }
    }
  }
  
  function handlegst(rowId, value) {
    if (value === "") {
      // If the value is empty, clear the cgst and totalamount fields.
      setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, gst: "", totalamount: row.netamount } : row));
    } else {
      const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(value);

      if (isValidDecimal) {
        setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, gst: value } : row));

        setTable((prevData) => prevData.map((row) => row.rwid === rowId ? { ...row, totalamount: row.netamount + row.netamount * (parseFloat(value) / 100), } : row)
        );
      }
    }
  }

////////////////addcolumns

function handlePricePrChangee(rowId, value) {
  if (value === "") {
    setAddedItems(prevItems =>
      prevItems.map(item =>
        item.rwid === rowId
          ? {
              ...item,
              price: "",
              amnt: "",
              netamount: "",
              totalamount: ""
            }
          : item
      )
    );
  } else {
    const isValidNumber = /^\d*\.?\d*$/.test(value);
    if (isValidNumber) {
      setAddedItems(prevItems =>
        prevItems.map(item =>
          item.rwid === rowId
            ? {
                ...item,
                price: value,
                amnt: (parseFloat(value) * parseFloat(item.prdqty)).toFixed(0),
                netamount: parseFloat(value) * parseFloat(item.prdqty),
                totalamount:
                  parseFloat(value) * parseFloat(item.prdqty) +
                  (parseFloat(item.gst) ? (parseFloat(value) * parseFloat(item.prdqty) * parseFloat(item.gst)) / 100 : 0),
                totalcbm: (parseFloat(item.cbmperpcs) * parseFloat(item.prdqty)).toFixed(2)
              }
            : item
        )
      );
    }
  }
}

function handleqtyChangee(rowId, value) {
  if (value === "") {
    setAddedItems(prevItems =>
      prevItems.map(item =>
        item.rwid === rowId
          ? {
              ...item,
              prdqty: "",
              netamount: "",
              totalamount: "",
              totalcbm: "",
              amnt: ""
            }
          : item
      )
    );
  } else {
    setAddedItems(prevItems =>
      prevItems.map(item =>
        item.rwid === rowId
          ? {
              ...item,
              prdqty: value,
              netamount: parseFloat(value) * parseFloat(item.price),
              totalamount:
                parseFloat(value) * parseFloat(item.price) +
                (parseFloat(item.gst) ? parseFloat(value) * parseFloat(item.price) * parseFloat(item.gst) / 100 : 0),
              totalcbm: (parseFloat(item.cbmperpcs) * parseFloat(value)).toFixed(2),
              amnt: (parseFloat(value) * parseFloat(item.price)).toFixed(0)
            }
          : item
      )
    );
  }
}

  function calculateTotalAmount(netAmount, gst ) {
    if (gst) {
      const netAmountWithGST = netAmount + (netAmount * parseFloat(gst)) / 100;
      return parseFloat(netAmountWithGST.toFixed(2));
    } else {
      return parseFloat(netAmount.toFixed(2));
    }
  }
  function handleDiscountChangee(rowId, value) {
    if (value === "") {
      // If the value is empty, clear the discount and recalculate the net amount.
      setAddedItems(prevItems =>
        prevItems.map(item =>
          item.rwid === rowId ? 
            {
              ...item,
              discount: "",
              netamount: parseFloat(item.prdqty) * parseFloat(item.price),
              totalamount: calculateTotalAmount(parseFloat(item.prdqty) * parseFloat(item.price), item.gst)
            } 
            : 
            item
        )
      );
    } else {
      const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(value);
  
      if (isValidDecimal) {
        // Update the discount and recalculate the net amount.
        setAddedItems(prevItems =>
          prevItems.map(item =>
            item.rwid === rowId ? 
              {
                ...item,
                discount: value,
                netamount: parseFloat(item.prdqty) * parseFloat(item.price) - parseFloat(value),
                totalamount: calculateTotalAmount(parseFloat(item.prdqty) * parseFloat(item.price) - parseFloat(value), item.gst)
              } 
              : 
              item
          )
        );
      }
    }
  }
  function handleDiscntPercentChangee(event, rowId, field, value) {
    setAddedItems(prevItems =>
      prevItems.map(item => {
        if (item.rwid === rowId) {
          const discntPercent = parseFloat(value) || 0;
          const itemAmount = parseFloat(item.prdqty) * parseFloat(item.price);
          const discount = (discntPercent / 100) * itemAmount;
          const netAmount = itemAmount - discount;
          const totalAmount = calculateTotalAmount(netAmount, item.gst);
  
          return {
            ...item,
            discntPercent: value,
            discount: discount.toFixed(2),
            netamount: netAmount.toFixed(2),
            totalamount: totalAmount.toFixed(2),
          };
        }
        return item;
      })
    );
  }
  
  function calculateTotalAmount(netAmount, gst) {
    return netAmount + (gst ? (netAmount * parseFloat(gst) / 100) : 0);
  }
  
  function handlegstt(rowId, value) {
    if (value === "") {
      // If the value is empty, clear the gst and update related fields.
      setAddedItems(prevItems =>
        prevItems.map(item =>
          item.rwid === rowId ? 
            {
              ...item,
              gst: "",
              totalamount: calculateTotalAmount(parseFloat(item.prdqty) * parseFloat(item.price), "")
            } 
            : 
            item
        )
      );
    } else {
      const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(value);
  
      if (isValidDecimal) {
        // Update the gst and recalculate related fields.
        setAddedItems(prevItems =>
          prevItems.map(item =>
            item.rwid === rowId ? 
              {
                ...item,
                gst: value,
                totalamount: calculateTotalAmount(parseFloat(item.prdqty) * parseFloat(item.price), value)
              } 
              : 
              item
          )
        );
      }
    }
  }
  
  

  // get Data for download

  const location = useLocation();

  // useEffect(() => {
  //   fetchData1("Re-PI");
  // }, []);

  useEffect(() => {
    fetchData("Product");
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get("data");
    if (encodedData == null) {
    } else {

      const parsedData = JSON.parse(encodedData);
      const prdcdArray = parsedData.performaInvoiceDetails.map((data) => data.prdcd);
      const buyercode = parsedData.performaInvoiceDetails.map((data) => data.buyercode);
      const qty = parsedData.performaInvoiceDetails.map((data) => data.prdqty);
      const price = parsedData.performaInvoiceDetails.map((data) => data.price);
      const gst = parsedData.performaInvoiceDetails.map((data)=> data.gst)
      const netamount = parsedData.performaInvoiceDetails.map((data) => data.netamount);
      const discount = parsedData.performaInvoiceDetails.map((data) => data.discount);
      const discntPercent = parsedData.performaInvoiceDetails.map((data) => data.discntPercent);
      const grsWgt = parsedData.performaInvoiceDetails.map((data) => data.grsWgt);
      const cgst = parsedData.performaInvoiceDetails.map((data) => data.cgst);
      const sgst = parsedData.performaInvoiceDetails.map((data) => data.sgst);
      const igst = parsedData.performaInvoiceDetails.map((data) => data.igst);
      const amnt = parsedData.performaInvoiceDetails.map((data) => data.amnt);
      const totalcbm = parsedData.performaInvoiceDetails.map((data)=> data.totalcbm);
      const totalamount = parsedData.performaInvoiceDetails.map((data) => data.totalamount);
      const filteredData = temptable.filter((item) => prdcdArray.includes(item.prdcd));
      // console.log("filteredData")
      // console.log(filteredData)
      setFromvalue({ label: '', value: '' })

      const updatedData = filteredData.map((item, i) => {
        return {
          ...item,
          buyercode: buyercode[i],
          prdqty: qty[i],
          price: price[i],
          gst: gst[i],
          netamount: netamount[i],
          amnt : amnt[i],
          totalcbm : totalcbm[i],
          grsWgt: grsWgt[i],
          discount: discount[i],
          discntPercent : discntPercent[i],
          cgst: cgst[i],
          sgst: sgst[i],
          igst: igst[i],
          totalamount: totalamount[i],
          
        };
      });
      setinputs(parsedData);
console.log("parsedData");
console.log(parsedData);
      setAddedItems(updatedData);

      // console.log("updatedDatabgbghgh" ,updatedData)

      setAddlessinputs(parsedData.performaInvoiceDiscount)
      setAddressdetails(parsedData)
      setBuyerAliasonchange(parsedData.alias)
      setBuyernameoption({ label: parsedData.clientName, value: parsedData.clientName })
      setAddressnameoption({ label: parsedData.buyerdeliverto, value: parsedData.buyerdeliverto })
   
      setShippingOption({ label: parsedData.shipping, value: parsedData.shipping })
      setPrecarriagebyoption({ label: parsedData.precarriageby, value: parsedData.precarriageby })
      setShipmenttypeoption({ label: parsedData.shipmentype, value: parsedData.shipmentype })

      // console.log("parsedData")
      // console.log(parsedData)

    }
  }, [location.search, temptable]);


  const fetchData = async (checkfrom) => {
    try {
       if (checkfrom == "Product" ) {
      const Product = await fetch(`${url}/getAllProduct`, { headers: { Authorization: Token }, });
      const Allproduct = await Product.json();
      const product = Allproduct.filter((item) => item.dis != "YES");

      const categoryNames = [...new Set(product.map((item) => item.categorynm)),];
      const prdaliases = [...new Set(product.map((item) => item.prdalias))];
      const descriptions = [...new Set(product.map((item) => item.prdnm))];
      const productcode = [...new Set(product.map((item) => item.prdcd))];
     


      const savepidata = product.map((item) => {
        return {
          rwid: item.rwid,
          image: `${url}/image/ProductImage/${item.rwid}`,
          prdalias: item.prdalias,
          categorynm: item.categorynm,
          picd:item.picd,
          prdcd: item.prdcd,
          prdname: item.prdnm,
          size:`${item.prdlen}x${item.prdwid}x${item.prdheight}`,
          prdlen: item.prdlen,
          prdwid: item.prdwid,
          prdheight: item.prdnetWgt,
          prdunit: item.prdunit,
          buyercode: "",
          prdqty: "",
          // currency: "RS",
          price: "",
          netamount: "",
          prdnetWgt:item.prdnetWgt,
          amnt: item.amnt,
          gst: item.gst,
          prdGrsWgt: item.prdGrsWgt,
          discount: item.discount,
          discntPercent: item.discntPercent,
          cgst: "",
          sgst: "",
          igst: "",
          totalamount: "",
          totalcbm: item.totalcbm,
          cbmperpcs: item.productBox.filter(item => item.crtnType === "Master").reduce((sum, item) => sum + item.pcsprcbm, 0),
       
        };
      });

      setTemptable(savepidata);
      setCategory(categoryNames);
      setPrdalias(prdaliases);
      setDiscription(descriptions);
      setPrdcd(productcode);

  } else if (checkfrom == "Re-PI")
     {
          const Pino = await fetch(`${url}/api/GetAllperformainvoice`, {headers: { Authorization: Token },});
          const AllpiNo = await Pino.json();
          // console.log("AllpiNo");
          // console.log(AllpiNo);
          const pino = AllpiNo.filter((item) => item.dis != "YES");
          const pinos = [...new Set(pino.map((item) => item.picd)),];         
         
          const savepidata = pino.flatMap(item => item.performaInvoiceDetails.map(detail => ({
            rwid: detail.rwid,
            picd: detail.picd,
            image: `${url}/image/ProductImages/${detail.prdcd}`,
            prdalias: detail.prdalias,
            categorynm: detail.categorynm,
            prdcd: detail.prdcd,
            prdname: detail.prdname,
            size: `${detail.prdlen}x${detail.prdwid}x${detail.prdheight}`,
            prdlen: detail.prdlen,
            prdwid: detail.prdwid,
            prdheight: detail.prdheight,
            prdunit: detail.prdunit,
            buyercode: detail.buyercode,
            prdqty: detail.prdqty,
            price: detail.price,
            netamount: detail.netamount,
            prdnetWgt: detail.prdnetWgt,
            amnt: detail.amnt,
            gst: detail.gst,
            prdGrsWgt: detail.prdGrsWgt,
            discount: detail.discount,
            discntPercent : detail.discntPercent,
            cgst: detail.cgst,
            sgst: detail.sgst,
            igst: detail.igst,
            totalamount: detail.totalamount,
            totalcbm: detail.totalcbm,
            cbmperpcs: detail.cbmperpcs,
            // totalcbm: detail.totalcbm,
          
        })));
// console.log("savepidata------------",savepidata)
        setPino(pinos);
        setTemptable(savepidata);
    }
  }catch (error) {
      console.log("Error:", error);
    }
  };

  // dropdown filter search  here prefix d indicate dropdowns
  const [dvalue, setDvalue] = useState([
    {
      dcategory: "",
      dprdalias: "",
      dDescription: "",
      dprdcd: "",
      dpino:"",
    },
  ]);

  const masterSearch = (e) => {
    e.preventDefault();

    if (
      (dvalue.dcategory === "" || typeof dvalue.dcategory === "undefined") &&
      (dvalue.dprdalias === "" || typeof dvalue.dprdalias === "undefined") &&
      (dvalue.dDescription === "" || typeof dvalue.dDescription === "undefined") &&
      (dvalue.dprdcd === "" || typeof dvalue.dprdcd === "undefined")&&
      (dvalue.dpino === "" || typeof dvalue.dpino === "undefined")
    ) {
      console.log("first");
      setTable(temptable);
      setTableData(temptable);
    
    } else {
      console.log("Second");
      const filteredData = temptable.filter((item) => {
      
        const categoryMatch = dvalue.dcategory ? (item?.categorynm && item.categorynm.includes(dvalue.dcategory.trim())) : true;
        const aliasMatch = dvalue.dprdalias ? item?.prdalias.toLowerCase().includes(dvalue.dprdalias.toLowerCase()) : true;
        const descriptionMatch = dvalue.dDescription ? item?.prdname.toLowerCase().includes(dvalue.dDescription.toLowerCase()) : true;
        const codeMatch = dvalue.dprdcd ? item?.prdcd.toLowerCase() === dvalue.dprdcd.toLowerCase() : true;
        const pinoMatch = dvalue.dpino ? (item?.picd && item?.picd.indexOf(dvalue.dpino.trim()) !== -1) : true;

    return categoryMatch && aliasMatch && descriptionMatch && codeMatch && pinoMatch;
      });

      setTable(filteredData);
      setTableData(filteredData)
    }
  };



  // save data into the database
  const [data1, Setdata1] = useState({
    addressname: "",
    from: "Product",
    buyername: "",
    buyerPo: "",
    buyerpodate: "",
    dispatchdate: "",
    paymenterm: "",
    totalamount: "",
    discount: "", 
    grandtotal: "",
    advanceamt: "",
    totalqty: "",
    orderComment: "",
    addamt: "",
  });


  const [addressdetail, setAddressdetails] = useState([
    {

      buyerdeliverto: "",
      precarriageby: "",
      shipping: "",
      vesselno: "",
      payterm: "",
      shipmentype: "",
      bankname: "",
      branchname: "",
      ifsccode: "",
      accountnumber: "",
      acaddress: "",
      swiftcode: "",


      consigneename: "",
      consigneeaddress: "",
      consigneecountry: "",
      consigneestate: "",
      consigneecity: "",
      consigneepincode: "",
      consigneecontactno: "",
      consigneemail: "",

      buyername: "",
      buyeraddress: "",
      buyercountry: "",
      buyerstate: "",
      buyercity: "",
      buyerpincode: "",
      buyercontactno: "",
      buyeremail: "",
    },
  ]);


  const handlechangeinputs = (event) => {
    const { name, value } = event.target;

    if (name == "advance") {
      let finalvalue = value;
      if (inputs.totalamount >= finalvalue) {
        setinputs((prevInputs) => ({ ...prevInputs, [name]: value, }));
      } else {
        toast.error("Advance can not be greater than Total amount", { autoClose: 1000, position: 'top-center' })
        setinputs((prevInputs) => ({ ...prevInputs, [name]: 0, }));
      }

    } else {
      setinputs((prevInputs) => ({ ...prevInputs, [name]: value, }));
    }

  }


  const handlechange = (event) => {
    const { name, value } = event.target;
    setAddressdetails((prevInputs) => ({ ...prevInputs, [name]: value, }));
  }

  const handlechange1 = (event, name) => {
    if (name == "buyername") {
      let buyernmae = event.value;
      console.log("buyernmae..........p");
      console.log(event.label);
      const Buyerdata = buyerdata.flat().filter((buyer) => buyer.ledcd === buyernmae);
      if (Buyerdata.length > 0) {
        const addressesname = Buyerdata.flatMap((buyer) => buyer.buyerDetail.map((detail) => detail.addressname));
        const alldetailsofbuyer = Buyerdata.flatMap((buyer) => buyer.buyerDetail.map((detail) => detail));
        setBuyerAliasonchange(Buyerdata[0].buyeralias)
        console.log(Buyerdata[0].buyeralias)
        setAlldetailsofbuyer(alldetailsofbuyer);
        setAddressName(addressesname);
        setAddressdetails({
          consigneename: "",
          consigneeaddress: "",
          consigneecountry: "",
          consigneestate: "",
          consigneecity: "",
          consigneepincode: "",
          consigneecontactno: "",
          consigneemail: "",

          buyername: "",
          buyeraddress: "",
          buyercountry: "",
          buyerstate: "",
          buyercity: "",
          buyerpincode: "",
          buyercontactno: "",
          buyeremail: "",

          bankname: "",
          branchname: "",
          ifsccode: "",
          accountnumber: "",
          acaddress: "",
          swiftcode: ""
        })

      }
    }

    if (name == "addressname") {
      const targetvalue = event.value;
      const addressdetail = alldetailsofbuyer.filter((item) => item.addressname == targetvalue);
      if (addressdetail.length > 0) {

        const matchedDetail = addressdetail[0];
        console.log("addressdetail")
        console.log(addressdetail)

        setAddressdetails({
          consigneename: matchedDetail.billContactperson,
          consigneeaddress: matchedDetail.billAddress1,
          consigneecountry: "india",
          consigneestate: matchedDetail.billState,
          consigneecity: matchedDetail.billCity,
          consigneepincode: matchedDetail.billPin_No,
          consigneecontactno: matchedDetail.billContactno,
          consigneemail: matchedDetail.billEmail,

          buyername: matchedDetail.shippContactperson,
          buyeraddress: matchedDetail.shippAddress1,
          buyercountry: "india",
          buyerstate: matchedDetail.shippState,
          buyercity: matchedDetail.shippCity,
          buyerpincode: matchedDetail.shippPin_No,
          buyercontactno: matchedDetail.shippContactNo,
          buyeremail: matchedDetail.shippEmail,

          bankname: matchedDetail.banknm,
          branchname: matchedDetail.branchnm,
          accountno: matchedDetail.accountno,
          ifsccode: matchedDetail.ifsccode,
          accountnumber: matchedDetail.swiftcode,
          acaddress: matchedDetail.bankddress,
          swiftcode: matchedDetail.swiftcode,

        })


      }
    }
  };



  // addless inputs
  const [disablefieldPercent, setDisablefieldPercent] = useState(false);
  const [disablefieldamount, setDisablefieldamount] = useState(false);

  const [addlessInputs, setAddlessinputs] = useState([
    {
      addless: "",
      discountname: "",
      discountAmt: 0,
      discountpercent: 0,
      addlesson: "",
      percentAmt: 0,
      disablefieldPercent: false,
      disablefieldamount: false,
    },
  ]);

  const handleaddlessupdate = (index, e) => {
    const updatedPartInputs = [...addlessInputs];
    updatedPartInputs[index].addless = e.value;

    setAddlessinputs(updatedPartInputs);
  };


  const addcontent = () => {
    setAddlessinputs((prevData) => [
      ...prevData,
      {
        addless: "",
        discountname: "",
        discountAmt: 0,
        discountpercent: 0,
        addlesson: "",
        percentAmt: 0,
        disablefieldPercent: false,
        disablefieldamount: false,
      },
    ]);
  };

  const handledeleteAddless = (index) => {
    const newArray = [...addlessInputs];
    newArray.splice(index, 1);
    setAddlessinputs(newArray);
  };

  const multihandlechange = (e, i) => {
    const { name, value } = e.target;
    const inputdata = [...addlessInputs];
    inputdata[i][name] = value;
    setAddlessinputs(inputdata);

    if (inputdata[i].discountpercent == 0 && inputdata[i].discountAmt == 0) {
      inputdata[i].percentAmt = 0;
      inputdata[i].disablefieldPercent = false;
      inputdata[i].disablefieldamount = false;
    }
    if (inputdata[i].discountpercent > 0) {
      const percentvalue = inputdata[i].discountpercent;
      const totalamount = inputs.totalamount;

      const prcntamt = (totalamount * percentvalue) / 100 || 0;
      inputdata[i].percentAmt = prcntamt;
      inputdata[i].disablefieldPercent = false;
      inputdata[i].disablefieldamount = true;
    }
    if (inputdata[i].discountAmt > 0) {
      inputdata[i].discountpercent = 0;
      inputdata[i].percentAmt = 0;
      inputdata[i].disablefieldPercent = true;
      inputdata[i].disablefieldamount = false;
    }
  };

  const convertedData = {
    clientCode: inputs.clientCode,
    clientName: inputs.clientName,
    alias: buyerAliasonchange,
    buyerOderDate: inputs.buyerOderDate,
    delivaryDate: inputs.delivaryDate,
    buyerpo: inputs.buyerpo,
    remark: inputs.remark,
    totalamount: inputs.totalamount,
    discount: inputs.discount,
    addamount: inputs.addamount,
    grandtotal: inputs.grandtotal,
    advance: inputs.advance,
    buyerdeliverto: inputs.buyerdeliverto,
    precarriageby: addressdetail.precarriageby,
    shipping: addressdetail.shipping,
    vesselno: addressdetail.vesselno,
    payterm: addressdetail.payterm,
    shipmentype: addressdetail.shipmentype,
    bankname: addressdetail.bankname,
    branchname: addressdetail.branchname,
    ifsccode: addressdetail.ifsccode,
    accountnumber: addressdetail.accountnumber,
    acaddress: addressdetail.acaddress,

    consigneename: addressdetail.consigneename,
    consigneeaddress: addressdetail.consigneeaddress,
    consigneecountry: addressdetail.consigneecountry,
    consigneestate: addressdetail.consigneestate,
    consigneecity: addressdetail.consigneecity,
    consigneepincode: addressdetail.consigneepincode,
    consigneecontactno: addressdetail.consigneecontactno,
    consigneemail: addressdetail.consigneemail,

    buyername: addressdetail.buyername,
    buyeraddress: addressdetail.buyeraddress,
    buyercountry: addressdetail.buyercountry,
    buyerstate: addressdetail.buyerstate,
    buyercity: addressdetail.buyercity,
    buyerpincode: addressdetail.buyerpincode,
    buyercontactno: addressdetail.buyercontactno,
    buyeremail: addressdetail.buyeremail,
    createdby: "empName",
    updatedby: "empName",
    performaInvoiceDetails: addedItems,
    performaInvoiceDiscount: addlessInputs,
  };

  // console.log("convertedData", convertedData)



  const convertedData2 = {
    rwid: inputs.rwid,
    clientCode: inputs.clientCode,
    clientName: inputs.clientName,
    alias: buyerAliasonchange,
    buyerOderDate: inputs.buyerOderDate,
    delivaryDate: inputs.delivaryDate,  
    buyerpo: inputs.buyerpo,
    remark: inputs.remark,
    totalamount: inputs.totalamount,
    discount: inputs.discount,
    addamount: inputs.addamount,
    grandtotal: inputs.grandtotal,
    advance: inputs.advance,
    buyerdeliverto: inputs.buyerdeliverto,
    precarriageby: addressdetail.precarriageby,
    shipping: addressdetail.shipping,
    vesselno: addressdetail.vesselno,
    payterm: addressdetail.payterm,
    shipmentype: addressdetail.shipmentype,
    bankname: addressdetail.bankname,
    branchname: addressdetail.branchname,
    ifsccode: addressdetail.ifsccode,
    accountnumber: addressdetail.accountnumber,
    acaddress: addressdetail.acaddress,

    consigneename: addressdetail.consigneename,
    consigneeaddress: addressdetail.consigneeaddress,
    consigneecountry: addressdetail.consigneecountry,
    consigneestate: addressdetail.consigneestate,
    consigneecity: addressdetail.consigneecity,
    consigneepincode: addressdetail.consigneepincode,
    consigneecontactno: addressdetail.consigneecontactno,
    consigneemail: addressdetail.consigneemail,

    buyername: addressdetail.buyername,
    buyeraddress: addressdetail.buyeraddress,
    buyercountry: addressdetail.buyercountry,
    buyerstate: addressdetail.buyerstate,
    buyercity: addressdetail.buyercity,
    buyerpincode: addressdetail.buyerpincode,
    buyercontactno: addressdetail.buyercontactno,
    buyeremail: addressdetail.buyeremail,
    updatedby: "empName",
    performaInvoiceDetails: addedItems,
    performaInvoiceDiscount: addlessInputs,
  };
// console.log("convertedData22222", convertedData2);
  const history = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    convertedData.performaInvoiceDetails.map((item) => {
      delete item.rwid;
    });
    convertedData.performaInvoiceDetails.map((item) => {
      delete item.image;
    });
    const jsonData = JSON.stringify(convertedData);

    console.log(table)
    console.log(addlessInputs)
    console.log(addedItems)

    if (addedItems.length === 0) {
      alert("Please add  Product ");
      return
    } else if (inputs.clientName === "" || inputs.clientName === null || inputs.clientName === undefined) {
      alert("select Buyer Name");
      return
    } else if (inputs.buyerOderDate === "" || inputs.buyerOderDate === null || inputs.buyerOderDate === undefined) {
      alert("select Order Date");
      return
    } else if (inputs.delivaryDate === "" || inputs.delivaryDate === null || inputs.delivaryDate === undefined) {
      alert("select Delivery Date");
      return
    } else if (inputs.buyerpo === "" || inputs.buyerpo === null || inputs.buyerpo === undefined) {
      alert("Enter Buyer PO");
      return
    } else {

      if (inputs.rwid == null) {

        fetch(`${url}/api/AddPerformainvoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
          body: jsonData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            toast.success("Proforma Invoice Save Successfully " + data.picd, {
              autoClose: 1000, onClose: () => {
                history("/proforma-Invoice")
              },
            })

          })
          .catch((error) => { });
      } else {
        console.log(JSON.stringify(convertedData2));

        fetch(`${url}/api/updateperformainvoice/${inputs.rwid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
          body: JSON.stringify(convertedData2),
        })
          .then((response) => response.json())
          .then((data) => {
            toast.success("Proforma Invoice Update Successfully \n" + data.picd, {
              autoClose: 1000, onClose: () => {
                history("/proforma-Invoice")
              },
            })
            window.history.replaceState(null, "", "/addproforma");
          })
          .catch((error) => { });
      }

      setinputs({
        clientCode: "",
        clientName: "",
        alias: "",
        buyerOderDate: "",
        delivaryDate: "",
        buyerpo: "",
        remark: "",
        discount: "",
        addamount: "",
        grandtotal: "",
        advance: "",

      });

      setAddressdetails({
        buyerdeliverto: "",
        precarriageby: "",
        shipping: "",
        vesselno: "",
        payterm: "",
        shipmentype: "",
        bankname: "",
        branchname: "",
        ifsccode: "",
        accountnumber: "",
        acaddress: "",
        swiftcode: "",


        consigneename: "",
        consigneeaddress: "",
        consigneecountry: "",
        consigneestate: "",
        consigneecity: "",
        consigneepincode: "",
        consigneecontactno: "",
        consigneemail: "",

        buyername: "",
        buyeraddress: "",
        buyercountry: "",
        buyerstate: "",
        buyercity: "",
        buyerpincode: "",
        buyercontactno: "",
        buyeremail: "",
      })
      setAddedItems([]);

      setBuyernameoption({ label: "", value: "" })
      setAddressnameoption({ label: "", value: "" })

      setShippingOption({ label: "", value: "" })
      setPrecarriagebyoption({ label: "", value: "" })
      setShipmenttypeoption({ label: "", value: "" })
      setBuyerAliasonchange('')


    }
  };
const [rePifilter, setRePifilter] = useState(false);
const [productfilter, setproductfilter] = useState(true);
const [partfilter, setPartfilter] = useState(false);
  const [fromvalue, setFromvalue] = useState({ label: "Product", value: "Product", });

  const From = [
    {
      options: [
        { label: "Product", value: "Product" },
        { label: "Re-PI", value: "Re-PI" },
      ],
    },
  ];

  const handlefilterchange = (e, name) => {
    if (e.value == "Product") {
    //   console.log("value");
    // console.log(e.value);
     setproductfilter(true);
     setRePifilter(false);
     fetchData(e.value);
     setTable([]);
   } else if (e.value == "Re-PI") {
    // console.log("value");
    // console.log(e.value);
     setproductfilter(false);
     setRePifilter(true);
     fetchData(e.value);
     setTable([]);                      
   }
 }





  return (
    <div className="page-content">
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={orderList}
      />

      <Container fluid>
        <BreadCrumb
          pageName="Manage Proforma Invoice" managePi="Manage Pi" subTitle="Manage Proforma Invoice"
        />
           {/* {showFirst ? ( */}
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="border-0">
                <Row>
                <div className="col-md-2">
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="Category">
                      From
                    </Label>
                    <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                      <Select
                        value={fromvalue}
                        onChange={(e) => {
                          setFromvalue(e);
                          handlefilterchange(e);
                          Setdata1({ ...data1, from: e.value });
                        }}
                        options={From}
                        id="Category"
                        className="js-example-basic-single mb-0"
                        name="from"
                      />
                    </div>
                  </div>
                </div>

                {productfilter && (
                <>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor=" Product Category">
                        Product Category
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prdcatvalue}
                          onChange={(e) => {
                            setPrdcatvalue(e);
                            setDvalue({ ...dvalue, dcategory: e.value });
                          }}
                          options={Allproductcategory}
                          id=" Product Category"
                          className="js-example-basic-single mb-0"
                          name="from"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Productcode">
                        Product Code
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prdcodevalue}
                          onChange={(e) => {
                            setPrdcodevalue(e);
                            setDvalue({ ...dvalue, dprdcd: e.value });
                          }}
                          options={Allproductcode}
                          id=" Product Code"
                          className="js-example-basic-single mb-0"
                          name="from"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor=" Product Alias">
                        Product Alias
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prdaliasvalue}
                          onChange={(e) => {
                            setPrdaliasvalue(e);
                            setDvalue({ ...dvalue, dprdalias: e.value });
                          }}
                          options={Allproductalias}
                          id=" Product Alias"
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
                        htmlFor=" Product Description"
                      >
                        Product Description
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prddescriptionvalue}
                          onChange={(e) => {
                            setPrddescriptionvalue(e);
                            setDvalue({ ...dvalue, dDescription: e.value });
                          }}
                          options={Allproductdescription}
                          id=" Product Description"
                          className="js-example-basic-single mb-0"
                          name="from"
                        />
                      </div>
                    </div>
                  </div>
                  </>
                )}
                {rePifilter && (
                  <>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor=" Product Category">
                        Product Category
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prdcatvalue}
                          onChange={(e) => {
                            setPrdcatvalue(e);
                            setDvalue({ ...dvalue, dcategory: e.value });
                          }}
                          options={Allproductcategory}
                          id=" Product Category"
                          className="js-example-basic-single mb-0"
                          name="from"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Productcode">
                        Product Code
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prdcodevalue}
                          onChange={(e) => {
                            setPrdcodevalue(e);
                            setDvalue({ ...dvalue, dprdcd: e.value });
                          }}
                          options={Allproductcode}
                          id=" Product Code"
                          className="js-example-basic-single mb-0"
                          name="from"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor=" Product Alias">
                        Product Alias
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prdaliasvalue}
                          onChange={(e) => {
                            setPrdaliasvalue(e);
                            setDvalue({ ...dvalue, dprdalias: e.value });
                          }}
                          options={Allproductalias}
                          id=" Product Alias"
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
                        htmlFor=" Product Description"
                      >
                        Product Description
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prddescriptionvalue}
                          onChange={(e) => {
                            setPrddescriptionvalue(e);
                            setDvalue({ ...dvalue, dDescription: e.value });
                          }}
                          options={Allproductdescription}
                          id=" Product Description"
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
                        htmlFor=" pinos"
                      >
                        Re-No
                      </Label>
                      <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                        <Select
                          value={prdpinovalue}
                          onChange={(e) => {
                            setPrdpinovalue(e);
                            setDvalue({ ...dvalue, dpino: e.value });
                          }}
                          options={Allpinos}
                          id=" Re-Pi"
                          className="js-example-basic-single mb-0"
                          name="from"
                        />
                      </div>
                    </div>
                  </div>
                  </>
                )}

                <div className="col-md-2 " style={{ marginTop: "1.8rem" }}>
                  <Button className="btn btn-success " onClick={masterSearch}>
                    Search
                  </Button>
                </div>

                </Row>
              </CardHeader>

              <CardBody className="pt-0">
                <div>
                  {table.length ? (
                    <TableContainer
                      columns={columns}
                      data={table || []}
                      customPageSize={10000}
                      divClass="table-responsive table-card mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted"
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
                      theadClass="table-light text-muted"
                      handleOrderClick={handleOrderClicks}
                      SearchPlaceholder="Search something..."
                    />
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button className="btn btn-success mb-4" onClick={handleAddToList} size="sm"> Add To List</Button>
                </div>

                <div>
                  {addedItems.length ? (
                    <TableContainer
                      columns={Addcolumns}
                      data={addedItems}
                      customPageSize={10000}
                      divClass="table-responsive table-card mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted"
                      // onChange={(e) => handleCellEdit(e.target.value, rowIndex, Addcolumns.accessor)}
                      
                    />
                  ) : (
                    <TableContainer
                      columns={Addcolumns}
                      data={addedItems}
                      customPageSize={10000}
                      divClass="table-responsive table-card mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted"
                      // onChange={(e) => handleCellEdit(e.target.value, rowIndex, Addcolumns.accessor)}
                    />
                  )}
                </div>

                <div className="mt-4">
                  <Row>
                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Buyer-Name">
                          Buyer Name
                        </Label>
                        <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                          <Select
                            value={buyernameoption}
                            onChange={(e) => {
                              setBuyernameoption(e);
                              handlechange1(e, "buyername");
                              setinputs({ ...inputs, clientName: e.label, clientCode: e.value });
                            }}
                            options={buyernames}
                            id="Buyer-Name"
                            className="js-example-basic-single mb-0"
                            name="Buyer-Name"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Buyer Alias">
                          Buyer Alias
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Buyer Alias"
                          placeholder="Enter Buyer Alias"
                          name="alias"
                          value={buyerAliasonchange}

                        />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="Buyer-Order-Date"
                        >
                          Buyer Order Date
                        </Label>
                        <Input
                          type="date"
                          className="form-control"
                          id="Buyer-Order-Date "
                          name="buyerOderDate"
                          value={dateFormat(inputs.buyerOderDate)}
                          onChange={handlechangeinputs}
                        />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Delivery -Date">
                          Delivery Date
                        </Label>
                        <Input
                          type="date"
                          className="form-control"
                          id="Delevary Date"
                          placeholder="Enter Delivery Date"
                          name="delivaryDate"
                          value={dateFormat(inputs.delivaryDate)}
                          onChange={handlechangeinputs}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Buyer PO">
                          Buyer PO.
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Buyer PO"
                          placeholder="Enter Buyer PO"
                          name="buyerpo"
                          value={inputs.buyerpo}
                          onChange={handlechangeinputs}
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
                          name="remark"
                          value={inputs.remark}
                          onChange={handlechangeinputs}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 " style={{ marginTop: "1.8rem" }}>
                      <Button className="btn btn-success " size="sm" onClick={() => setModalProject(true)}>Add /Less</Button>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Total Amount">
                          Total Amount
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Total Amount"
                          placeholder="Enter Total Amount"
                          readOnly
                          name="totalamount"
                          value={inputs.totalamount || ""}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Discount Amount">
                          Discount Amount
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Discount Amount"
                          placeholder="Enter Discount Amount"
                          name="discount"
                          value={inputs.discount || ""}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Add Amount">
                          Add Amount
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Add Amount"
                          placeholder="Enter Add Amount"
                          name="addamount"
                          value={inputs.addamount || ""}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Grand-Total">
                          Grand Total
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Grand-Total"
                          placeholder="Enter Grand-Total"
                          name="grandtotal"
                          value={inputs.grandtotal || ""}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Advance">
                          Advance
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Advance"
                          placeholder="Enter Advance"
                          name="advance"
                          value={inputs.advance}
                          onChange={handlechangeinputs}
                        />
                      </div>
                    </div>
                  </Row>
                  <Row></Row>
                  <Row>
                    <Col className="row mt-4 " sm={12}>
                      <Col lg={3}>
                        <div className="mb-3" style={{ textAlign: "center" }}>
                          <Label
                            className="form-label"
                            style={{
                              whiteSpace: "nowrap",
                              marginTop: "1rem",
                              marginRight: "1rem",
                              fontWeight: "bold",
                            }}
                          >
                            Consignee Name
                          </Label>
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Name">
                            Contact Person
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Name"
                            placeholder="Enter Name"
                            name="consigneename"
                            value={addressdetail.consigneename || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Contact Adress">
                            Contact Address
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Address1"
                            placeholder="Enter Address 1"
                            name="consigneeaddress"
                            value={addressdetail.consigneeaddress || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Address2">
                            Country
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Address2"
                            placeholder="Enter Address 2"
                            name="consigneecountry"
                            value={addressdetail.consigneecountry || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="State">
                            State
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="State"
                            placeholder="Enter State "
                            name="consigneestate"
                            value={addressdetail.consigneestate}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="City">
                            City
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="City"
                            placeholder="Enter City "
                            name="consigneecity"
                            value={addressdetail.consigneecity || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Pin No.">
                            Pin No.
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="Pin No."
                            placeholder="Enter Pin No. "
                            name="consigneepincode"
                            value={addressdetail.consigneepincode || ''}
                            onChange={handlechange}
                            onInput={(e) =>
                            (e.target.value = e.target.value
                              .slice(0, 10)
                              .replace(/\D/g, ""))
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="Contact-Number"
                          >
                            Contact Number
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="City"
                            placeholder="Enter Contact Number. "
                            name="consigneecontactno"
                            value={addressdetail.consigneecontactno || ''}
                            onChange={handlechange}
                          />
                        </div>

                        {/* <div className="mb-3">
                          <Label className="form-label" htmlFor="Mobile-Number">
                            Mobile Number
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Mobile"
                            placeholder="Enter 10-digit Mobile Number"
                            name="Mobile"
                            onInput={(e) =>
                              (e.target.value = e.target.value
                                .slice(0, 10)
                                .replace(/\D/g, ""))
                            }
                          />
                        </div> */}

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Mobile-Number">
                            Email
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Email"
                            placeholder="Enter Email"
                            name="consigneemail"
                            value={addressdetail.consigneemail || ''}
                            onChange={handlechange}
                          />
                        </div>

                        {/* <div className="mb-3">
                          <Label className="form-label" htmlFor="GST">
                            GST
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="GST"
                            placeholder="Enter GST"
                            name="GST"
                            maxLength={15}
                            onInput={(e) =>
                              (e.target.value = e.target.value.replace(
                                /[^A-Za-z0-9@.]/g,
                                ""
                              ))
                            }
                          />
                        </div> */}
                      </Col>

                      <Col lg={3}>
                        <div style={{ textAlign: "center" }}>
                          <div className="mb-3 d-flex " style={{ justifyContent: "space-between" }}>
                            <Label
                              className="form-label"
                              htmlFor="Payment Term"
                              style={{
                                marginTop: "1rem",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Buyer Deliver To
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={addressnameoption}
                                onChange={(e) => {
                                  setAddressnameoption(e);
                                  handlechange1(e, "addressname");
                                  setinputs({ ...inputs, buyerdeliverto: e.value });
                                }}
                                options={alladdressname}
                                id=" Buyer Deliver To"
                                className="js-example-basic-single mb-0"
                                name=" Buyer Deliver To"
                                styles={{ width: '8rem' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Name">
                            Contact Person
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Name"
                            placeholder="Enter Name"
                            name="buyername"
                            value={addressdetail.buyername || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Contact Adress">
                            Contact Address
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Contact Adress"
                            placeholder="Enter Address 1"
                            name="buyeraddress"
                            value={addressdetail.buyeraddress || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Country">
                            Country
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Country"
                            placeholder="Enter Country"
                            name="buyercountry"
                            value={addressdetail.buyercountry || ''}
                            onChange={handlechange}

                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="State">
                            State
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="State"
                            placeholder="Enter State "
                            name="buyerstate"
                            value={addressdetail.buyerstate || ''}
                            onChange={handlechange}

                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="City">
                            City
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="City"
                            placeholder="Enter City "
                            name="buyercity"
                            value={addressdetail.buyercity || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Pin No.">
                            Pin No.
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="Pin No."
                            placeholder="Enter Pin No. "
                            name="buyerpincode"
                            value={addressdetail.buyerpincode || ''}
                            onChange={handlechange}
                            onInput={(e) =>
                            (e.target.value = e.target.value
                              .slice(0, 10)
                              .replace(/\D/g, ""))
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="Contact-Number"
                          >
                            Contact Number
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="City"
                            placeholder="Enter Contact Number. "
                            name="buyercontactno"
                            value={addressdetail.buyercontactno || ''}
                            onChange={handlechange}
                          />
                        </div>

                        {/* <div className="mb-3">
                          <Label className="form-label" htmlFor="Mobile-Number">
                            Mobile Number
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Mobile"
                            placeholder="Enter 10-digit Mobile Number"
                            name="Mobile"
                            onInput={(e) =>
                              (e.target.value = e.target.value
                                .slice(0, 10)
                                .replace(/\D/g, ""))
                            }
                          />
                        </div> */}

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Mobile-Number">
                            Email
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Email"
                            placeholder="Enter Email"
                            name="buyeremail"
                            value={addressdetail.buyeremail || ''}
                            onChange={handlechange}
                          />
                        </div>

                        {/* <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="Final Destination"
                          >
                            Final Destination
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Final Destination"
                            placeholder="Enter Final Destination"
                            name="Final Destination"
                          />
                        </div> */}
                      </Col>

                      <Col lg={3}>
                        <div className="mb-3" style={{ textAlign: "center" }}>
                          <Label
                            className="form-label"
                            htmlFor="Payment Term"
                            style={{
                              whiteSpace: "nowrap",
                              marginTop: "1rem",
                              marginRight: "1rem",
                              fontWeight: "bold",
                            }}
                          >
                            Shipping Deatail
                          </Label>
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Buyer-Name">
                            Pre Carriege By
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={precarriagebyoption}
                              onChange={(e) => {
                                setPrecarriagebyoption(e);
                                setAddressdetails({ ...addressdetail, precarriageby: e.value })
                              }}
                              options={Precarriage}
                              id="Buyer-Name"
                              className="js-example-basic-single mb-0"
                              name="Buyer-Name"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Buyer-Name">
                            shipping
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={shippingOption}
                              onChange={(e) => {
                                setShippingOption(e);
                                setAddressdetails({ ...addressdetail, shipping: e.value })
                              }}
                              options={shippingtype}
                              id="Buyer-Name"
                              className="js-example-basic-single mb-0"
                              name="Buyer-Name"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Flight">
                            Flight No./AWB No./Vessel No.
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Flight"
                            placeholder="Enter Flight No./AWB No./Vessel No."
                            name="vesselno"
                            value={addressdetail.vesselno}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Payment Term">
                            Payment Term
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Payment Term"
                            placeholder="Enter Payment Term."
                            name="payterm"
                            value={addressdetail.payterm}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="shipment-Type">
                            shipment Type
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={shipmenttypeoption}
                              onChange={(e) => {
                                setShipmenttypeoption(e);
                                setAddressdetails({ ...addressdetail, shipmentype: e.value })
                              }}
                              options={shipmenttype}
                              id="shipment-Type"
                              className="js-example-basic-single mb-0"
                              name="shipment Type"
                            />
                          </div>
                        </div>
                      </Col>

                      <Col lg={3}>
                        <div>
                          <div
                            className="mb-3 "
                            style={{ textAlign: "center" }}
                          >
                            <Label
                              className="form-label "
                              htmlFor="Payment Term"
                              style={{
                                marginTop: "1rem",
                                fontWeight: "bold",
                              }}
                            >
                              Bank Detail
                            </Label>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Bank-Name">
                            Bank Name
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Bank-Name"
                            placeholder="Enter Bank Name"
                            name="bankname"
                            value={addressdetail.bankname || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Branch-Name">
                            Branch Name
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Branch-Name"
                            placeholder="Enter Branch Name"
                            name="branchname"
                            value={addressdetail.branchname || ''}
                            onChange={handlechange}
                          />
                        </div>
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="Account-Number"
                          >
                            Account Number
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="Account-Number"
                            placeholder="Enter Account Number"
                            name="accountnumber"
                            value={addressdetail.accountnumber || ''}
                            onChange={handlechange}
                          />
                        </div>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="IFCS-Code">
                            IFSC Code
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="IFCS-Code"
                            placeholder="Enter IFCS Code"
                            name="ifsccode"
                            value={addressdetail.ifsccode || ''}
                            onChange={handlechange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Swift-Code">
                            Swift Code
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Swift-Code"
                            placeholder="Enter Swift Code"
                            name="swiftcode"
                            value={addressdetail.swiftcode || ''}
                          />
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor=" Bank Address">
                            Bank Address
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id=" Bank Address"
                            placeholder="Enter  Bank Address"
                            name="acaddress"
                            value={addressdetail.acaddress || ''}
                            onChange={handlechange}
                          />
                        </div>
                      </Col>
                    </Col>
                  </Row>
                </div>
                <div style={{ display: "flex", justifyContent: "end" }} className="mt-4">

                  <div style={{ width: "10px" }}></div>
                  <Button className="btn btn-success  mb-4" size="sm" onClick={handleSubmit}>Save</Button>
                </div>
                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal
          size="lg"
          backdrop={"static"}
          isOpen={modalProject}
          toggle={() => setModalProject(!modalProject)}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader
            toggle={() => setModalProject(!modalProject)}
            className="p-3 bg-primary-subtle"
          >
            Add/Less
          </ModalHeader>
          <ModalBody>
            {addlessInputs.map((val, i) => (
              <>
                <Row>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Category">
                        Add/Less
                      </Label>
                      <Select
                        value={{ label: val.addless, value: val.addless }}
                        onChange={(e) => { handleaddlessupdate(i, e); }}
                        options={addless}
                        id="Category"
                        className="js-example-basic-single mb-0"
                        name="from"
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Add/Less Head">
                        Add/Less Head
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="Add/Less Head"
                        placeholder="Enter Add/Less "
                        name="discountname"
                        value={val.discountname}
                        onChange={(e) => multihandlechange(e, i)}
                      />
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Percent(%)">
                        Percent(%)
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="Percent(%)"
                        placeholder="Enter Percent(%) "
                        disabled={val.disablefieldPercent}
                        name="discountpercent"
                        value={val.discountpercent || ""}
                        onChange={(e) => multihandlechange(e, i)}
                        style={{ width: '60px' }}
                      />
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Amount(%)" style={{ marginLeft: '1rem' }}>
                        Amount(%)
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="Amount(%)"
                        placeholder="Enter Amount(%) "
                        name="percentAmt"
                        value={val.percentAmt || ""}
                        style={{ width: '60px', marginLeft: '1rem' }}
                      />
                    </div>
                  </div>
                  <div className="col-md-1 mt-4" style={{ margin: '1rem', paddingLeft: '2rem' }}>
                    <p> OR</p>
                  </div>

                  <div className="col-md-1">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Amount">
                        Amount
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="Amount"
                        placeholder="Enter Amount "
                        disabled={val.disablefieldamount || ""}
                        name="discountAmt"
                        value={val.discountAmt}
                        onChange={(e) => multihandlechange(e, i)}
                        style={{ width: '60px' }}
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Add/Less ON">
                        Add/Less ON
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="Add/Less ON"
                        placeholder="Enter Add/Less ON "
                        disabled={val.disablefieldamount}
                        name="addlesson"
                        value={val.addlesson}
                        onChange={(e) => multihandlechange(e, i)}
                      />
                    </div>
                  </div>

                  {i === 0 ? (
                    <>
                      <div className="col-md-1 mt-4">
                        <button className="btn btn-success" onClick={addcontent}>
                          <i className="ri-add-line align-bottom me-1"></i>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-1 mt-4">
                        <button
                          className="btn btn-success"
                          onClick={() => handledeleteAddless(i)}
                        >
                          <i
                            className="las la-trash-alt"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                        </button>
                      </div>
                    </>
                  )}
                </Row>
              </>
            ))}
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <Button
                color="light"
                onClick={() => {
                  setModalProject(false);
                }}
              >
                Close
              </Button>
              <Button type="" color="success" onClick={handleClose}>
                Add
              </Button>
            </div>
          </ModalFooter>
        </Modal>

      </Container>
    </div>
  );
};

export default AddProforma;
