'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:BookmarkPropertyEmailCtrl
 * @description
 * # BookmarkPropertyEmailCtrl
 * Controller of the tlcengineApp
 */
angular.module('tlcengineApp')
    .controller('TLCSearchConfirmCtrl', function ($scope, ngDialog, $rootScope) {

        $scope.selectedClient = angular.copy($scope.ngDialogData.client);

        $scope.closePopup = function(){
            ngDialog.close();
        }

        $scope.applyTLCSearch = function(){
            $rootScope.$broadcast("applyTLCProfileToSearch", $scope.selectedClient);
            ngDialog.close();
        }

    });
