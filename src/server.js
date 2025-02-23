import express from "express";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import configViewEngine from "./config/viewEngine";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB";
import configCors from "./config/cors";



const app = express();
const PORT = process.env.PORT || 8081;

configCors(app);

configViewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));;

// test connection
// connection();

initWebRoutes(app);
initApiRoutes(app);


app.listen(PORT, () => {
    console.log(">>> JWT Backend Web is running on port: ",PORT);
})
