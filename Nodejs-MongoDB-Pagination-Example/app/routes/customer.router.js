module.exports = function(app) {
 
  var customers = require('../controllers/customer.controller.js');

  // Create a new Customer
  app.post('/api/customer/create', customers.create);

  app.get('/api/customer/filteringbyage', customers.filteringByAge);

  app.get('/api/customer/pagination', customers.pagination);
  app.get('/api/customer/pagination_v2', customers.pagination);

  app.get('/api/customer/pagefiltersort', customers.paginationfilterandsort);
}