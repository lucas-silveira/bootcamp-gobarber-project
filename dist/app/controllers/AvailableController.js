"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});







var _datefns = require('date-fns');
var _sequelize = require('sequelize');
var _AppointmentModel = require('../models/AppointmentModel'); var _AppointmentModel2 = _interopRequireDefault(_AppointmentModel);

class AvailableController {
  async index(req, res) {
    const { date } = req.query

    if (!date)
      return res.status(400).json({ error: 'Invalid date' })

    const searchDate = Number(date)

    const appointments = await _AppointmentModel2.default.findAll({
      where: {
        provider_id: req.params.id,
        canceled_at: null,
        date: {
          [_sequelize.Op.between]: [_datefns.startOfDay.call(void 0, searchDate), _datefns.endOfDay.call(void 0, searchDate)]
        }
      },
      order: ['date']
    })

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00'
    ]

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = _datefns.setSeconds.call(void 0, _datefns.setMinutes.call(void 0, _datefns.setHours.call(void 0, searchDate, hour), minute), 0)

      return {
        time,
        value: _datefns.format.call(void 0, value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available: _datefns.isAfter.call(void 0, value, new Date()) &&
          !appointments.find(apptm => _datefns.format.call(void 0, apptm.date, 'HH:mm') == time)
      }
    })

    return res.json(available)
  }
}

exports. default = new AvailableController()
