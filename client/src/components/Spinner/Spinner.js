import React from "react";
import "./Spinner.css";

const Spinner = () => {
    return (
        <div className="wrapper">
            <div className="lds-ripple">
                <div />
                <div />
            </div>
        </div>
    );
};

export default Spinner;
