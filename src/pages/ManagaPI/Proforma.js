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
import ExportExcelPI from "../../Components/Common/ExportExcelPI";
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

const Proforma = () => {
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
        Header: "PI No",
        accessor: "picd",
        filterable: false,
      },
      {
        Header: "Buyer Name",
        accessor: "clientName",
        filterable: false,
      },
      {
        Header: "Alias Name",
        accessor: "alias",
        filterable: false,
      },
      {
        Header: "Buyer Po.",
        accessor: "buyerpo",
        filterable: false,
      },
      {
        Header: "PI Date",
        accessor: "pidate",
        filterable: false,
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        Header: "Delivery Date",
        accessor: "delivaryDate",
        filterable: false,
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1
            }/${date.getFullYear()}`;
          return formattedDate;
        },
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
              <li className="list-inline-item edit" title="PDF"  style={{ cursor: "pointer" }}>
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

  const [data, setData] = useState([]);
  // console.log("datahfjjjfffvnbvnbgbgb=", data)

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Proforma";

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/api/GetAllperformainvoice", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {

        throw new Error("Network response was not ok");
      }
      const dataset = await response.json();
      setData(dataset);
      console.log(dataset);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle user update api

  const updateAction = async (id) => {
    const response = await fetch(`${url}/api/Getperformainvoice/${id}`, {
      headers: { Authorization: Token },
    });
    const json = await response.json();
    const encodedData = encodeURIComponent(JSON.stringify(json));
    navigate(`/addproforma?data=${encodedData}`);
    console.log("encodedData")
console.log(encodedData)
  };

  // handle continue and discontinue status

  const handleStatus = async (id, dis) => { };

  const navigate = useNavigate();
  const Ridirectaddproforma = () => {
    navigate("/addproforma");
  };


  const generatePDF = async (id) => {

    const response = await fetch(`${url}/api/Getperformainvoice/${id}`, { headers: { Authorization: Token } });
    const json = await response.json();

    const companyresponse = await fetch(`${url}/Company`, { headers: { Authorization: Token } });
    const cmpdata = await companyresponse.json();

    const ProductResponse = await fetch(`${url}/getAllProduct`, { headers: { Authorization: Token } });
    const Productdata = await ProductResponse.json();

    const AllPiProduct = json.performaInvoiceDetails.map((item) => item.prdcd)
    const matchingProducts = Productdata.filter((product) => AllPiProduct.includes(product.prdcd));

    const productnetwgt = matchingProducts.map((item) => {
      return { prdcd: item.prdcd, wgt: item.prdnetWgt };
    });

    // const productmasters = matchingProducts.map((Box) => {
    //   let sumPcsprcrtn = 0;

    //   Box.forEach((item) => {
    //     if (item.crtnType === "Master") {
    //       sumPcsprcrtn += item.pcsprcrtn;
    //     }
    //   });

    //   return { pcsprcrtn: sumPcsprcrtn, prdcd: Box.length > 0 ? Box[0].prdcd : '' };
    // });



    // if (item.crtnType === "Master") {
    //   return { prdcd: item.prdcd, pcsprcrtn: item.pcsprcrtn };
    // }
    // return ""

    console.log("Productdata")
    console.log(Productdata)

    console.log("matchingProducts")
    console.log(matchingProducts)


    console.log("productmasters")
    console.log("productmasters")

    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(12.5);
    const pageWidth = 297;
    const pageHeight = 210;
    const leftMargin = 5;
    const rightMargin = 5;
    const topMargin = 5;
    const bottomMargin = 5;

    const boxWidth = pageWidth - leftMargin - rightMargin;
    const boxHeight = pageHeight - topMargin - bottomMargin;

    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.rect(leftMargin, topMargin, boxWidth, boxHeight);

    // image
    const image = `${url}/${cmpdata[0].url}`
    doc.addImage(image, 'JPEG', leftMargin + 5, topMargin + 2, 50, 15);

    //line
    doc.setFillColor(0, 0, 0);
    doc.rect(5, 25, pageWidth - leftMargin * 2, 0.2, "F");

    const cmpname = `${cmpdata[0].companyName}`;
    const cmpnamewidth = (doc.getStringUnitWidth(cmpname) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.text(cmpname, pageWidth - cmpnamewidth - leftMargin, topMargin + 4);

    const cmpaddress = `${cmpdata[0].address} ${cmpdata[0].city} ${cmpdata[0].state} ${cmpdata[0].pinNo} (${cmpdata[0].country})`;
    const cmpaddresswidth = (doc.getStringUnitWidth(cmpaddress) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.text(cmpaddress, pageWidth - cmpaddresswidth - leftMargin - 4, 13);

    const cmpwebemail = `website :${cmpdata[0].website} Email : ${cmpdata[0].email}  `;
    const cmpwebemailwidth = (doc.getStringUnitWidth(cmpwebemail) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.text(cmpwebemail, pageWidth - cmpwebemailwidth - 8, 17);

    const cmpphone = `Ph. : 9856747548`;
    const cmpphonewidth = (doc.getStringUnitWidth(cmpphone) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.text(cmpphone, pageWidth - cmpphonewidth - 10, 21);



    const estimateForm = `Estimate Form`;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.text(estimateForm, (pageWidth - 10) / 2, 31);

    //line
    doc.setFillColor(0, 0, 0);
    doc.rect(5, 33, pageWidth - leftMargin * 2, 0.2, "F");




    const date1 = new Date(json.delivaryDate);
    const formattedDate = `${date1.getDate()}/${date1.getMonth() + 1}/${date1.getFullYear()}`;

    const dispatdt = `Dispatch Date : ${formattedDate}`;
    const dispatchdtwidth = (doc.getStringUnitWidth(dispatdt) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.text(dispatdt, pageWidth - dispatchdtwidth - 10, 31);

    //line 
    doc.setFillColor(0, 0, 0);
    doc.rect(5, 40, pageWidth - leftMargin * 2, 0.2, "F");

    const tableData = json.performaInvoiceDetails.map((item, i) => {

      const matchingProductNetWgt = productnetwgt.find(product => product.prdcd === item.prdcd);

      return [
        i + 1,
        item.prdname,
        item.prdcd,
        item.prdqty,
        "",
        "",
        "",
        "",
        matchingProductNetWgt ? matchingProductNetWgt.wgt : '',
        matchingProductNetWgt ? (matchingProductNetWgt.wgt * item.prdqty).toFixed(2) : '',
        item.price,
        item.totalamount,
      ];
    });

    // const tableData = [
    //   ["1", "BPO#001", "photo1.jpg", "001", "Product A", 5, 10.99, 54.95],
    //   ["2", "BPO#002", "photo2.jpg", "002", "Product B", 3, 8.99, 26.97],
    //   ["3", "BPO#003", "photo3.jpg", "003", "Product C", 2, 15.99, 31.98],
    //   ["4", "BPO#003", "photo3.jpg", "003", "Product C", 2, 15.99, 31.98],
    //   ["5", "BPO#003", "photo3.jpg", "003", "Product C", 2, 15.99, 31.98],
    //   ["6", "BPO#003", "photo3.jpg", "003", "Product C", 2, 15.99, 31.98],

    // ];

    doc.autoTable({
      startY: 40,
      startX: 5,
      head: [
        [
          "SR.No",
          "Item",
          "Model No",
          "Order Qty",
          "Short /Excess",
          "Ready To Dispatch Qty",
          "No Of Packages",
          "Total Packages",
          "Weight",
          "Total Weight",
          "MRP",
          "Total Amount",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        textColor: 255,
        fontSize: 10,
      },
      margin: { left: 5 },
      tableWidth: pageWidth - leftMargin * 2,
      columnStyles: {

      },
    });



    var lastTableHeight = doc.lastAutoTable.finalY;



    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{overflow:"hidden"}}>
        <ExportExcelPI
          show={isExportCSV}
          data={data}
          onCloseClick={() => setIsExportCSV(false)}
        />
        <Container fluid>
          <BreadCrumb  pageName="Manage Pi"  subTitle="Manage Pi" buttons={<div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
            <button
              className="btn add-btn main-bg"
              onClick={Ridirectaddproforma}
            >
              <i className="ri-add-fill me-1 align-bottom"></i> Add
            </button>
            <button
              className="btn btn-soft-success"
              onClick={() => setIsExportCSV(true)}
            >
              Export
            </button>
          </div>} />
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
export default Proforma;
