import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Remove legacy slug indexes that no longer exist in schemas (caused 400 duplicate key errors on writes)
    const dropIfExists = async (collection, index) => {
      try {
        await conn.connection.collection(collection).dropIndex(index);
      } catch (err) {
        if (err.codeName !== 'IndexNotFound') {
          throw err;
        }
      }
    };

    await dropIfExists('categories', 'slug_1');
    await dropIfExists('brands', 'slug_1');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
