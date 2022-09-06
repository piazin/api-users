require('dotenv').config();

module.exports = {
  database: {
    name: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },

  email: {
    u: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  port: process.env.PORT,
  secret: process.env.SECRET,
};
