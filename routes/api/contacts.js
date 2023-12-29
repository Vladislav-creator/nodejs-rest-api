const express = require('express');
const Joi = require('joi');
const {NotFound} = require('http-errors');
const {BadRequest} = require('http-errors');
const router = express.Router();
const contactsOperations = require("../../models/contacts");
// const { request } = require('../../app');
const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
})
router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts()
  res.json({
    status: "success",
    code: 200,
    data: {
      result: contacts
    }
});
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
    res.json({
      status: "success",
      code: 200,
      data: {
        result
      }
  });
  }catch(error){
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactsSchema.validate(req.body);
    if (error){
      error.status = 400;
      throw error;
    }
    const result = await contactsOperations.addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        result
      }
    })
  }catch(error){
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await contactsOperations.removeContact(contactId)
    if(!result){
     throw new NotFound(`Contact with id = ${contactId} not found`);
    }
    res.json({
      status: "success",
      code: 200,
      message: "Contact deleted",
      data: {
        result
      }
  });
  }catch(error){
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = contactsSchema.validate(req.body);
    if (error){
      error.status = 400;
      throw new BadRequest("missing fields");
    }
    const {contactId} = req.params;
    const result = await contactsOperations.updateContact(contactId, req.body);
    if(!result){
      throw new NotFound('Not found');
     }
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        result
      }
    })
  }catch(error){
    next(error);
  }
})

module.exports = router
