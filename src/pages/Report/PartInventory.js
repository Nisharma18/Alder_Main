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

const PartInventory = () => {

  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;

  const [tabledata, settabledata] = useState([]);
  const [temptabledata, setTemptabledata] = useState([]);
  const [partcode, setPartcode] = useState([]);
  const [partName, setPartName] = useState([]);

  const [partcodes, setPartcodes] = useState([]);
  const [partNames, setPartNames] = useState([]);

  const [warehouseall, setWarehouseall] = useState([]);
  const [warehousealls, setWarehousealls] = useState([]);
  useEffect(() => {
    const warehouse = async () => {
      const response = await fetch(`${url}/Warehouse`, { headers: { Authorization: Token } });
      const warehouse = await response.json();
      const warehousename = warehouse.map((item) => item.name);
      setWarehouseall(warehousename);
    };
    warehouse();
  }, []);

  const AllPartName = [
    {
      options: [
        { label: "", value: "" },
        ...partName.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];


  const AllPartcode = [
    {
      options: [
        { label: "", value: "" },
        ...partcode.map((item) => {
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

  // Column
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,
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
        Header: "Available Qty",
        accessor: "qty",
        filterable: false,
      },
    ],
    []
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Part Issue";

  // handle user get api


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [Stockdata] = await Promise.all([fetch(`${url}/Stocks`, { headers: { Authorization: Token } })]);
      const stockdata = await Stockdata.json();

      const INData = stockdata.filter((item) => item.status === 'IN');
      const OUTData = stockdata.filter((item) => item.status === 'OUT');
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

      let allOutQty = {};
      for (const item of OUTData) {
        const key = `${item.partcd}-${item.warehousecd}`;

        if (!allOutQty[key]) {
          allOutQty[key] = {
            ...item,
            qty: item.qty,
          };
        } else {
          allOutQty[key].qty += item.qty;
        }
      }

      const INqty = Object.values(allINQty);
      const Outqty = Object.values(allOutQty);

      console.log('consolidated');
      console.log(INqty);
      console.log(Outqty);



      const outItemMap = {};
      for (const outItem of Outqty) {
        const key = `${outItem.partcd}-${outItem.warehousecd}`;
        outItemMap[key] = outItem;
      }

      const finalresult = [];
      for (const inItem of INqty) {
        const key = `${inItem.partcd}-${inItem.warehousecd}`;
        const outItem = outItemMap[key];

        if (outItem) {
          console.log('final result');
          console.log(inItem.partcd + '' + inItem.warehousecd + '==========' + outItem.partcd + '' + outItem.warehousecd);
          console.log(inItem.qty + '==========' + outItem.qty);
          const updatedQty = inItem.qty - outItem.qty;
          finalresult.push({ ...inItem, qty: updatedQty });
        } else {
          finalresult.push(inItem);
        }
      }

      // console.log('finalresult');
      // console.log(finalresult);
      settabledata(finalresult);
      setTemptabledata(finalresult);
      const partcode = [...new Set(stockdata.map((item) => item.partcd))];
      const partname = [...new Set(stockdata.map((item) => item.partName))];

      setPartcode(partcode);
      setPartName(partname);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const [dropdownvalue, setDropdownvalue] = useState({
    partcode: '',
    partName: '',
    warehousename: '',
  });

  const masterSearch = (e) => {
    e.preventDefault();
    if (
      (!dropdownvalue || !dropdownvalue.partcode || dropdownvalue.partcode === '') &&
      (!dropdownvalue || !dropdownvalue.partName || dropdownvalue.partName === '') &&
      (!dropdownvalue || !dropdownvalue.warehousename || dropdownvalue.warehousename === '')
    ) {
      settabledata(temptabledata);
    } else {
      const filteredData = temptabledata.filter((item) => {
        const partcodematch = dropdownvalue.partcode ? item.partcd.toLowerCase().includes(dropdownvalue.partcode.toLowerCase()) : true;
        const partnamematch = dropdownvalue.partName ? item.partName.toLowerCase().includes(dropdownvalue.partName.toLowerCase()) : true;
        const warehousematch = dropdownvalue.warehousename ? item.warehousecd.toLowerCase().includes(dropdownvalue.warehousename.toLowerCase()) : true;
        return partcodematch && partnamematch && warehousematch;
      });

      settabledata(filteredData);
    }
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
          <BreadCrumb title="Part Inventory" pageTitle="Part Inventory" buttons={
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
                          <Label className="form-label" htmlFor="Payment Term">
                            Part Code
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={partcodes}
                              onChange={(e) => {
                                setPartcodes(e);
                                setDropdownvalue({ ...dropdownvalue, partcode: e.value })
                              }}
                              options={AllPartcode}
                              id="shipment-Type"
                              className="js-example-basic-single mb-0"
                              name="shipment Type"
                            />
                          </div>
                        </div>

                        <div className="col-md-3 col-sm-4">
                          <Label className="form-label" htmlFor="Part-Name">
                            Part Name
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={partNames}
                              onChange={(e) => {
                                setPartNames(e);
                                setDropdownvalue({ ...dropdownvalue, partName: e.value })
                              }}
                              options={AllPartName}
                              id="Part-Name"
                              className="js-example-basic-single mb-0"
                              name="Part-Name"
                            />
                          </div>
                        </div>

                        <div className="col-md-3 col-sm-4">
                          <Label className="form-label" htmlFor="Warehouse">
                            Warehouse
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={warehousealls}
                              onChange={(e) => {
                                setWarehousealls(e);
                                setDropdownvalue({ ...dropdownvalue, warehousename: e.value })
                              }}
                              options={AllWarehouse}
                              id="Warehouse"
                              className="js-example-basic-single mb-0"
                              name="Warehouse"
                            />
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-2 mt-4">
                          <Button className="btn btn-success" onClick={masterSearch}>
                            Search
                            {/* <i class="ri-search-line search-icon"></i>  */}
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
export default PartInventory;
