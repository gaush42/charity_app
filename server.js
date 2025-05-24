const express = require('express')
require('dotenv').config()
const sequelize = require('./config/db')

const app = express()

const PORT = process.env.PORT || 3000

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const orgRoutes = require('./routes/organisation.routes');
const donationRoutes = require('./routes/donation.routes');
const adminRoutes = require('./routes/admin.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/organisations', orgRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Charity Donation Platform API Running'));


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