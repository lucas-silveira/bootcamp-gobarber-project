import Sequelize from 'sequelize'
import mongoose from 'mongoose'
import User from '../app/models/UserModel'
import File from '../app/models/FileModel'
import Appointment from '../app/models/AppointmentModel'
import databaseConfig from '../config/database'

const models = [User, File, Appointment]

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig)
    this.init()
    this.mongo()
  }

  init() {
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      {useNewUrlParser: true, useFindAndModify: true}
    )
  }
}

export default new Database()
