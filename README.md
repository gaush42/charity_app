# 🌟 KindBridge – Charity Management Platform

A secure and scalable Node.js-based backend API that allows users to donate to social projects run by registered organizations. The system integrates with **Cashfree Payments** for transaction processing and **Brevo (Sendinblue)** for email notifications. Built with JavaScript, Sequelize (MySQL), and Express.

---

## 🚀 Features

- 💳 Donation via Cashfree with payment session and webhook handling
- 📬 Email notifications using Brevo (formerly Sendinblue)
- 🔒 JWT-based authentication and authorization
- 🧾 Tracks projects, users, donations, and organizations
- 📈 Automatically updates project funding progress
- ✅ Admin panel support for approval and monitoring

---

## 🛠️ Tech Stack

| Layer        | Tech                                    |
|-------------|------------------------------------------|
| Language     | JavaScript (Node.js)                    |
| Server       | Express.js                              |
| Database     | MySQL (with Sequelize ORM)              |
| Payments     | Cashfree PG SDK                         |
| Email        | Brevo (Sendinblue Transactional Emails) |
| Auth         | JWT (JSON Web Tokens)                   |
| Env Config   | dotenv                                  |

---

## 📁 Project Structure
```
├── config/ # Sequelize & environment config
├── controllers/ # Route handlers
├── middleware/ # JWT auth middleware
├── models/ # Sequelize models (User, Donation, Project, etc.)
├── routes/ # Express route definitions
├── utils/ # Email sending helpers, etc.
├── public/ # Frontend.
```

## Install Dependencies
```npm install```

## Configure Environment Variables
Create a .env file in the root:
```
PORT=5000
DB_HOST=localhost
DB_NAME=your_db_name
DB_USER=your_mysql_user
DB_PASS=your_mysql_password

JWT_SECRET=your_jwt_secret
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret
SIB_API_KEY=your_brevo_api_key
```

## Start the Server
```npm run dev```