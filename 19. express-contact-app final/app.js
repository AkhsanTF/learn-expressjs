const express = require("express"); //export express module
const expressLayouts = require("express-ejs-layouts"); //export expressLayouts module
const {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContact,
} = require("./utils/contacts"); //export from contact.js module
const { body, validationResult } = require("express-validator"); //export validator module

const app = express();
const port = 3000;

app.set("view engine", "ejs"); //using ejs as a view engine
app.use(expressLayouts); //using express layout for a middleware of a page template
app.set("layout", "layouts/main-layout");
app.use(express.static("public")); //utilize public directory to serve img and css
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const students = loadContact();
  res.render("index", {
    title: "My Website",
    students,
  });
}); //route to index page

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
  });
}); //route to about page

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  const added = req.query.added;
  const deleted = req.query.deleted;
  const edited = req.query.edited;

  res.render("contact", {
    title: "Contact Page",
    contacts,
    added,
    deleted,
    edited,
  });
}); //function to provide contact.ejs information of current event

//page add contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Data Contact Form",
  });
});

//process add data contact
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
      }); //function if error happen
    } else {
      addContact(req.body);
      res.redirect("/contact?added=1"); //added=1 used to inform add-contact.ejs to pop up flash message
    }
  }
); //function if added success

//delete contact process
app.get("/contact/delete/:name", (req, res) => {
  const contact = findContact(req.params.name);

  //if contact is not on the list
  if (!contact) {
    res.status(404);
    res.send("<h1>404<h1>");
  } else {
    deleteContact(req.params.name);
    res.redirect("/contact?deleted=1");
  }
});

//edit contact form
app.get("/contact/edit/:name", (req, res) => {
  const contact = findContact(req.params.name);

  res.render("edit-contact", {
    title: "Edit Data Contact Form",
    contact,
  });
});

//edit contact process
app.post(
  "/contact/update",
  [
    //validator email
    body("email").isEmail().withMessage("Email is not valid!"),
    //validator phone number
    body("phone")
      .isMobilePhone("id-ID")
      .withMessage("Phone number is not valid!"),
    //validator if name already in list
    body("name").custom((value, { req }) => {
      const duplicate = checkDuplicate(value);
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Contact name already in list!");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Edit Data Contact Form",
        errors: errors.array(),
        contact: req.body,
      }); //function if error happen
    } else {
      updateContact(req.body);
      res.redirect("/contact?edited=1"); //edited=1 used to inform edit-contact.ejs to pop up flash message
    } //function if edit success
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

app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
}); //dont write this app.use or else all your page will execute this function

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
}); //function for local hosting
