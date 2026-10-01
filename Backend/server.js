require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const redisClient = require("./src/config/redis");
const ensureAdminExists = require("./src/config/initAdmin");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminExists();
    await redisClient.connect();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();