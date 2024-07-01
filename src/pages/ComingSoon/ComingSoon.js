import React from "react";
import { Col, Container, Input, InputGroup, Row } from "reactstrap";
import ParticlesAuth from "../../pages/AuthenticationInner/ParticlesAuth";
import Countdown from "react-countdown";

//import images
import comingsoon from "../../assets/images/comingsoon.png";

const ComingSoon = () => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>;
    } else {
      return (
        <>
          <React.Fragment>
            <div className="page-content">
              <Container fluid>
                <Row>
                 
                </Row>
              </Container>
            </div>
          </React.Fragment>
        </>
      );
    }
  };

  document.title = "Coming Soon";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12} className="mt-4">
                <div className="text-center mt-sm-5 pt-4 mb-4 mt-4">
                  <div className="mb-sm-5 pb-sm-4 pb-5">
                    <img
                      src={comingsoon}
                      alt=""
                      height="120"
                      className="move-animation"
                    />
                  </div>
                  <div className="mb-5">
                    <h1 className="display-2 coming-soon-text">Coming Soon</h1>
                  </div>
                  <div>
                    <Row className="justify-content-center mt-5">
                      <Col lg={8}>
                        <Countdown date="2025/12/31" renderer={renderer} />
                      </Col>
                    </Row>

                    <div className="mt-5">
                      <h4>Get notified when we launch</h4>
                      <p className="text-muted">
                        Don't worry we will not spam you 😊
                      </p>
                    </div>

                   
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default ComingSoon;
