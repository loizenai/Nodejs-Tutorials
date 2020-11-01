const db = require('../config/db.config.js');
const Customer = db.Customer;

/**
 * Save a Customer object to database MySQL/PostgreSQL
 * @param {*} req 
 * @param {*} res 
 */
exports.createCustomer = (req, res) => {
    let customer = {};

    try{
        // Building Customer object from upoading request's body
        customer.firstname = req.body.firstname;
        customer.lastname = req.body.lastname;
        customer.address = req.body.address;
        customer.age = req.body.age;
    
        // Save to MySQL database
        Customer.create(customer, 
                          {attributes: ['id', 'firstname', 'lastname', 'age', 'address', "copyright"]})
                    .then(result => {    
                      res.status(200).json(result);
                    });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

/**
 * Retrieve Customer information from database
 * @param {*} req 
 * @param {*} res 
 */
exports.customers = (req, res) => {
    // find all Customer information from 
    try{
        Customer.findAll({attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'copyright']})
        .then(customers => {
            res.status(200).json(customers);
        })
    }catch(error) {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
    }
}

exports.getCustomer = (req, res) => {
    Customer.findByPk(req.params.id, 
                        {attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'copyright']})
        .then(customer => {
          res.status(200).json(customer);
        }).catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        })
}

/**
 * Updating a Customer
 * @param {*} req 
 * @param {*} res 
 */
exports.updateCustomer = async (req, res) => {
    try{
        let customer = await Customer.findByPk(req.body.id);
    
        if(!customer){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a customer with id = " + customerId,
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                age: req.body.age
            }
            let result = await Customer.update(updatedObject,
                              { 
                                returning: true, 
                                where: {id: req.body.id},
                                attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'copyright']
                              }
                            );

            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a customer with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json(result);
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a customer with id = " + req.params.id,
            error: error.message
        });
    }
}

/**
 *  Delete a Customer by ID
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteCustomer = async (req, res) => {
    try{
        let customerId = req.params.id;
        let customer = await Customer.findByPk(customerId);

        if(!customer){
            res.status(404).json({
                message: "Does Not exist a Customer with id = " + customerId,
                error: "404",
            });
        } else {
            await customer.destroy();
            res.status(200);
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a customer with id = " + req.params.id,
            error: error.message
        });
    }
}