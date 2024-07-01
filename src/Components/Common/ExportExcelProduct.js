import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CSVLink } from "react-csv";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import url from "../../pages/Base_url/Base_url";

const ExportExcelProduct = ({ show, onCloseClick, data }) => {
  console.log("dataaaaaaaaaaaaaaaaa",data);

  const preprocessData = (data) => {
    console.log("data");
    console.log(data);
    return data.map(({ rwid, ...rest }) => {
      // Ensure 'imagenm' is included
      const imageURL =`${url}/image/ProductImage/${rwid}`;
      return { ...rest, imageURL , rwid};
    });
  };

  const filteredData = preprocessData(data);


  const handleExcelDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add column headers
    worksheet.columns = [
      { header: "S.No", key: "rwid", width: 8 },
      { header: "Image", key: "imageURL", width: 20 },
      { header: "Category", key: "categorynm", width: 20 },
      { header: "Product Name", key: "prdnm", width: 17 },
      { header: "Product Code", key: "prdcd", width: 15 },
      { header: "Alias code", key: "prdalias", width: 13 },
      { header: "Size", key: "size", width: 17 },
      { header: "Gross Wgt", key: "prdGrsWgt", width: 10 },
      { header: "CNF", key: "cnf", width: 10 },
      { header: "MRP", key: "ecomMrp", width: 10 },
     
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
      const row = worksheet.addRow({
        rwid: item.rwid,
        prdcd: item.prdcd,
        prdnm: item.prdnm,
        categorynm: item.categorynm,
        partBarCode: item.partBarCode,
        prdalias: item.prdalias,
        prdnetWgt: item.prdnetWgt,
        prdGrsWgt: item.prdGrsWgt,
        cnf: item.cnf,
        ecomMrp: item.ecomMrp,
        size: `${item.prdlen} x ${item.prdwid} x ${item.prdheight} ${item.prdunit}`,
      });

      // Set the height of the row to ensure the image fits
      worksheet.getRow(row.number).height = 100; // Adjust row height as needed

      // Center text in 'Net Wgt' column vertically at the bottom and horizontally in the center
      worksheet.getCell(`H${row.number}`).alignment = { vertical: "bottom", horizontal: "center" };

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

ExportExcelProduct.propTypes = {
  onCloseClick: PropTypes.func,
  data: PropTypes.any,
   show: PropTypes.any,
};

export default ExportExcelProduct;


