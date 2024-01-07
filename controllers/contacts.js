
const {Contact} = require('../models/contact');
const { HttpError, ctrlWrapper } = require("../helpers");
const listContacts = async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts)
}

const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact ) {
      throw HttpError(404, "Not found");
  }
  res.json(contact );
}
const addContact = async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json(contact);
}

const removeContact = async (req, res) => {
  const { id } = req.params;
  
  const contact  = await Contact.findByIdAndDelete(id);
 
  if (!contact ) {
      throw HttpError(404, "Not found");
  }
  res.json({
      message: "Delete success"
  })
}

const updateContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndUpdate(id, req.body, {new: true});
  if (!contact) {
      throw HttpError(404, "Not found");
  }
  res.json(contact);
}

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  
  const contact = await Contact.findByIdAndUpdate(id, req.body, {new: true});
  
 
  if (!contact) {
      throw HttpError(404, "Not found");
  }
  res.json(contact);
}

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
 removeContact: ctrlWrapper(removeContact),
 addContact: ctrlWrapper(addContact),
 updateContact: ctrlWrapper(updateContact),
 updateStatusContact: ctrlWrapper(updateStatusContact),
}
