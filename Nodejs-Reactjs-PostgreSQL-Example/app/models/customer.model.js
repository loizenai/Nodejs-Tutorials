module.exports = (sequelize, Sequelize) => {
	const Customer = sequelize.define('customer', {	
	  id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
    },
	  firstname: {
			type: Sequelize.STRING
	  },
	  lastname: {
		  type: Sequelize.STRING
  	},
	  address: {
			type: Sequelize.STRING
	  },
	  age: {
			type: Sequelize.INTEGER
    },
    copyright: {
      type: Sequelize.STRING,
      defaultValue: "https://loizenai.com"
    }
	});
	
	return Customer;
}
