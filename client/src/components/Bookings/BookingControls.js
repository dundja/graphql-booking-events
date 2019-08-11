import React from "react";
import "./BookingControls.css";

const BookingControls = ({ onChange, activeOutputType }) => {
    return (
        <div className="bookings-control">
            <button
                className={activeOutputType === "list" ? "active" : ""}
                onClick={() => onChange("list")}
            >
                List
            </button>
            <button
                className={activeOutputType === "chart" ? "active" : ""}
                onClick={() => onChange("chart")}
            >
                Charts
            </button>
        </div>
    );
};

export default BookingControls;
