const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const { Pool } = require('pg')

const app = express();

const { dbQuery, dbTransaction } = require('./lib/db/dbQuery');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Nice");
});

app.get('/api/decisions', async (req, res) => {
  const data = await dbQuery("SELECT * FROM decisions");
  res.json(data.rows)
})

app.post('/api/decisions', async (req, res) => {
  const {
    description,
    options, 
    user_id 
  } = req.body

  await dbTransaction(async client => {
    const res = await client.query(`
      INSERT INTO decisions (description, user_id)
      VALUES ($1, $2) RETURNING id
    `, [description, user_id])

    for (let i = 0; i < options.length; i++) {
      await client.query(`
        INSERT INTO options (decision_id, user_id, option)
        VALUES ($1, $2, $3)
      `, [res.rows[0].id, user_id, options[i]])
    }
  })
  
  res.json('added')
})

app.patch('/api/decisions/:id', async (req, res) => {
  const { id } = req.params;
  const decision = await dbQuery("SELECT * FROM decisions WHERE id = $1", id)
  if (decision) {
    const info = {
      ...decision,
      ...req.body
    }
    const updatedDecision = await dbQuery("UPDATE decisions SET description = $1, resolved = $2 WHERE id = $3 RETURNING *", info.description, info.resolved, id)
    if (updatedDecision) res.json(updatedDecision.rows[0])
  } else res.send("Failed to update")
});

app.delete('/api/decisions/:id', async (req, res) => {
  const { id } = req.params;

  const deletedDecision = await dbQuery("DELETE FROM decisions WHERE id = $1 RETURNING id", id)
  res.send(`Deleted decision with id of ${id}`)
})

app.get('/api/decisions/:id/options', async (req, res) => {
  const { id: decisionId } = req.params;
  const options = await dbQuery(`
    SELECT * FROM options WHERE decision_id = $1
  `, decisionId)

  res.json(options.rows)
})

app.post('/api/decisions/:id/options', async (req, res) => {
  const { id: decisionId } = req.params;
  const { option, user_id } = req.body;
  const newOption = await dbQuery(`
    INSERT INTO options (decision_id, option, user_id)
    VALUES ($1, $2, $3) RETURNING *
  `, decisionId, option, user_id)

  res.json(newOption)
})

app.patch('/api/decisions/:id/options/:optionId', async (req, res) => {
  const { id: decisionId, optionId } = req.params;

  const { option } = req.body;
  const updatedOption = await dbQuery("UPDATE options SET option = $1 WHERE id = $2 RETURNING option", option, decisionId);
  res.json(updatedOption.rows[0])
})

app.delete('/api/options/:id', async (req, res) => {
  const { id } = req.params;
  await dbQuery("DELETE FROM options WHERE id = $1", id)
  res.json("Deleted")
})

module.exports = app;