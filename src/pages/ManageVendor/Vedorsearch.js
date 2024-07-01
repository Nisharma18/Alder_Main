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



const Vedorsearch = () => {

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
        Header: " Vendor Po code",
        accessor: "vendorpocd",
        filterable: false,
      },
      {
        Header: "Vendor Name",
        accessor: "vendorName",
        filterable: false,
      },
      {
        Header: "Delivery Date",
        accessor: "deliverydate",
        filterable: false,
        Cell: ({ value }) => {
          if (!value) { return ''; }
          const date = new Date(value);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        Header: "Status",
        accessor: "autherizeStatus",
        filterable: false,
      },
      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Vendor Detail">
                <i
                  class="ri-store-line"
                  onClick={() => Venderpodialogueopen(row.row.original.vendorpocd)}
                ></i>
              </li>

              <li className="list-inline-item edit" title="View">
                <i
                  className="ri-eye-line fs-16"
                  onClick={() => parteyeopen(row.row.original.vendorpocd)}
                ></i>
              </li>

                {row.row.original.autherizeStatus == 'Pending' ?(
                  <li className="list-inline-item edit" title="Update" style={{ cursor: "pointer" }}>
                  <i
                    className="ri-pencil-line fs-16"
                  onClick={() => updateAction(row.row.original.rwid)}
                  ></i>
                  </li>
                ):(
                <li className="list-inline-item edit"  title="Update" style={{ cursor: "pointer" }}>
                  <i
                    className="ri-pencil-fill fs-16"
                    style={{ filter: "blur(1px)" }}
                  ></i>
                </li>
                )
                }

             

              <li className="list-inline-item edit" title="PDF">
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

  const vendorInfo = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,
        filterable: false,
        sortType: (rowA, rowB) => rowB.value - rowA.value,
      },

      {
        Header: " Vendor Po code",
        accessor: "vendorpocd",
        filterable: false,
      },
      {
        Header: "Buyer Po",
        accessor: "buyerpo",
        filterable: false,
        Cell: () => {
          return (
            <p style={{textAlign:'center'}}>-</p>
          )
        }
      },
      {
        Header: "Product/Part Code",
        accessor: "productPartcd",
        filterable: false,
      },
      {
        Header: "Description",
        accessor: "description",
        filterable: false,
      },
      {
        Header: "Issue Qty",
        accessor: "issueQty",
        filterable: false,
      },
    ],
    []
  );


  const Qrtabledatacolumn = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,
        filterable: false,
        sortType: (rowA, rowB) => rowB.value - rowA.value,
      },

      {
        Header: " Vendor Po code",
        accessor: "vendorpocd",
        filterable: false,
      },
      {
        Header: "Vendor Name",
        accessor: "vendorname",
        filterable: false,
      },
      {
        Header: "Buyer Po",
        accessor: "buyerpo",
        filterable: false,
      },
      {
        Header: "Product Code",
        accessor: "prdcd",
        filterable: false,
      },
      {
        Header: "Part Code",
        accessor: "partcd",
        filterable: false,
      },
      {
        Header: "Product Name",
        accessor: "productName",
        filterable: false,
      },

      {
        Header: "Part Name ",
        accessor: "partName",
        filterable: false,
      },

      {
        Header: " QR Code",
        accessor: "partbarcd",
        filterable: false,
      },
      {
        Header: "Qty",
        accessor: "qty",
        filterable: false,
      },
      {
        Header: "Receive Status",
        accessor: "receiveStatus",
        filterable: false,
      },
    ],
    []
  );

  const [error, seterror] = useState(false);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [modalDoc, setModalDoc] = useState(false);
  const [modaleye, setModaleye] = useState(false)
  const [vendorproductpartshow, setVendorproductpartshow] = useState([]);
  const [Qrtabledata, setQrtabledata] = useState([]);
