/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

const db = require('../config/db.config.js');
const Customer = db.Customer;
const Sequelize = db.Sequelize;


exports.create = (req, res) => {
    let customer = {};

    try{
        // Building Customer object from upoading request's body
        customer.firstname = req.body.firstname;
        customer.lastname = req.body.lastname;
        customer.address = req.body.address;
        customer.age = req.body.age;
        customer.salary = req.body.salary;
    
        // Save to MySQL database
        Customer.create(customer).then(result => {    
            // send uploading message to client
            res.status(200).json({
                message: "Upload Successfully a Customer with id = " + result.id,
                customer: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.pagingfilteringsorting = async (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.size);
    let agesorting = (req.query.agesorting === 'true');
    let desc = (req.query.desc === 'true');
    let salary = req.query.salary ? parseInt(req.query.salary) : -1;
  
    const offset = page ? page * limit : 0;

    console.log("offset = " + offset);    

    let result = {};

    // NOT Filtering with salary
    if(salary < 0 ){
      // not sorting with age
      if(agesorting == false) {
        result = await Customer.findAndCountAll({
          attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'salary', 'copyrightby'],
          limit: limit, 
          offset:offset 
        });
      } else {
        if(desc == false) { // sorting with age and ascending
          result = await Customer.findAndCountAll({
            attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'salary', 'copyrightby'],
            limit: limit, 
            offset:offset,
            order: [
              ['age', 'ASC']
            ]             
          });
        } else { // sorting with age and descending
          result = await Customer.findAndCountAll({
            attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'salary', 'copyrightby'],
            limit: limit, 
            offset:offset,
            order: [
              ['age', 'DESC']
            ]             
          });
        }
      }
    } else { // Filtering with salary
      // not sorting with age
      if(agesorting == false) {
        result = await Customer.findAndCountAll({
          attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'salary', 'copyrightby'],
          where: {salary: salary},
          limit: limit, 
          offset:offset
        });
      } else {
        if(desc == false) { // sorting with age and ascending
          result = await Customer.findAndCountAll({
            attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'salary', 'copyrightby'],
            where: {salary: salary},
            limit: limit, 
            offset:offset,
            order: [
              ['age', 'ASC']
            ]                         
          });
        } else { // sorting with age and descending
          result = await Customer.findAndCountAll({
            attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'salary', 'copyrightby'],
            where: {salary: salary},
            limit: limit, 
            offset:offset,
            order: [
              ['age', 'DESC']
            ]                         
          });
        }
      }      
    }

    const totalPages = Math.ceil(result.count / limit);
    const response = {
      "copyrightby": "https://loizenai.com",
      "totalPages": totalPages,
      "pageNumber": page,
      "pageSize": result.rows.length,
      "customers": result.rows
    };
    res.send(response);
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }      
}

exports.getSalaries = (req, res) => {
  Customer.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('salary')), 'salary'],
    ],
    order: [
      ['salary', 'ASC']
    ],                         
  }).then(result => {
    let salaries = result.map(x => x.salary);
    res.send(salaries);
  }).catch(error => {
    res.status(500).send({
      message: "Error -> Can NOT get all customer's salaries",
      error: error.message
    });
  });
}