'use strict';
angular.module('tlcengineApp').value('redirectToUrlAfterLogin', { url: '/' });

angular.module('tlcengineApp').factory('appAuth', function ($location, redirectToUrlAfterLogin,localStorageService,$injector,$rootScope) {
  var authServiceFactory = {};

  var _isLoggedIn = function() {
      if(localStorageService.get('authorizationData') == null) {
        var settings = localStorageService.get('settings');
        if(!settings) {
          var basicsettings = localStorageService.get('basicsettings');
          if(!basicsettings) {
            var propertiesService = $injector.get("propertiesService");
            propertiesService.getBasicSettings({},
              function (success) {
                var DefaultClientAccessToken = _.find(success.Settings, function (o) {
                  return o.SettingTitle == 'ClientAccessToken'
                });
                if (DefaultClientAccessToken) {
                  basicsettings = {};
                  basicsettings.AccessToken = DefaultClientAccessToken.Value;
                  localStorageService.set('basicsettings', basicsettings);
                  return {
                    "Audience": {"Id": getAgentId()},
                    "AudienceType": "AnonymousUser",
                    "AccessToken": basicsettings.AccessToken || ''
                  };
                }
                else {
                  return {
                    "Audience": {"Id": getAgentId()},
                    "AudienceType": "AnonymousUser",
                    "AccessToken": ''
                  };
                }
              }, function (error) {
                return {
                  "Audience": {"Id": getAgentId()},
                  "AudienceType": "AnonymousUser",
                  "AccessToken": ''
                };
              });
            return {
              "Audience": {"Id": getAgentId()},
              "AudienceType": "AnonymousUser",
              "AccessToken": ''
            };
          }
          else {
            return {
              "Audience": {"Id": getAgentId()},
              "AudienceType": "AnonymousUser",
              "AccessToken": basicsettings.AccessToken || ''
            };
          }
        }
        else {
          return {
            "Audience": {"Id": getAgentId()},
            "AudienceType": "AnonymousUser",
            "AccessToken": settings.DefaultClientAccessToken || ''
          };
        }
      }
    else {
        return localStorageService.get('authorizationData');
      }
  };

  var _saveAttemptUrl = function() {
    if($location.path().toLowerCase().indexOf("/login") == -1 || $location.path() == '/') {
      //redirectToUrlAfterLogin.url = $location.path();
      redirectToUrlAfterLogin.url = $location.url();
      //localStorageService.set('redirectToUrlAfterLogin', $location.path());
    }
    //else {
      //redirectToUrlAfterLogin.url = '/agent/Dashboard';
    //}
    //console.log($location.path().toLowerCase().indexOf("/login"));
    //console.log($location.path());
    //console.log(redirectToUrlAfterLogin.url);
  };

    var _redirectToAttemptedUrl = function() {

    //console.log(redirectToUrlAfterLogin.url);
    var redirectUrl = redirectToUrlAfterLogin.url; //localStorageService.get('redirectToUrlAfterLogin');
    //localStorageService.remove('redirectToUrlAfterLogin');
    redirectToUrlAfterLogin.url = '/';

    if(redirectUrl == null || typeof redirectUrl == 'undefined' || redirectUrl.indexOf("login") > -1 || redirectUrl.indexOf("assertion") > -1) {

      if(_isLoggedIn().AudienceType == 'CLIENT' || _isLoggedIn().AudienceType == 'AnonymousUser')
      {
        $location.path('/clients/dashboard');
      }
      else {
        $location.path('/agents/dashboard');
      }
    }
    else {
      if(redirectUrl.indexOf("?") > -1) {
        $location.url(redirectUrl);
      }
      else {
        $location.path(redirectUrl);
      }
    }
  };

  var _login = function(loginData){
    localStorageService.set('authorizationData', loginData);
    var propertiesService = $injector.get("propertiesService");

    propertiesService.getSettings({},
      function (success) {
        var settings = {BrokerReciprocityTextLarge:'',latitude:'',longitude:'',EnableSchoolDistrictSearch:false,EnableContingencySearch:false,DefaultClientAccessToken:''};

        var BrokerReciprocityTextLarge = _.find(success.Settings,function(o){ return o.SettingTitle == 'BrokerReciprocityTextLarge'});
        if(BrokerReciprocityTextLarge)
          settings.BrokerReciprocityTextLarge = BrokerReciprocityTextLarge.Value;

        $rootScope.BrokerReciprocityTextLarge=settings.BrokerReciprocityTextLarge;

        var DefaultMapLocation = _.find(success.Settings,function(o){ return o.SettingTitle == 'DefaultMapLocation'});
        if(DefaultMapLocation) {
          settings.latitude = DefaultMapLocation.Value.split(',')[0];
          settings.longitude = DefaultMapLocation.Value.split(',')[1];
        }

        var BingKey = _.find(success.Settings,function(o){ return o.SettingTitle == 'BingKey'});
        if(BingKey) {
          settings.BingKey = BingKey.Value;
        }

        var DefaultWorkAddress = _.find(success.Settings,function(o){ return o.SettingTitle == 'DefaultWorkAddress'});
        if(DefaultWorkAddress) {
          settings.DefaultWorkAddress = DefaultWorkAddress.Value;
        }

        var DefaultLegalContentFile = _.find(success.Settings,function(o){ return o.SettingTitle == 'DefaultLegalContentFile'});
        if(DefaultLegalContentFile) {
          settings.DefaultLegalContentFile = DefaultLegalContentFile.Value;
        }

        var EnableSchoolDistrictSearch = _.find(success.Settings,function(o){ return o.SettingTitle == 'EnableSchoolDistrictSearch'});
        if(EnableSchoolDistrictSearch) {
          settings.EnableSchoolDistrictSearch = EnableSchoolDistrictSearch.Value == "true" ? true : false;
        }

        var EnableContingencySearch = _.find(success.Settings,function(o){ return o.SettingTitle == 'EnableContingencySearch'});
        if(EnableContingencySearch) {
          settings.EnableContingencySearch = EnableContingencySearch.Value == "true" ? true : false;
        }

        var BrokerDashboardUrl = _.find(success.Settings,function(o){ return o.SettingTitle == 'BrokerDashboardUrl'});
        if(BrokerDashboardUrl) {
          settings.BrokerDashboardUrl = BrokerDashboardUrl.Value;
        }

        var DefaultClientAccessToken = _.find(success.Settings,function(o){ return o.SettingTitle == 'ClientAccessToken'});
        if(DefaultClientAccessToken) {
          settings.DefaultClientAccessToken = DefaultClientAccessToken.Value;
        }

        var PropertyStyles = _.find(success.Settings,function(o){ return o.SettingTitle == 'PropertyStyles'});
        if(PropertyStyles) {
          settings.PropertyStyles = [];

            if(PropertyStyles.Value != "") {
              _.each(angular.fromJson(PropertyStyles.Value), function (o) {
                for(var i in o)
                {
                  _.each(o[i], function (style) {
                    style.PropertyType = i;
                    settings.PropertyStyles.push(style);
                  });
                }
              });
            }
        }

        var BackgroundImageUrl = _.find(success.Settings,function(o){ return o.SettingTitle == 'BackgroundImageUrl'});
        if(BackgroundImageUrl) {
          settings.BackgroundImageUrl = BackgroundImageUrl.Value;
          preloadImage(settings.BackgroundImageUrl);
        }
        //$rootScope.BackgroundImageUrl=settings.BackgroundImageUrl;

        propertiesService.getAnalyticskeys({}
          , function (success) {
            if (success != undefined) {
              settings.keenObject = {
                projectId: success.ProjectId,   // String (required always)
                writeKey: success.WriteKey,     // String (required for sending data)
                readKey: success.ReadKey,       // String (required for querying data)
                protocol: "https",              // String (optional: https | http | auto)
                host: "api.keen.io/3.0",        // String (optional)
                requestType: "jsonp"            // String (optional: jsonp, xhr, beacon)
              };

              localStorageService.set('settings', settings);
              if(_isLoggedIn().AudienceType == 'CLIENT') {
                _saveAttemptUrl();
              }
             _redirectToAttemptedUrl();
            }
          }, function (error) {
            localStorageService.set('settings', settings);
            if(_isLoggedIn().AudienceType == 'CLIENT') {
              _saveAttemptUrl();
            }
            _redirectToAttemptedUrl();
          });
      }, function (error) {

      });
  };

  var _logout = function(saveURL){
  var loginURL = '/agents/Login';
    if(_isLoggedIn().AudienceType == 'CLIENT' || _isLoggedIn().AudienceType == 'AnonymousUser')
    {
      loginURL = '/';
    }
    else {
      loginURL = '/agents/login';
    }

    localStorageService.remove('authorizationData');
    localStorageService.remove('settings');
    localStorageService.remove('basicsettings');
//    localStorageService.remove('redirectToUrlAfterLogin');
    redirectToUrlAfterLogin.url = '/';
    $('#isagentUser').val('');
    $('#agent-login-ui-sref').css("display","block"); //TO ADD AGENT LOGIN BUTTON
    if(saveURL == true) {
      _saveAttemptUrl();
    }

    $location.path(loginURL);
  }

  var _getAudienceId = function(){
    return _isLoggedIn().Audience.Id;
  }

  authServiceFactory.isLoggedIn = _isLoggedIn;
  authServiceFactory.saveAttemptUrl = _saveAttemptUrl;
  authServiceFactory.redirectToAttemptedUrl = _redirectToAttemptedUrl;
  authServiceFactory.login = _login;
  authServiceFactory.logout = _logout;
  authServiceFactory.getAudienceId = _getAudienceId;

  return authServiceFactory;
});


var preloadImage = function (url) {
  try {
    var _img = new Image();
    _img.src = url;
  } catch (e) { }
}