console.log("Qrtabledata=====", Qrtabledata)
console.log("vendorproductpartshow====", vendorproductpartshow)

  const Venderpodialogueopen = (vendorCode) => {
    setModalDoc(true);
    fetchproductandpartinfo(vendorCode);
  };

  const Vendpodialogueclose = () => {
    setModalDoc(false);
  };

  const fetchproductandpartinfo = async (vendorcode) => {
    try {
      const [Vendor, Product] = await Promise.all([
        fetch(`${url}/VendorPo`, { headers: { Authorization: Token } }),
        fetch(`${url}/getAllProduct`, { headers: { Authorization: Token } }),
      ]);
      const vendor = await Vendor.json();
      const allvendordetails = vendor.reduce((acc, item) => [...acc, ...item.vendorPoDetails], []);
      const filtervendor = allvendordetails.filter((item) => item.vendorpocd === vendorcode);
      setVendorproductpartshow(filtervendor);
      console.log("setVendorproductpartshow");
      console.log(filtervendor);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const parteyeopen = (vendorCode) => {
    setModaleye(true);
    fetchDataQr(vendorCode);
  };

  const parteyeclose = () => {
    setModaleye(false);
  };


  const fetchDataQr = async (vendorcode) => {
    try {
      const params = new URLSearchParams();
      params.append('vendorpocd', vendorcode);

      const url1213 = `${url}/VendorPo/Receives?${params.toString()}`;
      const options = {
        method: 'GET',
        headers: {
          Authorization: Token,
        },
      };


      try {
        const response = await fetch(url1213, options);
        if (response.ok) {
          const vendor = await response.json();
          console.log(vendor);
          setQrtabledata(vendor);
        } else {
          console.error('Request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };


  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Order";

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/VendorPo", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const dataset = await response.json();
      setData(dataset);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle user update api

  const navigate = useNavigate();
  const updateAction = async (id) => {
    const response = await fetch(`${url}/VendorPo/${id}`, {
      method: "GET",
      headers: {
        Authorization: Token,
      },
    });
    const json = await response.json();
    const encodedData = encodeURIComponent(JSON.stringify(json));
    navigate(`/vendor-create?data=${encodedData}`);
  };

  // handle continue and discontinue status

  const generatePDF = async (id) => {

    const response = await fetch(`${url}/VendorPo/${id}`, { headers: { Authorization: Token } });
    const json = await response.json();

    const companyresponse = await fetch(`${url}/Company`, { headers: { Authorization: Token } });
    const cmpdata = await companyresponse.json();

    const ResponseLedger = await fetch(`${url}/getAllLedger`, { headers: { Authorization: Token } });
    const Ledgerdata = await ResponseLedger.json();
    const vendornm = json.vendorName;
    const vendordata = Ledgerdata.filter(item => item.partytype === 'Vendor' && item.lednm.toLowerCase() === vendornm.toLowerCase());

    console.log(vendordata)
    const status = json.autherizeStatus == "Pending" ? "UnAuthorized" : "Authorized"
    const doc = new jsPDF("p", "mm", "a4");
    const headerText = "Purchase Order";
    const headertext2 = `${status}`;
    const headertext3 = "Original";
    const headingVendor = "Vendor";
    const headingAddress = "Delivary Address";

    doc.setFontSize(12.5);
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
    doc.setFillColor(32, 76, 124);
    doc.rect(5.5, 5, 199.5, 10, "F");
    doc.setFillColor(192, 192, 192);
    doc.rect(5, 5, 200, 10, "S");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");

    doc.text(headerText, 95, 12, { align: "center" });
    doc.text(headertext2, leftMargin + 5, 12);
    doc.text(headertext3, pageWidth - rightMargin - 5, 12, { align: "right" });

    // image
    const image = `${url}/${cmpdata[0].url}`
    doc.addImage(image, 'JPEG', leftMargin + 5, topMargin + 15, 60, 30);



    const address = `${cmpdata[0].address} ${cmpdata[0].city}  ${cmpdata[0].state} \n${cmpdata[0].pinNo} (${cmpdata[0].country})`;;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(address, leftMargin + 1, 55);

    console.log("cmpdata")
    console.log(cmpdata)
    const CMPGSTIN = `GSTIN : ${cmpdata[0].gstNo}`;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(CMPGSTIN, leftMargin + 1, 67);


    const CMPPhone = `Phone : `;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(CMPPhone, leftMargin + 1, 72);

    const CMPEmail = `Email : ${cmpdata[0].email} `;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(CMPEmail, leftMargin + 1, 77);

    // Text on the right side
    const date1 = new Date(json.createdt);
    const formattedDate = `${date1.getDate()}/${date1.getMonth() + 1}/${date1.getFullYear()}`;

    const delivarydt = new Date(json.deliverydate);
    const formattedDate1 = `${delivarydt.getDate()}/${delivarydt.getMonth() + 1}/${delivarydt.getFullYear()}`;
    //static
    const date = `Date : `;
    doc.setFont("helvetica", "bold");
    const textWidth = (doc.getStringUnitWidth(date) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.text(date, pageWidth - textWidth - 67, 20);
    //data
    const dated = `${formattedDate}`;
    doc.setFont("helvetica", "bold");
    doc.text(dated, 170, 20);


    // stativ
    const PONO = "PO NO : ";
    doc.setFont("helvetica", "bold");
    const textWidth1 = (doc.getStringUnitWidth(PONO) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.text(PONO, pageWidth - textWidth1 - 63, 25);
    //data
    const PONOd = `${json.vendorpocd}`;
    doc.setFont("helvetica", "bold");
    doc.text(PONOd, 170, 25);

    const DelDate = "Del. Date : ";
    doc.setFont("helvetica", "bold");
    const textWidth2 = (doc.getStringUnitWidth(DelDate) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.text(DelDate, pageWidth - textWidth2 - 60, 30);

    //data
    const DelDated = `${formattedDate1}`;
    doc.setFont("helvetica", "bold");
    doc.text(DelDated, 170, 30);

    // Style and position for headertext2
    doc.setFillColor(32, 76, 124);
    doc.rect(100, 35, 105, 7, "F");
    doc.setFillColor(192, 192, 192);
    doc.rect(100, 35, 105, 7, "S");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255);
    doc.setFontSize(12.5);
    doc.text(headingVendor, leftMargin + 135, 40);

    const vendorname = `${vendordata[0].lednm}`;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.text(vendorname, 100, 48);
    const add = `${vendordata[0].buyerDetail[0].billAddress1} ${vendordata[0].buyerDetail[0].billCity} ${vendordata[0].buyerDetail[0].billState} India `;
    const truncatedText = add.substring(0, (122 / doc.internal.scaleFactor) - 2) + '...';
    const Address = `Address : ${truncatedText}`;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(Address, 100, 53);



    const Contactno = `Contact No : ${vendordata[0].buyerDetail[0].billMobNo}`;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(Contactno, 100, 58);

    const GSTIN = `GSTIN/UIN :  ${vendordata[0].buyerDetail[0].billGst}`;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(GSTIN, 100, 63);

    doc.setFillColor(32, 76, 124);
    doc.rect(100, 67, 105, 7, "F");
    doc.setFillColor(192, 192, 192);
    doc.rect(100, 67, 105, 7, "S");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255);
    doc.setFontSize(12.5);
    doc.text(headingAddress, leftMargin + 130, 72);

    const deladdress = ``;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(deladdress, pageWidth - rightMargin - 105, 78);

    const tableData = json.vendorPoDetails.map((item, i) => {
      return [
        i + 1,
        `${item.buyerpo}/Alias`,
        "",
        item.productPartcd,
        `${item.description}\n${item.size}`,
        item.issueQty,
        item.rate,
        item.totalAmount,
      ];
    });


    doc.autoTable({
      startY: 85,
      startX: 5,
      head: [
        [
          "SO#",
          "BPO# /Alias",
          "Photo",
          "Item#",
          "Description",
          "Qty",
          "Unit Price",
          "Total",
        ],
      ],
      body: tableData,
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          const itemValue = tableData[data.row.index][3];
          const imageSrc = `${url}/image/ProductImages/${itemValue}`;
          if (imageSrc && typeof imageSrc === 'string') {
            doc.addImage(imageSrc, 'JPEG', data.cell.x + 2, data.cell.y + 1, 10, 10);
          } else if (imageSrc && typeof imageSrc === 'object' && imageSrc.imageData) {
            doc.addImage(imageSrc.imageData, 'JPEG', data.cell.x + 2, data.cell.y + 1, 10, 10);
          } else {
            // Do nothing when it's neither a string nor an image object (text data)
          }
        }
      },
      theme: "grid",
      headStyles: {
        fillColor: [32, 76, 124],
        textColor: 255,
        fontSize: 10,
      },
      margin: { left: 5 },
      tableWidth: 200,
      columnStyles: {
        1: { cellWidth: 30 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },

      },
    });

    var lastTableHeight = doc.lastAutoTable.finalY;
    var lineThickness = 0.5;
    var startX = 5;
    var endX = 200;
    var y = lastTableHeight;
    doc.setFillColor(0, 0, 0);
    doc.rect(startX, y, endX, lineThickness, "F");

    doc.setFillColor(32, 76, 124);
    doc.rect(5, lastTableHeight, 120, 5, "F");
    doc.setFillColor(192, 192, 192);
    doc.rect(5, lastTableHeight, 120, 5, "S");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255);
    doc.setFontSize(10);
    doc.text("Note :", 7, lastTableHeight + 4);

    //Right box total
    const totalamt = json.vendorPoDetails.reduce((total, item) => total + item.totalAmount, 0);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`Total     : \t\t\t\t\t\t${totalamt}`, 130, lastTableHeight + 5);
    doc.text(`CGST 9.0% : \t\t\t\t\t\t `, 130, lastTableHeight + 10);
    doc.text(`SGST 9.0% :\t\t\t\t\t\t `, 130, lastTableHeight + 15);
    doc.text(`G.Total   :\t\t\t\t\t\t `, 130, lastTableHeight + 20);

    //hindi text
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("Mangal");
    doc.text("  ", 6, lastTableHeight + 10);
    doc.text("  ", 6, lastTableHeight + 14);
    doc.text("  ", 6, lastTableHeight + 18);
    doc.text("  ", 6, lastTableHeight + 22);

    //line
    doc.setFillColor(200, 200, 200);
    doc.rect(5, lastTableHeight + 25, 120, 0.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("Instruction :", 7, lastTableHeight + 28);

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("", "Normal");
    doc.text(" -- Subject To Jodhpur jurisdiction only:", 6, lastTableHeight + 32);

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("", "Normal");
    doc.text(" -- Goods will not received without purchase / Job Order.:", 6, lastTableHeight + 36);

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("", "Normal");
    doc.text(" -- if Goods Not Delivered /inspected on time. 5% late Delivery charges per \nweek will be  cancelled:", 6, lastTableHeight + 40);

    // lines
    doc.setFillColor(0, 0, 0);
    doc.rect(5, lastTableHeight + 46, 200, 0.2, "F");

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Remark : ${json.remark}`, 6, lastTableHeight + 50);

    // lines
    doc.setFillColor(0, 0, 0);
    doc.rect(5, lastTableHeight + 54, 200, 0.2, "F");

    doc.setFillColor(0, 0, 0);
    doc.rect(125, lastTableHeight, 0.2, 46, "F");



    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("", "Normal");
    doc.text("Vendor Signature :-", 6, lastTableHeight + 58);

    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  };


  const RidirectaddVendor = () => {
    navigate("/vendor-create");
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
          <BreadCrumb 
          // title="Vendor PO Detail" pageTitle="Manage Vendor" 
          pageName="Vendor PO Detail"  subTitle="Vendor PO Detail" 
          buttons={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
              <button
                className="btn add-btn main-bg"
                onClick={RidirectaddVendor}
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
                    {data.length > 0 ? (
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

      <Modal
        size="lg"
        backdrop={"static"}
        isOpen={modalDoc}
        toggle={() => setModalDoc(!modalDoc)}
        modalClassName="zoomIn"
        centered
      >
        <ModalHeader
          toggle={() => setModalDoc(!modalDoc)}
          className="p-3 bg-success-subtle"
        >
          Vendor Po
        </ModalHeader>
        <ModalBody>
          {data.length > 0 ? (
            <TableContainer
              columns={vendorInfo}
              data={vendorproductpartshow || []}
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
            <Loader error={error} />
          )}
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <Button color="light" onClick={Vendpodialogueclose}>
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        size="xl"
        backdrop={"static"}
        isOpen={modaleye}
        toggle={() => setModaleye(!modaleye)}
        modalClassName="zoomIn"
        centered
      >
        <ModalHeader
          toggle={() => parteyeclose(!modaleye)}
          className="p-3 bg-success-subtle"
        >
          Vendor Po QR Code
        </ModalHeader>
        <ModalBody>
          {data.length > 0 ? (
            <TableContainer
              columns={Qrtabledatacolumn}
              data={Qrtabledata || []}
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
            <Loader error={error} />
          )}
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <Button color="light" onClick={parteyeclose}>
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};
export default Vedorsearch;
