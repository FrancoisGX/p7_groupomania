const models = require("../models");
const asyncLib = require ('async');
const jwtUtils = require('../utils/jwt.utils');



exports.createMessage = (req, res, next) => {

    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    var title = req.body.title;
    var content = req.body.content;

    if (title == null || content == null){
        return res.status(400).json({ 'error' : 'missing parameters'});
    }

    asyncLib.waterfall([
        function(done){
            models.User.findOne({
                attributes: ['id', 'email', 'username'],
                where: {id: userId}
            })
            .then(function(userFound){
                done(null, userFound);
            })
            .catch(function(err){
                return res.status(500).json({ 'error': 'unable to verify user'})
            });
        },
        function(userFound){
           if(userFound){
                models.Message.create({
                    title : title,
                    content : content,
                    UserId: userFound.id,  
                })
                .then(function (newMessage){
                    res.status(200).json({...newMessage.dataValues, User:{userFound}})
                }).catch((err) => {
                    res.status(500).json(err)
                })
           }else {
                res.status(404).json({'error': 'user not found'})
            }
        }
    ], function(newMessage){
        if(newMessage) {
            return res.status(201).json({ newMessage});
        }else {
            return res.status(500).json({ 'error': 'cannot post message' })
        }
    });
};

exports.listMessages = (req, res, next) => {
    var fields = req.body.fields;
    var limit = parseInt(req.body.limit);
    var offset = parseInt(req.body.offset);
    var order = req.body.order;

    models.Message.findAll({
        order: [(order !=null) ? order.split(':') : ['updatedAt', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include : [{
            model: models.User,
            attributes: [ 'username'],
        }],
    }).then(function(messages){
        if(messages){
            res.status(200).json(messages);
        }else {
            res.status(404).json({'error' : 'no messages found'});
        }
    }).catch(function(err){
        console.log(err);
        res.status(500).json({ 'error' : 'invalid fields'})
    });
};

exports.updateUserMessage = (req, res) => {

    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    var content = req.body.content;
    var title = req.body.title;

    asyncLib.waterfall([
        function(done){
            models.User.findOne({
                attributes: ['id', 'email', 'username'],
                where: {id: userId}
            })
            .then(function(userFound){
                done(null, userFound);
            })
            .catch(function(err){
                return res.status(500).json({ 'error': 'unable to verify user'})
            });
        },
      function(userFound,done) {
        if(userFound){
            models.Message.findOne({
            attributes: ['id', 'title','content'],
            where: { id: req.params.id }
            }).then(function (messageFound) {
            done(null, messageFound);
            })
            .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to found message' });
            });
        }else {
            res.status(404).json({'error': 'user not found'})
        }
      },
      function(messageFound, done) {
        if(messageFound) {
            messageFound.update({
                content: (content ? content : messageFound.content),
                title: (title ? title : messageFound.title)
          }).then(function() {
            done(messageFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update message content' });
          });
        } else {
          res.status(404).json({ 'error': 'message not found' });
        }
      },
    ], function(messageFound) {
      if (messageFound) {
        return res.status(201).json(messageFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update user message' });
      }
    });
}


exports.deleteMessage = async (req, res) => {
    var headerAuth  = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
	try {
        const userFound = await models.User.findOne({
            attributes: ['id','isAdmin'],
            where: {id: userId}
        })

		const message = await models.Message.findOne({
			where: { id: req.params.id }
		});

        if (!userFound) {
			throw new Error("unable to verify user' ");
		}

		if (!message) {
			throw new Error("Sorry,your post doesn't exist ");
		}

        if(message && userFound && (userFound.id==message.UserId || userFound.isAdmin==true)){
		  await models.Message.destroy({
			where: { id: req.params.id }
		})
        return res.status(200).json({ message: "Post has been deleted " });
        }else{
            throw new Error("You are not allowed to delete this message ")
        }
	} catch (error) {
		res.status(400).json({ message: "You are not allowed to delete this message"});
	}
};

