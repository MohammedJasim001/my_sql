import express from 'express'
import mysql from 'mysql2/promise'

const app = express()
app.use(express.json())

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'nabu_7510',
    database:'sql_test'
})


app.post('/create', async(req,res)=>{
    const {name,email} = req.body
    try {
        const [result] = await pool.query(`INSERT INTO users (name,email) VALUES (?,?)`, [name,email ]);
        res.status(201).json({id:result.insertId, name,email})
    } catch (error) {
        res.status(500).json({err:error.message})
    }
})

app.get('/',async(req,res)=>{
    try {
        const [rows] = await pool.query(`SELECT * FROM users`)
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({err:error.message})
    }
})

app.get('/:id', async (req,res)=> {
    const {id} = req.params
    try {
        const [row] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id])
        res.status(200).json(row[0])
    } catch (error) {
        res.status(500).json({err:error.message})
    }
})

app.put('/update/:id',async (req,res)=> {
    const {name,email} = req.body
    const {id} = req.params
    try {
        const [result] = await pool.query(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name,email,id])
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({err:error.message})
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



app.listen(3000,()=>{
    console.log('server running on port 3000');
})