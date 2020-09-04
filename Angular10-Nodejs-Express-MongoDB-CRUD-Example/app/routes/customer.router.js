module.exports = function(app) {
 
  var customers = require('../controllers/customer.controller.js');

  // Create a new Customer
  app.post('/api/customers/create', customers.create);

  // Retrieve all Customer
  app.get('/api/customers/retrieveinfos', customers.findall);

  // Update a Customer with Id
  app.put('/api/customers/updatebyid/:id', customers.update);

  // Delete a Customer with Id
  app.delete('/api/customers/deletebyid/:id', customers.delete);
}