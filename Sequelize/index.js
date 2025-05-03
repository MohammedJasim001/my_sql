
import express from 'express'
import { Sequelize, DataTypes } from 'sequelize'

const app = express()

app.use(express.json())

const sequelize = new Sequelize('sample_sequelize','root','nabu_7510', {
    host:'localhost',
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
})

sequelize.authenticate()
    .then(()=>console.log('connection established'))
    .catch((err)=>console.log('something error when connection', err))

const Product = sequelize.define('Product', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false
    },
    price: {
        type:DataTypes.DECIMAL,
        allowNull: false,
    },
},{
    tableName:'products',
    timestamps:true
}) 

sequelize.sync()
    .then(()=>console.log('database and table created'))

app.post('/create', async (req,res)=>{
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({error:"sever error" + err})
    }
})

app.get('/products', async (req,res) => {
    try {
        const products = await Product.findAll()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({error:"sever error" + err})
    }
})

app.get('/products/:id', async(req,res)=> {
    try {
        const product = await Product.findByPk(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({error:"sever error" + err})
    }
})

app.put('/product/update/:id', async(req,res)=> {
    try {
        const product = await Product.findByPk(req.params.id)
        if(product){
            await product.update(req.body)
            return res.status(200).json(product)
        }
        else{
            return res.status(400).json({error:"product not found"})
        }
    } catch (err) {
        res.status(500).json({error:"sever error" + err})
    }
})

app.delete('/product/delete/:id', async(req,res)=>{
    try {
        const product = await Product.findByPk(req.params.id)
        if(!product){
            return res.status(400).json('product not found')
        }
        await product.destroy()
        res.status(200).json('product successfully deleted')
    } catch (err) {
        res.status(500).json({error:"sever error" + err})
    }
})


app.listen(3000, ()=>{
    console.log('server running on port 3000');
})