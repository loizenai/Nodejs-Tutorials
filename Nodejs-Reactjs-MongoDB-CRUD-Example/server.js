var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./app/config/mongodb.config.js');
const mongoose = require('mongoose');

const Customer = require('./app/models/customer.model.js');
 
mongoose.Promise = global.Promise;
 
// Connecting to the database
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Successfully connected to MongoDB.");   
        const customers = [
            { firstname: 'Jack', lastname: 'Smith', 
                      age: 23, address: '374 William S Canning Blvd'},
            { firstname: 'Adam', lastname: 'Johnson', 
                      age: 31, address: 'Fall River MA 2721. 121 Worcester Rd'},
            { firstname: 'Dana', lastname: 'Bay', 
                      age: 46, address: 'Framingham MA 1701. 677 Timpany Blvd'},
          ]

        for(let i=0; i<customers.length; i++){

            const customer = new Customer({
                firstname: customers[i].firstname,
                lastname: customers[i].lastname,
                age: customers[i].age,
                address: customers[i].address
              });

            // Save a Customer in the MongoDB
            await customer.save();
        }
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