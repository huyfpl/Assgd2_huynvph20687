var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quanaoSchema = new Schema({
  tenquanao: {
    type: String,
    required: true
  },
  soluong: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('quanao', quanaoSchema);
