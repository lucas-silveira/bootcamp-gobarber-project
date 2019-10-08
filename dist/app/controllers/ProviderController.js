"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _UserModel = require('../models/UserModel'); var _UserModel2 = _interopRequireDefault(_UserModel);
var _FileModel = require('../models/FileModel'); var _FileModel2 = _interopRequireDefault(_FileModel);

class ProviderController {
  async index(req, res) {
    const providers = await _UserModel2.default.findAll({
      where: {provider: true},
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [{
        model: _FileModel2.default,
        as: 'avatar',
        attributes: ['name', 'path', 'url']
      }]
    })

    return res.json(providers)
  }
}

exports. default = new ProviderController()
