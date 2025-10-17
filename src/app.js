const express = require("express");
const dotenv = require("dotenv");
// const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173","https://knite-web.vercel.app"],
    credentials:true
}));
// app.use(morgan("dev"));


app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.use(errorHandler);


app.get("/",(req,res)=>{
    res.send("kethan");
})
module.exports = app;
