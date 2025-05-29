const express = require('express')
const path = require('path')
require('dotenv').config()
const sequelize = require('./config/db')

const authRoute = require('./routes/authRoutes')
const adminRoute = require('./routes/adminRoutes')
const projectRoute = require('./routes/projectsRoutes')
const donationRoute = require('./routes/donationRoutes')
const userRoute = require('./routes/userRoutes')
const OrgRoute = require('./routes/organizationRoutes')

const app = express()

const PORT = process.env.PORT || 3000


app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

//app.get('/', (req, res) => res.send('Charity Donation Platform API Running'));
app.use('/api/auth', authRoute)
app.use('/api/admin', adminRoute)
app.use('/api/project', projectRoute)
app.use('/api/organization', OrgRoute)
app.use('/api/donation', donationRoute)
app.use('/api/user', userRoute)


//app.use(express.static('view'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

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