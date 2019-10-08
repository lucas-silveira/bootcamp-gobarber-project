"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _UserModel = require('../models/UserModel'); var _UserModel2 = _interopRequireDefault(_UserModel);
var _FileModel = require('../models/FileModel'); var _FileModel2 = _interopRequireDefault(_FileModel);

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required()
    })

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' })

    const userExists = await _UserModel2.default.findOne({ where: {email: req.body.email} })

    if (userExists)
      return res.status(400).json({ error: 'User already exists.' })
    const { id, name, email, provider } = await _UserModel2.default.create(req.body)

    return res.json({
      id,
      name,
      email,
      provider
    })
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    })

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' })

    const { email, oldPassword } = req.body

    const user =  await _UserModel2.default.findByPk(req.userId)

    if (email != user.email) {
      const userExists = await _UserModel2.default.findOne({ where: {email} })

      if (userExists)
       return res.status(400).json({ error: 'User already exists.' })
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res.status(401).json({ error: 'Password does not match'})

    await user.update(req.body)

    const { id, name, avatar } = await _UserModel2.default.findByPk(req.userId, {
      include: [
        {
          model: _FileModel2.default,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    })

    return res.json({
      id,
      name,
      email,
      avatar
    })
  }
}

exports. default = new UserController()
