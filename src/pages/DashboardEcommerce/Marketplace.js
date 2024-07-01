import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import CountUp from "react-countup";

import { useSelector, useDispatch } from "react-redux";
import { getMarketChartsDatas } from '../../slices/thunks';

// Import Chart
import {MarketplaceChart} from "./DashboardNFTCharts";
import { createSelector } from 'reselect';

const Marketplace = () => {
    const dispatch = useDispatch();

    const [chartData, setchartData] = useState([]);

    const selectmarketData = createSelector((state) => state.DashboardNFT.marketplaceData,(marketplaceData) => marketplaceData);
    // Inside your component
    const marketplaceData = useSelector(selectmarketData);

    useEffect(() => {
        setchartData(marketplaceData);
    }, [marketplaceData]);

    const onChangeChartPeriod = pType => {
        dispatch(getMarketChartsDatas(pType));
    };

    useEffect(() => {
        dispatch(getMarketChartsDatas("all"));
    }, [dispatch]);

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <span>You are good to go!</span>;
        } else {
            return (
                <>
                    <div className="countdownlist">
                        <div className="countdownlist-item">
                            <div className="count-title">Days</div>
                            <div className="count-num">{days}</div></div>
                        <div className="countdownlist-item">
                            <div className="count-title">Hours</div>
                            <div className="count-num">{hours}</div></div>
                        <div className="countdownlist-item"><div className="count-title">Minutes</div>
                            <div className="count-num">{minutes}</div></div><div className="countdownlist-item">
                            <div className="count-title">Seconds</div>
                            <div className="count-num">{seconds}</div></div>
                    </div>
                </>
            );
        }
    };
    return (
        <React.Fragment>
            <Row>
                <Col xxl={12}>
                    <Card>
                        <CardBody className="p-0">
                            <Row className="g-0">
                                <Col xxl={12}>
                                    <div className="">
                                        <CardHeader className="border-0 align-items-center d-flex">
                                            <h4 className="card-title mb-0 flex-grow-1">Monthly Statistics</h4>
                                           
                                        </CardHeader>
                                        <Row className="g-0 text-center">
                                            <Col sm={6} className="col-6">
                                                <div className="p-3 border border-dashed border-start-0">
                                                    <h5 className="mb-1">
                                                        <span className="counter-value" data-target="36.48">
                                                            <CountUp start={0} end={20}   duration={4} />
                                                        </span>
                                                    </h5>
                                                    <p className="text-muted mb-0">Orders</p>
                                                </div>
                                            </Col>
                                            <Col sm={6} className="col-6">
                                                <div className="p-3 border border-dashed border-start-0">
                                                    <h5 className="mb-1">
                                                        <span className="counter-value" data-target="92.54">
                                                            <CountUp start={0} end={10}   duration={4} />
                                                        </span>
                                                    </h5>
                                                    <p className="text-muted mb-0">Dispatch</p>
                                                </div>
                                            </Col>
                                        </Row>
                                        <MarketplaceChart series={chartData} dataColors='["--vz-primary","--vz-success"]' />
                                    </div>
                                </Col>

                                
                            </Row>
                        </CardBody> 
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Marketplace;