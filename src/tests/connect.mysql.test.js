'use strict'

const mysql = require('mysql2')

// create a connection to pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'tucker',
  password: '123456',
  database: 'shopDEV'
})

const batchSize = 100000
const totalSize = 10000000

console.time(':::TIMER:::')
let currentId = 1
const insertBatch = async () => {
  const values = []
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`
    const age = currentId
    const address = `address-${currentId}`
    values.push([currentId, name, age, address])
    currentId++
  }

  if (!values.length) {
    console.timeEnd(':::TIMER:::')
    pool.end((err) => {
      if (err) console.log('Error occurred while running batch')
      else console.log('Connection closed successfully')
    })
    return
  }

  const sql = 'INSERT INTO users (id, name, age, address) VALUES ?'
  pool.query(sql, [values], async function (err, results) {
    if (err) throw err
    console.log(`Inserted ${results.affectedRows} records`)
    await insertBatch()
  })
}

insertBatch().catch(console.error)

// perform a sample operation
// pool.query('SELECT * FROM users', function (err, results) {
//   if (err) throw err
//   console.log('query results: ', results)
//   pool.end((err) => {
//     if (err) throw err
//     console.log('Connection closed')
//   })
// })
