"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _FileModel = require('../models/FileModel'); var _FileModel2 = _interopRequireDefault(_FileModel);

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file

    const file = await _FileModel2.default.create({
      name,
      path
    })

    return res.json(file)
  }
}

exports. default = new FileController()
