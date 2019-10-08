"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _UserModel = require('../models/UserModel'); var _UserModel2 = _interopRequireDefault(_UserModel);
var _Notification = require('../schemas/Notification'); var _Notification2 = _interopRequireDefault(_Notification);

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await _UserModel2.default.findOne({
      where: {id: req.userId, provider: true}
    })

    if (!checkIsProvider)
      return res.status(401).json({ error: 'Only provider can load notifications' })

    const notifications = await _Notification2.default.find({
      user: req.userId
    }).sort({ createdAt: 'desc' }).limit(20)

    return res.json(notifications)
  }

  async update(req, res) {
    const notification = await _Notification2.default.findByIdAndUpdate(
      req.params.id,
      {read: true},
      {new: true} //Retorna o novo registro atualizado
    )

    return res.json(notification)
  }
}

exports. default = new NotificationController()
