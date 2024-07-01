import React, { useState, useMemo, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  Label,
  Input,
  

} from "reactstrap";
import Select from "react-select";


import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainers";

// Table Loader 
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Token from "../Token/Base_Token";
// url 
import Base_url from './../Base_url/Base_url';
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
        Header: "Code",
        accessor: "ledcd",
        filterable: false,
      },
      {
        Header: "Party Type",
        accessor: "partytype",
        filterable: false,
      },
      {
        Header: "Name",
        accessor: "lednm",
        filterable: false,
      },
      {
        Header: "Contact Person",
        accessor: "buyerDetail[0].billContactperson",
        filterable: false,
      },
      {
        Header: "Contact No",
        accessor: "buyerDetail[0].billContactno",
        filterable: false,
      },
      {
        Header: "Buyer Alias",
        accessor: "buyeralias",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "dis",
        filterable: false,
      },

      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          // console.log(row.row.original.rwid);
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
                    title="Discontinue"
                    onClick={() =>
                      handleStatus(row.row.original.rwid, row.row.original.dis)
                    }
                    style={{ color: "green" }}
                  ></i>
                ) : (
                  <i
                    className="ri-lock-line fs-16"
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
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
console.log("data-----------", data)
  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Ledger Report";

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(Base_url + "/getAllLedger", {
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
    const response = await fetch(`${Base_url}/getLedger/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const encodedData = encodeURIComponent(JSON.stringify(json));
    navigate(`/Ledger-update?data=${encodedData}`);
  };

  // handle continue and discontinue status

  const handleStatus = async (id, dis) => {
    let msg = dis === "NO" ? "Discontinue" : "Continue";
    dis = dis === "NO" ? "YES" : "NO";

    const response = await fetch(`${Base_url}/getLedger/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });

    const json = await response.json();
    const updateJson = { ...json, dis: dis };

    console.log("dis Data ");
    console.log(updateJson);

    fetch(`${Base_url}/updateLedger/${id}`, {
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
        toast.success("Ledger " + msg + " Successfully id : " + data.ledcd, {
          autoClose: 1000,
        });
      })
      .catch((error) => {
        fetchData();
        toast.error("Ledger " + msg + " Failed ", { autoClose: 1000 });
      });
  };
  
  const options = [
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 500, label: '500' },
   
  ];
  
  const From = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Active",
      value: "YES",
    },
    {
      label: "Pending",
      value: "NO",
    },
  ];

  const [filter, setFilter] = useState('All');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Initial filter setting
    let filtered = data;
    if (filter !== "All") {
      filtered = filtered.filter((item) => item.dis === filter);
    }

 if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.partytype.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.lednm.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.buyerDetail[0] &&
            item.buyerDetail[0].billContactperson
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }
    setFilteredData(filtered);
  }, [filter, searchQuery, data]);

  
  const handleFilter = (selectedOption) => {
    setFilter(selectedOption.value);
  };


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
          <BreadCrumb pageName="Ledger Search" title="Master" subTitle="Ledger Search"  />
          <Row>
          <Col xxl={12}>
              <Card id="contactList" style={{marginBottom:'-0px'}}>
                <CardBody className="pt-0">
                  <Row>
                  <Col xs="10" >
                    <Col sm={6} md={4} lg={4} style={{marginTop:"20px"}}>
                      <div style={{ borderRadius: "4px", backgroundColor:'rgb(233, 233, 233)' }}>
                        <Input 
                        placeholder='Search Here...'
                        class="form-control border-0 search /"
                        value={searchQuery}
                        onChange={handleSearch}
                         />
                      </div>
                    </Col>
                  </Col>
                  <Col xs="1" style={{marginTop:"20px"}}>
                      <div style={{ borderRadius: "6px", border: "1px solid rgb(206, 212, 218)" }}>
                        <Select
                          value={From.find(option => option.value === filter)}
                          onChange={handleFilter}
                          placeholder='Status'
                          options={From}
                        />
                      </div>
                    </Col>
                    <Col xs="1" style={{marginTop:"20px"}}>
                      <div style={{borderRadius: "6px", border: "1px solid rgb(206, 212, 218)" }}>
                        <Select
                          placeholder='Size'
                          options={options}
                        />
                      </div>
                    </Col>
                  </Row>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>


            <Col xxl={12}>
              <Card id="contactList">
                <CardBody className="pt-0">
     
                  <div>
                
                    {filteredData.length ? (
                      <TableContainer
                        columns={columns}
                        data={filteredData || []}
                        // isGlobalFilter={true}
                        // isGlobalSearch={true}
                        // isStatus={true}
                        customPageSize={100000000}
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
