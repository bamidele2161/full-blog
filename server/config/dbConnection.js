const { Pool } = require("pg");

const dotenv = require("dotenv");
dotenv.config();

const connectionParameter = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
};
const connectionPool = new Pool(connectionParameter);

const DbConnection = async () => {
  try {
    const connect = await connectionPool.connect();
    console.log("Database connection established");
    return connect;
  } catch (error) {
    console.log(error);
    console.log("error occured while connecting to the database");
  }
};

module.exports = DbConnection;
