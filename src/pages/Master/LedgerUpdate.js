import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
} from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import newItem from "./Data/Data";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import url from './../Base_url/Base_url';
import Token from "../Token/Base_Token";
import { useLocation } from "react-router-dom";

const LedgerUpdate = () => {

  const sessiondata = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${sessiondata.jwtToken}`;


  const iconstyle = {
    justifyContent: "center",
    gap: "2rem",
    fontSize: "1.5rem",
  };


  const [sortBy, setsortBy] = useState({ label: "Buyer", value: "Buyer" });
  const [buyerDetails, setBuerDetails] = useState(true);
  const [supplierorvender, setSupplierorvender] = useState(false);
  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);

  const [validcompanyname, setValidcompanyname] = useState(false);
  const [validBuyername, setValidBuyername] = useState(false);
  const [validalias, setValidalias] = useState(false);
  const [validpayment, setValidpayment] = useState(false);
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [data, setData] = useState([]);

  const [inputs, setInputs] = useState({
    partytype: "Buyer",
    companyname: "",
    lednm: "",
    buyeralias: "",
    paymentTerms: "",
    discount: ""
  });

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  const sortbyname = [
    {
      options: [
        { label: "Buyer", value: "Buyer" },
        { label: "Vendor", value: "Vendor" },
        { label: "Supplier", value: "Supplier" },
      ],
    },
  ];

  const handleinputchange = (e) => {



    if (inputs.rwid == null || inputs.rwid === "") {
      if (e.target.name === "buyeralias") {
        const inputvalue = e.target.value;
        checkAliasNameFromDB(inputvalue);
      }
    } else {
      if (e.target.name === "buyeralias") {
        alert(e.target.name);
        const inputvalue = e.target.value;
        checkAliasNameFromDBForUpdate(inputvalue);
      }
    }
    if (e.target.name === "discount") {
      const input = e.target.value;
      if (/^\d*\.?\d*$/.test(input)) {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
      }
    } else {

      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    setValidcompanyname(false);
    setValidBuyername(false);
    setValidalias(false);
    setValidpayment(false);
  };

  const checkAliasNameFromDB = async (inputvalue) => {
    try {
      const response = await fetch(`${url}/getAllCategory`, {
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
      const lowerCaseInput = inputvalue.toLowerCase();
      const buyerAliascheck = data.some(
        (item) => item.name.toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(buyerAliascheck);
      console.log(buyerAliascheck);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkAliasNameFromDBForUpdate = async (inputvalue) => {
    try {
      const response = await fetch(`${url}/getAllCategory`, {
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
      const lowerCaseInput = inputvalue.toLowerCase();
      const buyerAliascheck = data.some(
        (item) => item.name.toLowerCase() === lowerCaseInput
      );
      setAlreadyExist(buyerAliascheck);
      console.log(buyerAliascheck);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Your code here
    handleaddbutton();
  }, []);


  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedData = queryParams.get('data');
    if (encodedData == null) {
    } else {

      const parsedData = JSON.parse(encodedData);
      setInputs(parsedData);
      setsortBy({ label: parsedData.partytype, value: parsedData.partytype });

      if (parsedData.partytype === 'Buyer') {
        setBuerDetails(true);
        setSupplierorvender(false);
        setData(parsedData.buyerDetail);
      } else {
        setBuerDetails(false);
        setSupplierorvender(true);
        setSuppliervendor(parsedData.buyerDetail);
      }
    }
  }, [location.search]);


  const handleaddbutton = (e) => {
    setData([...data, newItem]);
  };

  const deletedata = (index) => {
    if (index > 0) {
      const newArray = [...data];
      newArray.splice(index, 1);
      setData(newArray);
    }
  };

  const handlechange = (e, i) => {
    const { name, value } = e.target;
    const inputdata = [...data];
    inputdata[i][name] = value;
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (name === "shippEmail" && !emailPattern.test(value)) {
      if (value.trim() === "") {
        setEmailError("");
      } else {
        setEmailError("Email id is Not Valid ");
      }
    } else {
      setEmailError("");
    }

    if (name === "billEmail" && !emailPattern.test(value)) {
      if (value.trim() === "") {
        setEmailError("");
      } else {
        setEmailError("Email id is Not Valid ");
      }
    } else {
      setEmailError("");
    }

    setData(inputdata);
  };

  const [suppliervendor, setSuppliervendor] = useState([
    {
      billContactperson: "",
      billAddress1: "",
      billAddress2: "",
      billState: "",
      billCity: "",
      billPin_No: "",
      billContactno: "",
      billMobNo: "",
      billEmail: "",
      billGst: "",
      billPan: "",

      banknm: "",
      branchnm: "",
      accountno: "",
      ifsccode: "",
      swiftcode: "",
      bankddress: "",
    },
  ]);

  const handlesupplierchange = (e, i) => {
    const { name, value } = e.target;
    const updatedData = [...suppliervendor];
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (name === "billEmail" && !emailPattern.test(value)) {
      if (value.trim() === "") {
        setEmailError("");
      } else {
        setEmailError("Email id is Not Valid ");
      }
    } else {
      setEmailError("");
    }

    updatedData[i] = { ...updatedData[i], [name]: value }; // Update the specific item in the array
    setSuppliervendor(updatedData); // Update the state with the new array
  };

  const convertbuyerdata = {
    partytype: inputs.partytype,
    companyname: inputs.companyname,
    lednm: inputs.lednm,
    buyeralias: inputs.buyeralias,
    paymentTerms: inputs.paymentTerms,
    discount: inputs.discount,
    buyerDetail: data,
  };
  const convertdataforvenderorsupplier = {
    partytype: inputs.partytype,
    companyname: inputs.companyname,
    lednm: inputs.lednm,
    buyeralias: inputs.buyeralias,
    paymentTerms: inputs.paymentTerms,
    buyerDetail: suppliervendor,
  };

  // update data
  const convertbuyerdata2 = {
    rwid: inputs.rwid,
    partytype: inputs.partytype,
    companyname: inputs.companyname,
    lednm: inputs.lednm,
    buyeralias: inputs.buyeralias,
    paymentTerms: inputs.paymentTerms,
    discount: inputs.discount,
    buyerDetail: data,
  };
  const convertdataforvenderorsupplier2 = {
    rwid: inputs.rwid,
    partytype: inputs.partytype,
    companyname: inputs.companyname,
    lednm: inputs.lednm,
    buyeralias: inputs.buyeralias,
    paymentTerms: inputs.paymentTerms,
    buyerDetail: suppliervendor,
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    setValidcompanyname(false);
    setValidBuyername(false);
    setValidalias(false);
    setValidpayment(false);
    const isEmpty = data.some(
      (item) => item.addressname.trim() === "" || item.addressname === ","
    );

    if (inputs.companyname.trim() === "") {
      setValidcompanyname(true);
      toast.error("Invalid Company Name", { autoClose: 1000 });
      window.scrollTo(0, 0);
      return;
    }
    if (inputs.lednm.trim() === "") {
      setValidBuyername(true);
      toast.error("Invalid  Name", { autoClose: 1000 });
      window.scrollTo(0, 0);
      return;
    }
    if (inputs.buyeralias.trim() === "") {
      setValidalias(true);
      toast.error("Invalid  Alias", { autoClose: 1000 });
      window.scrollTo(0, 0);
      return;
    }
    if (inputs.paymentTerms.trim() === "") {
      setValidpayment(true);
      toast.error("Invalid Payment Term", { autoClose: 1000 });
      window.scrollTo(0, 0);
      return;
    }
    if (isEmpty && inputs.partytype == "Buyer") {
      toast.error("Some address names are empty", { autoClose: 1000 });
      window.scrollTo(0, 0);
    }

    let jsonData;
    let apiurl;
    let method;
    let massage = "";

    if (inputs.rwid == null) {
      if (inputs.partytype == "Buyer") {
        console.log("buyer");
        jsonData = JSON.stringify(convertbuyerdata);
        console.log(jsonData);
      } else {
        console.log("vender");
        jsonData = JSON.stringify(convertdataforvenderorsupplier);
        console.log(jsonData);
      }
      apiurl = `${url}/addLedger`;
      method = "POST";
      massage = "Ledger Create";
    } else {

      if (inputs.partytype == "Buyer") {
        console.log(" update buyer");
        jsonData = JSON.stringify(convertbuyerdata2);
        console.log(jsonData);
      } else {
        console.log("update vender");
        jsonData = JSON.stringify(convertdataforvenderorsupplier2);
        console.log(jsonData);
      }

      apiurl = `${url}/updateLedger/${inputs.rwid}`;
      method = "PUT";
      massage = "Ledger Update";
    }

    console.log(apiurl)
    fetch(apiurl, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: Token },
      body: jsonData,
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(massage + " Successfully with id " + data.ledcd, {
          autoClose: 1000,
        });
      })
      .catch((error) => {
        toast.error(massage + " Failed", { autoClose: 1000 });
      });

    setsortBy({ label: 'Select', value: 'Select' })
    setInputs({
      companyname: "",
      lednm: "",
      buyeralias: "",
      paymentTerms: "",
    });

    setData([
      {
        addressname: '',
        billContactperson: '',
        billAddress1: '',
        billAddress2: '',
        billState: '',
        billCity: '',
        billPin_No: '',
        billContactno: '',
        billMobNo: '',
        billEmail: '',
        billGst: '',
        billPan: '',

        shippContactperson: '',
        shippAddress: '',
        shippAddress2: '',
        shippState: '',
        shippCity: '',
        shippPin_No: '',
        shippContactNo: '',
        shippMobNo: '',
        shippEmail: '',
        finaldest: '',
        originofgds: '',

        banknm: '',
        branchnm: '',
        accountno: '',
        ifsccode: '',
        swiftcode: '',
        bankddress: '',
      },
    ]);

    setSuppliervendor([
      {
        billContactperson: '',
        billAddress1: '',
        billAddress2: '',
        billState: '',
        billCity: '',
        billPin_No: '',
        billContactno: '',
        billMobNo: '',
        billEmail: '',
        billGst: '',
        billPan: '',

        banknm: '',
        branchnm: '',
        accountno: '',
        ifsccode: '',
        swiftcode: '',
        bankddress: '',
      },
    ]);
  };








  return (
    <div className="page-content" style={{overflow:"hidden"}}>
      <Container fluid>
        <BreadCrumb  pageName="Ledger Update" title="Master" subTitle="Ledger Update"  />
        <Row>
          <Col lg={12}>
            <Form onSubmit={handlesubmit}>
              <Card>
                <CardBody>
                  <div className="row mb-4">
                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="product-category"
                        >
                          Party Type
                        </Label>
                        <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                          <Select
                            value={sortBy}
                            onChange={(e) => {
                              setsortBy(e);
                              setInputs((prevData) => ({
                                ...prevData,
                                partytype: e.value,
                              }));

                              if (e.value == "Buyer") {
                                setBuerDetails(true);
                                setSupplierorvender(false);
                              } else if (e.value == "Vendor") {
                                setBuerDetails(false);
                                setSupplierorvender(true);
                              } else if (e.value == "Supplier") {
                                setBuerDetails(false);
                                setSupplierorvender(true);
                              }
                            }}
                            options={sortbyname}
                            id="choices-single-default"
                            className="js-example-basic-single mb-0"
                            name="state"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Company Name">
                          Company Name
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Company Name"
                          placeholder="Enter Company Name"
                          name="companyname"
                          value={inputs.companyname}
                          onChange={handleinputchange}
                        />
                        {validcompanyname && (
                          <p className="text-danger" style={{ color: "red" }}>
                            {" "}
                            Enter Company name.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Name">
                          Name
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Name"
                          placeholder="Enter Name"
                          name="lednm"
                          value={inputs.lednm}
                          onChange={handleinputchange}
                        />
                        {validBuyername && (
                          <p className="text-danger" style={{ color: "red" }}>
                            {" "}
                            Enter name.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Alias Name">
                          Alias Name
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id=" Alias Name"
                          placeholder="Enter Alias Name"
                          name="buyeralias"
                          value={inputs.buyeralias}
                          onChange={handleinputchange}
                        />
                        {validalias && (
                          <p className="text-danger" style={{ color: "red" }}>
                            {" "}
                            Enter Alias name.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Discount">
                          Discount
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="Discount"
                          placeholder="Enter Discount"
                          name="discount"
                          value={inputs.discount}
                          onChange={handleinputchange}
                        />
                      </div>
                    </div>


                    <div className="col-md-2">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Payment Term">
                          Payment Term
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id=" Payment Term"
                          placeholder="Enter Payment Term"
                          name="paymentTerms"
                          value={inputs.paymentTerms}
                          onChange={handleinputchange}
                        />
                        {validpayment && (
                          <p className="text-danger" style={{ color: "red" }}>
                            {" "}
                            Enter Payment Term.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {buyerDetails && (
                    <>
                      {data.map((data, i) => (
                        <>
                          <div
                            className="step-arrow-nav mt-4 mx-n3 mb-3"
                            style={{ marginTop: "2rem" }}
                          >
                            <Nav
                              className="nav-pills nav-justified custom-nav"
                              role="tablist"
                            >
                              <NavItem role="presentation">
                                <NavLink
                                  href="#"
                                  className={classnames(
                                    {
                                      active: activeTab === 1,
                                      done: activeTab <= 4 && activeTab >= 0,
                                    },
                                    "p-3 fs-15"
                                  )}
                                  onClick={() => {
                                    toggleTab(1);
                                  }}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  <i className="ri-user-2-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                  Billing Address
                                </NavLink>
                              </NavItem>
                              <NavItem role="presentation" className="d-flex">
                                <NavLink
                                  href="#"
                                  className={classnames(
                                    {
                                      active: activeTab === 2,
                                      done: activeTab <= 4 && activeTab > 1,
                                    },
                                    "p-3 fs-15"
                                  )}
                                  onClick={() => {
                                    toggleTab(2);
                                  }}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  <i className="ri-truck-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2">
                                    {" "}
                                  </i>
                                  Shipping Address
                                </NavLink>
                              </NavItem>
                              <NavItem role="presentation" className="d-flex">
                                <NavLink
                                  href="#"
                                  className={classnames(
                                    {
                                      active: activeTab === 3,
                                      done: activeTab <= 4 && activeTab > 2,
                                    },
                                    "p-3 fs-15"
                                  )}
                                  onClick={() => {
                                    toggleTab(3);
                                  }}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  <i className="ri-bank-card-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2">
                                    {" "}
                                  </i>
                                  Bank Detail
                                </NavLink>
                                <NavLink>
                                  <div className="d-flex" style={iconstyle}>
                                    <i
                                      className="mdi mdi-plus icon "
                                      style={{ color: "green" }}
                                      onClick={handleaddbutton}
                                    ></i>
                                    <i
                                      className="mdi mdi-minus icon"
                                      style={{ color: "red" }}
                                      onClick={() => deletedata(i)}
                                    ></i>
                                  </div>
                                </NavLink>
                              </NavItem>
                            </Nav>
                          </div>
                          <TabContent activeTab={activeTab}>
                            <TabPane tabId={1} id="pills-bill-info">
                              <div>
                                <Row>
                                  <Col lg={4}>
                                    <div className="mb-3 d-flex">
                                      <Label
                                        className="form-label"
                                        htmlFor="Payment Term"
                                        style={{
                                          whiteSpace: "nowrap",
                                          marginTop: "1rem",
                                          marginRight: "1rem",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Billing Address
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id=" Payment Term"
                                        placeholder="Enter Address Name "
                                        name="addressname"
                                        value={data.addressname}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </Col>
                                </Row>

                                <Row>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Name"
                                      >
                                        Contact Person
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Name"
                                        placeholder="Enter Name"
                                        name="billContactperson"
                                        value={data.billContactperson}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Address1"
                                      >
                                        Address 1
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Address1"
                                        placeholder="Enter Address 1"
                                        name="billAddress1"
                                        value={data.billAddress1}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Address2"
                                      >
                                        Address 2
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Address2"
                                        placeholder="Enter Address 2"
                                        name="billAddress2"
                                        value={data.billAddress2}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="State"
                                      >
                                        State
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="State"
                                        placeholder="Enter State "
                                        name="billState"
                                        value={data.billState}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="City"
                                      >
                                        City
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="City"
                                        placeholder="Enter City "
                                        name="billCity"
                                        value={data.billCity}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Pin No."
                                      >
                                        Pin No.
                                      </Label>
                                      <Input
                                        type="number"
                                        className="form-control"
                                        id="Pin No."
                                        placeholder="Enter Pin No. "
                                        name="billPin_No"
                                        value={data.billPin_No}
                                        onChange={(e) => handlechange(e, i)}
                                        onInput={(e) => (e.target.value = e.target.value.slice(0, 10).replace(/\D/g, ""))}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Contact-Number"
                                      >
                                        Contact Number
                                      </Label>
                                      <Input
                                        type="number"
                                        className="form-control"
                                        id="Contact-Number"
                                        placeholder="Enter Contact Number. "
                                        name="billContactno"
                                        value={data.billContactno || ""}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Mobile-Number"
                                      >
                                        Mobile Number
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Mobile"
                                        placeholder="Enter 10-digit Mobile Number"
                                        name="billMobNo"
                                        value={data.billMobNo}
                                        onChange={(e) => handlechange(e, i)}
                                        onInput={(e) =>
                                        (e.target.value = e.target.value
                                          .slice(0, 10)
                                          .replace(/\D/g, ""))
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Mobile-Number"
                                      >
                                        Email
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Email"
                                        placeholder="Enter Email"
                                        name="billEmail"
                                        value={data.billEmail}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                      {emailError && (
                                        <p
                                          className="text-danger"
                                          style={{ color: "red" }}
                                        >
                                          {emailError}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="GST"
                                      >
                                        GST
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="GST"
                                        placeholder="Enter GST"
                                        name="billGst"
                                        value={data.billGst}
                                        onChange={(e) => handlechange(e, i)}
                                        maxLength={15}
                                        onInput={(e) =>
                                        (e.target.value =
                                          e.target.value.replace(
                                            /[^A-Za-z0-9@.]/g,
                                            ""
                                          ))
                                        }
                                      />
                                    </div>
                                  </div>
                                </Row>

                                <div className="d-flex align-items-start gap-3 mt-3">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-label right ms-auto nexttab"
                                    onClick={() => {
                                      toggleTab(activeTab + 1);
                                    }}
                                  >
                                    <i className="ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                                    Proceed Shipping Address
                                  </button>
                                </div>
                              </div>
                            </TabPane>

                            <TabPane tabId={2}>
                              <div>
                                <Row>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Name"
                                      >
                                        Contact Person
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Name"
                                        placeholder="Enter Name"
                                        name="shippContactperson"
                                        value={data.shippContactperson}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Address1"
                                      >
                                        Address 1
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Address1"
                                        placeholder="Enter Address 1"
                                        name="Name"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Address2"
                                      >
                                        Address 2
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Address2"
                                        placeholder="Enter Address 2"
                                        name="shippAddress2"
                                        value={data.shippAddress2}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="State"
                                      >
                                        State
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="State"
                                        placeholder="Enter State "
                                        name="shippState"
                                        value={data.shippState}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="City"
                                      >
                                        City
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="City"
                                        placeholder="Enter City "
                                        name="shippCity"
                                        value={data.shippCity}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Pin No."
                                      >
                                        Pin No.
                                      </Label>
                                      <Input
                                        type="number"
                                        className="form-control"
                                        id="Pin No."
                                        placeholder="Enter Pin No. "
                                        name="shippPin_No"
                                        value={data.shippPin_No}
                                        onChange={(e) => handlechange(e, i)}
                                        onInput={(e) =>
                                        (e.target.value = e.target.value
                                          .slice(0, 10)
                                          .replace(/\D/g, ""))
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Contact-Number"
                                      >
                                        Contact Number
                                      </Label>
                                      <Input
                                        type="number"
                                        className="form-control"
                                        id="City"
                                        placeholder="Enter Contact Number. "
                                        name="shippContactNo"
                                        value={data.shippContactNo}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Mobile-Number"
                                      >
                                        Mobile Number
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Mobile"
                                        placeholder="Enter 10-digit Mobile Number"
                                        name="shippMobNo"
                                        value={data.shippMobNo}
                                        onChange={(e) => handlechange(e, i)}
                                        onInput={(e) =>
                                        (e.target.value = e.target.value
                                          .slice(0, 10)
                                          .replace(/\D/g, ""))
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Mobile-Number"
                                      >
                                        Email
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Email"
                                        placeholder="Enter Email"
                                        name="shippEmail"
                                        value={data.shippEmail}
                                        onChange={(e) => handlechange(e, i)}
                                      />
                                      {emailError && (
                                        <p
                                          className="text-danger"
                                          style={{ color: "red" }}
                                        >
                                          {emailError}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="GST"
                                      >
                                        Final Destination
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="GST"
                                        placeholder="Enter Final Destination"
                                        name="finaldest"
                                        value={data.finaldest}
                                        onChange={(e) => handlechange(e, i)}
                                        maxLength={15}
                                        onInput={(e) =>
                                        (e.target.value =
                                          e.target.value.replace(
                                            /[^A-Za-z0-9@.]/g,
                                            ""
                                          ))
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Origin Of Goods"
                                      >
                                        Origin Of Goods
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Origin Of Goods"
                                        placeholder="Enter Origin Of Goods"
                                        name="originofgds"
                                        value={data.originofgds}
                                        onChange={(e) => handlechange(e, i)}
                                        maxLength={15}
                                        onInput={(e) =>
                                        (e.target.value =
                                          e.target.value.replace(
                                            /[^A-Za-z0-9@.]/g,
                                            ""
                                          ))
                                        }
                                      />
                                    </div>
                                  </div>
                                </Row>
                              </div>

                              <div className="d-flex align-items-start gap-3 mt-4">
                                <button
                                  type="button"
                                  className="btn btn-light btn-label previestab"
                                  onClick={() => {
                                    toggleTab(activeTab - 1);
                                  }}
                                >
                                  <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                  Back to Billing Address
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-label right ms-auto nexttab"
                                  onClick={() => {
                                    toggleTab(activeTab + 1);
                                  }}
                                >
                                  <i className="ri-bank-card-line label-icon align-middle fs-16 ms-2"></i>
                                  Continue to Bank Detail
                                </button>
                              </div>
                            </TabPane>

                            <TabPane tabId={3}>
                              <Row>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Bank-Name"
                                    >
                                      Bank Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="Bank-Name"
                                      placeholder="Enter Bank Name"
                                      name="banknm"
                                      value={data.banknm}
                                      onChange={(e) => handlechange(e, i)}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Branch-Name"
                                    >
                                      Branch Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="Branch-Name"
                                      placeholder="Enter Branch Name"
                                      name="branchnm"
                                      value={data.branchnm}
                                      onChange={(e) => handlechange(e, i)}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Account-Number"
                                    >
                                      Account Number
                                    </Label>
                                    <Input
                                      type="number"
                                      className="form-control"
                                      id="Account-Number"
                                      placeholder="Enter Account Number"
                                      name="accountno"
                                      value={data.accountno}
                                      onChange={(e) => handlechange(e, i)}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="IFCS-Code"
                                    >
                                      IFSC Code
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="IFCS-Code"
                                      placeholder="Enter IFCS Code"
                                      name="ifsccode"
                                      value={data.ifsccode}
                                      onChange={(e) => handlechange(e, i)}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Swift-Code"
                                    >
                                      Swift Code
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="Swift-Code"
                                      placeholder="Enter Swift Code"
                                      name="swiftcode"
                                      value={data.swiftcode}
                                      onChange={(e) => handlechange(e, i)}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Bank Address"
                                    >
                                      Bank Address
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="Bank Address"
                                      placeholder="Enter Bank Address"
                                      name="bankddress"
                                      value={data.bankddress}
                                      onChange={(e) => handlechange(e, i)}
                                    />
                                  </div>
                                </div>
                              </Row>

                              <div className="d-flex align-items-start gap-3 mt-4">
                                <button
                                  type="button"
                                  className="btn btn-light btn-label previestab"
                                  onClick={() => {
                                    toggleTab(activeTab - 1);
                                  }}
                                >
                                  <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                  Back to Shipping Address
                                </button>
                              </div>
                            </TabPane>
                          </TabContent>
                        </>
                      ))}
                    </>
                  )}

                  {supplierorvender && (
                    <>
                      {suppliervendor.map((data, i) => (
                        <>
                          <div className="step-arrow-nav mt-4 mx-n3 mb-3 ">
                            <Nav
                              className="nav-pills nav-justified custom-nav"
                              role="tablist"
                            >
                              <NavItem role="presentation">
                                <NavLink
                                  href="#"
                                  className={classnames(
                                    {
                                      active: activeTab === 1,
                                      done: activeTab <= 4 && activeTab >= 0,
                                    },
                                    "p-3 fs-15"
                                  )}
                                  onClick={() => {
                                    toggleTab(1);
                                  }}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  <i className="ri-user-2-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                  Billing Address
                                </NavLink>
                              </NavItem>
                              <NavItem role="presentation">
                                <NavLink
                                  href="#"
                                  className={classnames(
                                    {
                                      active: activeTab === 2,
                                      done: activeTab <= 4 && activeTab > 1,
                                    },
                                    "p-3 fs-15"
                                  )}
                                  onClick={() => {
                                    toggleTab(2);
                                  }}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  <i className="ri-bank-card-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2">
                                    {" "}
                                  </i>
                                  Bank Detail
                                </NavLink>
                              </NavItem>
                            </Nav>
                          </div>

                          <TabContent activeTab={activeTab}>
                            <TabPane tabId={1} id="pills-bill-info">
                              <div>
                                <Row>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Name"
                                      >
                                        Contact Person
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Name"
                                        placeholder="Enter Name"
                                        name="billContactperson"
                                        value={data.billContactperson}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Address1"
                                      >
                                        Address 1
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Address1"
                                        placeholder="Enter Address 1"
                                        name="billAddress1"
                                        value={data.billAddress1}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Address2"
                                      >
                                        Address 2
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Address2"
                                        placeholder="Enter Address 2"
                                        name="billAddress2"
                                        value={data.billAddress2}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="State"
                                      >
                                        State
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="State"
                                        placeholder="Enter State "
                                        name="billState"
                                        value={data.billState}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="City"
                                      >
                                        City
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="City"
                                        placeholder="Enter City "
                                        name="billCity"
                                        value={data.billCity}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Pin No."
                                      >
                                        Pin No.
                                      </Label>
                                      <Input
                                        type="number"
                                        className="form-control"
                                        id="Pin No."
                                        placeholder="Enter Pin No. "
                                        name="billPin_No"
                                        value={data.billPin_No}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                        onInput={(e) =>
                                        (e.target.value = e.target.value
                                          .slice(0, 10)
                                          .replace(/\D/g, ""))
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Contact-Number"
                                      >
                                        Contact Number
                                      </Label>
                                      <Input
                                        type="number"
                                        className="form-control"
                                        id="City"
                                        placeholder="Enter Contact Number. "
                                        name="billContactno"
                                        value={data.billContactno}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Mobile-Number"
                                      >
                                        Mobile Number
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Mobile"
                                        placeholder="Enter 10-digit Mobile Number"
                                        name="billMobNo"
                                        value={data.billMobNo}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                        onInput={(e) =>
                                        (e.target.value = e.target.value
                                          .slice(0, 10)
                                          .replace(/\D/g, ""))
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Email"
                                      >
                                        Email
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Email"
                                        placeholder="Enter Email"
                                        name="billEmail"
                                        value={data.billEmail}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                      />
                                      {emailError && (
                                        <p
                                          className="text-danger"
                                          style={{ color: "red" }}
                                        >
                                          {emailError}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="GST"
                                      >
                                        GST
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="GST"
                                        placeholder="Enter GST"
                                        name="billGst"
                                        value={data.billGst}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                        maxLength={15}
                                        onInput={(e) =>
                                        (e.target.value =
                                          e.target.value.replace(
                                            /[^A-Za-z0-9@.]/g,
                                            ""
                                          ))
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-3">
                                      <Label
                                        className="form-label"
                                        htmlFor="Pan"
                                      >
                                        Pan
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="Pan"
                                        placeholder="Enter Pan"
                                        name="billPan"
                                        value={data.billPan}
                                        onChange={(e) => {
                                          handlesupplierchange(e, i);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Row>

                                <div className="d-flex align-items-start gap-3 mt-3">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-label right ms-auto nexttab"
                                    onClick={() => {
                                      toggleTab(activeTab + 1);
                                    }}
                                  >
                                    <i className="ri-bank-card-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                    Proceed Bank Detail
                                  </button>
                                </div>
                              </div>
                            </TabPane>

                            <TabPane tabId={2}>
                              <Row>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Bank-Name"
                                    >
                                      Bank Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="Bank-Name"
                                      placeholder="Enter Bank Name"
                                      name="banknm"
                                      value={data.banknm}
                                      onChange={(e) => {
                                        handlesupplierchange(e, i);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Branch-Name"
                                    >
                                      Branch Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="Branch-Name"
                                      placeholder="Enter Branch Name"
                                      name="branchnm"
                                      value={data.branchnm}
                                      onChange={(e) => {
                                        handlesupplierchange(e, i);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Account-Number"
                                    >
                                      Account Number
                                    </Label>
                                    <Input
                                      type="number"
                                      className="form-control"
                                      id="Account-Number"
                                      placeholder="Enter Account Number"
                                      name="accountno"
                                      value={data.accountno}
                                      onChange={(e) => {
                                        handlesupplierchange(e, i);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="IFCS-Code"
                                    >
                                      IFSC Code
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="IFCS-Code"
                                      placeholder="Enter IFCS Code"
                                      name="ifsccode"
                                      value={data.ifsccode}
                                      onChange={(e) => {
                                        handlesupplierchange(e, i);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="Swift-Code"
                                    >
                                      Swift Code
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="Swift-Code"
                                      placeholder="Enter Swift Code"
                                      name="swiftcode"
                                      value={data.swiftcode}
                                      onChange={(e) => {
                                        handlesupplierchange(e, i);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-3">
                                  <div className="mb-3">
                                    <Label
                                      className="form-label"
                                      htmlFor="bankddress"
                                    >
                                      Bank Address
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="bankddress"
                                      placeholder="Enter Bank Address"
                                      name="bankddress"
                                      value={data.bankddress}
                                      onChange={(e) => {
                                        handlesupplierchange(e, i);
                                      }}
                                    />
                                  </div>
                                </div>
                              </Row>

                              <div className="d-flex align-items-start justify-content-end gap-3 mt-4">
                                <Button
                                  type="button"
                                  className="btn btn-light btn-label previestab"
                                  onClick={() => {
                                    toggleTab(activeTab - 1);
                                  }}
                                >
                                  <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                  Back to Billing Address
                                </Button>
                              </div>
                            </TabPane>
                          </TabContent>
                        </>
                      ))}
                    </>
                  )}

                  <div className="d-flex justify-content-end align-items-center mt-4">
                    <Button className="btn btn-success" type="submit" size="sm">
                      Save
                    </Button>
                  </div>

                  <ToastContainer closeButton={false} limit={10} />
                </CardBody>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LedgerUpdate;
