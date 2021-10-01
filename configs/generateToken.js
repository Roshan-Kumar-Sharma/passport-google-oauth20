const crypto = require("crypto");

const accessToken = crypto.randomBytes(32).toString("hex");
console.log(accessToken);
