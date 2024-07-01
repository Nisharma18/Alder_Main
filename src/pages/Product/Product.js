import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Col,
  Row,
  Form,
  Label,
  Card,
  CardBody,
  Input,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import backimage from "./../../assets/images/upload.png";
// import backimage from "./../../assets/images/backimage.png";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import "./Product.css";
import url from "./../Base_url/Base_url";
import { useNavigate, useLocation } from "react-router-dom";

const Product = () => {
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;

  const [sortBy, setsortBy] = useState(null);
  const [status, setStatus] = useState(null);
  const [prdunit, setPrdunit] = useState(null);
  const [prdcolor, setprdcolor] = useState(null);
  const [prdfinish, setprdfinish] = useState(null);
  const [boxCarton, setBoxCarton] = useState(null);
  const [bunit, setbunit] = useState(null);
  const [category, setCategory] = useState([]);
  const [masterfinish, setMasterFinish] = useState([]);
  const [masterColor, setMasterColor] = useState([]);
  const [Allparts, setAllParts] = useState([]);
  const [partsTemp, setPartsTemp] = useState([]);
  const [validproductName, setValidproductName] = useState(false);
  const [validAliasName, setValidAliasName] = useState(false);
  const [partInputs, setPartInputs] = useState([]);
  const [file, setFile] = useState(null);
  const [showfile, setShowfile] = useState();
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [buttonmode, setButtonmode] = useState("Save");
  const [images, setImages] = useState([]);
  const [modalProject, setModalProject] = useState(false);

  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get("data");
    if (encodedData == null) {
    } else {

      const parsedData = JSON.parse(encodedData);
      setButtonmode("Update");
      setInputs(parsedData);

      setPartInputs(parsedData.parts);

      setBoxes(parsedData.productBox);

      setStatus({ label: parsedData.setStatus, value: parsedData.setStatus });
      setPrdunit({ label: parsedData.prdunit, value: parsedData.prdunit });
      setsortBy({ label: parsedData.categorynm, value: parsedData.categorycode, });
      setprdcolor({ label: parsedData.prdColor, value: parsedData.prdcolorcd });
      setprdfinish({ label: parsedData.prdfinish, value: parsedData.prdfinishcd, });

      // for single images
      var imageshow = `${url}/image/ProductImage/` + parsedData.rwid;
      setShowfile(imageshow);
      fetch(imageshow, { headers: { Authorization: Token, }, })
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const outputStream = reader.result;
            const imgfile = new Blob([outputStream], { type: "image/png" });
            const oldimgfile = new File([imgfile], `${parsedData.prdcd}`, {
              type: "image/png",
            });
            setFile(oldimgfile);
          };
          reader.readAsArrayBuffer(blob);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });

      parsedData.productMultiImages.map((item) => {
        const imagesurl = `${url}/image/` + item.url;
        fetch(imagesurl)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const outputStream = reader.result;
              const imgfile = new Blob([outputStream], { type: "image/png" });
              const oldimgfile = new File([imgfile], "empty.jpg", {
                type: "image/png",
              });
              setImages((prevImages) => [...prevImages, oldimgfile]);
            };
            reader.readAsArrayBuffer(blob);
          })
          .catch((error) => {
            console.error("Error fetching image:", error);
          });
      });
    }
  }, [location.search]);

  const [boxes, setBoxes] = useState([
    {
      crtnType: "",
      pcsprcrtn: "",
      pcsprcbm: "",
      boxlen: "",
      boxheight: "",
      boxunit: "",
      boxarea: "",
      boxWgt: "",
      boxwid: "",
    },
  ]);
  const [inputs, setInputs] = useState({
    reord_Qty: '',
    lot_moq_Qty: '',
    minStk_Qty: ''
});
  // {categorynm: "",categorycode: "",prdnm: "",prdalias: "",setStatus: "Single",prdlen: 0,prdwid: "",prdheight: 0,prdnetWgt: 0,prdunit: "",prdcolorcd: "",prdColor: "",prdfinishcd: "",prdfinish: "",ecomMrp: "",remark: "",cnf: "",},
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };
  
  useEffect(() => {
    // Example:
    fetch('your-fetch-api-endpoint')
    .then(response => response.json())
    .then(data => {
      // Update inputs state with fetched data
      setInputs(data);
    })
    .catch(error => {
      // Handle error
      console.error('Error fetching data:', error);
    });
  }, []);

  const handlechange = (e) => {
    if (e.target.name === "prdlen") {
      const newValue = e.target.value;
      if (e.target.value === "") {
        setInputs({ ...inputs, [e.target.name]: "" });
      } else {
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          setInputs({ ...inputs, [e.target.name]: newValue });
        }
      }

    } else if (e.target.name === "prdwid") {
      const newValue = e.target.value;
      if (e.target.value === "") {
        setInputs({ ...inputs, [e.target.name]: "" });
      } else {
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          setInputs({ ...inputs, [e.target.name]: newValue });
        }
      }
    } else if (e.target.name === "prdheight") {
      const newValue = e.target.value;
      if (e.target.value === "") {
        setInputs({ ...inputs, [e.target.name]: "" });
      } else {
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          setInputs({ ...inputs, [e.target.name]: newValue });
        }
      }
    } else if (e.target.name === "ecomMrp") {
      const newValue = e.target.value;
      if (e.target.value === "") {
        setInputs({ ...inputs, [e.target.name]: "" });
      } else {
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          setInputs({ ...inputs, [e.target.name]: newValue });
        }
      }
    } else {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    if (inputs.rwid == null || inputs.rwid === "") {
      if (e.target.name === "prdalias") {
        const inputvalue = e.target.value;
        checkAliasNameFromDB(inputvalue);
      }
    } else {
      if (e.target.name === "prdalias") {
        const inputvalue = e.target.value;
        checkAliasNameFromDBForUpdate(inputvalue);
      }
    }

    setValidproductName(false);
    setValidAliasName(false);
    setAlreadyExist(false);
  };

  const checkAliasNameFromDB = async (inputvalue) => {
    try {
      const response = await fetch(url + "/getAllProduct", {
        method: "GET",
        headers: {
          Authorization: Token,
        },
      });
      if (!response.ok) {
        console.error("Network response was not ok.");
        return;
      }

      const data = await response.json();
      const lowerCaseInput = inputvalue.trim().toLowerCase();
      const aliacode = data.some(
        (item) => item.prdalias.trim().toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(aliacode);
      console.log(aliacode);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkAliasNameFromDBForUpdate = async (inputvalue) => {
    try {
      const response = await fetch(url + "/getAllProduct", {
        method: "GET",
        headers: {
          Authorization: Token,
        },
      });
      if (!response.ok) {
        console.error("Network response was not ok.");
        return;
      }

      const data = await response.json();
      const lowerCaseInput = inputvalue.trim().toLowerCase();
      const aliacode = data.some(
        (item) => item.prdalias.trim().toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(aliacode);
      console.log(aliacode);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [Category, Color, Finish, Parts] = await Promise.all([
        fetch(`${url}/getAllCategory`, { method: "GET", headers: { Authorization: Token }, }),
        fetch(`${url}/getAllColors`, { method: "GET", headers: { Authorization: Token }, }),
        fetch(`${url}/getAllFinish`, { method: "GET", headers: { Authorization: Token }, }),
        fetch(`${url}/getAllParts`, { method: "GET", headers: { Authorization: Token }, }),
      ]);
      const categoryData = await Category.json();
      const filteredCategoryData = categoryData.filter((item) => item.dis === "NO"
      );
      setCategory(filteredCategoryData);

      const colordata = await Color.json();
      const continuecolor = colordata.filter((item) => item.dis === "NO");
      setMasterColor(continuecolor);

      const finishdata = await Finish.json();
      const continueFinish = finishdata.filter((item) => item.dis === "NO");
      setMasterFinish(continueFinish);

      const partsJson = await Parts.json();
      const filterparts = partsJson.filter((item) => item.sts === "Active");

      setAllParts(filterparts);
      setPartsTemp(filterparts);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const part = [
    {
      options: Allparts.map((item) => {
        return { label: item.partName, value: item.partCode };
      }),
    },
  ];

  const AllCategory = [
    {
      options: category.map((item) => {
        return { label: item.name, value: item.catcd };
      }),
    },
  ];
  console.log(category, "category");
  const setstatus = [
    {
      options: [
        { label: "Single", value: "single" },
        { label: "Multiple", value: "Multi" },
      ],

    },
  ];

  const unit = [
    {
      options: [
        { label: "CM", value: "cm" },
        { label: "Inch", value: "Inch" },
      ],
    },
  ];

  const Color = [
    {
      options: masterColor.map((item) => {
        return { label: item.name, value: item.clrcd };
      }),
    },
  ];

  const Finish = [
    {
      options: masterfinish.map((item) => {
        return { label: item.name, value: item.fincd };
      }),
    },
  ];

  const Cartontye = [
    {
      options: [
        { label: "Inner", value: "Inner" },
        { label: "Master", value: "Master" },
      ],
    },
  ];

  const Boxunit = [
    {
      options: [
        { label: "CM", value: "cm" },
        { label: "Inch", value: "inch" },
      ],
    },
  ];

  function handleFileChange(e) {
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

  const handleImageUpload = (event) => {
    const uploadedImages = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const addPart = () => {
    setPartInputs([...partInputs, { partcode: "", partnm: "" }]);
  };

  const removePart = (index) => {
    const updatedPartInputs = [...partInputs];
    updatedPartInputs.splice(index, 1);
    setPartInputs(updatedPartInputs);
  };

  const handlePartChange = (index, e) => {
    const updatedPartInputs = [...partInputs];
    updatedPartInputs[index].partnm = e.label;
    updatedPartInputs[index].partcode = e.value;
    setPartInputs(updatedPartInputs);
  };

  // handle multiple  box

  const addBox = () => {
    setBoxes([
      ...boxes,
      {
        crtnType: "",
        pcsprcrtn: "",
        pcsprcbm: "",
        boxlen: "",
        boxheight: "",
        boxunit: "",
        boxarea: "",
        boxWgt: "",
        boxwid: "",
      },
    ]);
  };

  const removeBox = (index) => {
    const updatedBoxes = [...boxes];
    updatedBoxes.splice(index, 1);
    setBoxes(updatedBoxes);
  };

  const calculatecbm = (length, width, height, unit) => {
    let cbm;
    if (unit === "CM") {
      cbm = (length * width * height) / 1000000;
    } else {
      cbm = (length * width * height) / 61023;
    }
    return cbm.toFixed(4);
  };

  const cbmPerPcs = (cbm, pcs) => {
    let perpcscbm;
    if (pcs > 1) {
      perpcscbm = (cbm / pcs).toFixed(3);
    } else {
      perpcscbm = cbm;
    }
    return perpcscbm;
  };


  const multihandlechangeBox = (e, i) => {
    const { name, value } = e.target;
    const inputdata = [...boxes];

    // Calculate cbm

    if (e.target.name === "boxlen") {
      const newValue = e.target.value;

      if (e.target.value === "") {
        inputdata[i][name] = "";

      } else {

        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          inputdata[i][name] = newValue;
        }
      }


    } else if (e.target.name === "boxwid") {
      const newValue = e.target.value;
      if (e.target.value === "") {
        inputdata[i][name] = 0;
      } else {
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          inputdata[i][name] = newValue;
        }
      }
    } else if (e.target.name === "boxheight") {
      const newValue = e.target.value;
      if (e.target.value === "") {
        inputdata[i][name] = "";
      } else {
        const isValidDecimal = /^\d+(\.\d{1,2})?$/.test(newValue);
        if (isValidDecimal) {
          inputdata[i][name] = newValue;
        }
      }
    } else {
      inputdata[i][name] = value;
    }

    const length = inputdata[i].boxlen;
    const width = inputdata[i].boxwid;
    const height = inputdata[i].boxheight;
    const unit = inputdata[i].boxunit;
    const pcs = inputdata[i].pcsprcrtn;
    const cbm = calculatecbm(length, width, height, unit);
    inputdata[i].boxarea = cbm;
    const perpcsCbm = cbmPerPcs(cbm, pcs);
    inputdata[i].pcsprcbm = perpcsCbm;

    setBoxes(inputdata);
  };

  const handleBoxunitandcrtntype = (e, index, name) => {
    const updatedPartInputs = [...boxes];
    if (name === "carton") {
      updatedPartInputs[index].crtnType = e.label;
    }
    if (name === "boxunit") {
      updatedPartInputs[index].boxunit = e.label;
    }

    setBoxes(updatedPartInputs);
  };

  // data for save product

  const convertedData = {
    categorycode: inputs.categorycode,
    categorynm: inputs.categorynm,
    prdnm: inputs.prdnm,
    prdalias: inputs.prdalias,
    setStatus: inputs.setStatus,
    prdlen: inputs.prdlen,
    prdwid: inputs.prdwid,
    prdheight: inputs.prdheight,
    prdnetWgt: inputs.prdnetWgt,
    prdGrsWgt: inputs.prdGrsWgt,
    reord_Qty: inputs.reord_Qty,
    lot_moq_Qty: inputs.lot_moq_Qty,
    minStk_Qty: inputs.minStk_Qty,
    prdunit: inputs.prdunit,
    prdcolorcd: inputs.prdcolorcd,
    prdColor: inputs.prdColor,
    prdfinishcd: inputs.prdfinishcd,
    prdfinish: inputs.prdfinish,
    ecomMrp: inputs.ecomMrp,
    cnf: inputs.cnf,
    remark: inputs.remark,
    createdby: "kuldeep kumar",
    updatedby: "kuldeep kumar",
    parts: partInputs,
    productBox: boxes,
  };

  const convertedData2 = {
    rwid: inputs.rwid,
    categorycode: inputs.categorycode,
    categorynm: inputs.categorynm,
    prdnm: inputs.prdnm,
    prdalias: inputs.prdalias,
    setStatus: inputs.setStatus,
    prdlen: inputs.prdlen,
    prdwid: inputs.prdwid,
    prdheight: inputs.prdheight,
    prdnetWgt: inputs.prdnetWgt,
    prdGrsWgt: inputs.prdGrsWgt,
    reord_Qty: inputs.reord_Qty,
    lot_moq_Qty: inputs.lot_moq_Qty,
    minStk_Qty: inputs.minStk_Qty,
    prdunit: inputs.prdunit,
    prdcolorcd: inputs.prdcolorcd,
    prdColor: inputs.prdColor,
    prdfinishcd: inputs.prdfinishcd,
    prdfinish: inputs.prdfinish,
    ecomMrp: inputs.ecomMrp,
    cnf: inputs.cnf,
    remark: inputs.remark,
    updatedby: "kuldeep kumar",
    parts: partInputs,
    productBox: boxes,
  };
  const navigate = useNavigate();

  const handleprodcutsubmit = (e) => {
    e.preventDefault();

    if (!inputs.categorynm || inputs.categorynm === "") {
      toast.error("Please select Category.", { position: "top-center" });
      window.scroll(0, 0);
      return;
    }

    if (inputs.prdnm === undefined || inputs.prdnm.trim() === "") {
      setValidproductName(true);
      window.scroll(0, 0);
      return;
    }

    if (inputs.prdnm === undefined || inputs.prdnm.trim() === "") {
      setValidproductName(true);
      window.scroll(0, 0);
      return;
    }

    if (inputs.prdalias === undefined || inputs.prdalias.trim() === "") {
      setValidAliasName(true);
      window.scroll(0, 0);
      return;
    }

    if (!file) {
      toast.error("Please select a Image.", { position: "top-center" });
      window.scroll(0, 0);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Selected Valid image.", { position: "top-center" });
      window.scroll(0, 0);
      return;
    }
    if (file.name === "empty.jpg") {
      toast.error("Please select a  image..", { position: "top-center" });
      window.scroll(0, 0);
      return;
    }

    if (file.name === "empty.jpg") {
      toast.error("Please select a  image..", { position: "top-center" });
      window.scroll(0, 0);
      return;
    }

    let jsonData;
    let apiurl;
    let method;
    let massage = "";

    if (inputs.rwid == null) {
      jsonData = JSON.stringify(convertedData);
      apiurl = `${url}/AddProduct`;
      method = "POST";
      massage = "Product Create";
    } else {
      jsonData = JSON.stringify(convertedData2);
      apiurl = `${url}/updateProduct/${inputs.rwid}`;
      method = "PUT";
      massage = "Product Update";
      console.log(jsonData);
    }

    fetch(apiurl, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: Token },
      body: jsonData,
    })
      .then((response) => response.json())
      .then((data) => {
        imagesave(data.rwid);
        savemulitpleImages(data.rwid);

        toast.success(massage + " Successfully with id " + data.prdcd, {
          autoClose: 800,
          onClose: () => {
            navigate("/product-search");
          },
        });
      })
      .catch((error) => {
        toast.error(massage + " Failed", { autoClose: 1000 });
      });
  };

  const imagesave = (rwid) => {
    const emptyImageData = new Blob([], { type: "image/png" });
    const emptyImageFile = new File([emptyImageData], "empty.jpg", {
      type: "image/png",
    });
    const formData = new FormData();
    if (file == null) {
      formData.append("image", emptyImageFile);
    } else {
      console.log("file");
      console.log(file);

      formData.append("image", file);
    }
    const response = fetch(`${url}/Upload/${rwid}`, {
      method: "POST",
      headers: {
        Authorization: Token,
      },
      body: formData,
    });

    if (response.ok) {
      console.log("image uploaded");
    } else {
      console.log("an error occured during image upload");
    }
  };

  const savemulitpleImages = async (rwid) => {
    const emptyImageData = new Blob([], { type: "image/png" });
    const emptyImageFile = new File([emptyImageData], "empty.jpg", {
      type: "image/png",
    });

    const formData = new FormData();

    if (file == null) {
      formData.append("images", emptyImageFile);
    } else {
      images.forEach((image, index) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(`${url}/MultipleImageUpload/${rwid}`, {
      method: "POST",
      headers: {
        Authorization: Token,
      },
      body: formData,
    });

    if (response.ok) {
    } else {
    }
  };

  const [documents, setDocuments] = useState([]);

  // Define the handleDocumentUpload function to handle file upload
  const handleDocumentUpload = (event) => {
      const files = event.target.files;
      // Convert the FileList object into an array
      const fileList = Array.from(files);
      // Update the documents state with the new files
      setDocuments([...documents, ...fileList]);
  };

  // Define the handleDocumentDelete function to handle document deletion
  const handleDocumentDelete = (index) => {
      // Create a copy of the documents array
      const updatedDocuments = [...documents];
      // Remove the document at the specified index
      updatedDocuments.splice(index, 1);
      // Update the documents state with the updated array
      setDocuments(updatedDocuments);
  };


  return (
    <div className="page-content">
      <form onSubmit={handleprodcutsubmit}>
        <Container fluid>
          <BreadCrumb  pageName="Add Product"  manageProduct="Manage Product" subTitle="Add Product"/>
          <Row>
            <Col lg={9}>
              <Form>
                <Card>
                  <CardBody>
                    <CardBody>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="product-category"
                            >
                              Product Category
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={sortBy}
                                onChange={(e) => {
                                  setsortBy(e);
                                  setInputs({
                                    ...inputs,
                                    categorycode: e.value,
                                    categorynm: e.label,
                                  });
                                }}
                                options={AllCategory}
                                id="choices-single-default"
                                className="js-example-basic-single mb-0"
                                name="categorycode"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="Product Name"
                            >
                              Product Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter Product Name"
                              name="prdnm"
                              value={inputs.prdnm || ""}
                              onChange={handlechange}
                              required
                            />
                            {validproductName && (
                              <p
                                className="text-danger"
                                style={{ color: "red" }}
                              >
                                {" "}
                                Enter Product Name.
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Alias-Code">
                              Alias Code
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="Alias-Code"
                              placeholder="Enter product Alias"
                              name="prdalias"
                              value={inputs.prdalias || ""}
                              onChange={handlechange}
                              required
                            />
                            {validAliasName && (
                              <p
                                className="text-danger"
                                style={{ color: "red" }}
                              >
                                {" "}
                                Enter Valid Alias.
                              </p>
                            )}
                            {alreadyExist && (
                              <p
                                className="text-danger"
                                style={{ color: "red" }}
                              >
                                {" "}
                                Already Exist.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="product-title-input-3"
                            >
                              Set Status
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                required
                                value={status}
                                onChange={(e) => {
                                  setStatus(e);
                                  setInputs({ ...inputs, setStatus: e.value });
                                }}
                                options={setstatus}
                                id="choices-single-default"
                                className="js-example-basic-single mb-0"
                                name="state"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Unit ">
                              Unit
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={prdunit}
                                onChange={(e) => {
                                  setPrdunit(e);
                                  setInputs({ ...inputs, prdunit: e.value });
                                }}
                                options={unit}
                                id="choices-single-default"
                                className="js-example-basic-single mb-0"
                                name="prdunit"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Width ">
                              Width
                            </Label>
                            <Input
                              type="number"
                              className="form-control"
                              id="Width"
                              placeholder=" Width "
                              name="prdwid"
                              value={inputs.prdwid || ""}
                              onChange={handlechange}
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Height ">
                              Height
                            </Label>
                            <Input
                              className="form-control"
                              id="Height"
                              placeholder=" Height"
                              name="prdheight"
                              type="number"
                              value={inputs.prdheight || ""}
                              onChange={handlechange}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Length ">
                              Length
                            </Label>
                            <Input
                              type="number"
                              className="form-control"
                              id="Length"
                              placeholder=" Length "
                              name="prdlen"
                              value={inputs.prdlen || ""}
                              onChange={handlechange}
                            />
                          </div>
                        </div>



                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Net-weight ">
                              Net weight
                            </Label>
                            <Input
                              className="form-control"
                              id="Net-weight"
                              placeholder="Net weight"
                              type="number"
                              name="prdnetWgt"
                              value={inputs.prdnetWgt}
                              onChange={handlechange}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Gr-weight ">
                              Grs weight
                            </Label>
                            <Input
                              className="form-control"
                              id="Net-weight"
                              placeholder="Grs weight"
                              type="number"
                              name="prdGrsWgt"
                              value={inputs.prdGrsWgt}
                              onChange={handlechange}
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Color">
                              Color
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={prdcolor}
                                onChange={(e) => {
                                  setprdcolor(e);
                                  setInputs({ ...inputs, prdColor: e.label, prdcolorcd: e.value, });
                                }}
                                options={Color}
                                id="choices-single-default"
                                className="js-example-basic-single mb-0"
                                name="prdcolor"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Finish">
                              Finish
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                              <Select
                                value={prdfinish}
                                onChange={(e) => {
                                  console.log(e)
                                  setprdfinish(e);
                                  setInputs({ ...inputs, prdfinish: e.label, prdfinishcd: e.value, });
                                }}
                                options={Finish}
                                id="choices-single-default"
                                className="js-example-basic-single mb-0"
                                name="prdfinish"
                              />
                              
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="CNF">
                              CNF
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="CNF"
                              placeholder="CNF"
                              name="cnf"
                              value={inputs.cnf}
                              onChange={handlechange}
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor=" Ecommerce-MRP"
                            >
                              MRP
                            </Label>
                            <Input
                              className="form-control"
                              id="Ecommerce-MRP"
                              placeholder="MRP"
                              type="number"
                              name="ecomMrp"
                              value={inputs.ecomMrp}
                              onChange={handlechange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Remark">
                              Remark
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="Remark"
                              placeholder="Remark"
                              name="remark"
                              value={inputs.remark}
                              onChange={handlechange}
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </CardBody>
                </Card>
              </Form>
            </Col>

            {/* // image preview  */}

            <Col lg={3}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title mb-0">Image</h5>
                    <Button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        setModalProject(true);
                      }}
                    >
                      {" "}
                      <i className="ri-image-fill"></i>
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  
                  <Row>
                    <Col lg={12}>
                      <div className="image-show1" style={{ border: showfile ? "" : "2px dotted grey" }}>
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
                          onChange={handleFileChange}
                          defaultValue=""
                          id="product-image-input"
                          type="file"
                          accept="image/png, image/gif, image/jpeg"
                        />
                        <p>Upload Image</p>
                      </button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
          <Col lg={12}>
              <Card>
                <CardBody>
                      <h5> <b>Labeling</b> </h5>
                    
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="product-category"
                            >
                              Re-order Qty
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Input
                              className="form-control"
                              id="Net-weight"
                              placeholder=" Re-order Qty"
                              type="number"
                              name="reord_Qty"
                              value={inputs.reord_Qty}
                              onChange={handleInputChange}
                            />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="product-category"
                            >
                              Lot Qty/ MOQ
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Input
                              className="form-control"
                              id="Net-weight"
                              placeholder=" Lot Qty/ MOQ"
                              type="number"
                              name="lot_moq_Qty"
                              value={inputs.lot_moq_Qty}
                              onChange={handleInputChange}
                            />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="product-category"
                            >
                              Minimum Stock Qty
                            </Label>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Input
                              className="form-control"
                              id="Net-weight"
                              placeholder="  Minimum Stock Qty"
                              type="number"
                              name="minStk_Qty"
                              value={inputs.minStk_Qty}
                              onChange={handleInputChange}
                            />
                            </div>
                          </div>
                        </div>
                      </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={12}>
              <Card>
                <CardBody>
                  <button
                    type="button"
                    className="btn btn-primary add-btn mb-2"
                    onClick={addPart}
                  >
                    <i className="ri-add-line align-bottom me-1"></i> Add Part
                  </button>
                  {partInputs.map((data, index) => (
                    <div key={index} className="row mb-1 mt-1">
                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor={`Part${index}`}
                          >
                            Part
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={{ label: data.partnm, value: data.partcode }}
                              onChange={(e) => {
                                handlePartChange(index, e);
                              }}
                              options={part}
                              id={`choices-single-${index}`}
                              className="js-example-basic-single mb-0"
                              name="partnm"
                              labelKey="label"
                              valueKey="label"
                            />
                          </div>
                        </div>
                      </div>
                      {index > -1 && (
                        <div className="col-md-1 mt-4">
                          <button
                            className="btn btn-success"
                            onClick={() => removePart(index)}
                          >
                            <i
                              className="las la-trash-alt"
                              style={{ fontSize: "1.2rem" }}
                            ></i>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>

            <Col lg={12}>
              <Card>
                <CardBody>
                  <button
                    type="button"
                    className="btn btn-primary add-btn mb-4"
                    onClick={addBox}
                  >
                    <i className="ri-add-line align-bottom me-1"></i> Add Box
                  </button>
                  {boxes.map((val, i) => (
                    <div key={i} className="row mb-3">
                      <div className="col-md-2">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Carton-Type">
                            Carton Type
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={{ label: val.crtnType, value: val.crtnType }}
                              onChange={(e) => {
                                handleBoxunitandcrtntype(e, i, "carton");
                              }}
                              options={Cartontye}
                              id="choices-single-default"
                              className="js-example-basic-single mb-0"
                              name="state"
                            />

                          </div>
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Unit">
                            Unit
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={{ label: val.boxunit, value: val.boxunit }}
                              onChange={(e) => {
                                handleBoxunitandcrtntype(e, i, "boxunit");
                              }}
                              options={Boxunit}
                              id="choices-single-default"
                              className="js-example-basic-single mb-0"
                              name="state"
                            />
                          </div>
                        </div>
                      </div>

                     

                      <div className="col-md-1">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Width">
                            Width
                          </Label>
                          <Input
                            className="form-control"
                            name="boxwid"
                            type="number"
                            value={val.boxwid}
                            onChange={(e) => multihandlechangeBox(e, i)}
                            placeholder="Width"
                          />
                        </div>
                      </div>

                      <div className="col-md-1">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Height">
                            Height
                          </Label>
                          <Input
                            name="boxheight"
                            type="number"
                            value={val.boxheight}
                            onChange={(e) => multihandlechangeBox(e, i)}
                            placeholder="Height"
                          />
                        </div>
                      </div>
                      <div className="col-md-1">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Length">
                            Length
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            name="boxlen"
                            value={val.boxlen}
                            onChange={(e) => multihandlechangeBox(e, i)}
                            placeholder="Length"
                          />
                        </div>
                      </div>
                      <div className="col-md-1">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Box Area">
                            Box Area
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            name="boxarea"
                            value={val.boxarea}
                            disabled
                            onChange={(e) => multihandlechangeBox(e, i)}
                            placeholder="Box Area"
                          />
                        </div>
                      </div>

                      <div className="col-md-1">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Perpcs cbm">
                            Pcs/Box
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            name="pcsprcrtn"
                            value={val.pcsprcrtn}
                            onChange={(e) => multihandlechangeBox(e, i)}
                            placeholder="Perpcs cbm"
                          />
                        </div>
                      </div>

                      <div className="col-md-1">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Cbm">
                            Cbm
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            name="pcsprcbm"
                            value={val.pcsprcbm}
                            disabled
                            onChange={(e) => multihandlechangeBox(e, i)}
                            placeholder="Cbm"
                          />
                        </div>
                      </div>

                      <div className="col-md-1">
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="Box Weight">
                            Box Wgt
                          </Label>
                          <Input
                            name="boxWgt"
                            type="number"
                            value={val.boxWgt}
                            onChange={(e) => multihandlechangeBox(e, i)}
                            placeholder="Box Weight"
                            className="form-control"
                          />
                        </div>
                      </div>

                      {i > -1 && (
                        <div className="col-1 mt-4">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => removeBox(i)}
                          >
                            <i
                              className="las la-trash-alt"
                              style={{ fontSize: "1.2rem" }}
                            ></i>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button
                    type="submit"
                    color="success"
                    style={{ float: "right" }}
                    size="sm"
                  >
                    {buttonmode}
                  </Button>
                </CardBody>
              </Card>
            </Col>



          </Row>
          <ToastContainer closeButton={true} limit={10} />
        </Container>

        <Modal
          size="lg"
          backdrop={"static"}
          isOpen={modalProject}
          toggle={() => setModalProject(!modalProject)}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader
            toggle={() => setModalProject(!modalProject)}
            className="p-3 bg-success-subtle"
          >
            Mulitple Image
          </ModalHeader>
          <ModalBody>
            <button className="multi-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ marginBottom: "1rem" }}
              />
              Upload Images
            </button>

            {images.map(
              (image, index) =>
                index % 4 === 0 && (
                  <Row key={index}>
                    {images.slice(index, index + 4).map((image, subIndex) => (
                      <div className="col-md-3" key={index + subIndex}>
                        <Card style={{ position: "relative" }} className="card-image">
                          <img
                            src={URL.createObjectURL(image)}
                            name="userimg"
                            style={{
                              height: "200px",
                              width: "190px",
                              borderRadius: 5,
                              backgroundColor: "gray",
                            }}
                          />
                          <button
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "-17px",

                            }}
                            className="btn-style"
                            onClick={() => handleImageDelete(index + subIndex)}
                          >
                            +
                          </button>
                        </Card>
                      </div>
                    ))}
                  </Row>
                )
            )}

          <button className="multi-upload">
          <input
          type="file"
          accept=".pdf, .doc, .docx" // Specify accepted document file types
          multiple
          onChange={handleDocumentUpload} // Define a new handler for document upload
          style={{ marginBottom: "1rem" }}
          />
              Upload Documents
            </button>
                    {documents.map((document, index) => (
            <div key={index}>
              {/* Display the name of the uploaded document */}
              <p>{document.name}</p>
              {/* Add a button to delete the document if needed */}
              <button onClick={() => handleDocumentDelete(index)}>Delete</button>
            </div>
          ))}
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <Button
                color="light"
                onClick={() => {
                  setModalProject(false);
                }}
                size="sm"
              >
                Close
              </Button>
              <Button
                type="submit"
                color="success"
                onClick={() => {
                  setModalProject(false);
                }}
                size="sm"
              >
                Add
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </form>
    </div >
  );
};

export default Product;
