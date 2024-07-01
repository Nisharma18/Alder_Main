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
import { Link } from "react-router-dom";
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

import ExportCSVModal from "./../../Components/Common/ExportCSVModal";
import { createSelector } from "reselect";

const PhotoOffer = () => {

  const dateformate = (e) => {
    const date = new Date(e);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };


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

  const [Category, setCategory] = useState({
    label: "Furniture",
    value: "Furniture",
  });

  const Categories = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Inprogress", value: "Inprogress" },
        { label: "Cancelled", value: "Cancelled" },
        { label: "Pickups", value: "Pickups" },
        { label: "Returns", value: "Returns" },
        { label: "Delivered", value: "Delivered" },
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

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteOrder(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".orderCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="orderCheckBox form-check-input"
              value={cellProps.row.original._id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },

      {
        Header: "image",
        accessor: "orderId",
        filterable: false,
        Cell: (cell) => {
          return (
            <Link
              to="/apps-ecommerce-order-details"
              className="fw-medium link-primary"
            >
              {cell.value}
            </Link>
          );
        },
      },
      {
        Header: "Product Alias",
        accessor: "customer",
        filterable: false,
      },
      {
        Header: "Product Name",
        accessor: "",
        filterable: false,
      },

      {
        Header: "Color",
        accessor: "Color",
        filterable: false,
      },
      {
        Header: "Finish",
        accessor: "Finish",
        filterable: false,
      },
      {
        Header: "Size",
        accessor: "Size",
        filterable: false,
      },
      {
        Header: "Net Wgt",
        accessor: "amount",
        filterable: false,
      },
      {
        Header: "CNF",
        accessor: "CNF",
        filterable: false,
      },
      {
        Header: "MRP",
        accessor: "MRP",
        filterable: false,
      },
    ],
    [handleOrderClick, checkedAll]
  );

  const Addcolumns = useMemo(
    () => [
      {
        Header: "image",
        accessor: "orderId",
        filterable: false,
        Cell: (cell) => {
          return (
            <Link
              to="/apps-ecommerce-order-details"
              className="fw-medium link-primary"
            >
              {cell.value}
            </Link>
          );
        },
      },
      {
        Header: "Product Alias",
        accessor: "customer",
        filterable: false,
      },
      {
        Header: "Product Name",
        accessor: "",
        filterable: false,
      },

      {
        Header: "Color",
        accessor: "Color",
        filterable: false,
      },
      {
        Header: "Finish",
        accessor: "Finish",
        filterable: false,
      },
      {
        Header: "Size",
        accessor: "Size",
        filterable: false,
      },
      {
        Header: "Net Wgt",
        accessor: "amount",
        filterable: false,
      },
      {
        Header: "CNF",
        accessor: "CNF",
        filterable: false,
      },
      {
        Header: "MRP",
        accessor: "MRP",
        filterable: false,
      },
    ],
    [handleOrderClick, checkedAll]
  );

  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Photo Offer";
  return (
    <div className="page-content">
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={orderList}
      />

      <Container fluid>
        <BreadCrumb title="Photo Offer" pageTitle="Manage Photo Offer" />
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="border-0">
                <Row>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Category">
                        Category
                      </Label>
                      <Select
                        value={Category}
                        onChange={(e) => {
                          setCategory(e);
                        }}
                        options={Categories}
                        id="Category"
                        className="js-example-basic-single mb-0"
                        name="Category"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Product-Alias">
                        Product Alias
                      </Label>
                      <Select
                        value={Category}
                        onChange={(e) => {
                          setCategory(e);
                        }}
                        options={Categories}
                        id="Product-Alias"
                        className="js-example-basic-single mb-0"
                        name="Product-Alias"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="Description">
                        Description
                      </Label>
                      <Select
                        value={Category}
                        onChange={(e) => {
                          setCategory(e);
                        }}
                        options={Categories}
                        id="Description"
                        className="js-example-basic-single mb-0"
                        name="Description"
                      />
                    </div>
                  </div>
                </Row>
                <Row className="align-items-center gy-3">
                  <div className="col-sm"></div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => setIsExportCSV(true)}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        Export
                      </button>
                    </div>
                  </div>
                </Row>
              </CardHeader>

              <CardBody className="pt-0">
                <div>
                  {isOrderSuccess && orderList.length ? (
                    <TableContainer
                      columns={columns}
                      data={orderList || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={10000}
                      divClass="table-responsive table-card mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted text-uppercase"
                      handleOrderClick={handleOrderClicks}
                      SearchPlaceholder="Search  something..."
                    />
                  ) : (
                    <Loader error={error} />
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button className="btn btn-success mb-4"> Add To List</Button>
                </div>

                <div>
                  {isOrderSuccess && orderList.length ? (
                    <TableContainer
                      columns={Addcolumns}
                      data={orderList || []}
                      customPageSize={10000}
                      divClass="table-responsive table-card mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted text-uppercase"
                    />
                  ) : (
                    <Loader error={error} />
                  )}
                </div>

                <div className="mt-4">
                   <Row>
                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Buyer-Name">
                          Buyer Name
                        </Label>
                        <Select
                          value={Category}
                          onChange={(e) => {
                            setCategory(e);
                          }}
                          options={Categories}
                          id="Buyer-Name"
                          className="js-example-basic-single mb-0"
                          name="Buyer-Name"
                        />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Contact Person">
                          Contact Person
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Contact Person"
                          placeholder="Enter Contact Person"
                          name="Sticker Size"
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Country">
                          Country
                        </Label>
                        <Select
                          value={Category}
                          onChange={(e) => {
                            setCategory(e);
                          }}
                          options={Categories}
                          id="Country"
                          className="js-example-basic-single mb-0"
                          name="Country"
                        />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Contact Person">
                          Meeting Ref
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Contact Person"
                          placeholder="Enter Contact Person"
                          name="Sticker Size"
                        />
                      </div>
                    </div>
                   </Row>
                   <Row className="mt-2 mb-2">
                    <h5 style={{color:'black'}}> Followup</h5>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Delevary-Date">
                          Delevary Date
                        </Label> 
                        <Input
                          type="date"
                          className="form-control"
                          id="Delevary Date"
                          placeholder="Enter Delevary Date"
                          name="Sticker Size"
                          
                        />
                      </div>
                    </div>


                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Comment">
                          Comment
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Comment"
                          placeholder="Enter Contact Person"
                          name="Sticker Size"
                        />
                      </div>
                    </div>

                   </Row>
                </div>
                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PhotoOffer;
