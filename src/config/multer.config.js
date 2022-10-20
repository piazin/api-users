const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadFolder = path.resolve('upload');

module.exports = {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(req, file, cb) {
      const uuidFile = crypto.randomUUID();
      const filename = `${uuidFile}-${file.originalname}`;

      cb(null, filename);
    },
  }),
};
