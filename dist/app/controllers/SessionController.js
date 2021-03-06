"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _UserModel = require('../models/UserModel'); var _UserModel2 = _interopRequireDefault(_UserModel);
var _FileModel = require('../models/FileModel'); var _FileModel2 = _interopRequireDefault(_FileModel);
var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    })

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' })

    const { email, password } = req.body

    const user = await _UserModel2.default.findOne({
      where: {email},
      include: [
        {
          model: _FileModel2.default,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    })

    if (!user)
      return res.status(401).json({ error: 'User not found' })

    if(!(await user.checkPassword(password)))
      return res.status(401).json({ error: 'Password does not match' })

    const { id, name, avatar, provider } = user

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar
      },
      token: _jsonwebtoken2.default.sign({ id }, _auth2.default.secret, {
        expiresIn: _auth2.default.expiresIn
      })
    })
  }
}

exports. default = new SessionController()
