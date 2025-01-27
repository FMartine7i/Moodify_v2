import mongoose from 'mongoose'
// counter schema para auto-incrementos
const Counter = mongoose.model('Counter', new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
}))

const initializeCounters = async () => {
  const counters = [
    { _id: 'songId', seq: 0 },
    { _id: 'playlistId', seq: 0 },
    { _id: 'albumId', seq: 0 }
  ]

  try {
    for (const counter of counters) {
      const existingCounter = await Counter.findById(counter._id)
      if (!existingCounter) {
        await Counter.create(counter)
        console.log(`Counter ${counter._id} inicializado con el valor: ${counter.seq}`)
      } else {
        console.log(`Counter ${counter._id} con el valor: ${existingCounter.seq} ya existe.`)
      }
    }
  } catch (err) {
    console.error('Error al inicializar los contadores:', err)
  }
}

export { Counter, initializeCounters }