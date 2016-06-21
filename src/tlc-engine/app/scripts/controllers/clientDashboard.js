(function () {
  'use strict';

angular.module('tlcengineApp').controller('ClientDashboardCtrl',ClientDashboardCtrl);

ClientDashboardCtrl.$inject = ['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state', '$stateParams','$filter','$rootScope','$window','aaNotify','appAuth','$interval','utilService','httpServices','applicationFactory'];

function ClientDashboardCtrl($scope, $location, $route, $routeParams, propertiesService,$timeout,$state, $stateParams,$filter,$rootScope,$window,aaNotify,appAuth,$interval,utilService,httpServices,applicationFactory)
{
      $scope.init = function () {
        $scope.favorites = [];
        $scope.getClientDetail();
        $scope.getAgentDetail();
        $scope.getBookmarks();
        $scope.getFavorites();
        $scope.loadSavedSearch();
//          $scope.savedSearchTab = true;
//          $scope.yourFavoritesTab = false;

      }

      $scope.getClientDetail = function () {
        httpServices.getClientDetail().then(function (success) {
            if (success != undefined) {
              $scope.client = success;
              $scope.ClientImage = $scope.client.Profile.BasicData.ProfileImageUrl || "images/client-dashboard.png";
            }
          }, function (error) {
          });
      }

      $scope.getAgentDetail = function () {
        httpServices.getAgentDetail().then(
          function (success) {
            if (success != undefined) {
              $scope.agent = success;
              $scope.AgentImage = $scope.agent.Profile.ProfileImageName || "images/client-dashboard.png";
            }
          }, function (error) {
          });
      }

      $scope.getBookmarks = function()
      {
        propertiesService.getBookmarksForClient({clientId:appAuth.getAudienceId() }
          , function (success) {
            $scope.bookmarks = success;

            if($scope.bookmarks.Count > 0) {
              $scope.setBookmarksPropertyRotation();

              var refreshBookmarksProperty = $interval(function () {
                $scope.setBookmarksPropertyRotation();
              }, 10000);
            }
          }, function (error) {

          });
      }

      $scope.getFavorites = function()
      {
        propertiesService.getFavoritesForClient({clientId:appAuth.getAudienceId() }
          , function (success) {
            $scope.favorites = success;

            if($scope.favorites.Count > 0) {
              $scope.setFavoritesPropertyRotation();

              var refreshFavoritesProperty = $interval(function () {
                $scope.setFavoritesPropertyRotation();
              }, 10000);
            }
          }, function (error) {

          });
      }

      $scope.search = function()
      {
        //httpServices.trackGoogleEvent('Property-Search','dashboard');

        if($scope.agent.ClientSearchEnabled == false) {
          $state.go('tlcClient.search');
        }
        else {
          $state.go('tlcClient.home');
        }
      }

      $scope.searchBookmark = function()
      {
        //httpServices.trackGoogleEvent('Property-Search-Bookmark','dashboard');

        $state.go('tlcClient.search',{searchParams:'',IsBookmark:1});
      }

      $scope.searchFavorite = function(e)
      {
        e.stopPropagation();
        e.preventDefault();

        //httpServices.trackGoogleEvent('Property-Search-Favorite','dashboard');

        $state.go('tlcClient.search',{searchParams:'',IsFavorite:1});
      }

      $scope.logout = function()
      {
        //httpServices.trackGoogleEvent('Logout','dashboard');

        httpServices.logoutUser();
        $("body").removeClass("body-dashboard");
      }

      $scope.redirectToState = function(state, eventName)
      {
        //httpServices.trackGoogleEvent(eventName,'dashboard');
        $state.go(state);
      }

      $scope.propertyDetail = function(listingId)
      {
        //httpServices.trackGoogleEvent('Property-Detail','dashboard');
        $state.go('tlcClient.search.propertydetail', { listingId: listingId });
      }

      var displayPropNumber = 1;

      $scope.getSortPrice = function (price) {
        return utilService.getSortPrice(price);
      }

      $scope.formatNumber = function (value) {
        return utilService.formatNumber(value);
      }

      var iBookmarksPropertyCount = -1;
      $scope.setBookmarksPropertyRotation = function () {
        iBookmarksPropertyCount += 1;

        $scope.setBookmarkProperty();
      }

      $scope.setBookmarkProperty = function()
      {
        if(iBookmarksPropertyCount >= $scope.bookmarks.Count)
          iBookmarksPropertyCount = 0;
        if(iBookmarksPropertyCount < 0 )
          iBookmarksPropertyCount = $scope.bookmarks.Count - 1;

        $scope.bookmarkProperty = $scope.bookmarks.Listings[iBookmarksPropertyCount];
        $scope.bookmarkPreviewUrl = $scope.bookmarkProperty.Photos != null && $scope.bookmarkProperty.Photos.length > 0 ? $scope.bookmarkProperty.Photos[0] : "images/No-property.png"; //$scope.getDefaultUrl($scope.bookmarkProperty.Photos[0]);
      }

      $scope.setBookmarksNextPreProperty = function (type,e) {
        e.stopPropagation();
        e.preventDefault();

        //httpServices.trackGoogleEvent('NextPre-BookmarkProperty','dashboard');

        if(type == 'pre')
          iBookmarksPropertyCount = iBookmarksPropertyCount - 1;
        else
          iBookmarksPropertyCount = iBookmarksPropertyCount + 1;

        $scope.setBookmarkProperty();
      }

      var iFavoritesPropertyCount = -1;
      $scope.setFavoritesPropertyRotation = function () {
        iFavoritesPropertyCount += 1;

        $scope.setFavoriteProperty();
      }

      $scope.setFavoriteProperty = function()
      {
        if(iFavoritesPropertyCount >= $scope.favorites.Count)
          iFavoritesPropertyCount = 0;
        if(iFavoritesPropertyCount < 0 )
          iFavoritesPropertyCount = $scope.favorites.Count - 1;

        $scope.favoriteProperty = $scope.favorites.Listings[iFavoritesPropertyCount];
        $scope.favoritePreviewUrl = $scope.favoriteProperty.Photos != null && $scope.favoriteProperty.Photos.length > 0 ? $scope.favoriteProperty.Photos[0] : "images/No-property.png"; //$scope.getDefaultUrl($scope.favoriteProperty.Photos[0]);
      }

      $scope.setFavoritesNextPreProperty = function (type,e) {
        e.stopPropagation();
        e.preventDefault();

        //httpServices.trackGoogleEvent('NextPre-FavoriteProperty','dashboard');

          if(type == 'pre')
            iFavoritesPropertyCount = iFavoritesPropertyCount - 1;
          else
            iFavoritesPropertyCount = iFavoritesPropertyCount + 1;

        $scope.setFavoriteProperty();
      }

      $scope.loadSavedSearch = function () {
        httpServices.getSavedSearch().then(
          function (success) {
            $scope.savedSearches = success.savedSearches;
          }, function (error) {
            console.log("error " + error);
          });
      };

      $scope.deleteSavedSearch = function (searchObj) {
        //httpServices.trackGoogleEvent('Delete-SavedSearch','dashboard');

        httpServices.deleteSavedSearch(searchObj.Id).then(
          function (success) {
            //console.log(success);
            var ind = $scope.savedSearches.indexOf(searchObj);
            $scope.savedSearches.splice(ind, 1);
            aaNotify.success('Search deleted successfully');
          }, function (error) {
            console.log("error " + error);
            //                        aaNotify.danger('Failed to load saved search.');
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


          });
      }

      $scope.setSavedSearchNotification = function (searchObj, value) {
        //$analytics.eventTrack('DeleteSavedSearch', {
        //  category: 'search-elements', label: appAuth.isLoggedIn().AudienceType
        //});
        var notificationObj = {};
        notificationObj.RequiredNotification = value;

        httpServices.updateSavedSearchNotification(searchObj.Id, notificationObj).then(
          function (success) {
            //console.log(success);
            var ind = $scope.savedSearches.indexOf(searchObj);
            $scope.savedSearches[ind].RequiredNotification = value;
          }, function (error) {
            console.log("error " + error);
            //                        aaNotify.danger('Failed to load saved search.');
            var errorMessages = [];
            if (error.data && error.data.length > 1) {
              errorMessages.push("<ui>");
              _.each(error.data, function (o) { errorMessages.push("<li>" + o.ErrorMessage + "</li>"); });
              errorMessages.push("</ui>");
            } else if (error.data && error.data.length == 1)
              errorMessages.push("<span>" + error.data[0].ErrorMessage + "</span>");
            else
              errorMessages.push("Failed to update saved search notification.");

            aaNotify.danger(errorMessages.join(""),
              {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML

                //common to the framework as a whole
                ttl: 1000 * 10  //time to live in ms
              });


          });
      }


      $scope.loadSelectedSearch = function(SearchParameters){
        //httpServices.trackGoogleEvent('Load-SavedSearch','dashboard');

        applicationFactory.setSeavedSearch(SearchParameters);

        var filterParam = applicationFactory.filterAllParameters();
        var parameters = applicationFactory.generateSearchURL(filterParam);

        $state.go('tlcClient.search', { searchParams: parameters });
      };

      $scope.getSearchTimeText = function(search){
        return applicationFactory.getSearchTimeText(search);
      }

      $scope.displayDeleteSavedSearch = function(search){
        return applicationFactory.displayDeleteSavedSearch(search);
      }


    var slideNumber = 0,totalSlide = 0;
      $(document).ready(function () {
          $("body").removeClass().addClass("body-dashboard");
      });
    $scope.startTour = function () {
    $('.flexslider_showTour').flexslider({
        animation: "slide",
        slideshow: false,
        animationLoop: false,
        controlsContainer: $(".custom-controls-container"),
        customDirectionNav: $(".custom-navigation a"),
        startAt: 0
    });

      totalSlide = $(".flexslider_showTour div ul.slides").find("li").length;
      slideNumber = 0;
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
        if (keycode === 39 && slideNumber == totalSlide) {
          $('.flexslider_showTour').flexslider(0);
          $(".flexslider_showTour,.showTour_Navigation").hide();
        }
        else {
          setTimeout(function () {
            checkSliderPos();
          }, 50);
        }
      });
}

    function checkSliderPos() {
        var curent_slide_no = $(".flexslider_showTour div ul.slides").find("li.flex-active-slide").index() + 1;
        slideNumber = curent_slide_no;

        if (curent_slide_no == 1) {
            $(".showTour_Navigation div ul.flex-direction-nav li:first a").addClass('visibleHide');
            $(".showTour_Navigation div ul.flex-direction-nav li:last a").show();
            $(".tour_end").hide();
        }
        else if (curent_slide_no == totalSlide) {
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

    $scope.init();
};

})();
