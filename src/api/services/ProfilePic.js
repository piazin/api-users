const knex = require('../database/dbconnection');

class ProfilePic {
  async upload(fileInfo, user_id) {
    console.log(fileInfo);
    try {
      await knex.from('profile_pic').insert({
        originalname: fileInfo.originalname,
        filename: fileInfo.filename,
        path: fileInfo.path,
        user_id,
      });
      return { status: true };
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  }
}

module.exports = new ProfilePic();
