var models = require('../models');
var auth = require('../authentication/helpers.js')

module.exports = {

  events: {
    get: function (req, res) {
      // create a params variable for if event id is specified
      var params = [];
      models.messages.get(params, function(err, results) {
        if (err) { /* do something */ }
        res.json(results);
      });
    },
    post: function (req, res) {
      var params = [req.body.name, req.body.event_time, req.body.location, req.body.google_place_id, req.body.description, req.body.creatorID, req.body.address, req.body.category];
      models.messages.post(params, function(err, results) {
        if (err) { /* do something */ }
        res.sendStatus(201);
      });
    }
  },

  users: {
    get: function (req, res) {
      // make an array length 1 with user_id in it if specified for params
      var params = [];
      models.users.get(params, function(err, results) {
        if (err) { /* do something */ }
        res.json(results);
      });
    },
    post: function (req, res) {
      auth.createHash(req.body.password).then((hashedPass) => {
        var params = [req.body.username, hashedPass];
        models.users.post(params, function(err, results) {
          if (err) { /* do something */ }
          res.sendStatus(201);
        });
      });
    }
  },
  rsvp: {
    getByUser: function(req, res) {
      var params = [req.query.id];
      models.rsvp.getByUser(params, function(err, results) {
        if (err) { /* do something */ }
        res.json(results);
      })
    },
    getByEvent: function(req, res) {
      var params = [req.query.id];
      models.rsvp.getByEvent(params, function(err, results) {
        if (err) { /* do something */ }
        res.json(results);
      })
    },
    post: function(req, res) {
      var params = [req.body.user_id, req.body.event_id];
      models.rsvp.post(params, function(err, results) {
        if (err) { /* do something */ }
        res.sendStatus(201);
      })
    },
    delete: function(params, callback) {
      var params = [req.query.event_id, req.query.user_id];
      models.rsvp.delete(params, function(err, results) {
        if (err) { /* do something */ }
        res.sendStatus(201);
      })
    }
  },
  login: {
    get: function(req, res, callback){
      var params = [req.body.username];
      models.login.get(params, function(err, result) {
        if (err || result.length !== 1) { /* do something */ }
        var hash = result[0].password;
        auth.comparePasswords(req.body.password, hash).then((bool) => {
          if (!bool) {
            callback(false)
            res.sendStatus(400);
          } else {
            callback(result);
            res.sendStatus(201);
          }
        });
      })
    }
  }
};

// module.exports.users.post({body: {username: 'mike', password: 'abc'}})
// module.exports.users.post({body: {username: 'nate', password: 'abc'}})
// module.exports.users.post({body: {username: 'molly', password: 'abc'}})

// module.exports.login.get({body: {username: 'molly', password: 'abc'}})
