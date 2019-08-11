const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlHTTP = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(bodyParser.json());

// ok, znaci ovde ubacujemo nas custom middleware, koji ce da se runuje pre naseg /graphql
// on proverava da li je jwt povezan sa userom tj dal user ima token
app.use(isAuth);

// CORS error handler middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// drugi arg je middlevare
app.use(
    "/graphql",
    graphqlHTTP({
        // point to our schema
        schema: graphqlSchema,
        // point to our resolvers
        rootValue: graphqlResolvers,
        graphiql: true
    })
);

const port = process.env.PORT || 5000;

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

// Mongodb Atlas connection
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${
            process.env.MONGO_PASSWORD
        }@graphql-event-app-n2w8v.mongodb.net/${
            process.env.MONGO_DB
        }?retryWrites=true&w=majority`,
        { useNewUrlParser: true }
    )
    .then(() => {
        app.listen(port);
        console.log(`Connected to database on port ${port}`);
    })
    .catch(err => {
        console.log({ message: "Oops, something went wrong", err });
    });
