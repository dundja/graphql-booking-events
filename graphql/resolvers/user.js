const bcrypt = require("bcryptjs");
const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
    createUser: async args => {
        try {
            const isUser = await UserModel.findOne({
                email: args.userInput.email
            });
            if (isUser) {
                throw new Error("User exists already");
            }

            const hashedPassword = await bcrypt.hash(
                args.userInput.password,
                12
            );
            const user = new UserModel({
                email: args.userInput.email,
                password: hashedPassword
            });

            const savedUser = await user.save();
            // password vracam kao null kako bi izbegao security issue i ne dozvolio da iako hashovan
            // password ne vidi niko vise nikad
            return {
                ...savedUser._doc,
                password: null
            };
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            throw new Error("User does not exist!");
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error("Password is incorrect!");
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            "somesupersecretkey",
            {
                expiresIn: "1h"
            }
        );

        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };
    }
};
