angular.module('tlcengineApp')
  .controller('ForgetpasswordtemplateCtrl', ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope', '$window', 'aaNotify',
    function ($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, $window, aaNotify) {

        $scope.init = function () {
            generateSearchUI();
            $("#content").animate({
                width: "100%"
            }, 300), $("#map").animate({
                width: "0%"
            }, 300);
        }
        $scope.init();
    }]);
