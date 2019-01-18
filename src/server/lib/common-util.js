const jwt = require('jsonwebtoken');

module.exports = {
	// Get authorization header
	getAuth(authHeader) {
		var bearerToken = authHeader.split(' ');
		var jwtToken = bearerToken[1];
		if(jwtToken) {
			var decodedToken = jwt.decode(jwtToken);
			return "Basic " + new Buffer( decodedToken.username + ':').toString("base64");
		} else {
			res.status(401);
		}
	},
	getUserName(authHeader) {
		var bearerToken = authHeader.split(' ');
		var jwtToken = bearerToken[1];
		if(jwtToken) {
			var decodedToken = jwt.decode(jwtToken);
			return decodedToken.username;
		} else {
			res.status(401);
		}
	}	
}

//exports.getAuth = getAuth;