//yo7raWPPLj5s6f9w
require("dotenv").config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const authRouter = require('./routes/api/auth');
const contactsRouter = require('./routes/api/contacts');
const  authenticate  = require("./middlewares/authenticate");
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))
app.use('/api/users', authRouter)
app.use('/api/contacts', authenticate, contactsRouter)
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app
