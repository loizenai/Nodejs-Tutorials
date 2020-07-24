let express = require('express');
let router = express.Router();
let upload = require('../config/multer.config.js');
 
const fileWorker = require('../controllers/file.controller.js');

let path = __basedir + '/views/';

router.get('/', (req,res) => {
    res.sendFile(path + "index.html");
});

router.post('/api/file/upload', upload.single("file"), fileWorker.uploadFile);
router.post('/api/file/multiple/upload', upload.array('files', 4), fileWorker.uploadMultipleFiles);
 
router.get('/api/file/info', fileWorker.listAllFiles);
 
router.get('/api/file/:id', fileWorker.downloadFile);
 
module.exports = router;