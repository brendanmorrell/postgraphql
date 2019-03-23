const pgPromise = require('pg-promise')

const cn = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
}

const pgp = pgPromise({})
const db = pgp(cn)

module.exports = db
