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

const VendorAuthorize = () => {
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;
  const [vendorpocds, setVendorpocds] = useState([]);
  const [vendorNames, setVendorNames] = useState([]);

  const [tabledata, settabledata] = useState([]);
  // Column
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,
        filterable: false,
        sortType: (rowA, rowB) => rowB.value - rowA.value,
      },

      {
        Header: "Vendor Po Code",
        accessor: "vendorpocd",
        filterable: false,
      },
      {
        Header: "Name",
        accessor: "vendorName",
        filterable: false,
      },
      {
        Header: "Delivery Date",
        accessor: "deliverydate",
        filterable: false,
        Cell: ({ value }) => {
          if (!value) {
            return "";
          }
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1
            }/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        Header: "Po Qty",
        accessor: (item) => {
          const sum = item.vendorPoDetails.reduce(
            (acc, data) => acc + data.orderQty,
            0
          );
          return sum;
        },
        filterable: false,
      },
      {
        Header: "Auth Status",
        accessor: "autherizeStatus",
        filterable: false,
        Cell: row => (
          <span>
            {row.value === "Authorize" ? "Authorize" : row.row.original.cancelStatus === "YES" ? "Cancel" : "Pending"}
          </span>
        ),
      },

      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit"   >
                {row.row.original.autherizeStatus != "Authorize" && row.row.original.cancelStatus === "NO" && row.row.original.receiveStatus != "Pending" ? (
                  <i
                    className="ri-forbid-line fs-20 "
                    onClick={() => CancleAction(row.row.original.rwid, row.row.original.cancelStatus)}
                    style={{ color: "red" }}
                  ></i>
                ) : (
                  <i
                    className="ri-forbid-line fs-20 "
                    style={{ color: "red", filter: "blur(1px)" }}
                  ></i>
                )}
              </li>

              <li className="list-inline-item edit" >
                {row.row.original.autherizeStatus === "Authorize" ? (
                  <i
                    className="ri-lock-line fs-20 "
                    onClick={() =>
                      handleStatus(
                        row.row.original.rwid,
                        row.row.original.autherizeStatus
                      )
                    }
                    style={{ color: "green" }}
                  ></i>
                ) : (
                  <>
                    {row.row.original.cancelStatus === "NO" ? (
                      <i className="ri-lock-unlock-fill fs-20"
                        onClick={() => handleStatus(row.row.original.rwid, row.row.original.autherizeStatus)}
                        style={{ color: "red" }}
                      ></i>

                    ) : (
                      <i className="ri-lock-unlock-fill fs-20"
                        style={{ color: "red", filter: "blur(1px)" }}
                      ></i>
                    )} </>
                )}
              </li>
            </ul>
          );
        },
      },
    ],
    [vendorNames, vendorpocds]
  );
  {/* {row.original.autherizeStatus === "Authorize"  ? ( "" ) : ("")} */ }
  const [error, seterror] = useState(false);
  const [data, setData] = useState([]);
  const [ordercode, setOrdercode] = useState([]);

  const [temptabledata, setTemptabledata] = useState([]);
  const [vendorpocd, setVendorpocd] = useState([]);
  const [vendorName, setVendorName] = useState([]);

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

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Vendor";

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/VendorPo", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const dataset = await response.json();
      setTemptabledata(dataset);
      const vendopname = [...new Set(dataset.map((item) => item.vendorName))];
      const vendorpocd = dataset.map((item) => item.vendorpocd);
      setVendorName(vendopname);
      setVendorpocd(vendorpocd);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle search filtered
  const [dropdownvalue, setDropdownvalue] = useState({
    vendorName: "",
    vendorpocd: "",
  });

  const masterSearch = (e) => {
    e.preventDefault();

    if (
      (!dropdownvalue || !dropdownvalue.vendorName || dropdownvalue.vendorName === "") &&
      (!dropdownvalue || !dropdownvalue.vendorpocd || dropdownvalue.vendorpocd === "")
    ) {
      settabledata(temptabledata);
      console.log(temptabledata);
    } else {
      const filteredData = temptabledata.filter((item) => {
        const vendornameMatch = dropdownvalue.vendorName
          ? item.vendorName.toLowerCase().includes(dropdownvalue.vendorName.toLowerCase()) : true;
        const vendorpocodematch = dropdownvalue.vendorpocd ? item.vendorpocd.toLowerCase().includes(dropdownvalue.vendorpocd.toLowerCase()) : true;
        return vendornameMatch && vendorpocodematch;
      });
      settabledata(filteredData);
    }
  };

  // handle continue and discontinue status
  const masterSearch12 = async () => {
    const response = await fetch(url + "/VendorPo", {
      headers: { Authorization: Token },
    });
    const dataset = await response.json();
    console.log("Raw dataset:");
    console.log(dataset);

    if (
      (!dropdownvalue ||
        !dropdownvalue.vendorName ||
        dropdownvalue.vendorName === "") &&
      (!dropdownvalue ||
        !dropdownvalue.vendorpocd ||
        dropdownvalue.vendorpocd === "")
    ) {
      settabledata(dataset);
      console.log(dataset);
    } else {
      const filteredData = dataset.filter((item) => {
        const vendornameMatch = dropdownvalue.vendorName
          ? item.vendorName
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

      console.log("Filtered data:");
      console.log(filteredData);
      settabledata(filteredData);
    }
  };

  const handleStatus = async (id, auth) => {
    let msg = "";
    if (auth == "Pending") {
      auth = "Authorize";
      msg = "Authorized";
    } else {
      auth = "Pending";
      msg = "UnAuthorized";
    }

    const response = await fetch(`${url}/VendorPo/${id}`, {
      headers: { Authorization: Token },
    });
    const json = await response.json();
    const updateJson = {
      ...json,
      autherizeStatus: auth,
      autherizeStatus: auth,
      autherizeBy: "rahul",
      autherizedt: new Date().toISOString(),
    };
    try {
      await fetch(`${url}/VendorPo/Autherize`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
        body: JSON.stringify(updateJson),
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("Vendor " + msg + " Successfully", { autoClose: 1000 });
          masterSearch12();
        });
    } catch (error) {
      // Handle any errors that occur during the fetch operations
      console.error("Error:", error);
    }
  };

  const CancleAction = async (id, cancelstatus) => {
    let msg = "";
    if (cancelstatus == "NO") {
      cancelstatus = "YES";
      msg = "Cancle";
    } else {
      cancelstatus = "NO";
      msg = "Uncancle";
    }
    const response = await fetch(`${url}/VendorPo/${id}`, {
      headers: { Authorization: Token },
    });
    const json = await response.json();
    const updateJson = {
      ...json,
      cancelStatus: cancelstatus,
      cancelby: "rahul",
      canceldt: new Date().toISOString(),
    };

    try {
      fetch(`${url}/VendorPo/Autherize`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
        body: JSON.stringify(updateJson),
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("Vendor Po " + msg + " Successfully", { autoClose: 1000 });
          masterSearch12()
        });


    } catch (error) {
      console.error("Error:", error);
    }
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
          <BreadCrumb title="Vendor PO Authorize" pageTitle="Manage Vendor" buttons={
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
                            Vendor PO Code
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
                    {tabledata.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        data={tabledata || []}
                        isGlobalFilter={true}
                        isGlobalSearch={true}
                        customPageSize={1000000000}
                        className="custom-header-css"
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
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder="Search here..."
                      />
                    )}
                  </div>

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
export default VendorAuthorize;
