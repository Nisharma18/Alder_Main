import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Col, Container, Row, Card, CardHeader, CardBody } from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
// Export Modal
import ExportExcelOrder from "../../Components/Common/ExportExcelOrder";
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

const OrderSearch = () => {
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;

  // Column
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,
        filterable: false,
      },
      {
        Header: "Buyer Name",
        accessor: "buyername",
        filterable: false,
      },
      {
        Header: "BPO",
        accessor: "buyerPo",
        filterable: false,
      },
      {
        Header: "Order No",
        accessor: "ordcd",
        filterable: false,
      },

      {
        Header: "Receive Date",
        accessor: "autherizedate",
        filterable: false,
        Cell: ({ value }) => {
            const date = new Date(value);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1
              }/${date.getFullYear()}`;
            return formattedDate;
        },
      },
      {
        Header: "Dispatch Date",
        accessor: "dispatchdate",
        filterable: false,
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1
            }/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        Header: "Qty",
        accessor: (item) => {
          const sum = item.orderDetails.reduce(
            (acc, data) => acc + data.qty,
            0
          );
          return sum;
        },
        filterable: false,
      },
     
      {
        Header: " Create Date",
        accessor: "createdt",
        filterable: false,
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1
            }/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      // {
      //   Header: " Auth Date",
      //   accessor: "autherizedate",
      //   filterable: false,
      //   Cell: ({ value }) => {
      //     if (value) {
      //       const date = new Date(value);
      //       const formattedDate = `${date.getDate()}/${date.getMonth() + 1
      //         }/${date.getFullYear()}`;
      //       return formattedDate;
      //     } else {
      //       return "";
      //     }
      //   },
      // },
      {
        Header: "Status",
        accessor: "autherizestatus",
        filterable: false,
      },

      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              {row.row.original.autherizestatus == "Pending" ? (
                <li className="list-inline-item edit"  title="Update" style={{ cursor: "pointer" }}>
                  <i
                    className="ri-pencil-fill fs-16"
                    onClick={() => updateAction(row.row.original.rwid)}
                  ></i>
                </li>
              ) : (
                <li className="list-inline-item edit"  title="Update" style={{ cursor: "pointer" }}>
                  <i
                    className="ri-pencil-fill fs-16"
                    style={{ filter: "blur(1px)" }}
                  ></i>
                </li>
              )}
              <li className="list-inline-item edit" title="PDF" style={{ cursor: "pointer" }}>
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

  console.log("data--order===========" , data)

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Order";

  const [tabledata, settabledata] = useState([]);
  const [allproduct, setAllproduct] = useState([]);
  const [Allpart, setAllpart] = useState([]);

  useEffect(() => {
    fetchData1();
  }, []);

  const fetchData1 = async () => {
    try {
      const [Order, Product, Part] = await Promise.all([
        fetch(`${url}/getAllOrder`, { headers: { Authorization: Token } }),
        fetch(`${url}/getAllProduct`, { headers: { Authorization: Token } }),
        fetch(`${url}/getAllParts`, { headers: { Authorization: Token } }),
      ]);
      const order = await Order.json();
      const products = await Product.json();
      const part = await Part.json();
      console.log(part);

      setAllpart(part);
      setAllproduct(products);
      settabledata(order);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle order get api
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/getAllOrder", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
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
    const response = await fetch(`${url}/getOneOrder/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const encodedData = encodeURIComponent(JSON.stringify(json));
    navigate(`/order-create?data=${encodedData}`);
  };

  const navigate = useNavigate();
  const Ridirectaddproforma = () => {
    navigate("/order-create");
  };

  const generatePDF = async (id) => {
    fetchData1();
    const response = await fetch(`${url}/getOneOrder/${id}`, {
      headers: { Authorization: Token },
    });
    const json = await response.json();
    const response1 = await fetch(`${url}/getAllProduct`, {
      headers: { Authorization: Token },
    });
    const allproduct1 = await response1.json();
    const response2 = await fetch(`${url}/getAllParts`, {
      headers: { Authorization: Token },
    });
    const Allpart1 = await response2.json();

    const prdcd = json.orderDetails.map((item) => item.productPartCd);
    const qty = json.orderDetails.map((item) => item.qty);
    const subordcd = json.orderDetails.map((item) => item.subordcd);
    const matchingProducts = allproduct1.filter((product) =>
      prdcd.includes(product.prdcd)
    );
    const matchingparts = Allpart1.filter((product) =>
      prdcd.includes(product.partCode)
    );
    const matchingResults = [...matchingProducts, ...matchingparts];

    console.log(allproduct);
    console.log("allproduct");

    console.log(matchingProducts);
    console.log("matchingProducts");

    console.log(Allpart);
    console.log("Allpart");

    console.log(matchingparts);
    console.log("matchingparts");

    console.log(prdcd);
    console.log("prdcd");

    console.log(matchingResults);
    console.log("matchingResults");

    const items = matchingResults.map((item) => ({
      prdcd: item.prdcd || item.partCode,
      prdnm: item.prdnm || item.partName,
      finish: item.prdfinish,
      cmbpercrtn: (item.productBox || []).map((box) =>
        box.crtnType === "Master" ? box.pcsprcbm : ""
      ),
      size:
        item.prdlen && item.prdwid && item.prdheight
          ? `${item.prdlen}x${item.prdwid}x${item.prdheight}`
          : `${item.length}x${item.width}x${item.height}`,
      noOfCrtn: Array.isArray(item.productBox) ? item.productBox.length : "",
    }));

    let urls = {};
    for (const item of matchingProducts) {
      const imageUrlResponse = await fetch(
        `${url}/image/ProductImage/${item.rwid}`
      );
      const imageUrlBlob = await imageUrlResponse.blob();
      const imageUrl = URL.createObjectURL(imageUrlBlob);
      urls[item.rwid] = imageUrl;
    }

    const doc = new jsPDF("l", "mm", "a4");
    const headerText = "ERPDADDY";
    const summaryHeaderText = "Order Detail (Summary)";

    const buyer = `Buyer: ${json.buyername}`;
    const BuyerPo = `Buyer Po: ${json.buyerPo}`;
    const OrderNo = `order No :  ${json.ordcd}`;

    doc.setFontSize(12);
    doc.text(headerText, 145, 12, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(0); // Reset text color to black
    doc.text(summaryHeaderText, 145, 18, { align: "center" });

    // Adjust this value to control the spacing between texts

    doc.setFontSize(12);
    doc.text(buyer, 17, 30);
    doc.text(BuyerPo, 120, 30);
    doc.text(OrderNo, 230, 30);

    // perpcscbm
    const cmbpercrtn = matchingProducts.map((item) =>
      item.productBox.map((box) =>
        box.crtnType === "Master" ? box.pcsprcbm : ""
      )
    );
    const valuesArray = Object.values(cmbpercrtn).map((arr) => arr.join(","));
    const cmbpercrtn12 = valuesArray.map((str) => str.replace(/^,|,$/g, ""));
    const sum = cmbpercrtn12.reduce((acc, val) => acc + parseFloat(val), 0);
    const totalcbmpercrtn = sum.toFixed(4);
    const totalQty = qty.reduce((acc, curr) => acc + curr, 0);
    const totalcbm = qty.reduce((acc, curr) => acc + curr, 0);

    const tableData = items.map((item, i) => [
      i + 1,
      item.prdcd,
      subordcd[i],
      json.buyerPo,
      `${item.prdnm} \n${item.size}`,
      item.finish,
      item.cmbpercrtn.join(""),
      qty[i],
      item.remark,
    ]);

    tableData.push([
      { content: "Total :", colSpan: 7, styles: { halign: "center" } },
      { content: totalcbmpercrtn, colSpan: 1 },
      { content: "", colSpan: 1 },
      { content: totalcbm, colSpan: 1 },
    ]);

    tableData.push([
      { content: "", colSpan: 7 },
      {
        content: `Order Comment : ${json.orderComment}`,
        colSpan: 9,
        styles: { whiteSpace: "no wrap" },
      },
    ]);

    doc.autoTable({
      startY: 33,
      head: [
        [
          "S.No",
          "Item code/Alias P.Code",
          "Suborder",
          "Buyer Po",
          "Item name",
          "Finish",
          "CBM /ctn",
          "Qty",
          "Remark",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [70, 130, 180],
        textColor: 255,
        fontSize: 8,
      },
      columnStyles: {
        "*": { cellWidth: 50 },
      },
    });

    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{overflow:"hidden"}}>
        <ExportExcelOrder
          show={isExportCSV}
          data={data}
          onCloseClick={() => setIsExportCSV(false)}
        />
        <Container fluid>
          <BreadCrumb   pageName="Order Detail" subTitle="Order Detail" buttons={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
              <button
               className="btn add-btn main-bg"
                onClick={Ridirectaddproforma}
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
export default OrderSearch;
