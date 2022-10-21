const knex = require('../database/dbconnection');
const bcrypt = require('bcrypt');

class User {
  async create(name, email, password) {
    try {
      var hash = bcrypt.hashSync(password.toString(), 10);
      var result = await knex
        .insert({ name, email, password: hash, role: 0 })
        .from('user');
      return { status: true, data: result[0] };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  async update(user) {
    try {
      var id = user.id;

      await knex.update(user).from('user').where({ id: id });
      return { status: true };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  async delete(id) {
    try {
      await knex.delete().from('user').where({ id: id });
      return { status: true };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  async changePassword(id, password) {
    try {
      var hash = await bcrypt.hash(password.toString(), 10);

      await knex.update({ password: hash }).from('user').where({ id: id });
      return { status: true };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  async findAll() {
    try {
      var res = await knex
        .select('*')
        .join('profile_pic', 'user.id', '=', 'profile_pic.user_id')
        .from('user');

      console.log(res);
      const users = [];

      res.forEach(({ id, name, email, role, originalName, filename, path }) => {
        const user = {
          id,
          name,
          email,
          role,
          profile_pic: {
            originalName,
            filename,
            path,
          },
        };

        users.push(user);
      });

      return users.length > 0 ? users : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async findByEmail(email) {
    try {
      var res = await knex.select().from('user').where({ email: email });
      if (res != undefined) {
        return res.length > 0
          ? { status: true, res: res[0] }
          : { status: false };
      } else {
        return { status: false };
      }
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  async findByID(id) {
    try {
      var res = await knex.select().from('user').where({ id: id });
      return res.length > 0 ? { status: true, res: res[0] } : { status: false };
    } catch (error) {
      return { status: false };
    }
  }

  async findEmail(email) {
    try {
      //res retorna um array de usuários
      var res = await knex.select().from('user').where({ email: email });
      return res.length > 0 ? true : false;
    } catch (error) {
      return undefined;
    }
  }
}

module.exports = new User();
