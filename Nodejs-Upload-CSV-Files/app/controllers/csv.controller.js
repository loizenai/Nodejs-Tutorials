const stream = require('stream');
const await = require('await')
const fs = require('fs');
const path = require('path');

const db = require('../config/db.config.js');
const Customer = db.Customer;

const csv = require('fast-csv');
const Json2csvParser = require('json2csv').Parser;

/**
 * Upload Single CSV file/ and Import data to MySQL/PostgreSQL database
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadFile = (req, res) => {
    try{
        const customers = [];
        fs.createReadStream(__basedir + "/uploads/" + req.file.filename)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error(error);
                throw error.message;
            })
            .on('data', row => {
                customers.push(row);
                console.log(row);
            })
            .on('end', () => {
                // Save customers to MySQL/PostgreSQL database
                Customer.bulkCreate(customers).then(() => {
                    const result = {
                        status: "ok",
                        filename: req.file.originalname,
                        message: "Upload Successfully!",
                    }
    
                    res.json(result);
                });    
            });
    }catch(error){
        const result = {
            status: "fail",
            filename: req.file.originalname,
            message: "Upload Error! message = " + error.message
        }
        res.json(result);
    }
}

/** 
 * Upload multiple Excel Files
 *  
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadMultipleFiles = async (req, res) => {
    const messages = [];
    
	for (const file of req.files) {
        try{
            // Parsing CSV Files to data array objects
            const csvParserStream = fs.createReadStream(__basedir + "/uploads/" + file.filename)
                        .pipe(csv.parse({ headers: true }));

            var end = new Promise(function(resolve, reject) {
                let customers = [];

                csvParserStream.on('data', object => {
                    customers.push(object);
                    console.log(object);
                });
                csvParserStream.on('end', () => {
                    resolve(customers);
                });
                csvParserStream.on('error', error => {
                    console.error(error);
                    reject
                }); // or something like that. might need to close `hash`
            });
            
            await (async function() {
                let customers = await end;

                // save customers to MySQL/PostgreSQL database
                await Customer.bulkCreate(customers).then(() => {
                    const result = {
                        status: "ok",
                        filename: file.originalname,
                        message: "Upload Successfully!",
                    }
    
                    messages.push(result);
                }); 
            }());
        }catch(error){
            console.log(error);

            const result = {
                status: "fail",
                filename: file.originalname,				
                message: "Error -> " + error.message
            }
            messages.push(result);
        }
	}

	return res.json(messages);
}


exports.downloadFile = (req, res) => {
    Customer.findAll({attributes: ['id', 'name', 'address', 'age']}).then(objects => {
        const jsonCustomers = JSON.parse(JSON.stringify(objects));
        const csvFields = ['Id', 'Name', 'Address', 'Age'];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csvData = json2csvParser.parse(jsonCustomers);

        res.setHeader('Content-disposition', 'attachment; filename=customers.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).end(csvData);
    });
}