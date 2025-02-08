import express from "express";
import initWebRoutes from "./routes/web";
import configViewEngine from "./configs/viewEngine";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8081;

configViewEngine(app);
initWebRoutes(app);


app.listen(PORT, () => {
    console.log(">>> JWT Backend Web is running on port: ",PORT);
})
