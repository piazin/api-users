const knex = require('../database/dbconnection');

class ProfilePic {
  async upload(fileInfo, user_id, isNew) {
    try {
      if (isNew) {
        await knex.from('profile_pic').insert({
          originalname: fileInfo.originalname,
          filename: fileInfo.filename,
          path: fileInfo.path,
          user_id,
        });
      } else {
        await knex
          .from('profile_pic')
          .update({
            originalname: fileInfo.originalname,
            filename: fileInfo.filename,
            path: fileInfo.path,
            user_id,
          })
          .where({ user_id: user_id });
      }

      return { status: true };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }
}

module.exports = new ProfilePic();
