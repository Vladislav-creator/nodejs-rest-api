const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contacts');
const  validateBodyForFavourite  = require("../../middlewares/validateBodyForFavourite");
const  validateBody  = require("../../middlewares/validateBody");
const  isValidId  = require("../../middlewares/isValidId");

const {schemas} = require("../../models/contact");
router.get("/",  ctrl.listContacts);
router.get("/:id", isValidId, ctrl.getContactById);
router.post("/", validateBody(schemas.addSchema), ctrl.addContact);
router.delete("/:id", isValidId, ctrl.removeContact);
router.put("/:id", isValidId, validateBody(schemas.updateSchema), ctrl.updateContact);
router.patch("/:id/favorite", isValidId, validateBodyForFavourite(schemas.updateFavoriteSchema), ctrl.updateStatusContact);

module.exports = router
