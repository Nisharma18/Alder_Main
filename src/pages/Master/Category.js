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
  Button
} from "reactstrap";
import Base_url from "../Base_url/Base_url";
import Token from './../Token/Base_Token';

import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Category = () => {
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;


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
        Header: "Name",
        accessor: "name",
        filterable: false,
      },


      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Update" style={{cursor:"pointer"}}>
                <i
                  className="ri-pencil-line fs-16"
                  onClick={() => Categoryupdate(row.row.original.rwid)}
                ></i>
              </li>
              <li className="list-inline-item edit" title="Continue" style={{cursor:"pointer"}}>
                {row.row.original.dis === "NO" ? (
                  <i
                    className="ri-lock-line fs-16"
                    onClick={() =>
                      handleStatus(row.row.original.rwid, row.row.original.dis)
                    }
                    style={{ color: "green" }}
                  ></i>
                ) : (
                  <i
                    className="ri-lock-line fs-16"
                    title="Discontinue"
                    onClick={() =>
                      handleStatus(row.row.original.rwid, row.row.original.dis)
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
    []
  );

  const [error, seterror] = useState(false);
  const [modal, setModal] = useState(false);
  const [updateExistname, setUpdateExistname] = useState("");
  const [data, setData] = useState([]);
  const [categorname, setCategoryname] = useState("");
  const [catrwid, setCatrwid] = useState("");
  const [alreadyExist, setAlreadyExist] = useState(false);
  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Category";

  const handlechange = async (e) => {
    const inputvalue = e.target.value;
    setCategoryname(inputvalue);
    if (catrwid == null || catrwid === "") {
      checkNameinDatabase(inputvalue);
    } else {
      checkNameinDatabaseforupdate(inputvalue);
    }
  };

  const checkNameinDatabase = async (inputvalue) => {
    try {
      const response = await fetch("http://192.168.1.3:8085/getAllCategory", {
        method: "GET",
        headers: {
          Authorization: Token,
        },
      });
      if (!response.ok) {
        console.error("Network response was not ok.");
        return;
      }

      const data = await response.json();
      const lowerCaseInput = inputvalue.trim().toLowerCase();
      const categoryExists = data.some(
        (item) => item.name.trim().toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(categoryExists);
      console.log(categoryExists);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkNameinDatabaseforupdate = async (inputvalue) => {
    try {
      const response = await fetch(`${Base_url}/getAllCategory`, {
        method: "GET",
        headers: {
          Authorization: Token,
        },
      });
      if (!response.ok) {
        console.error("Network response was not ok.");
        return;
      }

      const data = await response.json();
      const lowerCaseInput = inputvalue.trim().toLowerCase();
      const filteredData = data.filter((item) => item.name !== updateExistname);
      const categoryExists = filteredData.some(
        (item) => item.name.trim().toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(categoryExists);
      console.log(categoryExists);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setAlreadyExist(false);
      setCategoryname("");
    }
  }, [modal]);

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(Base_url + "/getAllCategory", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const category = await response.json();
      setData(category);
      console.log(category);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle create Category api

  const convertedData = {
    name: categorname,
    crtby: "kuldeep",
    updtby: "kuldeep",
  };
  const convertedData2 = {
    rwid: catrwid,
    name: categorname,
    updtby: "kuldeep",
    dis: "",
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (alreadyExist == false) {
      let url = "";
      let method = "";
      let massage = "";
      let jsonData;

      if (categorname.trim() == "") {
        toast.error("Category Name is required", { autoClose: 1000 })
        return

      }

      if (catrwid == null || catrwid === "") {
        jsonData = JSON.stringify(convertedData);
        url = Base_url + "/addCategory";
        method = "POST";
        massage = "Category Saved";
      } else {
        jsonData = JSON.stringify(convertedData2);
        url = `${Base_url}/updateCategory/${catrwid}`;
        method = "PUT";
        massage = "Category Update";
      }

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
        body: jsonData,
      })
        .then((response) => response.json())
        .then((data) => {
          fetchData();
          toast.success(massage + " Successfully id : " + data.catcd, {
            autoClose: 1000,
          });
        })
        .catch((error) => {
          fetchData();
          toast.error(massage + " Failed", { autoClose: 1000 });
        });

      setAlreadyExist(false);
      setCategoryname("");
      setCatrwid("");
      setModal(false);
    }
  };

  // handle user update api

  const Categoryupdate = async (id) => {
    const response = await fetch(`http://192.168.1.3:8085/getCategory/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    setCategoryname(json.name);
    setUpdateExistname(json.name);
    setCatrwid(json.rwid);
    setModal(true);
  };

  // handle continue and discontinue status

  const handleStatus = async (id, dis) => {
    let msg = dis === "NO" ? "Discontinue" : "Continue";
    dis = dis === "NO" ? "YES" : "NO";

    const response = await fetch(`http://192.168.1.3:8085/getCategory/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const updateJson = { ...json, dis: dis };
    fetch(`${Base_url}/updateCategory/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Token,
      },
      body: JSON.stringify(updateJson),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchData();
        toast.success("Category " + msg + " Successfully id : " + data.catcd, {
          autoClose: 1000,
        });
      })
      .catch((error) => {
        fetchData();
        toast.error("Category " + msg + " Failed", { autoClose: 1000 });
      });
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{ overflow: "hidden" }}>
        <ExportCSVModal
          show={isExportCSV}
          data={data}
          onCloseClick={() => setIsExportCSV(false)}
        />
        <Container fluid>
          <BreadCrumb pageName="Category" title="Master" subTitle="Category" buttons={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
              <button
                className="btn add-btn main-bg"
                onClick={() => {
                  setModal(true);
                }}
              >
                <i className="ri-add-fill me-1 align-bottom"></i> Add
              </button>
              <button
                className="btn btn-soft-success"
                onClick={() => setIsExportCSV(true)}
              >
                Export
              </button>
            </div>
          } />
          <Row>
            <Col xxl={12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  <div>
                    {data.length ? (
                      <TableContainer
                        columns={columns}
                        data={data || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder="Search Here..."
                        isStatus={true}
                      // StatusState={setCrmcontacts}
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>

                  <Modal
                    id="showModal"
                    backdrop={"static"}
                    isOpen={modal}
                    toggle={toggle}
                    centered
                  >
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      Add Category
                    </ModalHeader>

                    <Form className="tablelist-form" onSubmit={handlesubmit}>
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label htmlFor="Category" className="form-label">
                                Category<span className="required">*</span>
                              </Label>
                              <Input
                                name="Category"
                                className="form-control"
                                placeholder="Enter Category"
                                type="text"
                                value={categorname}
                                onChange={handlechange}
                              />
                              {alreadyExist && (
                                <p style={{ fontSize: 12, color: "red" }}>
                                  Category already exists.
                                </p>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <Button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setModal(false);
                              setAlreadyExist(false);
                              setCategoryname("");
                            }}
                            size="sm"
                          >
                            Close
                          </Button>
                          <Button
                            type="submit"
                            className="btn btn-success"
                            id="add-btn"
                            size="sm"
                          >
                            Save
                          </Button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>

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

export default Category;
