const express = require("express");
const passport = require("passport");
require("../configs/passport.configs");
const data = require("../data");

const router = express.Router();

// get

router.get(["/", "/login"], (req, res, next) => {
    res.render("login", { heading: "Login Page" });
});

router.get("/register", (req, res, next) => {
    res.render("register", { heading: "Registration Page" });
});

router.get(
    "/user/:name",
    // (req, res, next) => {
    //     if (req.isAuthenticated()) {
    //         console.log(true);
    //         next();
    //     }
    //     console.log(false);
    //     res.redirect("/login");
    // },
    (req, res, next) => {
        // console.log(req.headers);
        // if (!req.headers.referer) {
        //     return res.send(
        //         "<h1>Dude you need to login to get access for this page."
        //     );
        // }
        console.log(req);
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
        console.log(req.user._json);
        data.push(req.user._json);
        res.redirect(`/user/${req.user._json.name}`);
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
    (req, res, next) => {
        console.log(req.user._json);
        res.redirect(`/user/${req.user._json.name}`);
    }
);

module.exports = router;
