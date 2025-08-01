const fs = require("fs");

const contactPath = "./data/contacts.json";
const dirPath = "./data";

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
if (!fs.existsSync(contactPath)) {
  fs.writeFileSync(contactPath, "[]", "utf8");
}

//search contact based on name
function findContact(name) {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.name === name);

  return contact;
}

//take all contact data at contacts.json
function loadContact() {
  const file = fs.readFileSync(contactPath, "utf8");
  const contacts = JSON.parse(file);
  return contacts;
}

module.exports = { loadContact, findContact };
