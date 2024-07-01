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

import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainer";
import Token from "../Token/Base_Token";
// Formik
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Base_url from "../Base_url/Base_url";
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
                  onClick={() => Colorupdate(row.row.original.rwid)}
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
  const [colorname, setColorname] = useState("");
  const [catrwid, setCatrwid] = useState("");
  const [updateExistname, setUpdateExistname] = useState("");
  const [alreadyExist, setAlreadyExist] = useState(false);
  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Color";
  const handlechange = async (e) => {
    const inputvalue = e.target.value;
    setColorname(inputvalue);
    if (catrwid == null || catrwid === "") {
      checkNameinDatabase(inputvalue);
    } else {
      checkNameinDatabaseforupdate(inputvalue);
    }
  };

  const checkNameinDatabase = async (inputvalue) => {
    try {
      const response = await fetch(`${Base_url}/getAllColors`, {
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
      const ColorExist = data.some((item) => item.name.trim().toLowerCase() === lowerCaseInput);
      setAlreadyExist(ColorExist);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkNameinDatabaseforupdate = async (inputvalue) => {
    try {
      const response = await fetch(`${Base_url}/getAllColors`, {
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
      const ColorExist = filteredData.some(
        (item) => item.name.trim().toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(ColorExist);
      console.log(ColorExist);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setAlreadyExist(false);
      setColorname("");
    }
  }, [modal]);

  // handle user get api


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(Base_url + "/getAllColors", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const color = await response.json();
      setData(color);
      console.log(color);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle create Category api

  const convertedData = {
    name: colorname,
    crtby: "kuldeep",
    updtby: "kuldeep",
  };
  const convertedData2 = {
    rwid: catrwid,
    name: colorname,
    updtby: "kuldeep",
    dis: "",
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (colorname.trim() == "") {
      toast.error("Color Name is required", { autoClose: 1000 });
      return;
    }

    if (alreadyExist == false) {
      let url = "";
      let method = "";
      let massage = "";
      let jsonData;
      if (catrwid == null || catrwid === "") {
        jsonData = JSON.stringify(convertedData);
        url = Base_url + "/addColor";
        method = "POST";
        massage = "Color Saved";
      } else {
        jsonData = JSON.stringify(convertedData2);
        url = `${Base_url}/updateColor/${catrwid}`;
        method = "PUT";
        massage = "Color Update";
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
          toast.success(massage + " Successfully id : " + data.clrcd, {
            autoClose: 1000,
          });
        })
        .catch((error) => {
          fetchData();
          toast.error(massage + " failed ", { autoClose: 1000 });
        });

      setAlreadyExist(false);
      setColorname("");
      setCatrwid("");
      setModal(false);
    }
  };

  // handle user update api

  const Colorupdate = async (id) => {
    const response = await fetch(`${Base_url}/getColor/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    setColorname(json.name);
    setUpdateExistname(json.name);
    setCatrwid(json.rwid);
    setModal(true)
  };

  // handle continue and discontinue status

  const handleStatus = async (id, dis) => {
    let msg = dis === "NO" ? "Discontinue" : "Continue";
    dis = dis === "NO" ? "YES" : "NO";

    const response = await fetch(`${Base_url}/getColor/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const updateJson = { ...json, dis: dis };

    console.log("dis Data ");
    console.log(updateJson);

    fetch(`${Base_url}/updateColor/${id}`, {
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
        toast.success("Color " + msg + " Successfully " + data.clrcd, {
          autoClose: 1000,
        });
      })
      .catch((error) => {
        fetchData();
        toast.error("Color " + msg + " failed ", { autoClose: 1000 });
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
          <BreadCrumb pageName="Color" title="Master" subTitle="Color" buttons={
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
                      Add Color
                    </ModalHeader>

                    <Form className="tablelist-form" onSubmit={handlesubmit}>
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label htmlFor="Category" className="form-label">
                                Color<span className="required">*</span>
                              </Label>
                              <Input
                                name="Color"
                                className="form-control"
                                placeholder="Enter Color Name"
                                type="text"
                                value={colorname}
                                onChange={handlechange}
                              />
                              {alreadyExist && (
                                <p style={{ fontSize: 12, color: "red" }}>
                                  Color already exists.
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
                              setColorname("");
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
