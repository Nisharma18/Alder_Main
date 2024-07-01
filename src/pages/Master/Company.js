import React, { useState, useEffect } from "react";
import { Container, Toast } from "reactstrap";
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
} from "reactstrap";
import Select from "react-select";
import "./company/Company.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import url from "../Base_url/Base_url";
import { useLocation } from 'react-router-dom'
import backimage from "./../../assets/images/upload.png";
const Company = () => {
  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;


  const [companyoptions, setCompanyoptions] = useState(null);
  const [stateoption, setStateoption] = useState(null);
  const [citiesoption, setCitiesoption] = useState(null);
  const [registratioption, setRegistratioption] = useState(null);
  const [organizationoption, setOrganizationoption] = useState(null)
  const [contactpersontype, setContactpersontype] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const [singleimagesave, setSingleimagesave] = useState(null);
  const [input, setInput] = useState([]);
  const [data, Setdata] = useState([
    {
      contactPersonType: "",
      personName: "",
      mobileNo: "",
      emailid: "",
    },
  ]);

  const [multofile, setmultofile] = useState([{}]);

  const addData = () => {
    Setdata([
      ...data,
      {
        contactPersonType: "",
        personName: "",
        mobileNo: "",
        emailid: "",
      },
    ]);
  };

  const multihandlechangeBox = (e, i) => {
    const { name, value } = e.target;
    const inputdata = [...data];
    inputdata[i][name] = value;
    Setdata(inputdata);
  };

  const handlecontactpersontype = (e, index) => {
    const updatedData = [...data];
    updatedData[index].contactPersonType = e.value;
    Setdata(updatedData);
  };
  const deletedata = (index) => {
    if (index > 0) {
      const newArray = [...data];
      newArray.splice(index, 1);
      Setdata(newArray);
    }
  };

  const [images, setImages] = useState([]);
  const handleChangeimg = (index, e) => {
    const file = URL.createObjectURL(e.target.files[0]);
    const updatedMultofile = [...multofile];
    updatedMultofile[index] = file;

    const uploadedImages = Array.from(e.target.files);
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = uploadedImages[0];
      return updatedImages;
    });

    setmultofile(updatedMultofile);
  };





  const contactPersonTypes = [
    {
      options: [
        { label: "PI", value: "PI" },
        { label: "Order", value: "Order" },
        { label: "Purchase Order", value: "Purchase Order" },

      ],
    },
  ];

  const Country = [
    {
      options: [
        { label: "USA", value: "USA" },
        { label: "Russia", value: "Russia" },
        { label: "India", value: "India" },
        { label: "England", value: "England" },
        { label: "Pakistan", value: "Pakistan" },
        { label: "Japan", value: "Japan" },
      ],
    },
  ];

  const state = [
    {
      options: [
        { label: "Uttar Pradesh", value: "Uttar Pradesh" },
        { label: "Maharashtra", value: "Maharashtra" },
        { label: "Tamil Nadu", value: "Tamil Nadu" },
        { label: "Karnataka", value: "Karnataka" },
        { label: "Gujarat", value: "Gujarat" },
        { label: "Rajasthan", value: "Rajasthan" },
        { label: "Kerala", value: "Kerala" },
        { label: "Bihar", value: "Bihar" },
        { label: "Punjab", value: "Punjab" },
        { label: "Andhra Pradesh", value: "Andhra Pradesh" },
        { label: "Madhya Pradesh", value: "Madhya Pradesh" },
        { label: "Odisha", value: "Odisha" },
        { label: "Telangana", value: "Telangana" },
        { label: "West Bengal", value: "West Bengal" },
        { label: "Haryana", value: "Haryana" },
        { label: "Uttarakhand", value: "Uttarakhand" },
        { label: "Assam", value: "Assam" },
        { label: "Jharkhand", value: "Jharkhand" },
        { label: "Goa", value: "Goa" },
        { label: "Kashmir", value: "Kashmir" },
        { label: "Nagaland", value: "Nagaland" },
        { label: "Manipur", value: "Manipur" },
        { label: "Meghalaya", value: "Meghalaya" },
        { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
      ],
    },
  ];

  const cities = [
    {
      options: [
        { label: "Mumbai", value: "Mumbai" },
        { label: "Delhi", value: "Delhi" },
        { label: "Bangalore", value: "Bangalore" },
        { label: "Chennai", value: "Chennai" },
        { label: "Hyderabad", value: "Hyderabad" },
        { label: "Kolkata", value: "Kolkata" },
        { label: "Ahmedabad", value: "Ahmedabad" },
        { label: "Pune", value: "Pune" },
        { label: "Jaipur", value: "Jaipur" },
        { label: "Lucknow", value: "Lucknow" },
        { label: "Bhopal", value: "Bhopal" },
        { label: "Patna", value: "Patna" },
        { label: "Kochi", value: "Kochi" },
        { label: "Chandigarh", value: "Chandigarh" },
        { label: "Guwahati", value: "Guwahati" },
        { label: "Indore", value: "Indore" },
        { label: "Agra", value: "Agra" },
        { label: "Vadodara", value: "Vadodara" },
        { label: "Visakhapatnam", value: "Visakhapatnam" },
        { label: "Bhubaneswar", value: "Bhubaneswar" },
        { label: "Coimbatore", value: "Coimbatore" },
        { label: "Nagpur", value: "Nagpur" },
        { label: "Kanpur", value: "Kanpur" },
        { label: "Thiruvananthapuram", value: "Thiruvananthapuram" },
        { label: "Jaipur", value: "Jaipur" },
        { label: "Ludhiana", value: "Ludhiana" },
        { label: "Nashik", value: "Nashik" },
        { label: "Varanasi", value: "Varanasi" },
        { label: "Trichy", value: "Trichy" },
        { label: "Surat", value: "Surat" },
        { label: "Jodhpur", value: "Jodhpur" },
        { label: "Amritsar", value: "Amritsar" },
        { label: "Cuttack", value: "Cuttack" },
        { label: "Madurai", value: "Madurai" },
        { label: "Bikaner", value: "Bikaner" },
        { label: "Kozhikode", value: "Kozhikode" },
        { label: "Dehradun", value: "Dehradun" },
        { label: "Siliguri", value: "Siliguri" },
        { label: "Gorakhpur", value: "Gorakhpur" },
        { label: "Noida", value: "Noida" },
        { label: "Ranchi", value: "Ranchi" },
        { label: "Jamshedpur", value: "Jamshedpur" },
        { label: "Udaipur", value: "Udaipur" },
        { label: "Gwalior", value: "Gwalior" },
        { label: "Kota", value: "Kota" },
        { label: "Jalandhar", value: "Jalandhar" },
        { label: "Mangalore", value: "Mangalore" },
        { label: "Kollam", value: "Kollam" },
        { label: "Kota", value: "Kota" },
        { label: "Jalandhar", value: "Jalandhar" },
        { label: "Mangalore", value: "Mangalore" },
        { label: "Kollam", value: "Kollam" },
        { label: "Trivandrum", value: "Trivandrum" },
        { label: "Jammu", value: "Jammu" },
        { label: "Shimla", value: "Shimla" },
        { label: "Gangtok", value: "Gangtok" },
        { label: "Itanagar", value: "Itanagar" },
        { label: "Kohima", value: "Kohima" },
        { label: "Imphal", value: "Imphal" },
        { label: "Shillong", value: "Shillong" },
        { label: "Agartala", value: "Agartala" },
        { label: "Port Blair", value: "Port Blair" },
        { label: "Chandrapur", value: "Chandrapur" },
        { label: "Gaya", value: "Gaya" },
        { label: "Panaji", value: "Panaji" },
        { label: "Bhagalpur", value: "Bhagalpur" },
        { label: "Srinagar", value: "Srinagar" },
        { label: "Kavaratti", value: "Kavaratti" },
        { label: "Puducherry", value: "Puducherry" },
        { label: "Daman", value: "Daman" },
        { label: "Karaikal", value: "Karaikal" },
        { label: "Leh", value: "Leh" },
        { label: "Pithoragarh", value: "Pithoragarh" },
        { label: "Lakshadweep", value: "Lakshadweep" },
        { label: "Chandannagar", value: "Chandannagar" },
        { label: "Diu", value: "Diu" },
        { label: "Kavaratti", value: "Kavaratti" },
      ],
    },
  ];

  const Registrationtypes = [
    {
      options: [
        { label: "Manufatures", value: "Manufatures" },
        { label: "Importer", value: "Importer" },
        { label: "Dealer", value: "Dealer" },
        { label: "Exporter", value: "Exporter" },
        { label: "Reseller", value: "Reseller" },
        { label: "Manufatures & Exporter", value: "Manufatures & Exporter" },
      ],
    },
  ];

  const organizations = [
    {
      options: [
        { label: "Individual/Proprietorship", value: "Individual/Proprietorship" },
        { label: "Partnership", value: "Partnership" },
        { label: "Private Ltd.", value: "Private Ltd." },
        { label: "Public Ltd.", value: "Public Ltd." },
        { label: "LLP", value: "LLP" },

      ],
    },
  ];
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(e.target.result);
        setSingleimagesave(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const savedata = {
    companyName: input.companyName,
    state: input.state,
    registrationType: input.registrationType,
    email: input.email,
    address: input.address,
    city: input.city,
    organizationType: input.organizationType,
    website: input.website,
    country: input.country,
    pinNo: input.pinNo,
    faxNo: input.faxNo,
    capacity: input.capacity,
    bin: input.bin,
    cstNO: input.cstNO,
    panNo: input.panNo,
    gstNo: input.gstNo,
    regCin: input.regCin,
    otherTax: input.otherTax,
    vitTinNO: input.vitTinNO,
    bankName: input.bankName,
    branchName: input.branchName,
    ifscCode: input.ifscCode,
    accountNo: input.accountNo,
    bankAddress: input.bankAddress,
    swiftCode: input.swiftCode,
    createBy: input.createBy,
    updateBy: input.updateBy,
    companyAdministration: data,
  };
  const updatedata = {
    rwid: input.rwid,
    companyName: input.companyName,
    state: input.state,
    registrationType: input.registrationType,
    email: input.email,
    address: input.address,
    city: input.city,
    organizationType: input.organizationType,
    website: input.website,
    country: input.country,
    pinNo: input.pinNo,
    faxNo: input.faxNo,
    capacity: input.capacity,
    bin: input.bin,
    cstNO: input.cstNO,
    panNo: input.panNo,
    gstNo: input.gstNo,
    regCin: input.regCin,
    otherTax: input.otherTax,
    vitTinNO: input.vitTinNO,
    bankName: input.bankName,
    branchName: input.branchName,
    ifscCode: input.ifscCode,
    accountNo: input.accountNo,
    bankAddress: input.bankAddress,
    swiftCode: input.swiftCode,
    createBy: input.createBy,
    updateBy: input.updateBy,
    companyAdministration: data,
  };
  const [checkFields, setCheckFields] = useState(false)
  // const handlesubmit = (e) => {
  //   e.preventDefault();
  //   let jsonData;
  //   let apiurl;
  //   let method;
  //   let massage = "";
  //   if (!input.companyName) {
  //     toast.error(" Company name is required", { autoClose: 1000 });
  //   } else if (!input.address) {
  //     toast.error(" Address is required", { autoClose: 1000 });
  //   } else if (!input.country) {
  //     toast.error(" Country is required", { autoClose: 1000 });
  //   } else if (!input.city) {
  //     toast.error(" City is required", { autoClose: 1000 });
  //   }
  //   else {

  //     if (input.rwid == null) {
  //       jsonData = JSON.stringify(savedata);
  //       apiurl = `${url}/Company`;
  //       method = "POST";
  //       massage = "Company Create";
  //       console.log(jsonData);
  //     } else {
  //       jsonData = JSON.stringify(updatedata);
  //       apiurl = `${url}/Company/${input.rwid}`;
  //       method = "PUT";
  //       massage = "Company Update";
  //       console.log(jsonData);
  //     }

  //     fetch(apiurl, {
  //       method: method,
  //       headers: { "Content-Type": "application/json", Authorization: Token },
  //       body: jsonData,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         imagesave(data.rwid);
  //         savemulitpleImages(data.rwid)
  //         toast.success(massage + " Successfully with id " + data.companycd, { autoClose: 800, onClose: () => { }, });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         toast.error(massage + " Failed", { autoClose: 1000 });
  //       });

  //     setInput({
  //       companyName: "",
  //       state: "",
  //       registrationType: "",
  //       email: "",
  //       address: "",
  //       city: "",
  //       organizationType: "",
  //       website: "",
  //       country: "",
  //       pinNo: "",
  //       faxNo: "",
  //       capacity: "",
  //       bin: "",
  //       cstNO: "",
  //       panNo: "",
  //       gstNo: "",
  //       regCin: "",
  //       otherTax: "",
  //       vitTinNO: "",
  //       bankName: "",
  //       branchName: "",
  //       ifscCode: "",
  //       accountNo: "",
  //       bankAddress: "",
  //       swiftCode: "",


  //     })

  //     Setdata([{
  //       contactPersonType: "",
  //       personName: "",
  //       mobileNo: "",
  //       emailid: "",
  //     }])

  //     setCompanyoptions({ label: "", value: "" })
  //     setStateoption({ label: "", value: "" })
  //     setCitiesoption({ label: "", value: "" })
  //     setRegistratioption({ label: "", value: "" })
  //     setOrganizationoption({ label: "", value: "" })
  //     setSelectedFile(null)
  //     setmultofile([])
  //     setImages([])
  //   }
  // };
  const handlesubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["companyName", "address", "country", "city", "registrationType"];

    const missingField = requiredFields.find(field => !input[field]);

    if (missingField) {
      toast.error(`${missingField.charAt(0).toUpperCase() + missingField.slice(1)} is required`, { autoClose: 1000 });
      return;
    }

    let jsonData, apiurl, method, message;
    if (input.rwid == null) {
      jsonData = JSON.stringify(savedata);
      apiurl = `${url}/Company`;
      method = "POST";
      message = "Company Create";
    } else {
      jsonData = JSON.stringify(updatedata);
      apiurl = `${url}/Company/${input.rwid}`;
      method = "PUT";
      message = "Company Update";
    }

    fetch(apiurl, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: Token },
      body: jsonData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        imagesave(data.rwid);
        savemulitpleImages(data.rwid);
        toast.success(message + " Successfully with id " + data.companycd, { autoClose: 800, onClose: () => { } });
      })
      .catch(error => {
        console.error('There was an error!', error);
        toast.error(message + " Failed", { autoClose: 1000 });
      })
      .finally(() => {
        setInput({
          companyName: "",
          state: "",
          registrationType: "",
          email: "",
          address: "",
          city: "",
          organizationType: "",
          website: "",
          country: "",
          pinNo: "",
          faxNo: "",
          capacity: "",
          bin: "",
          cstNO: "",
          panNo: "",
          gstNo: "",
          regCin: "",
          otherTax: "",
          vitTinNO: "",
          bankName: "",
          branchName: "",
          ifscCode: "",
          accountNo: "",
          bankAddress: "",
          swiftCode: "",
        })
        Setdata([{
          contactPersonType: "",
          personName: "",
          mobileNo: "",
          emailid: "",
        }])

        setCompanyoptions({ label: "", value: "" })
        setStateoption({ label: "", value: "" })
        setCitiesoption({ label: "", value: "" })
        setRegistratioption({ label: "", value: "" })
        setOrganizationoption({ label: "", value: "" })
        setSelectedFile(null)
        setmultofile([])
        setImages([])
      });
  };

  const imagesave = (rwid) => {
    const emptyImageData = new Blob([], { type: "image/jpg" });
    const emptyImageFile = new File([emptyImageData], "empty.jpg", {
      type: "image/jpg",
    });
    const formData = new FormData();
    if (singleimagesave == null) {
      formData.append("image", emptyImageFile);
    } else {

      console.log("file");
      console.log(singleimagesave);

      formData.append("image", singleimagesave);
    }
    const response = fetch(`${url}/UploadCompany/${rwid}`, {
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

    if (multofile == null) {
      formData.append("images", emptyImageFile);
    } else {
      images.forEach((image, index) => { formData.append("images", image); });
    }


    const response = await fetch(`${url}/CompanyMultipleImageUpload/${rwid}`, {
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

  const [buttonmode, setButtonmode] = useState("Save");

  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get("data");
    if (encodedData == null) {
    } else {
      const decodedData = decodeURIComponent(encodedData);
      const parsedData = JSON.parse(decodedData);

      console.log(parsedData)

      setButtonmode("Update");
      setInput(parsedData);
      Setdata(parsedData.companyAdministration)
      setCompanyoptions({ label: parsedData.country, value: parsedData.country })
      setStateoption({ label: parsedData.state, value: parsedData.state })
      setCitiesoption({ label: parsedData.city, value: parsedData.city })
      setRegistratioption({ label: parsedData.registrationType, value: parsedData.registrationType })
      setOrganizationoption({ label: parsedData.organizationType, value: parsedData.organizationType })

      // for single images
      var imageshow = `${url}/image/CompanyImage/` + parsedData.rwid;
      setSelectedFile(imageshow);
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
            setSingleimagesave(oldimgfile);
          };
          reader.readAsArrayBuffer(blob);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });


      const updatedMultofile = []
      parsedData.companyAdministration.map((item, index) => {
        const imagesurl = `${url}/image/` + item.url;
        updatedMultofile[index] = imagesurl;
        setmultofile(updatedMultofile)

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

  return (
    <div className="page-content" style={{ overflow: "hidden" }}>
      <Container fluid>
        <BreadCrumb pageName="Add Company" title="Master" pageTitle=" Company" subTitle="Add Company"/>
        <form onSubmit={handlesubmit}>
          <Row>
            <Col lg={9}>
              <Form>
                <Card>
                  <CardBody>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="Product Name"
                          >
                            Company Name<span className="required">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Product Name"
                            required
                            placeholder="Enter Company Name"
                            name="companyName"
                            value={input.companyName}
                            onChange={(e) =>
                              setInput({
                                ...input,
                                companyName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="address">
                            Address<span className="required">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="address"
                            placeholder="Enter Address"
                            required
                            name="address"
                            value={input.address}
                            onChange={(e) =>
                              setInput({ ...input, address: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="product-category"
                          >
                            Country<span className="required">*</span>
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={companyoptions}
                              onChange={(e) => {
                                setCompanyoptions(e);
                                setInput({ ...input, country: e.value });
                              }}
                              options={Country}
                              id="choices-single-default"
                              className="js-example-basic-single mb-0"
                              name="country"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="product-title-input-3"
                          >
                            State
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={stateoption}
                              onChange={(e) => {
                                setStateoption(e);
                                setInput({ ...input, state: e.value });
                              }}
                              options={state}
                              id="choices-single-default"
                              className="js-example-basic-single mb-0"
                              name="state"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="product-title-input-3"
                          >
                            City<span className="required">*</span>
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={citiesoption}
                              onChange={(e) => {
                                setCitiesoption(e);
                                setInput({ ...input, city: e.value });
                              }}
                              options={cities}
                              id="choices-single-default"
                              className="js-example-basic-single mb-0"
                              name="city"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="pinNo ">
                            Pin No
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="pinNo"
                            placeholder=" pinNo "
                            name="pinNo"
                            value={input.pinNo}
                            onChange={(e) =>
                              setInput({ ...input, pinNo: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="product-title-input-3"
                          >
                            Registration Type<span className="required">*</span>
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={registratioption}
                              onChange={(e) => {
                                setRegistratioption(e);
                                setInput({
                                  ...input,
                                  registrationType: e.value,
                                });
                              }}
                              options={Registrationtypes}
                              id="choices-single-default"
                              className="js-example-basic-single mb-0"
                              name="state"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="product-title-input-3"
                          >
                            Organization Type
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={organizationoption}
                              onChange={(e) => {
                                setOrganizationoption(e);
                                setInput({
                                  ...input,
                                  organizationType: e.value,
                                });
                              }}
                              options={organizations}
                              id="choices-single-default"
                              className="js-example-basic-single mb-0"
                              name="organizationType"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="faxNo ">
                            Fax No
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="faxNo"
                            placeholder=" faxNo"
                            name="faxNo"
                            value={input.faxNo}
                            onChange={(e) =>
                              setInput({ ...input, faxNo: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="email ">
                            E-Mail
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder="email"
                            name="email"
                            value={input.email}
                            onChange={(e) =>
                              setInput({ ...input, email: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="website">
                            Website
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="website"
                            placeholder="website"
                            name="website"
                            value={input.website}
                            onChange={(e) =>
                              setInput({ ...input, website: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="capacity">
                            Capacity/Month/INR
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="capacity"
                            placeholder="capacity"
                            name="capacity"
                            value={input.capacity}
                            onChange={(e) =>
                              setInput({ ...input, capacity: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Form>
            </Col>

            {/* // image preview  */}
            <Col lg={3}>
              <Card>
                <CardHeader style={{ textAlign: "center" }}>
                  <h5 className="card-title mb-0">Logo</h5>
                </CardHeader>
                <CardBody>
                  {/* <div className="text-center">
                    <div className="position-relative d-inline-block">
                      <div className="position-absolute top-100 start-100 translate-middle">
                        <label
                          htmlFor="product-image-input"
                          className="mb-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="right"
                          title=""
                          data-bs-original-title="Select Image"
                        >
                          <div className="avatar-xs">
                            <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                              <i className="ri-image-fill"></i>
                            </div>
                          </div>
                        </label>
                        <input
                          onChange={handleFileChange}
                          className="form-control d-none"
                          defaultValue=""
                          id="product-image-input"
                          type="file"
                          accept="image/png, image/gif, image/jpeg"
                        />
                      </div>

                      <div className="avatar-lg">
                        <div className="avatar-title bg-light rounded">
                          <img
                            src={selectedFile || ""}
                            id="product-img"
                            alt=""
                            className="avatar-md h-auto"
                          />
                        </div>
                      </div>

                    </div>
                  </div> */}
                  <Row>
                    <Col lg={12}>
                      <div className="image-show" style={{ border: selectedFile ? "" : "2px dotted grey" }}>
                        {selectedFile ? <img
                          src={selectedFile}
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
                      <button className="upload-image upload-image-no-bg " type="button" onClick={() => { setSelectedFile(null) }}>
                        <p>Remove</p>
                      </button>
                    </Col>
                    <Col lg={6}>
                      <button className="upload-image" type="button">
                        <input
                          onChange={handleFileChange}
                          className="form-control d-"
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

          <Row style={{ marginTop: "-1.2rem" }}>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Other Details</h4>{" "}
                </CardHeader>
                <CardBody>
                  <Row>
                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="bin">
                          Bin
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="bin"
                          placeholder="Enter Bin"
                          name="bin"
                          value={input.bin}
                          onChange={(e) => setInput({ ...input, bin: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="cstNO">
                          CST No.
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="cstNO."
                          placeholder="Enter CST No."
                          name="cstNO"
                          value={input.cstNO}
                          onChange={(e) => setInput({ ...input, cstNO: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="PAN-No">
                          PAN No.
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="PAN-No"
                          placeholder="Enter PAN No"
                          name="panNo"
                          value={input.panNo}
                          onChange={(e) => setInput({ ...input, panNo: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="GST No.">
                          GST No.
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="gstNo"
                          placeholder="Enter GST No."
                          name="gstNo"
                          maxLength={15}
                          value={input.gstNo}
                          onChange={(e) => setInput({ ...input, gstNo: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="regCin">
                          REG/CIN
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="regCin"
                          placeholder="Enter REG/CIN"
                          name="regCin"
                          value={input.regCin}
                          onChange={(e) => setInput({ ...input, regCin: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Other-Tax">
                          Other Tax
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Other-Tax"
                          placeholder="Enter Other-Tax"
                          name="otherTax"
                          value={input.otherTax}
                          onChange={(e) => setInput({ ...input, otherTax: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="VIT/TIN NO.">
                          VIT/TIN NO.
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id=" VIT/TIN NO."
                          placeholder="Enter  VIT/TIN NO."
                          name="vitTinNO"
                          value={input.vitTinNO}
                          onChange={(e) => setInput({ ...input, vitTinNO: e.target.value })}
                        />
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>

              <Card style={{ marginTop: "-1.2rem" }}>
                <CardHeader>
                  <h4 className="card-title mb-0">Bank Details</h4>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Bank-Name">
                          Bank Name
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Bank-Name"
                          placeholder="Enter Bank Name"
                          name="bankName"
                          value={input.bankName}
                          onChange={(e) => setInput({ ...input, bankName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Branch-Name">
                          Branch Name
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Branch-Name"
                          placeholder="Enter Branch Name"
                          name="branchName"
                          value={input.branchName}
                          onChange={(e) =>
                            setInput({ ...input, branchName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="IFSC-Code">
                          IFSC Code
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="IFSC-Code"
                          placeholder="Enter IFSC Code"
                          name="ifscCode"
                          value={input.ifscCode}
                          onChange={(e) =>
                            setInput({ ...input, ifscCode: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Account-Number">
                          Account Number
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Account-Number"
                          placeholder="Enter Account Number"
                          name="accountNo"
                          value={input.accountNo}
                          onChange={(e) =>
                            setInput({ ...input, accountNo: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="bankAddress">
                          Address
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="bankAddress"
                          placeholder="Enter Address"
                          name="bankAddress"
                          value={input.bankAddress}
                          onChange={(e) =>
                            setInput({ ...input, bankAddress: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-4">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Swift-Code">
                          Swift Code
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Swift-Code"
                          placeholder="Enter Swift Code"
                          name="swiftCode"
                          value={input.swiftCode}
                          onChange={(e) =>
                            setInput({ ...input, swiftCode: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>

              <Card style={{ marginTop: "-1.2rem" }}>
                <CardHeader>
                  <h4 className="card-title mb-0">Administration Details</h4>
                </CardHeader>
                <CardBody>
                  {data.map((data, i) => (
                    <Row>
                      <div className="col-md-2 col-sm-3">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="product-title-input-3"
                          >
                            Contact Person Type
                          </Label>
                          <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select
                              value={{ label: data.contactPersonType, value: data.contactPersonType }}
                              onChange={(e) => {
                                setContactpersontype(e);
                                handlecontactpersontype(e, i);
                              }}
                              options={contactPersonTypes}
                              id="choices-single-default"
                              className="js-example-basic-single mb-0"
                              name="state"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-2">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Person-Name">
                            Person Name
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Person-Name"
                            placeholder="Enter Person Name"
                            name="personName"
                            value={data.personName}
                            onChange={(e) => multihandlechangeBox(e, i)}
                          />
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-3">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="Mobile-No">
                            Mobile No.
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="Mobile-No"
                            placeholder="Enter Mobile Number"
                            name="mobileNo"
                            value={data.mobileNo}
                            onChange={(e) => multihandlechangeBox(e, i)}
                          />
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-3">
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="E-Mail">
                            E-Mail
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="E-Mail"
                            placeholder="Enter E-Mail"
                            name="emailid"
                            value={data.emailid}
                            onChange={(e) => multihandlechangeBox(e, i)}
                          />
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-3 mt-3">
                        <div className="text-center">
                          <div className="position-relative d-inline-block">
                            <div className="position-absolute top-100 start-100 translate-middle">
                              <label
                                htmlFor={`image${i}`}
                                className="mb-0"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                title=""
                                data-bs-original-title="Select Image"
                              >
                                <div className="avatar-xs">
                                  <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                    <i className="ri-image-fill"></i>
                                  </div>
                                </div>
                              </label>
                              <input
                                onChange={(event) => handleChangeimg(i, event)}
                                className="form-control d-none"
                                defaultValue=""
                                id={`image${i}`}
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                              />
                            </div>

                            <div className="avatar-admin">
                              <div className="avatar-title bg-light rounded">
                                <img
                                  src={multofile[i]}
                                  id="company-img"
                                  alt="logo"
                                  className="avatar-md h-auto"

                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-3 mt-4">
                        <div>
                          <i
                            className="ri-add-line align-bottom me-1"
                            style={{ fontSize: "1.5rem", color: "green" }}
                            onClick={addData}
                          ></i>
                          <i
                            className="ri-subtract-line align-bottom me-1"
                            style={{ fontSize: "1.5rem", color: "red" }}
                            onClick={() => deletedata(i)}
                          ></i>
                        </div>
                      </div>
                    </Row>
                  ))}
                </CardBody>
                <div className="d-flex justify-content-end align-items-center mt-4 mb-2">
                  <Button className="btn btn-success" size="sm" type="submit" disabled={checkFields}>
                    Save
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </form>
        <ToastContainer closeButton={false} limit={10} />
      </Container>
    </div>
  );
};

export default Company;
