const fs = require("fs"); //export file system modules

const contactPath = "./data/contacts.json";
const dirPath = "./data";

//create dirpath folder if there is none
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

//create contacts.json if there is none
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

//overwrite contacts.json with a new data
function saveContacts(contacts) {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
}

//write new contact at contacts.json
function addContact(contact) {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
}

//checking if students name is already in json
function checkDuplicate(name) {
  const contacts = loadContact();
  return contacts.find((contact) => contact.name === name);
}

//deleting contact from contacts.json
function deleteContact(name) {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.name !== name);
  saveContacts(filteredContacts);
}

//updating contact from contacts.json
function updateContact(newContact) {
  const contacts = loadContact();
  const filteredContacts = contacts.filter(
    (contact) => contact.name !== newContact.oldName
  );
  delete newContact.oldName;
  filteredContacts.push(newContact);
  saveContacts(filteredContacts);
}

//exporting all function that will be used
module.exports = {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContact,
};
