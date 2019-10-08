"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _UserModel = require('../app/models/UserModel'); var _UserModel2 = _interopRequireDefault(_UserModel);
var _FileModel = require('../app/models/FileModel'); var _FileModel2 = _interopRequireDefault(_FileModel);
var _AppointmentModel = require('../app/models/AppointmentModel'); var _AppointmentModel2 = _interopRequireDefault(_AppointmentModel);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

const models = [_UserModel2.default, _FileModel2.default, _AppointmentModel2.default]

class Database {
  constructor() {
    this.connection = new (0, _sequelize2.default)(_database2.default)
    this.init()
    this.mongo()
  }

  init() {
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }

  mongo() {
    this.mongoConnection = _mongoose2.default.connect(
      process.env.MONGO_URL,
      {useNewUrlParser: true, useFindAndModify: true}
    )
  }
}

exports. default = new Database()
