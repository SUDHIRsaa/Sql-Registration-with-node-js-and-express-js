const express = require("express");
const routes = require("./routes");
const user = require("./routes/user");
const session = require("express-session");
const app = express();
const mysql = require("mysql");
let bodyParser = require("body-parser");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

connection.connect();
global.db = connection;

app.set("port", process.env.PORT || 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.get("/", routes.index);
app.get("/signup", user.signup);
app.post("/signup", user.signup);
app.get('/deleteAccount', user.deleteAccount);
app.get("/login", routes.index);
app.post("/login", user.login);
app.get("/home/dashboard", user.dashboard);
app.get("/home/logout", user.logout);
app.get("/home/profile", user.profile);
app.get("/home/profile/edit", user.editprofile);
app.post("/updateprofile", user.updateProfile);

app.listen(8000);
