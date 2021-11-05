const mongoose = require("mongoose");
let connection;

const dbConnect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mydb");
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err.message);
    }
};

dbConnect();

connection = mongoose.connection;

connection.on("connected", () => {
    console.log("Database connected successfully!");
});

connection.on("error", (err) => {
    console.log(err.message);
});

connection.on("disconnected", () => {
    console.log("Database disconnected successfully!");
});

process.on("SIGINT", async () => {
    await connection.close();
    process.exit(0);
});
//     .catch((err) => {
//         console.log(err.message);
//     });

// const

module.exports = connection;
