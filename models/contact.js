const {Schema, model} = require('mongoose');
const Joi = require('joi');
const handleMongooseError = require("../middlewares/handleMongooseError");

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
      validate: {
        validator: function(v) {
            return /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
    },
    unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Set phone for contact'],
            validate: {
                validator: function(v) {
                    return /\+38\(\d{3}\)\d{3}-\d{2}-\d{2}/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
  },
  }, {versionKey: false, timestamps: false});
  contactSchema.post("save", handleMongooseError);
  
const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const schemas = {
  addSchema,
  updateFavoriteSchema,
  updateSchema
}
  const Contact = model('contact', contactSchema);
  module.exports = {
    Contact,
    schemas,
  };