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

router.get("/auth/google", (req, res, next) => {
    console.log(req.query);
    let middleware;
    const { type } = req.query;

    if (!type || (type !== "login" && type !== "register")) {
        return res.send("Wrong State");
    }

    if (type === "register") {
        middleware = "registerWithGoogle";
    } else if (type === "login") {
        middleware = "loginWithGoogle";
    }

    passport.authenticate(middleware, {
        scope: ["profile", "email"],
        session: false,
        state: type,
    })(req, res, next);
});

router.get(
    "/auth/google/register/callback",
    passport.authenticate("registerWithGoogle", {
        failureRedirect: "/login",
        session: false,
    }),
    (req, res, next) => {
        console.log(req.state);
        data.push(req.user._json);
        res.send(`${req.user._json.email} has been registered successfully.`);
    }
);

// router.get(
//     "/auth/google",
//     (req, res, next) => {
//         console.log(req.query);
//         res.send();
//     }
//     // passport.authenticate("loginWithGoogle", {
//     //     scope: ["profile", "email"],
//     //     session: false,
//     // })
// );

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

module.exports = router;
