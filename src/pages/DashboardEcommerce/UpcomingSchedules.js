import React from 'react';
import Flatpickr from "react-flatpickr";
import { Link } from 'react-router-dom';

const UpcomingSchedules = () => {
    return (
        <React.Fragment>
            <div className="col-lg-4">
                <div className="card card-height-100">
                    <div className="card-header border-0">
                        <h4 className="card-title mb-0">Calendar</h4>
                    </div>
                    <div className="card-body pt-0">
                        <div className="upcoming-scheduled">
                            <Flatpickr
                                className="form-control"
                                options={{
                                    dateFormat: "d M, Y",
                                    inline: true
                                }}
                            />
                        </div>

                        

                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UpcomingSchedules;