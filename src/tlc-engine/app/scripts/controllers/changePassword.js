// (function () {
//   'use strict';

// angular.module('tlcengineApp').controller('ChangePasswordCtrl',ChangePasswordCtrl);

// ChangePasswordCtrl.$inject = ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope', '$window', 'aaNotify','$q','appAuth','httpServices'];

// function ChangePasswordCtrl($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, $window, aaNotify,$q,appAuth,httpServices)
// {
//       $scope.init = function () {
//         generateSearchUI();
//         $("#handle").hide();
//         $("#content").animate({
//           width: "100%"
//         }, 300), $("#map").animate({
//           width: "0%"
//         }, 300);

//         $scope.userAuth = {AudienceId:appAuth.getAudienceId(),
//                            AudienceType:appAuth.isLoggedIn().AudienceType};
//       }

//       $scope.back = function(){
//         if(appAuth.isLoggedIn().AudienceType == 'CLIENT')
//           $state.go("clientDashboard");
//         else
//           $state.go("agentDashboard");
//       }

//       $scope.changePassword = function(){
//         //httpServices.trackGoogleEvent('Change','Change-Password');

//         propertiesService.changePassword($scope.userAuth
//           , function (success) {
//               aaNotify.success('Password has been updated successfully.');
//               $scope.back();
//           }, function (error) {
//               aaNotify.error('Current password you entered is incorrect.');
//           });
//       }

//        $scope.init();
//     };

// })();
