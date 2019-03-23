const pgPromise = require('pg-promise')
const initialTables = require('./initialTables')

const cn = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
}

const db = pgPromise({})(cn)

initialTables.forEach(async x => await db.any(x))

module.exports = db
