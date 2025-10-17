const express = require("express");
const dotenv = require("dotenv");
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



const allowedOrigins = [
  "http://localhost:5173",
  "https://knite-web.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = "CORS error: origin not allowed";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.use(errorHandler);


app.get("/",(req,res)=>{
    res.send("kethan");
})
module.exports = app;
