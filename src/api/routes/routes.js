const UserController = require('../controllers/UserController');
const router = require('express').Router();
const auth = require('../middleware/auth');

router
  .route('/user')
  .get(auth, UserController.findAll)
  .post(auth, UserController.new)
  .put(auth, UserController.edit);

router
  .route('/user/:id')
  .get(auth, UserController.findUser)
  .delete(auth, UserController.remove);

router.post('/recoverpass', UserController.reset_pass);
router.post('/changepass', UserController.change_password);
router.post('/login', UserController.login);

module.exports = router;
