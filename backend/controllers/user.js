const bcrypt = require('bcrypt');
const models = require("../models");
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require ('async');

const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


exports.signup = (req, res, next) => {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var bio = req.body.bio;

    if (email == null || username == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters'});
    }

    if (username.length >= 13 || username.length <= 4) {
        return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
    }
  
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'email is not valid' });
    }

    models.User.findOne({
        attributes: ['email'],
        where: {email: email}
    })
    .then(function(userFound) {
        if(!userFound) {
            bcrypt.hash(password,10, function(err, bcryptedPassword){
               var newUser = models.User.create({
                   email:email,
                   username:username,
                   password: bcryptedPassword,
                   bio:bio,
                   isAdmin:0
               })
               return newUser
               .then(function(newUser){
                   return res.status(201).json({
                       'userId': newUser.id
                   })
               })
               .catch(function(err){
                   return res.status(500).json({ 'error' : 'cannot add user'});
               })
            })
        }else{
            return res.status(409).json({ 'error': 'user already exist'});
        }
    })
    .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user'});
    });


};


exports.login = (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    if (email == null || password == null) {
        res.status(400).json({ error: 'Il manque un paramètre' })
    }

    models.User.findOne({
        where: {email:email}
    })
    .then(function(userFound){
        if (userFound){
            bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                if (resBycrypt){
                    return res.status(200).json ({
                        'userId': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
                    });
                }else{
                    return res.status(403).json({ 'error': 'invalid password'})
                }
            })
        }else{
            return res.status(404).json({ 'error': 'user not exist in DB'})
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user'})
    });
   
};

exports.getUserProfile = (req, res) => {

    var headerAuth  = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
        return res.status(400).json({ 'error': 'wrong token'})

    models.User.findOne({
        attributes: ['id', 'email', 'username','bio','isAdmin'],
        where: {id: userId}
    }).then(function(user){
        if (user) {
            res.status(201).json(user);
        }else{
            res.status(404).json({'error': 'user not found'});
        }
    }).catch(function(err){
        res.status(404).json({'error': 'cannot found user'});
    })
}

exports.updateUserProfile = (req, res) => {

    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);


    var bio = req.body.bio;

    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          attributes: ['id', 'bio'],
          where: { id: userId }
        }).then(function (userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if(userFound) {
          userFound.update({
            bio: (bio ? bio : userFound.bio)
          }).then(function() {
            done(userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user' });
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update user profile' });
      }
    });
}

exports.deleteUser = async (req, res) => {
    var headerAuth  = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
	try {
        const userLog = await models.User.findOne({
            attributes: ['id','isAdmin'],
            where: {id: userId}
        })

		const userfound = await models.User.findOne({
			where: { id: req.params.id }
		});

        if (!userLog) {
			throw new Error("unable to verify user");
		}

		if (!userfound) {
			throw new Error("Sorry,this profil doesn't exist");
		}

        if(userfound.id == userLog.id || userLog.isAdmin == true){
		  await models.User.destroy({
			where: { id: req.params.id }
		})
        return res.status(200).json({ message: "Profil has been deleted " });
        }else{
            throw new Error("Sorry,something gone wrong,please try again later")
        }
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};