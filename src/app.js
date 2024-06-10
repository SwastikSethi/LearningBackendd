import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

// app.use(cors()); // use is generally used for middlewares

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// limit of json data accepted
app.use(express.json({limit: "32kb"})); 

// encoded url e.g space with %20%
app.use(express.urlencoded({extended: true, limit: "16kb"}));

// used to store static assets like images and pdf which are public
app.use(express.static("public"))


// cookies
app.use(cookieParser())

// routes import
import userRouter from "./routes/user.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter);


export {app};