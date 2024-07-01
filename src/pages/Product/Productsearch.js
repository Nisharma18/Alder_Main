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
import ExportExcelProduct from "../../Components/Common/ExportExcelProduct";
import TableContainer from "../../Components/Common/TableContainers";
import Token from "../Token/Base_Token";
import url from "../Base_url/Base_url";
// Formik
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Productsearch = () => {
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
        Header: "Image",
        accessor: "rwid",
        filterable: false,
        Cell: ({ value }) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 ">
                <img
                  src={`${url}/image/ProductImage/${value}`}
                  alt=""
                  className="avatar-xs rounded-circle image-zoom"
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(6) ')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Category",
        accessor: "categorynm", // Assuming this is the accessor for category name
        filterable: false,
      },
      {
        Header: "Product Name",
        accessor: "prdnm",
        filterable: false,
      },
      {
        Header: "Alias code",
        accessor: "prdalias",
        filterable: false,
      },
      {
        Header: "Size",
        accessor: (data) =>
          `${data.prdlen}x${data.prdwid}x${data.prdheight} ${data.prdunit}`,
        filterable: false,
      },
      {
        Header: "Net Wgt",
        accessor: "prdnetWgt",
        filterable: false,
      },
       {
      Header: "Gross Wgt",
      accessor: "prdGrsWgt",
      filterable: false,
    },
    // {
    //   Header: "Box CBM",
    //   accessor: "boxarea",
    //   filterable: false,
    // },
      {
        Header: "CNF",
        accessor: "cnf",
        filterable: false,
      },
      {
        Header: "MRP",
        accessor: "ecomMrp",
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
                  onClick={() => updateAction(row.row.original.rwid)}
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
              <li className="list-inline-item edit" title="Call">
                <i
                  class="ri-file-pdf-line  fs-18"
                  onClick={() => generatePDF(row.row.original.rwid)}
                  style={{ color: "red" }}
                ></i>
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
console.log("data===========" ,data)
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Product";

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/getAllProduct", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const responsedata = await response.json();
      setData(responsedata);
      console.log(responsedata);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle user update api

  const updateAction = async (id) => {
    const response = await fetch(`${url}/getProduct/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const encodedData = encodeURIComponent(JSON.stringify(json));
    navigate(`/product?data=${encodedData}`);
  };

  // handle continue and discontinue status

  const handleStatus = async (id, dis) => {
    let msg = dis === "NO" ? "Discontinue" : "Continue";
    dis = dis === "NO" ? "YES" : "NO";

    const response = await fetch(`${url}/getProduct/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const updateJson = { ...json, dis: dis };

    console.log("dis Data ");
    console.log(updateJson);

    fetch(`${url}/updateProduct/${id}`, {
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
        toast.success("Product " + msg + " Successfully " + data.prdcd, {
          autoClose: 1000,
        });
      })
      .catch((error) => {
        fetchData();
        toast.error("Product " + msg + " failed ", { autoClose: 1000 });
      });
  };

  const navigate = useNavigate();
  const Ridirectpage = () => {
    navigate("/product");
  };

  const generatePDF = async (id) => {
    const response = await fetch(`${url}/getProduct/${id}`, { headers: { Authorization: Token } });
    const json = await response.json();

    const doc = new jsPDF("p", "mm", "a4");

    const headerText = "Product View";
    const headertext2 = "Product Detail";
    const headertext3 = "Box Detail";

    doc.setFontSize(10);
    const pageWidth = 210;
    const pageHeight = 297;
    const leftMargin = 5;
    const rightMargin = 5;
    const topMargin = 5;
    const bottomMargin = 5;

    const boxWidth = pageWidth - leftMargin - rightMargin;
    const boxHeight = pageHeight - topMargin - bottomMargin;

    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.rect(leftMargin, topMargin, boxWidth, boxHeight);

    // Set font style to "bold"
    doc.setFillColor(192, 192, 192);
    doc.rect(5.5, 5, 199.5, 7, "F");
    doc.setFillColor(192, 192, 192);
    doc.rect(5, 5, 200, 7, "S");
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(headerText, 95, 10, { align: "center" });


    // Add text to the left of the box
    const ProductCode = `Product Code :  ${json.prdcd}`;
    doc.text(ProductCode, leftMargin + 5, 20);

    const AliasCode = `Alias Code :  ${json.prdalias}`;
    doc.text(AliasCode, leftMargin + 5, 27);

    const Category = `Category :  ${json.categorynm}`;
    doc.text(Category, leftMargin + 5, 34);


    // Text on the right side
    const img = `${url}/image/ProductImage/${id}`
    doc.addImage(img, 'JPEG', 140, 18, 25, 25);

    // Style and position for headertext2
    doc.setFillColor(192, 192, 192);
    doc.rect(5.5, 50, 199.5, 7, "F");
    doc.setFillColor(192, 192, 192);
    doc.rect(5, 50, 200, 7, "S");
    doc.setFont("helvetica", "bold");
    doc.text(headertext2, leftMargin + 5, 55);

    console.log("json")
    console.log(json)
    const Productname = `Product Name :  ${json.prdnm}`;
    doc.text(Productname, leftMargin + 5, 65);

    // const Productdescription = `Product Description :  ${json.remark}`;
    // doc.text(Productdescription, leftMargin + 5, 72);

    const Netwgt = `Net Weight :  ${json.prdnetWgt}`;
    doc.text(Netwgt, leftMargin + 5, 70);

    const GrsWgt = `Grs Weight: ${json.prdGrsWgt}`;
    doc.text(GrsWgt, leftMargin + 5, 75)

    const color = `Color :  ${json.prdColor}`;
    doc.text(color, leftMargin + 5, 80);

    const Finish = `Finish :  ${json.prdfinish}`;
    doc.text(Finish, leftMargin + 5, 85);

    doc.setFillColor(192, 192, 192);
    doc.rect(5.5, 90, 199.5, 7, "F");
    doc.setFillColor(192, 192, 192);
    doc.rect(5, 90, 200, 7, "S");
    doc.setFont("helvetica", "bold");
    doc.text(headertext3, leftMargin + 5, 95);


    const tableData = json.productBox.map(item => {
      return [
        item.crtnType,
        item.boxunit,
        item.boxlen,
        item.boxwid,
        item.boxheight,
        item.boxarea,
        item.pcsprcrtn.toString(),
        item.pcsprcbm.toString(),
        item.boxWgt.toString(),
      ];
    });

    console.log("json.productBox")
    console.log(json.productBox)

    doc.autoTable({
      startY: 97.2,
      startX: 5,
      head: [
        [
          'Carton Type',
          'Unit',
          'Length',
          'Width',
          'Height',
          'Box Area',
          'Pcs /Crtn',
          'CBM /Pcs',
          'Box Weight',
        ],
      ],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255, 0.1],
        textColor: 255,
        fontSize: 10,
      },
      margin: { left: 5 }, // Adjust the top margin as needed
      tableWidth: 200, // Use 'auto' to distribute column width equally
      columnStyles: {
        0: { cellWidth: 40 }, // Adjust the width as needed
      },
    });

    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{overflow:"hidden"}}>
        <ExportExcelProduct
          show={isExportCSV}
          data={data}
          onCloseClick={() => setIsExportCSV(false)}
        />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <BreadCrumb pageName="Manage Product" title="Manage Product"  buttons={<div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
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
              </div>} />
            
            </Col>

            <Col xxl={12}>
              <Card id="contactList">
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

                  <ToastContainer closeButton={false} limit={2} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Productsearch;
