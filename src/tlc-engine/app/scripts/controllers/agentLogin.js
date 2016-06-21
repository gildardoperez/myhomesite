angular.module('tlcengineApp').controller('AgentLoginCtrl',['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state','$stateParams','$filter','$rootScope','$window','aaNotify','localStorageService','appAuth','authenticationDetail','httpServices',
    function ($scope, $location, $route, $routeParams, propertiesService,$timeout,$state,$stateParams,$filter,$rootScope,$window,aaNotify,localStorageService,appAuth,authenticationDetail,httpServices) {

      $scope.init = function() {
        $scope.AuthenticationMechanism = authenticationDetail.AuthenticationMechanism;
      }

      $scope.forgotPassword = function(){
          $state.go('agentForgotPassword');
      }

      $scope.processSignIn = function(){
          propertiesService.agentLogin($scope.userAuth
            , function (success) {
              if (success != undefined) {
                appAuth.login(success);
                $('#isagentUser').val('true');
                $('#agent-login-ui-sref').css("display","none"); //TO REMOVE AGENT LOGIN BUTTON
              }
            }, function (error) {
                  console.log(error)
                aaNotify.danger("The email or password you entered is incorrect.");
            }
          );
      }

      $(document).ready(function(){
          $("body").removeClass('results');
          $("body").removeClass('body-dashboard');
      });

      $scope.init();
    }]);
