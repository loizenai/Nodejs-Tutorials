const Customer = require('../models/customer.model.js');
 
// POST a Customer
exports.createCustomer = (req, res) => {

    const customer = new Customer({
                          firstname: req.body.firstname,
                          lastname: req.body.lastname,
                          age: req.body.age,
                          address: req.body.address,
                        });
 
    // Save a Customer in the MongoDB
    customer.save().then(data => {
                    res.status(200).json(data);
                }).catch(err => {
                    res.status(500).json({
                      message: "Fail!",
                      error: err.message
                    });
                });
};
  
// FETCH all Customers
exports.customers = (req, res) => {
    Customer.find().select('-__v').then(customerInfos => {
          res.status(200).json(customerInfos);
        }).catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
};

// get a Customer by Id
exports.getCustomer = (req, res) => {
  Customer.findById(req.params.id).select('-__v')
      .then(customer => {
        res.status(200).json(customer);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "Customer not found with id " + req.params.id,
                  error: err
              });                
          }
          return res.status(500).send({
              message: "Error retrieving Customer with id " + req.params.id,
              error: err
          });
      });
};
 
// UPDATE a Customer
exports.updateCustomer = (req, res) => {
    // Find customer and update it
    Customer.findByIdAndUpdate(
                      req.body._id, 
                      {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        age: req.body.age,
                        address: req.body.address
                      }, 
                        {new: true}
                    ).select('-__v')
        .then(customer => {
            if(!customer) {
                return res.status(404).send({
                    message: "Error -> Can NOT update a customer with id = " + req.params.id,
                    error: "Not Found!"
                });
            }

            res.status(200).json(customer);
        }).catch(err => {
            return res.status(500).send({
              message: "Error -> Can not update a customer with id = " + req.params.id,
              error: err.message
            });
        });
};

// DELETE a Customer
exports.deleteCustomer = (req, res) => {
    let customerId = req.params.id

    Customer.findByIdAndRemove(customerId).select('-__v -_id')
        .then(customer => {
            if(!customer) {
              res.status(404).json({
                message: "Does Not exist a Customer with id = " + customerId,
                error: "404",
              });
            }
            res.status(200).json({});
        }).catch(err => {
            return res.status(500).send({
              message: "Error -> Can NOT delete a customer with id = " + customerId,
              error: err.message
            });
        });
};