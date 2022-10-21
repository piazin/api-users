const User = require('../services/User');
const Token = require('../services/Token');
const ProfilePic = require('../services/ProfilePic');
const send_email = require('../../utils/send_email');
const { user_err, user_sucess } = require('../../constants');
const config = require('../../config');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  async findAll(req, res) {
    var result = await User.findAll();
    result != undefined
      ? res.status(200).json({
          status: 200,
          results: result.length,
          data: {
            users: result,
          },
        })
      : res.status(404).json({ msg: user_err.err404 });
  }

  async findUser(req, res) {
    var id = req.params.id;

    if (id == undefined)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.invalid_params });

    var result = await User.findByID(id);

    return result.status
      ? res.status(200).json(result.res)
      : res
          .status(404)
          .json({ error: 1, messageError: user_err.user_not_found });
  }

  async new(req, res) {
    var { name, email, password } = req.body;

    //verifica se o email é valido
    if (!email || email.length === 0 || !name)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.email_invalid });

    //verifica se a senha é valida
    if (password == undefined || password.length < 6)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.password_invalid });

    //verifica se já existe este usuário cadastrado
    var user_exits = await User.findEmail(email);
    if (user_exits)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.user_already_registered });

    var user = { name, email, password, role: 0 };
    //executa a solicitação de criação
    var result = await User.create(name, email, password);

    await ProfilePic.upload({}, result.data, true);
    //retorno do status da operção
    result.status
      ? res.status(201).json({ msg: user_sucess.create })
      : res
          .status(500)
          .json({ error: 1, messageError: user_err.failure_create_user });
  }

  async remove(req, res) {
    var id = req.params.id;

    if (id == undefined || isNaN(id))
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.invalid_params });

    var user_exits = await User.findByID(id);
    if (!user_exits.status)
      return res
        .status(406)
        .json({ error: 1, messageError: user_err.user_not_found });

    var result = await User.delete(id);

    result.status
      ? res.status(200).json({ error: 1, messageError: user_sucess.delete })
      : res
          .status(500)
          .json({ error: 1, messageError: user_err.failure_delete_user });
  }

  async edit(req, res) {
    var { id, name, email, role } = req.body;

    var user_exits = await User.findByID(id);
    if (!user_exits.status)
      return res
        .status(404)
        .json({ error: 1, messageError: user_err.user_not_found });

    if (user_exits.res.email == email)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.user_already_registered });

    var exits_email = await User.findEmail(email);
    if (exits_email)
      return res
        .status(404)
        .json({ error: 1, messageError: user_err.user_already_registered });

    var editUser = { id, email };

    if (name != undefined) {
      editUser.name = name;
    }

    if (role != undefined) {
      editUser.role = role;
    }

    var result = await User.update(editUser);

    result.status
      ? res.status(200).json({ msg: user_sucess.update })
      : res
          .status(500)
          .json({ error: 1, messageError: user_err.failure_update_user });
  }

  async reset_pass(req, res) {
    var email = req.body.email;
    if (email == undefined)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.invalid_params });

    var user_exits = await User.findByEmail(email);
    if (!user_exits.status)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.user_not_found });

    var result = await Token.generateToken(user_exits.res.id);

    if (!result.status)
      return res
        .status(500)
        .json({ error: 1, messageError: user_err.failure_generete_token });

    var email_send = await send_email(email, result.token);

    email_send
      ? res.status(200).json({ msg: user_sucess.token, token: result.token })
      : res
          .status(500)
          .json({ error: 1, messageError: user_err.failure_generete_token });
  }

  async change_password(req, res) {
    var { token, password } = req.body;

    if ((token, password == undefined))
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.invalid_params });

    var result = await Token.validate(token);

    if (!result.status)
      return res.status(400).json({ error: 1, messageError: user_err.err404 });

    if (result.token.used)
      return res
        .status(406)
        .json({ error: 1, messageError: user_err.invalid_token });

    var status_change_pass = await User.changePassword(
      result.token.user_id,
      password
    );

    if (!status_change_pass.status)
      return res
        .status(500)
        .json({ error: 1, messageError: user_err.failure_update_user });

    await Token.setTokenUsed(result.token.token);
    res.status(200).json({ msg: user_sucess.update });
  }

  async login(req, res) {
    var { email, password } = req.body;

    if ((email, password) == undefined)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.invalid_params });

    var result = await User.findByEmail(email);

    if (!result.status)
      return res
        .status(404)
        .json({ error: 1, messageError: user_err.user_not_found });

    var decoded = await bcrypt.compare(
      password.toString(),
      result.res.password
    );

    if (!decoded)
      return res
        .status(400)
        .json({ error: 1, messageError: user_err.password_invalid });

    var token = jwt.sign(
      { user: result.res.email, role: result.res.role },
      config.secret,
      {
        expiresIn: '1h',
      }
    );

    res.status(201).json({ msg: user_sucess.token, token: token });
  }

  async upload_profile_pic(req, res) {
    if (!req.file)
      return res.status(400).json({
        msg: 'bad request',
      });

    const result = await ProfilePic.upload(req.file, req.body.user_id, false);

    !result.status
      ? res.status(400).json({ msg: 'Bad request' })
      : res.status(200).json({ msg: 'upload sucess' });
  }
}

module.exports = new UserController();
