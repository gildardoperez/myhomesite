angular.module('tlcengineApp')
  .controller('SamlLoginCtrl',['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state',
    '$stateParams','$filter','$rootScope','$window','aaNotify','localStorageService','appAuth','$http','$sce','redirectToUrlAfterLogin',
    function ($scope, $location, $route, $routeParams, propertiesService,$timeout,$state,
              $stateParams,$filter,$rootScope,$window,aaNotify,localStorageService,appAuth,$http,$sce,redirectToUrlAfterLogin) {

      $scope.init = function()
      {
        $scope.userAuth = {};
        $scope.location ="";

        propertiesService.getAuthentication({}
          , function (success) {
            if (success != undefined && success.AuthenticationMechanism.length > 0) {
              $scope.AuthenticationMechanism = success.AuthenticationMechanism;
              localStorageService.set('redirectToUrlAfterLogin', redirectToUrlAfterLogin.url);

              var data = {
                redirectUrl: $scope.AuthenticationMechanism[0].AuthDetails.Idp,
                redirectMethod: 'POST',
                redirectData: {
                  'SAMLRequest': $scope.AuthenticationMechanism[0].AuthDetails.SAMLRequest
                }
              }

              data.redirectUrl = $sce.trustAsResourceUrl(data.redirectUrl);

              //$scope.formData = data;
              $rootScope.$broadcast('gateway.redirect', data);
              //$("#frmSaml").action =$scope.trustSrc($scope.AuthenticationMechanism[0].AuthDetails.Idp);
              //$scope.location = $scope.AuthenticationMechanism[0].AuthDetails.Idp;
              //$("#frmSaml").action = $scope.AuthenticationMechanism[0].AuthDetails.Idp;

              //$timeout(function(){$("#frmSaml").submit();},100);

              //setTimeout(function(){$("#frmSaml").submit();},1000)

              /*$timeout(function() {
                document.getElementById("frmSaml").submit();
              })*/

              /*var transform = function(data){
                return $.param(data);
              }*/

              //$("#frmSaml").action = $scope.AuthenticationMechanism[0].AuthDetails.Idp;
              //$("#submitForm").parent().submit();
              /*$http({
                url: $scope.AuthenticationMechanism[0].AuthDetails.Idp,
                method: "POST",
                data: {
                  "SAMLRequest": $scope.AuthenticationMechanism[0].AuthDetails.SAMLRequest
                },
                headers:{"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                transformRequest: transform
              });*/

              /*$.ajax({
                type: "POST",
                url: $scope.AuthenticationMechanism[0].AuthDetails.Idp,
                data: {
                  "SAMLRequest": $scope.AuthenticationMechanism[0].AuthDetails.SAMLRequest
                },
                success: function () {

                }
              });*/
            }
          }, function (error) {

          });
      }

      $(document).ready(function(){
        //$("body").css("background", "transparent");
        $("body").removeClass('body-dashboard');
      });

      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }

      $scope.init();
    }]);




angular.module('tlcengineApp').directive('autoSubmitForm', ['$timeout','$sce', function($timeout,$sce) {
  return {
    replace: true,
    scope: {},
    /*template: '<form name="frmSaml" action="{{formData.redirectUrl}}" method="{{formData.redirectMethod}}">'+
    '<input type="text" name="SAMLRequest" value="{{formData.SAMLRequest}}" />'+
    '</form>',*/
    template: '<form action="{{formData.redirectUrl}}" method="{{formData.redirectMethod}}">'+
    '<div ng-repeat="(key,val) in formData.redirectData">'+
    '<input type="hidden" name="{{key}}" value="{{val}}" />'+
    '</div>'+
    '</form>',
    controller: function($scope, $element, $attrs, $http) {
      $http.defaults.headers.common["Content-Type"]='application/x-www-form-urlencoded; charset=UTF-8';
    },
    link: function($scope, element, $attrs) {
      $scope.$on($attrs['event'], function(event, data) {
        $scope.formData = data;
        //console.log($scope.formData);
        //console.log('redirecting now!');
        $timeout(function() {
          //var $element = angular.element(element);
          //$element.find( 'frmSaml').submit();
          element.submit();
        },100)
      })

      /*$scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }*/
    }
  }
}])


