const { createClient } = require("redis");

const memoryStore = new Map();
let isConnected = false;
let client = null;

const redisWrapper = {
  connect: async () => {
    try {
      client = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
        socket: {
          connectTimeout: 1500,
          reconnectStrategy: false // Do not reconnect in loop if offline
        }
      });

      client.on("error", (error) => {
        if (isConnected) {
          console.error("Redis Error:", error.message);
        }
      });

      await client.connect();
      isConnected = true;
      console.log("Redis connected");
    } catch (error) {
      isConnected = false;
      if (client) {
        try {
          await client.disconnect();
        } catch (_) {}
        client = null;
      }
      console.log(
        "ℹ️ Redis server is offline. Using in-memory store for password reset OTPs."
      );
    }
  },

  get: async (key) => {
    if (isConnected && client?.isOpen) {
      try {
        return await client.get(key);
      } catch (err) {
        console.warn("Redis get error, falling back to memory:", err.message);
      }
    }
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  },

  set: async (key, value, options) => {
    if (isConnected && client?.isOpen) {
      try {
        return await client.set(key, value, options);
      } catch (err) {
        console.warn("Redis set error, falling back to memory:", err.message);
      }
    }
    const expiresAt = options?.EX ? Date.now() + options.EX * 1000 : null;
    memoryStore.set(key, { value, expiresAt });
    return "OK";
  },

  del: async (key) => {
    if (isConnected && client?.isOpen) {
      try {
        return await client.del(key);
      } catch (err) {
        console.warn("Redis del error, falling back to memory:", err.message);
      }
    }
    memoryStore.delete(key);
    return 1;
  }
};

module.exports = redisWrapper;