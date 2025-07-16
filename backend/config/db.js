import mongoose from "mongoose";


const connectDB=async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGO_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  }
  catch(e){
    console.log(`there ws error in connecting the database: ${e.message}`);
    process.exit(1);
  }
}

export default connectDB;