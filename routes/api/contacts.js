const express = require('express');
// const {NotFound} = require('http-errors');
// const {BadRequest} = require('http-errors');
const router = express.Router();
const ctrl = require('../../controllers/contacts');
const {validateBody, isValidId} = require("../../middlewares");
const {schemas} = require("../../models/contact");
router.get("/", ctrl.listContacts);
router.get("/:id", isValidId, ctrl.getContactById);
router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

// router.put("/:id", isValidId, validateBody(schemas.addSchema), ctrl.updateById);

// router.patch("/:id/favorite", isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

// router.delete("/:id", isValidId, ctrl.deleteById);


module.exports = router
