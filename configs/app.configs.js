const express = require("express");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
// const cors = require("cors");

module.exports = (app) => {
    // app.use(
    //     cors({
    //         origin: "http://localhost:8080",
    //     })
    // );
    // app.options(
    //     "/auth/google/login/callback",
    //     cors({
    //         origin: "http://localhost:8080",
    //     })
    // );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(morgan("dev"));
    app.use(passport.initialize());
};
