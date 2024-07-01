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
  ModalFooter,
  Button,
} from "reactstrap";
import Select from "react-select";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainers";
import Token from "../Token/Base_Token";
import url from "../Base_url/Base_url";


import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createSelector } from "reselect";
import { size } from "lodash";

function dateFormat(inputDate) {
  const date = new Date(inputDate);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because it's 0-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}


const Ordercreate = () => {

  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;

  const selectLayoutState = (state) => state.Ecommerce;
  const selectLayoutProperties = createSelector(selectLayoutState, (ecom) => ({
    orders: ecom.orders,
    isOrderSuccess: ecom.isOrderSuccess,
    error: ecom.error,
  }));
  // Inside your component

  const [orderList, setOrderList] = useState([]);

  const [fromvalue, setFromvalue] = useState({ label: "Product", value: "Product", });
  const [addlessvalue, setAddlessvalue] = useState({ label: "Add", value: "Add", });
  const [buyernameoption, setBuyernameoption] = useState(null);
  const [addressnameoption, setAddressnameoption] = useState(null);
  const [prdcodevalue, setPrdcodevalue] = useState(null);
  const [prdcatvalue, setPrdcatvalue] = useState(null);
  const [prdaliasvalue, setPrdaliasvalue] = useState(null);
  const [prddescriptionvalue, setPrddescriptionvalue] = useState(null);
  const [partcodevalue, setPartcodevalue] = useState(null);
  const [partnamevalue, setPartnamevalue] = useState(null);
  const [pinamevalue, setPinamevalue] = useState(null);
  const [buyerpovalue, setBuyerpovalue] = useState(null);
  const [clientnamevalue, setClientnamevalue] = useState(null);
  const [ordercodevalue, setOrdercodevalue] = useState(null);
  const [buyerdata, setBuyerdata] = useState([]);
  const [buyername, setBuyername] = useState([]);
  const [addressName, setAddressName] = useState([]);
  const [alldetailsofbuyer, setAlldetailsofbuyer] = useState([]);
  const [buyerSearchCompleted, setBuyerSearchCompleted] = useState(false);
  const [allProductFetched, setAllProductFetched] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const [Additemsimage, setAdditemsimage] = useState({});
  const [productcode, setProductcode] = useState([]);
  const [category, setCategory] = useState([]);
  const [prdalias, setPrdalias] = useState([]);
  const [description, setDiscription] = useState([]);
  const [partcode, setPartcode] = useState([]);
  const [partname, setPartname] = useState([]);
  const [piname, setPiname] = useState([]);
  const [ordercode, setOrdercode] = useState([]);
  const [clientname, setClientname] = useState([]);
  const [buyerpo, setBuyerpo] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const [table, setTable] = useState([]);
  const [modalProject, setModalProject] = useState(false);
  const [modalDoc, setModalDoc] = useState(false);


  useEffect(() => {
    fetchData("Product");

  }, []);

  const fetchData = async (checkfrom) => {
    try {
      if (checkfrom == "Product") {
        const response = await fetch(`${url}/getAllProduct`, { headers: { Authorization: Token }, });
        const Allproduct = await response.json();
        const product = Allproduct.filter((item) => item.dis != "YES");

        const prdcd = [...new Set(product.map((item) => item.prdcd))];
        const categoryNames = [...new Set(product.map((item) => item.categorynm)),];
        const prdaliases = [...new Set(product.map((item) => item.prdalias))];
        const descriptions = [...new Set(product.map((item) => item.prdnm))];
        console.log("product");
        console.log(product);
        setProductcode(prdcd);
        setCategory(categoryNames);
        setPrdalias(prdaliases);
        setDiscription(descriptions);
        setTemptabledata(product);

        let urls = {};
        for (const item of product) {
          const imageUrlResponse = await fetch(`${url}/image/ProductImage/${item.rwid}`);
          const imageUrlBlob = await imageUrlResponse.blob();
          const imageUrl = URL.createObjectURL(imageUrlBlob);
          urls[item.rwid] = imageUrl;
        }
        setImageUrls(urls);
        setAdditemsimage((prevState) => ({ ...prevState, ...urls }));

        console.log("product");
        console.log(product);


      } else if (checkfrom == "Part") {


        const response = await fetch(`${url}/getAllParts`, { headers: { Authorization: Token }, });
        const part = await response.json();

        const partcode = [...new Set(part.map((item) => item.partCode))];
        const partname = [...new Set(part.map((item) => item.partName))];
        setPartcode(partcode);
        setPartname(partname);
        setTemptabledata(part);

        

        let urls = {};
        for (const item of part) {
          const imageUrlResponse = await fetch(`${url}/image/PartImage/${item.id}`);
          const imageUrlBlob = await imageUrlResponse.blob();
          const imageUrl = URL.createObjectURL(imageUrlBlob);
          urls[item.id] = imageUrl;
        }
        setImageUrls(urls);
        setAdditemsimage((prevState) => ({ ...prevState, ...urls }));


      }else if (checkfrom == "PI") 
        {
        const response = await fetch(`${url}/api/GetAllperformainvoice`, {headers: { Authorization: Token },});
        const pino = await response.json();
        const pinames = pino.filter((item) => item.dis != "YES");
        const piname = [...new Set(pinames.map((item) => item.picd)),];     

        const response1 = await fetch(`${url}/getAllProduct`, { headers: { Authorization: Token }, });
        const Allproduct = await response1.json();
        const product = Allproduct.filter((item) => item.dis != "YES");

        const prdcddd = [...new Set(product.map((item) => item.prdcd))];
       
       
    // console.log("pinames");
    // console.log(pinames);
    // console.log("temptabledataghghghghg");
    // console.log(temptabledata);
// const savepidata1 = pinames.flatMap(item => item.performaInvoiceDetails.map(detail => (detail.prdcd)))

const savepidata = pinames.flatMap(item => {
  return item.performaInvoiceDetails.map(detail => {
    // Find the matching item in pinames where prdcd matches
    const matchingItem = temptabledata.find(pi => pi.prdcd == detail.prdcd);

    // Extract the description from the matching item if it exists
    const description = matchingItem ? matchingItem.prdnm : 'N/A';
    const prdcd = matchingItem ? matchingItem.prdcd : 'N/A';
    const qty = matchingItem ? matchingItem.qty : 'N/A';
    const pricePerpc = matchingItem ? matchingItem.pricePerpc : 'N/A';
    const buyerpocd = matchingItem ? matchingItem.buyerpocd : 'N/A';
    const netamount = matchingItem ? matchingItem.netAmount : 'N/A';
    const totalAmount = matchingItem ? matchingItem.totalAmount : 'N/A';
    const amnt = matchingItem ? matchingItem.amnt : 'N/A';
    const remark = matchingItem ? matchingItem.remark : 'N/A';
    const discntPercent = matchingItem ? matchingItem.discntPercent : 'N/A';
    
    return {
      rwid: detail.rwid,
          picd1: detail.picd,
          description:description,
          discntPercent:detail.discntPercent,
          remark: remark,
          // buyerpocd: buyerpocd,
          image: `${url}/image/ProductImages/${detail.prdcd}`,
          buyerpocd: detail.prdalias,
          categorynm: detail.categorynm,
          productPartCd: prdcd,
          prdname: detail.prdname,
          size: `${detail.prdlen}x${detail.prdwid}x${detail.prdheight}`,
          prdlen: detail.prdlen,
          prdwid: detail.prdwid,
          prdheight: detail.prdheight,
          prdunit: detail.prdunit,
          qty: detail.prdqty,
          pricePerpc: detail.price,
          netAmount: detail.netamount,
          prdnetWgt: detail.prdnetWgt,
          amnt: detail.amnt,
          prdGrsWgt: detail.prdGrsWgt,
          discount: detail.discount,
          cgst: detail.cgst,
          sgst: detail.sgst,
          igst: detail.igst,
          totalAmount: detail.totalamount,
          totalcbm: detail.totalcbm,
          cbmperpcs: detail.cbmperpcs,
          
    };
  });
});
      // console.log("pinamesssssssss",pinames);
      setPiname(piname)
      // setPiname(picd)
      // console.log("savepidata1111");
      setTemptabledata(savepidata);
      // console.log("savepidata-----",savepidata);
      setProductcode(prdcddd);
      
      }else if (checkfrom == "Reorder") {


        const response = await fetch(`${url}/getAllOrder`, { headers: { Authorization: Token }, });
        const reorder = await response.json();
        const orderList = reorder.filter((item) => item.dis != "YES");
     
        const ordercode = [...new Set(orderList.map((item) => item.ordcd))];
        const buyername = [...new Set(orderList.map((item) => item.buyername))];
        const buyerpo = [...new Set(orderList.map((item) => item.buyerPo))];

        const saveorderdata = orderList.flatMap(
          item => item.orderDetails.map(detail => ({
            rwid: detail.rwid,
            image: `${url}/image/ProductImages/${detail.productPartCd}`,
            ordcd: detail.ordcd,
            qty: detail.qty, 
            pricePerpc: detail.pricePerpc,
            netAmount: detail.netAmount,
            totalAmount: detail.totalAmount,
            remark: detail.remark,
            ordertype: detail.ordertype,
            description: detail.description,
            // size : detail.size,
            size: `${detail.prdlen}x${detail.prdwid}x${detail.prdheight}`,
            prdlen: detail.prdlen,
            prdwid: detail.prdwid,
            prdheight: detail.prdheight,
            prdunit: detail.prdunit,
            buyerpocd: detail.buyerpocd,
            cgst: detail.cgst,
            ordcd: detail.ordcd,
            discount: detail.discount,
            discntPercent: detail.discntPercent,
            prdnetWgt: detail.prdnetWgt,
            prdGrsWgt: detail.prdGrsWgt,
            amnt: detail.amnt,
            productPartCd: detail.productPartCd,
        })))
        // console.log("Order List-----:", orderList);
        setOrdercode(ordercode);
        setClientname(buyername);
        setBuyerpo(buyerpo);
        // setTemptabledata(reorder);
        setTemptabledata(saveorderdata);
        // console.log("savepidata-----:", saveorderdata);


        const allproduct = await fetch(`${url}/getAllProduct`, { headers: { Authorization: Token }, });
        const product = await allproduct.json();
        setAllproduct(product);
        const allpart = await fetch(`${url}/getAllParts`, { headers: { Authorization: Token }, });
        const part = await allpart.json();
        setAllparts(part);
      }
    } catch (error) {
      console.log("some error occured during search ");
    }
  };

  const From = [
    {
      options: [
         { label: "Select", value: "" },
        { label: "Product", value: "Product" },
        { label: "Part", value: "Part" },
        { label: "PI", value: "PI" },
        { label: "Re-order", value: "Reorder" },
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

  const Allpiname = [
    {
      options: [
        { label: "Select", value: "" }, // Blank option
        ...piname.map((item) => {
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

  const [temptabledata, setTemptabledata] = useState([]);
  const [error, seterror] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [tabledata, setTabledata] = useState([]);
  const [tableDataSlt, setTableDataSlt] = useState([ ]);

  const handleSelectAll = event => {
    const isChecked = event.target.checked;
    const newCheckedRows = isChecked ? tableDataSlt.map(row => row.rwid) : [];
    setCheckedRows(newCheckedRows);
    setSelectedItems(isChecked ? tableDataSlt.map(row => row.rwid) : []);
  };

  const handleCheckboxChange = (index, checked) => {
    let updatedSelectedItems = [...selectedItems];

    if (checked) {
      const isAlreadyAdded = addedItems.some((item) => item.rwid === index);
      if (isAlreadyAdded) {
        alert("This item has already been added.");
        return;
      }
      if (!updatedSelectedItems.includes(index)) {
        updatedSelectedItems.push(index);
      }
    } else {
      updatedSelectedItems = updatedSelectedItems.filter(
        (item) => item !== index
      );
    }

    setCheckedRows(prevCheckedRows => {
      if (prevCheckedRows.includes(index)) {
        return prevCheckedRows.filter(row => row !== index);
      } else {
        return [...prevCheckedRows, index];
      }
    });
    setSelectedItems(updatedSelectedItems);
  };
  
  


const handledelete = (rowIndex) => {
  setAddedItems((prevItems) => prevItems.filter((_, index) => index !== rowIndex));
};



  // Column
  const columns = useMemo(
    () => [
     
      {
        Header: (
          <input
            type="checkbox"
            className="form-check-input"
            checked={checkedRows.length === tabledata.length && tabledata.length > 0}
            onChange={handleSelectAll}
            style={{cursor:"pointer" }}
          
          />
        ),
        Cell: ({ row }) => {
          const checked = checkedRows.includes(row.original.rwid);
          return (
            <input
              type="checkbox"
              className="form-check-input"
              checked={checked}
              onChange={(event) => handleCheckboxChange(row.original.rwid, event.target.checked)}
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
        Header: "Product/Part Code",
        accessor: "productPartCd",
        filterable: false,
      },
      {
        Header: "Description",
        accessor: "description",
        filterable: false,
      },
      {
        Header: "Size",
        accessor: (item) =>
          `${item.prdlen}x${item.prdwid}x${item.prdheight} ${item.prdunit}`,
        filterable: false,
      },
      {
        Header: "Buyer Sku",
        accessor: "buyerpocd",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="text"
              value={row.original.buyerpocd}
              onChange={(e) => handleCellChange(e, row.original.rwid, "buyerpocd", e.target.value)}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Net wgt",
        accessor: "prdnetWgt",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.prdnetWgt}
              onChange={(e) => handleCellChange(e, row.original.rwid, "prdnetWgt", e.target.value)}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Grs wgt",
        accessor: "prdGrsWgt",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.prdGrsWgt}
              onChange={(e) => handleCellChange(e, row.original.rwid, "prdGrsWgt", e.target.value)}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Qty",
        accessor: "qty",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.qty}
              onInput={(e) => (e.target.value = e.target.value.slice(0, 10).replace(/\D/g, ""))}
              onChange={(e) => handleCellChange(e, row.original.rwid, "qty", e.target.value)}
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Price",
        accessor: "pricePerpc",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.pricePerpc}
              onChange={(e) => handleCellChange(e, row.original.rwid, "pricePerpc", e.target.value)}
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
                handleCellChange(e, row.original.rwid, "discntPercent", e.target.value)
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
              onChange={(e) =>
                handleCellChange(e, row.original.rwid, "discount", e.target.value)
              }
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
      {
        Header: "Net Amount",
        accessor: "netAmount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.netAmount}
              disabled
            />
          );
        },
      },
      {
        Header: "GST (%)",
        accessor: "cgst",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.cgst}
              onChange={(e) =>
                handleCellChange(e, row.original.rwid, "cgst", e.target.value)
              }
              disabled={!checkedRows.includes(row.original.rwid)}
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
              disabled
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
              onChange={(e) =>
                handleCellChange(e, row.original.rwid, "Remark", e.target.value)
              }
              disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
    ],
    [checkedRows, addedItems, tableDataSlt]
  );

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
        Header: "Product/Part Code",
        accessor: "productPartCd",
        filterable: false,
      },
      {
        Header: "Description",
        accessor: "description",
        filterable: false,
      },
      {
        Header: "Size",
        accessor: (item) =>
          `${item.prdlen}x${item.prdwid}x${item.prdheight} ${item.prdunit}`,
        filterable: false,
      },
      {
        Header: "Buyer Sku",
        accessor: "buyerpocd",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="text"
              value={row.original.buyerpocd}
              onChange={(e) => handleBuyerSkuChange(e, row.original.rwid, e.target.value)}
              // disabled={!checkedRows.includes(row.original.rwid)}
            />
          );
        },
      },
     
      // {
      //   Header: "Stock",
      //   accessor: "stockqty",
      //   filterable: false,
      // },
      // {
      //   Header: "To Be Made",
      //   accessor: "tobeMadeqty",
      //   filterable: false,
      // },
      {
        Header: "Net wgt",
        accessor: "prdnetWgt",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.prdnetWgt}
              onChange={(e) => handleNetwgtChange(e, row.original.rwid, e.target.value)}
            />
          );
        },
      },
      {
        Header: "Grs wgt",
        accessor: "prdGrsWgt",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.prdGrsWgt}
              onChange={(e) => handleGrswgtChange(e, row.original.rwid, e.target.value)}
            />
          );
        },
      },
      {
        Header: "Qty",
        accessor: "qty",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.qty}
              onChange={(e) => handleQtyChange(e, row.original.rwid, e.target.value)}
            />
          );
        },
      },
      {
        Header: "Price",
        accessor: "pricePerpc",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.pricePerpc}
              onChange={(e) => handlePriceChange(e, row.original.rwid, e.target.value)}
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
              onChange={(e) => handleDiscntPercentChange(e, row.original.rwid, e.target.value)}
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
              onChange={(e) => handleDiscountChange(e, row.original.rwid, e.target.value)}
            />
          );
        },
      },
      {
        Header: "Net Amount",
        accessor: "netAmount",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.netAmount}
              disabled
            />
          );
        },
      },
      {
        Header: "GST (%)",
        accessor: "cgst",
        filterable: false,
        Cell: ({ row }) => {
          return (
            <Input
              style={{ width: "5rem" }}
              type="number"
              value={row.original.cgst}
              onChange={(e) => handleGSTChange(e, row.original.rwid, e.target.value)}
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
              disabled
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
              onChange={(e) => handleRemarkChange(e, row.original.rwid, e.target.value)}
            />
          );
        },
      },
      {
        Header: "Action",
        accessor: "actionId",
        filterable: false,
        Cell: ({ row }) => (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit" title="Delete">
              <i
                className="ri-delete-bin-5-fill fs-16"
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => handledelete(row.index)}
              ></i>
            </li>
          </ul>
        ),
      },
      
    ],
    []
    // [handledelete, addedItems]
    
  );

  // const updateAction = async (id) => {
  //   try {
  //     const response = await fetch(`${url}/updateOrder/${id}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: Token,
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch data');
  //     }
  //     const json = await response.json();
      
  //     const encodedData = encodeURIComponent(JSON.stringify(json));
  //     navigate(`/order-create?data=${encodedData}`);
  //   } catch (error) {
  //     console.error('Error updating action:', error);
  //     // Handle error (e.g., show a notification to the user)
  //   }
  // };


  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Order";

  const [showFirst, setShowFirst] = useState(true);

  const handleNext = () => {
    if (addedItems.length === 0) {
      alert("add product and part");
      return;
    }
    {
      setShowFirst(false);
    }
  };
  const handlePrevious = () => {
    setShowFirst(true);
  };



  useEffect(() => {
    const buyersearch = async () => {
      const response = await fetch(`${url}/getAllLedger`, {
        headers: { Authorization: Token },
      });
      const Buyer = await response.json();
      console.log("Buyerrrrr", Buyer);
      const buyerNames = Buyer.filter((item) => item.partytype === "Buyer").map(
       item =>({lednm:  item.lednm, ledcd: item.ledcd})
      );
      setBuyername(buyerNames);
      setBuyerdata(Buyer);
      setBuyerSearchCompleted(true);
    };
    buyersearch();
    fetchalldataproductandpart();
  }, []);

  const fetchImageUrls = async (rwids, imageUrlType) => {
    let urls = {};
    for (const item of rwids) {
      try {
        const imageUrlResponse = await fetch(
          `${url}/image/${imageUrlType}/${item}`
        );
        const imageUrlBlob = await imageUrlResponse.blob();
        const imageUrl = URL.createObjectURL(imageUrlBlob);
        // Update the urls object with the new URL
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

      const allparts = await Part.json();
      const part = allparts.filter((item) => item.dis != "YES");

      const Allproduct = await Product.json();
      const products = Allproduct.filter((item) => item.dis != "YES");

      setAllproduct(products);
      setAllparts(part);
      setAllProductFetched(true);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const location = useLocation();
  //useLocation
  useEffect(() => {
    if (buyerSearchCompleted) {
      const queryParams = new URLSearchParams(location.search);
      const encodedData = queryParams.get("data");
      if (encodedData == null) {
      } else {

        const orderdata = JSON.parse(encodedData);
        Setdata(orderdata);
        setAddressdetails(orderdata);
        console.log(orderdata)
        setFromvalue({ label: '', value: '' })
        setBuyernameoption({ label: orderdata.buyername, value: orderdata.buyername })
        setAddressnameoption({ label: orderdata.addressname, value: orderdata.addressname })

        setAddlessdata(orderdata.orderDiscount);
        setSelectedFiles(orderdata.orderDocuments);
        setAddressName([orderdata.addressname]);

        const productcd = orderdata.orderDetails.filter((item) => item.productPartCd.startsWith("PRD")).map((item) => item.productPartCd);
        const partcd = orderdata.orderDetails.filter((item) => item.productPartCd.startsWith("PART")).map((item) => item.productPartCd);

        // for image updata time
        const matchingProductRwids = allproduct.filter((product) => productcd.includes(product.prdcd)).map((matchingProduct) => matchingProduct.rwid);
        const matchingpartrwids = allparts.filter((part) => partcd.includes(part.partCode)).map((matchingpart) => matchingpart.id);
        fetchImageUrls(matchingProductRwids, "ProductImage");
        fetchImageUrls(matchingpartrwids, "PartImage");

        const combinedRwids = [...matchingProductRwids, ...matchingpartrwids];
        orderdata.orderDetails.forEach((item, index) => { item.rwid = combinedRwids[index] || ""; });

        const orderDetailsWithImage = orderdata.orderDetails.map((order) => ({
          ...order,
          image: order.productPartCd.startsWith("PRD")
            ? `${url}/image/ProductImage/${order.rwid}`
            : `${url}/image/PartImage/${order.rwid}`,
        }));

console.log("orderDetailsWithImage.....................");
console.log(orderDetailsWithImage);
 

        setAddedItems(orderDetailsWithImage);
        // setAddedItems(orderdata.orderDetails);
        console.log("orderDetailsWithImage")
        console.log(orderDetailsWithImage);
        // console.log("orderdata ghghhorderDetails")
        // console.log(orderdata.orderDetails);

      }
    }
  }, [location.search, buyerSearchCompleted, allProductFetched]);

  const [productfilter, setproductfilter] = useState(true);
  const [partfilter, setPartfilter] = useState(false);
  const [reoderfilter, setReorderfilter] = useState(false);
  const [pifilter, setPifilter] = useState(false);

  const [data, Setdata] = useState({
    addressname: "",
    from: "Product",
    buyername: "",
    buyercode: "",
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
    salesPersonNm: "",
    addamt: "",
  });
console.log("datahlwwwww",data);

  const [addressdetails, setAddressdetails] = useState({
    billContactperson: "",
    billAddress: "",
    billAddress2: "",
    billState: "",
    billCity: "",
    billPin_No: "",
    billContactno: "",
    billMobNo: "",
    billEmail: "",
    billGst: "",
    billPan: "",

    shippContactperson: "",
    shippAddress: "",
    shippAddress2: "",
    shippState: "",
    shippCity: "",
    shippPin_No: "",
    shippContactNo: "",
    shippMobNo: "",
    shippEmail: "",
    finaldest: "",
    originofgds: "",

    banknm: "",
    branchnm: "",
    accountno: "",
    ifsccode: "",
    swiftcode: "",
    bankddress: "",
  });

  const handlebilladdresschange = (e) => {
    const { name, value } = e.target;
    setAddressdetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlefilterchange1 = (e) => {
    const { name, value } = e.target;
    if (name === "advanceamt") {
      if (data.grandtotal < value) {
        toast.error("Advance Amount Can not be Greater Than Grant total Amount", { autoClose: 1000, position: 'top-center' })
        Setdata((prevData) => ({ ...prevData, [name]: 0, }));
        return
      } else {
        Setdata((prevData) => ({ ...prevData, [name]: value, }));
      }
    } else {
      Setdata((prevData) => ({ ...prevData, [name]: value, }));
    }
  };

  const handlefilterchange = (e, name) => {
    if (e.value == "Product") {
      setproductfilter(true);
      setPartfilter(false);
      setPifilter(false)
      setReorderfilter(false);
      fetchData(e.value);
      setTabledata([]);
    } else if (e.value == "Part") {
      setproductfilter(false);
      setPartfilter(true);
      setPifilter(false)
      setReorderfilter(false);
      fetchData(e.value);
      setTabledata([]);
    } else if (e.value == "PI") {
      setproductfilter(false);
      setPartfilter(false);
      setPifilter(true)
      setReorderfilter(false);
      fetchData(e.value);
      setTabledata([]);
    }else if (e.value == "Reorder") {
      setproductfilter(false);
      setPartfilter(false);
      setPifilter(false)
      setReorderfilter(true);
      fetchData(e.value);
      setTabledata([]);
    }

    if (name == "buyername") {
      let buyernmae = e.value;
      const Buyerdata = buyerdata.flat().filter((buyer) => buyer.ledcd === buyernmae);

      if (Buyerdata.length > 0) {
        const addressesname = Buyerdata.flatMap((buyer) => buyer.buyerDetail.map((detail) => detail.addressname)
        );
        const alldetailsofbuyer = Buyerdata.flatMap((buyer) =>
          buyer.buyerDetail.map((detail) => detail)
        );
        setAlldetailsofbuyer(alldetailsofbuyer);
        setAddressName(addressesname);
        console.log("addressesname")
        console.log(addressesname)
        setAddressdetails({
          billContactperson: "",
          billAddress: "",
          billAddress2: "",
          billState: "",
          billCity: "",
          billPin_No: "",
          billContactno: "",
          billMobNo: "",
          billEmail: "",
          billGst: "",
          billPan: "",

          shippContactperson: "",
          shippAddress: "",
          shippAddress2: "",
          shippState: "",
          shippCity: "",
          shippPin_No: "",
          shippContactNo: "",
          shippMobNo: "",
          shippEmail: "",
          finaldest: "",
          originofgds: "",

          banknm: "",
          branchnm: "",
          accountno: "",
          ifsccode: "",
          swiftcode: "",
          bankddress: "",
        });
      } else {
        console.log("Buyer not found!");
      }
    }
    if (name == "addressname") {
      const targetvalue = e.value;
      const addressdetail = alldetailsofbuyer.filter((item) => item.addressname == targetvalue);
      if (addressdetail.length > 0) {
        const matchedDetail = addressdetail[0];
        setAddressdetails({
          billContactperson: matchedDetail.billContactperson,
          billAddress: matchedDetail.billAddress1,
          billAddress2: matchedDetail.billAddress2,
          billState: matchedDetail.billState,
          billCity: matchedDetail.billCity,
          billPin_No: matchedDetail.billPin_No,
          billContactno: matchedDetail.billContactno,
          billMobNo: matchedDetail.billMobNo,
          billEmail: matchedDetail.billEmail,
          billGst: matchedDetail.billGst,
          billPan: matchedDetail.billPan,

          shippContactperson: matchedDetail.shippContactperson,
          shippAddress: matchedDetail.shippAddress1,
          shippAddress2: matchedDetail.shippAddress2,
          shippState: matchedDetail.shippState,
          shippCity: matchedDetail.shippCity,
          shippPin_No: matchedDetail.shippPin_No,
          shippContactNo: matchedDetail.shippContactNo,
          shippMobNo: matchedDetail.shippMobNo,
          shippEmail: matchedDetail.shippEmail,
          finaldest: matchedDetail.finaldest,
          originofgds: matchedDetail.originofgds,

          banknm: matchedDetail.banknm,
          branchnm: matchedDetail.branchnm,
          accountno: matchedDetail.accountno,
          ifsccode: matchedDetail.ifsccode,
          swiftcode: matchedDetail.swiftcode,
          bankddress: matchedDetail.bankddress,
        });
      }
    }
  };

  // add less data

  const [disablefieldPercent, setDisablefieldPercent] = useState(false);
  const [disablefieldamount, setDisablefieldamount] = useState(false);

  const [addlessData, setAddlessdata] = useState([
    {
      addless: "",
      discountName: "",
      discountAmount: 0,
      discountPercent: 0,
      addlesson: "",
      percentAmount: 0,
      disablefieldPercent: false,
      disablefieldamount: false,
    },
  ]);

  const addcontent = () => {
    setAddlessdata((prevData) => [
      ...prevData,
      {
        addless: "",
        discountName: "",
        discountAmount: 0,
        discountPercent: 0,
        addlesson: "",
        percentAmount: 0,
        disablefieldPercent: false,
        disablefieldamount: false,
      },
    ]);
  };

  const handledeleteAddless = (index) => {
    const newArray = [...addlessData];
    newArray.splice(index, 1);
    setAddlessdata(newArray);
  };

  const handleaddlessupdate = (index, e) => {
    const updatedPartInputs = [...addlessData];
    updatedPartInputs[index].addless = e.value;

    setAddlessdata(updatedPartInputs);
  };

  const multihandlefilterchange = (e, i) => {
    const { name, value } = e.target;
    const inputdata = [...addlessData];
    inputdata[i][name] = value;
    setAddlessdata(inputdata);

    if (inputdata[i].discountPercent == 0 && inputdata[i].discountAmount == 0) {
      inputdata[i].percentAmount = 0;
      inputdata[i].disablefieldPercent = false;
      inputdata[i].disablefieldamount = false;
    }
    if (inputdata[i].discountPercent > 0) {
      const percentvalue = inputdata[i].discountPercent;
      const totalamount = data.totalamount;
      const prcntamt = (totalamount * percentvalue) / 100 || 0;

      inputdata[i].percentAmount = prcntamt;
      inputdata[i].disablefieldPercent = false;
      inputdata[i].disablefieldamount = true;
    }
    if (inputdata[i].discountAmount > 0) {
      inputdata[i].discountPercent = 0;
      inputdata[i].percentAmount = 0;
      inputdata[i].disablefieldPercent = true;
      inputdata[i].disablefieldamount = false;
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log(addlessData);
    const add = addlessData.filter((item) => item.addless === "Add");
    const less = addlessData.filter((item) => item.addless === "Less");

    const sumforaddmount = add.reduce((total, item) => total + (item.discountAmount === 0 ? item.percentAmount : item.discountAmount), 0);
    const sumfordiscount = less.reduce((total, item) => total + (item.discountAmount === 0 ? item.percentAmount : item.discountAmount), 0);
    const grandtotalamt = sumforaddmount - sumfordiscount || 0;

    const sumfordiscountRounded = Number(sumfordiscount).toFixed(2);
    const sumforaddmountRounded = Number(sumforaddmount).toFixed(2);

    Setdata((prevData) => {
      const roundedGrandTotal = (prevData.totalamount + grandtotalamt).toFixed(2);
      return {
        ...prevData,
        discount: sumfordiscountRounded,
        addamt: sumforaddmountRounded,
        grandtotal: roundedGrandTotal,
      };
    });
    setModalProject(false);
  };

  // for multiple documents
  const [dialogmultidocument, setDialogmultidocument] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handlemultidocumentopen = () => {
    setDialogmultidocument(true);
  };

  const handlemulidocumentclose = () => {
    setDialogmultidocument(false);
  };

  const handleFileChange = (event) => {
    const filesArray = Array.from(event.target.files);
    setSelectedFiles((prevFile) => [...prevFile, ...filesArray]);
  };

  const handleUpload = () => {
    console.log(selectedFiles);
    setOpen(false);
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // table data according to from filter

  const [dropdownfilter, setDropdownfilter] = useState([
    {
      productcode: "",
      productCategory: "",
      productAlias: "",
      productdesc: "",
      partcode: "",
      partname: "",
      ordercode: "",
      clientname: "",
      buyerpo: "",
      piname:"",
    },
  ]);

  const productmappedData = (data) => {
    return data.map((product) => ({
      rwid: product.rwid,
      image: `${url}/image/ProductImage/${product.rwid}`,
      productPartCd: product.prdcd,
      description: product.prdnm,
      size: `${product.prdlen}x${product.prdwid}x${product.prdheight}`,
      prdlen: product.prdlen,
      prdwid: product.prdwid,
      prdheight: product.prdheight,
      prdunit: product.prdunit,
      finish: product.prdfinish,
      buyerpocd: "",
      qty: "",
      prdnetWgt:"",
      amnt :"",
      prdGrsWgt:"",
      discntPercent:"",
      stockqty: "",
      tobeMadeqty: "",
      currency: "RS",
      pricePerpc: "",
      netAmount: "",
      buyerpocd:"",
      cgst: "",
      totalAmount: "",
      remark: "",
    }));
  };

  const partmappedData = (data) => {
    return data.map((item) => ({
      rwid: item.id,
      productPartCd: item.partCode,
      image: `${url}/image/PartImage/${item.id}`,
      description: item.partName,
      size: `${item.length}x${item.width}x${item.height}`,
      prdlen: item.length,
      prdwid: item.width,
      prdheight: item.height,
      prdunit: item.unit,
      finish: "",
      buyerpocd: "",
      qty: "",
      prdnetWgt:"",
      amnt :"",
      prdGrsWgt:"",
      discntPercent:"",
      stockqty: "",
      tobeMadeqty: "",
      currency: "RS",
      pricePerpc: "",
      netAmount: "",
      buyerpocd:"",
      cgst: "",
      totalAmount: "",
      remark: "",
    }));
  };

  const reordermappedData = (data, rwids) => {
    return data.map((detail) => ({
      rwid: detail.rwid,
      image: `${url}/image/PartImage/${detail.rwid}` || `${url}/image/ProductImage/${detail.rwid}`,
      productPartCd: detail.productPartCd,
      description: detail.description,
      // size: detail.size,
      size: `${detail.prdlen}x${detail.prdwid}x${detail.prdheight}`,
      prdlen: detail.prdlen,
      prdwid: detail.prdwid,
      prdheight: detail.prdheight,
      prdunit: detail.prdunit,
      finish: "",
      buyerpocd: "",
      qty: "",
      prdnetWgt:"",
      amnt :"",
      prdGrsWgt:"",
      discntPercent:"",
      stockqty: "",
      tobeMadeqty: "",
      currency: "RS",
      pricePerpc: "",
      netAmount: "",
      // buyerpocd:"",
      cgst: "",
      totalAmount: "",
      remark: "",
    }));
  };

  const pimappedData = (data, rwids) => {
    return data.map((detail) => ({
      rwid: detail.rwid,
      picd1: picd,
      productPartCd: detail.productPartCd,
      description: detail.description,
      discntPercent: detail.discntPercent,
      remark: detail.remark,
      buyerpocd: detail.buyerpocd,
      image:"" ,
      buyerpocd: detail.prdalias,
      prdalias: "",
      categorynm: "",
      // prdcd: "",
      prdname: "",
      size: detail.size,
      prdlen: "",
      prdwid: "",
      prdheight: "",
      prdunit: "",
      qty: detail.prdqty,
      prdqty: detail.prdqty,
      pricePerpc: detail.price,
      remark:'',
      // price: "",
      netAmount: "",
      prdnetWgt: "",
      amnt: detail.amnt,
      prdGrsWgt: "",
      discount: "",
      cgst: "",
      sgst: "",
      igst: "",
      totalamount: "",
      totalcbm: "",
      cbmperpcs: "",
    }));
  };
  

  const [allproduct, setAllproduct] = useState([]);
  const [allparts, setAllparts] = useState([]);
  const [allproductpartrwid, setAllproductpartrwid] = useState([]);

  const masterSearch = async (e) => {
    e.preventDefault();

    if (data.from === "Product") {
      if (
        (dropdownfilter.productcode === "" || typeof dropdownfilter.productcode === "undefined") &&
        (dropdownfilter.productCategory === "" || typeof dropdownfilter.productCategory === "undefined") &&
        (dropdownfilter.productAlias === "" || typeof dropdownfilter.productAlias === "undefined") &&
        (dropdownfilter.productdesc === "" || typeof dropdownfilter.productdesc === "undefined")
      ) {
        let mappedData;
        mappedData = Array.isArray(temptabledata) ? productmappedData(temptabledata) : [];
        setTabledata(mappedData);
        setTableDataSlt(mappedData)
        console.log(tabledata);
        console.log("mappedDataaaaaaaaaaaaa")
        console.log(mappedData)

      } else {
        const filteredData = temptabledata.filter((item) => {
          const prdcd = dropdownfilter.productcode ? item.prdcd.toLowerCase() === dropdownfilter.productcode.toLowerCase() : true;
          const categoryMatch = dropdownfilter.productCategory ? item.categorynm.toLowerCase().includes(dropdownfilter.productCategory.toLowerCase()) : true;
          const aliasMatch = dropdownfilter.productAlias ? item.prdalias.toLowerCase().includes(dropdownfilter.productAlias.toLowerCase()) : true;
          const prdnmMatch = dropdownfilter.productdesc ? item.prdnm.toLowerCase().includes(dropdownfilter.productdesc.toLowerCase()) : true;
          return prdcd && categoryMatch && aliasMatch && prdnmMatch;
        });
        console.log("filteredDataproduct")
        console.log(filteredData)
       
        let mappedData;
        mappedData = Array.isArray(filteredData) ? productmappedData(filteredData) : [];
        setTabledata(mappedData);
        setTableDataSlt(mappedData)
        console.log(tabledata);
      }
    } else if (data.from === "Part") {
      if (
        (dropdownfilter.partcode === "" || typeof dropdownfilter.partcode === "undefined") &&
        (dropdownfilter.partname === "" || typeof dropdownfilter.partname === "undefined")) {
        let mappedData; mappedData = Array.isArray(temptabledata) ? partmappedData(temptabledata) : [];

        setTabledata(mappedData);
        setTableDataSlt(mappedData)
      } else {
        
        const filteredData = temptabledata.filter((item) => {
          const partcodeMatch = dropdownfilter.partcode ? item.partCode.toLowerCase() === dropdownfilter.partcode.toLowerCase() : true;
          const partnameMatch = dropdownfilter.partname ? item.partName.toLowerCase().includes(dropdownfilter.partname.toLowerCase()) : true;
          return partcodeMatch && partnameMatch;

        });
        let mappedData;
        mappedData = Array.isArray(filteredData) ? partmappedData(filteredData) : [];
        setTabledata(mappedData);
        setTableDataSlt(mappedData)
      }
    }else if (data.from === "PI") {
      if (
        (dropdownfilter.productcode === "" || typeof dropdownfilter.productcode === "undefined") &&
        (dropdownfilter.piname === "" || typeof dropdownfilter.piname === "undefined") 
       
      ) {
        const pidetail=temptabledata.flat().map((item)=>item.performaInvoiceDetails)
        
        let mappedData;
        mappedData = Array.isArray(pidetail[0]) ? pimappedData(pidetail[0]) : [];
        setTabledata(mappedData);
        setTableDataSlt(mappedData)
       console.log("mappedDatanfnfbbgb---",mappedData);
        alert("select At least one value From Dropdown");
        setTabledata([]);
        console.log("first")
    return;

      } else {

        console.log("Second");
        console.log("temptabledata------->", temptabledata);

        const filteredData = temptabledata.filter((item) => {
          // console.log("picd1---",item);
          // console.log("piname---",item.rwid );
          const prdcd = dropdownfilter.productcode ? item.productPartCd.toLowerCase() === dropdownfilter.productcode.toLowerCase() : true;
          const picd1 = dropdownfilter.piname ? item.picd1.toLowerCase().includes(dropdownfilter.piname.toLowerCase()) : true;
          return prdcd && picd1 ;
        
        });
        console.log("temptabledataaaaaa", temptabledata );
        console.log("filteredDataaaaa", filteredData );
        const pidetail = filteredData.map((item) => item);
        console.log("pidetail scond", pidetail);
      
        //  let mappedData; mappedData = Array.isArray(pidetail[0]) ? reordermappedData(pidetail[0]) : [];
        setTabledata(pidetail);
        setTableDataSlt(pidetail)
        // console.log("filteredData---------->",filteredData)
        // let mappedData;
        // mappedData = Array.isArray(filteredData) ? pimappedData(filteredData) : [];
        // setTabledata(mappedData);
        // console.log("mappedData2----->", mappedData);
      }
    }
    else if (data.from === "Reorder") {
      if (
        (dropdownfilter.ordercode === "" || typeof dropdownfilter.ordercode === "undefined") &&
        (dropdownfilter.clientname === "" || typeof dropdownfilter.clientname === "undefined") &&
        (dropdownfilter.buyerpo === "" || typeof dropdownfilter.buyerpo === "undefined")
      ) {
        const orderdetail=temptabledata.flat().map((item)=>item.orderDetails)
  
        let mappedData;
        mappedData = Array.isArray(orderdetail[0]) ? reordermappedData(orderdetail[0]) : [];
        setTabledata(mappedData);
        setTableDataSlt(mappedData)
        console.log("mappedDatanfnfbbgb677---",mappedData);
        alert("select At least one value From Dropdown");
        setTabledata([]);
        console.log("first")

        return;
      } else {
        console.log("Second");

        const filteredData = temptabledata.filter((item) => {
          const ordercodematch = dropdownfilter.ordercode ? item.ordcd.toLowerCase().includes(dropdownfilter.ordercode.toLowerCase()) : true;
          const clientnamematch = dropdownfilter.clientname ? item.buyername.toLowerCase().includes(dropdownfilter.clientname.toLowerCase()) : true;
          const buyerpomatch = dropdownfilter.buyerpo ? item?.buyerpocd?.toLowerCase()?.includes(dropdownfilter.buyerpo.toLowerCase()) : true;
          return ordercodematch && clientnamematch && buyerpomatch;
        });
 
        console.log("temptabledata");
        console.log(temptabledata);
        const orderdetail = filteredData.map((item) => item);
        console.log("orderdetail");
        console.log(orderdetail);
        //  let mappedData; mappedData = Array.isArray(orderdetail[0]) ? reordermappedData(orderdetail[0]) : [];
        setTabledata(orderdetail);
        setTableDataSlt(orderdetail)
        // const getprdorpart = orderdetail[0].map((item) => item.productPartCd);
        // const productcd = getprdorpart.filter((item) => item.startsWith("PRD"));
        // const partcd = getprdorpart.filter((item) => item.startsWith("PART"));

        //  for image
        // const matchingProductRwids = allproduct.filter((product) => productcd.includes(product.prdcd)).map((matchingProduct) => matchingProduct.rwid);
        // const matchingpartrwids = allparts.filter((part) => partcd.includes(part.partCode)).map((matchingpart) => matchingpart.id);

        let urls = 'sysyrhh';
        // for (const item of matchingProductRwids) {
        //   const imageUrlResponse = await fetch(`${url}/image/ProductImage/${item}`);
        //   const imageUrlBlob = await imageUrlResponse.blob();
        //   const imageUrl = URL.createObjectURL(imageUrlBlob);
        //   urls[item] = imageUrl;
        // }
        setImageUrls(urls);

        // for (const item of matchingpartrwids) {
        //   const imageUrlResponse = await fetch(`${url}/image/PartImage/${item}`);
        //   const imageUrlBlob = await imageUrlResponse.blob();
        //   const imageUrl = URL.createObjectURL(imageUrlBlob);
        //   urls[item] = imageUrl;
        // }
        setImageUrls(urls);

        // const combinedRwids = [...matchingProductRwids, ...matchingpartrwids];
        // orderdetail[0].forEach((item, index) => { item.rwid = combinedRwids[index] || ""; });
        // let mappedData; mappedData = Array.isArray(orderdetail[0]) ? reordermappedData(orderdetail[0]) : [];
        // setTabledata(mappedData);
      }
    }
  };

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
      const totalqty12 = newAddedItems.reduce(
        (total, item) => Number(total) + Number(item.qty),
        0
      );
      const totalamt = newAddedItems.reduce(
        (total, item) => Number(total) + Number(item.totalAmount),
        0
      );

      console.log("newAddedItems");
      console.log(newAddedItems);

      let missingData = false;
      let qty = 0;
      let pricePerpc = 0;
      newAddedItems.forEach((item) => {
        if (item.qty === "") {
          qty++;
          missingData = true;
        } else if (item.pricePerpc === "") {
          pricePerpc++;
          missingData = true;
        }
      });
      if (qty > 0) {
        toast.error("Enter Quantity", { autoClose: 500 });
      }

      if (pricePerpc > 0) {
        toast.error("Enter Price", { autoClose: 500 });
      }

      if (!missingData) {
        Setdata((prevData) => ({
          ...prevData,
          totalqty: Number(prevData.totalqty) + Number(totalqty12),
          totalamount: Number(prevData.totalamount) + Number(totalamt),
          grandtotal:
            Number(prevData.totalamount) +
            Number(totalamt + prevData.addamt) -
            Number(prevData.discount),
        }));

        setAddedItems((prevAddedItems) => [
          ...prevAddedItems,
          ...newAddedItems,
        ]);
        setSelectedItems([]);
        setCheckedRows([]);
      }
      console.log(newAddedItems);
    }
  };


  ////////////////////////////////////////Addcolumns handlers////////////////////////
  const handleQtyChange = (event, rowId, qty) => {
    event.preventDefault();
  
    setAddedItems((prevData) =>
      prevData.map((row) => {
        if (row.rwid === rowId) {
          let newRow = { ...row, qty: parseFloat(qty) || 0 };
  
          // Calculate netAmount
          let pricePerpc = newRow.pricePerpc || 0;
          let discount = newRow.discount || 0;
          let netAmount = newRow.qty * pricePerpc - discount;
          newRow.netAmount = netAmount < 0 ? 0 : netAmount;
  
          // Update totalAmount considering cgst
          let withgst = (netAmount * (newRow.cgst || 0)) / 100;
          newRow.totalAmount = netAmount + withgst;
          newRow.amnt = newRow.qty * newRow.pricePerpc || 0;
          return newRow;
        } else {
          return row;
        }
      })
    );
  };
  
  const handlePriceChange = (event, rowId, value) => {
    event.preventDefault();
  
    setAddedItems((prevData) =>
      prevData.map((row) => {
        if (row.rwid === rowId) {
          let newRow = { ...row, pricePerpc: value };
  
          // Recalculate other fields dependent on price
          newRow.amnt = newRow.qty * (newRow.pricePerpc || "");
          newRow.netAmount = newRow.qty * (newRow.pricePerpc || "");
          let totalamt = newRow.netAmount - (newRow.discount || "");
          let withgst = (totalamt * (newRow.cgst || "")) / 100;
          newRow.totalAmount = totalamt + withgst || 0;
  
          return newRow;
        } else {
          return row;
        }
      })
    );
  };
  const handleBuyerSkuChange = (event, rowId, buyerpocd) => {
    event.preventDefault();
  
    setAddedItems((prevData) =>
      prevData.map((row) => {
        if (row.rwid === rowId) {
          let newRow = { ...row, buyerpocd: (buyerpocd) };
          return newRow;
        } else {
          return row;
        }
      })
    );
  };
  
  const handleNetwgtChange = (event, rowId, prdnetWgt ) =>{
    event.preventDefault();

    setAddedItems((prevData)=>
    prevData.map((row)=>{
      if (row.rwid === rowId) {
        let newRow = {...row, prdnetWgt: parseInt(prdnetWgt) || 0}
        return newRow;
      } else {
        return row
      }
    })
  );
};
  
const handleGrswgtChange = (event, rowId, prdGrsWgt ) =>{
  event.preventDefault();

  setAddedItems((prevData)=>
  prevData.map((row)=>{
    if (row.rwid === rowId) {
      let newRow = {...row, prdGrsWgt: parseInt(prdGrsWgt) || 0}
      return newRow;
    } else {
      return row
    }
  })
);
};

const handleDiscntPercentChange = (event, rowId, discntPercent) => {
  event.preventDefault();

  setAddedItems((prevData) =>
    prevData.map((row) => {
      if (row.rwid === rowId) {
        let newRow = { ...row, discntPercent: parseFloat(discntPercent) || 0 };

        // Calculate discount amount based on the percentage
        let qty = newRow.qty || 0;
        let pricePerpc = newRow.pricePerpc || 0;
        let discount = (qty * pricePerpc * newRow.discntPercent) / 100;
        newRow.discount = discount;
        // Calculate netAmount based on the discount
        let netAmount = qty * pricePerpc - discount;
        newRow.netAmount = netAmount < 0 ? 0 : netAmount;

        // Recalculate totalAmount  considering cgst
        let withGst = (netAmount * (newRow.cgst || 0)) / 100;
        newRow.totalAmount = netAmount + withGst;

        // Check if discount amount is greater than net amount
        if (discount > netAmount) {
          newRow.totalAmount = 0;
          newRow.discount = 0;
          toast.error("Discount Amount cannot be greater than the total amount", {
            autoClose: 2000,
            position: "top-center",
          });
        }

        return newRow;
      } else {
        return row;
      }
    })
  );
};



const handleDiscountChange = (event, rowId, discount) => {
  event.preventDefault();

  setAddedItems((prevData) =>
    prevData.map((row) => {
      if (row.rwid === rowId) {
        let newRow = { ...row, discount: parseInt(discount) || 0 };

        // Calculate netAmount
        let qty = newRow.qty || 0;
        let pricePerpc = newRow.pricePerpc || 0;
        let netAmount = qty * pricePerpc - newRow.discount;
        newRow.netAmount = netAmount < 0 ? 0 : netAmount;

        // Calculate totalAmount
        let withGst = (netAmount * (newRow.cgst || 0)) / 100;
        newRow.totalAmount = netAmount + withGst;

        // Check if discount amount is greater than net amount
        if (newRow.discount > netAmount) {
          newRow.totalAmount = 0;
          newRow.discount = 0;
          toast.error("Discount Amount cannot be greater than the total amount", {
            autoClose: 2000,
            position: 'top-center'
          });
        }

        return newRow;
      } else {
        return row;
      }
    })
  );
};


const handleGSTChange = (event, rowId, cgst) => {
  event.preventDefault();

  setAddedItems((prevData) =>
    prevData.map((row) => {
      if (row.rwid === rowId) {
        // Update cgst value
        let newRow = { ...row, cgst: parseInt(cgst) || 0 };

        // Calculate total amount with new cgst
        let totalamt = newRow.netAmount - (newRow.discount || 0);
        let withGst = (totalamt * newRow.cgst) / 100;
        newRow.totalAmount = totalamt + withGst;

        return newRow;
      } else {
        return row;
      }
    })
  );
};

const handleRemarkChange = (event, rowId, remark) => {
  event.preventDefault();

  setAddedItems((prevData) =>
      prevData.map((row) => {
          if (row.rwid === rowId) {
            let newRow = { ...row, remark:( remark) };
              return newRow;
          } else {
              return row;
          }
      })
  );
};




  const handleCellChange = (event, rowId, field, value) => {
    event.preventDefault();

    console.log("tabledata")
    console.log(tabledata)

    setTabledata((prevData) =>
      prevData.map((row) => {
        if (row.rwid === rowId) {
          let newRow = { ...row, [field]: value };

          if (
            field === "qty" ||
            field === "tobeMadeqty" ||
            field === "pricePerpc" ||
            field === "discount" ||
            field === "discntPercent"
          ) {
            newRow.tobeMadeqty = newRow.qty;
            newRow.amnt = newRow.qty * (newRow.pricePerpc || "");

            newRow.netAmount = newRow.qty * (newRow.pricePerpc || "");

            if (newRow.netAmount === 0) {
              newRow.totalAmount = 0;
            } else {
              let totalamt = newRow.netAmount - (newRow.discount || 0);
              let withgst = (totalamt * (newRow.cgst || "")) / 100;
              newRow.totalAmount = totalamt + withgst || 0;
            }
          }
          
          {
          let qty = newRow.qty || 0;
          let pricePerpc = newRow.pricePerpc || 0;
          let discount = (qty * pricePerpc * newRow.discntPercent) / 100 ;
          
          if (field === "discntPercent") {
            // Calculate discount in rupees based on percentage
            discount = (qty * pricePerpc * newRow.discntPercent ) / 100;
            newRow.discount = discount;
          }

          let netAmount = qty * pricePerpc - discount;
          newRow.netAmount = netAmount < 0 ? 0 : netAmount;

          // Update totalAmount considering cgst
          let withgst = (netAmount * (newRow.cgst || 0)) / 100;
          newRow.totalAmount = netAmount + withgst;
        }

          

        if (field == "discount") {
            let netamt = newRow.netAmount || 0;

            if (netamt === 0) {
              newRow.totalAmount = 0;
            } else {

              if (newRow.netAmount < newRow.discount) {
                newRow.totalAmount = 0;
                newRow.discount = 0;
                toast.error("Discount Amount can not be greater than amount", { autoClose: 2000, position: 'top-center' })
              }

              let totalamt = newRow.netAmount - newRow.discount;
              let withgst = (totalamt * (newRow.cgst || "0")) / 100;
              newRow.totalAmount = totalamt + withgst;

              // newRow.netAmount = totalamt; 
            }
          }

          
          if (field === "cgst") {
            let netamt = newRow.netAmount || 0;
            if (netamt === 0) {
              newRow.totalAmount = 0;
            } else {
              let totalamt = newRow.netAmount - (newRow.discount || 0);
              let withgst = (totalamt * newRow.cgst) / 100;
              newRow.totalAmount = totalamt + withgst;
            }
          }
          if (field === "Remark") {
            newRow.remark = value;

          }
          if (field === "Buyerpo") {
            newRow.buyerpocd = value;

          }

          return newRow;
        } else {
          return row;
        }
      })
    );
  };

  const dataforsave = {
    addressname: data.addressname,
    from: data.from,
    buyername: data.buyername,
    buyercode:data.buyercode,
    buyerPo: data.buyerPo,
    buyerpodate: data.buyerpodate,
    dispatchdate: data.dispatchdate,
    paymenterm: data.paymenterm,
    totalamount: data.totalamount,
    discount: data.discount,
    grandtotal: data.grandtotal,
    advanceamt: data.advanceamt,
    totalqty: data.totalqty,
    orderComment: data.orderComment,
    salesPersonNm: data.salesPersonNm,
    addamt: data.addamt,

    billContactperson: addressdetails.billContactperson,
    billAddress: addressdetails.billAddress,
    billAddress2: addressdetails.billAddress2,
    billState: addressdetails.billState,
    billCity: addressdetails.billCity,
    billPin_No: addressdetails.billPin_No,
    billContactno: addressdetails.billContactno,
    billMobNo: addressdetails.billMobNo,
    billEmail: addressdetails.billEmail,
    billGst: addressdetails.billGst,
    billPan: addressdetails.billPan,

    shippContactperson: addressdetails.shippContactperson,
    shippAddress: addressdetails.shippAddress,
    shippAddress2: addressdetails.shippAddress2,
    shippState: addressdetails.shippState,
    shippCity: addressdetails.shippCity,
    shippPin_No: addressdetails.shippPin_No,
    shippContactNo: addressdetails.shippContactNo,
    shippMobNo: addressdetails.shippMobNo,
    shippEmail: addressdetails.shippEmail,
    finaldest: addressdetails.finaldest,
    originofgds: addressdetails.originofgds,

    banknm: addressdetails.banknm,
    branchnm: addressdetails.branchnm,
    accountno: addressdetails.accountno,
    ifsccode: addressdetails.ifsccode,
    swiftcode: addressdetails.swiftcode,
    bankddress: addressdetails.bankddress,
    orderDetails: addedItems,
    performaInvoiceDetails: addedItems,
    orderDiscount: addlessData,
  };

  const dataforupdate = {
    rwid: data.rwid,
    addressname: data.addressname,
    from: data.from,
    buyername: data.buyername,
    buyercode: data.buyercode,
    buyerPo: data.buyerPo,
    buyerpodate: data.buyerpodate,
    dispatchdate: data.dispatchdate,
    paymenterm: data.paymenterm,
    totalamount: data.totalamount,
    discount: data.discount,
    grandtotal: data.grandtotal,
    advanceamt: data.advanceamt,
    totalqty: data.totalqty,
    orderComment: data.orderComment,
    salesPersonNm: data.salesPersonNm,
    addamt: data.addamt,

    billContactperson: addressdetails.billContactperson,
    billAddress: addressdetails.billAddress,
    billAddress2: addressdetails.billAddress2,
    billState: addressdetails.billState,
    billCity: addressdetails.billCity,
    billPin_No: addressdetails.billPin_No,
    billContactno: addressdetails.billContactno,
    billMobNo: addressdetails.billMobNo,
    billEmail: addressdetails.billEmail,
    billGst: addressdetails.billGst,
    billPan: addressdetails.billPan,

    shippContactperson: addressdetails.shippContactperson,
    shippAddress: addressdetails.shippAddress,
    shippAddress2: addressdetails.shippAddress2,
    shippState: addressdetails.shippState,
    shippCity: addressdetails.shippCity,
    shippPin_No: addressdetails.shippPin_No,
    shippContactNo: addressdetails.shippContactNo,
    shippMobNo: addressdetails.shippMobNo,
    shippEmail: addressdetails.shippEmail,
    finaldest: addressdetails.finaldest,
    originofgds: addressdetails.originofgds,

    banknm: addressdetails.banknm,
    branchnm: addressdetails.branchnm,
    accountno: addressdetails.accountno,
    ifsccode: addressdetails.ifsccode,
    swiftcode: addressdetails.swiftcode,
    bankddress: addressdetails.bankddress,
    orderDetails: addedItems,
    performaInvoiceDetails: addedItems,
    orderDiscount: addlessData,
  };
  const history = useNavigate();

  const handleSubmitOrder = () => {
    if (addedItems.length === 0) {
      alert("Please add items ");
      return
    } else if (
      data.buyername === "" || data.buyername === null || data.buyername === undefined) {
      alert("select Buyer Name");
      return
    } else if (data.buyerpodate === "" || data.buyerpodate === null || data.buyerpodate === undefined) {
      alert("select Buyer Po Date");
      return
    } else if (data.dispatchdate === "" || data.dispatchdate === null || data.dispatchdate === undefined) {
      alert("select Dispatch Date");
      return
    } else if (data.buyerPo === "" || data.buyerPo === null || data.buyerPo === undefined) {
      alert("Enter Buyer PO");
      return
    } else if (data.addressname === "" || data.addressname === null || data.addressname === undefined) {
      alert("select Address ");
      return
    } else {
      if (data.rwid == null) {

        dataforsave.orderDetails.map((item) => {
          delete item.rwid;
        });

        const jsondata = JSON.stringify(dataforsave);
        console.log(jsondata);
        fetch(`${url}/addOrder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
          body: jsondata,
        })
          .then((response) => response.json())
          .then((data) => {
            toast.success("Order Create Successfully : \n" + data.ordcd, {
              autoClose: 800,
              onClose: () => { history("/order-search"); },
            });
            savemulitpleImages(data.rwid);

          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        dataforupdate.orderDetails.map((item) => {
          delete item.rwid;
        });
        const jsondata = JSON.stringify(dataforupdate);
        console.log(jsondata);
        fetch(`${url}/updateOrder/${data.rwid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
          body: jsondata,
        })
          .then((response) => response.json())
          .then((data) => {


            toast.success("Order Update Successfully :\n" + data.ordcd, {
              autoClose: 800,
              onClose: () => { history("/order-search"); },
            });

            savemulitpleImages(data.rwid);
            //   window.history.replaceState(null, "", "/order-create");

          })
          .catch((error) => {
            console.log('')
          });
      }

      Setdata({
        addressname: "",
        from: "Product",
        buyername: "",
        buyercode:"",
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
        salesPersonNm: "",
        addamt: "",
      });
      setAddressdetails({
        billContactperson: "",
        billAddress: "",
        billAddress2: "",
        billState: "",
        billCity: "",
        billPin_No: "",
        billContactno: "",
        billMobNo: "",
        billEmail: "",
        billGst: "",
        billPan: "",

        shippContactperson: "",
        shippAddress: "",
        shippAddress2: "",
        shippState: "",
        shippCity: "",
        shippPin_No: "",
        shippContactNo: "",
        shippMobNo: "",
        shippEmail: "",
        finaldest: "",
        originofgds: "",

        banknm: "",
        branchnm: "",
        accountno: "",
        ifsccode: "",
        swiftcode: "",
        bankddress: "",
      });
      setAddedItems([]);
      setAddlessdata([
        {
          addless: "",
          discountName: "",
          discountAmount: 0,
          discountPercent: 0,
          addlesson: "",
          percentAmount: 0,
        },
      ]);
    }
  };

  // for document save

  const savemulitpleImages = async (rwid) => {
    const emptyImageData = new Blob([], { type: "image/png" });
    const emptyImageFile = new File([emptyImageData], "empty.jpg", { type: "image/png", });
    const formData = new FormData();
    if (selectedFiles == null) {
      formData.append("images", emptyImageFile);
    } else {
      selectedFiles.forEach((image, index) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(`${url}/Multipledocumentupload/${rwid}`, {
      method: "POST",
      headers: {
        Authorization: Token,
      },
      body: formData,
    });

    if (response.ok) {
      console.log("documents save successfully");
    } else {
      console.log("some Error occured during save document");
    }
  };

  return (
    <div className="page-content" style={{ overflow: "hidden" }}>
      <Container fluid>
        <BreadCrumb  pageName="Order Create" orderSearch="Order Detail" subTitle="Order Create" />
        {showFirst ? (
          <>
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
                                Setdata({ ...data, from: e.value });
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
                              <Label className="form-label" htmlFor="Category">
                                Product Code
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={prdcodevalue}
                                  onChange={(e) => {
                                    setPrdcodevalue(e);
                                    setDropdownfilter({ ...dropdownfilter, productcode: e.value, });
                                  }}
                                  options={Allproductcode}
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
                                Product Category
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={prdcatvalue}
                                  onChange={(e) => {
                                    setPrdcatvalue(e);
                                    setDropdownfilter({ ...dropdownfilter, productCategory: e.value, });
                                  }}
                                  options={Allproductcategory}
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
                                Product Alias
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={prdaliasvalue}
                                  onChange={(e) => {
                                    setPrdaliasvalue(e);
                                    setDropdownfilter({
                                      ...dropdownfilter,
                                      productAlias: e.value,
                                    });
                                  }}
                                  options={Allproductalias}
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
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
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {partfilter && (
                        <>
                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
                                Part Code
                              </Label>

                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={partcodevalue}
                                  onChange={(e) => {
                                    setPartcodevalue(e);
                                    setDropdownfilter({ ...dropdownfilter, partcode: e.value, });
                                  }}
                                  options={Allpartcode}
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
                                Part Name
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={partnamevalue}
                                  onChange={(e) => {
                                    setPartnamevalue(e);
                                    setDropdownfilter({ ...dropdownfilter, partname: e.value, });
                                  }}
                                  options={Allpartname}
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    {pifilter && (
                        <>
                           <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
                                Product Code
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={prdcodevalue}
                                  onChange={(e) => {
                                    setPrdcodevalue(e);
                                    setDropdownfilter({ ...dropdownfilter, productcode: e.value, });
                                  }}
                                  options={Allproductcode}
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="piname">
                              PI-No
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={pinamevalue}
                                  onChange={(e) => {
                                    setPinamevalue(e);
                                    setDropdownfilter({ ...dropdownfilter, piname: e.value, });
                                  }}
                                  options={Allpiname}
                                  id="PI"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {reoderfilter && (
                        <>
                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
                                Order Code
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={ordercodevalue}
                                  onChange={(e) => {
                                    setOrdercodevalue(e);
                                    setDropdownfilter({ ...dropdownfilter, ordercode: e.value, });
                                  }}
                                  options={Allordercode}
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
                                Buyer Name
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={clientnamevalue}
                                  onChange={(e) => {
                                    setClientnamevalue(e);
                                    setDropdownfilter({ ...dropdownfilter, clientname: e.value, });
                                  }}
                                  options={Allclientname}
                                  id="Category"
                                  className="js-example-basic-single mb-0"
                                  name="from"
                                />
                              </div>
                            </div>
                          </div>


                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="Category">
                                Buyer Po.
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={buyerpovalue}
                                  onChange={(e) => {
                                    setBuyerpovalue(e);
                                    setDropdownfilter({ ...dropdownfilter, buyerpo: e.value, });
                                  }}
                                  options={Allbuyerpo}
                                  id="Category"
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
                      {tabledata.length > 0 ? (
                        <TableContainer
                          columns={columns}
                          data={tabledata || []}
                          customPageSize={10000}
                          divClass="table-responsive table-card mb-1"
                          tableClass="align-middle table-nowrap"
                          theadClass="table-light text-muted"
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
                      {orderList.length < 1 ? (
                        <TableContainer
                          columns={Addcolumns}
                          data={addedItems || []}
                          customPageSize={10000}
                          divClass="table-responsive table-card mb-1"
                          tableClass="align-middle table-nowrap"
                          // theadClass="table-light text-muted "
                        />
                      
                      ) : (
                        <Loader error={error} />
                      )}
                     
                    </div>

                    <div
                      style={{ display: "flex", justifyContent: "end" }}
                      className="mt-4"
                    >
                      <Button
                        className="btn btn-success mb-4"
                        onClick={handleNext}
                        size="sm"
                      >
                        Next
                      </Button>
                    </div>


                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Col lg={12}>
                <Card id="orderList">
                  <CardHeader className="border-0">
                    <Row>
                      <div className="mt-4">
                        <Row>
                          <div className="col-md-2">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Buyer-Name"
                              >
                                Buyer Name
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={buyernameoption}
                                  onChange={(e) => {
                                    setBuyernameoption(e);
                                    handlefilterchange(e, "buyername");
                                    Setdata({ ...data, buyername: e.label , buyercode: e.value});

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
                              <Label className="form-label" htmlFor="Buyer Po">
                                Buyer Po
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="Buyer Po"
                                placeholder="Enter Buyer Po"
                                name="buyerPo"
                                value={data.buyerPo}
                                onChange={handlefilterchange1}
                              />
                            </div>
                          </div>

                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Buyer-Order-Date"
                              >
                                Buyer PO Date
                              </Label>
                              <Input
                                type="date"
                                className="form-control"
                                id="Buyer-Order-Date "
                                name="buyerpodate"
                                value={dateFormat(data.buyerpodate)}
                                onChange={handlefilterchange1}
                              />
                            </div>
                          </div>

                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Delevary-Date"
                              >
                                Dispatch Date
                              </Label>
                              <Input
                                type="date"
                                className="form-control"
                                id="Delevary Date"
                                placeholder="Enter Dispatchdate Date"
                                name="dispatchdate"
                                value={dateFormat(data.dispatchdate)}
                                onChange={handlefilterchange1}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Payment Term"
                              >
                                Payment Term
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="Payment Term"
                                placeholder="Enter Payment Term "
                                name="paymenterm"
                                value={data.paymenterm}
                                onChange={handlefilterchange1}
                              />
                            </div>
                          </div>


                          <div
                            className="col-md-2 "
                            style={{ marginTop: "1.8rem" }}
                          >
                            <Button
                              className="btn btn-success "
                              onClick={() => setModalProject(true)}
                            >
                              Discount
                            </Button>
                          </div>

                          <div
                            className="col-md-2 "
                            style={{ marginTop: "1.8rem" }}
                          >
                            <Button
                              className="btn btn-success "
                              onClick={() => setModalDoc(true)}
                            >
                              Upload Doc
                            </Button>
                          </div>

                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Total Amount"
                              >
                                Total Qty
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="Total Amount"
                                placeholder="Enter Total Amount"
                                name="totalqty"
                                value={data.totalqty}
                              />
                            </div>
                          </div>

                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Total Amount"
                              >
                                Total Amount
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="Total Amount"
                                placeholder="Enter Total Amount"
                                readOnly
                                name="totalamount"
                                value={data.totalamount}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Discount Amount"
                              >
                                Discount
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="Discount Amount"
                                placeholder="Enter Discount Amount"
                                readOnly
                                name="discount"
                                value={data.discount}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Add Amount"
                              >
                                Add Amount
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="Add Amount"
                                placeholder="Enter Add Amount"
                                name="addamt"
                                value={data.addamt}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Grand-Total"
                              >
                                Grand Total
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="Grant-Total"
                                placeholder="Enter Grand-Total"
                                name="grandtotal"
                                value={data.grandtotal}
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
                                name="advanceamt"
                                value={data.advanceamt}
                                onChange={handlefilterchange1}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="Order Comment"
                              >
                                Order Comment
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="Order Comment"
                                placeholder="Enter Order Comment"
                                name="orderComment"
                                value={data.orderComment}
                                onChange={handlefilterchange1}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 col-sm-4">
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="sales Person Name"
                              >
                               Sales Person Name
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="sales Person Name"
                                placeholder="Enter Sales Person Name"
                                name="salesPersonNm"
                                value={data.salesPersonNm}
                                onChange={handlefilterchange1}
                              />
                            </div>
                          </div>
                        </Row>

                        <hr></hr>

                        <Row className="justify-content-center align-items-center">
                          <div className="col-md-3 col-sm-4">
                            <Label
                              className="form-label"
                              htmlFor="Payment Term"
                            >
                              Address Name
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={addressnameoption}
                                onChange={(e) => {
                                  setAddressnameoption(e);
                                  handlefilterchange(e, "addressname");
                                  Setdata({ ...data, addressname: e.value });
                                }}
                                options={alladdressname}
                                id="shipment-Type"
                                className="js-example-basic-single mb-0"
                                name="shipment Type"
                              />
                            </div>
                          </div>
                        </Row>

                        <Row>
                          <Col className="row mt-4 " sm={12}>
                            <Col lg={4}>
                              <div className="mb-3">
                                <Label className="form-label" htmlFor="Name">
                                  Contact Person
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Name"
                                  placeholder="Enter Name"
                                  name="billContactperson"
                                  value={addressdetails.billContactperson}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Address1"
                                >
                                  Address 1
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Address1"
                                  placeholder="Enter Address 1"
                                  name="billAddress"
                                  value={addressdetails.billAddress}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Address2"
                                >
                                  Address 2
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Address2"
                                  placeholder="Enter Address 2"
                                  name="billAddress2"
                                  value={addressdetails.billAddress2}
                                  onChange={handlebilladdresschange}
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
                                  name="billState"
                                  value={addressdetails.billState}
                                  onChange={handlebilladdresschange}
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
                                  name="billCity"
                                  value={addressdetails.billCity}
                                  onChange={handlebilladdresschange}
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
                                  name="billPin_No"
                                  value={addressdetails.billPin_No}
                                  onChange={handlebilladdresschange}
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
                                  name="billContactno"
                                  value={addressdetails.billContactno}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Mobile-Number"
                                >
                                  Mobile Number
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Mobile"
                                  placeholder="Enter 10-digit Mobile Number"
                                  name="billMobNo"
                                  value={addressdetails.billMobNo}
                                  onChange={handlebilladdresschange}
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
                                  htmlFor="Mobile-Number"
                                >
                                  Email
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Email"
                                  placeholder="Enter Email"
                                  name="billEmail"
                                  value={addressdetails.billEmail}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label className="form-label" htmlFor="GST">
                                  GST
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="GST"
                                  placeholder="Enter GST"
                                  name="billGst"
                                  value={addressdetails.billGst}
                                  onChange={handlebilladdresschange}
                                  maxLength={15}
                                  onInput={(e) =>
                                  (e.target.value = e.target.value.replace(
                                    /[^A-Za-z0-9@.]/g,
                                    ""
                                  ))
                                  }
                                />
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="mb-3">
                                <Label className="form-label" htmlFor="Name">
                                  Contact Person
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Name"
                                  placeholder="Enter Name"
                                  name="shippContactperson"
                                  value={addressdetails.shippContactperson}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Address1"
                                >
                                  Address 1
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Address1"
                                  placeholder="Enter Address 1"
                                  name="shippAddress"
                                  value={addressdetails.shippAddress}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Address2"
                                >
                                  Address 2
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Address2"
                                  placeholder="Enter Address 2"
                                  name="shippAddress2"
                                  value={addressdetails.shippAddress2}
                                  onChange={handlebilladdresschange}
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
                                  name="shippState"
                                  value={addressdetails.shippState}
                                  onChange={handlebilladdresschange}
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
                                  name="shippCity"
                                  value={addressdetails.shippCity}
                                  onChange={handlebilladdresschange}
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
                                  name="shippPin_No"
                                  value={addressdetails.shippPin_No}
                                  onChange={handlebilladdresschange}
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
                                  name="shippContactNo"
                                  value={addressdetails.shippContactNo}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Mobile-Number"
                                >
                                  Mobile Number
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Mobile"
                                  placeholder="Enter 10-digit Mobile Number"
                                  name="shippMobNo"
                                  value={addressdetails.shippMobNo}
                                  onChange={handlebilladdresschange}
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
                                  htmlFor="Mobile-Number"
                                >
                                  Email
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Email"
                                  placeholder="Enter Email"
                                  name="shippEmail"
                                  value={addressdetails.shippEmail}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
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
                                  name="finaldest"
                                  value={addressdetails.finaldest}
                                  onChange={handlebilladdresschange}
                                />
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Bank-Name"
                                >
                                  Bank Name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Bank-Name"
                                  placeholder="Enter Bank Name"
                                  name="banknm"
                                  value={addressdetails.banknm}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Branch-Name"
                                >
                                  Branch Name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Branch-Name"
                                  placeholder="Enter Branch Name"
                                  name="branchnm"
                                  value={addressdetails.branchnm}
                                  onChange={handlebilladdresschange}
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
                                  name="accountno"
                                  value={addressdetails.accountno}
                                  onChange={handlebilladdresschange}
                                />
                              </div>
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="IFCS-Code"
                                >
                                  IFSC Code
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="IFCS-Code"
                                  placeholder="Enter IFCS Code"
                                  name="ifsccode"
                                  value={addressdetails.ifsccode}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Swift-Code"
                                >
                                  Swift Code
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Swift-Code"
                                  placeholder="Enter Swift Code"
                                  name="swiftcode"
                                  value={addressdetails.swiftcode}
                                  onChange={handlebilladdresschange}
                                />
                              </div>

                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="Swift-Code"
                                >
                                  Bank Address
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="Swift-Code"
                                  placeholder="Enter Swift Code"
                                  name="bankddress"
                                  value={addressdetails.bankddress}
                                  onChange={handlebilladdresschange}
                                />
                              </div>
                            </Col>
                          </Col>
                        </Row>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "end" }}
                        className="mt-4"
                      >
                        <Button
                          className="btn btn-success mb-4"
                          onClick={handlePrevious}
                          size="sm"
                        >
                          Previous
                        </Button>
                        <div style={{ width: "10px" }}></div>
                        <Button
                          className="btn btn-success mb-4"
                          size="sm"
                          onClick={handleSubmitOrder}
                        >
                          Save
                        </Button>
                      </div>
                    </Row>
                  </CardHeader>

                </Card>
              </Col>
            </Row>
          </>
        )}
        <ToastContainer closeButton={false} limit={1} />
      </Container>

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
          className="p-3 bg-success-subtle"
        >
          Add/Less
        </ModalHeader>
        <ModalBody>
          {addlessData.map((val, i) => (
            <>
              <Row>
                <div className="col-md-2">
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="Category">
                      Add/Less
                    </Label>
                    <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                      <Select
                        value={{ label: val.addless, value: val.addless }}
                        onChange={(e) => {
                          handleaddlessupdate(i, e);
                        }}
                        options={addless}
                        id="Category"
                        className="js-example-basic-single mb-0"
                        name="from"
                      />
                    </div>
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
                      name="discountName"
                      value={val.discountName}
                      onChange={(e) => multihandlefilterchange(e, i)}
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
                      name="discountPercent"
                      value={val.discountPercent || ""}
                      onChange={(e) => multihandlefilterchange(e, i)}
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
                      name="percentAmount"
                      value={val.percentAmount}
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
                      disabled={val.disablefieldamount}
                      name="discountAmount"
                      value={val.discountAmount || ""}
                      onChange={(e) => multihandlefilterchange(e, i)}
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
                      name="discountAmount"
                      value={val.discountAmount || ""}
                      onChange={(e) => multihandlefilterchange(e, i)}
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
            <Button type="submit" color="success" onClick={handleClose}>
              Add
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        size="lg"
        backdrop={"static"}
        isOpen={modalDoc}
        toggle={() => setModalDoc(!modalDoc)}
        modalClassName="zoomIn"
        centered
      >
        <ModalHeader
          toggle={() => setModalDoc(!modalDoc)}
          className="p-3 bg-success-subtle"
        >
          Document
        </ModalHeader>
        <ModalBody>
          <ul className="list-group">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {file.name}
                <div className="btn-group">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteFile(index)}

                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      try {
                        const downloadLink = document.createElement("a");
                        const downloadUrl = URL.createObjectURL(file);
                        downloadLink.href = downloadUrl;
                        downloadLink.download = file.name;
                        downloadLink.click();
                        URL.revokeObjectURL(downloadUrl);
                      } catch (error) {
                        console.error("Error creating object URL:", error);
                        const fallbackDownloadUrl = `${url}/image/${file.docPath}`;
                        window.location.href = fallbackDownloadUrl;
                      }
                    }}
                  >
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="file-upload mt-4">
            <Button className="btn btn-success ">
              <label htmlFor="fileInput" className="custom-file-upload">
                <i className="ri-chat-upload-fill"></i> File Upload
              </label>
            </Button>
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.png,.jpg,.jpeg"
              style={{ display: "none" }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <Button
              color="light"
              onClick={() => {
                setModalDoc(false);
              }}
              size="sm"
            >
              Close
            </Button>
            <Button type="submit" color="success" size="sm" onClick={() => { setModalDoc(false); }}>
              Save
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Ordercreate;
