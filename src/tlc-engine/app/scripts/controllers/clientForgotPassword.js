// (function () {
//   'use strict';

// angular.module('tlcengineApp').controller('ClientForgotPasswordCtrl',ClientForgotPasswordCtrl);

// ClientForgotPasswordCtrl.$inject = ['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state', '$stateParams','$filter','$rootScope','$window','aaNotify','httpServices'];

// function ClientForgotPasswordCtrl($scope, $location, $route, $routeParams, propertiesService,$timeout,$state, $stateParams,$filter,$rootScope,$window,aaNotify,httpServices)
// {
//       $scope.init = function()
//       {
//         $scope.userAuth = {AudienceType:'CLIENT'};
//       }

//       $scope.login = function(){
//         //httpServices.trackGoogleEvent('remember','Forgot-Password','','CLIENT');

//           $state.go('clientLogin');
//       }

//       $scope.processForgotPassword = function(){
//         //httpServices.trackGoogleEvent('save','Forgot-Password','','CLIENT');

//         propertiesService.resetPassword($scope.userAuth
//           , function (success) {
//             if (success != undefined) {
//                 aaNotify.success("Your new password has been emailed to you.");
//               $state.go('clientLogin');
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
//     };

// })();
