'use strict';

/**
 * @ngdoc directive
 * @name tlcengineApp.directive:propertyCard
 * @description
 * # propertyCard
 */
angular.module('tlcengineApp')
  .directive('propertyCard', ['utilService', '$state', '$rootScope', 'aaNotify','printer', 'propertiesService',
    function (utilService, $state, $rootScope, aaNotify,printer, propertiesService) {
        return {
            templateUrl: 'views/templates/propertyBoxCard.tpl.html',
            restrict: 'E',
            replace: true,
            scope: {
                id: '@id',
                property: '=property',
                bookmarkPropertyEvent: '&bookmarkPropertyEventHandler',
                clearBookmark: '=clearBookmark',
                removeClientBookmarkPropertyEvent: '&removeClientBookmarkPropertyEventHandler',
                addClientFavoritePropertyEvent: '&addClientFavoritePropertyEventHandler',
                removeClientFavoritePropertyEvent: '&removeClientFavoritePropertyEventHandler'
            },
            link: function postLink($scope, $rootScope, $apply, element, attrs) {
                $scope.bookmarked = false;

                $scope.$watch("clearBookmark", function (newValue, oldValue) {
                    if (newValue == true) {
                        $scope.bookmarked = false;
                        removeBookmark($scope.property.Id);
                    }
                });

                $scope.previewUrl = "images/No-property.png";

                $scope.selectPreview = function (imageUrl) {
                    $scope.previewUrl = imageUrl; //$scope.getDefaultUrl(imageUrl);
                };

                $scope.getSortPrice = function (price) {
                    return utilService.getSortPrice(price);
                }

                $scope.formatNumber = function (value) {
                    return utilService.formatNumber(value);
                }

                $scope.getThumbUrl = function (item) {
                    return item;
                    /*for (var i in item.Items) {
                        var image = item.Items[i];
                        if (image != undefined && image.Type == 'thumb') {
                            return item.Items[i].Url;
                        }
                        if (i > 0) {
                            return item.Items[0].Url;
                        }
                    }
                    return "";*/
                }

                $scope.getDefaultUrl = function (item) {
                    for (var i in item.Items) {
                        var image = item.Items[i];
                        if (image != undefined && image.Type == 'default') {
                            return item.Items[i].Url;
                        }
                        if (i > 0) {
                            return item.Items[0].Url;
                        }
                    }
                    return "";
                }

                $scope.initUiComponents = function () {
                    if ($scope.property != undefined && $scope.property.PCNT > 0 && $scope.property.Photos != undefined && $scope.property.Photos.length > 0) {
                        $scope.selectPreview($scope.property.Photos[0]);
                    }

                    if ($state.current.name == 'tlc.clientSummary') {
                        setTimeout(function () {
                            $("[id^='add-bookmark']").hide();
                            $("[id^='remove-bookmark']").show().addClass("tipso_style");
                            $("[id^='remove-bookmark']").closest('li').addClass('bookmark-active');

                        }, 100);
                    }
                }
                var refreshIntervalId = "";
                $scope.mouseOverOnHomeImage = function () {
                    var no = 0;
                    if ($scope.previewUrl != "images/No-property.png") {
                        if ($scope.property.Photos.length > 1) {
                            $scope.selectPreview($scope.property.Photos[1]);
                            no = 1;
                        }
                    }
                    refreshIntervalId = setInterval(function () {
                        if ($scope.previewUrl != "images/No-property.png") {
                            if (no == ($scope.property.Photos.length - 1)) { no = -1; }
                            no = parseInt(no) + 1;
                            $scope.$apply(function () {
                                $scope.selectPreview($scope.property.Photos[no]);
                            });
                        }
                    }, 2000);
                    //$rootScope.$broadcast('onPropListMouseover');
                }
                $scope.mouseLeaveOnHomePageImage = function () {
                    clearInterval(refreshIntervalId);
                }

                $scope.addBookmark = function (e, pType, pID) {
                    if (pType == 'add') {
                        applyBookmark(pID);
                    }
                    else {
                        removeBookmark(pID);
                    }
                    e.stopPropagation();
                    $scope.bookmarked = !$scope.bookmarked;
                    $scope.bookmarkPropertyEvent()($scope.property);

                }

                function applyBookmark(pID) {
                    $("#add-bookmark_" + pID).hide();
                    $("#remove-bookmark_" + pID).show();
                    $("#add-bookmark_" + pID).closest('li').addClass('bookmark-active');
                    $(".add-bookmark_" + pID).hide();
                    $(".remove-bookmark_" + pID).show();
                }

                function removeBookmark(pID) {
                    $("#add-bookmark_" + pID).show();
                    $("#remove-bookmark_" + pID).hide();
                    $("#add-bookmark_" + pID).closest('li').removeClass('bookmark-active');
                    $(".add-bookmark_" + pID).show();
                    $(".remove-bookmark_" + pID).hide();
                }

                $scope.removeClientBookmark = function (e) {
                    $scope.removeClientBookmarkPropertyEvent()($scope.property);
                    e.stopPropagation();
                }

                /* Apply favorite changes to the ui MT-559*/
                function applyfavorite(pID) {
                    $("#add-favorite_" + pID).hide();
                    $("#remove-favorite_" + pID).show();
                    $("#add-favorite_" + pID).closest('li').addClass('bookmark-active');
                    $(".add-favorite_" + pID).hide();
                    $(".remove-favorite_" + pID).show();
                    //aaNotify.success('Property successfully add to favorite.');
                }

                /* Apply favorite changes to the ui MT-559*/
                function removefavorite(pID) {
                    $("#add-favorite_" + pID).show();
                    $("#remove-favorite_" + pID).hide();
                    $("#add-favorite_" + pID).closest('li').removeClass('bookmark-active');
                    $(".add-favorite_" + pID).show();
                    $(".remove-favorite_" + pID).hide();
                    //aaNotify.success('Property successfully removed from favorite.');
                }

                /* send the server call for add to favorite for client MT-559*/
                $scope.addClientFavorite = function (e) {
                    e.stopPropagation();
                    $scope.$emit("CallOpenMozaicFavoritePopup", $scope.property);
//                        $scope.addClientFavoritePropertyEvent()($scope.property);
                        //applyfavorite($scope.property.Id);
                }

                /* send the server call for remove from favorite for client MT-559*/
                $scope.removeClientFavorite = function (e) {
                    e.stopPropagation();
                    $scope.removeClientFavoritePropertyEvent()($scope.property);
                    removefavorite($scope.property.Id);
                }

                $scope.initUiComponents();
            },
            controller: function ($rootScope, $scope, $state, $stateParams, $timeout, aaNotify, appAuth, httpServices, ngDialog, propertiesService) {

                $scope.AudienceType = appAuth.isLoggedIn().AudienceType;

                $scope.propertyDetail = function (listingId) {

                    /*console.log(listingId);
                     console.log($routeParams.searchParams);
                     var searchParams = '';
                     if($routeParams.searchParams != undefined && $routeParams.searchParams != "") {
                     searchParams = $routeParams.searchParams;
                     }
                     $location.path("/details/" + searchParams + "/" + listingId);*/
                     httpServices.trackGoogleEvent('Clicked Property Photo from search results', 'Search Results', null, 'Property Photo');
                    console.log('Hello DEV');
                    $(".bookmark-title").removeClass('newBookmarkdiv');
                    if ($state.current.name == 'tlc.search') {
                        //httpServices.trackGoogleEvent('Property-Detail','property-list', listingId);

                        $state.go('tlc.search.propertydetail', { listingId: listingId });
                    }
                    else if ($state.current.name == 'tlc.clientSummary') {
                        //httpServices.trackGoogleEvent('Property-Detail','clientSummary', listingId);

                        $state.go('tlc.clientSummary.propertydetail', { listingId: listingId });
                    }
                    else if ($state.current.name == 'tlcClient.search') {
                        //httpServices.trackGoogleEvent('Property-Detail','property-list', listingId);

                        $state.go('tlcClient.search.propertydetail', { listingId: listingId });
                    }
                }

                $scope.getPropDetailOnMap = function (property) {
                    $rootScope.$broadcast('onPropListMouseover', { property: property });
                }
                //$scope.removePropIconCss = function (property) {
                //    $(".pincursor").each(function () {
                //        $(this).removeClass('ToggelPropIcon');
                //    });
                //}
                $rootScope.formatNumber = function (value) {
                    return utilService.formatNumber(value);
                }

                $scope.checkBoxselect = function (id) {

                    $("#i_" + id).toggleClass('checked');
                    $("#imap_" + id).toggleClass('checked');

                    var porpID = "" + id + "";

                    if ($("#i_" + id).hasClass('checked')) {
                        if ($rootScope.ComaprePropIDList.indexOf(porpID) == -1)
                            $rootScope.ComaprePropIDList.push(porpID);
                    }
                    else {
                        if ($rootScope.ComaprePropIDList.indexOf(porpID) != -1) {
                            var index = $rootScope.ComaprePropIDList.indexOf(porpID)
                            $rootScope.ComaprePropIDList.splice(index, 1);
                        }
                    }

                };

                $scope.toggleBookmark = function (id) {
                    if(document.getElementById("captureUserName").innerHTML == "Login or Register") {
                        janrain.capture.ui.start();
                    } 
                };

                $scope.openBookmarkWindow = function(listing_id) {
                    $rootScope.$broadcast("resetRating", {});
                    $scope.successResponse = true;
                    if(document.getElementById("captureUserName").innerHTML == "Login or Register") {
                        janrain.capture.ui.start();
                    } else {
                        $('#AddMozaicBookmarkModal').modal('show');
                        var sso_id = localStorage.janrainCaptureProfileData;
                        if(typeof(Storage) !== "undefined") {
                            if(localStorage.janrainCaptureProfileData) {
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
                            console.log("Success 3" + JSON.stringify(success));
                            $scope.successResponse = false;
                            var parsedSuccess = JSON.parse(success.Id);
                            if(parsedSuccess["response_code"] == 200) {
                              mozaic_projectID = parsedSuccess["show_favorites"]["favorite_list"][0]["projectId"];
                              mozaic_userId = parsedSuccess["show_favorites"]["loggedin_user"]["userId"];

                              $scope.favorites = [{
                                favorite: parsedSuccess["notification_setting"]
                              },{
                                favorite: parsedSuccess["notification_event"][0]["value"]
                              }, {
                                favorite: parsedSuccess["notification_event"][1]["value"]
                              }, {
                                favorite: parsedSuccess["notification_event"][0]["value"]
                              }];

                              $rootScope.$broadcast('myFavorites', $scope.favorites);
                            }
                            mozaic_listingId = listing_id;
                        }, function (error) {
                            $scope.successResponse = false;
                            console.log("error " + error);
                        });
                    }
                }

                $scope.setBookmarked = function(id, isBookmarked) {
                    var heart = $("#mozaic_bookmark_" + id);
                    if(isBookmarked){
//                        $(heart).removeClass('glyphicon glyphicon-heart-empty');
//                        $(heart).addClass('glyphicon glyphicon-heart');
                        return "glyphicon glyphicon-heart heart-in";
                    } else {
//                        $(heart).removeClass('glyphicon glyphicon-heart');
//                        $(heart).addClass('glyphicon glyphicon-heart-empty');
                        return "glyphicon glyphicon-heart-empty heart-in";
                    }
                };

                $scope.toggleFavorite = function (id) {
                    aaNotify.success('Work in Progress!');
                    myFunction_star("#mozaic_favorite_"+id);
                };

                $scope.ComapreProperty = function () {
                if(!$(".aa-notification").is(':visible')){                
                    $rootScope.propID = [];
                    $rootScope.isLoadingComp = true;
                    $rootScope.isBadAndBathDisplay = false;
                    if ($rootScope.ComaprePropIDList.length < 2) {
                        aaNotify.danger('select atleast two property for comparison',{
                        showClose: true,                            //close button
                        iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 3                               //time to live in ms
                        });
                        return false;          
                    }
                    else if ($rootScope.ComaprePropIDList.length > 5) {
                        aaNotify.danger('select maximum five property for compare.',{
                        showClose: true,                            //close button
                        iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 3                               //time to live in ms
                        });
                        return false;          
                    }else if ($rootScope.ComaprePropIDList.length >= 2 && $rootScope.ComaprePropIDList.length < 6) {
                        var propCompareLen = $rootScope.ComaprePropIDList.length;
                        var j = 1;
                        for (var i = 0; i < $rootScope.ComaprePropIDList.length; i++) {
                            httpServices.getPropertyDetail($rootScope.ComaprePropIDList[i]).then(function (success) {
                                if (success != undefined) {
                                  var oProp = _.find($rootScope.propertiesListingForComapare,function(o){return o.Id == success.Id});

                                  if(oProp)
                                  {
                                  oProp.Architecture = success.ListingDetail.Listing.ARCHITECTURALSTYLE;
                                  oProp.LotSize = success.ListingDetail.Listing.LOTSIZEDIMENSIONS;

                                    var LoanTypes = _.find(success.TLCInfo,function(o){return o.DownPaymentPercentage == 20});
                                    if(LoanTypes)
                                    {
                                      oProp.Mortgage_Payment = LoanTypes.MortgagePayment;
                                      oProp.Down_Payment = LoanTypes.DownPayment;
                                      oProp.HOA = LoanTypes.HOAFees;
                                      oProp.LoanAmount = LoanTypes.LoanAmount;
                                    }
                                    else {
                                      oProp.Mortgage_Payment = success.TLCInfo[0].MortgagePayment;
                                      oProp.Down_Payment = ((20 * success.TLCInfo[0].ListPrice) / 100).toFixed(2);
                                      oProp.HOA = success.TLCInfo[0].HOAFees;
                                      oProp.LoanAmount = success.TLCInfo[0].LoanAmount;
                                    }
                                  }

                                    $rootScope.propID.push((success.Id));
                                    if (j == propCompareLen) { $rootScope.isLoadingComp = false; }
                                    j++;
                                }
                            });

                        }

                    }
                    ngDialog.open({
                            template: 'views/templates/propertyComparePopup.html',
                            closeByEscape: false,
                            closeByDocument: false
                    });
                    }
                    else{
                    return false;
                  }
                }
              $rootScope.openConfirmMessage=false;

              $rootScope.removeCompProp = function (porpID) {
                  if ($rootScope.ComaprePropIDList.length <=2) {
                    $rootScope.openConfirmMessage=true;
                    $rootScope.currentRemovePropId=porpID;
                    return;
                  }
                  else
                  {
                    removeProperty(porpID);
                  }
              }

              $rootScope.removePropYes=function(){
                removeProperty($rootScope.currentRemovePropId);
                $rootScope.openConfirmMessage=false;
              }
              $rootScope.removePropNo=function(){
                $rootScope.openConfirmMessage=false;
              }

              $rootScope.printCompProp = function(){
                //httpServices.trackGoogleEvent('Print-Compare-Property','property-detail');

                printer.printFromScope('views/templates/printPropertyCompare.html', $rootScope);
              }

              function removeProperty(porpID){
                $scope.checkBoxselect(porpID);
                if ($rootScope.ComaprePropIDList.length < 2) {
                  $(".ngdialog-close").click();
                } else {
                  //$scope.ComapreProperty();
                  $rootScope.propID = [];
                  $rootScope.isLoadingComp = true;
                  if ($rootScope.ComaprePropIDList.length > 0) {
                    var propCompareLen = $rootScope.ComaprePropIDList.length;
                    var j = 1;
                    for (var i = 0; i < $rootScope.ComaprePropIDList.length; i++) {
                      httpServices.getPropertyDetail($rootScope.ComaprePropIDList[i]).then(function (success) {
                        if (success != undefined) {
                          var oProp = _.find($rootScope.propertiesListingForComapare,function(o){return o.Id == success.Id});

                          if(oProp)
                          {
                            oProp.Architecture = success.ListingDetail.Listing.ARCHITECTURALSTYLE;
                            oProp.LotSize = success.ListingDetail.Listing.LOTSIZEDIMENSIONS;

                            var LoanTypes = _.find(success.TLCInfo,function(o){return o.DownPaymentPercentage == 20});
                            if(LoanTypes)
                            {
                              oProp.Mortgage_Payment = LoanTypes.MortgagePayment;
                              oProp.Down_Payment = LoanTypes.DownPayment;
                              oProp.HOA = LoanTypes.HOAFees;
                              oProp.LoanAmount = LoanTypes.LoanAmount;
                            }
                            else {
                              oProp.Mortgage_Payment = success.TLCInfo[0].MortgagePayment;
                              oProp.Down_Payment = ((20 * success.TLCInfo[0].ListPrice) / 100).toFixed(2);
                              oProp.HOA = success.TLCInfo[0].HOAFees;
                              oProp.LoanAmount = success.TLCInfo[0].LoanAmount;
                            }
                          }

                          $rootScope.propID.push((success.Id));
                          if (j == propCompareLen) { $rootScope.isLoadingComp = false; }
                          j++;
                        }
                      });

                    }

                  }
                }

              }

                $rootScope.openMoreInfo = function () {
                    //$rootScope.isBadAndBathDisplay = true;
                    $(".expandDiv,.downMoreInfo,.upMoreInfo").toggleClass('hide');
                }

            }
        };
    }]);

