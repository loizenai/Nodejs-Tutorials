module.exports = function(app) {
 
  var customers = require('../controllers/customer.controller.js');

  // Create a new Customer
  app.post('/api/customer/create', customers.create);

  // Retrieve all Customer
  app.get('/api/customer/retrieveinfos', customers.findall);

  // Retrieve a single Customer by Id
  app.get('/api/customer/findone/:id', customers.findone);

  // Update a Customer with Id
  app.put('/api/customer/updatebyid/:id', customers.update);

  // Delete a Customer with Id
  app.delete('/api/customer/deletebyid/:id', customers.delete);

  app.get('/api/customer/filteringbyage', customers.filteringByAge);

  app.get('/api/customer/pagination', customers.pagination);

  app.get('/api/customer/pagefiltersort', customers.paginationfilterandsort);
}