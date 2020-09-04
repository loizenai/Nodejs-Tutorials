const mongoose = require('mongoose');
 
const CustomerSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    address: String,
    age: { 
      type: Number, 
      min: 18, 
      max: 65, 
      required: true 
    },
    copyrightby: {
      type: String,
      default: 'https://loizenai.com'
    }
});

module.exports = mongoose.model('Customer', CustomerSchema);