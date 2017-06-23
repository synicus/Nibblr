var models = require('../models');
var auth = require('../authentication/helpers.js')

module.exports = {

  events: {
    get: function (req, res) {
      // create a params variable for if event id is specified
      var params = [];
      models.events.get(params, function(err, results) {
        if (err) { /* do something */ }
        res.json(results);
      });
    },
    post: function (req, res) {
      var params = [req.body.name, req.body.event_time, req.body.location, req.body.google_place_id, req.body.description, req.body.creatorID, req.body.address, req.body.category, req.body.photo_url];
      models.events.post(params, function(err, results) {
        console.log('in event post')
        if (err) { console.log('err: ', err) }
        else if (res) { res.sendStatus(201) }  // need this else if for seeding db (there's no res when seeding)
      });
    }
  },

  users: {
    get: function (req, res, callback) {
      // make an array length 1 with user_id in it if specified for params
      var params = [req.body.username];
      models.users.get(params, function(err, results) {
        if (callback) {
          callback(err, results);
        } else {
          res.sendStatus(201);
        }
      });
    },
    post: function (req, res, callback) {
      auth.createHash(req.body.password).then((hashedPass) => {
        var params = [req.body.username, hashedPass];
        models.users.post(params, function(err, results) {
          if (err) {
            res.send('username not available, please choose another');
          } else if (callback) {
            callback(null, results);
          }
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
        else if (res) { res.sendStatus(201) }  // need this else if for seeding db (there's no res when seeding)
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
        if (err || result.length !== 1) {
          /* do something */ console.log('err', result)
          res.sendStatus(400);
        } else {
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
        }

      })
    }
  }
};

// module.exports.users.post({body: {username: 'mike', password: 'abc'}})
// module.exports.users.post({body: {username: 'nate', password: 'abc'}})
// module.exports.users.post({body: {username: 'molly', password: 'abc'}})

// module.exports.login.get({body: {username: 'molly', password: 'abc'}})
// body = obj{} w/ keys: name, event_time, location, google_place_id, description, creatorID, address, category
// module.exports.events.post({body: {name: 'first event', event_time: '2017-07-04 12:30:00', location: 'Home Slice', google_place_id: 'madeupid', description: 'this is a test', creatorID: 1, address: '304 W Mary St', category: 'pizza'}})
