const Joi = require('joi');
const contactsSchemaPost = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.number().required(),
  });
const contactsSchemaPut = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.number(),
  });
module.exports = {contactsSchemaPost, contactsSchemaPut};
