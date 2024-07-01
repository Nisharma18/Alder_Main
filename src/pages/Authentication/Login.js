import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import logoLight from "../../assets/logo/erpLogo.svg";
import url from "../Base_url/Base_url";
//import images

const Login = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [validusername, setValidusername] = useState(false);
  const [validpassword, setValidpassword] = useState(false);
  const [loginfaild, setLoginfaild] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));

    setValidusername(false);
    setValidpassword(false);
    setLoginfaild(false);
  };

  const logindata = {
    userName: credentials.username,
    password: credentials.password,
  };

  const navigate = useNavigate();
  const handlesubmit = (e) => {
    e.preventDefault();
    setValidusername(false);
    setValidpassword(false);
    setLoginfaild(false);

    if (credentials.username.trim() === "") {
      setValidusername(true);
    } else if (credentials.password.trim() === "") {
      setValidpassword(true);
    } else {
      fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindata),
      })
    
        .then((response) => response.json())
        .then((data) => {
          
          console.log("data==========");
          console.log(data);
          sessionStorage.setItem("user", JSON.stringify(data));
          navigate("/dashboard");
        })
        .catch((error) => {
          setLoginfaild(true);
        });
    }
    console.log("logindata=========", logindata)
  }; 

  document.title = "Login";
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              {/* <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="20" />
                    </Link>
                  </div>
                </div>
              </Col> */}
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card style={{marginTop:'6rem'}}>
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                    <img src={logoLight} alt="" height="50" />
                      <h5 className="text-primary mt-4">Welcome Back !</h5>
                      
                      <p  style={{borderBottom:'1px solid #DADADA' ,lineHeight:'.1rem',margin:'10px 0 20px'}} className="text-muted">
                        <span style={{    background: "#FFF",padding: "0 10px"}}>
                        Sign In With Company Account.
                        </span>
                      </p>
                    </div>

                    <div className="p-2 mt-4">
                      <Form onSubmit={handlesubmit}>
                        <div className="mb-3">
                          <Label htmlFor="username" className="form-label">
                            Username
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            placeholder="Enter Username"
                            value={credentials.username || ""}
                            onChange={handleChange}
                            name="username"
                          />
                        </div>

                        {validusername && (
                          <p style={{ color: "red" }} className="text-danger">
                            Please Enter Username
                          </p>
                        )}

                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={credentials.password}
                              onChange={handleChange}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                            />
                            {validpassword && (
                              <p
                                style={{ color: "red" }}
                                className="text-danger"
                              >
                                Please Enter Password
                              </p>
                            )}

                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              onClick={() => setPasswordShow(!passwordShow)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            Remember me
                          </Label>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Sign In
                          </Button>

                          {loginfaild && (
                            <div
                              variant="body2"
                              style={{
                                marginLeft: "70px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              Invalid Username Or Password
                            </div>
                          )}
                        </div>
                        {/* 
                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title">Sign In with</h5>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            to="#"
                                                            className="btn btn-primary btn-icon me-1"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                socialResponse("facebook");
                                                            }}
                                                        >
                                                            <i className="ri-facebook-fill fs-16" />
                                                        </Link>
                                                        <Link
                                                            to="#"
                                                            className="btn btn-danger btn-icon me-1"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                socialResponse("google");
                                                            }}
                                                        >
                                                            <i className="ri-google-fill fs-16" />
                                                        </Link>
                                                        <Button color="dark" className="btn-icon"><i className="ri-github-fill fs-16"></i></Button>{" "}
                                                        <Button color="info" className="btn-icon"><i className="ri-twitter-fill fs-16"></i></Button>
                                                    </div>
                                                </div> */}
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                {/* <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account ? <Link to="/register" className="fw-semibold text-primary text-decoration-underline"> Signup </Link> </p>
                                </div> */}
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
