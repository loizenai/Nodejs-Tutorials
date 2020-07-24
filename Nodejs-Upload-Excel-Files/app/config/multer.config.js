const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
       cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
  });   
   
const upload = multer({storage: storage});

module.exports = upload;