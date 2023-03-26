const express = require("express");
const app = express();
const db = require("./database.js");
const jwt = require("jsonwebtoken");
app.set("view-engine", "ejs");
require("dotenv").config();
const bcrypt = require("bcrypt");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let dbEncryption;

app.listen(8000);
db.initial();

app.get("/", (req, res) => {
  res.redirect("/identify");
});

app.get("/admin", (req, res) => {
  res.render("admin.ejs");
});

app.get("/identify", (req, res) => {
  res.render("identify.ejs");
});

app.post("/identify", async (req, res) => {
  console.log(req.body.userId);
  const hashedPass = await db.getPass(req.body.userId);
  console.log("hashValueKey", hashedPass.password);
  let user = await db.getData();
  await bcrypt.compare(
    req.body.password,
    hashedPass.password,
    function (err, response) {
      if (err) {
        console.log(" Error ");
        console.log(err);
      } else if (response) {
        console.log("respond:", response);
        console.log("user", user);
        const userInfoObj = {
          userID: user.userID,
          name: user.name,
          role: user.role,
        };
        const toke = jwt.sign(userInfoObj, process.env.TOKEN);

        const cookieOpt = {
          httpOnly: true, //  can be accessed by the server
          maxAge: 86400000,
        };

        res.cookie("jwt", token, cookieOpt);
        console.log("True");
        res.render("start.ejs");
        let token = jwt.sign("username", process.env.TOKEN);
        console.log("token : ", token);
      } else {
        console.log("False");
        res.render("fail.ejs");
      }
    }
  );
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    dbEncryption = await bcrypt.hash(req.body.password, 10);
    db.userData(req, dbEncryption);
    console.log(" Successfull");
  } catch (error) {
    console.log(error);
  }

  res.redirect("/identify");
});
