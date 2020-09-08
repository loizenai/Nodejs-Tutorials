const Customer = require('../models/customer.model.js');
 
// POST a Customer
exports.create = (req, res) => {

    const customer = new Customer({
                          firstname: req.body.firstname,
                          lastname: req.body.lastname,
                          age: req.body.age,
                          salary: req.body.salary,
                          address: req.body.address,
                        });
 
    // Save a Customer in the MongoDB
    customer.save().then(data => {
                    // send uploading message to client
                    res.status(200).json({
                      message: "Upload Successfully a Customer to MongoDB with id = " + data.id,
                      customer: data,
                    });
                }).catch(err => {
                    res.status(500).json({
                      message: "Fail!",
                      error: err.message
                    });
                });
};

exports.getSalaries = (req, res) => {
  try {
    Customer.find({}).distinct("salary")
                .then(result => {
                  let salaries = result.sort(function(a, b){return b - a});
                  res.send(salaries);
                });
  } catch (error) {
    res.status(500).send({
      message: "Error -> Can NOT get all customer's salaries",
      error: error.message
    });
  }
}

exports.paginationfilterandsort = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.size);
    let agesorting = (req.query.agesorting === 'true');
    let desc = (req.query.desc === 'true');
    let salary = req.query.salary ? parseInt(req.query.salary) : -1;
  
    const offset = page ? page * limit : 0;

    console.log("offset = " + offset);    

    let result = {};
    let numOfCustomer;
    
    // NOT Filtering with salary
    if(salary < 0){
      numOfCustomer = await Customer.countDocuments({});
      // not sorting with age
      if(agesorting == false) {
        result = await Customer.find({})  // You may want to add a query
                        .skip(offset) // Always apply 'skip' before 'limit'
                        .limit(limit)
                        .select("-__v"); // This is your 'page size'
      } else {
        if(desc == false) { // sorting with age and ascending
          result = await Customer.find({})  // You may want to add a query
                            .skip(offset) // Always apply 'skip' before 'limit'
                            .limit(limit)
                            .sort({"age": 1})
                            .select("-__v"); // This is your 'page size'
        } else { // sorting with age and descending
            result = await Customer.find({})  // You may want to add a query
                              .skip(offset) // Always apply 'skip' before 'limit'
                              .limit(limit)
                              .sort({"age": -1})
                              .select("-__v"); // This is your 'page size'
        }
      }
    } else { // Filtering with salary

      numOfCustomer = await Customer.countDocuments({salary: salary});
      // not sorting with age
      if(agesorting == false) {
        if(desc == false) { // sorting with age and ascending
          result = await Customer.find({salary: salary})  // You may want to add a query
                            .skip(offset) // Always apply 'skip' before 'limit'
                            .limit(limit)
                            .select("-__v"); // This is your 'page size'
        }
      } else {
        if(desc == false) { // sorting with age and ascending
          result = await Customer.find({salary: salary})  // You may want to add a query
                            .skip(offset) // Always apply 'skip' before 'limit'
                            .limit(limit)
                            .sort({"age": 1})
                            .select("-__v"); // This is your 'page size'
        } else { // sorting with age and descending
          result = await Customer.find({salary: salary})  // You may want to add a query
                            .skip(offset) // Always apply 'skip' before 'limit'
                            .limit(limit)
                            .sort({"age": -1})
                            .select("-__v"); // This is your 'page size'
        }
      }
    }

    const response = {
      "copyrightby": "https://loizenai.com",
      "totalItems": numOfCustomer,
      "totalPages": Math.ceil(numOfCustomer / limit),
      "pageNumber": page,
      "pageSize": result.length,
      "customers": result
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }
};