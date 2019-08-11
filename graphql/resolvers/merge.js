const EventModel = require("../../models/event");
const UserModel = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const DataLoader = require("dataloader");

const eventLoader = new DataLoader(eventIds => {
    return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
    return UserModel.find({ _id: { $in: userIds } });
});

const events = async eventIds => {
    try {
        const foundedEvents = await EventModel.find({ _id: { $in: eventIds } });
        foundedEvents.sort(
            (a, b) =>
                eventIds.indexOf(a._id.toString()) -
                eventIds.indexOf(b._id.toString())
        );
        return foundedEvents.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

// da izbegnem name colision koristim ime singleEvent
const singleEvent = async eventId => {
    try {
        const foundedEvent = await eventLoader.load(eventId.toString());

        return foundedEvent;
    } catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const foundedUser = await userLoader.load(userId);
        return {
            ...foundedUser._doc,
            createdEvents: eventLoader.loadMany.bind(
                this,
                foundedUser._doc.createdEvents
            )
        };
    } catch (err) {
        throw err;
    }
};

// helper funkcija koja sluzi da ocistimo kod koji ponavljam
const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
