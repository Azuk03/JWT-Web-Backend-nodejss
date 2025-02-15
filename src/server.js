import express from "express";
import initWebRoutes from "./routes/web";
import configViewEngine from "./config/viewEngine";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB";



const app = express();
const PORT = process.env.PORT || 8081;

configViewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));;

// test connection
connection();

initWebRoutes(app);


app.listen(PORT, () => {
    console.log(">>> JWT Backend Web is running on port: ",PORT);
})
