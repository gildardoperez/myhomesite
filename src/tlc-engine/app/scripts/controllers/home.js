/**
 * Created by kamal on 2/26/2015.
 */

angular.module('tlcengineApp')
  .controller('HomeCtrl', ['$scope', '$rootScope', '$location', '$timeout', '$state', '$stateParams', 'aaNotify', 'ngDialog','appAuth',
    function ($scope, $rootScope, $location, $timeout, $state, $stateParams, aaNotify, ngDialog,appAuth) {
      
        $scope.init = function () {

          if($scope.agent != undefined) {
            if ($scope.AudienceType == 'CLIENT' && $scope.agent.ClientSearchEnabled == false) {
                aaNotify.danger("You are not authorized!!!");
                $state.go("clientDashboard");
            }
          }
            generateHomeScreen();
            $('.title-tipso').tipso();
        }

        $scope.legal = function () {
          if(appAuth.isLoggedIn().AudienceType=="MLSAGENT") {
            $state.go('tlc.legal');
          }
          else{
            $state.go('tlcClient.legal');
          }

        }
        $scope.feedback = function () {
            ngDialog.open({
                template: 'views/templates/feedbacktemplate.html',
                closeByEscape: false,
                closeByDocument: false
            });
        }
        $scope.ticketTitle = "";
        $scope.emailAddress = "";
        $scope.Feedback_description = "";

        function generateHomeScreen() {
            $("body").removeClass("results freeze");
            $("#search").removeClass("more");
        }

      $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        $("body").removeClass("results freeze");
        $("#search").removeClass("more");
        $("body").removeClass("body-dashboard");
      });


      $scope.init();
    }]);
