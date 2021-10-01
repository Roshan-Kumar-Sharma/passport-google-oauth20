const jwt = require("jsonwebtoken");
require("dotenv").config();

const signAccessToken = (data) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: data._json.sub,
            email: data._json.email,
            name: data._json.name,
        };
        const options = {
            expiresIn: "5m",
        };
        jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            options,
            (err, token) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(token);
            }
        );
    });
};

module.exports = { signAccessToken };
