var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var app = express();

//router service
var indexRouter = require("./routes/index");

const https = require("https");
const passport = require("passport");
const xsenv = require("@sap/xsenv");
const xssec = require("@sap/xssec");
xsenv.loadEnv();
https.globalAgent.options.ca = xsenv.loadCertificates();
global.__base = __dirname + "/";
global.__uaa = process.env.UAA_SERVICE_NAME;

//authentication for the requests
passport.use(new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: 'xsuaa'
	}
}).uaa));

app.use(passport.initialize());
app.use(passport.authenticate("JWT", {
	session: false
}));

const xsHDBConn = require("@sap/hdbext");

let hanaOptions = xsenv.getServices({
	hana: {
		plan: "hdi-shared"
	}
});
app.use(xsHDBConn.middleware(hanaOptions.hana));

//cors issue handled
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Expose-Headers", "*");
	res.setHeader("Access-Control-Allow-Methods", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// handle cors
app.use(cors());

//disable x-powered by
app.disable("x-powered-by");

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;