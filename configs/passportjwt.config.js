const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
require("dotenv").config();

const options = {
    jwtFromRequest: function (req) {
        // console.log(req);
        let token = null;
        if (req && req.headers.cookie) {
            token = req.headers.cookie.split("=")[1];
        }
        // console.log(token);
        return token;
    },
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const verifyCallback = (payload, done) => {
    return done(null, payload);
};

passport.use("verifyToken", new JwtStrategy(options, verifyCallback));
