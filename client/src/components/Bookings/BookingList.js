import React, { useContext } from "react";
import "./BookingList.css";

import { AuthContext } from "../../context/auth-context";

const BookingList = ({ bookings, setBookings, setIsLoading }) => {
    const { authState } = useContext(AuthContext);

    const cancelBooking = async (id, token) => {
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking (bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: id
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
            const updatedBookings = bookings.filter(
                booking => booking._id !== id
            );

            setBookings(updatedBookings);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    if (bookings.length === 0) {
        return <h2>You dont have any bookings.</h2>;
    } else {
        return (
            <ul className="bookings__list">
                {bookings.map(booking => (
                    <li className="bookings__item" key={booking._id}>
                        <div className="bookings__item-data">
                            {
                                <li>
                                    {booking.event.title} -
                                    {new Date(
                                        booking.createdAt
                                    ).toLocaleDateString()}
                                </li>
                            }
                        </div>
                        <div className="bookings__item-actions">
                            <button
                                className="btn"
                                onClick={() =>
                                    cancelBooking(booking._id, authState.token)
                                }
                            >
                                Cancel booking
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }
};

export default BookingList;
