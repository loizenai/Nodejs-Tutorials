module.exports = function(app) {
 
  var customers = require('../controllers/customer.controller.js');

  app.post('/api/customer', customers.createCustomer);
  app.get('/api/customer/:id', customers.getCustomer);
  app.get('/api/customers', customers.customers);
  app.put('/api/customer', customers.updateCustomer);
  app.delete('/api/customer/:id', customers.deleteCustomer);
}