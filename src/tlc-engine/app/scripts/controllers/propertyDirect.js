'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:ClientSummaryCtrl
 * @description
 * # ClientSummaryCtrl
 * Controller of the tlcengineApp
 */
angular.module('tlcengineApp')
  .controller('PropertyDirectCtrl', ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope',
    '$window', 'bookmarkService', 'aaNotify', 'appAuth',
    function ($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, $window, bookmarkService, aaNotify, appAuth) {

      $scope.init = function () {
        generateSearchUI();
      }

      $scope.init();

    }]);
