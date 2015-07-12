var db = require('../db/db');
var config = require('../config');
var rss = require('rss');
var _ = require('lodash');

var typeMap = {
  application: 'App',
  scope: 'Scope',
  webapp: 'Web App',
  snappy: 'Snappy App',
};

function type(types) {
  var t = 'application';
  if (types.indexOf('application') > -1) {
    t = 'application';
  }
  else if (types.indexOf('webapp') > -1) {
    t = 'webapp';
  }
  else if (types.length > 0) {
    t = types[0];
  }

  return typeMap[t];
}

function generateNewFeed(callback) {
  var feed = new rss({
    title:       'uApp Explorer New Apps',
    description: 'New apps in uApp Explorer',
    feed_url:    config.server.host + '/api/rss/new-apps.xml',
    site_url:    config.server.host,
    image_url:   config.server.host + '/img/app-logo.png',
    ttl:         240 //4 hours
  });

  var query = db.Package.find();
  query.limit(10);
  query.sort('-published_date');
  query.exec(function(err, pkgs) {
    if (err) {
      callback(err);
    }
    else {
      _.forEach(pkgs, function(pkg) {
        feed.item({
          title:       'New ' + type(pkg.types) + ': ' + pkg.title,
          url:         config.server.host + '/app/' + pkg.name,
          description: '<a href="' + config.server.host + '/app/' + pkg.name +
                       '"><img src="' + config.server.host + '/api/icon/' +
                       pkg.name + '.png" /></a><br/>' + pkg.description,
          author:      pkg.author,
          date:        pkg.last_updated,
        });
      });

      callback(null, feed.xml({indent: true}));
    }
  });
}

function generateUpdatesFeed(callback) {
  var feed = new rss({
    title:       'uApp Explorer Updated Apps',
    description: 'Updated apps in uApp Explorer',
    feed_url:    config.server.host + '/api/rss/updated-apps.xml',
    site_url:    config.server.host,
    image_url:   config.server.host + '/img/app-logo.png',
    ttl:         240 //4 hours
  });

  var query = db.Package.find();
  query.limit(10);
  query.sort('-last_updated');
  query.exec(function(err, pkgs) {
    if (err) {
      callback(err);
    }
    else {
      _.forEach(pkgs, function(pkg) {
        feed.item({
          title:       type(pkg.types) + ': ' + pkg.title,
          url:         config.server.host + '/app/' + pkg.name,
          description: '<a href="' + config.server.host + '/app/' + pkg.name +
                       '"><img src="' + config.server.host + '/api/icon/' +
                       pkg.name + '.png" /></a><br/><br/>' +
                       pkg.changelog.replace('\n', '<br/>'),
          author:      pkg.author,
          date:        pkg.last_updated,
        });
      });

      callback(null, feed.xml({indent: true}));
    }
  });
}

function setup(app, success, error) {
  app.get('/api/rss/new-apps.xml', function(req, res) {
    generateNewFeed(function(err, f) {
      if (err) {
        error(res, err);
      }
      else {
        res.header('Content-Type', 'text/xml');
        res.send(f);
      }
    });
  });

  app.get('/api/rss/updated-apps.xml', function(req, res) {
    generateUpdatesFeed(function(err, f) {
      if (err) {
        error(res, err);
      }
      else {
        res.header('Content-Type', 'text/xml');
        res.send(f);
      }
    });
  });
}

exports.setup = setup;
