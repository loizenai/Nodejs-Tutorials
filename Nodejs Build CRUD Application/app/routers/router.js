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

router.post('/api/customer/create', customers.create);
router.get('/api/customer/retrieveinfos', customers.retrieveInfos);
router.get('/api/customer/findone/:id', customers.findById);
router.put('/api/customer/updatebyid/:id', customers.updateById);
router.delete('/api/customer/deletebyid/:id', customers.deleteById);

module.exports = router;