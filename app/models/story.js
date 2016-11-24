var mongoose = require('mongoose');
var storySchema = mongoose.Schema({
    creator:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    content:{type:String},
    created:{type:Date,  default: Date.now}
});
module.exports = mongoose.model("Story",storySchema);
