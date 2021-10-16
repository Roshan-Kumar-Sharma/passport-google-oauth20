const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
let users = require("../data");

const options = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
};

function registerVerifyCallback(req, accessToken, refreshToken, profile, done) {
    // console.log(req.state);
    let doesExist = false;
    data.forEach((user) => {
        if (
            user.name === profile.displayName ||
            user.email === profile._json.email
        ) {
            doesExist = true;
        }
    });
    if (doesExist) return done(null, false);
    else return done(null, profile);
}

function loginVerifyCallback(req, accessToken, refreshToken, profile, done) {
    let doesExist = false;
    data.forEach((user) => {
        if (
            user.name === profile.displayName ||
            user.email === profile._json.email
        ) {
            doesExist = true;
        }
    });
    // console.log(doesExist);
    if (doesExist) return done(null, profile);
    else return done(null, false);
}

passport.use(
    "registerWithGoogle",
    new GoogleStrategy(
        {
            ...options,
            callbackURL: process.env.REGISTER_CALLBACK_URL,
            passReqToCallback: true,
        },
        registerVerifyCallback
    )
);

passport.use(
    "loginWithGoogle",
    new GoogleStrategy(
        {
            ...options,
            callbackURL: process.env.LOGIN_CALLBACK_URL,
            passReqToCallback: true,
        },
        loginVerifyCallback
    )
);
