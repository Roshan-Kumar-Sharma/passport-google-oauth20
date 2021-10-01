const express = require("express");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(morgan("dev"));
    app.use(
        session({
            secret: "keyboard",
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
};
