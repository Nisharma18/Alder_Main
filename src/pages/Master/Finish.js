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
  Button,
  ModalFooter,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainer";
import Token from "../Token/Base_Token";
// Formik
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseUrl from "../Base_url/Base_url";
const Color = () => {
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
              <li className="list-inline-item edit" title="Update" style={{ cursor: "pointer" }}>
                <i
                  className="ri-pencil-line fs-16"
                  onClick={() => Finishupdate(row.row.original.rwid)}
                ></i>
              </li>
              <li className="list-inline-item edit" title="Continue" style={{ cursor: "pointer" }}>
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
  const [data, setData] = useState([]);
  const [finishname, setFinishname] = useState("");
  const [catrwid, setCatrwid] = useState("");
  const [updateExistname, setUpdateExistname] = useState("");
  const [alreadyExist, setAlreadyExist] = useState(false);
  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Finish";


  const handlechange = async (e) => {
    const inputvalue = e.target.value;
    setFinishname(inputvalue);
    if (catrwid == null || catrwid === "") {
      checkNameinDatabase(inputvalue);
    } else {
      checkNameinDatabaseforupdate(inputvalue);
    }
  };

  const checkNameinDatabase = async (inputvalue) => {
    try {
      const response = await fetch(`${BaseUrl}/getAllFinish`, {
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
      const Finishexist = data.some(
        (item) => item.name.trim().toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(Finishexist);
      console.log(Finishexist);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkNameinDatabaseforupdate = async (inputvalue) => {
    try {
      const response = await fetch(`${BaseUrl}/getAllFinish`, {
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
      const Finishexist = filteredData.some(
        (item) => item.name.trim().toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(Finishexist);
      console.log(Finishexist);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setAlreadyExist(false);
      setFinishname("");
    }
  }, [modal]);

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(BaseUrl + "/getAllFinish", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data);
      console.log(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle create Category api

  const convertedData = {
    name: finishname,
    crtby: "kuldeep",
    updtby: "kuldeep",
  };
  const convertedData2 = {
    rwid: catrwid,
    name: finishname,
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

      if (finishname.trim() === "") {
        toast.error("Finish Name is required", { autoClose: 1000 });
        return;
      }

      if (catrwid == null || catrwid === "") {
        jsonData = JSON.stringify(convertedData);
        url = BaseUrl + "/addFinish";
        method = "POST";
        massage = "Finish Saved";
      } else {
        jsonData = JSON.stringify(convertedData2);
        url = `${BaseUrl}/updateFinish/${catrwid}`;
        method = "PUT";
        massage = "Finish Update";
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
          toast.success(massage + " Successfully id : " + data.fincd, {
            autoClose: 1000,
          });
        })
        .catch((error) => {
          fetchData();
          toast.error(massage + " Failed ", { autoClose: 1000 });
        });

      setAlreadyExist(false);
      setFinishname("");
      setCatrwid("");
      setModal(false);
    }
  };

  // handle user update api

  const Finishupdate = async (id) => {
    const response = await fetch(`${BaseUrl}/getFinish/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    setFinishname(json.name);
    setUpdateExistname(json.name);
    setCatrwid(json.rwid);
    setModal(true);
  };

  // handle continue and discontinue status

  const handleStatus = async (id, dis) => {
    let msg = dis === "NO" ? "Discontinue" : "Continue";
    dis = dis === "NO" ? "YES" : "NO";

    const response = await fetch(`${BaseUrl}/getFinish/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const updateJson = { ...json, dis: dis };

    fetch(`${BaseUrl}/updateFinish/${id}`, {
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
        toast.success("Finish " + msg + " Successfully id : " + data.fincd, {
          autoClose: 1000,
        });
      })
      .catch((error) => {
        fetchData();
        toast.error("Finish " + msg + " Failed ", { autoClose: 1000 });
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
          <BreadCrumb  pageName="Finish" title="Master" subTitle="Finish" buttons={
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
                      Add Finish
                    </ModalHeader>

                    <Form className="tablelist-form" onSubmit={handlesubmit}>
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label htmlFor="Category" className="form-label">
                                Finish<span className="required">*</span>
                              </Label>
                              <Input
                                name="finishname"
                                className="form-control"
                                placeholder="Enter Finish Name"
                                type="text"
                                value={finishname}
                                onChange={handlechange}
                              />
                              {alreadyExist && (
                                <p style={{ fontSize: 12, color: "red" }}>
                                  Finish already exists.
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
                              setFinishname("");
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

export default Color;
