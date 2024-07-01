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
  Button,
  ModalFooter,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainer";
import Token from "../Token/Base_Token";
import url from "../Base_url/Base_url";
// Formik
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Cataloguesearch = () => {

    const handledelete = async (id) => {
        try {
            await fetch(`${url}/api/DeleteCatalogue/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: Token,
                },
            });
            toast.success("Catalogue Deleted")

            const Catalogue = await fetch(`${url}/api/GetAllCatalogue`, { headers: { Authorization: Token } });
            const catalogue = await Catalogue.json();
            const collectionName = catalogue.map((item) => item.titlename);
            setTitlename(collectionName);
            setTemptable(catalogue);
            setTable(catalogue)

        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const updateAction = async (id) => {

        const response = await fetch(`${url}/api/GetCatalogue/${id}`, { headers: { Authorization: Token } });
        const json = await response.json();
        const encodedData = encodeURIComponent(JSON.stringify(json));
        navigate(`/catalogue?data=${encodedData}`)
        
    };
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
        Header: "Collection Name",
        accessor: "titlename",
        filterable: false,  
      },
      {
        Header: "Total Product",
        accessor: (item) => {
            const sum = item.catalogueprdimg.length;
            return sum;
          },
        filterable: false,
      },
      {
        Header: "Buyer Name",
        accessor: "buyercd",
        filterable: false,
       
      },
      {
        Header: "Created Date",
        accessor: "createDt",
        filterable: false,
        Cell: ({ value }) => {
          if (!value) {return ''; }
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        Header: "Created By",
        accessor: "createdby",
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
                  style={{color:'red'}}
                  className="las la-trash-alt fs-20"
                  onClick={() => handledelete(row.row.original.rwid)}
                ></i>
              </li>
              
               <li className="list-inline-item edit" title="Call">
                <i
                  className="ri-pencil-line fs-16"
                  onClick={() => updateAction(row.row.original.rwid)}
                ></i>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Catalogue";


  const [titlename, setTitlename] = useState([]);
  const [table, setTable] = useState([]);
  const [temptable, setTemptable] = useState([]);

  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          const [Catalogue] = await Promise.all([
              fetch(`${url}/api/GetAllCatalogue`, { headers: { Authorization: Token } }),
          ]);
          const catalogue = await Catalogue.json();
          const collectionName = catalogue.map((item) => item.titlename);
          setTitlename(collectionName);
          setTemptable(catalogue);


          console.log(catalogue)

      } catch (error) {
          console.log('Error:', error);
      }
  };

  const [dvalue, setDvalue] = useState([
      {
          titlename: '',
      },
  ]);

  const dropdownHandlechange = (e) => {
      setDvalue({ ...dvalue, [e.target.name]: e.target.value });
  };

  const masterSearch = (e) => {
      e.preventDefault();

      //  alert(dvalue.dcategory +"" + dvalue.dprdalias + "" + dvalue.dDescription)

      if (dvalue.titlename === '' || typeof dvalue.titlename === 'undefined') {
          fetchData();
          setTable(temptable);
      } else {
          const filteredData = temptable.filter((item) => {
              return item.titlename.toLowerCase().includes(dvalue.titlename && dvalue.titlename.toLowerCase());
          });
          setTable(filteredData);
      }
  };
  
  // handle continue and discontinue status

  const navigate = useNavigate();
  const RidirectaddVendor = () => {
    navigate("/catalogue");
  };




  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          data={temptable}
          onCloseClick={() => setIsExportCSV(false)}
        />
        <Container fluid>
          <BreadCrumb title="Catalogue Search" pageTitle="Manage Catalogue" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-info add-btn"
                        onClick={RidirectaddVendor}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>
                      Catalogue Create
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        <button
                          className="btn btn-soft-success"
                          onClick={() => setIsExportCSV(true)}
                        >
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>

            <Col xxl={12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  <div>
                    {temptable.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        data={temptable || []}
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
                      columns={columns}
                      data={ []}
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
export default Cataloguesearch;
