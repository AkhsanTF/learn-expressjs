const express = require("express");
const app = express();
const port = 3000;
const root = { root: __dirname };

app.get("/", (req, res) => {
  res.sendFile("./index.html", root);

  // res.send("Hello World!");

  // res.json({
  //   name: "zakt",
  //   email: "zakt@gmail.com",
  //   phone: "012354215",
  // });
});

app.get("/about", (req, res) => {
  // res.send("This is an about page");
  res.sendFile("./about.html", root);
});

app.get("/product/:id", (req, res) => {
  res.send(
    `Product ID : ${req.params.id} <br> Category ID : ${req.query.category}`
  );
});

app.get("/contact", (req, res) => {
  res.send("This is a contact page");
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
}); //dont write this app.use or else all your page will execute this function

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// const http = require("http");
// const fs = require("fs");

// const renderHTML = (path, res) => {
//   fs.readFile(path, (err, data) => {
//     if (err) {
//       res.writeHead(404);
//       res.write("Error : file not found");
//     } else {
//       res.write(data);
//     }
//     res.end();
//   });
// };

// http
//   .createServer((req, res) => {
//     res.writeHead(200, {
//       "content-type": "text/html",
//     });
//     const url = req.url;

//     if (url === "/about") {
//       renderHTML("/about", res);
//     } else if (url === "/contact") {
//       res.write("<h1>This is a contact page</h1>");
//       res.end();
//     } else {
//       //   res.write("hello world!");
//       renderHTML("./index.html", res);
//     }
//   })
//   .listen(3000, () => {
//     console.log("Listening on port 3000...");
//   });
