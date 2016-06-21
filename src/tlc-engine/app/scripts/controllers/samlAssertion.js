angular.module('tlcengineApp')
  .controller('SamlAssertionCtrl',['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state',
    '$stateParams','$filter','$rootScope','$window','aaNotify','localStorageService','appAuth','redirectToUrlAfterLogin', 'httpServices',
    function ($scope, $location, $route, $routeParams, propertiesService,$timeout,$state,
              $stateParams,$filter,$rootScope,$window,aaNotify,localStorageService,appAuth,redirectToUrlAfterLogin,httpServices) {

      $scope.init = function()
      {
        $scope.userAuth = {"Audience":{"Id":$stateParams.audienceId},"AudienceType":$stateParams.audienceType.toUpperCase(),"AccessToken":$stateParams.t}
        redirectToUrlAfterLogin.url = localStorageService.get('redirectToUrlAfterLogin');
        appAuth.login($scope.userAuth);
        $('#agent-login-ui-sref').hide();
        $scope.setAgentDetail();
      }

      $scope.setAgentDetail = function () {
        httpServices.getAgentDetail().then(
          function (success) {
              console.log('AgentDetails', success);
            if (success != undefined) {
//              $scope.agent = success;
                LoggedInAgent = success;
              document.getElementById("captureUserName").innerHTML = success.FirstName;
              $('#isagentUser').val('true');
              $('#agent-login-ui-sref').css("display","none"); //TO REMOVE AGENT LOGIN BUTTON
              $("#savedSearchButtonId").html("My saved search");  //For Saved Search button changes
              $(".saved-data").removeClass("login-opt-saved-srch");
              var agentName = success.FirstName;
              if(success.FirstName) {
                document.getElementById("captureUserName").innerHTML = 'Welcome ' + success.FirstName + '!<span class="caret"></span><span style="font-size:initial;">&nbsp;&nbsp;(Agent)</span>';
                $('#agentName').val(agentName);
              } else {
                document.getElementById("captureUserName").innerHTML = 'Agent User<span class="caret"></span>';
                $('#agentName').val('Agent User');
              }
              $('li.blue-back').addClass('agent-bar');
              document.getElementById("captureUserName").setAttribute("data-toggle", "dropdown");
              $scope.AgentImage = $scope.agent.Profile.ProfileImageName || "images/client-dashboard.png";
            }
          }, function (error) {
                console.log(error);
          });
      }

      $scope.init();
    }]);


