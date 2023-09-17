const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const error = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/.env" });
}

const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const compression = require("compression");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
const corsOptions = {
  origin: "https://shop-mart-xi.vercel.app/",
  //origin: "http://localhost:3000",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(compression());

const productRouter = require("./routes/routesProducts");
const useRouter = require("./routes/routesUser");
const orderRouter = require("./routes/routesOrder");
const paymentRouter = require("./routes/routesPayment");
const contactRouter = require("./routes/routesContact");
app.use("/products", productRouter);
app.use("/user", useRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);
app.use("/contact", contactRouter);

/*app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});*/

/* "build": "npm install --prefix frontend && npm run build --prefix frontend",
    "predeploy": "npm run build" 
    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false && npm install --prefix frontend && npm run build --prefix frontend"
    */

//app.use(express.static(path.join(__dirname + "/public")));

//app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "./public"), { maxAge: 31536000 }));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

app.use(error);
module.exports = app;
