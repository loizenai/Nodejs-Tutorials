let express = require('express');
let router = express.Router();
 
const customers = require('../controllers/controller.js');

router.post('/api/customers/create', customers.create);
router.get('/api/customers/retrieveinfos', customers.retrieveAllCustomers);
router.put('/api/customers/updatebyid/:id', customers.updateById);
router.delete('/api/customers/deletebyid/:id', customers.deleteById);

module.exports = router;