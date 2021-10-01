const express = require("express");
const passport = require("passport");
require("../configs/passport.configs");
const data = require("../data");

const router = express.Router();

router.get(["/", "/login"], (req, res, next) => {
    res.render("login", { heading: "Login Page" });
});

router.get("/register", (req, res, next) => {
    res.render("register", { heading: "Registration Page" });
});

router.get(
    "/user/:name",
    (req, res, next) => {
        console.log(req.session);
        console.log(req.user);

        if (!req.isAuthenticated()) {
            console.log(false);
            return res.redirect("/login");
        }
        if (req.user.name !== req.params.name) {
            return res.redirect("/login");
        }

        console.log(true);
        next();
    },
    (req, res, next) => {
        console.log(req.session);
        console.log(req.user);

        res.render("users", {
            user: `${req.params.name}`,
            heading: "All users",
            data: JSON.stringify(data),
        });
    }
);

router.get("/users", (req, res, next) => {
    res.send(data);
});

router.get(
    "/auth/google/register",
    passport.authenticate("registerWithGoogle", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/auth/google/register/callback",
    passport.authenticate("registerWithGoogle", {
        failureRedirect: "/login",
    }),
    (req, res, next) => {
        data.push(req.user._json);
        res.redirect(`/user/${req.user._json.name}`);
    }
);

router.get(
    "/auth/google/login",
    passport.authenticate("loginWithGoogle", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/auth/google/login/callback",
    passport.authenticate("loginWithGoogle", {
        failureRedirect: "/register",
    }),
    (req, res, next) => {
        console.log(req.user._json);
        res.redirect(`/user/${req.user._json.name}`);
    }
);

router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/login");
});

module.exports = router;
