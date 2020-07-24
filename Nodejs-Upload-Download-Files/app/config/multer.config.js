const multer = require('multer');

var storage = multer.memoryStorage()
var upload = multer({storage: storage});

module.exports = upload;