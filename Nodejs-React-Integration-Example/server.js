const express = require('express');
const app = express();

let path = __dirname + '/views/';

app.use(express.static('views'));

// Create a Server
const server = app.listen(8080, function () {
 
  let host = server.address().address
  let port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port); 
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/api/customer', function (req, res) {
  res.json({
    firstname: "Jack",
    lastname: "Smith",
    age: 23,
    address: "374 William S Canning Blvd",
    copyrightby: "https://loizenai.com"
  })
})

app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});