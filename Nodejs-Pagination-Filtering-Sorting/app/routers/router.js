let express = require('express');
let router = express.Router();
 
const customers = require('../controllers/controller.js');

router.post('/api/customers/create', customers.create);
router.get('/api/customers/pagination', customers.pagination);
router.get('/api/customers/filteringbyage', customers.filteringByAge);
router.get('/api/customers/pagefiltersort', customers.pagingfilteringsorting);

module.exports = router;