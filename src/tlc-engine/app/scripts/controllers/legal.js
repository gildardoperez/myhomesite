angular.module('tlcengineApp')
  .controller('LegalCtrl', ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope', '$window', 'aaNotify', 'applicationFactory',
    function ($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, $window, aaNotify, applicationFactory) {

      // $(document).ready(function () {
      //   $("body").addClass("body-dashboard legal");
      // });

        $scope.init = function () {
            angular.element('body').addClass('relativeBackground'); 
            $location.hash('endUser')
            var settings = applicationFactory.getSettings();
            $scope.legalPageUrl = settings.DefaultLegalContentFile.replace("https:","").replace("http:","");
            $("#loadLegalPage").html('<object data="' + $scope.legalPageUrl + '"}}"></object>');
            generateSearchUI();
            $("#handle").hide();
            $("#content").animate({
                width: "100%"
            }, 300), $("#map").animate({
                width: "0%"
            }, 300);


            $timeout(function () {
                $('#legal_content_container').load($scope.legalPageUrl, function () {
                    $("#handle").hide();
                    //$("#legal-page").scrollbar();
                    $("#content").animate({
                        width: "100%"
                    }, 300), $("#map").animate({
                        width: "0%"
                    }, 300);
                });

            }, 1000);

        }
        $scope.init();
    }]);
