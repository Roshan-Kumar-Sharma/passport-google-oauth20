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
            console.log("verifyToken : ", req.user);
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
    console.log("/auth/google : ", req.query);
    let middleware;
    const { type } = req.query;

    if (!type || (type !== "login" && type !== "register")) {
        return res.send("Invalid State");
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
    "/auth/google/callback",
    async (req, res, next) => {
        const { state } = req.query;
        if (!state || (state !== "login" && state !== "register")) {
            return res.send("Invalid State");
        }

        if (state === "register") {
            passport.authenticate(
                "registerWithGoogle",
                {
                    failureRedirect: "/login",
                    session: false,
                },
                (err, payload, info) => {
                    console.log(payload);
                    if (err || !payload) {
                        return next(info);
                    }
                    req.login(payload, { session: false }, async (err) => {
                        if (err) return next(err);
                        return next();
                    });
                }
            )(req, res, next);
        } else if (state == "login") {
            passport.authenticate(
                "loginWithGoogle",
                {
                    failureRedirect: "/register",
                    session: false,
                },
                (err, payload, info) => {
                    console.log(payload);
                    if (err || !payload) {
                        console.log("user is not regsitered");
                        return next(
                            new Error(
                                "User is not registered. Register first!!!"
                            )
                        );
                    }
                    req.login(payload, { session: false }, async (err) => {
                        if (err) return next(err);
                        return next();
                    });
                }
            )(req, res, next);
        }
    },
    async (req, res, next) => {
        const { state } = req.query;
        if (!state || (state !== "login" && state !== "register")) {
            return res.send("Invalid State");
        }

        if (state === "register") {
            console.log("/auth/google/register/callback : ", req.query.state);
            data.push(req.user._json);
            res.send(
                `${req.user._json.email} has been registered successfully.`
            );
        } else if (state === "login") {
            try {
                // console.log
                console.log("/auth/google/login/callback : ", req.user);
                console.log("/auth/google/login/callback : ", req.query.state);
                const token = await signAccessToken(req.user);
                res.cookie("accessToken", token, { httpOnly: true }).redirect(
                    `/user/${req.user._json.name}`
                );
            } catch (err) {
                next(err);
            }
        }
    }
);

router.get("/logout", (req, res, next) => {
    res.clearCookie("accessToken");
    res.redirect("/login");
});

module.exports = router;
