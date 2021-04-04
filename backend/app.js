const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const frontendURI = "http://localhost:3000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(
    cors({
        origin: frontendURI,
        credentials: true, // Allows to cookie be enabled
    })
);

app.use(express.static(path.join(__dirname, "public")));

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", frontendURI);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Cache-Control", "no-cache");
    next();
});

app.use(
    session({
        key: "userId",
        secret: "splitwise", // Keep Secret
        resave: false,
        saveUninitialized: false,
        // cookie: {
        //     expires: 60 * 60 * 24,
        // },
        duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
        activeDuration: 5 * 60 * 1000,
    })
);

app.locals.user_id_photochange = "";

module.exports = app;
