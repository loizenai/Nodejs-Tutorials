let express = require('express');
let router = express.Router();
 
const customers = require('../controllers/controller.js');

let path = __basedir + '/view/';

router.get('/', (req,res) => {
    console.log("__basedir" + __basedir);
    res.sendFile(path + "index.html");
});

router.post('/api/customers/create', customers.create);
router.get('/api/customers/pagefiltersort', customers.pagingfilteringsorting);
router.get('/api/customers/salaries', customers.getSalaries);

module.exports = router;