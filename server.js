const mongoose = require('mongoose');
// require('dotenv').config();
const app = require('./app');
// const DB_HOST = 'mongodb+srv://Vlad:yo7raWPPLj5s6f9w@cluster0.mwfkz2y.mongodb.net/db-contacts?retryWrites=true&w=majority';
const {DB_HOST, PORT = 3000} = process.env;
mongoose.set('strictQuery', true)
mongoose.connect(DB_HOST)
.then(() => 
app.listen(PORT, () => {
  console.log("Database connection successful");
  })
)
   .catch(error=>{
    console.log(error.message);
    process.exit(1);
  })


