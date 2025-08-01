const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
} = require("./utils/contacts");
const { body, validationResult } = require("express-validator");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const students = [
    {
      name: "Zakt",
      email: "Zakt@gmail.com",
    },
    {
      name: "Rama",
      email: "Rama@gmail.com",
    },
  ];
  res.render("index", {
    title: "My Website",
    students,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  const success = req.query.success;
  res.render("contact", {
    title: "Contact Page",
    contacts,
    success,
  });
});

//page add contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Data Contact Form",
  });
});

//process data contact
app.post(
  "/contact",
  [
    //validator email
    body("email").isEmail().withMessage("Email is not valid!"),
    //validator phone number
    body("phone")
      .isMobilePhone("id-ID")
      .withMessage("Phone number is not valid!"),
    //validator if name already in list
    body("name").custom((value) => {
      const duplicate = checkDuplicate(value);
      if (duplicate) {
        throw new Error("Contact name already in list!");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Add Data Contact Form",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      res.redirect("/contact?success=1");
    }
  }
);

//page detail contact
app.get("/contact/:name", (req, res) => {
  const contact = findContact(req.params.name);
  res.render("detail", {
    title: "Detail Contact Page",
    contact,
  });
});

// app.get("/product/:id", (req, res) => {
//   res.send(
//     `Product ID : ${req.params.id} <br> Category ID : ${req.query.category}`
//   );
// });

app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
}); //dont write this app.use or else all your page will execute this function

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});
