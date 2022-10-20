const UserController = require('../controllers/UserController');
const multerConfig = require('../../config/multer.config');
const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/auth');

const upload = multer(multerConfig);

router
  .route('/user')
  .get(UserController.findAll)
  .post(auth, UserController.new)
  .put(auth, UserController.edit);

router
  .route('/user/:id')
  .get(auth, UserController.findUser)
  .delete(auth, UserController.remove);

router.post('/recoverpass', UserController.reset_pass);
router.post('/changepass', UserController.change_password);
router.post('/login', UserController.login);
router.post(
  '/upload-profile',
  upload.single('profile-pic'),
  UserController.upload_profile_pic
);

module.exports = router;
