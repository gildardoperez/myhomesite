angular.module('tlcengineApp')
  .controller('AgentDashboardCtrl', ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope', '$window', 'aaNotify', 'appAuth', '$interval', 'utilService','httpServices','applicationFactory','ngDialog',
    function ($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, $window, aaNotify, appAuth, $interval, utilService,httpServices,applicationFactory,ngDialog) {

      var settings = applicationFactory.getSettings();
      $scope.BrokerDashboardUrl = settings.BrokerDashboardUrl;

        $scope.init = function () {
            $scope.getAgentDetail();
            $scope.latestProperties();
            $scope.getClients();
            $scope.loadAgentSavedSearch();
            $scope.getClientAnalytics();

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

        $scope.latestProperties = function () {
            propertiesService.getLatestListings({limitrecords:10}
              , function (success) {
                  $scope.propertyLoading = false;
                  $scope.resultsCount = success.Listings.length;
                  $scope.propertiesListing = success.Listings;

                  if ($scope.resultsCount > 0) {

                      $scope.setPropertyRotation();

                      var refreshProperty = $interval(function () {
                          $scope.setPropertyRotation();
                      }, 10000);
                  }
              }, function (error) {

              });
        };


      $scope.loadAgentSavedSearch = function(){
        httpServices.getSavedSearch().then(
            function (success) {
              $scope.savedSearches = success.savedSearches;
              $scope.$broadcast('searchList');
            }, function (error) {
              console.log("error " + error);
            });
      };

      $scope.deleteSavedSearch = function (searchObj) {
        //httpServices.trackGoogleEvent('Delete-SavedSearch','dashboard');

          httpServices.deleteSavedSearch(searchObj.Id).then(
                function (success) {
                    var ind = $scope.savedSearches.indexOf(searchObj);
                    $scope.savedSearches.splice(ind, 1);
                    aaNotify.success('Search deleted successfully');
                }, function (error) {
                    var errorMessages = [];
                    if (error.data && error.data.length > 1) {
                        errorMessages.push("<ui>");
                        _.each(error.data, function (o) { errorMessages.push("<li>" + o.ErrorMessage + "</li>"); });
                        errorMessages.push("</ui>");
                    } else if (error.data && error.data.length == 1)
                        errorMessages.push("<span>" + error.data[0].ErrorMessage + "</span>");
                    else
                        errorMessages.push("Failed to load search results.");

                    aaNotify.error(errorMessages.join(""),
                        {
                            showClose: true,                            //close button
                            iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                            allowHtml: true,                            //allows HTML in the message to render as HTML
                            ttl: 1000 * 10                              //time to live in ms
                        });
                });
      }

      $scope.setSavedSearchNotification = function (searchObj, value) {
        var notificationObj = {};
        notificationObj.RequiredNotification = value;

        httpServices.updateSavedSearchNotification(searchObj.Id, notificationObj).then(
          function (success) {
            var ind = $scope.savedSearches.indexOf(searchObj);
            $scope.savedSearches[ind].RequiredNotification = value;
          }, function (error) {
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
                ttl: 1000 * 10                              //time to live in ms
              });
          });
      }

      $scope.getClientAnalytics = function(){
        propertiesService.getAgentClientAnalytics({agentId:appAuth.getAudienceId()} ,
          function (success) {
            $scope.clientAnalytics = success;
            $scope.$broadcast('recent_client-scroll');
          }, function (error) {

          });
      }

      $scope.loadSelectedSearch = function(SearchParameters){
        //httpServices.trackGoogleEvent('Load-SavedSearch','dashboard');

        applicationFactory.setSeavedSearch(SearchParameters);

        var filterParam = applicationFactory.filterAllParameters();
        var parameters = applicationFactory.generateSearchURL(filterParam);

        $state.go('tlc.search', { searchParams: parameters });
      };

      $scope.getClients = function () {
          propertiesService.getClients({ agentId: appAuth.getAudienceId() }
            , function (success) {
              if (success != undefined && success.Count > 0) {
                _.each(success.Clients, function (o) {
                  o.FullName = o.FirstName + ' ' + o.LastName;
                });

                $scope.clients = success.Clients;
                $scope.$broadcast('manageClient-scroll');
              }
            }, function (error) {

            });
      }

      $scope.redirectToClientDetail = function (clientId,event) {
        console.log('redirectToClientDetail');
        event.preventDefault();
        //httpServices.trackGoogleEvent('Manage-Clients','dashboard');

        $scope.SearchClient = '';
        $rootScope.clientName= $(this)[0].client.FullName;
        $state.go('tlc.clientSummary', { clientId: clientId });
      }

       var iPropertyCount = -1;
       $scope.setPropertyRotation = function () {
          iPropertyCount += 1;
          $scope.setProperty();
      }

      $scope.setProperty = function()
      {
        if(iPropertyCount >= $scope.resultsCount)
          iPropertyCount = 0;
        if(iPropertyCount < 0 )
          iPropertyCount = $scope.resultsCount - 1;

        $scope.property = $scope.propertiesListing[iPropertyCount];
        $scope.previewUrl = $scope.property.Photos != null && $scope.property.Photos.length > 0 ? $scope.property.Photos[0] : "images/No-property.png"; //$scope.getDefaultUrl($scope.property.Photos[0]);
      }

      $scope.setNextPreProperty = function (type,e) {
            e.stopPropagation();
            e.preventDefault();
            //httpServices.trackGoogleEvent('NextPre-Property','dashboard');

            if(type == 'pre')
              iPropertyCount = iPropertyCount - 1;
            else
              iPropertyCount = iPropertyCount + 1;

            $scope.setProperty();
        }

        $scope.getSortPrice = function (price) {
            return utilService.getSortPrice(price);
        }

        $scope.formatNumber = function (value) {
            return utilService.formatNumber(value);
        }

        $scope.getSearchTimeText = function(search){
          return applicationFactory.getSearchTimeText(search);
        }

        $scope.displayDeleteSavedSearch = function(search){
          return applicationFactory.displayDeleteSavedSearch(search);
        }

        $scope.$on('getClients', function (e, args) {
          $scope.getClients();
        });

        $scope.logout = function () {
          //httpServices.trackGoogleEvent('Logout','dashboard');
          //httpServices.logoutUser();
          utilService.logout();
          $("body").removeClass("body-dashboard");
        }

        $scope.redirectActivity = function(act)
        {
          if(act.Object != undefined && act.Object.Type == 'Listing')
          {
            //httpServices.trackGoogleEvent('ClientActivity-Property-Detail','dashboard');
            $state.go('tlc.search.propertydetail', { listingId: act.Object.UrlId });
          }
        }

        $scope.redirectToState = function(state, eventName)
        {          
          //httpServices.trackGoogleEvent(eventName,'dashboard');
          $state.go(state);
        }

        $scope.propertyDetail = function () {
          //httpServices.trackGoogleEvent('Property-Detail','dashboard');
          $state.go('tlc.search.propertydetail', { listingId: $scope.property.Id });
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

            if ((keycode === 39 || keycode === 37)) {
              if (keycode === 39 && slideNumber == totalSlide) {
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

        $scope.deleteClientProfile = function (client){
          if(client){
            var deleteClientProfileDialog = ngDialog.openConfirm({
              template: 'views/templates/ConfirmDeleteClientTemplate.html',
              plain: false,
              scope: $scope,
              className:'ngdialog-theme-default ngdeleteclient',
              controller: 'ConfirmDeleteClientProfileCtrl',
              data: {
                client: client,
                parent: "listings"
              }
            }).then(function(value){
              //console.log('Modal promise resolved. Value: ', value);
            }, function(reason){
              //console.log('Modal promise rejected. Reason: ', reason);
            });
          }
        }

      $scope.init();
    }]);
