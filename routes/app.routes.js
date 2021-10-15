const express = require("express");
const passport = require("passport");
require("../configs/passport.configs");
require("../configs/passportjwt.config");
const data = require("../data");
const { signAccessToken } = require("../configs/token");

const router = express.Router();

router.get(["/", "/login"], (req, res, next) => {
    res.render("login", { heading: "Login Page" });
});

router.get("/register", (req, res, next) => {
    res.render("register", { heading: "Registration Page" });
});

router.get(
    "/user/:name",
    passport.authenticate("verifyToken", { session: false }),
    (req, res, next) => {
        if (req.user.name === req.params.name) {
            console.log(req.user);
            return res.render("users", {
                user: `${req.params.name}`,
                heading: "All users",
                data: JSON.stringify(data),
            });
        }
        res.redirect("/register");
    }
);

router.get("/users", (req, res, next) => {
    res.send(data);
});

router.get(
    "/auth/google/register",
    passport.authenticate("registerWithGoogle", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/auth/google/register/callback",
    passport.authenticate("registerWithGoogle", {
        failureRedirect: "/login",
        session: false,
    }),
    (req, res, next) => {
        data.push(req.user._json);
        res.send(`${req.user._json.email} has been registered successfully.`);
    }
);

router.get(
    "/auth/google/login",
    passport.authenticate("loginWithGoogle", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/auth/google/login/callback",
    passport.authenticate("loginWithGoogle", {
        failureRedirect: "/register",
        session: false,
    }),
    async (req, res, next) => {
        try {
            console.log(req.user._json);
            const token = await signAccessToken(req.user);
            res.cookie("accessToken", token, { httpOnly: true }).send({
                token,
            });
        } catch (err) {
            next(err);
        }
    }
);

router.get("/logout", (req, res, next) => {
    res.clearCookie("accessToken");
    res.redirect("/login");
});

module.exports = router;
