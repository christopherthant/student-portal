const express = require('express');
const request = require('request');
const moment = require('moment');
const fs = require('fs');
const rp = require('request-promise-native');

const jwt = require('jsonwebtoken');
const checkJwt = require('express-jwt');
const cors = require('cors');

const commonUtil = require('./lib/common-util');

function apiRouter() {
  const router = express.Router();

  router.use(cors());

  router.use(
    checkJwt({secret: process.env.JWT_SECRET}).unless({path: '/api/authenticate'})
  );

  router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({error: err.message});
    }
  });

  // API Authenticate call
  router.post('/authenticate', async (req, res) => {
    const user = req.body;
    if (!user.hasOwnProperty('username')) {
      return res.status(401).send('');
    }

    let ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
    const payload = {username: user.username};
    try {
      let data = {
        "TTL": ""
      };
      let SESSION_TIME = process.env.DEFAULT_SESSION_TIME;
      let session = process.env.DEFAULT_SESSION_TIME + process.env.DEFAULT_SESSION_TIME_UNIT;

      let units = {
        "m": "minutes",
        "h": "hours"
      };
      
      if(!data.TTL) {  
        data.TTL = moment.utc().add(SESSION_TIME, units[process.env.DEFAULT_SESSION_TIME_UNIT]).format('MM/DD/YYYY HH:mm:ss');
      }
      let expired = moment(data.TTL, 'MM/DD/YYYY HH:mm:ss');
      let local = moment(user.ttl, 'MM/DD/YYYY HH:mm:ss');
      let minutes = moment.duration(expired.diff(local)).as('minutes');

      if(minutes > 0) {
        session = minutes + process.env.DEFAULT_SESSION_TIME_UNIT;  
        
        let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: session});
        res.send({
          token: token,
          userName: user.username,
          ttl: data.TTL,
          program_id: data.program_id || '',
          instructor_markdown: data.instructor_markdown || '',
          pod_id: data.pod_id || '',
          event_id: data.event_id || '',
          slot: data.slot || '',

        });
      }else {
        return res.status(401).send('');
      }

    } catch (reason) {
      res.status(reason.response.statusCode).send('');
    }
  });

  // API GET /networks
  router.get('/networks', (req, res) => {
    const auth = commonUtil.getAuth(req.headers.authorization);
    let userName = commonUtil.getUserName(req.headers.authorization);

    let data = [{"region" : "N. America (West)"},
                {"region" : "N. America (East)"},
                {"region" : "S. America (West)"},
                {"region" : "S. America (East)"},
                {"region" : "Europe"}];

    res.json(data);
  });

  // API GET /devices
  router.get('/devices', async (req, res) => {
    const auth = commonUtil.getAuth(req.headers.authorization);
    let userName = commonUtil.getUserName(req.headers.authorization);
    const payload = {username: userName};

    try {
      let data = [];

      // get guacamole token
      let url = process.env.GUACAMOLE_URL + 'api/tokens';
      let guacdResponse = await rp.post(url, {form: {"username": process.env.GUACAMOLE_USERNAME, "password": process.env.GUACAMOLE_PASSWORD}});
      guacdResponse = JSON.parse(guacdResponse);
      
      data.push({
        "name": 'nethack',
        "connection": 'ssh',
        "display_name": 'nethack',
        "identifier": 'nethack',
        "connected": false,
        "status": "online",
        "os_action": false,
        "can_clear_line": false,
        "instructor_markdown": false,
        "can_view_device_in_ui": false,
        "can_reboot_device": false,
        "can_save_device_session": false,
        "can_baseline_device": false
      });  

      res.send({
        guacdToken: guacdResponse.authToken,
        devices: data,
        lab_controls: {},
        baseline: {}
      });
    } catch (reason) {
      return res.status(reason.response.statusCode).send('');
    }
  });

  //API GET /sessions
  router.get('/sessions', async(req, res) => {
    return res.status(200).send(''); 
  })

  // API PUT /device
  router.put('/device', async (req, res) => {
    return res.status(200).send('');
  });

  router.get('/availability', async(req, res) => {
    return res.status(200).send('');  
  });

  router.get('/lockstatus/:id', async(req, res) => {
    return res.status(200).send('');  
  });  

  // API PUT /device
  router.put('/control', async (req, res) => {
    return res.status(200).send('');
  });    

  // API PUT /device
  router.get('/status/:id', async (req, res) => {
    return res.status(200).send('');
  }); 

  router.post('/disconnect', async(req, res) => {
    return res.status(204).send('');
  });

  // API GET /file
  router.post('/file', async (req, res) => {
    return res.status(200).send('');
  });  

  return router;
}

module.exports = apiRouter;
