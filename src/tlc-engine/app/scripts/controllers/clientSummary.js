(function () {
  'use strict';

angular.module('tlcengineApp').controller('ClientSummaryCtrl',ClientSummaryCtrl);

ClientSummaryCtrl.$inject =['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope',
    '$window', 'bookmarkService', 'aaNotify', 'appAuth','httpServices','applicationFactory','ngDialog','utilService'];

function ClientSummaryCtrl($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope,
              $window, bookmarkService, aaNotify, appAuth,httpServices,applicationFactory,ngDialog,utilService)
  {

      $scope.resultsCount = 0;
      $scope.propertyLoading = false;
      $(".property-title").show();
      $scope.init = function () {

        if ($stateParams.clientId != undefined && $stateParams.clientId != "") {
          $scope.clientId = $stateParams.clientId;

          $scope.Search = {Mode : 'bookmarked'};

          generateSearchUI();
          $scope.htmlDomGenerate();
          $scope.getClientDetail();
          $scope.getbookmarksClient();
          $scope.getClientAnalytics();
          $scope.loadSavedSearch();
        }
      }

      $scope.htmlDomGenerate = function()
      {
        $("#bookmarkedMode").addClass('active');
        $("#analyticsMode").removeClass('active');

        $(".property-title").show();
        $("#content").animate({
          width: "67%"
        }, 300),
          $("#map").animate({
            width: "33%"
          }, 300);

        $timeout(function () {
          $('.title-tipso').tipso();
        }, 12000);
        $timeout(function () {
          $(".propertyfixdiv").removeClass('show');
          $(".propertyfixdiv").addClass('hide');
        }, 1200);
      }

      $scope.getClientDetail = function () {
        propertiesService.agentClientDetail({ clientId: $scope.clientId, agentId: appAuth.getAudienceId() }
          , function (success) {
            if (success != undefined) {
              $scope.client = success;
            }
          }, function (error) {
            console.log("error " + error);
          });
      }

      $scope.getbookmarksClient = function () {
        $scope.propertyLoading = true;

        propertiesService.getbookmarksClient({ agentId: appAuth.getAudienceId(), clientId: $scope.clientId }
          , function (success) {
            $scope.resultsCount = success.Count;

            if (success != undefined /*&& success.Count > 0*/) {
              $scope.Listings = success.Listings;
              $rootScope.propertiesListingForComapare = success.Listings;
              $timeout(function () {
                for (var i = 0; i < success.Count; i++) {
                  $("#add-bookmark_" + success.Listings[i].Id).closest('li').addClass('bookmark-active');
                  $("#add-bookmark_" + success.Listings[i].Id).hide();
                  $("#remove-bookmark_" + success.Listings[i].Id).show();
                  $("#remove-bookmark_" + success.Listings[i].Id).addClass('isBookmarkProperty');
                }
                if($( window ).height()>=1050)
                  $(".scroll-wrapper.property-sort-infobox.client_summary_infobox").css({'top':'250px','height':'75%'});
                else if($( window ).height()>=768 && $( window ).height()<=1050)
                  $(".scroll-wrapper.property-sort-infobox.client_summary_infobox").css({'top':'250px','height':'67%'});
                else
                  $(".scroll-wrapper.property-sort-infobox.client_summary_infobox").css({'top':'250px','height':'60%'});
              }, 100);
            }

            $scope.propertyLoading = false;
          }, function (error) {
            console.log("error " + error);
            $scope.propertyLoading = false;
          });
        $timeout(function () {
          //$(".property-sort-infobox.client-infobox").scrollbar();
        }, 100);

      }

      $scope.getClientAnalytics = function(){
        propertiesService.getClientAnalytics({agentId: appAuth.getAudienceId(), clientId: $scope.clientId} ,
          function (success) {
            $scope.clientAnalytics = _.filter(success,function(o){return o.Display == true});
          }, function (error) {
            console.log("error " + error);
          });
      }

      $scope.loadSavedSearch = function () {
        //var clientSavedSearches = angular.copy($scope.savedSearches);
        //$scope.clientSavedSearches = _.filter(clientSavedSearches,function(o) {  return o.CreatedForClient == true && o.ClientId == $scope.clientId; });

        propertiesService.getClientSearchByAgent({agentId: appAuth.getAudienceId(), clientId: $scope.clientId},
            function (success) {
              $scope.clientSavedSearches = success.savedSearches;
              //$("#saved-search-opetion div.saved-search div.saved-data ul").scrollbar();
            }, function (error) {
              console.log("error " + error);
            });
      };

      $scope.deleteSavedSearchClient = function (searchObj) {
        //httpServices.trackGoogleEvent('DeleteSavedSearch','clientSummary');

        httpServices.deleteSavedSearch(searchObj.Id).then(
          function (success) {
            //console.log(success);
            var ind = $scope.clientSavedSearches.indexOf(searchObj);
            $scope.clientSavedSearches.splice(ind, 1);
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

      $scope.setSavedSearchNotificationClient = function (searchObj, value) {
        //$analytics.eventTrack('DeleteSavedSearch', {
        //  category: 'search-elements', label: appAuth.isLoggedIn().AudienceType
        //});
        var notificationObj = {};
        notificationObj.RequiredNotification = value;

        httpServices.updateSavedSearchNotification(searchObj.Id, notificationObj).then(
          function (success) {
            //console.log(success);
            var ind = $scope.clientSavedSearches.indexOf(searchObj);
            $scope.clientSavedSearches[ind].RequiredNotification = value;
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
        //httpServices.trackGoogleEvent('Load-SavedSearch','clientSummary');

//            $rootScope.$broadcast("loadSelectedSearch", SearchParameters);
        var sortParams = {};
        sortParams['orderby'] = SearchParameters['orderby'];
        sortParams['orderbydirection'] = SearchParameters['orderbydirection'];

        applicationFactory.setSeavedSearch(SearchParameters);
        $scope.updateUrlAndLoadData();

      };
      $scope.updateUrlAndLoadData = function () {
        var filterParam = applicationFactory.filterAllParameters();
        //        filterParameters(filterParam)
        var parameters = applicationFactory.generateSearchURL(filterParam);
        //          console.log("parameters", parameters);
        //        for (var key in filterParam) {
        //          if (filterParam[key] != undefined && filterParam[key] != "") {
        //            if (key == 'location' || key == 'polygon') {
        //              parameters = parameters + key + ":" + filterParam[key] + ";";
        //            } else {
        //              parameters = parameters + key + ":" + utilService.removeCommasFromNumber(filterParam[key]) + ";";
        //            }
        //          }
        //        }

        //        $scope.tags = [];
        /*only for update Tags*/
        //var filtered = $scope.getFilteredParams();
        //$scope.updateTags(filtered);
        /*******/
        $scope.$parent.searchParameters = applicationFactory.getSearchParameters();

        $rootScope.$broadcast("doSearch", $scope.searchParameters);

        if($scope.AudienceType == 'MLSAGENT') {
          if($state.current.name == 'tlc.search'){
            $state.go('tlc.search', { searchParams: parameters }, {location: true,inherit: false,notify: false});
          }else{
            $state.go('tlc.search', { searchParams: parameters });
          }
        }
        else{
          $state.go('tlcClient.search', { searchParams: parameters });//, {location: 'replace',inherit: false,notify: false}
        }
      }

      $scope.deletebookmarksClient = function (property) {
        //httpServices.trackGoogleEvent('Delete-Bookmarks','clientSummary');

        //console.log(property.ListingId);
        var listingIds = [property.Id];
        //console.log(listingIds);

        bookmarkService.deletebookmarksByAgent(appAuth.getAudienceId(), $scope.clientId, listingIds).then(
          function (success) {
            aaNotify.success('Property successfully removed from bookmark.');

            $scope.getbookmarksClient();
          }, function (error) {
            console.log("error " + error);
          });
      }

      $scope.editProfile = function () {
        //httpServices.trackGoogleEvent('Edit-Profile','clientSummary');

        $state.go('tlc.editClientProfile', { clientId: $scope.clientId });
      }

      $scope.resendPasswordToClient = function(){
        //httpServices.trackGoogleEvent('Reset And Email Password','clientSummary');

        propertiesService.resendPasswordToClient({agentId: appAuth.getAudienceId(), clientId: $scope.clientId},{},
          function (success) {
            aaNotify.success('Email Password successfully sent to client.');
          }, function (error) {
            console.log("error " + error);
          });
      }
      $scope.go_home = function () {
        //httpServices.trackGoogleEvent('SearchHome','clientSummary');

        $state.go('tlc.home');
      }
      $("#bookmarkedMode").click(function () {
        $(this).addClass('active');
        $("#analyticsMode").removeClass('active');
        $("#clientSettings").removeClass('active');
        $("#savedSearch").removeClass('active');
      });

      $("#analyticsMode").click(function () {
        $(this).addClass('active');
        $("#bookmarkedMode").removeClass('active');
        $("#clientSettings").removeClass('active');
        $("#savedSearch").removeClass('active');
      });

      $("#clientSettings").click(function () {
        $(this).addClass('active');
        $("#bookmarkedMode").removeClass('active');
        $("#analyticsMode").removeClass('active');
        $("#savedSearch").removeClass('active');
      });

      $("#savedSearch").click(function () {
        $(this).addClass('active');
        $("#bookmarkedMode").removeClass('active');
        $("#analyticsMode").removeClass('active');
        $("#clientSettings").removeClass('active');
      });

      $scope.back = function () {
          if ($state.current.name == "tlc.clientSummary.propertydetail") {
            $scope.htmlDomGenerate();
            //return;
              //$scope.init();
              //$state.go('tlc.clientSummary', { clientId: $scope.clientId });
          }
          $window.history.back();
      }

      $scope.$on('onDeleteClient', function (e, args) {
        $scope.back();
      });

      $scope.deleteClientProfile = function () {
        if ($scope.client) {
          var deleteClientProfileDialog = ngDialog.openConfirm({
            template: 'views/templates/ConfirmDeleteClientTemplate.html',
            plain: false,
            scope: $scope,
            className:'ngdialog-theme-default ngdeleteclient',
            controller: 'ConfirmDeleteClientProfileCtrl',
            data: {
              client: $scope.client,
              parent: "listings"
            }
          }).then(function (value) {
            //console.log('Modal promise resolved. Value: ', value);
          }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
          });
        }
      }
    $rootScope.ClientSummeryBack = function () {
      $scope.htmlDomGenerate();
      //$scope.init();
      //$window.history.back();
    }
      $scope.init();

    };

})();

