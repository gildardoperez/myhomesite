'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:BookmarkPropertyEmailCtrl
 * @description
 * # BookmarkPropertyEmailCtrl
 * Controller of the tlcengineApp
 */
angular.module('tlcengineApp')
    .controller('BookmarkPropertyEmailCtrl', function ($scope, ngDialog, propertiesService, $rootScope, appAuth) {

        $scope.bookmarkedFor = angular.copy($scope.ngDialogData.client);
        $scope.parent = angular.copy($scope.ngDialogData.parent);
        $scope.emailClient = false;
        if($scope.parent == "detail"){
            $scope.bookmarkList = [$scope.ngDialogData.bookmarkProperty];
        }

        $scope.bookmarkObj = {"ListingIds":[], "Note":"",SendEmail:true};

        $scope.sendBookmark = function(){
            $scope.bookmarkClient($scope.bookmarkedFor.Id, $scope.bookmarkedFor);
        }

        $scope.noteKeyUpHandler = function (event){
            if (event.keyCode == 13) {
                $scope.sendBookmark();
            }
        }

        $scope.bookmarkClient = function (clientId, client) {
          var listingIds = [];

          if($scope.listingId > 0)
            listingIds.push($scope.listingId);
          else {
            for (var i = 0; i < $scope.bookmarkList.length; i++) {
              listingIds.push($scope.bookmarkList[i].Id);
            }
          }

            $scope.bookmarkObj.ListingIds = listingIds,
              $scope.bookmarkObj.SendEmail = !$scope.emailClient,

            propertiesService.bookmarksClient({ agentId: appAuth.getAudienceId(), clientId: clientId }, $scope.bookmarkObj
                , function (success) {
                    $rootScope.$broadcast("bookmarkClientSuccess", $scope.bookmarkedFor, $scope.parent);
                    ngDialog.close();
//                    $scope.clearBookmark = true;
//                    $scope.isAddBookmark = true;
//                    $scope.messageForclientBook = client.FirstName + " " + client.LastName;
//                    $scope.isSuccess = true;
//                    $timeout(function () {
//                        hideBookmarkStatus();
//                        $scope.isAddBookmark = false;
//                        $scope.bookmarkList = [];
//                    }, 2000);
//                  console.log("success " + success);
                }, function (error) {
                    $rootScope.$broadcast("bookmarkClientError", $scope.bookmarkedFor, $scope.parent);
                    ngDialog.close();
//                    $rootScope.$broadcast("bookmarkClientError", $scope.bookmarkedFor);
//                    ngDialog.close();
//                    $scope.isSuccess = false;
//                    $timeout(function () {
//                        hideBookmarkStatus();
//                        $scope.isAddBookmark = false;
//                        $scope.bookmarkList = [];
//                    }, 2000);
//                  console.log("error " + error);
                });
        }

    });
