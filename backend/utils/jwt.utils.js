const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'sdfhfgytiopbsd41974561qfsg1g4u8g4y1gbjl484p84oo98u4r984t68a41d32qs1c32s1g64dfg1y6';

module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '24h'
        })
    },

    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },

    getUserId: function(authorization){
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if (token != null) {
            try{
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken !=null)
                    userId = jwtToken.userId;
            } catch (err){}
        }
        return userId;
    }
}