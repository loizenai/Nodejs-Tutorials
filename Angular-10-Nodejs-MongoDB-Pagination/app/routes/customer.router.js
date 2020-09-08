module.exports = function(app) {
 
  var customers = require('../controllers/customer.controller.js');

  // Create a new Customer
  app.post('/api/customers/create', customers.create);
  app.get('/api/customers/salaries', customers.getSalaries);
  app.get('/api/customers/pagefiltersort', customers.paginationfilterandsort);
}