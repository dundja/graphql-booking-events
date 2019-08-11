import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList";
import BookingChart from "../components/Bookings/BookingChart";
import BookingControls from "../components/Bookings/BookingControls";

const Bookings = () => {
    const { authState } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [outputType, setOutputType] = useState("list");

    useEffect(() => {
        let isActive = true;
        if (isActive) {
            fetchBookings(authState.token, setIsLoading, setBookings);
        }
        return () => (isActive = false);
    }, []);

    const changeOutputTypeHandler = type => {
        if (type === "list") {
            setOutputType("list");
        } else {
            setOutputType("chart");
        }
    };

    let content = <Spinner />;
    if (!isLoading) {
        content = (
            <>
                <BookingControls
                    onChange={changeOutputTypeHandler}
                    activeOutputType={outputType}
                />
                <div>
                    {outputType === "list" ? (
                        <BookingList
                            bookings={bookings}
                            setBookings={setBookings}
                            setIsLoading={setIsLoading}
                        />
                    ) : (
                        <BookingChart bookings={bookings} />
                    )}
                </div>
            </>
        );
    }

    return content;
};

export default Bookings;

// fetch bookings
const fetchBookings = async (token, setIsLoading, setBookings) => {
    setIsLoading(true);
    const requestBody = {
        query: `
            query {
                bookings {
                _id
                createdAt
                event {
                    _id
                    title
                    date
                    price
                }
                }
            }`
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

        const { data } = await res.json();

        setBookings(data.bookings);
        setIsLoading(false);
    } catch (err) {
        console.log(err);
        setIsLoading(false);
    }
};
