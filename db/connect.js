const { MongoClient } = require('mongodb');

let database;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    database = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

module.exports = {
  connectDB,
  getDb
};


