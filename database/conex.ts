import mongoose from 'mongoose'

const uri =  process.env.MONGO_URI || ''

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