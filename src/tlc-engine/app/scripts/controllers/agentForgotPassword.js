// angular.module('tlcengineApp')
//   .controller('AgentForgotPasswordCtrl',['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state', '$stateParams','$filter','$rootScope','$window','aaNotify','httpServices',
//     function ($scope, $location, $route, $routeParams, propertiesService,$timeout,$state, $stateParams,$filter,$rootScope,$window,aaNotify,httpServices) {

//       $scope.init = function()
//       {
//         $scope.userAuth = {AudienceType:'MLSAGENT'};
//       }

//       $scope.login = function(){
//         //httpServices.trackGoogleEvent('remember','Forgot-Password','','MLSAGENT');

//         $state.go('agentLogin');
//       }

//       $scope.processForgotPassword = function(){
//         //httpServices.trackGoogleEvent('save','Forgot-Password','','MLSAGENT');

//         propertiesService.resetPassword($scope.userAuth
//           , function (success) {
//             if (success != undefined) {
//                 aaNotify.success("Your new password has been emailed to you.");
//               $state.go('agentLogin');
//             }
//           }, function (error) {
//               aaNotify.danger("The email you entered is incorrect.");
//           });
//       }

//       $(document).ready(function () {
//           //$("body").css("background", "transparent");
//         $("body").removeClass('results');
//         $("body").removeClass('body-dashboard');
//       });

//       $scope.init();
//     }]);
