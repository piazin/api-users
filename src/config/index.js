require('dotenv').config();

module.exports = {
    database: {
        name: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    },
    port: process.env.PORT
}