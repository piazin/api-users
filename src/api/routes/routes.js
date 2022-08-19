const UserController = require('../controllers/UserController');

const router = require('express').Router();

router.route('/user').get(UserController.findAll).post(UserController.new).put(UserController.edit);

router.route('/user/:id').delete(UserController.remove);

router.post('/recoverpass', UserController.reset_pass);
router.post('/changepass', UserController.change_password);

module.exports = router;