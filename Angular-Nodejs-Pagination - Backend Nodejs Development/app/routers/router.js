let express = require('express');
let router = express.Router();
 
const customers = require('../controllers/controller.js');

router.post('/api/customers/create', customers.create);
router.get('/api/customers/pagefiltersort', customers.pagingfilteringsorting);
router.get('/api/customers/salaries', customers.getSalaries);

module.exports = router;