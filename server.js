const express = require('express')
require('dotenv').config()
const sequelize = require('./config/db')

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

sequelize.sync()
    .then(()=>{
        console.log('Database connected and synced')
        app.listen(PORT,() => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Failed to connect/sync database:', err)
        process.exit(1)
    })