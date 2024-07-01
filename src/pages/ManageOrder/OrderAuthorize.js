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

const OrderAuthorize = () => {
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;
  const [ordercode, setOrdercode] = useState('');
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
        Header: "Order Code",
        accessor: "ordcd",
        filterable: false,
      },
      {
        Header: "Buyer Name",
        accessor: "buyername",
        filterable: false,
      },
      {
        Header: "Qty",
        accessor: (item) => {
          const sum = item.orderDetails.reduce(
            (acc, data) => acc + data.qty,
            0
          );
          return sum;
        },
        filterable: false,
      },
      {
        Header: "Dispatch Date",
        accessor: "dispatchdate",
        filterable: false,
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1
            }/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        Header: " Create Date",
        accessor: "createdt",
        filterable: false,
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1
            }/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        Header: " Auth Date",
        accessor: "autherizedate",
        filterable: false,
        Cell: ({ value }) => {
          if (value) {
            const date = new Date(value);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1
              }/${date.getFullYear()}`;
            return formattedDate;
          } else {
            return "";
          }
        },
      },

      {
        Header: "Status",
        accessor: "autherizestatus",
        filterable: false,
      },

      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Authorize">
                {row.row.original.autherizestatus != "Pending" ? (
                  <i
                    className="ri-lock-line fs-16"
                    onClick={() =>
                      handleStatus(
                        row.row.original.rwid,
                        row.row.original.autherizestatus
                      )
                    }
                    style={{ color: "green" }}
                  ></i>
                ) : (
                  <i
                    className="ri-lock-line fs-16"
                    title="UnAuthorize"
                    onClick={() =>
                      handleStatus(
                        row.row.original.rwid,
                        row.row.original.autherizestatus
                      )
                    }
                    style={{ color: "red" }}
                  ></i>
                )}
              </li>
            </ul>
          );
        },
      },
    ],
    [ordercode]
  );

  const [error, seterror] = useState(false);
  const [data, setData] = useState([]);

  const [tabledata, settabledata] = useState([]);
  const [temptabledata, setTemptabledata] = useState([]);
  const [orderno, setOrderno] = useState([]);

  const OrderNumber = [
    {
      options: [
        { label: "", value: "" },
        ...orderno.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Order";

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/getAllOrder", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const dataset = await response.json();
      const orderno = dataset.map((item) => item.ordcd);

      setTemptabledata(dataset);
      setOrderno(orderno);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [dropdownvalue, setDropdownvalue] = useState({ ordcd: "" });
  const masterSearch = (e) => {

    e.preventDefault();

    if (!dropdownvalue || !dropdownvalue.ordcd || dropdownvalue.ordcd === "") {
      setData(temptabledata);
    } else {
      const filteredData = temptabledata.filter((item) => {
        const ordcdCodeMatch = dropdownvalue.ordcd ? item.ordcd.toLowerCase().includes(dropdownvalue.ordcd.toLowerCase()) : true;
        return ordcdCodeMatch;
      });
      setData(filteredData);
    }
  };


  const masterSearch12 = async (ordcd) => {


    const response = await fetch(url + "/getAllOrder", {
      headers: { Authorization: Token },
    });
    const dataset = await response.json();

    if (!dropdownvalue || !dropdownvalue.ordcd || dropdownvalue.ordcd === "") {
      setData(dataset);
    } else {
      const filteredData = dataset.filter((item) => {
        const ordcdCodeMatch = ordcd ? item.ordcd.toLowerCase().includes(ordcd.toLowerCase()) : true;
        return ordcdCodeMatch;
      });
      setData(filteredData);
    }
  };


  // handle continue and discontinue status

  const handleStatus = async (id, auth) => {

    let msg = "";
    if (auth == "Pending") {
      auth = "Authorized";
      msg = "Authorized";
    } else {
      auth = "Pending";
      msg = "UnAuthorized";
    }

    const response = await fetch(`${url}/getOneOrder/${id}`, {
      method: "GET",
      headers: { Authorization: Token },
    });
    const json = await response.json();
    const updateJson = {
      ...json,
      autherizestatus: auth,
      unautherizeby: "rahul",
      autherizedate: new Date().toISOString(),
    };

    console.log("dis Data ");
    console.log(updateJson);

    fetch(`${url}/updateOrder/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: Token },
      body: JSON.stringify(updateJson),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Order " + msg + " Successfully " + data.ordcd, { autoClose: 1000, });
        masterSearch12(json.ordcd);
      })
      .catch((error) => {
        toast.error("Order " + msg + " failed ", { autoClose: 1000 });
      });
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
          <BreadCrumb title="Order Authorize" pageTitle="Order" buttons={
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
                      <Row style={{ alignItems: "center" }}>
                        <div className="col-md-3 col-sm-4">
                          <Label className="form-label" htmlFor="Payment Term">
                            Order Code
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={ordercode}
                              onChange={(e) => {
                                setOrdercode(e);
                                setDropdownvalue({ ...dropdownvalue, ordcd: e.value, });

                              }}
                              options={OrderNumber}
                              id="shipment-Type"
                              className="js-example-basic-single mb-0"
                              name="shipment Type"
                            />
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-2 mt-4">
                          <Button
                            className="btn btn-success mt-1"
                            onClick={masterSearch}
                          >
                            Search
                            {/* <i class="ri-search-line search-icon"></i>  */}
                          </Button>
                        </div>
                      </Row>
                    </div>
                    {/* <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        
                      </div>
                    </div> */}
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {data.length ? (
                      <TableContainer
                        columns={columns}
                        data={data || []}
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
export default OrderAuthorize;
