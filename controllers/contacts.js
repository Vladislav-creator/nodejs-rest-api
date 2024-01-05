
const {Contact} = require('../models/contact');
const { HttpError, ctrlWrapper } = require("../helpers");
const listContacts = async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts)
}

const getContactById = async (req, res) => {
  const { id } = req.params;
  // const result = await Book.findOne({_id: id})
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
  console.log(id);
  const contact  = await Contact.findByIdAndRemove(id);
  if (!contact ) {
      throw HttpError(404, "Not found");
  }
  res.json({
      message: "Delete success"
  })
}

// const updateById = async (req, res) => {
//   const { id } = req.params;
//   const result = await Book.findByIdAndUpdate(id, req.body, {new: true});
//   if (!result) {
//       throw HttpError(404, "Not found");
//   }
//   res.json(result);
// }

// const updateFavorite = async (req, res) => {
//   const { id } = req.params;
//   const result = await Book.findByIdAndUpdate(id, req.body, {new: true});
//   if (!result) {
//       throw HttpError(404, "Not found");
//   }
//   res.json(result);
// }




module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
 removeContact: ctrlWrapper(removeContact),
 addContact: ctrlWrapper(addContact),
  // updateContact,
}
