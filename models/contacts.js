const fs = require('node:fs/promises');
const path = require('node:path');
const { v4: uuidv4 } = require('uuid');

 const contactsPath = path.join(__dirname, "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, {encoding: 'utf-8'});

  const contacts = JSON.parse(data);
  
   return contacts
  };

  async function allContacts() {
    const data = await fs.readFile(contactsPath, {encoding: 'utf-8'});
    const contacts = JSON.parse(data);
     return contacts
    };

    async function writeContacts(contacts) {
return await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function getContactById(contactId) {
const contacts = await allContacts();

 const contact = contacts.find((contact)=> contact.id === contactId);

  return  contact || null

}
async function addContact(data) {
  const contacts = await allContacts();
  const newContact = {
       id: uuidv4(),
      ...data,
 }
  contacts.push(newContact);
   await writeContacts(contacts);
   return newContact  
}

async function removeContact(contactId) {
  const contacts = await allContacts();
  const index = contacts.findIndex((contact)=> contact.id === contactId);
  if(index === -1){
     return null;
  }
   
   const newContacts = [...contacts.slice(0, index), ...contacts.slice(index + 1)];
   await writeContacts(newContacts);
  return contacts[index]
}

async function updateContact(id, data) {
  const contacts = await allContacts();
  const index = contacts.findIndex(item => item.id === id);
  if(index === -1){
      return null;
  }
  contacts[index] = {...contacts[index], ...data};
  await writeContacts(contacts);
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
