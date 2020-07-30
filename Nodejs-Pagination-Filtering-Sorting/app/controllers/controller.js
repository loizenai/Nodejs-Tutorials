/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

const db = require('../config/db.config.js');
const Customer = db.Customer;

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

exports.pagination = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
  
    const offset = page ? page * limit : 0;
  
    Customer.findAndCountAll({ limit: limit, offset:offset })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Paginating is completed! Query parameters: page = " + page + ", limit = " + limit,
          data: {
              "copyrightby": "https://loizenai.com",
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "customers": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }    
}

exports.filteringByAge = (req, res) => {
  let age = req.query.age;

    Customer.findAll({
                      attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'copyrightby'],
                      where: {age: age}
                    })
          .then(results => {
            res.status(200).json({
                message: "Get all Customers with age = " + age,
                totalItems: results.length,
                customers: results,
            });
          })
          . catch(error => {
              console.log(error);
              res.status(500).json({
                message: "Error!",
                error: error
              });
            });
}

exports.pagingfilteringsorting = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let age = parseInt(req.query.age);
  
    const offset = page ? page * limit : 0;

    console.log("offset = " + offset);
  
    Customer.findAndCountAll({
                                attributes: ['id', 'firstname', 'lastname', 'age', 'address'],
                                where: {age: age}, 
                                order: [
                                  ['firstname', 'ASC'],
                                  ['lastname', 'DESC']
                                ],
                                limit: limit, 
                                offset:offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Pagination Filtering Sorting request is completed! Query parameters: page = " + page + ", limit = " + limit + ", age = " + age,
          data: {
              "copyrightby": "https://loizenai.com",
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "age-filtering": age,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "customers": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }      
}