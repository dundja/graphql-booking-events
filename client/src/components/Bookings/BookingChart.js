import React from "react";
import { Bar } from "react-chartjs";

const BOOKINGS_BUCKETS = {
    Cheap: {
        min: 0,
        max: 100
    },
    Normal: {
        min: 100,
        max: 200
    },
    Expensive: {
        min: 200,
        max: 100000
    }
};

const BookingChart = ({ bookings }) => {
    const output = [];
    const chartData = { labels: [], datasets: [] };

    let values = [];
    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = bookings.reduce((prev, curr) => {
            if (
                curr.event.price > BOOKINGS_BUCKETS[bucket].min &&
                curr.event.price < BOOKINGS_BUCKETS[bucket].max
            ) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);

        values.push(filteredBookingsCount);

        chartData.labels.push(bucket);
        chartData.datasets.push({
            // label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: values
        });
        // resetujem vrednost values-a kako bi za svaku iteraciju poceo od 0
        values = [...values];
        values[values.length - 1] = 0;
    }

    return (
        <div style={{ textAlign: "center" }}>
            <Bar data={chartData} />
        </div>
    );
};

export default BookingChart;
