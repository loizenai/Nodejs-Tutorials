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

CustomerSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CustomerSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Customer', CustomerSchema);