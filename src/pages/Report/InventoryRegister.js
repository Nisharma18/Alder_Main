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
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainers";
import Token from "../Token/Base_Token";
import url from "../Base_url/Base_url";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryRegister = () => {

  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;

  const [modelopen, setModelopen] = React.useState(false);
  const [dateWiseData, setDateWiseData] = useState([]);

  const Datewisemodelopen = (Partcode, warehousename) => {
    setModelopen(true);

    const filteredData = datewisetempdata.filter((item) => {
      return item.partcd === Partcode && item.warehousecd === warehousename;
    });
    filteredData.sort((a, b) => new Date(a.inoutDate) - new Date(b.inoutDate));
    setDateWiseData(filteredData);
  };

  const Modalclose = () => {
    setModelopen(false);
  };



  const Column = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,
        filterable: false,
        sortType: (rowA, rowB) => rowB.value - rowA.value,
      },
      {
        Header: "Part Code",
        accessor: "partcd",
        filterable: false,
      },
      {
        Header: " Part Name",
        accessor: "partName",
        filterable: false,
      },
      {
        Header: "Part Barcode",
        accessor: "partbarcd",
        filterable: false,
      },
      {
        Header: "Warehouse Name",
        accessor: "warehousecd",
        filterable: false,
      },
      {
        Header: "Issue Qty ",
        accessor: "qty",
        filterable: false,
      },
      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <i
                  class="ri-store-line"
                  onClick={() => Datewisemodelopen(row.row.original.partcd, row.row.original.warehousecd)}
                ></i>
              </li>
            </ul>
          );
        },
      },
    ],
    [Datewisemodelopen]
  );

  const dateWiseDataColumn = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "inoutDate",
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
        Header: "Part Code",
        accessor: "partcd",
        filterable: false,
      },
      {
        Header: " Part Name",
        accessor: "partName",
        filterable: false,
      },
      {
        Header: "Warehouse Name",
        accessor: "warehousecd",
        filterable: false,
      },

      {
        Header: "Part Barcode",
        accessor: "partbarcd",
        filterable: false,
      },
      {
        Header: "Receive Qty ",
        accessor: "qty",
        filterable: false,
      },
    ],
    []
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Inventory Register";

  // handle user get api

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const [tabledata, settabledata] = useState([]);
  const [temptabledata, setTemptabledata] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [Stockdata] = await Promise.all([
        fetch(`${url}/Stocks`, {
          headers: { Authorization: Token },
        }),
      ]);
      const stockdata = await Stockdata.json();
      console.log(stockdata);
      setTemptabledata(stockdata);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [datewisetempdata, setDatewisetempdata] = useState([]);

  const masterSearch = (e) => {
    e.preventDefault();

    const startDate = new Date(datefrom);
    const endDate1 = new Date(dateto);
    const endDate = endDate1.toDateString();

    if (1 == 1) {
      const filteredData = temptabledata.filter((item) => {
        console.log("item.inoutDate")

        const itemDate = new Date(item.inoutDate);
        const itemdate1 = itemDate.toDateString();
        const isWithinDateRange = itemDate >= startDate && itemdate1 <= endDate;
        return isWithinDateRange;
      });

      const INData = filteredData.filter((item) => item.status === "IN");
      const OUTData = filteredData.filter((item) => item.status === "OUT");

      console.log("INData");
      console.log(INData);

      console.log("INData");

      let allINQty = {};
      for (const item of INData) {
        const key = `${item.partcd}-${item.warehousecd}`;

        if (!allINQty[key]) {
          allINQty[key] = {
            ...item,
            qty: item.qty,
          };
        } else {
          allINQty[key].qty += item.qty;
        }
      }
      const FinalReceiveQuantity = Object.values(allINQty);
      settabledata(FinalReceiveQuantity);

      // Datewise collect data

      let Datewisepart = {};
      for (const item of INData) {
        const key = `${formatDate(item.inoutDate)}-${item.partcd}-${item.warehousecd
          }`;
        if (!Datewisepart[key]) {
          Datewisepart[key] = {
            ...item,
            qty: item.qty,
          };
        } else {
          Datewisepart[key].qty += item.qty;
        }
      }

      const Datewisepartfinal = Object.values(Datewisepart);
      setDatewisetempdata(Datewisepartfinal);
    } else {
      alert("some issue occured during fiter");
    }
  };

  const [datefrom, setDateFrom] = useState(null);

  const handleDateFrom = (date) => {
    setDateFrom(date);
  };

  const [dateto, setDateTo] = useState(null);

  const handleDateTo = (date) => {
    setDateTo(date);
  };



  return (
    <React.Fragment>
      <div className="page-content" style={{overflow:"hidden"}}>
        <ExportCSVModal
          show={isExportCSV}
          data={tabledata}
          onCloseClick={() => setIsExportCSV(false)}
        />
        <Container fluid>
          <BreadCrumb title="Inventory Register" pageTitle="MIS" buttons={
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
                        <div className="col-md-2 col-sm-2 mt-4">
                          <div className="mb-4">
                            <label
                              htmlFor="task-duedate-input"
                              className="form-label"
                            >
                              Date From
                            </label>
                            <Flatpickr
                              name="dueDate"
                              id="date-field"
                              className="form-control"
                              placeholder="Due date"
                              options={{
                                altInput: true,
                                altFormat: "d M, Y",
                                dateFormat: "d M, Y",
                              }}
                              onChange={handleDateFrom}
                              value={datefrom}
                            />
                          </div>
                        </div>

                        <div className="col-md-2 col-sm-2 mt-4">
                          <div className="mb-4">
                            <label
                              htmlFor="task-duedate-input"
                              className="form-label"
                            >
                              Date To
                            </label>
                            <Flatpickr
                              name="dueDate"
                              id="date-field"
                              className="form-control"
                              placeholder="Due date"
                              options={{
                                altInput: true,
                                altFormat: "d M, Y",
                                dateFormat: "d M, Y",
                              }}
                              onChange={handleDateTo}
                              value={dateto}
                            />
                          </div>
                        </div>

                        <div className="col-md-2 col-sm-2 mt-5">
                          <Button
                            className="btn btn-success"
                            onClick={masterSearch}
                          >
                            Search
                          </Button>
                        </div>
                      </Row>
                    </div>
                    {/* <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        <button
                          className="btn btn-soft-success"
                          onClick={() => setIsExportCSV(true)}
                        >
                          Excel
                        </button>
                      </div>
                    </div> */}
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {tabledata.length ? (
                      <TableContainer
                        columns={Column}
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
                        columns={Column}
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

      <Modal
        size="xl"
        backdrop={"static"}
        isOpen={modelopen}
        toggle={() => setModelopen(!modelopen)}
        modalClassName="zoomIn"
        centered
      >
        <ModalHeader
          toggle={() => Modalclose(!modelopen)}
          className="p-3 bg-success-subtle"
        >
          Vendor Po QR Code
        </ModalHeader>
        <ModalBody>
          {dateWiseData.length > 0 ? (
            <TableContainer
              columns={dateWiseDataColumn}
              data={dateWiseData || []}
              isGlobalFilter={true}
              isAddUserList={false}
              customPageSize={8}
              className="custom-header-css"
              divClass="table-responsive table-card mb-3"
              tableClass="align-middle table-nowrap"
              theadClass="table-light"
              SearchPlaceholder="Search here..."
            />
          ) : (
            <TableContainer
              columns={dateWiseDataColumn}
              data={[]}
              isGlobalFilter={true}
              isAddUserList={false}
              customPageSize={8}
              className="custom-header-css"
              divClass="table-responsive table-card mb-3"
              tableClass="align-middle table-nowrap"
              theadClass="table-light"
              SearchPlaceholder="Search here..."
            />
          )}
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <Button color="light" onClick={Modalclose}>
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};
export default InventoryRegister;
