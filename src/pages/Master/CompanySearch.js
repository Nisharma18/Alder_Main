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
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainer";

// Table Loader 
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Token from "../Token/Base_Token";
// url 
import url from './../Base_url/Base_url';
import { useNavigate } from "react-router-dom";

const LedgerReport = () => {


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
        Header: "Company Name",
        accessor: "companyName",
        filterable: false,
      },
      {
        Header: "City",
        accessor: "city",
        filterable: false,
      },
      {
        Header: "GST",
        accessor: "gstNo",
        filterable: false,
      },
      {
        Header: "Email",
        accessor: "email",
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
                  onClick={() => LedgerUpdate(row.row.original.rwid)}
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
  const [data, setData] = useState([]);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Company Report";

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/Company", {
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


  // handle user update api
  const navigate = useNavigate();

  const LedgerUpdate = async (id) => {
    const response = await fetch(`${url}/Company/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const encodedData = encodeURIComponent(JSON.stringify(json));
    navigate(`/company?data=${encodedData}`);
  };

  // handle continue and discontinue status

  const handleStatus = async (id, dis) => {
    let msg = dis === "NO" ? "Discontinue" : "Continue";
    dis = dis === "NO" ? "YES" : "NO";

    const response = await fetch(`${url}/Company/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });

    const json = await response.json();
    const updateJson = { ...json, dis: dis };

    console.log("dis Data ");
    console.log(updateJson);

    fetch(`${url}/Company/${id}`, {
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
        toast.success("Company " + msg + " Successfully id : " + data.companycd, {
          autoClose: 1000,
        });
      })
      .catch((error) => {
        fetchData();
        toast.error("Company " + msg + " Failed ", { autoClose: 1000 });
      });
  };


  const Ridirectpage = () => {
    navigate("/company");
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
          <BreadCrumb pageName="Company" title="Master" subTitle="Company" 
          buttons={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
              <button
                className="btn add-btn main-bg"
                onClick={Ridirectpage}
              >
                <i className="ri-add-fill me-1 align-bottom"></i>
                Add
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
                      />
                    ) : (
                      <TableContainer
                        columns={columns}
                        data={[]}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder="Search for user..."
                        isStatus={true}
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

export default LedgerReport;







