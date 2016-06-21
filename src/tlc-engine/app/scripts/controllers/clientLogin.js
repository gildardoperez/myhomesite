// (function () {
//   'use strict';

// angular.module('tlcengineApp').controller('ClientLoginCtrl',ClientLoginCtrl);

// ClientLoginCtrl.$inject = ['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state',
//   '$stateParams','$filter','$rootScope','$window','aaNotify','localStorageService','appAuth','httpServices'];

// function ClientLoginCtrl($scope, $location, $route, $routeParams, propertiesService,$timeout,$state,
//               $stateParams,$filter,$rootScope,$window,aaNotify,localStorageService,appAuth,httpServices)
// {

//       $scope.init = function()
//       {
//         $scope.userAuth = {};
//       }

//       $scope.forgotPassword = function(){
//         //httpServices.trackGoogleEvent('Forgot-Password','login','','CLIENT');

//         $state.go('clientForgotPassword');
//       }

//       $scope.processSignIn = function(){
//         //httpServices.trackGoogleEvent('Login','login','','CLIENT');
//         console.log("Login", $scope.userAuth);
//         propertiesService.clientLogin($scope.userAuth
//           , function (success) {
//             if (success != undefined) {
//               console.log(success)
//               appAuth.login(success);
//             }
//           }, function (error) {
//               aaNotify.danger("The email or password you entered is incorrect.");
//           });
//       }

//       $(document).ready(function(){
//           //$("body").css("background", "transparent");
//           $("body").removeClass('results');
//           $("body").removeClass('body-dashboard');
//       });

//       $scope.init();
//     };

// })();
