var spider = require('./spider/spider');

function callback(err) {
  if (err) {
    process.exit(1);
  }

  process.exit(0);
}

if (process.argv[2]) {
  if (process.argv[2] == 'update' || process.argv[2] == 'updates') {
    spider.parsePackageUpdates(callback);
  }
  else if (process.argv[2] == 'department' || process.argv[2] == 'departments') {
    spider.parseDepartments(callback);
  }
  else if (process.argv[2] == 'review' || process.argv[2] == 'reviews') {
    if (process.argv[3] == 'bayesian') {
      spider.calculateBayesianAverages(callback);
    }
    else if (process.argv[3] == 'refresh') {
      spider.refreshRatings(callback);
    }
    else {
      spider.parseReviews(process.argv[3], callback);
    }
  }
  else if (process.argv[2] == 'type' || process.argv[2] == 'types') {
    if (process.argv[3]) {
      spider.parseClickPackageByName(process.argv[3], callback);
    }
    else {
      spider.parseAllClickPackages(callback);
    }
  }
  else {
    spider.parsePackage(process.argv[2], callback);
  }
}
else {
  spider.parsePackages(callback);
}
