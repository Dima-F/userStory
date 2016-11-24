var mongoose = require('../myMongoose');
var bandSchema = new mongoose.Schema({
    bid:{type:Number, index:true, min:1, unique:true},
    name:{type:String},
    state:{type:String, default:'uk'},
    members:[{aid:Number, name:String}]
});
bandSchema.path("name").set(function (name) {
    return name.charAt(0).toUpperCase()+name.slice(1);
});
exports.Band = mongoose.model("Band", bandSchema);
