const express = require("express");

const app = express();

const PORT = 8080;

require("./configs/app.configs")(app);
app.use(require("./routes/app.routes"));

app.use((err, req, res, next) => {
    res.send({
        ERROR: {
            status: err.status || err.code || 500,
            message: err.message || "something went wrong",
        },
    });
});

app.listen(PORT, () => {
    console.log(`🚀 is launched at port : ${PORT}`);
});
