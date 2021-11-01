const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const User = require("./dbModel");

const options = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
};

async function registerVerifyCallback(
    req,
    accessToken,
    refreshToken,
    profile,
    done
) {
    try {
        let doesExist = false;
        doesExist = await User.findOne({
            $or: [{ id: profile.id }, { email: profile._json.email }],
        });

        if (doesExist) {
            return done(null, false);
        } else {
            const user = new User({
                id: profile.id,
                name: profile.displayName,
                email: profile._json.email,
                picture: profile._json.picture,
            });
            await user.save();
            return done(null, profile);
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function loginVerifyCallback(
    req,
    accessToken,
    refreshToken,
    profile,
    done
) {
    try {
        let doesExist = false;
        doesExist = await User.findOne({
            $or: [{ id: profile.id }, { email: profile._json.email }],
        });
        if (doesExist) return done(null, profile);
        else return done(null, false);
    } catch (err) {
        throw new Error(err.message);
    }
}

passport.use(
    "registerWithGoogle",
    new GoogleStrategy(
        {
            ...options,
            callbackURL: process.env.CALLBACK_URL,
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
            callbackURL: process.env.CALLBACK_URL,
            passReqToCallback: true,
        },
        loginVerifyCallback
    )
);
