import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CSVLink } from "react-csv";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import url from "../../pages/Base_url/Base_url";

const ExportExcelOrder = ({ show, onCloseClick, data }) => {
//   console.log("dataaaaaaaaaaaaaaaaa",data);

  const preprocessData = (data) => {
    console.log("data");
    console.log(data);
    return data.map(({ rwid, ...rest }) => {
    
      return { ...rest,  rwid};
    });
  };

  const filteredData = preprocessData(data);
  console.log("filteredData" ,filteredData)


  const handleExcelDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add column headers
    worksheet.columns = [
      { header: "S.No", key: "rwid", width: 8 },
      { header: "Buyer Name", key: "buyername", width: 20 },
      { header: "BPO", key: "buyerPo", width: 20 },
      { header: "Order No", key: "ordcd", width: 20 },
      { header: "Receive Date", key: "autherizedate", width: 32 },
      { header: "Dispatch Date", key: "dispatchdate", width: 32 },
      { header: "Qty", key: "qty", width: 15 },
      { header: "Create Date", key: "createdt", width: 32 },
      { header: "Status", key: "autherizestatus", width: 20 },
    ];

    // Make headers bold, add border, and set background color
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' } // Light gray color
      };
    });

    // Set header row height
    worksheet.getRow(1).height = 30;

    // Add rows and set row height
    filteredData.forEach((item, index) => {
        let totalQty = 0;
        if (item.orderDetails && Array.isArray(item.orderDetails)) {
          item.orderDetails.forEach(orderDetail => {
            totalQty += orderDetail.qty;
          });
        }
      const row = worksheet.addRow({
        rwid: index + 1, // Assuming rwid is the row number
        picd: item.picd,
        buyername: item.buyername,
        ordcd: item.ordcd,
        buyerPo: item.buyerPo,
        qty: totalQty,
        autherizedate: item.autherizedate,
        autherizestatus: item.autherizestatus,
        // qty: item.qty,
        createdt: item.createdt,
        dispatchdate: item.dispatchdate,
      });

      // Set the height of the row to ensure the row height
      worksheet.getRow(row.number).height = 20; // Adjust row height as needed

      // Center text in 'Net Wgt' column vertically at the bottom and horizontally in the center
      worksheet.getCell(`H${row.number}`).alignment = { vertical: "bottom", horizontal: "center" };
    });

    // Save Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "exported-data.xlsx");
      onCloseClick();
    });
  };



  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
        <ModalHeader toggle={onCloseClick}></ModalHeader>
          <ModalBody className="py-3 px-5">
          <div className="mt-2 text-center">
              <lord-icon
                  src="https://cdn.lordicon.com/nocovwne.json"
                  trigger="loop"
                  colors="primary:#0ab39c,secondary:#f06548"
                  style={{ width: "100px", height: "100px" }}
              >
              </lord-icon>
              <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                  <h4>Are you sure ?</h4>
                  <p className="text-muted mx-4 mb-0">
                      Are you sure you want to export CSV file?
                  </p>
                  </div>
              </div>
              <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                  type="button"
                  className="btn w-sm btn-light"
                  data-bs-dismiss="modal"
                  onClick={onCloseClick}   
              >
                  Close
              </button>

              <button
                type="button"
                className="btn w-sm btn-success"
                id="export-record"
                onClick={handleExcelDownload}
              >
                Download
              </button>

              {/* <CSVLink
                  data={filteredData}
                  type="button"
                  onClick={onCloseClick}
                  className="btn w-sm btn-success "
                  id="delete-record" 
              >
              Download
              </CSVLink> */}

              </div>
      </ModalBody>
    </Modal>
  );
};

ExportExcelOrder.propTypes = {
  onCloseClick: PropTypes.func,
  data: PropTypes.any,
   show: PropTypes.any,
};

export default ExportExcelOrder;


