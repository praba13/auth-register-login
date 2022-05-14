import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const connect = mongoose.connect(process.env.DB_URL, {});
    console.log(`MONGODB CONNECTED SUCSESSFULLY`.yellow.bold);
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
};

export default connectDB;
