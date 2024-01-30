const express = require("express");
const path = require("path");
const cluster = require("cluster");
const os = require("os");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const { connectDB } = require("./src/config/database");

const dotenvPath = path.join(__dirname, ".env");

// Check if .env file exists
if (!require("fs").existsSync(dotenvPath)) {
  console.error("Error: .env file not found. Exiting...");
  process.exit(1);
}

// Load environment variables from .env file
dotenv.config({ path: dotenvPath });

// Validate required environment variables
const requiredEnvVariables = ["PORT", "MONGODB_URI"];
const missingEnvVariables = requiredEnvVariables.filter(
  (variable) => !process.env[variable]
);

if (missingEnvVariables.length > 0) {
  console.error(
    `Error: Missing required environment variables: ${missingEnvVariables.join(
      ", "
    )}. Exiting...`
  );
  process.exit(1);
}

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Worker process

  const app = express();

  // Connect to Mongodb
  connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger("dev"));

  // Routes
  const route = require("./src/routes");
  app.use("/api/v1", route);
  app.get("/status", (_, res) => {
    res.status(200).json({ success: true, message: `Application is running` });
  });
  app.get("*", (_, res) => {
    res.status(404).send(`Sorry, can't find that`);
  });

  // Exception handling and graceful shutdown
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });

  process.on("SIGINT", () => {
    console.log("Received SIGINT. Shutting down gracefully...");

    process.exit(0);
  });

  // Start server
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Worker ${process.pid} started on port ${port}`);
  });
}
