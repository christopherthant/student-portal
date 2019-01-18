const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const createExpressApp = require('./create-express-app');

require('dotenv').config();

createExpressApp()
	.listen(1337, () => {
  	console.log('listening on port 1337...');
});


