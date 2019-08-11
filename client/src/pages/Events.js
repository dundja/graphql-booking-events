import React, { useState, useContext, useEffect } from "react";
import "./Events.css";

import useForm from "../hooks/useForm";
import { AuthContext } from "../context/auth-context";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList";
import Spinner from "../components/Spinner/Spinner";

const Events = () => {
    const { authState } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [creating, setCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [values, handleChange] = useForm();

    // useEffect(() => {
    //     fetchEvents(setEvents);
    //     console.log("useEffect []", events);
    // }, []);

    useEffect(() => {
        fetchEvents(setEvents, setIsLoading);
    }, [events.length]);

    useEffect(() => {
        // sadasda
    }, []);

    const handleModalCancel = () => {
        setCreating(false);
        setSelectedEvent(null);
    };

    const modalConfirmHandler = async () => {
        if (
            values.date === undefined ||
            values.title === undefined ||
            values.price === undefined ||
            values.description === undefined
        ) {
            return;
        }

        const { date, title, price, description } = values;
        if (
            date.trim().length === 0 ||
            title.trim().length === 0 ||
            price.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        const requestBody = {
            query: `
                mutation {
                  createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                    _id
                    title
                    description
                    date
                    price
                  }
                }
              `
        };

        const token = authState.token;
        try {
            const res = await fetch("/graphql", {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                }
            });

            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed!");
            }

            const data = await res.json();
            const newEvent = data.createEvent;
            console.log("TCL: Events -> newEvent", newEvent);

            // gore nisam fetchovao ceo event objekat sa kreatorom
            // kako ne bi bzvz trazio dodatnu datu sa servera (power of graphql :))
            setEvents([
                ...events,
                {
                    _id: newEvent._id,
                    title: newEvent.title,
                    description: newEvent.description,
                    price: newEvent.price,
                    date: newEvent.date,
                    creator: {
                        _id: authState.userId
                    }
                }
            ]);
        } catch (err) {
            console.log(err);
        }
    };

    const showDetailHandler = eventId => {
        const selEvent = events.find(event => event._id === eventId);
        return setSelectedEvent(selEvent);
    };

    return (
        <>
            {creating && (
                <>
                    <Backdrop onCancel={handleModalCancel} />
                    <Modal
                        title="Add event"
                        canCancel={true}
                        canConfirm={true}
                        onCancel={handleModalCancel}
                        onConfirm={modalConfirmHandler}
                        confirmText="Confirm"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    type="text"
                                    name="description"
                                    onChange={handleChange}
                                />
                            </div>
                        </form>
                    </Modal>
                </>
            )}
            {/* if event is selected */}
            {selectedEvent && (
                <>
                    <Backdrop onCancel={handleModalCancel} />
                    <Modal
                        title={selectedEvent.title}
                        canCancel={true}
                        canConfirm={true}
                        onCancel={handleModalCancel}
                        onConfirm={() =>
                            bookEventHandler(
                                selectedEvent._id,
                                authState.token,
                                setIsLoading,
                                setSelectedEvent
                            )
                        }
                        confirmText="Book"
                    >
                        <>
                            <h1>{selectedEvent.title}</h1>
                            <h2>
                                ${selectedEvent.price} -{" "}
                                {new Date(
                                    selectedEvent.date
                                ).toLocaleDateString()}
                            </h2>
                            <p>{selectedEvent.description}</p>
                        </>
                    </Modal>
                </>
            )}
            {authState.token && (
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={() => setCreating(true)}>
                        Create event
                    </button>
                </div>
            )}
            {isLoading ? (
                <Spinner />
            ) : (
                <EventList events={events} onViewDetail={showDetailHandler} />
            )}
        </>
    );
};

export default Events;

// get Events
const fetchEvents = async (setEvents, setIsLoading) => {
    setIsLoading(true);
    const requestBody = {
        query: `
        query {
            events {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
          }`
    };

    try {
        const res = await fetch("/graphql", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed!");
        }

        const { data } = await res.json();

        setEvents(data.events);
        setIsLoading(false);
    } catch (err) {
        console.log(err);
        setIsLoading(false);
    }
};

// book event
const bookEventHandler = async (
    eventId,
    token,
    setIsLoading,
    setSelectedEvent
) => {
    if (!token) {
        setSelectedEvent(null);
        return;
    }
    setIsLoading(true);
    const requestBody = {
        query: `
        mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id ) {
                _id
                createdAt
                updatedAt
            }
          }`,
        variables: {
            id: eventId
        }
    };

    try {
        const res = await fetch("/graphql", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        });

        if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed!");
        }

        // const { data } = await res.json();
        setIsLoading(false);
        setSelectedEvent(null);
    } catch (err) {
        console.log(err);
        setIsLoading(false);
    }
};
