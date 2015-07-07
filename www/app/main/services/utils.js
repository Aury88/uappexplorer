'use strict';

angular.module('appstore').factory('utils', function($filter, $timeout, $location) {
  var url = $location.protocol() + '://' + $location.host() + '/';
  if ($location.port() != 80 && $location.port() != 443) {
    url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/';
  }

  return {
    strToColor: function(str, css) { //Adapted from http://stackoverflow.com/a/16348977
      str = str ? str : '';

      var hash = 0;
      for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      var color = '#';
      for (var j = 0; j < 3; j++) {
          var v = (hash >> (j * 8)) & 0xFF;
          color += ('00' + v.toString(16)).substr(-2);
      }

      var value = color;
      if (css) {
        value = {};
        value[css] = color;
      }

      return value;
    },

    isFree: function(prices) {
      return ($filter('dollars')(prices) == 'Free');
    },

    loading: function($scope) {
      $scope.can_load = true;
      $scope.loading = false;
      $timeout(function() {
        if ($scope.can_load) {
          $scope.loading = true;
        }
      }, 250); //0.25 seconds
    },

    doneLoading: function($scope) {
      $scope.can_load = false;
      $scope.loading = false;
    },

    appIcon: function(app) {
      var icon = '';
      if (app) {
        icon = url + 'api/icon/' + app.icon_hash + '/' + app.name + '.png';
        /*if (app.cloudinary_url) {
          icon = app.cloudinary_url.replace('image/upload/', 'image/upload/c_scale,w_92/');
        }*/
      }

      return icon;
    },

    sorts: [
      {
        label: 'Most Relevant',
        value: 'relevance',
      },
      {
        label: 'Title A-Z',
        value: 'title'
      }, {
        label: 'Title Z-A',
        value: '-title'
      }, {
        label: 'Newest ',
        value: '-published_date'
      }, {
        label: 'Oldest',
        value: 'published_date'
      }, {
        label: 'Latest Update',
        value: '-last_updated'
      }, {
        label: 'Oldest Update',
        value: 'last_updated'
      }, {
        label: 'Highest Heart Rating',
        value: '-points'
      }, {
        label: 'Lowest Heart Rating',
        value: 'points'
      }, {
        label: 'Highest Star Rating',
        value: '-bayesian_average'
      }, {
        label: 'Lowest Star Rating',
        value: 'bayesian_average'
      }, {
        label: 'Free',
        value: 'prices.USD'
      }, {
        label: 'Most Expensive (USD)',
        value: '-prices.USD'
      },
    ]
  };
});
