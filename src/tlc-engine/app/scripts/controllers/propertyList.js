/**
 * Created by kamal on 2/26/2015.
 */

'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the tlcengineApp
 */
angular.module('tlcengineApp')
  .controller('PropertyListCtrl', ['$scope', '$location', 'propertiesService','bookmarkService', 'utilService', '$timeout', '$state', '$stateParams', 'orderByFilter', 'applicationFactory', '$rootScope', 'aaNotify','appAuth','httpServices','$window', 'ngDialog', '$controller', 'clusterDataFactory',
    function ($scope, $location, propertiesService,bookmarkService, utilService, $timeout, $state, $stateParams, orderByFilter, applicationFactory, $rootScope, aaNotify,appAuth,httpServices,$window,ngDialog, $controller, clusterDataFactory) {
        var splitterInstance;
        $scope.bedsRange = { bedsmin: '', bedsmax: '' }; $scope.priceRange = { min: 0, max: 0 }; $scope.tlcRange = { min: 0, max: 0 }; $scope.sqftRange = { min: 0, max: 0 }; $scope.acresRange = { min: 0, max: 0 }; $scope.yearBuiltRange = { min: 0, max: 0 };

        $scope.action;
        $scope.resultsCount = 0;
        $scope.propDisplayedInList = 0;
        $scope.ActiveTotalListingsCount = 0;
        $scope.propertiesListing = [];

        $('#handle').hide();
        $('#arrowButton').show();
        if($state.current.name == 'tlcClient.search.propertydetail' || $state.current.name == 'tlc.search.propertydetail' || $state.current.name == 'tlc.PropertyDirect.MLS') {
          $('#handle').show();
          $('#arrowButton').hide();
        }

        $scope.isAgent = $('#isagentUser').val();
        if($scope.isAgent == '' || $scope.isAgent == undefined) {
          $scope.showAddress = false;
        } else {
          $scope.showAddress = true;
        }
      
        $scope.searchParameters = applicationFactory.getSearchParameters();
        $scope.propertyLoading = false;
        $scope.stopShowMore = false;
        $scope.page = { size: 20, results: [], startIndex: 0, resultStartIndex: 0, resultPageSize: 200 };
        $scope.isDrawing = false;
        $scope.drawingStatus = "Draw an area";
        $scope.clearPolygon = false;
        $scope.tags = [];
        $scope.order = {};
        $scope.bookmarkList = [];
        $scope.clearBookmark = {};
        $scope.SearchClient = '';
        $scope.boundaries = []; //{ Latitude: null, Longitude: null, Polygon: null };
        $scope.filters = undefined;

        if ($state.current.name) {
            $scope.action = $state.current.name;
        }
        $scope.stopShowMore = true;
        $scope.clusterData = [];
        $scope.clusterData = clusterDataFactory.data;        
        $("#content").addClass("property_list");


        /* to get bookmark and favorite details */
        $scope.filterAction = function () {
            /*load search result screen*/
            setTimeout(function () {
                generateSearchUI();

              if($scope.AudienceType == 'CLIENT' && $stateParams.IsBookmark == 1) {
                $scope.getBookmarksForClient();
              }
              else if($scope.AudienceType == 'CLIENT' && $stateParams.IsFavorite == 1) {
                $scope.getFavoritesForClient();
              }
              else {
                $scope.retrieveSearchParameters();
                $scope.loadFilterData();
                $rootScope.propertiesListingForComapare = []; //after
                $scope.showMore();
              }
            }, 1000);            
        }

        /* to show loader while fetching the result */
        function startLoader(){
          $scope.isDisplayProgress = true;
          $scope.firstStep = false;
          $scope.secondStep = false;
          $scope.thirdStep = false;
          $scope.fourthStep = false;
          $("#first_search").addClass("search_li_opacity");
          $("#second_search").addClass("search_li_opacity");
          $("#third_search").addClass("search_li_opacity");
          $("#fourth_search").addClass("search_li_opacity");

          $timeout(function () {
            $scope.firstStep = true;
            $("#first_search").removeClass("search_li_opacity");
            $("#second_search").addClass("search_li_opacity");
            $("#third_search").addClass("search_li_opacity");
            $("#fourth_search").addClass("search_li_opacity");
          }, 500);
          $timeout(function () {
            $scope.secondStep = true;
            $("#second_search").removeClass("search_li_opacity");
            $("#first_search").addClass("search_li_opacity");
            $("#third_search").addClass("search_li_opacity");
            $("#fourth_search").addClass("search_li_opacity");
          }, 4000);
          $timeout(function () {
            $scope.thirdStep = true;
            $("#third_search").removeClass("search_li_opacity");
            $("#first_search").addClass("search_li_opacity");
            $("#second_search").addClass("search_li_opacity");
            $("#fourth_search").addClass("search_li_opacity");
          }, 6500);
          $timeout(function () {
            $scope.fourthStep = true;
            $("#fourth_search").removeClass("search_li_opacity");
            $("#first_search").addClass("search_li_opacity");
            $("#second_search").addClass("search_li_opacity");
            $("#third_search").addClass("search_li_opacity");
          }, 9000);
        }


        $scope.closeBookmarkwindow = function() {
            $('#mozaic-bookmark-modal_list').modal('hide');
        };

        /* to get bookmark property details */
        $scope.BookmarkBoxselect = function (id) {
            $('#mozaic-bookmark-modal_list').modal('show');
            var sso_id = localStorage.janrainCaptureProfileData;
            if(typeof(Storage) !== "undefined") {
                if(localStorage.janrainCaptureProfileData) {
                    sso_id = JSON.parse(sso_id);
                    sso_id = sso_id['uuid'];
                }
            }
            var showFavMozaicReq = {
                "user_sso_id": sso_id,
                "listing_id": listing_id
            };

            propertiesService.getFavorites(showFavMozaicReq, function (success) {                
                var parsedSuccess = JSON.parse(success.Id);
                $scope.mozaic_projectID = parsedSuccess["show_favorites"]["favorite_list"][0]["projectId"];
                $scope.mozaic_userId = parsedSuccess["show_favorites"]["loggedin_user"]["userId"];

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

                $scope.mozaic_listingId = listing_id;
            }, function (error) {
                console.log("error " + error);
            });
        };

        /* To submit the bookmark for apporpriate property */
        $scope.submitBookmark = function() {
            var ASAP = false;
            if($scope.mozaicAddFavoriteEnableNotification == "ASAP") {
                ASAP = true;
            }
            var sso_id = localStorage.janrainCaptureProfileData;
            if(typeof(Storage) !== "undefined") {
                if(localStorage.janrainCaptureProfileData) {
                    sso_id = JSON.parse(sso_id);
                    sso_id = sso_id['uuid'];
                }
            }

            var requestJson = {
                "user_id":  $scope.mozaic_userId, // What is this
                "favorite_lists": [ $scope.mozaic_projectID],  // What is this
                "user_sso_id": sso_id,
                "listing_id":  $scope.mozaic_listingId, //$scope.propertyDetail.LISTINGID
                "rating_score": 3,
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

            propertiesService.addfavorites( requestJson
                , function (success) {
                    aaNotify.info("Listing is added to Mozaic successfully!", { ttl: 5000 });
                    $scope.closeBookmarkwindow();
                    console.log("success " + JSON.stringify(success));
                }, function (error) {
                    aaNotify.info("Error while saving Listings! Please try later.", { ttl: 5000 });
                    $scope.closeBookmarkwindow();
                    console.log("error " + JSON.stringify(error));
                });
        };

        /* To get client bookmark details */
        $scope.getBookmarksForClient = function () {
          $scope.propertyLoading = true;
          // start loader
          startLoader();
          // end loader

            propertiesService.getBookmarksForClient({ clientId: appAuth.getAudienceId() }
              , function (success) {
                // for loader
                $scope.firstStep = true;
                $("#first_search").removeClass("search_li_opacity");
                $("#second_search").addClass("search_li_opacity");
                $("#third_search").addClass("search_li_opacity");
                $("#fourth_search").addClass("search_li_opacity");
                $scope.secondStep = true;
                $("#second_search").removeClass("search_li_opacity");
                $("#first_search").addClass("search_li_opacity");
                $("#third_search").addClass("search_li_opacity");
                $("#fourth_search").addClass("search_li_opacity");
                $scope.thirdStep = true;
                $("#third_search").removeClass("search_li_opacity");
                $("#first_search").addClass("search_li_opacity");
                $("#second_search").addClass("search_li_opacity");
                $("#fourth_search").addClass("search_li_opacity");
                $scope.fourthStep = true;
                $("#fourth_search").removeClass("search_li_opacity");
                $("#first_search").addClass("search_li_opacity");
                $("#second_search").addClass("search_li_opacity");
                $("#third_search").addClass("search_li_opacity");
                $timeout(function () { $scope.isDisplayProgress = false; }, 1000);
                // end loader

                  /*load Property*/
                  $scope.propertyLoading = false;
                  $scope.isDisplayProgress = false;
                  $scope.stopShowMore = true;
                  $scope.isLoaded = true;
                  $scope.resultsCount = success.Count;
                  $scope.propDisplayedInList = $scope.resultsCount;
                  $scope.ActiveTotalListingsCount = success.Count;
                  $scope.propertiesListing = success.Listings;
                  $rootScope.propertiesListingForComapare = success.Listings;

                  $scope.addResults(success.Listings);
                  $scope.stopShowMore = true;

                  $timeout(function () {
                      $('.title-tipso').tipso();
                  }, 6000);

              }, function (error) {
                  $scope.propertyLoading = false;
                  $scope.isDisplayProgress = false;
                  $scope.stopShowMore = true;
                  $scope.resultsCount = 0;
              });
        }

        /* To get client favorite */
        $scope.getFavoritesForClient = function () {
          $scope.propertyLoading = true;
          // start loader
          startLoader();
          // end loader

          propertiesService.getFavoritesForClient({ clientId: appAuth.getAudienceId() }
              , function (success) {
                  // for loader
                  $scope.firstStep = true;
                  $("#first_search").removeClass("search_li_opacity");
                  $("#second_search").addClass("search_li_opacity");
                  $("#third_search").addClass("search_li_opacity");
                  $("#fourth_search").addClass("search_li_opacity");
                  $scope.secondStep = true;
                  $("#second_search").removeClass("search_li_opacity");
                  $("#first_search").addClass("search_li_opacity");
                  $("#third_search").addClass("search_li_opacity");
                  $("#fourth_search").addClass("search_li_opacity");
                  $scope.thirdStep = true;
                  $("#third_search").removeClass("search_li_opacity");
                  $("#first_search").addClass("search_li_opacity");
                  $("#second_search").addClass("search_li_opacity");
                  $("#fourth_search").addClass("search_li_opacity");
                  $scope.fourthStep = true;
                  $("#fourth_search").removeClass("search_li_opacity");
                  $("#first_search").addClass("search_li_opacity");
                  $("#second_search").addClass("search_li_opacity");
                  $("#third_search").addClass("search_li_opacity");
                  $timeout(function () { $scope.isDisplayProgress = false; }, 1000);
                  // end loader

                  /*load Property*/
                  $scope.propertyLoading = false;
                  $scope.isDisplayProgress = false;
                  $scope.stopShowMore = true;
                  $scope.isLoaded = true;
                  $scope.resultsCount = success.Count;
                  $scope.propDisplayedInList = $scope.resultsCount;
                  $scope.ActiveTotalListingsCount = success.Count;
                  $scope.propertiesListing = success.Listings;
                  $rootScope.propertiesListingForComapare = success.Listings;

                  $scope.addResults(success.Listings);
                  $scope.stopShowMore = true;

                  $timeout(function () {
                      $('.title-tipso').tipso();
                  }, 6000);

              }, function (error) {
                  $scope.propertyLoading = false;
                  $scope.isDisplayProgress = false;
                  $scope.stopShowMore = true;
                  $scope.resultsCount = 0;
              });
        }

        $scope.filterAction();

        $scope.doSearch = function () {
          $scope.searchParameters.location = applicationFactory.getLocations();
            applicationFactory.setSearchParameters($scope.searchParameters);
            $scope.updateUrlAndLoadData();
          $('.prop-list-scroll').scrollTop(0);
          $scope.$broadcast("updatepscrollbar");
        }

        /* function to save a search for drawn area */
        $scope.$on("saveSearch", function (event, searchName) {
          if(!$(".aa-notification").is(':visible')){
            if ($scope.filters != undefined) {
                var parameters = angular.copy($scope.filters);
                if(parameters.beds){
                  parameters.beds = parameters.beds.replace("+", "");
                }

                if(parameters.baths){
                  parameters.baths = parameters.baths.replace("+", "");
                }

                if(parameters.garages){
                  parameters.garages = parameters.garages.replace("+", "");
                }
                delete parameters['skip'];

                var obj = {
                    "SearchName": searchName,
                    "SearchParameters": parameters,
                    "RequiredNotification": true
                }

                var successCallback = function (success) {
                    var message = 'Search successfully saved.';
                    if ($scope.selectedClient)
                        message = 'Search successfully saved for ' + $scope.selectedClient.FullName + ".";

                    if(!$(".aa-notification").is(':visible')){
                    aaNotify.success(message);
                    $rootScope.$broadcast("searchSaved");
                  }
                  else{
                    return false;
                  }
                    //console.log("success " + success);
                };

                var errorCallback = function (error) {
                    //console.log("error " + error);
                    //aaNotify.danger('Failed to save search.');

                    var errorMessages = [];
                    if (error.data && error.data.length > 1) {
                        errorMessages.push("<ui>");
                        _.each(error.data, function (o) { errorMessages.push("<li>" + o.ErrorMessage + "</li>"); });
                        errorMessages.push("</ui>");
                    } else if (error.data && error.data.length == 1)
                        errorMessages.push("<span>" + error.data[0].ErrorMessage + "</span>");
                    else
                        errorMessages.push("Failed to load search results.");

                   if(!$(".aa-notification").is(':visible')){
                    aaNotify.danger(errorMessages.join(""),
                        {
                            showClose: true,                            //close button
                            iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                            allowHtml: true,                            //allows HTML in the message to render as HTML

                            //common to the framework as a whole
                            ttl: 1000 * 3  //time to live in ms
                        });
                    } else {
                      return false;
                    }

                };

                if ($scope.selectedClient != undefined) {
                    httpServices.saveClientSearchByAgent($scope.selectedClient.Id, obj).then(successCallback, errorCallback);
                } else {
                    httpServices.saveSearch(obj).then(successCallback, errorCallback);
                }

            }
         }

        });

        /*This methods load search parametrs from the application factory and retrieve properties based on that parameters*/
        $scope.$on("doSearch",function(event, obj){
            /*Remove bookmarked*/
            hideBookmarkStatus();
            $scope.isAddBookmark = false;
            $scope.bookmarkList = [];            
            $scope.searchParameters = applicationFactory.filterAllParameters();            
            $scope.order = applicationFactory.getSortParameters();
            if (applicationFactory.getPolygon() == undefined) {
                $scope.clearPolygon = true;
                $scope.boundaries = [];
            }

            $scope.resetPage = false;
            $scope.propertyLoading = false;
          $scope.updateUrlAndLoadData();
        });

        $rootScope.$on("onStartDrawing", function () {
            $scope.startDrawing();
        });

        /*Resest page event handler*/
        $rootScope.$on("resetPage", function () {
          $scope.page.results = [];
          $scope.resultsCount = 0;
          $scope.resetPage = true;
        });

        /* update url for searching */
        $scope.updateUrlAndLoadData = function () {
          $scope.searchParameters.location = applicationFactory.getLocations();

             var filterParam = angular.copy($scope.searchParameters);
            filterParameters(filterParam);
            var parameters = applicationFactory.generateSearchURL(filterParam);            

            if ($scope.action != 'load') {
                $scope.loadFilterData();
            }
        }

        $scope.doPolygonSearch = function (polygon) {
            /*Remove bookmarks*/
            hideBookmarkStatus();
            $scope.isAddBookmark = false;
            $scope.bookmarkList = [];
        }

        /* fetch parameter handler */
        $scope.retrieveSearchParameters = function () {
          var addresses = undefined;
          var polygons = undefined;
          var commutes = undefined;
          if ($stateParams.searchParams != undefined && $stateParams.searchParams != "") {
            var params = $stateParams.searchParams.split(";");
            for (var i = 0; i < params.length; i++) {
              var keyVal = params[i].split(':');
              if (keyVal.length == 2) {
                if (keyVal[0] == 'addresses') {
                  addresses = decodeURIComponent(keyVal[1]);
                  $scope.setSearchParameters(keyVal[0], JSON.parse(addresses));
                }else if (keyVal[0] == 'polygons'){
                  polygons = decodeURIComponent(keyVal[1])
                  $scope.setSearchParameters(keyVal[0], JSON.parse(polygons));
                }else if(keyVal[0] == 'commutemode' && keyVal[1] == "transitwalk"){
                    keyVal[1] = "transit,walk";
                    $scope.setSearchParameters(keyVal[0], keyVal[1]);
                }else if (keyVal[0] == 'commutes'){
                  commutes = decodeURIComponent(keyVal[1])
                  $scope.setSearchParameters(keyVal[0], JSON.parse(commutes));
                }else {
                    $scope.setSearchParameters(keyVal[0], keyVal[1]);
                }
              }
            }
          }else if($state.$current.name == "tlc.search" || $state.$current.name == "tlcClient.search" ){
            $scope.searchParameters = applicationFactory.filterAllParameters();
            $scope.order = applicationFactory.getSortParameters();
          }

          $scope.searchParameters.location = applicationFactory.getLocations();
          applicationFactory.setSearchParameters($scope.searchParameters, true);
        }

        /* update parameter handler for appropriate inputs/select/checkbox */
        $scope.setSearchParameters = function (key, value) {          
          switch (key) {
                case 'beds':
                    $scope.searchParameters[key] = value;
                    $("select[name=bedrooms]").val(value);
                    break;
                case 'baths':
                    $scope.searchParameters[key] = value;
                    $("select[name=bathrooms]").val(value);
                    break;
                case 'onmarket':
                    $scope.searchParameters[key] = value;
                    $("select[name=market]").val(value);
                    break;  
                case 'openhousefromdate':
                    $('#fromDate').datepicker();
                    $scope.searchParameters[key] = value;                    
                    var fromdate = new Date(value);                    
                    var monthFromDate = fromdate.getMonth()+1;
                    var dateFromDate = fromdate.getDate();
                    var yearFromDate = fromdate.getFullYear();                    
                    var modFromDate = yearFromDate+"/"+monthFromDate+"/"+dateFromDate;
                    var setFromDate = dateFromDate+"/"+monthFromDate+"/"+yearFromDate;
                    $("input[name=fromDate]").val(modFromDate);
                    $scope.searchParameters.openhousefromdate = modFromDate;
                    $("input[ng-model='openHouseOnly']").prev().attr("class","checked");
                    $scope.searchParameters.openHouseOnly = true;
                    $( "#fromDate" ).datepicker( "option", "disabled", false );
                    $('#fromDate').datepicker('setDate', setFromDate);                    
                    $("input[ng-model='openhousefromdate']").removeAttr("disabled");
                    break;
                case 'openhousetodate':
                    $('#toDate').datepicker();
                    $scope.searchParameters[key] = value;
                    var todate = new Date(value);
                    var monthToDate = todate.getMonth()+1;
                    var dateToDate = todate.getDate();
                    var yearToDate = todate.getFullYear();                    
                    var modToDate = yearToDate+"/"+monthToDate+"/"+dateToDate;
                    var setToDate = dateToDate+"/"+monthToDate+"/"+yearToDate;
                    $("input[name=toDate]").val(modToDate);
                    $scope.searchParameters.openhousetodate = modToDate;
                    $("input[ng-model='openHouseOnly']").prev().attr("class","checked");
                    $scope.searchParameters.openHouseOnly = true;                    
                    $( "#toDate" ).datepicker( "option", "disabled", false );
                    $('#toDate').datepicker('setDate', setToDate);                    
                    $("input[ng-model='openhousetodate']").removeAttr("disabled");
                    break;
                case 'propertytype':
                    $scope.searchParameters[key] = value;
                  switch(value){
                      case 'Residential':
                          $("select[name=proptype]").val("Residential");
                          angular.element('#family').css("display","none");
                          angular.element('#residential').css("display","block");
                          angular.element('#commercial').css("display","none");
                          angular.element('#land').css("display","none");
                          angular.element('#stylehome').css("display","block");
                          break;
                          
                      case 'com':
                          $("select[name=proptype]").val("Commercial");
                          angular.element('#family').css("display","none");
                          angular.element('#residential').css("display","none");
                          angular.element('#commercial').css("display","block");
                          angular.element('#land').css("display","none");
                          angular.element('#stylehome').css("display","none");
                          break;
                          
                      case 'multifamily':
                        $("select[name=proptype]").val("Multi-Family");    
                        angular.element('#family').css("display","block");
                        angular.element('#residential').css("display","none");
                        angular.element('#commercial').css("display","none");
                        angular.element('#land').css("display","none");
                        break;
                          
                      case 'land':
                        $("select[name=proptype]").val("Lot-Land");      
                        angular.element('#family').css("display","none");
                        angular.element('#residential').css("display","none");
                        angular.element('#commercial').css("display","none");
                        angular.element('#land').css("display","block");
                        angular.element('#stylehome').css("display","none");
                        break;
                        
                      default:
                        $("select[name=proptype]").val("Residential");
                        angular.element('#family').css("display","none");
                        angular.element('#residential').css("display","block");
                        angular.element('#commercial').css("display","none");
                        angular.element('#land').css("display","none");
                        angular.element('#stylehome').css("display","block");
                        break;
                    }
                    break;
                case 'propertysubtype':
                    $scope.searchParameters[key] = value;                  
                  var propTypeName = $("select[name=proptype]").val();
                  var propTag = "";
                  switch(propTypeName){
                      case 'Residential':
                          propTag = "input:checkbox[name='ResidentialSales[]']";
                          break;
                      case 'Multi-Family':
                          propTag = "input:checkbox[name='familyCriteria[]']";
                          break;
                      case 'Lot-Land':
                          propTag = "input:checkbox[name='landCriteria']";
                          break;
                      case 'Commercial':
                          propTag = "input:checkbox[name='commercialCriteria[]']";
                          break;
                      default:
                          propTag = "input:checkbox[name='ResidentialSales[]']";
                          break;
                  }
                    var subPropTypes = value.split(',');
                    $(propTag).each(function() {
                      for(var i=0; i < subPropTypes.length; i++){
                        if (this.value == subPropTypes[i]) {
                          this.checked = true;
                        }
                      }
                    });
                    break;
                case 'localelistingstatus':
                    $scope.searchParameters[key] = value;
                    var localelisting = value.split(',');
                    $('input:checkbox[name="localelistingstatus[]"]').each(function() {
                      for(var i=0; i < localelisting.length; i++){                        
                        if (this.value == localelisting[i]) {
                          $("input[value='" + this.value + "']").prev().attr("class","checked");
                          $("input[value='" + this.value + "']").prop('checked',true);                          
                        }
                      }
                    });
                    break;
                case 'bodyofwater':
                    $scope.searchParameters[key] = value;
                    $("input[name=BodyOfWater]").val(value);
                    $scope.searchParameters.bodyofwater = value;
                    break;
                case 'waterfront':
                    $scope.searchParameters[key] = value;
                    $("input[name='WaterFront']").prev().attr("class","checked");
                    $("input[name='WaterFront']").prop('checked',true);
                    break; 
                case 'waterview':
                    $scope.searchParameters[key] = value;
                    $("input[name='WaterView']").prev().attr("class","checked");
                    $("input[name='WaterView']").prop('checked',true);
                    break; 
                case 'wateraccess':
                    $scope.searchParameters[key] = value;
                    $("input[name='WaterAccess']").prev().attr("class","checked");
                    $("input[name='WaterAccess']").prop('checked',true);
                    break;
                case 'pricechange':
                    $scope.searchParameters[key] = value;
                    $("input[name='PriceChange']").prev().attr("class","checked");
                    $("input[name='PriceChange']").prop('checked',true);
                    break;  
                case 'foreclosure':
                    $scope.searchParameters[key] = value;
                    $("input[name='Foreclosures']").prev().attr("class","checked");
                    $("input[name='Foreclosures']").prop('checked',true);
                    break;  
                case 'ispetsallowed':
                    $scope.searchParameters[key] = value;
                    $("select[name=pets]").val(value);
                    break; 
                case 'addresses':
                    if(value != undefined){
                      for(var i=0; i<value.length;i++){
                        applicationFactory.addAddress(value[i]);
                      }
                    }
                    //$scope.searchParameters.locations.push(value);
                    break;
                case 'polygons':
                  if(value != undefined){
                    for(var i=0; i<value.length;i++){
                      applicationFactory.addPolygon(value[i]);
                    }
                  }
                  break;
                case 'orderby':
                    $scope.order.orderby = value;
                    $scope.searchParameters[key] = value;
                    break;
                case 'orderbydirection':
                    $scope.order.orderbydirection = value;
                    $scope.searchParameters[key] = value;
                    break;
                   case 'ownershiptype':
                    $scope.searchParameters[key] = value;
                    var ownershiptype = value.split(',');
                    // var OwnershipType = [];
                    $('input:checkbox[name="OwnershipType[]"]').each(function() {
                      for(var i=0; i < ownershiptype.length; i++){
                        if (this.value == ownershiptype[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;
                case 'basement':
                    $scope.searchParameters[key] = value;
                    $("input[name='IsBasement']").next().attr("class","checked");
                    $("input[name='IsBasement']").prop('checked',true);
                    break;
                case 'elevator':
                    $scope.searchParameters[key] = value;
                    $("input[name='Elevator']").next().attr("class","checked");
                    $("input[name='Elevator']").prop('checked',true);
                    break;
                case 'builtinshelf':
                    $scope.searchParameters[key] = value;
                    $("input[name='builtinshelves']").next().attr("class","checked");
                    $("input[name='builtinshelves']").prop('checked',true);
                    break;
                case 'woodfloor':
                    $scope.searchParameters[key] = value;
                    $("input[name='IsWoodFloor']").next().attr("class","checked");
                    $("input[name='IsWoodFloor']").prop('checked',true);
                    break;
                case 'fireplace':
                    $scope.searchParameters[key] = value;
                    $("input[name='Fireplace']").next().attr("class","checked");
                    $("input[name='Fireplace']").prop('checked',true);
                    break;
                case 'handicapequiped':
                    $scope.searchParameters[key] = value;
                    $("input[name='HandicapEquipped']").next().attr("class","checked");
                    $("input[name='HandicapEquipped']").prop('checked',true);
                    break;
                case 'cedarcloset':
                    $scope.searchParameters[key] = value;
                    $("input[name='Cedar']").next().attr("class","checked");
                    $("input[name='Cedar']").prop('checked',true);
                    break;
                case 'coolingtype':
                    $scope.searchParameters[key] = value;
                    var coolingType = value.split(',');
                    // var OwnershipType = [];
                    $('input:checkbox[name="Cooling[]"]').each(function() {
                      for(var i=0; i < coolingType.length; i++){
                        if (this.value == coolingType[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;
              case 'coolingfuel':
                   $scope.searchParameters[key] = value;
                    var coolingFuel = value.split(',');
                    $('input:checkbox[name="CoolingFuel[]"]').each(function() {
                      for(var i=0; i < coolingFuel.length; i++){
                        if (this.value == coolingFuel[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;
                case 'poolfuture':
                    $scope.searchParameters[key] = value;
                    var poolFuture = value.split(',');
                    // var OwnershipType = [];
                    $('input:checkbox[name="PoolFeature[]"]').each(function() {
                      for(var i=0; i < poolFuture.length; i++){
                        if (this.value == poolFuture[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;
                case 'garages':
                    $scope.searchParameters[key] = value;
                    $("select[ng-model=parking]").val(value);
                    break;
                case 'communityrule':
                    $scope.searchParameters[key] = value;
                    $("select[ng-model=CommunityRules]").val(value);
                    break;
                case 'isagerestricted':
                    $scope.searchParameters[key] = value;
                    $("select[ng-model=IsAgeRestricted]").val(value);
                    break;
                case 'propertystyle':
                    $scope.searchParameters[key] = value;
                    var poolFuture = value.split(',');
                    // var OwnershipType = [];
                    $('input:checkbox[name="StyleOfHome[]"]').each(function() {
                      for(var i=0; i < poolFuture.length; i++){
                        if (this.value == poolFuture[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;
               case 'propertystylenone':
                  $scope.searchParameters[key] = value;
                   $("input[value='" + value +"']").next().attr("class","checked");
                   $("input[value='" + this.value +"']").prop('checked',true);
                    break;
                case 'storylevel':
                    $scope.searchParameters[key] = value;
                    var storyLevel = value.split('%2C');
                    $('input:checkbox[name="StoryLevel[]"]').each(function() {
                      for(var i=0; i < storyLevel.length; i++){
                        if (this.value == storyLevel[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;                
                case 'schoolname':                  
                    $scope.searchParameters[key] = decodeURIComponent(value).split(',');
                    var fileterSplit = $scope.searchParameters[key];
                    var schoolValues = [];
                    for (var i = 0; i < fileterSplit.length; i++) {
                      var splitValues = fileterSplit[i].split('::');
                      schoolValues.push(splitValues[1].trim());
                    }
                    console.log(schoolValues);                    
                    break;
                case 'coolingfuel':
                   $scope.searchParameters[key] = value;
                    var coolingFuel = value.split(',');
                    $('input:checkbox[name="CoolingFuel[]"]').each(function() {
                      for(var i=0; i < coolingFuel.length; i++){
                        if (this.value == coolingFuel[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;
                case 'poolfuture':
                    $scope.searchParameters[key] = value;
                    var poolFuture = value.split(',');
                    // var OwnershipType = [];
                    $('input:checkbox[name="PoolFeature[]"]').each(function() {
                      for(var i=0; i < poolFuture.length; i++){
                        if (this.value == poolFuture[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;
                case 'garages':
                    $scope.searchParameters[key] = value;
                    $("select[ng-model=parking]").val(value);
                    break;
                case 'communityrule':
                    $scope.searchParameters[key] = value;
                    $("select[ng-model=CommunityRules]").val(value);
                    break;
                case 'isagerestricted':
                    $scope.searchParameters[key] = value;
                    $("select[ng-model=IsAgeRestricted]").val(value);
                    break;
                case 'propertystyle':
                    $scope.searchParameters[key] = value;
                    var poolFuture = value.split(',');
                    // var OwnershipType = [];
                    $('input:checkbox[name="StyleOfHome[]"]').each(function() {
                      for(var i=0; i < poolFuture.length; i++){
                        if (this.value == poolFuture[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;               
                case 'storylevel':
                    $scope.searchParameters[key] = value;
                    var storyLevel = value.split('%2C');
                    $('input:checkbox[name="StoryLevel[]"]').each(function() {
                      for(var i=0; i < storyLevel.length; i++){
                        if (this.value == storyLevel[i]) {
                          $("input[value='" + this.value +"']").next().attr("class","checked");
                          $("input[value='" + this.value +"']").prop('checked',true);
                        }
                      }
                    });
                    break;
                case 'den':
                    $scope.searchParameters[key] = value;
                    $("input[value='Den']").next().attr("class","checked");
                    $("input[value='Den']").prop('checked',true);
                    break;
                case 'isfamilyroom':
                    $scope.searchParameters[key] = value;
                    $("input[value='IsFamilyRoom']").next().attr("class","checked");
                    $("input[value='IsFamilyRoom']").prop('checked',true);
                    break;
                case 'isinlaw':
                    $scope.searchParameters[key] = value;
                    $("input[value='IsInLaw']").next().attr("class","checked");
                    $("input[value='IsInLaw']").prop('checked',true);
                    break;
                case 'islibrary':
                    $scope.searchParameters[key] = value;
                    $("input[value='IsLibrary']").next().attr("class","checked");
                    $("input[value='IsLibrary']").prop('checked',true);
                    break;
                case 'isloft':
                    $scope.searchParameters[key] = value;
                    $("input[value='IsLoft']").next().attr("class","checked");
                    $("input[value='IsLoft']").prop('checked',true);
                    break;
                case 'issunroom':
                    $scope.searchParameters[key] = value;
                    $("input[value='IsSunRoom']").next().attr("class","checked");
                    $("input[value='IsSunRoom']").prop('checked',true);
                    break;
                case 'isworkshop':
                    $scope.searchParameters[key] = value;
                    $("input[value='IsWorkshop']").next().attr("class","checked");
                    $("input[value='IsWorkshop']").prop('checked',true);
                break;
                default:
                    if(value.indexOf("-") != -1 && key != 'ficoscore' && key != 'lifestyle') {
                      $scope.searchParameters[key] = value.replace(/-/g, "");  
                    } else {
                      $scope.searchParameters[key] = value;
                    }
                    
                    /*Load home screen*/
                    break;
            }
        }

        /*Remove unnecessary parameters*/
        function filterParameters(filters) {
            for (var key in filters) {
                if (filters[key] == undefined || filters[key] == null || filters[key] == '') {
                    delete filters[key];
                } else {
                    switch (key) {
                        case 'livingareamin':
                        case 'livingareamax':
                            if ((filters['livingareamin'] == undefined) || (filters['livingareamax'] == undefined) || (utilService.removeCommasFromNumber(filters['livingareamin']) == $scope.sqftRange.min
                              && utilService.removeCommasFromNumber(filters['livingareamax']) == $scope.sqftRange.max)) {
                                delete filters['livingareamin'];
                                delete filters['livingareamax'];
                            }
                            break;
                        case 'tlcmin':
                        case 'tlcmax':
                            if ((filters['tlcmin'] == undefined) || (filters['tlcmax'] == undefined) || (utilService.removeCommasFromNumber(filters['tlcmin']) == $scope.tlcRange.min
                              && utilService.removeCommasFromNumber(filters['tlcmax']) == $scope.tlcRange.max)) {
                                delete filters['tlcmin'];
                                delete filters['tlcmax'];
                            }
                            break;                       
                        case 'bedsmin':
                        case 'bedsmax':
                        if ((filters['bedsmin'] == undefined) || (filters['bedsmax'] == undefined) || (utilService.removeCommasFromNumber(filters['bedsmin']) == $scope.bedsRange.bedsmin
                            && utilService.removeCommasFromNumber(filters['bedsmax']) == $scope.bedsRange.bedsmax)) {
                            delete filters['bedsmin'];
                            delete filters['bedsmax'];
                        }
                        break;
                        case 'acresmin':
                        case 'acresmax':
                            if ((filters['acresmin'] == undefined) || (filters['acresmax'] == undefined) || (parseFloat(utilService.removeCommasFromNumber(filters['acresmin'])) == $scope.acresRange.min
                              && parseFloat(utilService.removeCommasFromNumber(filters['acresmax'])) == $scope.acresRange.max)) {
                                delete filters['acresmin'];
                                delete filters['acresmax'];
                            }
                            break;
                        case 'yearbuiltmin':
                        case 'yearbuiltmax':
                            if ((filters['yearbuiltmin'] == undefined) || (filters['yearbuiltmax'] == undefined) || (filters['yearbuiltmin'] == $scope.yearBuiltRange.min
                              && filters['yearbuiltmax'] == $scope.yearBuiltRange.max)) {
                                delete filters['yearbuiltmin'];
                                delete filters['yearbuiltmax'];
                            }
                            break;
                        default:
                            //delete filters[key];
                            break;
                    }
                }

            }
            return filters;
        }

        $scope.displayPage = function (startIndex) {
            if ($scope.propertiesListing.length > 0) {
                if (startIndex < $scope.propertiesListing.length) {
                    var endIndex = startIndex + $scope.page.size;
                    if ($scope.propertiesListing.length < endIndex) {
                        endIndex = $scope.propertiesListing.length;
                    }

                    for (var i = startIndex + 1; i <= endIndex; i++) {
                        $scope.page.results.push($scope.propertiesListing[i]);
                    }
                }

                $scope.page.startIndex = endIndex;
            }

        }


        /* number format */
        $scope.formatNumber = function (value) {
            return utilService.formatNumber(value);
        }

        $scope.startDrawing = function () {
            $scope.isDrawing = !$scope.isDrawing;
            if ($scope.isDrawing) {
                $scope.drawingStatus = "Cancel drawing";
            } else {
                $scope.drawingStatus = "Draw an area";
            }
        }

        $scope.drawingCompleteCallback = function (drawingData) {
            $scope.isDrawing = false;
            $scope.drawingStatus = "Redraw the area";
            applicationFactory.addPolygon(drawingData.polygon);
            $rootScope.$broadcast("onDrawingComplete", drawingData.polygon);
            $scope.doPolygonSearch(drawingData.polygon);
            if (!$scope.$$phase)
                $scope.$apply();
        }

        $scope.validateAddress = function (filters) {
            var mlsNumberPattern = utilService.getMLSNumberPattern();
            var keywordPattern = utilService.getKeywordPattern();
            if (mlsNumberPattern.test(filters.location) || keywordPattern.test(filters.location)) {
                filters.keywords = angular.copy(filters.location);
                filters.location = undefined;
            }

            if (applicationFactory.getPolygon() != undefined || applicationFactory.getPolygon() != null) {
                filters.location = applicationFactory.getPolygon();
            }

            if (filters.location) {
                filters.location = encodeURIComponent(filters.location);
            }
        }

        $scope.loadFilterData = function () {          
            $scope.searchParameters.location = applicationFactory.getLocations();
            var filters = angular.copy($scope.searchParameters);
            if (filters.location) {
                //$scope.validateAddress(filters);
                //          filters.location = encodeURIComponent(filters.location);
            }
            filterParameters(filters);

            if ($scope.propertyLoading == true) {
                return 0;
            }

            if (filters.beds) {
                filters.beds = filters.beds + "g";
            }

            if (filters.baths) {
                filters.baths = filters.baths + "g";
            }

            if (filters.garages) {
                filters.garages = filters.garages + "g";
            }

            if (filters.commutetimemins) {
                filters.commutetimemins = filters.commutetimemins.replace(" min", "");
            }

            if ($state.current.name && $state.current.name != 'tlc.home' && $state.current.name != 'tlcClient.home' && $state.current.name != 'tlc.legal') {
                if ((filters.location == undefined || filters.location == '') && filters.polygon == undefined && (filters.keywords == undefined || filters.keywords == '') && (filters.commutes == undefined || filters.commutes.length == 0)) {
                    filters.mapbound = getMapBounds();
                }
            }
            $scope.filters = angular.copy(filters);
            $scope.stopShowMore = false;
            $scope.page.results = [];
            $scope.isLoaded = false;
            $scope.resultsCount = 0;
            if ($scope.resultsCount == 0 && $scope.propertyLoading == false) {
                $rootScope.propertiesListingForComapare = []; //after
                $scope.propertyLoading = false;
                $scope.showMore();
            }
        }

        $scope.addResults = function (list) {
            for (var i = 0; i < list.length; i++) {
                $scope.page.results.push(list[i]);
            }
        }


        $scope.requests = [];

        $scope.showMore = function () {
          if ($scope.propertyLoading == true || $scope.resetPage == true) {
                return 0;
            }
      
            if (($state.current.name != 'tlc.search' && $state.current.name != 'tlcClient.search') || $scope.propertyLoading == true || $scope.stopShowMore == true || ($scope.propDisplayedInList == $scope.resultsCount && $scope.resultsCount != 0)) {
                return 0;
            }
      
            if($scope.propDisplayedInList < $scope.page.results.length){
              $scope.propDisplayedInList = $scope.propDisplayedInList + 10;

              if($scope.propDisplayedInList > $scope.page.results.length)
                $scope.propDisplayedInList = $scope.page.results.length;

              return 0;
            }
            if($scope.page.results.length == 0)
            {
              $scope.propDisplayedInList = 0;
            }

            
            $scope.propertyLoading = true;
            
            var filters = angular.copy($scope.filters);
            
            var searchFilter = applicationFactory.filterAllParameters();
            searchFilter.baths = searchFilter.baths ? searchFilter.baths.replace("+","") + "+" : "ANY";
            searchFilter.beds = searchFilter.beds ? searchFilter.beds.replace("+","") + "+" : "ANY";
            searchFilter.garages = searchFilter.garages ? searchFilter.garages.replace("+","") + "+" : "ANY";
            searchFilter.numberofunits = searchFilter.numberofunits ? searchFilter.numberofunits.replace("+","") + "+" : "ANY";
            searchFilter.propertytype = searchFilter.propertytype || "Residential";

            var schooldistricts = [];
            if(searchFilter.schoolname && $scope.$parent.schoolsdistrict)
            {
              var tempSchooldist = decodeURIComponent(searchFilter.schoolname).split(",");

              _.each(tempSchooldist,function(o){
                var temps = o.split("::");
                var tempFind = _.find($scope.$parent.schoolsdistrict,function(o){return o.Id == temps[0]});
                if(tempFind)
                {
                  schooldistricts.push(tempFind);
                }
              });
            }
            if($scope.$parent.schooldistricts)
              $scope.$parent.schooldistricts = schooldistricts;

            var propertystyles = [];
            if(searchFilter.propertystyle)
            {
              var settings = applicationFactory.getSettings();
              var PropertyType =  (searchFilter.propertytype).toUpperCase();
              var tempStyle = decodeURIComponent(searchFilter.propertystyle).split(",");

              _.each(settings.PropertyStyles,function(o){
                if(o.PropertyType == PropertyType && tempStyle.indexOf(o.Value) > -1)
                  propertystyles.push(o);
              });
            }
            $scope.$parent.propertystyles = propertystyles;

            if(searchFilter.loantype)
            {
              $scope.ChangeLoanType(false);
            }

            var propertyStatus = [];
            if(searchFilter.status)
            {
              propertyStatus = decodeURIComponent(searchFilter.status).split(",");
            }
            else
            {
              propertyStatus.push('All');
            }
            if($scope.$parent.propertyStatus)
              $scope.$parent.propertyStatus = propertyStatus;

            var contingencies = [];
            if(searchFilter.contingent)
            {
              var tempContingencies = decodeURIComponent(searchFilter.contingent).split(",");

              _.each(tempContingencies,function(o){
                var temps = o.split("::");
                var tempFind = _.find($scope.$parent.ContingentList,function(o){return o.value == temps[1]});
                if(tempFind)
                {
                  contingencies.push(tempFind);
                }
              });
            }

            if($scope.$parent.contingencies)
              $scope.$parent.contingencies = contingencies;

            //$scope.$parent.searchParameters.commutetimemins = '';
            $scope.$parent.searchFilter = searchFilter;

            filters.skip = $scope.page.results.length;            
          
            if(filters.location != undefined && filters.location.length > 1) {
              filters.location.shift();
            }

            filters.isagentuser = $('#isagentUser').val() ? 1 : 0;
            
            if(filters.bedsmax != undefined) {
              if(filters.bedsmax.indexOf("-")  == -1) {
                filters.bedsmax = filters.bedsmax+"-";
              }  
            }
            
            /*---Fix for multiple location search---*/
            var locationArrayFilter = angular.copy(filters);
            //locationArrayFilter.location = []
            if(filters.location != undefined && filters.location != ""){               

              var locations = [];
              for(var i=0; i< filters.location.length; i++){
                locations.push(decodeURIComponent(filters.location[i]));
              }
              locationArrayFilter.location = angular.copy(locations);
            }

          if (filters.schoolname != undefined && filters.schoolname != "") {

            var schools = decodeURIComponent(filters.schoolname).split(",");
            var schooldistrict = [];
            for(var i = 0;i < schools.length; i++)
            {
              schooldistrict.push(schools[i].split('::')[0].trim());
              //schooldistrict.push(schools[i].substr(schools[i].indexOf("-")).replace(/(^-)|(-$)/g, "").trim());
            }
            locationArrayFilter.schoolname = schooldistrict.join(",");

            locationArrayFilter.mapbound = null;            
          }

          if (filters.propertystyle != undefined && filters.propertystyle != "") {

            var styles = decodeURIComponent(filters.propertystyle).split(",");
            var propertystyle = [];
            for(var i = 0;i < styles.length; i++)
            {
              propertystyle.push(styles[i].trim());
            }
            locationArrayFilter.propertystyle = propertystyle.join(",");
          }

          if(locationArrayFilter.addresses != undefined){
            delete locationArrayFilter.addresses;
          }

          if(locationArrayFilter.polygons != undefined){
            delete locationArrayFilter.polygons;
          }

          if (filters.beds) {
            locationArrayFilter.beds = filters.beds.replace("+", "");
          }

          if (filters.baths) {
            locationArrayFilter.baths = filters.baths.replace("+", "");
          }

          if (filters.garages) {
            locationArrayFilter.garages = filters.garages.replace("+", "");
          }

          locationArrayFilter.propertytype = filters.propertytype || "Residential";          

          if(filters.contingent == "All")
          {
            delete filters.contingent;
            delete locationArrayFilter.contingent;
          }

          if (filters.contingent != undefined && filters.contingent != "") {
            var contingencies = decodeURIComponent(filters.contingent).split(",");
            var contingent = [];
            for(var i = 0;i < contingencies.length; i++)
            {
              contingent.push(contingencies[i].split('::')[1].trim());
            }
            locationArrayFilter.contingent = contingent.join(",");
          }

            /*---End---*/

            // start loader
            $scope.isDisplayProgress = true;
            $scope.firstStep = false;
            $scope.secondStep = false;
            $scope.thirdStep = false;
            $scope.fourthStep = false;
            $("#first_search").addClass("search_li_opacity");
            $("#second_search").addClass("search_li_opacity");
            $("#third_search").addClass("search_li_opacity");
            $("#fourth_search").addClass("search_li_opacity");

            $timeout(function () {
                $scope.firstStep = true;
                $("#first_search").removeClass("search_li_opacity");
                $("#second_search").addClass("search_li_opacity");
                $("#third_search").addClass("search_li_opacity");
                $("#fourth_search").addClass("search_li_opacity");
            }, 1500);
            $timeout(function () {
                $scope.secondStep = true;
                $("#second_search").removeClass("search_li_opacity");
                $("#first_search").addClass("search_li_opacity");
                $("#third_search").addClass("search_li_opacity");
                $("#fourth_search").addClass("search_li_opacity");
            }, 4000);
            $timeout(function () {
                $scope.thirdStep = true;
                $("#third_search").removeClass("search_li_opacity");
                $("#first_search").addClass("search_li_opacity");
                $("#second_search").addClass("search_li_opacity");
                $("#fourth_search").addClass("search_li_opacity");
            }, 6500);
            $timeout(function () {
                $scope.fourthStep = true;
                $("#fourth_search").removeClass("search_li_opacity");
                $("#first_search").addClass("search_li_opacity");
                $("#second_search").addClass("search_li_opacity");
                $("#third_search").addClass("search_li_opacity");
            }, 9000);
            // end loader

            if($scope.requests.length > 0)
            {
              angular.forEach($scope.requests, function(request) {
                request.cancel("User cancelled");
              });

              $scope.requests = [];
            }

            var request = bookmarkService.getProperties(locationArrayFilter);
            $scope.requests.push(request);

            request.promise.then(function(success){
              $scope.requests.splice($scope.requests.indexOf(request), 1);

              // for loader
              $scope.firstStep = true;
              $("#first_search").removeClass("search_li_opacity");
              $("#second_search").addClass("search_li_opacity");
              $("#third_search").addClass("search_li_opacity");
              $("#fourth_search").addClass("search_li_opacity");
              $scope.secondStep = true;
              $("#second_search").removeClass("search_li_opacity");
              $("#first_search").addClass("search_li_opacity");
              $("#third_search").addClass("search_li_opacity");
              $("#fourth_search").addClass("search_li_opacity");
              $scope.thirdStep = true;
              $("#third_search").removeClass("search_li_opacity");
              $("#first_search").addClass("search_li_opacity");
              $("#second_search").addClass("search_li_opacity");
              $("#fourth_search").addClass("search_li_opacity");
              $scope.fourthStep = true;
              $("#fourth_search").removeClass("search_li_opacity");
              $("#first_search").addClass("search_li_opacity");
              $("#second_search").addClass("search_li_opacity");
              $("#third_search").addClass("search_li_opacity");
              $timeout(function () { $scope.isDisplayProgress = false; }, 1000);
              // end loader

                var SearchTag = $(".search-criteria-container").height();
                $("#content #proplistpage").css("padding-top", SearchTag+150+"px");
                
              $scope.isLoaded = true;
              $scope.resultsCount = success.ResultsCount;
              $scope.ActiveTotalListingsCount = success.ActiveTotalListingsCount;
              $scope.propertiesListing = success.Listings;
              //$rootScope.propertiesListingForComapare.push(success.Listings);
              for (var i = 0; i < success.Listings.length; i++) {
                $rootScope.propertiesListingForComapare.push(success.Listings[i]);
                $scope.displayPropCount = $rootScope.propertiesListingForComapare.length;
              }              
              $scope.boundaries = success.Boundaries;
              //}
              var polygons = applicationFactory.getPolygons();
              if(polygons != undefined && polygons.length > 0){
                if($scope.boundaries == null || $scope.boundaries == undefined){
                  $scope.boundaries = [];
                }

                for(var i=0; i<polygons.length; i++){
                  var latlogs = polygons[i].split(',');
                  var larlongs = [];
                  for(var j=0; j<latlogs.length; j++){
                    var geoLocation = latlogs[j].split(' ');
                    larlongs.push([geoLocation[0], geoLocation[1]]);
                  }

                  $scope.boundaries.push({'Polygon' : larlongs});
                }
              }
              $scope.addResults(success.Listings);

              if($scope.propDisplayedInList < $scope.page.results.length){
                $scope.propDisplayedInList = $scope.propDisplayedInList + 10;
              }

              if($scope.propDisplayedInList > $scope.page.results.length)
                $scope.propDisplayedInList = $scope.page.results.length;

              if (success.Listings.length == 0) {
                $scope.stopShowMore = true;
              }
              $scope.clusterData = clusterDataFactory.data;
              $timeout(function () {
                $scope.propertyLoading = false;
              }, 1000);
              $timeout(function () {
                $('.title-tipso').tipso();
              }, 6000);

              /*end load property*/              

            }, function(error){
              if($scope.requests.indexOf(request) > -1)
                $scope.requests.splice($scope.requests.indexOf(request), 1);
              
              if(error.data == null)
                return false;

              $scope.propertyLoading = false;
              $scope.isDisplayProgress = false;
              $scope.stopShowMore = true;
              $scope.resultsCount = 0;

              if (error.status != 401) {
                var errorMessages = [];
                if (error.data && error.data.length > 1) {
                  errorMessages.push("<ui>");
                  _.each(error.data, function (o) { errorMessages.push("<li>" + o.ErrorMessage + "</li>"); });
                  errorMessages.push("</ui>");
                } else if (error.data && error.data.length == 1)
                  errorMessages.push("<span>" + error.data[0].ErrorMessage + "</span>");
                else
                  errorMessages.push("Failed to load search results.");

                aaNotify.danger(errorMessages.join(""),
                  {
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML

                    //common to the framework as a whole
                    ttl: 1000 * 10  //time to live in ms
                  });
              }
            });
        }

        /* back button hanlder */
        $scope.back = function () {
            switch ($state.current.name) {
                case 'tlc.search':
                    $state.go("tlc.home");
                    break;
                case 'tlcClient.search':
                    $state.go("searchHome");
                    break;
                case 'tlcClient.search.propertydetail':                    
                case 'tlc.search.propertydetail':
                case 'tlc.search.newClient':
                    $("#content_overlay").hasClass("visible") ? (0 == $("li.detail").length ? ($(this).removeClass("visible"),
                      $("#content").animate({
                          width: $.cookie("tlc_hpos") + "%"
                      }, 300), $("#map").animate({
                          width: 100 - $.cookie("tlc_hpos") + "%"
                      }, 300)) : /*$("li.detail").scrollbar(), $("#content_overlay").scrollbar("destroy"),*/
                      $("#content_overlay, #map_overlay").removeClass("visible"), k()) : ($(this).removeClass("visible"),
                      setTimeout(function () {
                          setTimeout(function () {
                             $("#results > li").css("opacity", 1);
                          }, 600);
                          var a = $("li.detail"), b = $("#results li[ListingId=" + $stateParams.listingId + "]");
                        if($(window).width() > 1024) {
                          $("#content").animate({
                            width: "30%"//$.cookie("tlc_hpos") + "%"
                          }, 300), $("#map").animate({
                            width: "70%"//100 - $.cookie("tlc_hpos") + "%"
                          }, 300);
                        }else {
                          $("#content").animate({
                            width: 400//$.cookie("tlc_hpos") + "%"
                          }, 300), $("#map").animate({
                            width: $(window).width() - 400//100 - $.cookie("tlc_hpos") + "%"
                          }, 300);
                        }                          
                      }, 300)), !1;

                    if ($state.current.name == 'tlcClient.search.propertydetail') {
                        $state.go("tlcClient.search");
                    }
                    else if ($state.current.name == 'tlc.search.propertydetail') {
                        $state.go("tlc.search");
                    }
                    //$state.go("tlc.search");
                  $(".propertyfixdiv").removeClass('show');
                  $("#search").removeClass("hide");
                  $("#search").addClass("show");
                    $("#content").removeClass("PropDetailPage");
                  $("#map").removeClass("PropDetailMap");
                    $("#back").removeClass("visible");
                    $(".bookmark-title").addClass('newBookmarkdiv');
                    $("#prpertyFoundList").show();
                    $("#bookmarkprpertyFoundList").show();
                    $("ul#results").show();
                    $("#results").removeAttr("class");                    
                    $(".initialInfoBox").addClass('hide');
                    $(".initialInfoBox").removeClass('show');

                    $(".propertyfixdiv").addClass('hide');
                    $("h1#logo, h2#slogan, form#search").addClass('show');
                    $("h1#logo, h2#slogan, form#search").removeClass('hide');                    

                    break;
                default:
                    /*Load home screen*/
            }
        }


        $rootScope.$on('$stateChangeSuccess',
          function (event, toState, toParams, fromState, fromParams) {
              $rootScope.$broadcast('setPropertyList');

          });

      /* Sorting option hanlder */
      $scope.sortProperties = function (title,orderby,orderbydirection,field) {
        httpServices.trackGoogleEvent('Sort drop down', 'Search Results', null, 'Sort drop down');
        var searchObj = {};
        searchObj['orderby'] = orderby;
        searchObj['orderbydirection'] = orderbydirection;
        applicationFactory.setSortParameters(searchObj);

        if(($scope.AudienceType == 'CLIENT' && $stateParams.IsBookmark == 1) ||
          ($scope.AudienceType == 'CLIENT' && $stateParams.IsFavorite == 1) ||
          ($scope.agent && $scope.AudienceType == 'CLIENT' && $scope.agent.ClientSearchEnabled == false)){
          if(orderbydirection == 'DESC')
            $scope.page.results = _.sortBy($scope.page.results,field).reverse();
          else
            $scope.page.results = _.sortBy($scope.page.results,field);

          $scope.order = applicationFactory.getSortParameters();

          $rootScope.$broadcast('setPropertyList');
        }
        else {
          $rootScope.$broadcast("doSort", searchObj)
        }

        $('.prop-list-scroll').scrollTop(0);
        $scope.$broadcast("updatepscrollbar");
      }

        /* Add bookmark handler */
        $scope.addBookmarkHandler = function (property, isFavorite, type) {
          if(isFavorite){
            if(type == "add"){
              $scope.addClientFavorite(property);
            }else{
              $scope.removeClientFavorite(property);
            }
          }else {
            //httpServices.trackGoogleEvent('addRemoveBookmark','property-list');

            var index = $scope.bookmarkList.indexOf(property);
            if (index == -1) {
              $scope.bookmarkList.push(property);
            } else {
              $scope.bookmarkList.splice(index, 1);
            }
            if ($scope.bookmarkList.length > 0) {
              $timeout(function () {
                showBookmarkStatus();
              }, 100);
            }
            else {
              $timeout(function () {
                hideBookmarkStatus();
              }, 1000);
            }
          }
        }

        /* Remvoe bookmark hanlder */
        $scope.removeClientBookmark = function (property) {
            var listingIds = [property.Id];
            httpServices.deletebookmarksByClient(listingIds).then(
              function (success) {
                  property.IB = false;
                  aaNotify.success('Property successfully removed from bookmark.');
              }, function (error) {
                  console.log("error " + error);
              });
        }

        /* send the server call for add to favorite for client MT-559*/
        $scope.addClientFavorite = function (property) {
          $scope.$emit("CallOpenMozaicFavoritePopup", property);          
        }

        /* send the server call for remove from favorite for client MT-559*/
        $scope.removeClientFavorite = function (property) {
            var listingIds = [property.Id];

            httpServices.deletefavoritesClient(listingIds).then(
              function (success) {
                  property.IF = false;
                  aaNotify.success('Property successfully removed from favorite.');
              }, function (error) {
                  console.log("error " + error);
              });
        }

        $scope.isAddBookmark = false;       

        /* Book mark hanlder success */
        $scope.$on("bookmarkClientSuccess", function (event, client, parent) {
            if (parent == "listings") {
                $scope.clearBookmark = true;
                $scope.isAddBookmark = true;
                $scope.messageForclientBook = client.FirstName + " " + client.LastName;
                $scope.isSuccess = true;
                $timeout(function () {
                    hideBookmarkStatus();
                    $scope.isAddBookmark = false;
                    $scope.bookmarkList = [];
                }, 2000);
            }
        });

        /* Book mark hanlder Error */
        $scope.$on("bookmarkClientError", function (event, client, parent) {
            if (parent == "listings") {
                $scope.isSuccess = false;
                $timeout(function () {
                    hideBookmarkStatus();
                    $scope.isAddBookmark = false;
                    $scope.bookmarkList = [];
                }, 2000);
            }
        });

        $scope.sendNoteAndBookmarkClient = function (clientId, client) {
            var bookamarkDialog = ngDialog.open({
                template: 'views/templates/bookmarkPropertyEmail.html',
                plain: false,
                scope: $scope,
                controller: 'BookmarkPropertyEmailCtrl',
                data: {
                    client: client,
                    parent: "listings"
                }
            });
        }

        function showBookmarkStatus() {            
            $(".bookmark-title").addClass('newBookmarkdiv');
            $("#prpertyFoundList").hide();            
            $('.dropdown-menu input').click(function (e) {
                e.stopPropagation();
            });
            $scope.clearBookmark = false;
        }

        function hideBookmarkStatus() {
            $(".bookmark-title").removeClass('newBookmarkdiv');
            $("#prpertyFoundList").show();
            $("#results").css('margin-top', '');
            $scope.clearBookmark = false;
        }

        function getMapBounds() {
            var mapBounds = applicationFactory.getMapBounds();
            var param = Math.round(mapBounds.northwest.longitude * 100) / 100 + " " + Math.round(mapBounds.northwest.latitude * 100) / 100;
            param = param + "," + Math.round(mapBounds.southwest.longitude * 100) / 100 + " " + Math.round(mapBounds.southwest.latitude * 100) / 100;
            param = param + "," + Math.round(mapBounds.southeast.longitude * 100) / 100 + " " + Math.round(mapBounds.southeast.latitude * 100) / 100;
            param = param + "," + Math.round(mapBounds.northeast.longitude * 100) / 100 + " " + Math.round(mapBounds.northeast.latitude * 100) / 100;
            param = param + "," + Math.round(mapBounds.northwest.longitude * 100) / 100 + " " + Math.round(mapBounds.northwest.latitude * 100) / 100;
            return param;
        }

        $rootScope.$broadcast("urlUpdated", $stateParams.searchParams);
        $rootScope.$on("selectClient", function (evvent, client) {
            $scope.selectedClient = client;
        });

        $(document).ready(function () {
            $("#content").removeClass("PropDetailPage");
          $("#map").removeClass("PropDetailMap");
          $(".mapList-toggle").show();            
            $(".nav-tabs a").click(function(){
                $(this).tab('show');
                return false;
            });

        });

        var slideNumberList = 0,totalSlideList = 0;
        $scope.startTour = function () {
            $('.flexslider_showTour').flexslider({
                animation: "slide",
                slideshow: false,
                animationLoop: false,
                controlsContainer: $(".custom-controls-container"),
                customDirectionNav: $(".custom-navigation a"),
                startAt: 0,
            });

            totalSlideList   = $(".flexslider_showTour div ul.slides").find("li").length;
            slideNumberList = 0;

            $(".flexslider_showTour,.showTour_Navigation").show();
            $(".showTour_Navigation div ul.flex-direction-nav li:first a").addClass('visibleHide');
            $(".showTour_Navigation div ul.flex-direction-nav li:last a").show();
            $(".tour_end").hide();

            $(".showTour_Navigation div ul.flex-direction-nav li a.flex-next,.showTour_Navigation div ul.flex-direction-nav li a.flex-prev,.showTour_Navigation div ol.flex-control-nav li").click(function (e) {
                var curent_slide_no = $(".flexslider_showTour div ul.slides").find("li.flex-active-slide").index() + 1;
                setTimeout(function () { checkSliderPos(); }, 50);
            });

          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;

            if ((keycode === 39 || keycode === 37)) {
              if (keycode === 39 && slideNumberList == totalSlideList) {
                $('.flexslider_showTour').flexslider(0);
                $(".flexslider_showTour,.showTour_Navigation").hide();
              }
              else {
                setTimeout(function () {
                  checkSliderPos();
                }, 50);
              }
            }
          });
        }

        function checkSliderPos() {
            var curent_slide_no = $(".flexslider_showTour div ul.slides").find("li.flex-active-slide").index() + 1;
            slideNumberList = curent_slide_no;

            if (curent_slide_no == 1) {
                $(".showTour_Navigation div ul.flex-direction-nav li:first a").addClass('visibleHide');
                $(".showTour_Navigation div ul.flex-direction-nav li:last a").show();
                $(".tour_end").hide();
            }
            else if (curent_slide_no == totalSlideList) {
                $(".showTour_Navigation div ul.flex-direction-nav li:first a").removeClass('visibleHide');
                $(".showTour_Navigation div ul.flex-direction-nav li:last a").hide();
                $(".tour_end").show();
            }
            else {
                $(".showTour_Navigation div ul.flex-direction-nav li:first a").removeClass('visibleHide');
                $(".showTour_Navigation div ul.flex-direction-nav li:last a").show();
                $(".tour_end").hide();
            }

        }

        $scope.hide_tour = function () {
            $('.flexslider_showTour').flexslider(0);
            $(".flexslider_showTour,.showTour_Navigation").hide();
        }

        var slideNumberDetail = 0,totalSlideDetail = 0;
        $scope.startTour_PropDetail = function () {
            $('.flexslider_showTour_detail').flexslider({
                animation: "slide",
                slideshow: false,
                animationLoop: false,
                controlsContainer: $(".custom-controls-container_detail"),
                customDirectionNav: $(".custom-navigation_detail a"),
                startAt: 0
            });

            totalSlideDetail = $(".flexslider_showTour_detail div ul.slides").find("li").length;
            slideNumberDetail = 0;

            $(".flexslider_showTour_detail,.showTour_Navigation_detail").show();
            $(".showTour_Navigation_detail div ul.flex-direction-nav li:first a").addClass('visibleHide');
            $(".showTour_Navigation_detail div ul.flex-direction-nav li:last a").show();
            $(".tour_end").hide();

            $(".showTour_Navigation_detail div ul.flex-direction-nav li a.flex-next,.showTour_Navigation_detail div ul.flex-direction-nav li a.flex-prev,.showTour_Navigation_detail div ol.flex-control-nav li").click(function (e) {
                var curent_slide_no = $(".flexslider_showTour_detail div ul.slides").find("li.flex-active-slide").index() + 1;
                setTimeout(function () { checkSliderPos_detail(); }, 50);
            });

          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;

            if ((keycode === 39 || keycode === 37)) {
              if (keycode === 39 && slideNumberDetail == totalSlideDetail) {
                $('.flexslider_showTour_detail').flexslider(0);
                $(".flexslider_showTour_detail,.showTour_Navigation_detail").hide();
              }
              else {
                setTimeout(function () {
                  checkSliderPos();
                }, 50);
              }
            }
          });
        }

        function checkSliderPos_detail() {
            var curent_slide_no = $(".flexslider_showTour_detail div ul.slides").find("li.flex-active-slide").index() + 1;
            slideNumberDetail = curent_slide_no;

            if (curent_slide_no == 1) {
                $(".showTour_Navigation_detail div ul.flex-direction-nav li:first a").addClass('visibleHide');
                $(".showTour_Navigation_detail div ul.flex-direction-nav li:last a").show();
                $(".tour_end").hide();
            }
            else if (curent_slide_no == totalSlideDetail) {
                $(".showTour_Navigation_detail div ul.flex-direction-nav li:first a").removeClass('visibleHide');
                $(".showTour_Navigation_detail div ul.flex-direction-nav li:last a").hide();
                $(".tour_end").show();
            }
            else {
                $(".showTour_Navigation_detail div ul.flex-direction-nav li:first a").removeClass('visibleHide');
                $(".showTour_Navigation_detail div ul.flex-direction-nav li:last a").show();
                $(".tour_end").hide();
            }
        }

        $scope.hide_tour_detail = function () {
            $('.flexslider_showTour_detail').flexslider(0);
            $(".flexslider_showTour_detail,.showTour_Navigation_detail").hide();
        }

        $scope.setFavorites = function()
        {
            if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
                propertiesService.getFavoritesForClient({clientId:appAuth.getAudienceId() }
                    , function (success) {
                        console.log(success.Listings);
                        for(var i in success.Listings) {
                            setTimeout(function() {
                                applyfavorite(success.Listings[i].Id);
                            }, 2000);
                        }

                    }, function (error) {

                    });
            }

        }

        $scope.getPhotoUrlFix = function (item, type) {
            for (var i in item.Items) {
                var image = item.Items[i];
                if (image != undefined && image.Type == type) {
                    return item.Items[i].Url;
                }
                if (i > 0) {
                    return item.Items[0].Url;
                }
            }
            return "";
        }
        
        $scope.listViewEnabled = false;
        $scope.toggleView = function(viewType){
          if(viewType == 'map'){
            $scope.listViewEnabled = false;
            $("#map").removeClass('maphide');
            $("#content").removeClass('showContent');
          }
          if(viewType == 'list'){
            $scope.listViewEnabled = true;
            $("#map").addClass('maphide');
            $("#content").addClass('showContent');
          }
        }

      $scope.init = function()
      {
        if($state.current.name.indexOf('propertydetail') > -1)
           $scope.toggleView('list');
      }     

      $scope.init();
      $scope.checkview = function()
      {
        return $state.current.name == 'tlc.search' || $state.current.name == 'tlcClient.search';
      }
    }]);


