import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { recentOrders } from '../../common/data';

const RecentOrders = () => {
    return (
        <React.Fragment>
            <Col xl={12}>
                <Card>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Recent Orders</h4>
                       
                    </CardHeader>

                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                                <thead className="text-muted table-light">
                                    <tr>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Client Name</th>
                                        <th scope="col">Order Quantity</th>
                                        <th scope="col">Dispatch Date</th>
                                        <th scope="col">Delay</th>
                                        <th scope="col">Status</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {(recentOrders || []).map((item, key) => (<tr key={key}>
                                        <td>
                                            <Link to="/apps-ecommerce-order-details" className="fw-medium link-primary">{item.orderId}</Link>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-2">
                                                    <img src={item.img} alt="" className="avatar-xs rounded-circle" />
                                                </div>
                                                <div className="flex-grow-1">{item.name}</div>
                                            </div>
                                        </td>
                                        <td>{item.product}</td>
                                        <td>
                                            <span className="text-success">{item.date}</span>
                                        </td>
                                        <td>{item.delay}</td>
                                        <td>
                                            <span className={"badge bg-" + item.statusClass+"-subtle text-"+item.statusClass}>{item.status}</span>
                                        </td>
                                        
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default RecentOrders;