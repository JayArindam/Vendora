const sequelize = require('./conn/conn'); 
require("./models/associations");

const syncDB = async () => {
  try {
    await sequelize.sync({ force: true });  // This will **DROP** all tables and recreate them
    console.log("All tables have been successfully recreated.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }


};

syncDB();
