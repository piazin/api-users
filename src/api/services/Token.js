const knex = require('../database/dbconnection');

class Token {
  async generateToken(id) {
    try {
      var token = Date.now();

      await knex
        .insert({
          token: token,
          used: 0,
          user_id: id,
        })
        .from('recovery_tokens');

      return { status: true, token: token };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  async validate(token) {
    try {
      var res = await knex
        .select()
        .from('recovery_tokens')
        .where({ token: token });
      return res.length > 0
        ? { status: true, token: res[0] }
        : { status: false };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }

  async setTokenUsed(token) {
    try {
      await knex
        .update({ used: 1 })
        .from('recovery_tokens')
        .where({ token: token });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Token();
