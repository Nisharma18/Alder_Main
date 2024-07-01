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
  Button,
  ModalFooter,
  FormGroup
} from "reactstrap";
import Select from "react-select";
import BreadCrumb from "../../Components/Common/BreadCrumb";
// image
import backimage from "./../../assets/images/upload.png";

import "./part.css";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainers";
// Formik
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import url from "../Base_url/Base_url";
import Token from "../Token/Base_Token";

const Part = () => {
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
        accessor: "id",
        filterable: false,
        Cell: ({ value }) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 ">
                <img
                  // src={`http://192.168.1.3:8085/image/PartImage/${value}`}
                  src={`${url}/image/PartImage/${value}`}
                  alt=""
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(6) ')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                  className="avatar-xs rounded-circle image-zoom"
                />
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Name",
        accessor: "partName",
        filterable: false,
      },
      {
        Header: "Code",
        accessor: "partCode",
        filterable: false,
      },
      {
        Header: "Barcode",
        accessor: "partBarCode",
        filterable: false,
      },
      {
        Header: "Dimensions",
        accessor: (data) =>
          `${data.length}x${data.width}x${data.height} ${data.unit}`,
        filterable: false,
      },
      {
        Header: "Net Wgt",
        accessor: "weight",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "sts",
        filterable: false,
      },

      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit"  title="Continue" style={{ cursor: "pointer" }}>
                <i
                  className="ri-pencil-line fs-16"
                  onClick={() => handleupdate(row.row.original.id)}
                ></i>
              </li>
              <li className="list-inline-item edit"title="Continue" style={{ cursor: "pointer" }}>
                {row.row.original.sts === "Active" ? (
                  <i
                    className="ri-lock-line fs-16"
                    onClick={() =>
                      handleStatus(
                        row.row.original.id, 
                        row.row.original.sts)
                    }
                    style={{ color: "green" }}
                  ></i>
                ) : (
                  <i
                    className="ri-lock-line fs-16"
                    title="Discontinue"
                    onClick={() =>
                      handleStatus(
                        row.row.original.id, 
                        row.row.original.sts)
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
  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Part";

  const [modalProject, setModalProject] = useState(false);
  const [Unit, setunit] = useState('CM');
  const [status, setStatus] = useState('Active');
  const [file, setFile] = useState(null);
  const [showfile, setShowfile] = useState();
  const [validPartName, setValidPartName] = useState(false);
  const [error, seterror] = useState(false);
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("Save");
  const [updatePartName, setUpdatePartName] = useState("");
  const [inputs, setinputs] = useState({
    partName: "",
    code: "",
    length: "",
    width: "",
    height: "",
    unit: "CM",
    weight: "",
    sts: "Active",
    cbm: "",
    strickerSize: "",
  });

  const allunit = [
    {
      options: [
        { label: "CM", value: "CM" },
        { label: "INCH", value: "Inch" },
        { label: "Square", value: "Square" },
      ],
    },
  ];

  const allstatus = [
    {
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  ];

  // handle user get api

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/getAllParts", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const responsedata = await response.json();
      setData(responsedata);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  function handleChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedTypes.includes(selectedFile.type)) {
        setShowfile(URL.createObjectURL(selectedFile));
        setFile(selectedFile);
      } else {
        toast.error("Selected Valid image.", {
          autoClose: 1000,
          position: "top-center",
        });
        setShowfile(null);
        setFile(null);
      }
    }
  }

  const handlechange = (e) => {
    if (e.target.name === "length") {
      if (e.target.value === "") {
        setinputs({ ...inputs, [e.target.name]: "" });
      } else {
        const newValue = e.target.value;
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          setinputs({ ...inputs, [e.target.name]: newValue });
        }
      }
    } else if (e.target.name === "width") {
      if (e.target.value === "") {
        setinputs({ ...inputs, [e.target.name]: "" });
      } else {
        const newValue = e.target.value;
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          setinputs({ ...inputs, [e.target.name]: newValue });
        }
      }
    } else if (e.target.name === "height") {
      if (e.target.value === "") {
        setinputs({ ...inputs, [e.target.name]: "" });
      } else {
        const newValue = e.target.value;
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          setinputs({ ...inputs, [e.target.name]: newValue });
        }
      }
    } else if (e.target.name === "weight") {
      if (e.target.value === "") {
        setinputs({ ...inputs, [e.target.name]: "" });
      } else {
        const newValue = e.target.value;
        const isValidDecimal = /^\d+(\.\d{1,3})?$/.test(newValue);
        if (isValidDecimal) {
          setinputs({ ...inputs, [e.target.name]: newValue });
        }
      }
    } else if (e.target.name === "partName") {
      if (inputs.id > 0) {
        checkduplicatepartnameupdatetime(e.target.value);
      } else {
        checkduplicatepartname(e.target.value);
      }

      setinputs({ ...inputs, [e.target.name]: e.target.value });
    } else {
      setinputs({ ...inputs, [e.target.name]: e.target.value });
    }

    setValidPartName(false);
  };

  const handleUnitChange = (selectedUnit) => {
    setunit(selectedUnit.value); // Update local state
    setinputs({ ...inputs, unit: selectedUnit.value }); // Update inputs state
    localStorage.setItem('selectedUnit', selectedUnit.value); // Save to localStorage
  };

  // Effect to set initial unit from localStorage
  useEffect(() => {
    const savedUnit = localStorage.getItem('selectedUnit');
    if (savedUnit) {
      setunit(savedUnit);
      setinputs({ ...inputs, unit: savedUnit });
    }
  }, []); 

  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus.value); // Update local state
    setinputs({ ...inputs, sts: selectedStatus.value }); // Update inputs state
    localStorage.setItem('selectedStatus', selectedStatus.value); // Save to localStorage
  };

  // Effect to set initial status from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem('selectedStatus');
    if (savedStatus) {
      setStatus(savedStatus);
      setinputs({ ...inputs, sts: savedStatus });
    }
  }, []);


  const [isExist, setIsExist] = useState(false);

  const checkduplicatepartname = async (data) => {
    try {
      const response = await fetch(url + "/getAllParts", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const responsedata = await response.json();

      const checkExistPartName = responsedata.some(
        (item) =>
          item.partName.trim().toLowerCase() === data.trim().toLowerCase()
      );
      setIsExist(checkExistPartName);

    } catch (error) {
      console.log("Error:", error);
    }
  };

  const checkduplicatepartnameupdatetime = async (data) => {
    try {
      const response = await fetch(url + "/getAllParts", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }
      const responsedata = await response.json();
      const filteredData = responsedata.filter(
        (item) => item.partName !== updatePartName
      );
      const checkExistPartName = filteredData.some(
        (item) =>
          item.partName.trim().toLowerCase() === data.trim().toLowerCase()
      );

      setIsExist(checkExistPartName);

    } catch (error) {
      console.log("Error:", error);
    }
  };

  const { unit, length, width, height } = inputs;

  const calculateVolume = () => {
    let volume = 0;

    if (unit === "Inch") {
      volume = (length * width * height) / 61023;
    } else if (unit === "Square") {
      volume = length * width;
    } else if (unit === "CM") {
      volume = (length * width * height) / 1000000;
    }

    return volume.toFixed(4);
  };

  useEffect(() => {
    const volume = calculateVolume();
    setinputs((prevInputs) => ({ ...prevInputs, cbm: volume }));
  }, [unit, length, width, height]);

  // handle data submit api

  const handleSubmit = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(inputs);
    let msg = inputs.id > 0 ? "Update" : "Save";

    if (isExist) {
      toast.error("Please select Diffrent Part Name", { position: "top-center" });
      return;
    }
    if (inputs.partName.trim() === "") {
      setValidPartName(true);
      toast.error("Invalid Part Name", {
        autoClose: 1000,
        position: "top-center",
      });
      return;
    }
    if (!file) {
      toast.error("Please select a Image.", { position: "top-center" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Selected Valid image.", { position: "top-center" });
      return;
    }

    if (file.name === "empty.jpg") {
      toast.error("Please select a  image..", { position: "top-center" });
      return;
    }

    fetch(url + "/Addpart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Token,
      },
      body: jsonData,
    })
      .then((response) => response.json())
      .then((data) => {
        imagesave(data.id);
        toast.success(
          "Part " + msg + " Successfully with code : " + data.partCode,
          { autoClose: 1200 }
        );
      })
      .catch((error) => {
        toast.error("An Error Occured", { autoClose: 1200 });
      });

    setinputs({
      partName: "",
      code: "",
      length: 0,
      width: 0,
      height: 0,
      unit: "",
      weight: 0,
      sts: "",
      cbm: 0,
      strickerSize: 0,
    });
    setShowfile(null);
    setModalProject(false);
  };

  const imagesave = async (rwid) => {
    const emptyImageData = new Blob([], { type: "image/png" });
    const emptyImageFile = new File([emptyImageData], "empty.jpg", {
      type: "image/png",
    });
    const formData = new FormData();
    if (file == null) {
      formData.append("image", emptyImageFile);
    } else {
      formData.append("image", file);
    }

    const response = await fetch(`${url}/upload/${rwid}`, {
      method: "POST",
      body: formData,
      headers: { Authorization: Token },
    });

    if (response.ok) {
      fetchData();
    } else {
    }
    setFile(null);
  };

  // handle update part api

  const handleupdate = async (id) => {
    const response = await fetch(url + `/getpart/${id}`, {
      headers: { Authorization: Token },
    });
    const json = await response.json();
    setinputs(json);
    setModalProject(true);
    setUpdatePartName(json.partName);

    const imageshow = `${url}/image/PartImage/${id}`;
    setShowfile(imageshow);
    setMode("Update Part");

    fetch(imageshow, { headers: { Authorization: Token } })
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const outputStream = reader.result;
          const imgfile = new Blob([outputStream], { type: "image/png" });
          const oldimgfile = new File([imgfile], `${json.imagenm}`, {
            type: "image/png",
          });
          setFile(oldimgfile);
        };
        reader.readAsArrayBuffer(blob);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };

  // handle continue and discontinue status
  const handleStatus = async (id, sts) => {
    let msg = "";
    if (sts == "Inactive") {
      sts = "Active";
      msg = "Active";
    } else {
      sts = "Inactive";
      msg = "Inactive";
    }
    const response = await fetch(url + `/getpart/${id}`, {
      headers: { Authorization: Token },
    });
    const json = await response.json();
    const updateJson = { ...json, sts: sts };

    fetch(url + `/activePart/${id}`, {
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
        toast.success(" Part " + ` ${msg} Successfully`, { autoClose: 1200 });
      })
      .catch((error) => {
        fetchData();
        toast.error(" An Error Occurred ");
      });
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
          <Row >
            <Col lg={12}>
              <BreadCrumb pageName="Manage Part" title="Manage Part"  
              buttons={
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
                  <button
                    className="btn add-btn main-bg"
                    onClick={() => {
                      setModalProject(true), setShowfile(null);
                    }}
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

            </Col>
            <Col lg={6}>

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
                        isAddUserList={false}
                        customPageSize={1000000000}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder="Search here..."
                      />
                    )}
                  </div>

                  <Modal
                    size="xl"
                    backdrop={"static"}
                    isOpen={modalProject}
                    toggle={() => setModalProject(!modalProject)}
                    modalClassName="zoomIn"
                    centered
                  >
                    <form onSubmit={handleSubmit}>
                      <ModalHeader
                        toggle={() => setModalProject(!modalProject)}
                        className="p-3 bg-primary-subtle">
                        Add Part
                      </ModalHeader>
                      <ModalBody>
                        <Row>
                          <Col lg={3}>
                            <Row>
                              <Col lg={12}>
                                <div className="image-show" style={{ border: showfile ? "" : "2px dotted grey" }}>
                                  {showfile ? <img
                                    src={showfile}
                                    alt="multiUser"
                                    id="companylogo-img"
                                    className="avatar-md  showimage"
                                    style={{ borderRadius: "1rem" }}
                                  /> : <><img
                                    src={backimage}
                                    alt="multiUser"
                                    id="companylogo-img"
                                    className="avatar-md backImag "
                                    style={{ borderRadius: "1rem" }}
                                  /> <span>Upload image</span> </>
                                  }
                                </div>
                              </Col>
                              <Col lg={6}>
                                <button className="upload-image upload-image-no-bg " type="button" onClick={() => setShowfile(null)}>
                                  <p>Remove</p>
                                </button>
                              </Col>
                              <Col lg={6}>
                                <button className="upload-image" type="button">
                                  <input
                                    name="img"
                                    id="company-logo-input"
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={handleChange}
                                  />
                                  <p>Upload Image</p>
                                </button>
                              </Col>
                            </Row>

                          </Col>
                          <Col lg={9}>
                            <Row>
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="Code"
                                  >
                                    Code
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="Code"
                                    disabled={true}
                                    readOnly=""
                                    value={inputs.partCode}
                                    placeholder="Code"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="Part-Name"
                                  >
                                    Part Name<span className="required">*</span>
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="Part-Name"
                                    name="partName"
                                    value={inputs.partName}
                                    onChange={handlechange}
                                    placeholder="Enter Part Name"
                                  />
                                  {validPartName && (
                                    <p
                                      className="text-danger"
                                      style={{ color: "red" }}
                                    >
                                      {" "}
                                      Enter Valid Part name.
                                    </p>
                                  )}

                                  {isExist && (
                                    <p style={{ color: "red" }}>
                                      {" "}
                                      Part is Already Exist
                                    </p>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="Status"
                                  >
                                    Status
                                  </Label>
                                  <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                  <Select
                                    value={{ label: status, value: status }}
                                    onChange={handleStatusChange}
                                    options={allstatus[0].options.map(option => ({ label: option.label, value: option.value }))}
                                  />
                                  </div>
                              
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="Sticker Size"
                                  >
                                    Sticker Size
                                  </Label>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="Sticker Size"
                                    name="strickerSize"
                                    value={inputs.strickerSize}
                                    onChange={handlechange}
                                    placeholder="Enter Size"
                                  />

                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup >
                                  <Label
                                    className="form-label"
                                    htmlFor="Unit"
                                  >
                                    Unit<span className="required">*</span>
                                  </Label>
                                  <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                    <Select
                                     value={{ label: Unit, value: Unit }}
                                     onChange={handleUnitChange}
                                     options={allunit[0].options.map(option => ({ label: option.label, value: option.value }))}
                                   />
                                
                                  </div>
                                  {/* <Input
                                    value={Unit}
                                    onChange={(e) => {
                                      setunit(e.target.value);
                                      setinputs({
                                        ...inputs,
                                        unit: e.target.value,
                                      });
                                    }}
                                    id="Unit"
                                    className="js-example-basic-single mb-0 basic-single"
                                    name="Unit"
                                    bsSize="sm"

                                    type="select"
                                  >
                                    {allunit.map((item) => {
                                      return (
                                        item.options.map(({ label, value }) => {
                                          return (
                                            <option value={value}>{label}</option>
                                          )
                                        })
                                      )
                                    })}
                                  </Input> */}
                                </FormGroup>
                              </Col>

                             
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="Width"
                                  >
                                    Width<span className="required">*</span>
                                  </Label>
                                  <Input
                                    className="form-control"
                                    id="Width"
                                    name="width"
                                    type="number"
                                    value={inputs.width}
                                    onChange={handlechange}
                                    placeholder="Enter width"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="Height"
                                  >
                                    Height<span className="required">*</span>
                                  </Label>
                                  <Input
                                    className="form-control"
                                    id="Height"
                                    name="height"
                                    type="number"
                                    value={inputs.height}
                                    onChange={handlechange}
                                    placeholder="Enter height"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="Length"
                                  >
                                    Length<span className="required">*</span>
                                  </Label>
                                  <Input
                                    className="form-control"
                                    id="Length"
                                    name="length"
                                    type="number"
                                    value={inputs.length}
                                    onChange={handlechange}
                                    placeholder="Enter Length"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="Weight"
                                  >
                                    Weight<span className="required">*</span>
                                  </Label>
                                  <Input
                                    className="form-control"
                                    id="Weight"
                                    name="weight"
                                    type="number"
                                    value={inputs.weight}
                                    onChange={handlechange}
                                    placeholder="Enter weight"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup>
                                  <Label
                                    className="form-label"
                                    htmlFor="CBM"
                                  >
                                    CBM<span className="required">*</span>
                                  </Label>
                                  <Input
                                    className="form-control"
                                    id="CBM"
                                    name="cbm"
                                    type="number"
                                    value={inputs.cbm}
                                  />
                                </FormGroup>
                              </Col>





                            </Row>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <Button
                            color="light"
                            size="sm"
                            onClick={() => {
                              setModalProject(false);
                              setinputs({
                                partName: "",
                                code: "",
                                length: 0,
                                width: 0,
                                height: 0,
                                unit: "CM",
                                weight: 0,
                                sts: "",
                                cbm: 0,
                                strickerSize: 0,
                              });
                              setShowfile(null);
                              setMode("Save Part");
                            }}
                          >
                            Close
                          </Button>
                          <Button type="submit" color="success" size="sm">
                            {mode}
                          </Button>
                        </div>
                      </ModalFooter>
                    </form>
                  </Modal>

                  <ToastContainer closeButton={true} limit={10} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div >
    </React.Fragment >
  );
};
export default Part;
