var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())

const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// Configuring the database
const dbConfig = require('./app/config/mongodb.config.js');
const mongoose = require('mongoose');
 
mongoose.Promise = global.Promise;
 
// Connecting to the database
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected to MongoDB.");    
    }).catch(err => {
        console.log('Could not connect to MongoDB.');
        process.exit();
    });

require('./app/routes/customer.router.js')(app);
// Create a Server
var server = app.listen(8080, function () { 
  var host = server.address().address
  var port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port) 
})