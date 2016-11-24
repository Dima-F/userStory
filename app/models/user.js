var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userSchema = mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String, required:true, index:{unique:true}},
    password:{type:String, required:true, select:false}
});

userSchema.pre('save',function (next) {
    var user = this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.hash(user.password,null,null,function (err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function (pass) {
    var user = this;
    return bcrypt.compareSync(pass,user.password);
};

module.exports = mongoose.model("User",userSchema);