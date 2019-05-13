const connectionString = 'mongodb://localhost:27017/homework'

module.exports = function config(mongoose) {
  mongoose.connect(connectionString, { useNewUrlParser: true })
  const db = mongoose.connection
  db.once('open', () => {
    console.log('Database connected')
  })
  db.on('error', () => {
    console.log('Database error')
  })
}