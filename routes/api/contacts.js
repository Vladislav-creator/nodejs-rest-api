const express = require('express');
const Joi = require('joi');
const {NotFound} = require('http-errors');
const {BadRequest} = require('http-errors');
const router = express.Router();
const contactsOperations = require("../../models/contacts");
const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
})
const contactsSchemaPut = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
})
router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts()
    res.status(200).json(contacts);
  }catch(error){
    next(error);
  }
  
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await contactsOperations.getContactById(contactId)
    if(!result){
     throw new NotFound('Not found');
    }
    res.status(200).json(result);
  }catch(error){
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactsSchema.validate(req.body);
    if (error){
      error.status = 400;
      error.message = `missing required ${error.message.replace(/"/g, "").replace(/is required/, "field")}`;
      throw error;
    }
    const result = await contactsOperations.addContact(req.body);
    res.status(201).json(result)
  }catch(error){
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await contactsOperations.removeContact(contactId)
    if(!result){
     throw new NotFound('Not found');
    }
    res.status(200).json({
      message: "Contact deleted"
  });
  }catch(error){
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  console.log("Hello")
  try {
   if (Object.keys(req.body).length === 0){
      throw new BadRequest("missing fields");
    }

    const {error} = contactsSchemaPut.validate(req.body);
    if (error){
      error.status = 400;
     
      throw error;
    }
    
    const {contactId} = req.params;
   
    const result = await contactsOperations.updateContact(contactId, req.body);
    if(!result){
      throw new NotFound('Not found');
     }
     res.status(200).json(result)
  }catch(error){
    next(error);
  }
})

module.exports = router
