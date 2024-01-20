
const {Contact} = require('../models/contact');
const { HttpError, ctrlWrapper } = require("../helpers");

const listContacts = async (req, res) => {
  const {_id: owner} = req.user;
  const {page = 1, limit = 20, favorite=true} = req.query;

  const skip = (page - 1) * limit;
  const contacts = await Contact.find({owner, favorite},"-createdAt -updatedAt",{skip, limit: Number(limit)});
  res.json(contacts)
}
const getContactById = async (req, res) => {
  const {_id: userId} = req.user;
  const { id } = req.params;
 
  const contact = await Contact.findById(id);
  
  if (contact.owner.toString() !== userId.toString() ) {
      throw HttpError(404, "Not found");
  }
  res.json(contact );
}

const addContact = async (req, res) => {
  const {_id: owner} = req.user;
  const contact = await Contact.create({...req.body, owner});
  res.status(201).json(contact);
}

const removeContact = async (req, res) => {
  const {_id: userId} = req.user;
  const { id } = req.params;
  const contact = await Contact.findById(id);
  
  if (contact.owner.toString() !== userId.toString() ) {
      throw HttpError(404, "Not found");
  }
  await Contact.findByIdAndDelete(id);
  
  res.json({
      message: "Delete success"
  })
}

const updateContact = async (req, res) => {
  const {_id: userId} = req.user;
  const { id } = req.params;
  const contact = await Contact.findById(id);
  
  if (contact.owner.toString() !== userId.toString() ) {
      throw HttpError(404, "Not found");
  }
  await Contact.findByIdAndUpdate(id, req.body, {new: true});
  
  res.json(contact);
}

const updateStatusContact = async (req, res) => {
  const {_id: userId} = req.user;
  const { id } = req.params;
  const contact = await Contact.findById(id);
  
  if (contact.owner.toString() !== userId.toString() ) {
      throw HttpError(404, "Not found");
  }
  await Contact.findByIdAndUpdate(id, req.body, {new: true});
  
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
