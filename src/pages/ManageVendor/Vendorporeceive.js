import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  Button,
} from "reactstrap";
import Select from "react-select";
import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainers";
import Token from "../Token/Base_Token";
import url from "../Base_url/Base_url";
// Formik
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Vendorporeceive = () => {
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;

  const [warehouseall, setWarehouseall] = useState([]);
  useEffect(() => {
    const warehouse = async () => {
      const response = await fetch(`${url}/Warehouse`, {
        headers: { Authorization: Token },
      });
      const warehouse = await response.json();
      const warehousename = warehouse.map((item) => item.name);
      setWarehouseall(warehousename);
    };
    warehouse();
  }, []);

  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);

  const handleCheckboxChange = (index, checked) => {
    let updatedSelectedItems = [...selectedItems];

    if (checked) {
      updatedSelectedItems.push(index);
      const matchedItems = temptabledata.filter((item) => item.rwid === index);
      setAddedItems((prevAddedItems) => [...prevAddedItems, ...matchedItems]);
    } else {
      updatedSelectedItems = updatedSelectedItems.filter(
        (item) => item !== index
      );
      setAddedItems((prevAddedItems) =>
        prevAddedItems.filter((item) => item.rwid !== index)
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

  // Column
  const columns = useMemo(
    () => [
      {
        Header: "Sel",
        accessor: "#",
        filterable: false,
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
        Header: "Vendor Po Code",
        accessor: "vendorpocd",
        filterable: false,
      },
      {
        Header: "Name",
        accessor: "vendorname",
        filterable: false,
      },
      {
        Header: "Buyer Po",
        accessor: "buyerpo",
        filterable: false,
      },

      {
        Header: "Product Code",
        accessor: "prdcd",
        filterable: false,
      },
      {
        Header: "Product Name",
        accessor: "productName",
        filterable: false,
      },
      {
        Header: "Part Code",
        accessor: "partcd",
        filterable: false,
      },
      {
        Header: "Part Name",
        accessor: "partName",
        filterable: false,
      },
      {
        Header: "Qr Code",
        accessor: "vendorpartQrcd",
        filterable: false,
      },

      {
        Header: "Qty",
        accessor: "qty",
        filterable: false,
      },
    ],
    [handleCheckboxChange]
  );

  const [error, seterror] = useState(false);
  const [data, setData] = useState([]);
  const [vendorpocd, setVendorpocd] = useState([]);
  const [vendorName, setVendorName] = useState([]);

  const [vendorpocds, setVendorpocds] = useState([]);
  const [vendorNames, setVendorNames] = useState([]);
  const [warehouseselect, setWarehouseselect] = useState([]);

  const AllVendorname = [
    {
      options: [
        { label: "", value: "" },
        ...vendorName.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const AllVendorcode = [
    {
      options: [
        { label: "", value: "" },
        ...vendorpocd.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const AllWarehouse = [
    {
      options: [
        { label: "", value: "" },
        ...warehouseall.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Vendor";

  // handle user get api

  const [tabledata, settabledata] = useState([]);
  const [temptabledata, setTemptabledata] = useState([]);
  const [orderno, setOrderno] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [Vendor] = await Promise.all([
        fetch(`${url}/VendorPo/Receive`, { headers: { Authorization: Token } }),
      ]);
      const vendor = await Vendor.json();
      const vendordetails = vendor.filter((item) => item.receiveStatus === "Pending" && item.authorizeStatus === "Authorize" && item.cancelStatus == "NO");

      settabledata(vendordetails);
      setTemptabledata(vendordetails);
      console.log("allNonReceivedVendor");
      console.log(vendor);
      const vendopname = [...new Set(vendor.map((item) => item.vendorname))];
      const vendorpocd = [...new Set(vendor.map((item) => item.vendorpocd))];
      setVendorName(vendopname);
      setVendorpocd(vendorpocd);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [dropdownvalue, setDropdownvalue] = useState({
    vendorName: "",
    vendorpocd: "",
  });

  const masterSearch = (e) => {
    e.preventDefault();

    if (
      (!dropdownvalue ||
        !dropdownvalue.vendorName ||
        dropdownvalue.vendorName === "") &&
      (!dropdownvalue ||
        !dropdownvalue.vendorpocd ||
        dropdownvalue.vendorpocd === "")
    ) {
      settabledata(temptabledata);
    } else {
      const filteredData = temptabledata.filter((item) => {
        const vendornameMatch = dropdownvalue.vendorName
          ? item.vendorname
            .toLowerCase()
            .includes(dropdownvalue.vendorName.toLowerCase())
          : true;
        const vendorpocodematch = dropdownvalue.vendorpocd
          ? item.vendorpocd
            .toLowerCase()
            .includes(dropdownvalue.vendorpocd.toLowerCase())
          : true;
        return vendornameMatch && vendorpocodematch;
      });
      settabledata(filteredData);
    }
  };

  const [warehousecd, setWarehousecd] = useState("");
  const handlesubmit = (e) => {
    e.preventDefault();

    const updatedItems = addedItems.map((item) => ({
      ...item,
      receiveQty: 1,
      receiveStatus: "Received",
      receivedBy: "Rahul",
      warehousecd: warehousecd,
    }));

    console.log("updateddata");
    console.log(JSON.stringify(updatedItems));

    if (addedItems.length === 0) {
      toast.error("select Item ", { autoClose: 1000, position: "top-center", });
      return;
    }
    if (warehousecd === "") {
      toast.error("Select Warehouse Name", { autoClose: 1000, position: "top-center", });
      return;
    }

    fetch(`${url}/VendorPo/Receive`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Token,
      },
      body: JSON.stringify(updatedItems),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Received");
        fetchData();
      })
      .catch((error) => { });
    setAddedItems([]);
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{overflow:"hidden"}}>
        <ExportCSVModal
          show={isExportCSV}
          data={data}
          onCloseClick={() => setIsExportCSV(false)}
        />

        <Container fluid>
          <BreadCrumb title="Vendor Po Receive" pageTitle="Manage Vendor" buttons={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
              <button
                className="btn btn-soft-success"
                onClick={() => setIsExportCSV(true)}
              >
                Excel
              </button>
            </div>
          } />
          <Row>

            <Col xxl={12}>
              <Card id="contactList">
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <Row>
                        <div className="col-md-3 col-sm-4">
                          <Label className="form-label" htmlFor="Vendorpo">
                            Vendor Po Code
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={vendorpocds}
                              onChange={(e) => {
                                setVendorpocds(e);
                                setDropdownvalue({
                                  ...dropdownvalue,
                                  vendorpocd: e.value,
                                });
                              }}
                              options={AllVendorcode}
                              id="VendorPo"
                              className="js-example-basic-single mb-0"
                              name="Vendor"
                            />
                          </div>
                        </div>

                        <div className="col-md-3 col-sm-4">
                          <Label className="form-label" htmlFor="VendorName">
                            Vendor Name
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={vendorNames}
                              onChange={(e) => {
                                setVendorNames(e);
                                setDropdownvalue({
                                  ...dropdownvalue,
                                  vendorName: e.value,
                                });
                              }}
                              options={AllVendorname}
                              id="VendorName"
                              className="js-example-basic-single mb-0"
                              name="VendorName"
                            />
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-2 mt-4">
                          <Button
                            className="btn btn-success"
                            onClick={masterSearch}
                          >
                            Search
                            {/* <i class="ri-search-line search-icon"></i>  */}
                          </Button>
                        </div>
                      </Row>
                    </div>

                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {data.length < 1 ? (
                      <TableContainer
                        columns={columns}
                        data={tabledata || []}
                        isGlobalFilter={true}
                        isGlobalSearch={true}
                        customPageSize={1000000000}
                        className="custom-header-css "
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder="Search here..."
                      />
                    ) : (
                      <TableContainer
                        columns={columns}
                        data={[]}
                        isGlobalFilter={true}
                        isGlobalSearch={true}
                        customPageSize={1000000000}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3 "
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder="Search here..."
                      />
                    )}
                  </div>
                  <Row>
                    <div className="col-md-3 col-sm-4 mt-4">
                      <Label className="form-label" htmlFor="VendorName">
                        Warehouse
                      </Label>
                      <Select
                        value={warehouseselect}
                        onChange={(e) => {
                          setWarehouseselect(e);
                          setWarehousecd(e.value);
                        }}
                        options={AllWarehouse}
                        id="VendorName"
                        className="js-example-basic-single mb-0"
                        name="VendorName"
                      />
                    </div>
                  </Row>

                  <Row>
                    <div className="col-md-2 col-sm-2 mt-4">
                      <Button
                        className="btn btn-success"
                        onClick={handlesubmit}
                      >
                        {" "}
                        Submit
                      </Button>
                    </div>
                  </Row>

                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Vendorporeceive;
