const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contacts');
const  validateBodyForFavourite  = require("../../middlewares/validateBodyForFavourite");
const  validateBody  = require("../../middlewares/validateBody");
const  isValidId  = require("../../middlewares/isValidId");
const  authenticate  = require("../../middlewares/authenticate");
const {schemas} = require("../../models/contact");
router.get("/", authenticate, ctrl.listContacts);
router.get("/:id", authenticate,isValidId, ctrl.getContactById);
router.post("/", authenticate,validateBody(schemas.addSchema), ctrl.addContact);
router.delete("/:id", authenticate, isValidId, ctrl.removeContact);
router.put("/:id", authenticate, isValidId, validateBody(schemas.updateSchema), ctrl.updateContact);
router.patch("/:id/favorite", authenticate, isValidId, validateBodyForFavourite(schemas.updateFavoriteSchema), ctrl.updateStatusContact);

module.exports = router
