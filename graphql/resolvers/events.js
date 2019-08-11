const EventModel = require("../../models/event");
const UserModel = require("../../models/user");
const { transformEvent } = require("./merge");

module.exports = {
    events: async () => {
        try {
            // koristim .populate() metodu koju omogucava mongoose kako bi dodadao
            // property od ref kljuca koji je u objektu tj Event Schemi
            const events = await EventModel.find().populate("creator");
            return events.map(event => {
                // vracam objekat zato sto mongo vraca meta datu koje ne trebam
                //  treba mi samo data tog dokumenta koja je pod kljucem
                //  ._doc
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        // kada smo ubacili nas middleware sada proveravamo sta nam treba
        // kao drugi parametar je request
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        const event = new EventModel({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });

        try {
            // metoda mongoose biblioteke koja ide na db i sejvuje
            const result = await event.save();
            const foundedUser = await UserModel.findById(req.userId);
            if (!foundedUser) {
                throw new Error("User not found.");
            }
            foundedUser.createdEvents.push(event);
            foundedUser.save();

            return transformEvent(result);
        } catch (err) {
            throw err;
        }
    }
};
