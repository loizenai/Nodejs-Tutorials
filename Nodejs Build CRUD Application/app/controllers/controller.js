const db = require('../config/db.config.js');
const Customer = db.Customer;

/**
 * Save a Customer object to database MySQL/PostgreSQL
 * @param {*} req 
 * @param {*} res 
 */
exports.create = (req, res) => {
    let customer = {};

    try{
        // Building Customer object from upoading request's body
        customer.firstname = req.body.firstname;
        customer.lastname = req.body.lastname;
        customer.address = req.body.address;
        customer.age = req.body.age;
    
        // Save to MySQL database
        Customer.create(customer).then(result => {    
            // send uploading message to client
            res.status(200).json({
                message: "Upload Successfully!",
                customer: result
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            formdata: customer,
            error: error.message
        });
    }
}

/**
 * Retrieve Customer information from database
 * @param {*} req 
 * @param {*} res 
 */
exports.retrieveInfos = (req, res) => {
    // find all Customer information from 
    try{
        Customer.findAll({attributes: ['id', 'firstname', 'address']})
        .then(customerInfos => {
            res.status(200).json({
                message: "Get Customers' Infos!",
                customerInfos: customerInfos
            });
        })
    }catch(error) {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Retrieving Error!",
            error: error
        });
    }
}

/**
 * 
 * Get a Customer by Id from database
 * @param {*} req 
 * @param {*} res 
 */
exports.findById = (req, res) => {
    // getting a customer id from request parameters
    let customerId = req.params.id;

    try{
        Customer.findByPk(customerId).then(customer => {
            res.status(200).json({
                message: "Successfully! Retrieve a customer by id = " + customerId,
                customer: customer
            });
        });
    }catch(error) {
        // Send error to Client
        res.statas(500).json({
            message: "Error when retrieving a customer by id = " + customerId,
            error: error.message
        });
    }
}

/**
 * Updating a Customer
 * @param {*} req 
 * @param {*} res 
 */
exports.updateById = async (req, res) => {
    try{
        let customerId = req.params.id;
        let customer = await Customer.findByPk(customerId);
    
        if(!customer){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a customer with id = " + customerId
            });
        } else {    
            // update new change to database
            let updatedObject = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                age: req.body.age
            }
            let result = await Customer.update(updatedObject, {returning: true, where: {id: customerId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a customer with id = " + req.params.id,
                    error: "Can NOT Updated"
                });
            }

            res.status(200).json({
                message: "Update successfully a Customer with id = " + customerId,
                customer: updatedObject           
            });
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
exports.deleteById = async (req, res) => {
    try{
        let customerId = req.params.id;
        let customer = await Customer.findByPk(customerId);

        if(!customer){
            res.status(404).json({
                message: "Does Not exist a Customer with id = " + customerId,
                error: "Not Found"
            });
        } else {
            await customer.destroy();
            res.status(200).json({
                message: "Delete Successfully a Customer with id = " + customerId,
                customer: customer
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a customer with id = " + req.params.id,
            error: error.message           
        });
    }
}