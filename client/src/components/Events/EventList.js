import React from "react";
import "./EventList.css";

import EventItem from "./EventItem";

const EventList = ({ events, onViewDetail }) => {
    return (
        <ul className="events__list">
            {events.map(event => (
                <EventItem
                    key={event._id}
                    id={event._id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    price={event.price}
                    creator={event.creator}
                    onDetail={onViewDetail}
                />
            ))}
        </ul>
    );
};

export default EventList;
