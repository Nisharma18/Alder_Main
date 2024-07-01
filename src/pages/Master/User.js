import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import url from "../Base_url/Base_url";
// Import Images
import dummyImg from "../../assets/images/users/user-dummy-img.jpg";
import CryptoJS from 'crypto-js';

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
  Button
} from "reactstrap";
import Select from "react-select";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import Token from "../Token/Base_Token";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

import TableContainer from "../../Components/Common/TableContainer";

// Formik
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User = () => {
  const data = JSON.parse(sessionStorage.getItem("user"));
  const Token = `Bearer ${data.jwtToken}`;
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
        Cell: ({ row }) => (
          <>
            <div className="d-flex align-items-center image-container">
              <div className="flex-shrink-0">
                <img
                  src={`${url}/image/${row.original.id}`}
                  alt=""
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(6)';
                    e.target.style.zIndex = 999; // Ensure the image is on top
                    e.target.style.position = 'relative'; // Ensure it is positioned relative to its original location
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.zIndex = 1; // Reset the z-index
                    e.target.style.position = 'static'; // Reset the position
                  }}
                  className="avatar-xs rounded-circle"
                />
              </div>
            </div>
          </>
        ),
      },

      {
        Header: "Employee Id",
        accessor: "empid",
        filterable: false,
      },
      {
        Header: "Name",
        accessor: "empName",
        filterable: false,
      },
      {
        Header: "Username",
        accessor: "username",
        filterable: false,
      },
      {
        Header: "User Email",
        accessor: "userEmail",
        filterable: false,
      },
      {
        Header: "Mobile No",
        accessor: "usermobile",
        filterable: false,
      },
      {
        Header: "Action",
        accessor: "actionId",
        Cell: (row) => {
          console.log(row.row.original);
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit"title="Continue" style={{ cursor: "pointer" }}>
                <i
                  className="ri-pencil-line fs-16"
                  onClick={() => handleEditUser(row.row.original.id)}
                ></i>
              </li>
              <li className="list-inline-item edit" title="Continue" style={{ cursor: "pointer" }}>
                {row.row.original.enabled === "Active" ? (
                  <i
                    className="ri-lock-line fs-16"
                    onClick={() =>
                      handleStatus(
                        row.row.original.id,
                        row.row.original.enabled
                      )
                    }
                    style={{ color: "red" }}
                  ></i>
                ) : (
                  <i
                    className="ri-lock-line fs-16"
                    onClick={() =>
                      handleStatus(
                        row.row.original.id,
                        row.row.original.enabled
                      )
                    }
                    style={{ color: "green" }}
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

  const [inputs, setinputs] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [tag, setTag] = useState([]);
  const [file, setFile] = useState(null);
  const [showfile, setShowfile] = useState(null);
  const [Empidupdate, setEmpidupdate] = useState("");
  const [crmcontacts, setCrmcontacts] = useState([]);
  const [error, seterror] = useState(false);
  const [modal, setModal] = useState(false);
  const [rwid, setrwid] = useState("");
  const ip = "http://192.168.1.3:8085";

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    }
    setIsValidEmail(true);
  }, [modal]);
  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "User";

  // handle userimage

  function handleImageChange(e) {
    const selectedFile = e.target.files[0];
    setShowfile(URL.createObjectURL(e.target.files[0]));
    setFile(selectedFile);
  }

  // email validation
  const [isValidEmail, setIsValidEmail] = useState(true);

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // handle user get api
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url + "/GetAllUser", {
        headers: { Authorization: Token },
      });
      if (!response.ok) {
        seterror(true);
        throw new Error("Network response was not ok");
      }

      const userdata = await response.json();
      setCrmcontacts(userdata);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // handle user create api

  const tags = [
    { label: "User", value: "User" },
    { label: "Admin", value: "Admin" },
  ];

  const HandlechangeInput = (e) => {
    if (e.target.name === "E-Mail") {
      setIsValidEmail(isEmailValid(e.target.value));
      setinputs({ ...inputs, [e.target.name]: e.target.value });
    } else {
      setinputs({ ...inputs, [e.target.name]: e.target.value });
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();


    if(!inputs.username.trim()){
      toast.error(`Username cannot be empty`, { autoClose: 3000 });
      return;
    }

    const existingUser = crmcontacts.find(user => user.username === inputs.username);
    if (existingUser) {
      toast.error(`User with username '${inputs.username}' already exists`, { autoClose: 3000 });
      return;
    }
  
    // Check if passwords match
    if (inputs.password !== confirmPassword) {
      toast.error(`Repeat password does not match`, { autoClose: 3000 });
      return;
    }

    const useremail =
      inputs.userEmail !== "" && !isEmailValid(inputs.userEmail);

    const emptyImageData = new Blob([], { type: "image/png" });
    const emptyImageFile = new File([emptyImageData], "empty.jpg", {
      type: "image/png",
    });

    let urls = "";
    let Method = "POST";
    let msg = "";

    if (Empidupdate) {
      urls = `${url}/UpdateUser/${rwid}`;
      Method = "PUT";
      msg = "User Update Successfully";
    } else {
      urls = `${url}/Adduser`;
      msg = "User Create Successfully";
    }

    const formData = new FormData();
    if (file == null) {
      formData.append("userimg", emptyImageFile);
    } else {
      formData.append("userimg", file);
    }

    formData.append("user", JSON.stringify(inputs));

    console.log(confirmPassword.length, useremail, "confirmPassword-------------------");
    
    if (!inputs.empName) {
      toast.error(`Employee Name is required`, { autoClose: 1000 });
      return;
    } else if (!inputs.username) {
      toast.error(`Username is required`, { autoClose: 1000 });
      return;
    } else if (!inputs.password) {
      toast.error(`Password is required`, { autoClose: 1000 });
      return;
    } else if (!confirmPassword) {
      toast.error(`Repeat Password is required`, { autoClose: 1000 });
      return;
    } else if (inputs.password !== confirmPassword) {
      toast.error(`Repeat password does't match`, { autoClose: 1000 });
      return;
    } else if (!inputs.userRoll) {
      toast.error(`User Type is required`, { autoClose: 1000 });
      return;
    }  else {
      try {
        const response = await fetch(urls, {
          method: Method,
          headers: {
            Authorization: Token,
          },
          body: formData,
        });

        if (response.ok) {
          fetchData();
          toast.success(`${msg}`);
        } else {
          throw new Error("Error: " + response.status);
        }
      } catch (error) {
        toast.error(`Error occurred while ${Empidupdate ? "updating" : "creating"} user`, { autoClose: 3000 });
  }
    } 

    setinputs({
      empName: "",
      userName: "",
      password: "",
      width: "",
      userRoll: "",
      userEmail: "",
      usermobile: "",
    });
    console.log('llllllllllllllllllll');
    setShowfile(null);
    setConfirmPassword("");
    setModal(false);
    setFile(null);
  };
  
  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, 'encryption_secret').toString();
  };
  // handle user update api
  const handleEditUser = async (id) => {
    try {
      const response = await fetch(url + `/GetUser/${id}`, {
        headers: {
          Authorization: Token,
        },
      });
      const json = await response.json();
      console.log('Fetched User JSON:', json);

      json.password = encryptPassword(json.password);
      console.log('Encrypted Password:', json.password);
    // const response = await fetch(url + `/GetUser/${id}`, {
    //   headers: {
    //     Authorization: Token,
    //   },
    // });
    // const json = await response.json();
    setinputs(json);
    setConfirmPassword(json.password);
    setShowfile(url + "/image/" + id);
    setEmpidupdate(json.empid);
    setModal(true);
    setrwid(json.id);
    setTag({ label: json.userRoll, value: json.userRoll });
  } catch (error) {
    console.error("'Error fetching or encrypting user data:",error);
  }
};

  //user enable api

  const handleStatus = (id, status) => {
    console.log("id");
    console.log(id);
    console.log("status");
    console.log(status);
  };
  return (
    <React.Fragment>
      <div className="page-content" style={{ overflow: "hidden" }}>
        <ExportCSVModal
          show={isExportCSV}
          data={crmcontacts}
          onCloseClick={() => setIsExportCSV(false)}
        />

        <Container fluid>
          <BreadCrumb  pageName="User" title="Master" subTitle="User" buttons={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
              <button
                className="btn add-btn main-bg"
                onClick={() => {
                  setModal(true);
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
            </div>
          } />
          <Row>
            <Col xxl={12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  <div>
                    {crmcontacts.length ? ( 
                      <TableContainer
                        columns={columns}
                        data={crmcontacts || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder="Search for user..."
                        isStatus={true}
                        StatusState={setCrmcontacts}
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>

                  <Modal
                    id="showModal"
                    backdrop={"static"}
                    isOpen={modal}
                    toggle={toggle}
                    centered
                    size="lg"
                  >
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      Add User
                    </ModalHeader>

                    <Form className="tablelist-form" onSubmit={handlesubmit}>
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div className="text-center">
                              <div className="position-relative d-inline-block">
                                <div className="position-absolute  bottom-0 end-0">
                                  <Label
                                    htmlFor="customer-image-input"
                                    className="mb-0"
                                  >
                                    <div className="avatar-xs cursor-pointer">
                                      <div className="avatar-title bg-light border rounded-circle text-muted">
                                        <i className="ri-image-fill"></i>
                                      </div>
                                    </div>
                                  </Label>
                                  <Input
                                    className="form-control d-none"
                                    id="customer-image-input"
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={handleImageChange}
                                  />
                                </div>
                                <div
                                  className=" p-1"
                                  style={{ height: "6rem", width: "6rem" }}
                                >
                                  <div className="avatar-title bg-light rounded-circle">
                                    {showfile ? (
                                      <img
                                        src={showfile}
                                        alt="Selected Image"
                                        id="customer-img"
                                        className="avatar-md rounded-circle object-fit-cover"
                                      />
                                    ) : (
                                      <img
                                        src={dummyImg}
                                        alt="dummyImg"
                                        id="customer-img"
                                        className="avatar-md rounded-circle object-fit-cover"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="Employee-Name"
                                className="form-label"
                              >
                                Employee Name<span className="required">*</span>
                              </Label>
                              <Input
                                name="empName"
                                className="form-control"
                                placeholder="Enter Name"
                                type="text"
                                value={inputs.empName}
                                onChange={HandlechangeInput}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label htmlFor="Username" className="form-label">
                                Username<span className="required">*</span>
                              </Label>
                              <Input
                                name="username"
                                id="Username"
                                className="form-control"
                                placeholder="Enter Username "
                                type="text"
                                value={inputs.username}
                                onChange={HandlechangeInput}
                              />
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div>
                              <Label htmlFor="Password" className="form-label">
                                Password<span className="required">*</span>
                              </Label>

                              <Input
                                name="password"
                                id="Password"
                                className="form-control"
                                placeholder="Enter Password"
                                // type="password"
                                type={showPassword ? 'text' : 'password'}
                                validate={{
                                  required: { value: true },
                                }}
                                value={inputs.password}
                                onChange={HandlechangeInput}
                              />
                                                  <i
                                className={`ri-eye-${showPassword ? 'close-fill' : 'fill'}`}
                                onClick={togglePasswordVisibility}
                                style={{
                                  position: 'absolute',
                                  top: '70%',
                                  right: '13px',
                                  transform: 'translateY(-50%)',
                                  cursor: 'pointer',
                                  fontSize: '16px', // Adjust the font size as needed
                                }}
                              ></i>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="Repeat-Password"
                                className="form-label"
                              >
                                Repeat Password<span className="required">*</span>
                              </Label>

                              <Input
                                name="confirmPassword"
                                id="password"
                                className="form-control"
                                placeholder="Enter Repeat Password"
                                // type="password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                              />
                                <i
                                  className={`ri-eye-${showConfirmPassword ? 'close-fill' : 'fill'}`}
                                  onClick={toggleConfirmPasswordVisibility}
                                  style={{
                                    position: 'absolute',
                                    top: '70%',
                                    right: '13px',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    fontSize: '16px', // Adjust the font size as needed
                                  }}
                                ></i>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div>
                              <Label htmlFor=" E-Mail" className="form-label">
                                E-Mail
                              </Label>

                              <Input
                                name="userEmail"
                                id=" E-Mail"
                                className="form-control"
                                placeholder="Enter E-Mail"
                                type="text"
                                value={inputs.userEmail}
                                onChange={HandlechangeInput}
                              />
                              {!isValidEmail && (
                                <div style={{ color: "red" }}>
                                  Enter a valid Email
                                </div>
                              )}
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="Mobile-Number"
                                className="form-label"
                              >
                                Mobile Number
                              </Label>

                              <Input
                                name="usermobile"
                                id="Mobile-Number"
                                className="form-control"
                                placeholder="Enter Mobile-Number"
                                type="text"
                                value={inputs.usermobile}
                                onChange={HandlechangeInput}
                                maxLength={10}
                              />
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div>
                              <Label htmlFor="Admin" className="form-label">
                                User Type<span className="required">*</span>
                              </Label>
                              <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select
                                  value={tag}
                                  onChange={(e) => {
                                    setTag(e);
                                    setinputs((prevData) => ({
                                      ...prevData,
                                      userRoll: e.value,
                                    }));
                                  }}
                                  className="mb-0"
                                  options={tags}
                                  id="taginput-choices"
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <Button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setModal(false);
                            }}
                            size="sm"
                          >
                            Close
                          </Button>
                          <Button
                            type="submit"
                            className="btn btn-success"
                            id="add-btn"
                            size="sm"
                          >
                            Save
                          </Button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>

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

export default User;
