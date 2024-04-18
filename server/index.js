const express = require("express");
const http = require("http");
const app = express();
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const DbConnection = require("./config/dbConnection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

dotenv.config({ path: path.resolve(__dirname, "./.env") });

app.use(
  cors({
    origin: "*",
  })
);

//routes
app.use("/user", authRoutes);
app.use("/blog", blogRoutes);
//database

DbConnection();
//server
const server = http.createServer(app);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("listening on port " + port);
});

module.exports = app;
