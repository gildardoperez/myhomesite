angular.module('tlcengineApp')
  .controller('ClientNotificationsCtrl', ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope', '$window', 'aaNotify','$q','appAuth','httpServices',
    function ($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, $window, aaNotify,$q,appAuth,httpServices) {

      //$scope.sizeLimit      = 10585760; // 10MB in Bytes

      $scope.init = function () {
        generateSearchUI();
        $("#handle").hide();

        $("#content").animate({
          width: "100%"
        }, 300), $("#map").animate({
          width: "0%"
        }, 300);

        $scope.notification = {allnotifications:false,clinetwelcome:false,propertiesfavoritedclient:false,clientsearch:false,clientloggedin:false,unsuccessfullogin:false,clientcomments:false,webminarstraining:false,newsletters:false};
        $('.title-tipso').tipso();
      }

      $scope.back = function(){
        $state.go("clientDashboard");
      }

      $scope.goToHome = function () {
          $state.go('clientDashboard');
      }

      $scope.unsubscribeNotifications = function()
      {
        /*propertiesService.unsubscribeNotifications({ agentId: $scope.agent.AgentId }, $scope.notification
          , function (success) {
            aaNotify.success('Successfully unsubscribe from selected notifications.');
          }, function (error) {

          });*/
      }

      $scope.changeAllNotifications = function()
      {
        $scope.notification.savedsearches = $scope.notification.allnotifications;
        $scope.notification.clinetwelcome = $scope.notification.allnotifications;
        $scope.notification.propertiesfavoritedclient = $scope.notification.allnotifications;
        $scope.notification.clientsearch = $scope.notification.allnotifications;
        $scope.notification.clientloggedin = $scope.notification.allnotifications;
        $scope.notification.unsuccessfullogin = $scope.notification.allnotifications;
        $scope.notification.clientcomments = $scope.notification.allnotifications;
        $scope.notification.webminarstraining = $scope.notification.allnotifications;
        $scope.notification.newsletters = $scope.notification.allnotifications;
      }
      $scope.back = function(){
        $state.go("clientDashboard");
      }

       $scope.init();
    }]);

