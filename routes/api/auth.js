const express = require('express');
const ctrl = require("../../controllers/auth");
const  validateBody = require("../../middlewares/validateBody");
const  authenticate = require("../../middlewares/authenticate");
const {schemas} = require("../../models/user");
const router = express.Router();
// signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.getCurrent);
router.patch("/", authenticate, ctrl.updateSubscription);
module.exports = router