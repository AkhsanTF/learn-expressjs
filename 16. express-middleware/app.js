const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

const students = [];

app.set("view engine", "ejs");

//third-party middleware

//built-in middleware
app.use(express.static("public"));
app.use(morgan("dev"));

//aplication-level middleware
app.use((req, res, next) => {
  console.log("Time : ", Date.now());
  next();
});

app.get("/", (req, res) => {
  res.render("index", { title: "My Website", students });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Page" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Page" });
});

app.get("/product/:id", (req, res) => {
  res.send(
    `Product ID : ${req.params.id} <br> Category ID : ${req.query.category}`
  );
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
}); //dont write this app.use or else all your page will execute this function

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});
