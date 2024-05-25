console.clear();
//importation
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRouters from "./Routes/userRouters.js";
//end
//asgin
const app = express();
const port = process.env.PORT;
const URL = process.env.url_DB;
//end
//middleware
app.use(express.json());
//end
//connection to DtaBase
mongoose
  .connect(URL)
  .then(() => console.log("DataBase connected !!"))
  .catch((err) => console.log("error from DataBase", err));
//end

app.use("/api", userRouters);

//server listening
app.listen(port, (error) => {
  if (error) throw error;
  console.log(`server is running on http://localhost:${port}`);
});
//end
