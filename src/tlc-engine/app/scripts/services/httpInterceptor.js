'use strict';
angular.module('tlcengineApp')
  .factory('httpInterceptorService', ['$q', '$injector','$location', 'localStorageService','appAuth',
  function ($q, $injector,$location, localStorageService,appAuth) {

  var httpInterceptorServiceFactory = {};

  var _request = function (config) {
    config.headers = config.headers || {};
    var authData = localStorageService.get('authorizationData') || localStorageService.get('basicsettings');
    if (authData) {
      config.headers.Authorization = 'bearer ' + authData.AccessToken;
      //config.headers.Authorization = 'bearer ' + authData.AccessToken;
    }

    /*config.headers["Access-Control-Allow-Origin"] = '*';
    config.headers["Access-Control-Allow-Methods"] = 'POST, GET, OPTIONS, PUT';
    config.headers["Content-Type"] = 'application/json';
    config.headers["Accept"] = 'application/json';*/

    return config;
  }

  var _responseError = function (rejection) {
    //$state.go('agentLogin', { returnUrl: $location.url() });

    if (rejection.status === 401) {
      /*var authService = $injector.get('authService');
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        if (authData.useRefreshTokens) {
          $location.path('/refresh');
          return $q.reject(rejection);
        }
      }*/
      //localStorageService.remove('authorizationData');
      //console.log('/agent/Login?returnUrl=' + $location.path());
      /*var uri = '/#/agent/Login?returnUrl=' + $location.path();
      var res = encodeURI(uri);
      //$location.path('/agent/Login');
      window.location = res;*/

      appAuth.logout(true);
      //appAuth.saveAttemptUrl();
      //$location.path('/agents/Login');
    }
    return $q.reject(rejection);
  }

  httpInterceptorServiceFactory.request = _request;
  httpInterceptorServiceFactory.responseError = _responseError;
  return httpInterceptorServiceFactory;
}]);
