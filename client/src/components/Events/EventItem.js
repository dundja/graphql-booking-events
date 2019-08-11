import React, { useContext } from "react";
import "./EventItem.css";

import { AuthContext } from "../../context/auth-context";

const EventItem = ({
    title,
    id,
    description,
    price,
    date,
    creator,
    onDetail
}) => {
    const { authState } = useContext(AuthContext);
    let isOwner;
    if (authState.userId === creator._id) {
        isOwner = <p>You are owner</p>;
    } else {
        isOwner = (
            <button className="btn" onClick={() => onDetail(id)}>
                View details
            </button>
        );
    }

    return (
        <li className="events__list-item">
            <div>
                <h1>{title}</h1>
                <h2>
                    ${price} - {new Date(date).toLocaleDateString()}
                </h2>
            </div>
            <div>{isOwner}</div>
        </li>
    );
};

export default EventItem;
