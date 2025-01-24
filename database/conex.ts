import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const uri =  process.env.MONGODB_URI || ''
const connectDB = async () => {
  try {
    await mongoose.connect(uri)
    console.log('base de datos conectada con mongoose')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB