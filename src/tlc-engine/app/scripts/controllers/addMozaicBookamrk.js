/**
 * Created by gugan_mohan on 2/24/2016.
 */

'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:PropertydetailCtrl
 * @description
 * # AddMozaicBookmark Controller
 * Controller of the tlcengineApp
 */
angular.module('tlcengineApp')
    .controller('AddMozaicBookmark', ['$rootScope', '$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', 'aaNotify', 'printer', 'appAuth', 'httpServices', 'applicationFactory', 'ngDialog', '$window', '$anchorScroll',
        function ($rootScope, $scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, aaNotify, printer, appAuth, httpServices, applicationFactory, ngDialog, $window, $anchorScroll) {

            $scope.successResponse = false;
            $scope.aaNotifyMsgObj={};
            $scope.init = function () {

                $scope.property = {};
                var proId = [];

                $scope.$on('myFavorites', function (event, data) {

                    $scope.favOptions = [
                        { name: data[0].favorite[0].description, value: data[0].favorite[0].description },
                        { name: data[0].favorite[1].description, value: data[0].favorite[1].description }
                    ];

                    $scope.mozaicAddFavoriteEnableNotification = data[0].favorite[0].description;

                    $scope.mozaicAddFavoritePriceChange = data[1].favorite;
                    $scope.mozaicAddFavoriteStatusChange = data[2].favorite;
                    $scope.mozaicAddFavoriteOpenHouse = data[3].favorite;
                    $scope.mozaicfavorite_list = data[4].favorite;
                });

                $scope.closeBookmarkwindow = function () {
                    $('#AddMozaicBookmarkModal').modal('hide');
                }

                $rootScope.$on("CallOpenMozaicFavoritePopup", function (scope, data) {                    
                    $scope.property = data;
                    $scope.openBookmarkWindow(data);
                });

                $scope.openBookmarkWindow = function (data) {
                    proId = [];
                    $scope.mozaicAddFavoriteComments = "";

                    $scope.removeSelectedList = function() {
                        if ($('input:checkbox[name="addList[]"]:checked').length == $('input:checkbox[name="addList[]"]').length){
                            $('input:checkbox[name="mozaicList"]').prop("checked",true);
                        } else {
                            $('input:checkbox[name="mozaicList"]').prop("checked",false);
                        }

                        $('input:checkbox[name="addList[]"]').each(function () {
                            if(this.checked == true) {                                
                                var alreadyAdded = proId.indexOf(this.value) > -1;
                                if(!alreadyAdded) {
                                    proId.push(this.value);
                                }
                            } else {
                                this.checked = false;
                                var index = proId.indexOf(this.value);
                                proId.splice(index, 1);
                            }
                        });
                    }

                    $scope.globalSelect = function() {
                        
                        if($('input:checkbox[name="mozaicList"]').is(":checked"))
                            $scope.value = true;
                        else
                            $scope.value = false;

                        $scope.changeCheckboxStatus($scope.value);  
                    }

                    $scope.changeCheckboxStatus = function(value) {
                        $('input:checkbox[name="addList[]"]').each(function () {
                            if(value == true) {
                                this.checked = true;   
                                var alreadyAdded = proId.indexOf(this.value) > -1;
                                if(!alreadyAdded) {
                                    proId.push(this.value);
                                }
                            } else {
                                this.checked = false;
                                var index = proId.indexOf(this.value);
                                proId.splice(index, 1);
                            }
                        });
                    }

                    var listing_id = data.MN;
                    $scope.mozaicList = false;
                    $rootScope.$broadcast("resetRating", {});
                    $scope.successResponse = true;
                    
                    if (document.getElementById("captureUserName").innerHTML == "Login or Register") {
                        janrain.capture.ui.start();
                    } else {
                        $('#AddMozaicBookmarkModal').modal('show');
                        var sso_id = localStorage.janrainCaptureProfileData;
                        if (typeof(Storage) !== "undefined") {
                            if (localStorage.janrainCaptureProfileData) {
                                sso_id = JSON.parse(sso_id);
                                sso_id = sso_id['uuid'];
                            }
                        }

                        var showFavMozaicReq = {
                            "client_secret": "tlcenginetest",
                            "mls_id": "MRIS",
                            "client_id": "TLCENGINE",
                            "user_sso_id": sso_id,
                            "listing_id": listing_id
                        };

                        propertiesService.getFavorites(showFavMozaicReq, function (success) {                          
                            $scope.successResponse = false;
                            var parsedSuccess = JSON.parse(success.Id);
                            if (parsedSuccess["response_code"] == 200) {

                                var projectIds = [];
                                $.each(parsedSuccess["show_favorites"]["favorite_list"], function(index, value) {
                                  projectIds.push(value.projectId);
                                });

                                if(projectIds.length > 0) {
                                  $scope.mozaic_projectID = projectIds.join();
                                }

                                //$scope.mozaic_projectID = parsedSuccess["show_favorites"]["favorite_list"][0]["projectId"];
                                $scope.mozaic_userId = parsedSuccess["show_favorites"]["loggedin_user"]["userId"];

                                $scope.favorites = [
                                    {
                                        favorite: parsedSuccess["notification_setting"]
                                    },
                                    {
                                        favorite: parsedSuccess["notification_event"][0]["value"]
                                    },
                                    {
                                        favorite: parsedSuccess["notification_event"][1]["value"]
                                    },
                                    {
                                        favorite: parsedSuccess["notification_event"][0]["value"]
                                    },
                                    {
                                      favorite: parsedSuccess['show_favorites']["favorite_list"]
                                    }
                                ];
                                $rootScope.$broadcast('myFavorites', $scope.favorites);

                                setTimeout(function(){
                                    if ($(".checkboxList").length == 0) {
                                        $scope.successResponse = true;
                                        $scope.alladded = true;
                                    } else if($(".checkboxList").length == 1) {
                                        $scope.alladded = true;
                                    } else {
                                        $scope.successResponse = false;
                                        $scope.alladded = false;
                                    }
                                },600)
                            }
                            $scope.mozaic_listingId = listing_id;
                        }, function (error) {
                            $scope.successResponse = false;                            
                        });
                    }
                }

                $scope.submitBookmark = function () {
                  if(!$(".aa-notification").is(':visible')){
                    if(proId.length == 0) {
                        $('input:checkbox[name="addList[]"]').each(function() {
                            if (this.checked) {                                
                                var alreadyAdded = proId.indexOf(this.value) > -1;
                                if(!alreadyAdded) {
                                    proId.push(this.value);
                                }
                            }
                        });
                    }

                    var ASAP = false;
                    if ($scope.mozaicAddFavoriteEnableNotification == "ASAP") {
                        ASAP = true;
                    }
                    var sso_id = localStorage.janrainCaptureProfileData;
                    if (typeof(Storage) !== "undefined") {
                        if (localStorage.janrainCaptureProfileData) {
                            sso_id = JSON.parse(sso_id);
                            sso_id = sso_id['uuid'];
                        }
                    }
                   
                    var requestJson = {
                        "client_id": "TLCENGINE",
                        "mrisListing_id": $scope.property.Id,
                        "client_secret": "tlcenginetest",
                        "mls_id": "MRIS",
                        "user_id": $scope.mozaic_userId, // What is this
                        "favorite_lists": proId,  // What is this
                        "user_sso_id": sso_id,
                        "listing_id": $scope.mozaic_listingId, //$scope.propertyDetail.LISTINGID
                        "rating_score": $scope.rate,
                        "comments": $scope.mozaicAddFavoriteComments,
                        "notification_setting": [
                            {
                                "id": 9,
                                "eventAttributeType": "ASAP",
                                "value": ASAP
                            }
                        ],
                        "notification_event": [
                            {
                                "id": 11,
                                "eventAttributeType": "PRICE_CHANGE",
                                "value": $scope.mozaicAddFavoritePriceChange
                            },
                            {
                                "id": 12,
                                "eventAttributeType": "STATUS_CHANGE",
                                "value": $scope.mozaicAddFavoriteStatusChange
                            },
                            {
                                "id": 13,
                                "eventAttributeType": "OPEN_HOUSE",
                                "value": $scope.mozaicAddFavoriteOpenHouse
                            }
                        ]
                    };                    
                    
                    $scope.successResponse = true;
                    
                    if(proId.length > 0) {
                         httpServices.favoritesClient(requestJson).then(
                        function (success) {                            
                            var message = success.Message;
                            if(message.indexOf('Listing Not Exist In MDS') > -1) {
                                aaNotify.warning(message);
                            } else {
                                if(window.location.href.indexOf('/detail/') > -1) {
                                    $scope.$emit("_listtrac_trackEvent", _eventType.favorite);
                                }
                                $scope.property.IF = true;
                                applyfavorite($scope.property.Id);
                              try {
                                $scope.$emit("CallApplyFavorite", $scope.property.Id);
                              }catch(ex){}
                                aaNotify.success(message);
                            }
                            $scope.closeBookmarkwindow();
                            $scope.successResponse = false;                            
                        }, function (error) {
                            aaNotify.error("Unable to add property to favorites! Please try again.");
                            $scope.closeBookmarkwindow();                            
                            $scope.successResponse = false;
                        });
                    } else {
                        $scope.successResponse = false;
                        aaNotify.error('Please select atleast one participant',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                        return false;
                    }
                }
                }
            }
            $scope.init();
        }]);
