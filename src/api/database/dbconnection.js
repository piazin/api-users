const {database} = require('../../config');

const knex = require('knex').knex({
    client: "mysql2",
    connection: {
        host: database.host,
        database: database.name,
        user: database.user,
        password: database.password
    }
});

module.exports = knex;