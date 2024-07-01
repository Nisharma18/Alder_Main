import React from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import Vector from './VectorMap'; 

const SalesByLocations = () => {
    return (
        <React.Fragment>
            <Col xl={4}>
                <Card className="card-height-100">
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Summary</h4>
                        
                    </CardHeader>

                    <CardBody> 

                        <div
                            data-colors='["--vz-light", "--vz-secondary", "--vz-primary"]'
                            style={{ height: "110px" }} dir="ltr">
                            <Vector
                                value="world_mill"
                            />
                        </div> 

                        <div className="px-2 py-2 mt-1">
                            <p className="mb-1">Total Orders <span className="float-end">15</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
                                </div>
                            </div>

                            <p className="mt-3 mb-1">Pending Orders <span className="float-end">5</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="75">
                                </div>
                            </div>

                            <p className="mt-3 mb-1">Total Dispatch <span className="float-end">8</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "47%" }} aria-valuenow="47" aria-valuemin="0" aria-valuemax="47">
                                </div>
                            </div>
                            <p className="mt-3 mb-1">Pending Dispatch <span className="float-end">2</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "47%" }} aria-valuenow="47" aria-valuemin="0" aria-valuemax="47">
                                </div>
                            </div>

                            <p className="mt-3 mb-1">Total Vendor <span className="float-end">10</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "82%" }} aria-valuenow="82" aria-valuemin="0" aria-valuemax="82">
                                </div>
                            </div>

                            <p className="mt-3 mb-1">Pending Vendor <span className="float-end">5</span></p>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                                <div className="progress-bar progress-bar-striped bg-primary" role="progressbar"
                                    style={{ width: "82%" }} aria-valuenow="82" aria-valuemin="0" aria-valuemax="82">
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default SalesByLocations;