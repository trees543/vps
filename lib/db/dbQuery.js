const config = require('../config.js');
const { Client, Pool } = require('pg');

const CONNECTION = {
  connectionString: "postgres://trj:cambodia543089@localhost:5432/vps"
}

module.exports = {
  async dbQuery(statement, ...params) {
    let client = new Client(CONNECTION);
    await client.connect();
    let res = await client.query(statement, params);
    await client.end();
    return res;
  },

  async dbTransaction(queries) {
    let pool = new Pool(CONNECTION);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      queries(client);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }
}