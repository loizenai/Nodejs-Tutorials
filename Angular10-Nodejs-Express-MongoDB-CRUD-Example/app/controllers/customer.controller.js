const Customer = require('../models/customer.model.js');
 
// POST a Customer
exports.create = (req, res) => {

    const customer = new Customer({
                          firstname: req.body.firstname,
                          lastname: req.body.lastname,
                          age: req.body.age,
                          address: req.body.address,
                        });
 
    // Save a Customer in the MongoDB
    customer.save().then(data => {
                    // send uploading message to client
                    res.status(200).json({
                      message: "Upload Successfully a Customer to MongoDB with id = " + data.id,
                      customers: [data]
                    });
                }).catch(err => {
                    res.status(500).json({
                      message: "Fail!",
                      error: err.message
                    });
                });
};
  
// FETCH all Customers
exports.findall = (req, res) => {
    Customer.find().select('-__v').then(customerInfos => {
          res.status(200).json({
            message: "Get all Customers' Infos Successfully!",
            numberOfCustomers: customerInfos.length,
            customers: customerInfos
          });
        }).catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
};
 
// find a Customer by id
exports.findone = (req, res) => {
    Customer.findById(req.params.id).select('-__v')
        .then(customer => {
          res.status(200).json({
            message: " Successfully Get a Customer from MongoDB with id = " + req.params.id,
            customer: customer
          });
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
exports.update = (req, res) => {
    // Find customer and update it
    Customer.findByIdAndUpdate(
                    req.params.id, 
                      {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        age: req.body.age
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

            res.status(200).json({
              message: "Update successfully a Customer with id = " + req.params.id,
              customers: [customer],
            });
        }).catch(err => {
            return res.status(500).send({
              message: "Error -> Can not update a customer with id = " + req.params.id,
              error: err.message
            });
        });
};
 
// DELETE a Customer
exports.delete = (req, res) => {
    let customerId = req.params.id

    Customer.findByIdAndRemove(customerId).select('-__v')
        .then(customer => {
            if(!customer) {
              return res.status(404).json({
                message: "Does Not exist a Customer with id = " + customerId,
                error: "404",
              });

            }
            res.status(200).json({
              message: "Delete Successfully a Customer with id = " + customerId,
              customers: [customer],
            });
        }).catch(err => {
            return res.status(500).send({
              message: "Error -> Can NOT delete a customer with id = " + customerId,
              error: err.message
            });
        });
};

exports.filteringByAge = (req, res) => {
  const age = parseInt(req.query.age);  

  Customer.find({age:age}).select("-__v")
    .then(results => {
      res.status(200).json({
        "message": "Get all Customers with age = " + age,
        "size": results.length,
        "customers": results
      });  
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Error!",
        error: err
      });
    });
}

exports.pagination = async (req, res) => {

  try {

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    
    const offset = page ? page * limit : 0;
  
    // We are using the '3 layer' architecture explored on the 'bulletproof node.js architecture'
    // Basically, it's just a class where we have our business logic
    
    let results = await Customer.find({})  // You may want to add a query
                      .skip(offset) // Always apply 'skip' before 'limit'
                      .limit(limit)
                      .select("-__v"); // This is your 'page size'
        
    let numOfCustomer = await Customer.countDocuments({});
  
    res.status(200).json({
      "message": "Paginating is completed! Query parameters: page = " + page + ", limit = " + limit,
      "totalPages": Math.ceil(numOfCustomer / limit),
      "totalItems": numOfCustomer,
      "limit": limit,
      "currentPageSize": results.length,
      "customers": results
    });      
  } catch (error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });    
  }

}

exports.paginationfilterandsort = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    const age = parseInt(req.query.age);
    
    const offset = page ? page * limit : 0;
    
    let results = await Customer.find({age: age})  // You may want to add a query
                      .skip(offset) // Always apply 'skip' before 'limit'
                      .limit(limit)
                      .sort({"firstname": 1, "lastname": -1})
                      .select("-__v"); // This is your 'page size'
        
    let numOfCustomer = await Customer.countDocuments({age: age});

    res.status(200).json({
      "message": "Paginating is completed! Query parameters: page = " + page + ", limit = " + limit,
      "totalPages": Math.ceil(numOfCustomer / limit),
      "totalItems": numOfCustomer,
      "limit": limit,
      "age-filtering": age,
      "currentPageSize": results.length,
      "customers": results
    });    
  } catch (error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging + filtering + sorting request!",
      error: error.message,
    });
  }
};