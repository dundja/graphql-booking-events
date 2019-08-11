const BookingModel = require("../../models/booking");
const EventModel = require("../../models/event");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
    bookings: async (args, req) => {
        // kada smo ubacili nas middleware sada proveravamo sta nam treba
        // kao drugi parametar je request
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        try {
            const bookings = await BookingModel.find({ user: req.userId });
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        // kada smo ubacili nas middleware sada proveravamo sta nam treba
        // kao drugi parametar je request
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        const event = await EventModel.findOne({ _id: args.eventId });
        const booking = new BookingModel({
            user: req.userId,
            event
        });

        const result = await booking.save();

        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        // kada smo ubacili nas middleware sada proveravamo sta nam treba
        // kao drugi parametar je request
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }
        try {
            const booking = await BookingModel.findById(
                args.bookingId
            ).populate("event");

            if (!booking) {
                throw new Error("Booking not found");
            }

            const event = transformEvent(booking.event);
            await BookingModel.deleteOne({ _id: args.bookingId });

            return event;
        } catch (err) {
            throw err;
        }
    }
};
