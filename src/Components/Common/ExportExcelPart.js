import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CSVLink } from "react-csv";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import url from "../../pages/Base_url/Base_url";

const ExportExcelPart = ({ show, onCloseClick, data }) => {
  // console.log("dataaaaaaaaaaaaaaaaa",data);

  const preprocessData = (data) => {
    if (!data || !Array.isArray(data)) {
      // console.error("Invalid data:", data);
      return [];
    }
  
    // console.log("data");
    // console.log(data);
    
    return data.map(({ id, ...rest }) => {
      // Ensure 'imagenm' is included
      const imageURL = `${url}/image/PartImage/${id}`;
      return { ...rest, imageURL, id };
    });
  };
  
  const filteredData = preprocessData(data);
  
  const handleExcelDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add column headers
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Image", key: "imageURL", width: 28 },
      { header: "Dimensions", key: "dimensions", width: 23 },
      { header: "Part Name", key: "partName", width: 20 },
      { header: "Part Code", key: "partCode", width: 20 },
      { header: "Part Barcode", key: "partBarCode", width: 20 },
      { header: "Net Wgt", key: "weight", width: 15 },
      { header: "Status", key: "sts", width: 15 }
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
    for (const item of filteredData) {
      const dimensions = `${item.length} x ${item.width} x ${item.height} ${item.unit}`;
      const row = worksheet.addRow({
        id: item.id,
        partCode: item.partCode,
        partName: item.partName,
        partBarCode: item.partBarCode,
        length: item.length,
        weight: item.weight,
        sts: item.sts,
        dimensions: `${item.length} x ${item.width} x ${item.height} ${item.unit}`,
      });

      // Set the height of the row to ensure the image fits
      worksheet.getRow(row.number).height = 100; // Adjust row height as needed

      // Center text in 'Net Wgt' column vertically at the bottom and horizontally in the center
      worksheet.getCell(`G${row.number}`).alignment = { vertical: "bottom", horizontal: "center" };

      // Fetch the image and add it to the row
      const imageURL = item.imageURL;

      const response = await fetch(imageURL);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onload = () => {
        const base64Image = reader.result.split(",")[1];

        // Add image to workbook
        const imageId = workbook.addImage({
          base64: base64Image,
          extension: "png" // Change to the actual image extension (jpg, png, etc.)
        });

        // Center the image in the cell
        worksheet.addImage(imageId, {
          tl: { col: 1.5, row: row.number - 0.8 }, // Adjust column and row positioning for centering
          ext: { width: 100, height: 100 } // Adjust image size as needed
        });

        // Center the image in the cell
        // worksheet.getCell(`B${row.number}`).alignment = { vertical: "middle", horizontal: "center" };

        // Save Excel file when all images are added
        if (filteredData.indexOf(item) === filteredData.length - 1) {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer]), "exported-data.xlsx");
            onCloseClick();
          });
        }
      };
    }
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

ExportExcelPart.propTypes = {
  onCloseClick: PropTypes.func,
  data: PropTypes.any,
   show: PropTypes.any,
};

export default ExportExcelPart;


