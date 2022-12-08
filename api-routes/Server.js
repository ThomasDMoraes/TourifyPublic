require("dotenv").config({ path: "./config.env" });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: false }));
app.use(require("./Routes"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, async function () {
    console.log(`Server is running on PORT ${PORT}`);
});
