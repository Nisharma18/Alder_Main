import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets";
import BestSellingProducts from "./BestSellingProducts";

import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import Section from "./Section";
import UpcomingSchedule from "./UpcomingSchedules";
import TopSellers from "./TopSellers";
import Marketplace from "./Marketplace";

const DashboardEcommerce = () => {
  document.title = "Alder Dashboard";

  const [rightColumn, setRightColumn] = useState(true);

  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Row>
                  <Widget />
                </Row>
                <Row>
                  <Col xl={8}>
                    <Marketplace />
                  </Col>
                  <SalesByLocations />
                </Row>

                <Row>
                  <UpcomingSchedule />

                  <Col xl={8}>
                    <RecentOrders />
                  </Col>
                </Row>
              </div>
            </Col>
            {/* <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
