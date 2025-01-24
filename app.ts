import mongoose from 'mongoose'
import connectDB from './database/conex'
import initializeCounters from './database/initDatabase'
require('dotenv').config();
const Server = require('./model/server')
const app = new Server();

connectDB().then(async () => {
    await initializeCounters()
    console.log('Base de datos y contadores inicializados.')
})

app.listen();