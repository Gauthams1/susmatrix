var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
data:{type:String,index: true,unique: true },
matrix:{type:String},
number:{type:Number},
type:{type:String}
});

var User = module.exports = mongoose.model('Data', UserSchema);
