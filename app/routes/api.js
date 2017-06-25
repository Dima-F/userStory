var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;

function createToken(user) {
    return jsonwebtoken.sign({
        id:user._id,
        name:user.name,
        username:user.username
    },secretKey);
}

module.exports = function (app, express, io) {

    var api = express.Router();

    api.get('/all-stories',function (req, res) {
        Story.find({},function (err, stories) {
            if(err){
                res.send(err);
            }
            else {
                res.json(stories);
            }
        })
    });

    api.post('/signup',function (req, res) {
        var user = new User({
            name:req.body.name,//body parser in action!
            username:req.body.username,
            password:req.body.password
        });
        user.save(function (err) {
            if(err){
                res.send(err);//todo:why send error to client???
            } else {
                var token = createToken(user);
                res.json({
                    success: true,
                    message:'User has been created!',
                    token:token
                });

            }
        });
    });

    api.get('/users',function (req, res) {
        User.find({},function (err, users) {
            if(err){
                res.send(err);
            } else {
                res.json(users);
            }
        });
    });

    api.post('/login',function (req, res) {
        User.findOne({username:req.body.username}).select('name username password').exec(function (err, user) {
            if(err) throw err;
            if(!user){
                res.json({message:'User doesnt exist'});
            } else {
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                    res.json({message:'Wrong password!'});
                } else {
                    //tokens...
                    var token = createToken(user);
                    res.json({
                        success:true,
                        message:'Successfully login!',
                        token:token
                    });
                }
            }
        });
    });

    //authorize middleware...
    api.use(function (req, res, next) {
        console.log('somebody jast come to your app!');
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if (token) {
            jsonwebtoken.verify(token,secretKey,function (err, decoded) {
                if(err){
                    res.json({
                        success:false,
                        message:'Failed to authenticate user!'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            res.json({
                success:false,
                message:'Token is not provided!'
            });
        }
    });

    //this is destination for verified users!

    api.route('/')
        .post(function (req, res) {
            var story = new Story({
                creator:req.decoded.id,
                content:req.body.content
            });
            story.save(function (err,newStory) {
                if(err){
                    res.send(err);
                } else {
                    io.emit('story',newStory);
                    res.send({message:'New story successfully created!'});
                }
            });
        })
        .get(function (req, res) {
            Story.find({creator:req.decoded.id},function (err,stories) {
                if(err){
                    res.send(err);
                } else {
                    res.json(stories)
                }
            })
        });

    api.get('/me',function (req, res) {
        res.json(req.decoded);
    });

    return api;
};