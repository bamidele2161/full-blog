const express = require("express");
const http = require("http");
const app = express();
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const { DbConnection } = require("./config/dbConnection");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

dotenv.config({ path: path.resolve(__dirname, "./.env") });

// Use cookieParser middleware before session middleware
app.use(cookieParser());

const csrfMiddleware = csurf({ cookie: true });
app.use(csrfMiddleware);

// Configure session middleware
const corsOptions = {
  origin: "http://localhost:5501",
  credentials: true,
  methods: "PUT,POST,DELETE",
  allowedHeaders: "Content-Type,CSRF-Token",
};

app.use(cors(corsOptions));

// Routes
app.use("/user", authRoutes);
app.use("/blog", blogRoutes);

app.get("/csrf-token", (req, res) => {
  console.log({ csrfToken: req.csrfToken() });
  res.json({ csrfToken: req.csrfToken() });
});

// Initialize database connection
DbConnection();

// Create server
const server = http.createServer(app);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("listening on port " + port);
});

module.exports = { app, server };
