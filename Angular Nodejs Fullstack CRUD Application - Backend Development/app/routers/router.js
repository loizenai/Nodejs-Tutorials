let express = require('express');
let router = express.Router();
 
const customers = require('../controllers/controller.js');

let path = __basedir + '/view/';

router.get('/', (req,res) => {
    console.log("__basedir" + __basedir);
    res.sendFile(path + "index.html");
});

router.get('/customers/', (req,res) => {
    console.log("__basedir" + __basedir);
    res.sendFile(path + "customers.html");
});

router.post('/api/customers/create', customers.create);
router.get('/api/customers/retrieveinfos', customers.retrieveAllCustomers);
router.put('/api/customers/updatebyid/:id', customers.updateById);
router.delete('/api/customers/deletebyid/:id', customers.deleteById);

module.exports = router;