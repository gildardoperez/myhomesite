'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:BookmarkPropertyEmailCtrl
 * @description
 * # ConfirmDeleteClientProfileCtrl
 * Controller of the tlcengineApp
 */
angular.module('tlcengineApp')
  .controller('ConfirmDeleteClientProfileCtrl', function ($scope, ngDialog,  $rootScope, appAuth, httpServices, aaNotify) {

    $scope.selectedClient = angular.copy($scope.ngDialogData.client);

    $scope.removeClient = function(){
      httpServices.deleteClientFromAgent($scope.selectedClient.Id)
        .then(function(success){
          aaNotify.success($scope.selectedClient.FirstName + ' ' + $scope.selectedClient.LastName + ' deleted successfully.');
          $rootScope.$broadcast("getClients");
          $rootScope.$broadcast("onDeleteClient", $scope.selectedClient.Id);
          ngDialog.close();
        }, function(error){
          console.log("error " + error);
        });
    };

    $scope.closePopup = function(){
      ngDialog.close();
    };

  });
