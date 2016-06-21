'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the tlcengineApp
 */

angular.module('tlcengineApp')
  .controller('MasterCtrl', ['$scope', '$location', 'propertiesService', 'utilService', '$timeout', '$state', '$stateParams', 'orderByFilter', 'applicationFactory', '$rootScope', 'appAuth', 'aaNotify', 'httpServices', 'getAgentDetail', 'getClientDetail', 'ngDialog', '$filter', '$compile',
    function ($scope, $location, propertiesService, utilService, $timeout, $state, $stateParams, orderByFilter, applicationFactory, $rootScope, appAuth, aaNotify, httpServices, getAgentDetail, getClientDetail, ngDialog, $filter, $compile) {    
        $scope.AudienceType = 'CLIENT';
        /*Filter sort names */
        var fieldShortName = {
            'beds': 'beds',
            'baths': 'baths',
            'tlcmin': 'Tlc',
            'listingpricemin': 'List Price',
            'yearbuiltmin': 'Year Built',
            'localelistingstatus': 'Status',
            'propertytype': '',
            'garages': 'Parking',
            'livingareamin': 'Sqft',
            'acresmin': 'ac',            
            'ficoscore': 'Fico Score',
            'loantype': 'Loan Type',
            'lifestyle': 'Life Style',
            'schoolname': 'School',
            'subdivision':'Advertised Subdivision',
            'openhousefromdate': 'Open House Dates',
            'numberofunits': 'Unit Number',
            'charterschool': 'cs',
            'status':'st',
            'contingent':'ct',
            'propertystyle': 'Style',
            'onmarket': 'On Market',
            'ownershiptype': 'Ownership',
            'propertytype':'Type',
            'propertysubtype':'Listing Type',
            'bodyofwater': 'Body of Water',
            'coolingtype': 'Air Conditioning',
            'coolingfuel': 'Air Fuel',
            'communityrule': 'Community Rule',
            'propertystylenone': 'Style',
            'poolfuture': 'Pool Future'
          }

        $scope.StatusList = ['Active','Pending'];
        $scope.propertyStatus = [];

        $scope.ContingentList = [{text:'Application Received',value:'A'},
          {text:'With Bump Clause - WI Only',value:'B'},
          {text:'Inspection',value:'I'},
          {text:'None',value:'N'},
          {text:'Other',value:'O'},
          {text:'Subject to Statutory Rescission',value:'R'},
          {text:'Sale of Another Property',value:'S'},
          {text:'Third Party Approval',value:'T'},
          {text:'Without Bump Clause - WI Only',value:'X'}];

        $scope.contingencies = [];

        $scope.bedsReset = false;
        $scope.bedroomsReset = false;
        $scope.bathsReset = false;
        $scope.garagesReset = false;
        $scope.propertyTypeReset = false;
        $scope.commuteReset = false;
        $scope.sqftReset = false;
        $scope.acresReset = false;
        $scope.yearBuildReset = false;
        $scope.tlcReset = false;
        $scope.priceReset = false;
        $scope.numberofunitsReset = false;
        $scope.searchFilter = {};
        $scope.Active = true;
        $scope.ko = true;
        $scope.no = true;

        if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
            console.log(navigator.userAgent);
            window.scrollTo(200, 100) // first value for left offset, second value for top offset
        }
         $(window).resize(function() {
          $scope.moreHeight();
        });


      $scope.goToProfile = function() {
          $state.go('clientEditProfile');
      };

      $scope.back = function () {
        switch ($state.current.name) {
          case 'tlc.search':
            $state.go("tlc.home");
            break;
          case 'tlcClient.search':
            $state.go("searchHome");
            break;
          case 'tlcClient.search.propertydetail':
          case 'tlc.PropertyDirect.MLS':
          case 'tlc.search.propertydetail':
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
                if($(window).width() >= 768) {
                  $("#content").animate({
                    width: "30%"//$.cookie("tlc_hpos") + "%"
                  }, 300), $("#map").animate({
                    width: "70%"//100 - $.cookie("tlc_hpos") + "%"
                  }, 300);
                };
                if($(window).width() >= 736){
                  $(".mapList-toggle").show();
                }
             setTimeout(function () {
                 $("#results > li").css("opacity", 1), setTimeout(function () {
                    a.remove();
                    $("#proplistpage").parents(".scroll-wrapper").css('top', '170px');
                    if ($(window).height() >= 1050)
                      $("#proplistpage").parents(".scroll-wrapper").css({ 'top': '170px', 'height': '85%' });
                    else if ($(window).height() >= 768 && $(window).height() <= 1050)
                      $("#proplistpage").parents(".scroll-wrapper").css({ 'top': '170px', 'height': '82%', 'overflow-y': 'scroll' });
                    else
                      $("#proplistpage").parents(".scroll-wrapper").css({ 'top': '170px', 'height': '70%' });

                  }, 300);
                }, 600);
              }, 300)), !1;

            //$state.go("tlc.search");
            $("#content").removeClass("PropDetailPage");
            $("#map").removeClass("PropDetailMap");
            $("#back").removeClass("visible");
            $(".bookmark-title").addClass('newBookmarkdiv');
            $("#prpertyFoundList").show();
            $("#bookmarkprpertyFoundList").show();
            $("ul#results").show();
            $("#results").removeAttr("class");
            //$("#prpertyFoundList,#bookmarkprpertyFoundList").css('width', '30%');
            //$("#results").css('margin-top', '170px');
            $(".initialInfoBox").addClass('hide');
            $(".initialInfoBox").removeClass('show');
            $(".propertyfixdiv").removeClass('show');
            $(".propertyfixdiv").addClass('hide');
            $("h1#logo, h2#slogan, form#search").addClass('show');
            $("h1#logo, h2#slogan, form#search").removeClass('hide');
            //$rootScope.$broadcast('setPropertyList');

            if ($state.current.name == 'tlcClient.search.propertydetail') {
              $state.go("tlcClient.search");
            }
            else if ($state.current.name == 'tlc.search.propertydetail' || $state.current.name == 'tlc.PropertyDirect.MLS') {
              if($scope.page && $scope.page.results.length == 0)
                $scope.filterAction();

              $state.go("tlc.search");
            }

            break;
          default:
          /*Load home screen*/
        }
      }


         /* function for tab height in mobile responsive */
        $scope.moreHeight = function(){
        }
        $scope.OnMarket = '';
        $scope.IsPetsAllowed = '';
        $scope.parking = '';
        $scope.CommunityRules = '';
        $scope.IsAgeRestricted = '';
        $scope.searchFilter.propertytype = 'Residential';
        $scope.fromLotSize = "";
        $scope.toLotSize = "";

        $scope.resType = "Sales";
        var splitterInstance;
        $scope.priceRange = { min: 0, max: 0 }; $scope.tlcRange = { min: 0, max: 0 }; $scope.sqftRange = { min: 0, max: 0 }; $scope.acresRange = { min: 0, max: 0 }; $scope.yearBuiltRange = { min: 0, max: 0 };

        $scope.locationText = "";
        $scope.openHouseOnly = false;
        $scope.CommuteLocationIndex = undefined;
        $scope.action;
        $scope.resultsCount = 0;
        $scope.ActiveTotalListingsCount = 0;
        $scope.propertiesListing = [];
        $scope.searchParameters = applicationFactory.getSearchParameters();
        $scope.commute = {commutemode:'car'};

        /* function to add commute time for search bar */
        $scope.addCommute = function () {
        if(!$(".aa-notification").is(':visible')){
          if($scope.searchParameters.commutes == undefined)
            $scope.searchParameters.commutes = [];

          if($scope.searchParameters.commutes.length > 4)
          {
            aaNotify.error('Allowed maximum 4 commutes.',{
              showClose: true,                            //close button
              iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
              allowHtml: true,                            //allows HTML in the message to render as HTML
              ttl: 1000 * 3                               //time to live in ms
           });          
            return false;
          }

          if(!($scope.commute.commutetimemins >=1 && $scope.commute.commutetimemins <= 30))
          {
            aaNotify.error('Commute Time must be between 1 to 30 minutes.',{
              showClose: true,                            //close button
              iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
              allowHtml: true,                            //allows HTML in the message to render as HTML
              ttl: 1000 * 3                               //time to live in ms
           });          
            return false;
          }

          if($scope.commute.commuteaddress == undefined || $scope.commute.commuteaddress == '')
          {
            aaNotify.error('Commute Address is required.',{
              showClose: true,                            //close button
              iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
              allowHtml: true,                            //allows HTML in the message to render as HTML
              ttl: 1000 * 3                               //time to live in ms
           });          
            return false;
          }

          //httpServices.trackGoogleEvent('CommuteAdded','search-elements', $scope.commute);

          $scope.searchParameters.commutes.push(angular.copy($scope.commute));

          $scope.commute = {commutemode:'car',commutetimemins:0};

          $scope.frmCommute.$aaFormExtensions.$clearErrors();
        }
        else{
          return false;
        }
        }

        /* function to check the value numeric or not */
        $scope.isNumericeOnly = function (value,key) {
      
          var re = /^[A-Za-z0-9]+$/;
          if(re.test(value) == false || key == 'addresses' || key == 'ficoscore') {
            return false;
          } else {
            return true;
          }
        }

        /* function to remove commute time */
        $scope.removeCommute = function (index) {
          //httpServices.trackGoogleEvent('CommuteRemoved','search-elements', $scope.searchParameters.commutes[index]);

          $scope.searchParameters.commutes.splice(index, 1);
        }

        $scope.changeStatus = function() {
          //httpServices.trackGoogleEvent('StatusChange','search-elements', $scope.propertyStatus.join(","));
        }

        $scope.changeContingent = function() {
          //httpServices.trackGoogleEvent('ContingentChange','search-elements', $scope.contingencies.join(","));
        }

        $scope.isDrawing = false;
        $scope.drawingStatus = "Draw an area";
        $scope.clearPolygon = false;
        $scope.tags = [];
        $scope.order = {};
        $scope.bookmarkList = [];
        $scope.clearBookmark = {};
        $scope.SearchClient = '';
        $scope.selectedClient = undefined;
        $scope.TotalSearchFilter = '';
        $scope.saveSearchName = "";
        $scope.savedSearches = [];
        $rootScope.IsSearchCriteriaDisplay = true;
        $rootScope.propertiesListingForComapare = [];
        $rootScope.ComaprePropIDList = [];
        var settings = applicationFactory.getSettings();
        $scope.defaultWorkAddress = settings.DefaultWorkAddress;
        $scope.EnableSchoolDistrictSearch = settings.EnableSchoolDistrictSearch;
        $scope.EnableContingencySearch = settings.EnableContingencySearch;
        $scope.BrokerDashboardUrl = settings.BrokerDashboardUrl;
        $("body").removeClass("body-dashboard");
        $scope.availableNeighborhood = [];
        var defaultAutocompleteBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(36.5, -83),
          new google.maps.LatLng(42, -77)
        );
        $scope.autocompleteOptions = {
          componentRestrictions: { country: 'us' },
          types: ['geocode'],
          bounds: defaultAutocompleteBounds
        };

        $scope.selectAllOwner = function() {
            $scope.condo = false;
            $scope.coop = false;
            $scope.feeSimple = false;
            $scope.groundRent = false;
            $scope.rentalApartment = false;
        };

        $scope.selectAllCool = function() {
            $scope.atticFan = false;
            $scope.ceilingFan = false;
            $scope.central = false;
            $scope.electric = false;
            $scope.gas = false;
            $scope.pump = false;
            $scope.noAc = false;
            $scope.cooling = false;
            $scope.wallUnit = false;
            $scope.houseFan = false;
            $scope.windowUnit = false;
            $scope.zoned = false;
        }

        $scope.selectAllPool = function() {
            $scope.aboveGround = false;
            $scope.inGround = false;
            $scope.indoor = false;
        }

        $scope.selectAllHome = function() {
              $scope.aFrame = false;
              $scope.artDeco = false;
              $scope.artCrafts = false;
              $scope.beauxArts = false;
              $scope.biLevel = false;
              $scope.bungalow = false;
              $scope.cabin = false;
              $scope.capeCod = false;
              $scope.carriageHouse = false;
              $scope.chalet = false;
              $scope.colonial = false;
              $scope.contemporary = false;
              $scope.cottage = false;
              $scope.craftsman = false;
              $scope.dome = false;
              $scope.dutch = false;
              $scope.farmhouse = false;
              $scope.federal = false;
              $scope.frenchCountry = false;
              $scope.frenchProvincial = false;
              $scope.georgian = false;
              $scope.logHome = false;
              $scope.none = false;
              $scope.other = false;
              $scope.prairie = false;
              $scope.provincial = false;
              $scope.raisedRanch = false;
              $scope.raisedRambler = false;
              $scope.rambler = false;
              $scope.ranch = false;
              $scope.saltBox = false;
              $scope.spanish = false;
              $scope.splitFoyer = false;
              $scope.splitLevel = false;
              $scope.traditional = false;
              $scope.transitional = false;
              $scope.tudor = false;
              $scope.victorian = false;
              $scope.villa = false;
        }

        $scope.selectAllStory = function() {
            $scope.story1 = false;
            $scope.story2 = false;
            $scope.story3 = false;
            $scope.story4 = false;
            $scope.story5 = false;
            $scope.story6 = false;
            $scope.story7 = false;
            $scope.story8 = false;
            $scope.story9 = false;
            $scope.biLevelStroy = false;
            $scope.splitFoyerRoom = false;
            $scope.splitLevelRoom = false;          
        }

        $scope.selectAllRoom = function() {
            $scope.den = 0;
            $scope.IsFamilyRoom = 0;
            $scope.IsInLaw = 0;
            $scope.IsLibrary = 0;
            $scope.IsLoft = 0;
            $scope.IsSunRoom = 0;
            $scope.IsWorkshop = 0;
        }

        $scope.checkAllCar = function() {

            $scope.transCar1 = $scope.transCar1 ? false : true;
            $scope.transCar2 = $scope.transCar2 ? false : true;
            $scope.transCar3 = $scope.transCar3 ? false : true;
            $scope.transCar4 = $scope.transCar4 ? false : true;
            $scope.transCar5 = $scope.transCar5 ? false : true;
            $scope.transCar6 = $scope.transCar6 ? false : true;
            $scope.transCar7 = $scope.transCar7 ? false : true;
            $scope.transCar8 = $scope.transCar8 ? false : true;
            $scope.transCar9 = $scope.transCar9 ? false : true;
            $scope.transCar10 = $scope.transCar10 ? false : true;
            $scope.transCar11 = $scope.transCar11 ? false : true;


            $scope.PfCar1 = $scope.PfCar1 ? false : true;
            $scope.PfCar2 = $scope.PfCar2 ? false : true;
            $scope.PfCar3 = $scope.PfCar3 ? false : true;
            $scope.PfCar4 = $scope.PfCar4 ? false : true;
            $scope.PfCar5 = $scope.PfCar5 ? false : true;
            $scope.PfCar6 = $scope.PfCar6 ? false : true;
            $scope.PfCar7 = $scope.PfCar7 ? false : true;
            $scope.PfCar8 = $scope.PfCar8 ? false : true;
            $scope.PfCar9 = $scope.PfCar9 ? false : true;
            $scope.PfCar10 = $scope.PfCar10 ? false : true;


            $scope.shopCar1 = $scope.shopCar1 ? false : true;
            $scope.shopCar2 = $scope.shopCar2 ? false : true;
            $scope.shopCar3 = $scope.shopCar3 ? false : true;
            $scope.shopCar4 = $scope.shopCar4 ? false : true;
            $scope.shopCar5 = $scope.shopCar5 ? false : true;


            $scope.actCar1 = $scope.actCar1 ? false : true;
            $scope.actCar2 = $scope.actCar2 ? false : true;
            $scope.actCar3 = $scope.actCar3 ? false : true;
            $scope.actCar4 = $scope.actCar4 ? false : true;
            $scope.actCar5 = $scope.actCar5 ? false : true;
            $scope.actCar6 = $scope.actCar6 ? false : true;
            $scope.actCar7 = $scope.actCar7 ? false : true;
            $scope.actCar8 = $scope.actCar8 ? false : true;
            $scope.actCar9 = $scope.actCar9 ? false : true;
            $scope.actCar10 = $scope.actCar10 ? false : true;
            $scope.actCar11 = $scope.actCar11 ? false : true;
            $scope.actCar12 = $scope.actCar12 ? false : true;
            $scope.actCar13 = $scope.actCar13 ? false : true;

        }

        $scope.checkAllTrain = function() {
            $scope.transTrain1 = $scope.transTrain1 ? false : true;
            $scope.transTrain2 = $scope.transTrain2 ? false : true;
            $scope.transTrain3 = $scope.transTrain3 ? false : true;
            $scope.transTrain4 = $scope.transTrain4 ? false : true;
            $scope.transTrain5 = $scope.transTrain5 ? false : true;
            $scope.transTrain6 = $scope.transTrain6 ? false : true;
            $scope.transTrain7 = $scope.transTrain7 ? false : true;
            $scope.transTrain8 = $scope.transTrain8 ? false : true;
            $scope.transTrain9 = $scope.transTrain9 ? false : true;
            $scope.transTrain10 = $scope.transTrain10 ? false : true;
            $scope.transTrain11 = $scope.transTrain11 ? false : true;


            $scope.PfTrain1 = $scope.PfTrain1 ? false : true;
            $scope.PfTrain2 = $scope.PfTrain2 ? false : true;
            $scope.PfTrain3 = $scope.PfTrain3 ? false : true;
            $scope.PfTrain4 = $scope.PfTrain4 ? false : true;
            $scope.PfTrain5 = $scope.PfTrain5 ? false : true;
            $scope.PfTrain6 = $scope.PfTrain6 ? false : true;
            $scope.PfTrain7 = $scope.PfTrain7 ? false : true;
            $scope.PfTrain8 = $scope.PfTrain8 ? false : true;
            $scope.PfTrain9 = $scope.PfTrain9 ? false : true;
            $scope.PfTrain10 = $scope.PfTrain10 ? false : true;


            $scope.shopTrain1 = $scope.shopTrain1 ? false : true;
            $scope.shopTrain2 = $scope.shopTrain2 ? false : true;
            $scope.shopTrain3 = $scope.shopTrain3 ? false : true;
            $scope.shopTrain4 = $scope.shopTrain4 ? false : true;
            $scope.shopTrain5 = $scope.shopTrain5 ? false : true;


            $scope.actTrain1 = $scope.actTrain1 ? false : true;
            $scope.actTrain2 = $scope.actTrain2 ? false : true;
            $scope.actTrain3 = $scope.actTrain3 ? false : true;
            $scope.actTrain4 = $scope.actTrain4 ? false : true;
            $scope.actTrain5 = $scope.actTrain5 ? false : true;
            $scope.actTrain6 = $scope.actTrain6 ? false : true;
            $scope.actTrain7 = $scope.actTrain7 ? false : true;
            $scope.actTrain8 = $scope.actTrain8 ? false : true;
            $scope.actTrain9 = $scope.actTrain9 ? false : true;
            $scope.actTrain10 = $scope.actTrain10 ? false : true;
            $scope.actTrain11 = $scope.actTrain11 ? false : true;
            $scope.actTrain12 = $scope.actTrain12 ? false : true;
            $scope.actTrain13 = $scope.actTrain13 ? false : true;

        }

        $scope.checkAllWalk = function() {
            $scope.transWalk1 = $scope.transWalk1 ? false : true;
            $scope.transWalk2 = $scope.transWalk2 ? false : true;
            $scope.transWalk3 = $scope.transWalk3 ? false : true;
            $scope.transWalk4 = $scope.transWalk4 ? false : true;
            $scope.transWalk5 = $scope.transWalk5 ? false : true;
            $scope.transWalk6 = $scope.transWalk6 ? false : true;
            $scope.transWalk7 = $scope.transWalk7 ? false : true;
            $scope.transWalk8 = $scope.transWalk8 ? false : true;
            $scope.transWalk9 = $scope.transWalk9 ? false : true;
            $scope.transWalk10 = $scope.transWalk10 ? false : true;
            $scope.transWalk11 = $scope.transWalk11 ? false : true;


            $scope.PfWalk1 = $scope.PfWalk1 ? false : true;
            $scope.PfWalk2 = $scope.PfWalk2 ? false : true;
            $scope.PfWalk3 = $scope.PfWalk3 ? false : true;
            $scope.PfWalk4 = $scope.PfWalk4 ? false : true;
            $scope.PfWalk5 = $scope.PfWalk5 ? false : true;
            $scope.PfWalk6 = $scope.PfWalk6 ? false : true;
            $scope.PfWalk7 = $scope.PfWalk7 ? false : true;
            $scope.PfWalk8 = $scope.PfWalk8 ? false : true;
            $scope.PfWalk9 = $scope.PfWalk9 ? false : true;
            $scope.PfWalk10 = $scope.PfWalk10 ? false : true;

            $scope.shopWalk1 = $scope.shopWalk1 ? false : true;
            $scope.shopWalk2 = $scope.shopWalk2 ? false : true;
            $scope.shopWalk3 = $scope.shopWalk3 ? false : true;
            $scope.shopWalk4 = $scope.shopWalk4 ? false : true;
            $scope.shopWalk5 = $scope.shopWalk5 ? false : true;


            $scope.actWalk1 = $scope.actWalk1 ? false : true;
            $scope.actWalk2 = $scope.actWalk2 ? false : true;
            $scope.actWalk3 = $scope.actWalk3 ? false : true;
            $scope.actWalk4 = $scope.actWalk4 ? false : true;
            $scope.actWalk5 = $scope.actWalk5 ? false : true;
            $scope.actWalk6 = $scope.actWalk6 ? false : true;
            $scope.actWalk7 = $scope.actWalk7 ? false : true;
            $scope.actWalk8 = $scope.actWalk8 ? false : true;
            $scope.actWalk9 = $scope.actWalk9 ? false : true;
            $scope.actWalk10 = $scope.actWalk10 ? false : true;
            $scope.actWalk11 = $scope.actWalk11 ? false : true;
            $scope.actWalk12 = $scope.actWalk12 ? false : true;
            $scope.actWalk13 = $scope.actWalk13 ? false : true;


        }

        $scope.complete=function() {
          var noResultLabel = "No results found";
          $( "#citybox" ).autocomplete({
            source : null,
            response: function(event, ui) {
                  if (!ui.content.length && ($("#citybox").val().indexOf(",")==-1)){
                      var noResult = { value: "", label: noResultLabel};
                      ui.content.push(noResult);
                  }
            },         
            focus: function (event, ui) {
                $("#citybox").attr("data",ui.item.value);
                if(ui.item.label == noResultLabel) {
                 event.preventDefault();
                }
            },
            select: function (event, ui) {
                $("#citybox").attr("data",ui.item.value);
                if(ui.item.label == noResultLabel){
                 event.preventDefault();
                }
            },
            change:function(event,ui){
                if(!ui.item){
                 event.preventDefault();
                }else{
                 $("#citybox").attr("data",ui.item.value);
                 event.preventDefault();
                }
            }
          }).autocomplete( "widget" ).addClass( "homePageDropdown" );
          var citySuggestion = document.getElementById('citybox').value;
          if(citySuggestion) {
            httpServices.getCityDetails(citySuggestion).then(  
            function (success) {
              
              if(success.length > 0) {
                $( "#citybox" ).autocomplete( "option", "source", success.map( function( el ) {
                  return el.city + ", " + el.state;
                }) ); 
              } else {
                $( "#citybox" ).autocomplete( "option", "source", success);  
              }

             $( "#citybox" ).autocomplete( "search" );

            }, function (error) {
              $( "#citybox" ).autocomplete( "option", "source", success);
            }); 
          }
        }

       $scope.printProperty = function() {
            $rootScope.$emit("printPropertyDetailMethod", {});
        }

        $scope.addFavProperty = function(listingId) {
            $rootScope.$emit("addPropertyDetailFavMehtod", {listingid : listingId});
        }

        $scope.getfavAddorNot = function() {
          $rootScope.$emit("checkFavMethod", {});
        }

        $scope.callAskQuestion = function(listingId) {
            $rootScope.$emit("addPropertyDetailAskQuestion", {});
        }

      $scope.setResType = function() {
        restype_tlc = $scope.resType;
      }

      $scope.goCityPage = function() {
        if($scope.locationText) {
          var city = $scope.locationText;
        } else {
          var city = angular.element('#citybox').val();
        }
          var isSelectedText = $("#citybox").attr("data");
          var isCurrentLocation = $scope.locationCheckBox;
        if(!city || (!isCurrentLocation && isSelectedText != city)) {
          $(".error_info_text").text('Please select city from suggestion list');
          $(".bottom_footer_error_message").show('slow');
          setTimeout(function () {
            $(".bottom_footer_error_message").hide('slow');
          }, 2000);
          return false;
        }
        httpServices.trackGoogleEvent('Orange Go button Enter City', 'Home Page', null, 'Enter City Go');
        var partsOfStr = city.split(',');
        $state.go('exploreCommunities', { state: partsOfStr[1], city: partsOfStr[0] });
      }

        var isMLSorKey = false;

        $("#terms").keyup(function (e) {
            var code = e.keyCode || e.which;
            if (code == 8) {
                if ($(this).val() == "") {
                    isMLSorKey = false;
                    $(".search-filter").hide();
                  $(this).removeClass('txtForMLSorAdd');
                  $(this).removeClass('txtForNeighborhood');
                    $(".pac-container").show();
                    $(".pac-container").addClass('hide');
                    $(".pac-container:after").addClass('hide');

                }
            }
            if ($(this).val() == "#" || $(this).val() == "@") { // || $(this).val() == ":"
                isMLSorKey = true;
                $(this).parent('div').addClass('open');
                $(".search-filter").show();
                if ($(this).val() == "@") {
                    $("#textForMLSooKeyword").html('Keywords');
                    //                    $(this).val('');
                  $(this).addClass('txtForMLSorAdd');
                }
                else {
                    $("#textForMLSooKeyword").html('MLS No');
                    //                    $(this).val('');
                  $(this).addClass('txtForMLSorAdd');
                }
                $(".pac-container").addClass('hide');
                $(".pac-container:after").addClass('hide');
            }
            else if ($(this).val() != "" && !isMLSorKey) {
                $(this).parent('div').removeClass('open');
                $(".search-filter").hide();
              $(this).removeClass('txtForMLSorAdd');
              $(this).removeClass('txtForNeighborhood');
                $(".pac-container").removeClass('hide');
                $(".pac-container:after").removeClass('hide');
            }
            if ($(this).val() == "" && !isMLSorKey) {
                isMLSorKey = false;
                $(".search-filter").hide();
                $(this).removeClass('txtForMLSorAdd');
              $(this).removeClass('txtForNeighborhood');
              $(".pac-container").show();
                $(".pac-container").addClass('hide');
                $(".pac-container:after").addClass('hide');

            }
        });
        $("#terms").focus(function () {
            if ($(this).val() != "") {
                $(this).parent('div').removeClass('open');
            }
        });

        $("#terms").blur(function () {
          if($scope.locationText == "")
            $(this).val("");
        });

        $rootScope.$on("urlUpdated", function (event, searchParams) {
            $scope.loadURLData();
        });

        $rootScope.$on("doSort", function (evvent, searchObj) {
            if (applicationFactory.getPolygon() != undefined) {
                var searchParams = applicationFactory.getSearchParameters();
                searchParams.location = applicationFactory.getPolygon();
            }
            applicationFactory.setSortParameters(searchObj);
            $scope.updateUrlAndLoadData();
        });

        /* function to get client details */
        $scope.getClients = function () {
            if ($scope.AudienceType == 'MLSAGENT') {
                if ($state.current.name && $state.current.name != 'tlc.legal') {
                    propertiesService.getClients({ agentId: appAuth.getAudienceId() }
                      , function (success) {
                          if (success != undefined && success.Count > 0) {
                              _.each(success.Clients, function (o) {
                                  o.FullName = o.FirstName + ' ' + o.LastName;
                              });
                              $scope.clients = success.Clients;

                                /*select client for context*/
                                if ($state.current.name == 'tlc.clientSummary' || $state.current.name == 'tlc.editClientProfile') {
                                  var clientId = $state.params.clientId;

                                  if (clientId != undefined && $scope.clients != undefined) {
                                    for (var i = 0; i < $scope.clients.length; i++) {
                                      var client = $scope.clients[i];
                                      if (client.Id == clientId) {
                                        $scope.getBookmarksClient(client);
                                      }
                                    }
                                  }
                                }
                          }
                      }, function (error) {
                          console.log("error " + error);
                      });
                }
            }
        }
      var navigatorTimer = null;
      var isChromium = window.chrome,
          winNav = window.navigator,
          vendorName = winNav.vendor,
          isOpera = winNav.userAgent.indexOf("OPR") > -1,
          isIEedge = winNav.userAgent.indexOf("Edge") > -1,
          isIOSChrome = winNav.userAgent.match("CriOS");


      /* functio to get geolocation*/

      $scope.getLocation = function(e) {
        $scope.action = e;
        if (navigator.geolocation) {
           if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
              $scope.showAddressFromLatLong();
           }else{
             navigator.geolocation.getCurrentPosition(
              $scope.getLocationString, $scope.showGetLocationError
            );
           }
        }
        else {
          $scope.showAddressFromLatLong();
        }
      }

      /* function to get latlong */
      $scope.getLocationString = function(position) {
        $scope.currentLocationLat = position.coords.latitude;
        $scope.currentLocationLon = position.coords.longitude;
        $scope.success = true;
        $scope.showAddressFromLatLong();

        //$scope.tryAPIGeolocation();
      }

      /* function to get latlong from address */
      $scope.showAddressFromLatLong = function(){
        $.ajaxSetup({
          async: false
        });
         $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?')
          .done(function (location) {
            if($("#checkbox-id-control").is(':checked')){
              $scope.locationInfo =  $scope.locationText = location.city + ", " + location.state + ", " + location.country_name + " (Current Location)";
            }else{
              $scope.locationInfo = "";
            if($("#checkbox-id" ).is(':checked') && $scope.locationCheckBox){
              $scope.cityCheckbox =  $scope.locationText = location.city + ", " + location.state + ", " + location.country_name + " (Current Location)";
            }
            if($scope.locationCheckBox && !$("#checkbox-id" ).is(':checked')){
              $scope.locationText = "";
               $scope.cityCheckbox = location.city + ", " + location.state + ", " + location.country_name + " (Current Location)";
            }if(!$scope.locationCheckBox && $("#checkbox-id" ).is(':checked')){
              $scope.locationText =  $scope.locationText = location.city + ", " + location.state + ", " + location.country_name + " (Current Location)";
               $scope.cityCheckbox = "";
            }if(!$("#checkbox-id" ).is(':checked') && !$scope.locationCheckBox){
              $scope.locationText = "";
               $scope.cityCheckbox = "";
            }
            $scope.currentLocationLat = location.latitude;
            $scope.currentLocationLon = location.longitude;
          }
          $scope.chooseErrorPostion();
            $scope.$apply();
          });

      }
      $scope.chooseErrorPostion = function(){
        if(typeof $scope.error != "undefined" && $scope.error != "") {
            if($scope.action == "checkbox-id")
              $scope.errorNotificationTop();
            else
              $scope.errorNotification();
          }
      }
      $scope.errorNotification = function(){
          if($scope.locationCheckBox){
            $(".error_info_text").text($scope.error);
            $(".bottom_footer_error_message").show('slow');
             setTimeout(function () {
                        $(".bottom_footer_error_message").hide('slow');
             }, 2000);
          }
      }
      $scope.errorNotificationTop = function(){

           if(!$(".aa-notification").is(':visible') && $("#checkbox-id" ).is(':checked')){
          aaNotify.danger($scope.error,
            {
              showClose: true,                            //close button
              iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
              allowHtml: true,                            //allows HTML in the message to render as HTML

              //common to the framework as a whole
              ttl: 1000 * 10  //time to live in ms
            });
            $scope.$apply();
          }

      }

      $scope.showGetLocationError = function (error) {

        $scope.error = "";
        if(error.message.indexOf("Only secure origins are allowed")!=-1) {
          $scope.showAddressFromLatLong();
        }else{
        switch (error.code) {
          case error.PERMISSION_DENIED:
            if($scope.success)
              $scope.error = "";
            else
              $scope.error = "User denied the request for Geolocation."
            break;
          case error.POSITION_UNAVAILABLE:
            $scope.error = "Location information is unavailable."
            break;
          case error.TIMEOUT:
            //$scope.error = "The request to get user location timed out."
            $scope.error = "";
            $scope.showAddressFromLatLong();
            break;
          case error.UNKNOWN_ERROR:
            $scope.error = "An unknown error occurred."
            break;
        }
      }
       $scope.chooseErrorPostion();
      }

      /*Do search called from the button go (->)
      * it will get parameter values from the elements.
      * */
        $scope.doSearch = function () {          
          if(!$(".aa-notification").is(':visible')){
            $scope.changeResidentType();
            if($('#price-min1').val() != "" && $('#price-max2').val() != "") {

              var minVal = parseInt($('#price-min1').val().replace(/,/g, ''));
              var maxVal = parseInt($('#price-max2').val().replace(/,/g, ''));

              var isValidMin = /^[0-9,.]*$/.test(minVal);
              var isValidMax = /^[0-9,.]*$/.test(maxVal);

              if(minVal > maxVal) {
                aaNotify.error('Minimum price should not exceed Maximum price.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                return false;
              } else if((!isValidMin && isNaN(minVal)) || (!isValidMax && isNaN(maxVal))) {
                aaNotify.error('The price range should be numbers.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                return false;
              } else if((minVal > 20000000 && !isNaN(minVal)) || (maxVal > 20000000 && !isNaN(maxVal))) {
                aaNotify.error('The price range should be between 0 and 20M.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                return false;
              }
          } else if($('#price-min1').val() != "" && $('#price-max2').val() == "") {
              var minVal = parseInt($('#price-min1').val().replace(/,/g, ''));
              var isValidMin = /^[0-9,.]*$/.test(minVal);

              if(!isValidMin && isNaN(minVal)) {
                aaNotify.error('The price range should be numbers.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                return false;
              } else if(minVal > 20000000 && !isNaN(minVal)) {
                aaNotify.error('The price range should be between 0 and 20M.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                return false;
              }
          } else if($('#price-min1').val() == "" && $('#price-max2').val() != "") {
              var maxVal = parseInt($('#price-max2').val().replace(/,/g, ''));
              var isValidMax = /^[0-9,.]*$/.test(maxVal);

              if(!isValidMax && isNaN(maxVal)) {
                aaNotify.error('The price range should be numbers.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                return false;
              } else if(maxVal > 20000000 && !isNaN(maxVal)) {
                aaNotify.error('The price range should be between 0 and 20M.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                return false;
              }
          }

          if($('#bed-min').val() != "" && $('#bed-max').val() != "") {
            var minBedVal = parseInt($('#bed-min').val().replace(/,/g, ''));
            var maxBedVal = parseInt($('#bed-max').val().replace(/,/g, ''));
            if(maxBedVal < minBedVal) {
                aaNotify.danger("Minimum bedroom value should not exceed Maximum bedroom value.",
                    {
                        showClose: true,
                        iconClass: 'fa fa-exclamation-triangle',
                        allowHtml: true
                    });
                return false;
            }
          }
          $scope.searchParameters.keywords = undefined;
          applicationFactory.setLocationText(undefined);
          $scope.locationText = $("input[id=terms]").val().replace("Search by keywords, city, ZIP, MLS #...", "").replace("%", "");
          if ($scope.locationText != undefined && $scope.locationText != '') {
            if (utilService.getKeywordPattern().test($scope.locationText) || utilService.getMLSNumberPattern().test($scope.locationText) || utilService.getNeighborhoodPattern().test($scope.locationText)) {
              applicationFactory.setLocationText(angular.copy($scope.locationText));

              /*clear textbox and mls or keyword hint text*/
              isMLSorKey = false;
              //if(!utilService.getMLSNumberPattern().test($scope.locationText)){
              $(".search-filter").hide();
              $("#terms").removeClass('txtForMLSorAdd');
              $("#terms").removeClass('txtForNeighborhood');
              $(".pac-container").show();
              $(".pac-container").addClass('hide');
              $(".pac-container:after").addClass('hide');
              $scope.locationText = "";
              $("#terms").val("");
              //}

            } else {
              applicationFactory.addAddress(angular.copy($scope.locationText));
            }
          }

          if ($scope.openHouseOnly) {

            $scope.openhousefromdate = $('#fromDate').val(); 
            $scope.openhousetodate = $('#toDate').val();

            if($scope.openhousefromdate == "" || $scope.openhousetodate == "") {
              aaNotify.danger("Please select open house dates",
              {
                showClose: true,
                iconClass: 'fa fa-exclamation-triangle',
                allowHtml: true
              });
              return false;
            }

              if($scope.openhousefromdate) {
                  var fromdate = new Date($scope.openhousefromdate);
                  var monthFromDate = fromdate.getMonth()+1;
                  var dateFromDate = fromdate.getDate();
                  var yearFromDate = fromdate.getFullYear();
                  $scope.searchParameters.openhousefromdate = yearFromDate+"/"+monthFromDate+"/"+dateFromDate;
              }
               if($scope.openhousetodate) {
                   var todate = new Date($scope.openhousetodate);
                   var monthToDate = todate.getMonth()+1;
                   var dateToDate = todate.getDate();
                   var yearToDate = todate.getFullYear();
                   $scope.searchParameters.openhousetodate = yearToDate+"/"+monthToDate+"/"+dateToDate;
               }
          } else {
            delete $scope.searchParameters.openhousefromdate;
            delete $scope.searchParameters.openhousetodate;
          }


          $scope.searchParameters.baths = $("select[name=bathrooms]").val() ? $("select[name=bathrooms]").val() : $("select[name=bathroomsMobile]").val();

          $scope.searchParameters.livingareamin = $("input[name=sqftmin]").val();
          $scope.searchParameters.livingareamax = $("input[name=sqftmax]").val();
          $scope.searchParameters.acresmin = $("input[name=acreagemin]").val();
          $scope.searchParameters.acresmax = $("input[name=acreagemax]").val();
          $scope.searchParameters.yearbuiltmin = $("input[name=yearmin]").val();
          $scope.searchParameters.yearbuiltmax = $("input[name=yearmax]").val();

          $scope.searchParameters.listingpricemin = $("input[name=pricemin]").val();
          $scope.searchParameters.listingpricemax = $("input[name=pricemax]").val();

          if($scope.searchParameters.listingpricemax != "" && $scope.searchParameters.listingpricemin == "") {
            $scope.searchParameters.listingpricemin = "0";
          }
          
          $scope.searchParameters.beds = $("select[name=bedrooms]").val();          

          $scope.searchParameters.bedsmin = $("input[name=bedmin]").val();

          $scope.searchParameters.bedsmax = $("input[name=bedmax]").val();
          // $scope.searchParameters.bedsmax = $scope.searchParameters.bedsmax+"-";
          $scope.searchParameters.tlcmin = $("input[name=tlcmin]").val() ? $("input[name=tlcmin]").val() : $("select[name=tlcminmob]").val();
          $scope.searchParameters.tlcmax = $("input[name=tlcmax]").val() ? $("input[name=tlcmax]").val() : $("select[name=tlcmaxmob]").val();

          if(($scope.searchParameters.bedsmin != "" && $scope.searchParameters.beds == "") || ($scope.searchParameters.bedsmin != "" && $scope.searchParameters.beds == null)) {
            $scope.searchParameters.beds = $scope.searchParameters.bedsmin+"+";
          }

          if($("input[name=bedmax]").val() != "" && $("input[name=bedmin]").val() == "") {
            $scope.searchParameters.bedsmin = "0";
          } else if($("input[name=bedmin]").val() != "" && $("input[name=bedmax]").val() == "") {
            $scope.searchParameters.bedsmax = "99";
          }

          var ResidentialSales = [];
          $('input:checkbox[name="ResidentialSales[]"]').each(function() {
            if (this.checked) {
              ResidentialSales.push(this.value);
            }
          });

          if(ResidentialSales.length > 0) {
              $scope.searchParameters.propertysubtype = ResidentialSales.join();
          }

          var commercialCriteria = [];
          $('input:checkbox[name="commercialCriteria[]"]').each(function() {
            if (this.checked) {
              commercialCriteria.push(this.value);
            }
          });

          if(commercialCriteria.length > 0) {
              $scope.searchParameters.propertysubtype = commercialCriteria.join();
          }

          var familyCriteria = [];
          $('input:checkbox[name="familyCriteria[]"]').each(function() {
            if (this.checked) {
              familyCriteria.push(this.value);
            }
          });

          if(familyCriteria.length > 0) {
              $scope.searchParameters.propertysubtype = familyCriteria.join();
          }

          if($("input[name='landCriteria']:checked").val()) {
              $scope.searchParameters.propertysubtype = $("input[name='landCriteria']:checked").val();
          }

          var selectedValue = $("#proptype option:selected").text().trim();
          if(selectedValue == "Residential") {            
            if($scope.resType == 'Rentals') {
               $scope.searchParameters.forsale = "0";
            } else if($scope.resType == 'Sales') {
               $scope.searchParameters.forsale = "1";
            }
            $scope.searchParameters.propertytype = 'Residential';
          } else if(selectedValue == "Commercial") {
              $scope.searchParameters.forsale = "0";
              $scope.searchParameters.propertytype = 'com';
          } else if(selectedValue == "Multi-Family") {
              $scope.searchParameters.forsale = "0";
              $scope.searchParameters.propertytype = 'multifamily';
          } else if(selectedValue == "Lot Land") {
              $scope.searchParameters.forsale = "0";
              $scope.searchParameters.propertytype = 'land';
          }
          // Water Features
          $scope.searchParameters.bodyofwater = $scope.BodyOfWater;
          $scope.searchParameters.waterfront = $("input[name='WaterFront']:checked").val();
          $scope.searchParameters.waterview = $("input[name='WaterView']:checked").val();
          $scope.searchParameters.wateraccess = $("input[name='WaterAccess']:checked").val();

          $scope.searchParameters.pricechange = $("input[name='PriceChange']:checked").val();
          $scope.searchParameters.foreclosure = $("input[name='Foreclosures']:checked").val();

          var localelistingstatus = [];
          $('input:checkbox[name="localelistingstatus[]"]').each(function() {
            if (this.checked) {
              localelistingstatus.push(this.value);
            }
          });

          if(localelistingstatus.length > 0) {
            $scope.searchParameters.localelistingstatus = localelistingstatus.join();
          } else {
            $scope.searchParameters.localelistingstatus = undefined;
          }


          if($scope.IsPetsAllowed) {
            $scope.searchParameters.ispetsallowed = $scope.IsPetsAllowed;
          }

          if($scope.OnMarket) {
            $scope.searchParameters.onmarket = $scope.OnMarket;
          }

          if($scope.parking) {
            $scope.searchParameters.garages = $scope.parking;
          }

          // Ownership Types
          var OwnershipType = [];
          $('input:checkbox[name="OwnershipType[]"]').each(function() {
            if (this.checked) {
              OwnershipType.push(this.value);
            }
          });

          if(OwnershipType.length > 0) {
            $scope.searchParameters.ownershiptype = OwnershipType.join();
          } else {
            $scope.searchParameters.ownershiptype = undefined;
          }

          // General Features
          $scope.searchParameters.basement = $("input[name='IsBasement']:checked").val();
          $scope.searchParameters.elevator = $("input[name='Elevator']:checked").val();
          $scope.searchParameters.builtinshelf = $("input[name='builtinshelves']:checked").val();
          $scope.searchParameters.woodfloor = $("input[name='IsWoodFloor']:checked").val();
          $scope.searchParameters.fireplace = $("input[name='Fireplace']:checked").val();
          $scope.searchParameters.handicapequiped = $("input[name='HandicapEquipped']:checked").val();
          $scope.searchParameters.cedarcloset = $("input[name='Cedar']:checked").val();
          $scope.searchParameters.remarks =  $scope.remarks;

          // Air Conditioning

          var airCondition = [];
          $('input:checkbox[name="Cooling[]"]').each(function() {
            if (this.checked) {
              airCondition.push(this.value);
            }
          });

          if(airCondition.length > 0) {
            $scope.searchParameters.coolingtype = airCondition.join();
          } else {
            $scope.searchParameters.coolingtype = undefined;
          }

            var CoolingFuel = [];
            $('input:checkbox[name="CoolingFuel[]"]').each(function() {
                if (this.checked) {
                    CoolingFuel.push(this.value);
                }
            });

            if(CoolingFuel.length > 0) {
                $scope.searchParameters.coolingfuel = CoolingFuel.join();
            } else {
              $scope.searchParameters.coolingfuel = undefined;
            }

          var PoolFeature = [];
          $('input:checkbox[name="PoolFeature[]"]').each(function() {
            if (this.checked) {
              PoolFeature.push(this.value);
            }
          });

          if(PoolFeature.length > 0) {
            $scope.searchParameters.poolfuture = PoolFeature.join();
          } else {
            $scope.searchParameters.poolfuture = undefined;
          }

          if($scope.CommunityRules) {
            $scope.searchParameters.communityrule = $scope.CommunityRules;
          }

          if($scope.IsAgeRestricted) {
            $scope.searchParameters.isagerestricted = $scope.IsAgeRestricted;
          }

          // Home Features
          var StyleOfHome = [];
          $('input:checkbox[name="StyleOfHome[]"]').each(function() {
            if (this.checked) {
              StyleOfHome.push(this.value);
            }
          });

          if(StyleOfHome.length > 0) {
            $scope.searchParameters.propertystyle = StyleOfHome.join();
          } else {
            $scope.searchParameters.propertystyle = undefined;
          }

          var StoryLevel = [];
          $('input:checkbox[name="StoryLevel[]"]').each(function() {
            if (this.checked) {
              StoryLevel.push(this.value);
            }
          });

          if(StoryLevel.length > 0) {
            $scope.searchParameters.storylevel = StoryLevel.join();
          } else {
            $scope.searchParameters.storylevel = undefined;
          }

          // Room Features
          $scope.searchParameters.den = $scope.den;
          $scope.searchParameters.isfamilyroom = $scope.IsFamilyRoom;
          $scope.searchParameters.isinlaw = $scope.IsInLaw;
          $scope.searchParameters.islibrary = $scope.IsLibrary;
          $scope.searchParameters.isloft = $scope.IsLoft;
          $scope.searchParameters.issunroom = $scope.IsSunRoom;
          $scope.searchParameters.isworkshop = $scope.IsWorkshop;
          $scope.searchParameters.propertystylenone = $("input[name='propertystylenone']:checked").val();


          $scope.searchParameters.schoolname = _.map($scope.schooldistricts, function (o) {
            return o.SDN + "::" + (o.SDN || '');
          }).join(",");

          $scope.searchParameters.subdivision = _.map($scope.subdivisions, function (o) {
            return o.Subdivision;
          }).join(",");

          if ($scope.propertyStatus.length == $scope.StatusList.length) {
            $scope.searchParameters.status = 'All';
          } else {
            $scope.searchParameters.status = $scope.propertyStatus.join(",");
          }

          $scope.searchParameters.contingent = _.map($scope.contingencies, function (o) {
            return o.text + "::" + o.value;
          }).join(",");

            //Condition for multi family units
            if($scope.searchParameters.propertytype != undefined && $scope.searchParameters.propertytype == 'mf'){
              $scope.searchParameters.numberofunits = $("select[name=numberofunits]").val();
            }else{
              $scope.searchParameters.numberofunits = undefined;
            }

            //Condition for multi family units
            if($scope.searchParameters.propertytype != undefined && $scope.searchParameters.propertytype == 'mf'){
              $scope.searchParameters.numberofunits = $("select[name=numberofunits]").val();
            }else{
              $scope.searchParameters.numberofunits = undefined;
            }

            if ($scope.locationText != undefined && !utilService.getPolygonPattern().test(decodeURIComponent($scope.locationText))) {
                applicationFactory.setPolygon(undefined);
                $scope.drawingStatus = "Draw an area";
            }
          if($scope.currentLocationLat && $scope.currentLocationLat != 0 && $scope.currentLocationLon && $scope.currentLocationLon != 0) {
            $scope.searchParameters.cllat = $scope.currentLocationLat;
            $scope.searchParameters.cllon = $scope.currentLocationLon;
          }
            /*Update search parameters in to application factory*/
            applicationFactory.setSearchParameters($scope.searchParameters, false);
            /*Update the url and parameters value */
            $scope.updateUrlAndLoadData();
            //        $scope.loadURLData();
            $scope.hideSearchOptions();
            console.log(angular.toJson($scope.searchParameters));
            if ($("#search").hasClass("expanded"))
                $("#active_qualifiers .qualitoggle").click();
         }else{
          return false;
         }

        }

        $scope.searchKeyUpHandler = function (event) {
            if (event.keyCode == 13) {
                $scope.doSearch();
            }
        }

        $scope.saveSearchKeyUpHandler = function (event) {
            if (event.keyCode == 13) {
              if ($scope.saveSearchName) {
                var saveName = angular.copy($scope.saveSearchName);
                $rootScope.$broadcast("saveSearch", saveName);
                $scope.saveSearchName = "";
              } else {
                if(!$(".aa-notification").is(':visible')){
                    aaNotify.danger("'Search Name' should not be empty.",
                        {
                            showClose: true,                            //close button
                            iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                            allowHtml: true,                            //allows HTML in the message to render as HTML
                            ttl: 1000 * 3                               //time to live in ms
                        });
                    } else {
                      return false;
                    }

              }
            }
        }

        $scope.$watch('searchParameters.location', function (newValue, oldValue) {
            if (newValue) {
                if (utilService.getPolygonPattern().test(newValue)) {
                    $scope.searchParameters.location = undefined;
                }
            }
        });

        $scope.changeTransportType = function () {
            $timeout(function () {
                $('.title-tipso').tipso();
            }, 1000);
        };

        $rootScope.$on("searchSaved", function (event, object) {
            $scope.loadSavedSearch();
        });

        $rootScope.$on("onDrawingComplete", function (event, polygon) {
            $scope.drawingCompleteCallback(polygon);
        });

        $scope.openMoreSearchTag = function () {
            $("#show_inner_detail").toggleClass('openInfoFilter');
            $(".inner-filter").toggleClass('displayInfoFilter');
            $("#topactions").toggleClass('moreSearchHide');
            $(".search-criteria-container").toggleClass('moreSearchcontainer');
            $("#IsSearchCriteriaDisplayClientSearchEnabled").toggleClass('moresearchdisplay')
            // for set dynemic search tag width
            //setSearchTagWidth();
        }

        /* function to set url parameters with encoded */
        $scope.updateUrlAndLoadData = function () {
            var filterParam = applicationFactory.filterAllParameters();

            //        filterParameters(filterParam)
            var parameters = applicationFactory.generateSearchURL(filterParam);

            /*only for update Tags*/
            var filtered = $scope.getFilteredParams();

            $scope.updateTags(filtered);
            /*******/

            $rootScope.$broadcast("doSearch", $scope.searchParameters);

            if ($scope.AudienceType == 'MLSAGENT') {
              if ($state.current.name == 'tlc.search') {
                    $state.go('tlc.search', { searchParams: parameters }, { location: true, inherit: false, notify: false });
                } else {
                    $state.go('tlc.search', { searchParams: parameters });
                }
            }
            else {
                if ($state.current.name == 'tlcClient.search') {
                  $state.go('tlcClient.search', { searchParams: parameters }, { location: true, inherit: false, notify: false });
                } else {
                  $state.go('tlcClient.search', { searchParams: parameters });
                }
            }
          $('.prop-list-scroll').scrollTop(0);
          $scope.$broadcast("updatepscrollbar");
          //$("#search").removeClass("removeBG");
        }

        /* function to retrive paremeters in listing page search */
        $scope.retrieveSearchParameters = function () {
            if ($stateParams.searchParams != undefined && $stateParams.searchParams != "") {
                applicationFactory.URLStringToSearchParam($stateParams.searchParams);
                var params = $stateParams.searchParams.split(";");
                for (var i = 0; i < params.length; i++) {
                    var keyVal = params[i].split(':');
                    if (keyVal.length == 2) {
                        if (keyVal[0] == 'location') {
                            $scope.setSearchParameters(keyVal[0], decodeURIComponent(keyVal[1]));
                        } else {
                            $scope.setSearchParameters(keyVal[0], keyVal[1]);
                        }
                    }
                }
            }
        }

        /* function to set paremeters in listing page search */
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
                case 'garages':
                    $scope.searchParameters[key] = value;
                    $("select[name=garages]").val(value);
                    break;
                case 'propertytype':
                    $scope.searchParameters[key] = value;
                    if(value == 'Residential') {
                        $("select[name=proptype]").val("Residential");
                    } else if(value == 'com') {
                        $("select[name=proptype]").val("Commercial");
                    }  else if(value == 'multifamily') {
                        $("select[name=proptype]").val("Multi-Family");
                    } else if(value == 'land') {
                        $("select[name=proptype]").val("Lot-Land");
                    }  else {
                        $("select[name=proptype]").val("Residential");
                    }
                    break;
                case 'location':
                    $scope.searchParameters[key] = value;
                    break;
                case 'openhousefromdate':
                case 'openhousetodate':
                  $scope.openHouseOnly = true;
                  break;
                default:
                    if(value.indexOf("-") != -1) {
                      $scope.searchParameters[key] = value.replace(/-/g, "");
                    } else {
                      $scope.searchParameters[key] = value;
                    }
                    break;
                    /*Load home screen*/
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
                        case 'listingpricemin':
                        case 'listingpricemax':
                            if ((filters['listingpricemin'] == undefined) || (filters['listingpricemax'] == undefined) || (utilService.removeCommasFromNumber(filters['listingpricemin']) == $scope.priceRange.min
                              && utilService.removeCommasFromNumber(filters['listingpricemax']) == $scope.priceRange.max)) {
                                delete filters['listingpricemin'];
                                delete filters['listingpricemax'];
                            }
                            break;
                        case 'acresmin':
                        case 'acresmax':
                            if ((filters['acresmin'] == undefined) || (filters['acresmax'] == undefined) || (utilService.removeCommasFromNumber(filters['acresmin']) == $scope.acresRange.min
                              && utilService.removeCommasFromNumber(filters['acresmax']) == $scope.acresRange.max)) {
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
                        case 'commutetimemins':
                        case 'commutemode':
                            if ((filters['commutetimemins'] == undefined) || (filters['commutetimemins'] == "") || (filters['commutetimemins'] == 0) || (filters['commutemode'] == undefined) || (filters['commutemode'] == "")) {
                                delete filters['commutetimemins'];
                                delete filters['commutemode'];
                            } else {
                                if ((filters['location'] == undefined) || (filters['location'] == "") || utilService.getPolygonPattern().test(decodeURIComponent(filters['location']) || utilService.getMLSNumberPattern().test(decodeURIComponent(filters['location'])))) {
                                    delete filters['commutetimemins'];
                                    delete filters['commutemode'];
                                }
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

        /*Initialize ui components*/
        $scope.initUiComponents = function () {
            try {
                /* show qualifiers */
                $("#active_qualifiers .qualitoggle").click(function () {
                    $("#search").toggleClass("expanded");
                    $("#topactions").toggleClass("hidden"); /* HOX2: #draw replaced with #topactions */
                    if ($("#search").hasClass("expanded")) {
                        $(this).html("<span>-</span> Less");
                        // $("#saved-search-opetion").hide();
                    }
                    else {
                        //$(this).html("<span>+</span> More " + $scope.TotalSearchFilter);
                        $(this).html("<span>+</span> More ");
                        // $("#saved-search-opetion").show();
                    }
                    return false;
                });
                $("#qualifiers .qualitoggle").click(function () {
                    // expand
                    $("#search, #logo, #slogan").addClass("more");
                    // animation overflow fix
                    $("#search").addClass("contain");
                    setTimeout(function () {
                        $("#search").removeClass("contain");
                    }, 500);
                    return false;
                });

                $timeout(function () {
                  $("#tlc_bedrooms").attr('tabindex', '1');
                  $("#tlc_bathrooms").attr('tabindex', '2');
                  $("#tlc_tlc").attr('tabindex', '3');
                  $("#tlc-min").attr('tabindex', '4');
                  $("#tlc-max").attr('tabindex', '5');
                  // $("#tlc_price").attr('tabindex', '6');
                  $("#price-min1").attr('tabindex', '7');
                  $("#price-max2").attr('tabindex', '8');
                  $("#tlc_bathroomss").attr('tabindex', '9');
                    var value = $scope.searchParameters.propertytype;
                    if(value == 'Residential') {
                        $("select[name=proptype]").val("Residential");
                        $("#tlc_proptype span").html('Residential');

                    } else if(value == 'com') {
                        $("select[name=proptype]").val("Commercial");
                        $("#tlc_proptype span").html('Commercial');
                    }  else if(value == 'multifamily') {
                        $("select[name=proptype]").val("Multi-Family");
                        $("#tlc_proptype span").html('Multi-Family');
                    } else if(value == 'land') {
                        $("select[name=proptype]").val("Lot-Land");
                        $("#tlc_proptype span").html('Lot-Land');
                    }  else {
                        $("select[name=proptype]").val("Residential");
                        $("#tlc_proptype span").html('Residential');
                    }
                  //$("select[name=proptype]").val("Residential");

                    $("#loan,#fico,#soldbefore").focus(function () {
                      $(".tlc_qualifier").each(function () {
                        $(this).removeClass('active');
                      });
                      $scope.hideClientList();
                    });

                  $("#searchClientList").focus(function () {
                    $(".tlc_qualifier").each(function () {
                      $(this).removeClass('active');
                    });

                    $scope.addClassForApplyClient();
                  });


                    $("#tlc_bedrooms,#tlc_bathrooms,#tlc_garages,#tlc_numberofunits,#tlc_sqft,#tlc_acres,#tlc_proptype,#tlc_year,#price-min,#tlc_commute-time,#tlc_tlc").focus(function () {
                        $(".tlc_qualifier").each(function () {
                            $(this).removeClass('active');
                        });

                      $scope.hideClientList();

                        if ($(this).attr('id') != "price-min") {
                            $(this).addClass('active');
                        }
                    });

                }, 600);

            } catch (error) {
                console.log(error);
            }
        };
        $scope.changeResidentType = function(){          
             $("#resType").val(restype_tlc);
             $scope.resType = restype_tlc;
        }
 
        /* function to load more option in home page search */
        $scope.clickMore = function() {
          $scope.changeResidentType();
            if($state.current.name == 'searchHome') {
                httpServices.trackGoogleEvent('Clicked More in search options', 'Home Page', null, 'Clicked More button');
            } else {
                httpServices.trackGoogleEvent('Clicked More button', 'Search Results', null, 'Clicked More');
            }

          $("#search").addClass("more-all");
          $("#search").removeClass("more-none");
          $("#search.expanded").height('screen.height- 2%');
          $(".commonClass").removeClass("more-removeClass");
          $timeout(function () {
              $("#tlc_bedrooms").attr('tabindex', '1');
              $("#tlc_bathrooms").attr('tabindex', '2');
              $("#tlc_garages").attr('tabindex', '3');
              $("#tlc_numberofunits").attr('tabindex', '4');
              $("#tlc_sqft").attr('tabindex', '5');
              $("#sqft-min").attr('tabindex', '6');
              $("#sqft-max").attr('tabindex', '7');
              $("#tlc_acres").attr('tabindex', '8');
              $("#acres-min").attr('tabindex', '9');
              $("#acres-max").attr('tabindex', '10');
              $("#tlc_proptype").attr('tabindex', '11');
              $("#tlc_year").attr('tabindex', '12');
              $("#tlc_commute-time").attr('tabindex', '13');
              $("#searchClientList").attr('tabindex', '14');
              $("#year-min").attr('tabindex', '15');
              $("#year-max").attr('tabindex', '16');
              // $("#tlc_price").attr('tabindex', '17');
              $("#price-min1").attr('tabindex', '18');
              $("#price-max2").attr('tabindex', '19');
              $("#tlc_tlc").attr('tabindex', '20');
              $("#tlc-min").attr('tabindex', '21');
              $("#tlc-max").attr('tabindex', '22');
              //$("#propertystyle").attr('tabindex', '20');
              $("#loan").attr('tabindex', '24');
              $("#fico").attr('tabindex', '25');
              //$("#school").attr('tabindex', '23');
              $("#soldbefore").attr('tabindex', '27');
          }, 600);
        }

        /* function to hide more option in home page search */
        $scope.clickLess = function() {
          $("#search").removeClass("more");
          $("#search").addClass("more-none");
          $('.nav-tabs a:first').tab('show');
          $("#search").removeClass("more-all").height("");
          $(".commonClass").addClass("more-removeClass");
        }
        $scope.hideSearchOptions = function () {
            if ($("#search").hasClass("expanded")) {
                $("#search").toggleClass("expanded");
                $("#topactions").toggleClass("hidden"); /* HOX2: #draw replaced with #topactions */
                $("#active_qualifiers .qualitoggle").html("<span>+</span> More");

            }
        }

        /* function to set tab height with respective content */
        $scope.setTabHeight = function(tabId,tabHeight) {
          if(tabId == 'home') {
            var isMore = $("#search").hasClass('more-all');
            if(isMore == true) {
              tabHeight =""
              $("#search").height(tabHeight);
            } else {
              $("#search").height(tabHeight);
            }
          }
        };

        /*It will broadcast start drawing event*/
        $scope.startDrawing = function () {
            //httpServices.trackGoogleEvent('Drawing','search-elements');

            $scope.isDrawing = !$scope.isDrawing;
            if ($scope.isDrawing) {
                $scope.drawingStatus = "Cancel drawing";
            } else {
                $scope.drawingStatus = "Draw an area";
            }
            $rootScope.$broadcast("onStartDrawing");
        }

        /*Drawing complete callback called from the mapview when drawing complets*/
        $scope.drawingCompleteCallback = function (polygon) {
            applicationFactory.setLocationText($scope.locationText);
            $scope.isDrawing = false;
            //$scope.drawingStatus = "Redraw the area";
            $scope.drawingStatus = "Draw an area";
            //$scope.searchParameters.location = polygon;
            applicationFactory.setSearchParameters($scope.searchParameters, false);
            $scope.updateUrlAndLoadData();
        }

        if ($rootScope.clientName != undefined) {
            $("#ManageClientsSpan").html($rootScope.clientName);
            $("#ManageClientsSpan_Home").html($rootScope.clientName);
        }

        /* to get bookemareked details for client */
        $scope.getBookmarksClient = function (client, applySearch) {
            //httpServices.trackGoogleEvent('SetClient','search-elements');

            if($state.params.IsNew != '1') {
              aaNotify.success(client.FullName + ' has been applied to the search');
            }

            $scope.SearchClient = '';
            $scope.selectedClient = client;
            $(".property-title").show();
            $(".scroll-wrapper.property-sort-infobox").css({ 'top': '250px', 'height': '390px' });
            applicationFactory.setSelectedClient(client);
            $rootScope.$broadcast("selectClient", $scope.selectedClient);
            $timeout(function () {
                $(".remove_client").tipso("hide");
            }, 100);

            if (applySearch) {
                $scope.openConfirmForApplyProfileToSearch();
            }
        }

        $scope.removeClient = function () {
            $scope.selectedClient = undefined;
            applicationFactory.setSelectedClient(undefined);
            $rootScope.$broadcast("selectClient", $scope.selectedClient);
            $(".remove_client").tipso("hide");
        }

        $scope.openClientProfile = function (client) {
            //httpServices.trackGoogleEvent('ClientSummary','search-elements');
            $scope.selectedClient = client;
            $(".property-title").show();
            $(".scroll-wrapper.property-sort-infobox").css({ 'top': '250px', 'height': '390px' });
            $state.go('tlc.clientSummary', { clientId: client.Id });
        }

        $scope.goToHome = function () {
            //httpServices.trackGoogleEvent('GoToHome','search-elements');

            if ($scope.AudienceType == 'MLSAGENT') {
                $state.go('agentDashboard');
            }
            else {
                $state.go('clientDashboard');
            }
        }

        $scope.newClient = function () {
            //httpServices.trackGoogleEvent('NewClient','search-elements');

            $state.go('tlc.newClient');
        }

        $scope.openConfirmForApplyProfileToSearch = function () {
            if ($scope.selectedClient != undefined) {
                $scope.applyTLCProfileSearch($scope.selectedClient);
            }
        }

        $rootScope.$on("applyTLCProfileToSearch", function (event, client) {
            $scope.applyTLCProfileSearch(client);
        });


      $(document).keyup(function(e) {
      if (e.keyCode === 27){    //escape key pressing
        if ($("#draw").hasClass("active") && $scope.isDrawing){    //if drawing is opened
                 $("#draw").click();     // calling click method
        }   
      } 
      });

        /* to apply TLC while doing profile searxh */
        $scope.applyTLCProfileSearch = function (client) {
            propertiesService.agentClientDetail({ clientId: client.Id, agentId: appAuth.getAudienceId() }
                , function (success) {
                    if (success != undefined) {
                        var client = success;
                        if (client.Profile != undefined && client.Profile != null
                            && client.Profile.BasicData != undefined && client.Profile.BasicData != null) {

                            $scope.searchParameters.ficoscore = client.Profile.BasicData.CreditScore;
                            $scope.searchParameters.lifestyle = client.Profile.BasicData.MStatus;
                            var minval = utilService.formatNumber(client.Profile.BasicData.TLCMin);
                            var maxval = utilService.formatNumber(client.Profile.BasicData.TLCMax);
                            if (client.Profile.BasicData.TLCMin >= 0 && client.Profile.BasicData.TLCMax >= 0) {
                                $("input[name=tlcmin]").val(minval);
                                $("input[name=tlcmax]").val(maxval);
                                $scope.searchParameters.tlcmin = minval;
                                $scope.searchParameters.tlcmax = maxval;
                                $timeout(function () {
                                    $("input[name=tlcmin]").trigger("keyup");
                                    $("input[name=tlcmax]").trigger("keyup");
                                }, 200);
                            }
                            else
                            {
                              $("input[name=tlcmin]").val('');
                              $("input[name=tlcmax]").val('');
                              $scope.searchParameters.tlcmin = '';
                              $scope.searchParameters.tlcmax = '';
                            }

                            $scope.searchParameters.loantype = "";
                        }

                    }
                }, function (error) {
                    console.log("error " + error);
                });
        }

        $scope.logout = function () {
            //httpServices.trackGoogleEvent('Logout','search-elements');

            httpServices.logoutUser();
        }

        /* function to display rets field in listing page */
        $scope.updateTags = function (filters) {     
          $scope.tags = [];
          $rootScope.filters = filters;
          for (var key in filters) {
            var filterText = key;
            filterText = fieldShortName[key];
            var filterValue = filters[key];
            var boolIsSchool = false;

            if (key != 'orderby' && key != 'orderbydirection' && key != 'status' && key != 'openHouseOnly') {
                switch(key) {
                  case 'schoolname':
                      boolIsSchool = true;
                      filterValue = decodeURIComponent(filterValue);                      
                      var fileterSplit = filterValue.split(',');
                       if (fileterSplit.length > 0) {
                        var schoolValues = [];
                        for (var i = 0; i < fileterSplit.length; i++) {
                          var splitValues = fileterSplit[i].split('::');                          
                          schoolValues.push(splitValues[1].trim());
                        }
                        $scope.tags.push({ "key": key, "text": filterText, "value": schoolValues.join() });
                      }
                  break;

                  case 'contingent':
                    boolIsSchool = true;
                    filterValue = decodeURIComponent(filterValue);
                    var fileterSplit = filterValue.split(',');
                    if (fileterSplit.length > 0 && fileterSplit.indexOf('All') == -1) {
                      for (var i = 0; i < fileterSplit.length; i++) {
                        var splitValues = fileterSplit[i].split('::');
                        $scope.tags.push({ "key": key, "text": filterText, "value": splitValues[0].trim() });
                      }
                    }
                  break;

                  case 'forsale':
                    boolIsSchool = true;
                    if(filterValue == "1") {
                      key = 'Sale';
                    } else if(filterValue == "0") {
                      key = 'Rental';
                    }
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'builtinshelf':
                    boolIsSchool = true;
                    filterValue = 'Built-in Shelves';
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'builtinshelf':
                    boolIsSchool = true;
                    filterValue = 'Built-in Shelves';
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'handicapequiped':
                    boolIsSchool = true;
                    filterValue = 'Handicap Equipped';
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'woodfloor':
                    boolIsSchool = true;
                    filterValue = 'Wood Floors';
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'cedarcloset':
                    boolIsSchool = true;
                    filterValue = 'Cedar Closet';
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'waterfront':
                    boolIsSchool = true;
                    filterValue = 'Water Front';
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'waterview':
                    boolIsSchool = true;
                    filterValue = 'Water View';
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'wateraccess':
                    boolIsSchool = true;
                    filterValue = 'Water Access';
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'propertytype':
                    boolIsSchool = true;
                    if(filterValue == 'com') {
                      filterValue = 'Commercial';
                    } else if(filterValue == 'multifamily') {
                      filterValue = 'Multifamily';
                    } else if(filterValue == 'land') {
                      filterValue = 'Lot Land';
                    }
                    $scope.tags.push({ "key": filterValue, "text": filterText, "value": filterValue });
                  break;

                  case 'propertysubtype':
                     var mapObj = {
                              "Detached":"Single Family-Detached",                          
                              "Mobile": "Mobile Home",
                              "Quad": "Fourplex",
                              "Attach/Row Hse": "Attached/Row house",
                              "Bed & Breakfast": "Bed & Breakfast/Hotel/Motel",
                              "feeSimple": "Fee Simple",
                              "groundRent": "Ground Rent",
                              "atticfan": "Attic Fan",
                              "ceilingfans": "Ceiling Fans",
                              "heatpump": "Heat Pump",
                              "noairconditioning": "No Air Conditioning",
                              "othercooling": "Other Cooling",
                              "wallunit": "Wall unit(s)",
                              "wholehousefan": "Whole House Fan",
                              "windowunit": "Window unit(s)",
                              "aboveground": "Above Ground",
                              "inground": "In Ground",
                              "Raised Rancher": "Raised Ranch",
                              "Rancher": "Ranch"
                            };
                      
                      filters[key] = filters[key].replace(/Detached|Mobile|Quad|Bed & Breakfast|feeSimple|groundRent|atticfan|ceilingfans|heatpump|noairconditioning|othercooling|wallunit|wholehousefan|windowunit|aboveground|inground|Raised Rancher|Rancher/gi, function(matched){
                          return mapObj[matched];
                      });

                      boolIsSchool = true;
                      filterValue = filters[key];  
                      $scope.tags.push({ "key": filterValue, "text": filterText, "value": filterValue });
                  break;

                  case 'propertystyle':
                  case 'coolingtype':
                  case 'coolingfuel':
                  case 'poolfuture':
                  case 'propertystylenone':
                  case 'bodyofwater': 
                  case 'loantype':
                  case 'lifestyle':
                  case 'beds':
                    boolIsSchool = true;
                    $scope.tags.push({ "key": filterValue, "text": filterText, "value": filterValue });
                  break;

                  case 'communityrule':
                    if(filterValue == 'catsonly') {
                      filterValue = 'Cats Only';
                    } else if(filterValue == 'sizerestriction') {
                      filterValue = 'Size Restriction';
                    }
                    boolIsSchool = true;
                    $scope.tags.push({ "key": filterValue, "text": filterText, "value": filterValue });
                  break;

                  case 'storylevel':
                    boolIsSchool = true;
                    filterText =  "Levels";
                    filterValue = decodeURIComponent(filterValue);
                    var levelFilters = filterValue.split(',');
                    if(levelFilters.length == 1) {
                      $scope.tags.push({ "key": filterValue, "text": filterText, "value": filterValue });
                    } else {
                      $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                    }
                  break;

                  case 'localelistingstatus':
                  case 'ownershiptype':
                  case 'subdivision':
                    boolIsSchool = true;
                    filterValue = decodeURIComponent(filterValue);
                    var statusFilters = filterValue.split(',');
                    if(statusFilters.length == 1) {
                      $scope.tags.push({ "key": filterValue, "text": filterText, "value": filterValue });
                    } else {
                      $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                    }
                  break;

                  case 'isagerestricted':
                    key = key.replace('is','');
                    boolIsSchool = true;
                    if(filterValue == 0 && key == 'agerestricted') {
                      key =  "Age Restricted : No";
                    } else if(filterValue == 1 && key == 'agerestricted') {
                      key =  "Age Restricted : Yes";
                    }
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'ispetsallowed':
                    key = key.replace('is','');
                    boolIsSchool = true;
                    if(filterValue == 0 && key == 'petsallowed') {
                      key =  "Pets Allowed : No";
                    } else if(filterValue == 1 && key == 'petsallowed') {
                      key =  "Pets Allowed : Yes";
                    }
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'isfamilyroom':
                    key = "Family Room";
                    boolIsSchool = true;
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'issunroom':
                    key = "Sun Room";
                    boolIsSchool = true;
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'isinlaw':
                    key = "In Law";
                    boolIsSchool = true;
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'islibrary':
                    key = "In Library";
                    boolIsSchool = true;
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'isloft':
                    key = "In Loft";
                    boolIsSchool = true;
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'isworkshop':
                    key = "Workshop";
                    boolIsSchool = true;
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'keywords':
                    boolIsSchool = true;
                    if(utilService.getMLSNumberPattern().test(filters[key])){                  
                      var strValue = filters[key];
                      var mlsNoList = strValue.split(",");
                      for(var i=0; i<mlsNoList.length; i++){
                        var value = mlsNoList[i];
                        if(value.indexOf("#") == -1){
                          value = "#" + value;
                        }
                        filterText = "ML#";
                        filterValue = value;
                        $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                      }
                    } else {
                      filterText = "";
                      filterValue = filters[key];
                      $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                    }
                  break;

                  case 'commutes':
                    boolIsSchool = true;
                    filterText = "";
                    filterValue = filters[key];
                    for (var i = 0; i < filterValue.length; i++) {
                      var commute = filterValue[i];
                      var mode = commute.commutemode;
                      if (mode == "transit,walk") {
                        mode = "walk"
                      } else if (mode == "transit") {
                        mode = "train"
                      }
                      var newvalue = commute.commutetimemins + "mins by " + mode + " To " + commute.commuteaddress;
                      $scope.tags.push({ "key": key, "text": filterText, "value": newvalue,commute:commute });
                    }
                  break;

                  case 'addresses':
                  case 'polygons':
                    var values = filters[key];
                    if(values != undefined && values.length > 0 ){
                      var polygonCounters = applicationFactory.getPolygonCounter();
                      for(var i= 0; i< values.length; i++){
                        if(key == "polygons"){
                          filterText = "";
                          filterValue = "Draw " + polygonCounters[i];
                        } else {
                          var re = /^[0-9]+$/;
                          var zipcode = re.test(values[i]);
                          if(!zipcode) {
                            filterText = "";
                          } else {
                            filterText = "Zip Code";
                          }
                          filterValue = values[i];
                        }

                        var locInd;
                        if(filters["CommuteLocationIndex"] != undefined){
                          locInd = Number(filters["CommuteLocationIndex"]);
                        }

                        if(locInd > -1  && key == "addresses" && i == locInd) {
                          /* we do not add location if it is in commute.*/
                        }else{
                          $scope.tags.push({ "key": key, "text": filterText, "value": filterValue , "data": values[i]});
                        }
                      }
                  }
                  break;

                  case 'openhousefromdate':              
                    boolIsSchool == true;
                    filterText = fieldShortName[key];
                    filterValue = filters['openhousefromdate'] + " To " + filters['openhousetodate'];
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'yearbuiltmin':                  
                    boolIsSchool == true;
                    filterValue = filters['yearbuiltmin'] + " To " + filters['yearbuiltmax'];
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  break;

                  case 'bedsmin':
                    boolIsSchool == true;
                    if(filters[key.replace("min", "max")] != undefined) {
                      filterValue = utilService.formatNumber(filters[key]) + " Beds-" + utilService.formatNumber(filters[key.replace("min", "max")]) + " Beds";
                      filterValue = abbrNum(filters[key], 1) + " Min Beds-" + abbrNum(filters[key.replace("min", "max")].replace(/-/g, ''), 1) + " Max Beds";
                      $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                      for(var tag in $scope.tags) {
                        if($scope.tags[tag].text == 'beds') {
                          $scope.tags.splice(tag, 1)                        
                        }
                      }                      
                    }
                  break;

                  case 'listingpricemin':
                  case 'listingpricemax':
                  case 'sqftmin':
                  case 'sqftmax':
                  case 'acresmin':
                  case 'acresmax':
                  case 'tlcmin':
                  case 'tlcmax':
                  case 'livingareamin':
                  case 'livingareamax':
                    filterValue = filters[key];
                    if (key.indexOf("min") != -1 && key.indexOf("min") == (key.length - 3)) {
                      if(filters[key.replace("min", "max")] != undefined) {
                        if ((filters[key].replace(/,/g, '') > 1000 || filters[key.replace("min", "max")].replace(/,/g, '') > 1000) && key.indexOf("yearbuiltmin") != -1) {
                          filterValue = utilService.getSortPriceforSearch(filters[key].replace(/,/g, '')) + "-" + utilService.getSortPriceforSearch(filters[key.replace("min", "max")].replace(/,/g, ''));
                        }
                        else {
                          filterValue = utilService.formatNumber(filters[key]) + "-" + utilService.formatNumber(filters[key.replace("min", "max")]);
                          filterValue = abbrNum(filters[key], 1) + "-" + abbrNum(filters[key.replace("min", "max")], 1);
                      }
                      boolIsSchool = true;
                      $scope.tags.push({ "key": filterValue, "text": filterText, "value": filterValue });
                    } else {
                        boolIsSchool = true;
                        filterValue = utilService.getSortPriceforSearch(filters[key].replace(/,/g, ''));
                        $scope.tags.push({ "key": filterValue, "text": filterText, "value": filterValue });
                    }
                  }
                break;

                default:
                  if (!boolIsSchool && key != 'beds' && key != 'bedsmax' && key != 'yearbuiltmax' && key != 'openhousetodate' && key != 'location') {
                    $scope.tags.push({ "key": key, "text": filterText, "value": filterValue });
                  }
                break;
              }
            }
          }
          
          $scope.TotalSearchFilter = "(" + $scope.tags.length + ")";
        }        
        
        /* Remove the tag to do search */
        $scope.removeTag = function(tag) {

          $(".filter-selected-box").not("#more_filters").tipso("hide");
          $scope.$broadcast("RemoveHighlightedPolygon");

          var tagKey = tag.key;
          var tagText = tag.text;

          switch (tagKey) {
            
            case 'addresses':                   
              for (var i = 0; i < $scope.tags.length; i++) {
                    if ($scope.tags[i].value == tag.value) {
                        $scope.tags.splice(i, 1);
                    }
                }
                if (tag.key.indexOf("addresses") != -1) {
                  applicationFactory.removeAddress(tag.value.trim());
                }                
            break;

            case 'subdivision':
              for (var i = 0; i < $scope.tags.length; i++) {
                    if ($scope.tags[i].value == tag.value) {
                        $scope.tags.splice(i, 1);
                    }
                }
                if (tag.key.indexOf("addresses") != -1) {
                  applicationFactory.removeAddress(tag.value.trim());
                }
                $("#subdiv").find('ul input').val('');
                $("#subdiv").find('ul input').attr("placeholder", "Search Subdivisions");
            break;

            case 'schoolname':
              for (var i = 0; i < $scope.tags.length; i++) {
                    if ($scope.tags[i].value == tag.value) {
                        $scope.tags.splice(i, 1);
                    }
                }
              $scope.searchParameters.schoolname = $scope.searchParameters.schoolname.replace(/%20/g, ' ').replace(/%2C/g, ',');
              var splitSearch = $scope.searchParameters.schoolname.split(',');
              for (var i = 0; i < splitSearch.length; i++) {
                var filterValue = decodeURIComponent(splitSearch[i]).split('::')[1].trim();
                if (filterValue == tag.value)
                  splitSearch.splice(i, 1);
                }
                if (splitSearch.length == 0)
                    $scope.searchParameters[tag.key] = "";
                else
                    $scope.searchParameters.schoolname = splitSearch.join(',');

                $("#school").find('ul input').val('');
                $("#school").find('ul input').attr("placeholder", "Search School districts");
            break;

            case 'contingent':
              for (var i = 0; i < $scope.tags.length; i++) {
                    if ($scope.tags[i].value == tag.value) {
                        $scope.tags.splice(i, 1);
                    }
                }
              var splitSearch = $scope.searchParameters.contingent.split(',');
              for (var i = 0; i < splitSearch.length; i++) {
                var filterValue = decodeURIComponent(splitSearch[i]).split('::')[0].trim();
                if (filterValue == tag.value)
                  splitSearch.splice(i, 1);
              }
              if (splitSearch.length == 0)
                $scope.searchParameters[tag.key] = "";
              else
                $scope.searchParameters.contingent = splitSearch.join(',');
            break;

            case 'bedsmin':          
              $scope.searchParameters.beds = "";
              $scope.searchParameters['bedsmin'] = "";
              $scope.searchParameters['bedsmax'] = "";
              angular.element("input[name=bedmin]").val("");
              angular.element("input[name=bedmax]").val("");
              angular.element("#tlc_bedrooms > span").html('ANY');
            break;

            case 'Sale':
            case 'Rental':
            case 'forsale':
              $scope.searchParameters['forsale'] = "";
              delete $scope.searchParameters['forsale'];
            break;

            case 'polygons':
              for (var i = 0; i < $scope.tags.length; i++) {
                if ($scope.tags[i].data != undefined && $scope.tags[i].data == tag.data) {
                  $scope.tags.splice(i, 1);
                }
              }
              applicationFactory.removePolygon(tag.data);
            break;

            case 'keywords':
              if(utilService.getMLSNumberPattern().test(tag.value)){
                for (var i = 0; i < $scope.tags.length; i++) {
                  if ($scope.tags[i].value == tag.value) {
                    $scope.tags.splice(i, 1);
                  }
                }
              }else{
                var index = $scope.tags.indexOf(tag);
                $scope.tags.splice(index, 1);
              }

              if(tag.value.indexOf("#") > -1){
                var searchValue = $scope.searchParameters[tag.key].split(",");
                var val = tag.value.replace("#","");
                var updateValue = "#";
                if(searchValue.length > 1){
                  for(var i=0; i<searchValue.length; i++){
                    var ind = searchValue[i].indexOf(val);
                    if(ind > -1){
                      //searchValue.splice(i, 1);
                    }else{
                      updateValue = updateValue + searchValue[i].replace("#", "") + ",";
                    }
                  }

                  if(updateValue.lastIndexOf(",") == (updateValue.length - 1)){
                    updateValue = updateValue.substr(0, (updateValue.length - 1));
                  }

                  $scope.searchParameters[tag.key] = updateValue;
                  applicationFactory.setLocationText(angular.copy(updateValue));
                }else{
                  $scope.searchParameters[tag.key] = "";
                  applicationFactory.setLocationText(undefined);
                }
              }else{
                $scope.searchParameters[tag.key] = "";
                applicationFactory.setLocationText(undefined);
              }

            break;

            case 'den':
              $scope.searchParameters['den'] = "";
              $scope.den = 0;
              angular.element("input[name='Den']").prop('checked',false);
              angular.element("input[name='Den']").next().removeClass('checked');
            break;

            case 'Family Room':
              $scope.searchParameters['isfamilyroom'] = "";
              $scope.IsFamilyRoom = 0;
              angular.element("input[name='IsFamilyRoom']").prop('checked',false);
              angular.element("input[name='IsFamilyRoom']").next().removeClass('checked');
            break;

            case 'In Law':
              $scope.searchParameters['isinlaw'] = "";
              $scope.IsInLaw = 0;
              angular.element("input[name='IsInLaw']").prop('checked',false);
              angular.element("input[name='IsInLaw']").next().removeClass('checked');
            break;

            case 'In Library':
              $scope.searchParameters['islibrary'] = "";
              $scope.IsLibrary = 0;
              angular.element("input[name='IsLibrary']").prop('checked',false);
              angular.element("input[name='IsLibrary']").next().removeClass('checked');
            break;

            case 'In Loft':
              $scope.searchParameters['isloft'] = "";
              $scope.IsLoft = 0;
              angular.element("input[name='IsLoft']").prop('checked',false);
              angular.element("input[name='IsLoft']").next().removeClass('checked');
            break;

            case 'Sun Room':
              $scope.searchParameters['issunroom'] = "";
              $scope.IsSunRoom = 0;
              angular.element("input[name='IsSunRoom']").prop('checked',false);
              angular.element("input[name='IsSunRoom']").next().removeClass('checked');
            break;

            case 'Workshop':
              $scope.searchParameters['isworkshop'] = "";
              $scope.IsWorkshop = 0;
              angular.element("input[name='IsWorkshop']").prop('checked',false);
              angular.element("input[name='IsWorkshop']").next().removeClass('checked');
            break;

            case 'Age Restricted : Yes':
            case 'Age Restricted : No':
              $scope.searchParameters['isagerestricted'] = "";
              $scope.IsAgeRestricted = "";
              angular.element("select[name=IsAgeRestricted]").val('');
              angular.element('#IsAgeRestricted option[value=""]').attr('selected','selected');
            break;

            case 'Pets Allowed : Yes':
            case 'Pets Allowed : No':
              $scope.searchParameters['ispetsallowed'] = "";
              $scope.IsPetsAllowed = "";
              angular.element("select[name='pets']").val('');
              angular.element('#pets option[value=""]').attr('selected','selected');
            break;

            case 'onmarket':
              $scope.searchParameters['onmarket'] = "";
              $scope.OnMarket = "";
              angular.element("select[name='market']").val('');
              angular.element('#market option[value=""]').attr('selected','selected');
            break;

            case 'baths':
              $scope.searchParameters.baths = "";
              angular.element("select[name=bathrooms]").val('');
              angular.element("#tlc_bathrooms span").html('ANY');
              angular.element("#tlc_bathrooms div").each(function () {
                if (angular.element(this).hasClass('active')) {
                  angular.element(this).removeClass('active');
                }
              });
            break;

            case 'garages':
              $scope.searchParameters.garages = "";
              $scope.parking = "";
              angular.element("select[name=garages]").val('');
              angular.element('#parking option[value=""]').attr('selected','selected');            
            break;

            case 'acresmin':
              $scope.searchParameters.acresmin = "";
              $scope.searchParameters.acresmax = "";
              angular.element("input[name=acreagemin]").val('');
              angular.element("input[name=acreagemax]").val('');
              angular.element("#tlc_acres span").html('ANY');
            break;

            case 'yearbuiltmin':
              $scope.searchParameters.yearbuiltmin = "";
              $scope.searchParameters.yearbuiltmax = "";
              angular.element("input[name=yearmin]").val('1500');
              angular.element("input[name=yearmax]").val('2016');
              angular.element("#tlc_year span").html('ANY');
            break;

            case 'location':
            case 'Draw':
              applicationFactory.setPolygon(undefined);
              $scope.drawingStatus = "Draw an area";
            break;           

            case 'commutes':
              var index = _.findIndex($scope.searchParameters.commutes, tag.commute);
              if (index > -1) {
                $scope.searchParameters.commutes.splice(index, 1);
              }
            break;

            case 'openhousefromdate':
              $scope.searchParameters["openhousefromdate"] = "";
              $scope.searchParameters["openhousetodate"] = "";
              $scope.openHouseOnly = false;
              angular.element("input[name='openHouseOnly']").prev().removeClass("checked");
              angular.element("input[name='openHouseOnly']").prop('checked',false);
              angular.element("input[name=fromDate]").val('');
              angular.element("input[name=toDate]").val('');
              $( "#fromDate" ).datepicker( "option", "disabled", true );
              $( "#toDate" ).datepicker( "option", "disabled", true );
            break;

            case 'none':
              $scope.searchParameters['propertystylenone'] = "";
              $scope.propertystylenone = false;
              angular.element("input[value='none']").next().removeClass("checked");
              angular.element("input[value='none']").prop('checked',false);
            break;

            case 'localelistingstatus':
              $scope.searchParameters['localelistingstatus'] = "";
               $scope.Active = false;
               $scope.ko = false;
               $scope.no = false;
            break;

            case 'waterfront':
              $scope.searchParameters['waterfront'] = "";
              $scope.WaterFront = false;
              angular.element("input[name='WaterFront']").prop('checked',false);
              angular.element("input[name='WaterFront']").prev().removeClass('checked');
            break;

            case 'waterview':
              $scope.searchParameters['waterview'] = "";
              $scope.WaterView = false;
              angular.element("input[name='WaterView']").prop('checked',false);
              angular.element("input[name='WaterView']").prev().removeClass('checked');
            break;

            case 'wateraccess':
              $scope.searchParameters['wateraccess'] = "";
              $scope.WaterAccess = false;
              angular.element("input[name='WaterAccess']").prop('checked',false);
              angular.element("input[name='WaterAccess']").prev().removeClass('checked');
            break;

            case 'pricechange':              
              $scope.searchParameters['pricechange'] = "";
              $scope.price = false;
              angular.element("input[name='PriceChange']").prop('checked',false);
              angular.element("input[name='PriceChange']").prev().removeClass('checked');
            break;

            case 'foreclosure':
              $scope.searchParameters['foreclosure'] = "";
              $scope.closure = false;
              angular.element("input[name='Foreclosures']").prop('checked',false);
              angular.element("input[name='Foreclosures']").prev().removeClass('checked');
            break;

            case 'basement':
              $scope.searchParameters['basement'] = "";
              $scope.IsBasement = false;
              angular.element("input[name='IsBasement']").prop('checked',false);
              angular.element("input[name='IsBasement']").prev().removeClass('checked');
            break;

            case 'elevator':
              $scope.searchParameters['elevator'] = "";
              $scope.Elevator = false;
              angular.element("input[name='Elevator']").prop('checked',false);
              angular.element("input[name='Elevator']").prev().removeClass('checked');
            break;

            case 'builtinshelf':
              $scope.searchParameters['builtinshelf'] = "";
              $scope.builtinshelves = false;
              angular.element("input[name='builtinshelves']").prop('checked',false);
              angular.element("input[name='builtinshelves']").prev().removeClass('checked');
            break;

            case 'woodfloor':
              $scope.searchParameters['woodfloor'] = "";
              $scope.IsWoodFloor = false;
              angular.element("input[name='IsWoodFloor']").prop('checked',false);
              angular.element("input[name='IsWoodFloor']").prev().removeClass('checked');
            break;

            case 'fireplace':
              $scope.searchParameters['fireplace'] = "";
              $scope.Fireplace = false;
              angular.element("input[name='Fireplace']").prop('checked',false);
              angular.element("input[name='Fireplace']").prev().removeClass('checked');
            break;

            case 'handicapequiped':
              $scope.searchParameters['handicapequiped'] = "";
              $scope.HandicapEquipped = false;
              angular.element("input[name='HandicapEquipped']").prop('checked',false);
              angular.element("input[name='HandicapEquipped']").prev().removeClass('checked');
            break;

            case 'cedarcloset':
              $scope.searchParameters['cedarcloset'] = "";
              $scope.Cedar = false;
              angular.element("input[name='Cedar']").prop('checked',false);
              angular.element("input[name='Cedar']").prev().removeClass('checked');
            break;

            default:
              $scope.searchParameters[tag.key] = "";
            break;
          }

          switch(tagText) {
            
            case 'Community Rule':
              $scope.searchParameters['communityrule'] = "";
              $scope.CommunityRules = "";
              angular.element("select[name=cmRules]").val('');
              angular.element('#cmRules option[value=""]').attr('selected','selected');
              break;

            case 'Style':
              $scope.searchParameters['propertystyle'] = "";
              $scope.selectAllHome();
              angular.element('input:checkbox[name="StyelOfHome[]"]').each(function() {
                angular.element("input[value='" + this.value +"']").next().removeClass("checked");
                angular.element("input[value='" + this.value +"']").prop('checked',false);
              });
            break;

            case 'Listing Type':
              $scope.searchParameters['propertysubtype'] = "";
              $('input:checkbox[name="commercialCriteria[]"]').each(function() {
                this.checked = false;
              });

              $('input:checkbox[name="ResidentialSales[]"]').each(function() {
                this.checked = false;
              });

              $('input:checkbox[name="landCriteria"]').each(function() {
                 this.checked = false;
              });

              $('input:checkbox[name="familyCriteria[]"]').each(function() {
                this.checked = false;
              });
            break;

            case 'Ownership':
                $scope.searchParameters['ownershiptype'] = "";
                $scope.selectAllOwner();
                angular.element('input:checkbox[name="OwnershipType[]"]').each(function() {
                angular.element("input[value='" + this.value +"']").next().removeClass("checked");
                angular.element("input[value='" + this.value +"']").prop('checked',false);
              });
            break;
            case 'Loan Type':
              $scope.searchParameters['loantype'] = ""; // json parameter
              $scope.searchParameters.loantype = ""; // model
            break;
            case 'Body of Water':
              $scope.BodyOfWater = "";
              $scope.searchParameters.bodyofwater = "";
            break;
            case 'Air Conditioning':
              $scope.searchParameters['coolingtype'] = "";
              $scope.selectAllCool();
              angular.element('input:checkbox[name="Cooling[]"]').each(function() {
                angular.element("input[value='" + this.value +"']").next().removeClass("checked");
                angular.element("input[value='" + this.value +"']").prop('checked',false);
              });
            break;
            case 'Air Fuel':
              $scope.searchParameters['coolingfuel'] = "";
              $scope.selectAllCool();
              angular.element('input:checkbox[name="CoolingFuel[]"]').each(function() {
                angular.element("input[value='" + this.value +"']").next().removeClass("checked");
                angular.element("input[value='" + this.value +"']").prop('checked',false);
              });
            break;
            case 'Pool Future':
              $scope.searchParameters['poolfuture'] = "";
              $scope.selectAllPool();
              angular.element('input:checkbox[name="PoolFeature[]"]').each(function() {
                angular.element("input[value='" + this.value +"']").next().removeClass("checked");
                angular.element("input[value='" + this.value +"']").prop('checked',false);
              });
            break;
            case 'Levels':
              $scope.searchParameters['storylevel'] = "";
              $scope.selectAllStory();
              angular.element('input:checkbox[name="StoryLevel[]"]').each(function() {
                angular.element("input[value='" + this.value +"']").next().removeClass("checked");
                angular.element("input[value='" + this.value +"']").prop('checked',false);
              });
            break;
            case 'Type':
              $scope.searchParameters['propertytype'] = "";
              angular.element("select[name=proptype]").val('Residential');
            break;
            case 'Tlc':
              $scope.searchParameters.tlcmin = "";
              $scope.searchParameters.tlcmax = "";
              angular.element("input[name=tlcmin]").val('');
              angular.element("input[name=tlcmax]").val('');
              angular.element("#tlc div.ui-slider-wrapper div.ui-slider div").css({ "left": "0%", "width": "100%" });
              angular.element("#tlc div.ui-slider-wrapper div.ui-slider span").eq(0).css('left', '0%');
              angular.element("#tlc div.ui-slider-wrapper div.ui-slider span").eq(1).css('left', '100%');
            break;
            case 'List Price':
              $scope.searchParameters['listingpricemin'] = "";
              $scope.searchParameters['listingpricemax'] = "";
              angular.element("input[name=pricemin]").val('');
              angular.element("input[name=pricemax]").val('');
              angular.element("#tlc_price span").html('ANY');
              angular.element("#price div.ui-slider-wrapper div.ui-slider div").css({ "left": "0%", "width": "100%" });
              angular.element("#price div.ui-slider-wrapper div.ui-slider span").eq(0).css('left', '0%');
              angular.element("#price div.ui-slider-wrapper div.ui-slider span").eq(1).css('left', '100%');
            break;
            case 'beds':
              $scope.searchParameters.beds = "";
              angular.element("#tlc_bedrooms span").html('ANY');
              angular.element("#tlc_bedrooms div").each(function () {
                if (angular.element(this).hasClass('active')) {
                  angular.element(this).removeClass('active');
                }
              });
            break;
            case 'Sqft':
              $scope.searchParameters.livingareamin = "";
              $scope.searchParameters.livingareamax = "";
              angular.element("input[name=sqftmin]").val('');
              angular.element("input[name=sqftmax]").val('');
              angular.element("#tlc_sqft span").html('ANY');
            break;
            case 'Life Style':
              $scope.searchParameters['lifestyle'] = "";
              $scope.searchParameters.lifestyle = "";
            break;
            default:           
              $scope.searchParameters[tag.key] = "";
            break;
          }

          applicationFactory.setSearchParameters($scope.searchParameters, false);
          $timeout(function () {
            $scope.updateUrlAndLoadData();
          }, 1000);
          $('.prop-list-scroll').scrollTop(0);
          $scope.$broadcast("updatepscrollbar");

        }

        $scope.resetAllTag = function () {
            //httpServices.trackGoogleEvent('ResetAllTag','search-elements');

            var tagList = $scope.tags;
            var lengthtag = tagList.length;
            for (var i = lengthtag - 1; i >= 0; i--) {
                $scope.removeTag(tagList[i]);
            }
        }
        $scope.addBookmarkHandler = function (property) {
            var index = $scope.bookmarkList.indexOf(property);
            if (index == -1) {
                $scope.bookmarkList.push(property);
            } else {
                $scope.bookmarkList.splice(index, 1);
            }
        }

        $rootScope.$on('$stateChangeSuccess',
          function (event, toState, toParams, fromState, fromParams) {
              if (toState.name.indexOf('.home') == -1 && $scope.clients == undefined) {
                  $scope.getClients();
              }
              if((toState.name == "tlc.search" || toState.name == "tlcClient.search") && (toParams.searchParams == undefined || toParams.searchParams == "")){
                applicationFactory.resetSearchParameters();
                $scope.searchParameters = applicationFactory.getSearchParameters();
              }

          });

        $scope.$on('getClients', function (e, args) {
            $scope.getClients();
        });

        /* to show listing as responsive while click browser back button */
        $rootScope.browserBack = function () {

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
                    width: "35%"
                  }, 300), $("#map").animate({
                    width: "65%"
                  }, 300), setTimeout(function () {
                    $("#results > li").css("opacity", 1), setTimeout(function () {
                      a.remove();
                      $("#proplistpage").parents(".scroll-wrapper").css('top', '170px');

                    }, 300);
                  }, 600);
                }else {
                  $("#content").animate({
                    width: 400
                  }, 300), $("#map").animate({
                    width: $(window).width() - 400
                  }, 300), setTimeout(function () {
                    /*$("#content > article").scrollbar(),*/
                    $("#results > li").css("opacity", 1), setTimeout(function () {
                      a.remove();
                      $("#proplistpage").parents(".scroll-wrapper").css('top', '170px');

                    }, 300);
                  }, 600);
                }
              }, 300)), !1;


            if($scope.page && $scope.page.results.length == 0)
              $scope.doSearch();

            $("#search").removeClass("hide");
            $("#search").addClass("show");
            $("#back").removeClass("visible");
            $(".bookmark-title").addClass('newBookmarkdiv');
            $("#prpertyFoundList").show();
            $("#bookmarkprpertyFoundList").show();
            $("ul#results").show();
            $("#results").removeAttr("class");
            $(".initialInfoBox").addClass('hide');
            $(".initialInfoBox").removeClass('show');
            $(".propertyfixdiv").removeClass('show');
            $(".propertyfixdiv").addClass('hide');
            $("h1#logo, h2#slogan, form#search").addClass('show');
            $("h1#logo, h2#slogan, form#search").removeClass('hide');
        }

      $timeout(function() {
        $scope.initUiComponents();
      });

        /* Load filter data and set to the controls*/
        $scope.loadURLData = function () {
            /*load search result screen*/
            setTimeout(function () {
                $scope.retrieveSearchParameters();

                var filters = applicationFactory.filterAllParameters();
                if (filters.keyword) {
                    filters.location = encodeURIComponent(filters.keyword);
                    filters.keyword = undefined;
                }
                var polygon = undefined;
                if (filters.location) {
                    //                    filters.location = encodeURIComponent(filters.location);
                    if (utilService.getPolygonPattern().test(filters.location)) {
                        polygon = filters.location;
                        filters.location = undefined;
                    }
                    //                    $scope.searchParameters.location = "";
                }
                if (filters.commutemode && filters.commutemode == "transitwalk") {
                    filters.commutemode = "transit,walk";
                }
                $scope.searchParameters.location = filters.location;
                $scope.searchParameters.keyword = filters.keyword;
                if (polygon)
                    filters.location = polygon;
                $scope.updateTags(filters);
            }, 1000);
        }

        /* filter the json which is not having the values */
        $scope.getFilteredParams = function () {
            var filters = applicationFactory.filterAllParameters();
            if (filters.keyword) {
                filters.location = encodeURIComponent(filters.keyword);
                filters.keyword = undefined;
            }
            var polygon = undefined;
            if (filters.location) {

                if (utilService.getPolygonPattern().test(filters.location)) {
                    polygon = filters.location;
                    filters.location = undefined;
                }

            }
            $scope.searchParameters.location = filters.location;
            $scope.searchParameters.keyword = filters.keyword;
            if (polygon)
                filters.location = polygon;
            return filters;
        }

        /* load the seach by drean area */
        $scope.loadSelectedSearch = function (searchParams) {
            //httpServices.trackGoogleEvent('LoadSavedSearch','search-elements');

            var SearchParameters = angular.copy(searchParams);

            var sortParams = {};
            sortParams['orderby'] = SearchParameters['orderby'];
            sortParams['orderbydirection'] = SearchParameters['orderbydirection'];

            $scope.searchParameters = applicationFactory.setSeavedSearch(SearchParameters);

            if($scope.searchParameters.polygons != undefined){
              for(var i=0; i<$scope.searchParameters.polygons.length;i++){
                applicationFactory.addPolygon($scope.searchParameters.polygons[i]);
              }
            }

          $scope.updateUrlAndLoadData();

        };

        /* load the all drawn search */
        $scope.loadSavedSearch = function () {
            if ($state.current.name && $state.current.name != 'tlc.legal') {
                httpServices.getSavedSearch().then(
                      function (success) {
                          $scope.savedSearches = success.savedSearches;  
                        if(document.getElementById("captureUserName").innerHTML == "Login or Register") {
                          $("#savedSearchButtonId").html("Saved search");
                          if (!$(".saved-data").hasClass("login-opt-saved-srch")) {
                          $(".saved-data").addClass("login-opt-saved-srch");
                          }
                        }
                        else{
                          $("#savedSearchButtonId").html("My saved search");
                          if ($(".saved-data").hasClass("login-opt-saved-srch")) {
                          $(".saved-data").removeClass("login-opt-saved-srch");
                        }
                      }
                      }, function (error) {
                          console.log("error " + error);
                      });
            }
        };

        $scope.savedSearchOptions = function() {
         if (document.getElementById("captureUserName").innerHTML == "Login or Register") {
          janrain.capture.ui.start();
        }
        else{
          return trackGoogleAnalytics('Clicked My Saved Searches button', 'Search Results', null, 'My Saved Searches');
        }      
       }

        /* delete the saved search */
        $scope.deleteSavedSearch = function (searchObj) {
            //httpServices.trackGoogleEvent('DeleteSavedSearch','search-elements');

              if (confirm("Are you sure want to delete the saved search?") ) {
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

                            aaNotify.danger(errorMessages.join(""),
                            {
                              showClose: true,                            //close button
                              iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                              allowHtml: true,                            //allows HTML in the message to render as HTML

                              //common to the framework as a whole
                              ttl: 1000 * 10  //time to live in ms
                          });
                      });
             } else {
             return false;
           }
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

                        //common to the framework as a whole
                        ttl: 1000 * 10  //time to live in ms
                    });


              });
        }

        $scope.init = function () {
          //console.log("MASTER INIT REMOVEBG");
          //$("#search").removeClass("removeBG");
          $scope.AudienceType = appAuth.isLoggedIn().AudienceType;
            $("#mobile_menu_tag").click(function () {
                console.log('here');
                $("#IsSearchCriteriaDisplayClientSearchEnabled").toggleClass("mobile_menu");
                $("#search").removeClass('expanded')
                $("#active_qualifiers .qualitoggle").html("<span>+</span> more");
            })
            $("#propertystyle,#contingency").focusin(function () {
                $("body").addClass('SchoolPopupOpen');
            });
            $("#propertystyle,#contingency").focusout(function () {
                $("body").removeClass('SchoolPopupOpen');
            });

            $scope.loadSavedSearch();

            $scope.getAllAPRRates();
            $scope.getAllNeighborhood();
            $scope.agent = getAgentDetail;
            $scope.ClientSearchEnabled = true;

            if ($scope.agent) {
                if ($scope.AudienceType == 'CLIENT' && $scope.agent.ClientSearchEnabled == false) {
                }
               $scope.AgentImage = "images/client-dashboard.png";
            }    

            if ($scope.AudienceType == 'CLIENT') {
                $scope.client = getClientDetail;
                $scope.clientImage = "images/client-dashboard.png";
             
            }
            else {
                $scope.getClients();
            }

            var selectedClient = applicationFactory.getSelectedClient();
            if(selectedClient) {
              $scope.selectedClient = selectedClient;
            }

            $scope.getSchoolsdistrict();

            if ($state.current.name && $state.current.name == 'tlc.home') {
              applicationFactory.resetSearchParameters();
              $scope.searchParameters = applicationFactory.getSearchParameters();
            }

            $("#propertystyle").focusout(function () {
                $(this).find('ul input').val('');
            })

            $("[type=checkbox]").change(function () {
                if ($(this).next('i').hasClass('checked'))
                    $(this).next('i').removeClass('checked');
                else
                    $(this).next('i').addClass('checked');
            });
            $(document).ready(function(){
              $("#search, #logo, #slogan").removeClass("more");
              $scope.moreHeight();
            });

        }

        $scope.$watch(function(){return [$scope.searchParameters.commutes]},function(){
          if($scope.searchParameters.commutes && $scope.searchParameters.commutes.length > 0) {
              $("#tlc_commute-time span").next('dt').hide();
              if($("#tlc_commute-time span").hasClass("commuteTimeDetail")){
                  $('.commuteTimeDetail').remove();
                  $('.parentClass').remove();
              }
              else
                $("#tlc_commute-time span:first").remove();
              $("#tlc_commute-time").prepend('<span class="parentClass"></span>');
              for(var i=0; i<$scope.searchParameters.commutes.length; i++){
                var commute = $scope.searchParameters.commutes[i];
                if (commute.commutemode == 'car' || commute.commutemode == 'transit' || commute.commutemode == 'transit,walk' || commute.commutemode == 'bike') {
                  var minute_val = commute.commutetimemins;
                  if (!minute_val) minute_val = 0;
                  //$("#tlc_commute-time span:first").css({'height':'62px','float':'left'});

                  if (commute.commutemode == 'car') {
                    $("#tlc_commute-time .parentClass").append('<span class="commuteTimeDetail"><i class="fa fa-car commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + minute_val + ' min</span></span>');
                  }
                  else if (commute.commutemode == 'transit') {
                    $("#tlc_commute-time .parentClass").append('<span class="commuteTimeDetail"><i class="fa fa-subway commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + minute_val + ' min</span></span>');
                  }
                  else if (commute.commutemode == 'transit,walk') {
                    $("#tlc_commute-time .parentClass").append('<span class="commuteTimeDetail"><img src="/images/walking.png" class="commuteSearchImage"><br><span class="commuteSearchSpan">' + minute_val + ' min</span></span>');
                  }
                  else if (commute.commutemode == 'bike') {
                    $("#tlc_commute-time .parentClass").append('<span class="commuteTimeDetail"><i class="fa fa-motorcycle commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + minute_val + ' min</span></span>');
                  }
                }
            }
          }
          else {
            $("#tlc_commute-time span:first").css('height', '32px');
            $("#tlc_commute-time span:first").html('ANY');           
            $( "#tlc_commute-time span" ).after( "<dt>Commute time</dt>" );
            $("#tlc_commute-time span").next('dt').show();
            $('#tlc_commute-time span').removeClass('parentClass');
          }

        },true);

      $scope.blurCallback = function(evt) {

        if(evt.target.value=="undefined")
        {
          $("#commute-time-min").val("");
        }
        else
        {
          var new_value=evt.target.value +  " min";
          $("#commute-time-min").val(minvalue);
        }

      };


      $scope.go_home = function () {
            //httpServices.trackGoogleEvent('SearchHome','search-elements');

            $state.go('tlc.home');
        }

        $scope.editProfile = function (pid) {
            //httpServices.trackGoogleEvent('Edit-Profile','search-elements');

            $state.go('agentEditProfile');
        }

        $scope.testDialog = function () {
            ngDialog.open({
                template: '<p>my template</p>',
                plain: true
            });
        }

        $scope.getSearchTimeText = function (search) {
            if (search.CreatedForClient != undefined) {
                if (search.ClientId != undefined && search.ClientId != null && search.CreatedForClient == true) {
                    return "Created for " + search.ClientName + " " + search.LastUpdatedHumanTime;
                }
            } else if (search.CreatedByAgent != undefined && search.CreatedByAgent == true) {
                return "Created by agent " + search.LastUpdatedHumanTime;
            } else {
                return search.LastUpdatedHumanTime;
            }
            return search.LastUpdatedHumanTime;
        }

        $scope.displayDeleteSavedSearch = function (search) {
            if (search.CreatedForClient != undefined) {
                if (search.ClientId != undefined && search.ClientId != null && search.CreatedForClient == true) {
                    return false;
                }
            } else if (search.CreatedByAgent != undefined && search.CreatedByAgent == true) {
                return true;
            } else {
                return true;
            }
            return true;
        }
                
        $scope.loadSchooldistricts = function ($query) {
           return httpServices.getSchoolData($query).then(
              function (success) {
               return success.SD;
              }, function (error) {
                return null;
              });
        };

        $scope.loadSubDivision = function ($query) {

          return httpServices.getSubDivisionData($query).then(
              function (success) {
               return success.SD;                
              }, function (error) {
                return null;
              });
        };

        $scope.checkMaxTags = function (event) {
            if ($scope.schooldistricts.length > 5) {
                // remove tag, one too many
              $scope.schooldistricts.splice($scope.schooldistricts.indexOf($scope.schooldistricts[$scope.schooldistricts.length - 1]), 1);
              if(!$(".aa-notification").is(':visible')){
                aaNotify.danger('Maximum 5 school district allowed for properties search.',{
                  showClose: true,                            //close button
                  iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                  allowHtml: true,                            //allows HTML in the message to render as HTML
                  ttl: 1000 * 3                               //time to live in ms
                });          
              } else{
                return false;
              }
            }
        };

        $scope.checkSubDivisionMaxTags = function (event) {
            if ($scope.subdivisions.length > 5 ) {
                // remove tag, one too many
                $scope.subdivisions.splice($scope.subdivisions.indexOf($scope.subdivisions[$scope.subdivisions.length - 1]), 1);
                if(!$(".aa-notification").is(':visible')){
                  aaNotify.danger('Maximum 5 subdivision allowed for properties search.',{
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                               //time to live in ms
                  });          
                } else{
                  return false;
                }
            }
        };

        $scope.removeSchoolDist = function (val) {
            if(val && !angular.isNumber(val)) {
              return val.toString().toLowerCase().replace("school district", "");
            }
        }

        /* function for reset the search page */

        $scope.clearHome = function () {
            $("input[name=bedmin]").val("");
            $("input[name=bedmax]").val("");
          if(($(window).width() > 767)){
            $("#tlc_bedrooms > span").html('ANY');
          }
          else{
            $("select[name=bathrooms]").val("");
          }
            $("#tlc_bathrooms span").html('ANY');
            $("select[name=bathrooms]").val("");
            $("select[name=garages]").val("");
            $("select[name=proptype]").val("Residential");
            $scope.searchFilter.propertytype = 'Residential';
            angular.element('#stylehome').css("display","block");
            $("input[name=sqftmin]").val("");
            $("input[name=sqftmax]").val("");
            $("input[name=acreagemin]").val("");
            $("input[name=acreagemax]").val("");
            $("input[name=yearmin]").val("");
            $("input[name=yearmax]").val("");
            $("input[name=pricemin]").val("");
            $("input[name=pricemax]").val("");
            $("input[name=tlcmin]").val("");
            $("input[name=tlcmax]").val("");
            $("input[name=commutemin]").val("");
            $("#terms").val("");            

            $('input:checkbox[name="ResidentialSales[]"]').each(function() {
              this.checked = false;
            });

            $('input:checkbox[name="commercialCriteria[]"]').each(function() {
              this.checked = false;
            });

            $('input:checkbox[name="landCriteria[]"]').each(function() {
              this.checked = false;
            });

            $('input:checkbox[name="familyCriteria[]"]').each(function() {
              this.checked = false;
            });

            $scope.WaterFront = false;
            $scope.WaterView = false;
            $scope.WaterAccess = false;
            $scope.IsPetsAllowed = "";
            $scope.fromLotSize = "";
            $scope.toLotSize = "";
            $scope.BodyOfWater = "";

            $scope.OnMarket = '';
            $scope.parking = '';
            $scope.CommunityRules = '';
            $scope.IsAgeRestricted = '';
            $scope.resType = "Sales";

            $scope.price = false;
            $scope.closure = false;

            $('#selectowner').prop('checked',false);
            $scope.selectAllOwner();
            $('#selectcool').prop('checked',false);
            $scope.selectAllCool();
            $('#selectpool').prop('checked',false);
            $scope.selectAllPool();
            $('#selecthome').prop('checked',false);
            $scope.selectAllHome();
            $('#selectstory').prop('checked',false);
            $scope.selectAllStory();
            $('#selectroom').prop('checked',false);
            $scope.selectAllRoom();


            $scope.IsBasement = false;
            $scope.Elevator = false;
            $scope.builtinshelves = false;
            $scope.IsWoodFloor = false;
            $scope.Fireplace = false;
            $scope.HandicapEquipped = false;
            $scope.Cedar = false;

            applicationFactory.resetSearchParameters();
            $scope.searchParameters = applicationFactory.getSearchParameters();

            $scope.schooldistricts = [];
            $scope.subdivisions = [];
            $scope.propertystyles = [];
            $scope.commute = {commutemode:'car',commutetimemins:0};
            $scope.propertyStatus = [];
            $scope.contingencies = [];

            $scope.bedsReset = true;
            $scope.bathsReset = true;
            $scope.garagesReset = true;
            $scope.propertyTypeReset = true;
            $scope.commuteReset = true;
            $scope.sqftReset = true;
            $scope.bedroomsReset = true;
            $scope.acresReset = true;
            $scope.yearBuildReset = true;
            $scope.tlcReset = true;
            $scope.priceReset = true;
            $scope.numberofunitsReset = true;
            $scope.openHouseOnly = false;

            $scope.removeClient();

            /* Remove all search tags */
            $scope.tags = [];

            $scope.locationText = "";
            $rootScope.$broadcast("resetPage");
          $('.prop-list-scroll').scrollTop(0);
          $scope.$broadcast("updatepscrollbar");

            $("#subdiv").find('ul input').val('');
            $("#school").find('ul input').val('');
            $("#school").find('ul input').attr("placeholder", "Search School districts");
            $("#subdiv").find('ul input').attr("placeholder", "Search Subdivisions");
            
            /* To Remove custom width and height */
            $("#subdiv").removeClass('school_class');
            $("#school").removeClass('school_class');
            $('#menu4').removeClass('menu4_class');
            /*End*/
            

        }

        $scope.getAllAPRRates = function () {
            propertiesService.getAllAPRRates({}
              , function (success) {
                  $scope.AllAPRRates = _.each(success.aprdata, function (o) { o.APR = $filter('number')(o.APR, 2); });
                  $scope.ChangeLoanType();
              }, function (error) {
                  console.log("error " + error);
              });
        }
        $scope.getAllNeighborhood = function () {
          propertiesService.getAllNeighborhood({}
            , function (success) {
              for(var i=0;i<success.Neighborhood.length;i++){
                $scope.availableNeighborhood.push(buildGooglePlacesResult({
                  address: {
                    street: success.Neighborhood[i].Name,
                    suburb: success.Neighborhood[i].City,
                    state: success.Neighborhood[i].State
                  },
                  location: { latitude: success.Neighborhood[i].Latitude, longitude: success.Neighborhood[i].Longitude },
                  custom_prediction_label: '(Neighborhood)',
                  display_custom_prediction_label_on_select: true
                }));
              }
            }, function (error) {
              console.log("error " + error);
            });
        }
        function buildGooglePlacesResult(config) {
        // Build a synthetic google.maps.places.PlaceResult object
        return {
          formatted_address: config.address.street + ', ' + config.address.suburb + ', ' + config.address.state,
          address_components: [
            {
              long_name: config.address.street,
              short_name : config.address.street,
              types: [ 'route' ]
            },
            {
              long_name: config.address.suburb,
              short_name: config.address.suburb,
              types: [ 'locality' ]
            },
            {
              long_name: config.address.state,
              short_name: config.address.state,
              types: [ 'administrative_area_level_1' ]
            }
          ],
          geometry: {
            location: {
              lat: function () { return config.location.latitude },
              lng: function () { return config.location.longitude }
            }
          },
          custom_prediction_label: config.custom_prediction_label || '',
          display_custom_prediction_label_on_select: config.display_custom_prediction_label_on_select || false
        };
      }
        $scope.ChangeLoanType = function (trackEvent) {
            $scope.FicoScoreAPRRates = _.filter($scope.AllAPRRates, function (o) { return o.StateName == globalSettings.defaultState && o.LoanType == $scope.searchParameters.loantype });

            if (trackEvent) {
                $scope.searchDropDownChange('Loan type', $scope.searchParameters.loantype)
            }
        }

        $scope.getSchoolsdistrict = function () {

          if($scope.EnableSchoolDistrictSearch == false)
            return false;

          propertiesService.getSchoolsdistrict({},
              function (success) {
                  $scope.schoolsdistrict = success.schooldistrictsData;
              }, function (error) {

              });
        }

        $scope.searchDropDownChange = function (qualifier, value) {

            if(value == 'Multi-Family') {
              angular.element('#family').css("display","block");
              angular.element('#residential').css("display","none");
              angular.element('#commercial').css("display","none");
              angular.element('#land').css("display","none");
              angular.element('#stylehome').css("display","none");
              angular.element('#resType').css("display","none");

              $('input:checkbox[name="commercialCriteria[]"]').each(function() {
                this.checked = false;
              });

              $('input:checkbox[name="ResidentialSales[]"]').each(function() {
                this.checked = false;
              });

               $('input:checkbox[name="landCriteria"]').each(function() {
                 this.checked = false;
              });

            } else if(value == 'Residential') {
              angular.element('#family').css("display","none");
              angular.element('#residential').css("display","block");
              angular.element('#commercial').css("display","none");
              angular.element('#land').css("display","none");
              angular.element('#stylehome').css("display","block");
              angular.element('#resType').css("display","block");

              $('input:checkbox[name="familyCriteria[]"]').each(function() {
                this.checked = false;
               });

              $('input:checkbox[name="commercialCriteria[]"]').each(function() {
                this.checked = false;
              });

               $('input:checkbox[name="landCriteria"]').each(function() {
                 this.checked = false;
              });

            } else if(value == 'Commercial') {
              angular.element('#family').css("display","none");
              angular.element('#residential').css("display","none");
              angular.element('#commercial').css("display","block");
              angular.element('#land').css("display","none");
              angular.element('#stylehome').css("display","none");
              angular.element('#resType').css("display","none");

               $('input:checkbox[name="familyCriteria[]"]').each(function() {
                this.checked = false;
               });

                $('input:checkbox[name="ResidentialSales[]"]').each(function() {
                this.checked = false;
              });

               $('input:checkbox[name="landCriteria"]').each(function() {
                 this.checked = false;
              });

            } else if(value == 'Lot-Land') {
              angular.element('#family').css("display","none");
              angular.element('#residential').css("display","none");
              angular.element('#commercial').css("display","none");
              angular.element('#land').css("display","block");
              angular.element('#stylehome').css("display","none");
              angular.element('#resType').css("display","none");

               $('input:checkbox[name="familyCriteria[]"]').each(function() {
                this.checked = false;
               });

                $('input:checkbox[name="ResidentialSales[]"]').each(function() {
                this.checked = false;
              });

                 $('input:checkbox[name="commercialCriteria[]"]').each(function() {
                this.checked = false;
              });
            }

            if(qualifier == 'Property type')
            {
              $scope.PropertyType = value;
              $scope.propertystyles = [];
            }

            //httpServices.trackGoogleEvent(qualifier + 'Change','search-elements',value);
        }

        $scope.addClassForApplyClient=function(){
            $('.apply_client').addClass('openClientList');
        }

        $scope.hideClientList=function(){
            $('.apply_client').removeClass('openClientList')
        }

        /*Handle search qualifier mouse enter event*/
        $scope.searchQualifierMouseEnter = function(tag){
          if(tag.key == "polygons"){
            $scope.$broadcast("highlightPolygon", tag.data);
          }
        }

        /*Handle search qualifier mouse leave event*/
        $scope.searchQualifierMouseLeave = function(tag){
          if(tag.key == "polygons"){
            $scope.$broadcast("RemoveHighlightedPolygon");
          }
        }

        $scope.$on('onDeleteClient', function (e, clientId) {
          if($scope.selectedClient && $scope.selectedClient.Id == clientId){
            $scope.removeClient();
          }
        });

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
              console.log('Modal promise resolved. Value: ', value);
            }, function(reason){
              console.log('Modal promise rejected. Reason: ', reason);
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

      $scope.getclustersByType = function (type) {
        var inputData = {
          "lifestyle":"couple-no-kids",
          "ficoscore":"760-850",
          "loantype":"30YrFixed",
        };

        httpServices.getclustersByType(type,inputData).then(
          function (success) {

          }, function (error) {

          });
      };

      /* open clustering menu */
      $("#clustering").click(function(){
        $(this).toggleClass("active");
        return false;
      });

        $('#price-min1').on('focusin', function() {
            var value  = $(this).val();
            if(value  == '') {
                $(this).val('');
            } else if(value > parseInt($('#price-max2').val().replace(/,/g,""))) {
                value = value.substring(0, value.length - 1);
                $(this).val(value);
            } else if(isNaN($(this).val())) {
                $(this).val(parseInt($(this).val().replace(/,/g,"")));
          }

        });


        $('#tlc-min').on('focusin', function() {
          var value = $(this).val();
          if(value==''){
             $(this).val('');
          }
          else if(value > parseInt($('#tlc-min').val().replace(/,/g,""))){
            value =value.substring(0,value.length-1);
            $(this).val(value);
          }
          else{
            $(this).val(parseInt($(this).val().replaced(/,/g,"")));
          }
        });

        $('#price-max2').on('focusin', function() {
            var value  = $(this).val();
             if(value  == '') {
                 $(this).val('');
               }
             else if(isNaN($(this).val())){
                 $(this).val(parseInt($(this).val().replace(/,/g,"")));
             }

        });


        $('#tlc-max').on('focusin', function() {
          var value = $(this).val();
          if(value==''){
             $(this).val('');
          }
          else if(value > parseInt($('#tlc-max').val().replace(/,/g,""))){
            value =value.substring(0,value.length-1);
            $(this).val(value);
          }
          else{
            $(this).val(parseInt($(this).val().replaced(/,/g,"")));
          }
        });



      $('#price-min1').on('input', function() {        
            var value  = $(this).val();
            if (value.length >= 8) {
                value = value.substr(0,8);
                $(this).val(value);
            }
             if(value==undefined || value  == '') {
                 $(this).val('');
               }
             else if(isNaN($(this).val()) || $(this).val().indexOf('.') != -1){
                 $(this).val($(this).val().replace(/\D+/,''));
             }

          var minPriceVal=$('#price-min1').val().replace(/,/g,"");
          var maxPriceVal=$('#price-max2').val().replace(/,/g,"");

          if( (minPriceVal=='' || minPriceVal=='0')  && (maxPriceVal=='' || maxPriceVal=='0')){
              $("#tlc_price span").first().html("ANY");
          }
          else{
            $("#tlc_price span").first().html(utilService.getSortPrice(minPriceVal) + "-" + utilService.getSortPrice(maxPriceVal));
          }

        });

        $('#price-min1').on('focusout', function() {
          var value  = $(this).val();
          if(value != undefined) {
            var numberFormat = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            $(this).val(numberFormat);
          }
        });

        $('#price-max2').on('focusout', function() {
          var value  = $(this).val();
          if(value != undefined) {
            var numberFormat = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            $(this).val(numberFormat);
          }
        });

       $('#price-max2').on('input', function() {
            var value  = $(this).val();
            if (value.length >= 8) {
                value = value.substr(0,8);
                $(this).val(value);
            }
             if(value==undefined || value  == '') {
                 $(this).val('');
               }
             else if(isNaN($(this).val()) || $(this).val().indexOf('.') != -1){
                 $(this).val($(this).val().replace(/\D+/,''));
             }

          var minPriceVal=$('#price-min1').val().replace(/,/g,"");
          var maxPriceVal=$('#price-max2').val().replace(/,/g,"");

          if( (minPriceVal=='' || minPriceVal=='0')  && (maxPriceVal=='' || maxPriceVal=='0')){
              $("#tlc_price span").first().html("ANY");
          }
          else{
            $("#tlc_price span").first().html(utilService.getSortPrice(minPriceVal) + "-" + utilService.getSortPrice(maxPriceVal));
          }

        });



      $scope.$watch('openHouseOnly', function(value) {
          if(value == true) {
            $( "#fromDate" ).datepicker( "option", "disabled", false );
            $( "#toDate" ).datepicker( "option", "disabled", false );
            $("#fromDate").datepicker();
            $("#toDate").datepicker();
          } else {
            $("#ui-datepicker-div").hide();
            $( "#fromDate" ).datepicker( "option", "disabled", true );
            $( "#toDate" ).datepicker( "option", "disabled", true );
            $('#fromDate').datepicker('setDate', null);
            $('#toDate').datepicker('setDate', null);
          }
      });

      $('input[name="OwnershipType[]"]').click(function(){
        $('input[name="OwnershipType[]"]').each(function() {
          if (!this.checked) {
            $('#selectowner').prop('checked',false);
          }
        });
      });

      $('input[name="Cooling[]"]').click(function(){
        $('input[name="Cooling[]"]').each(function() {
          if (!this.checked) {
            $('#selectcool').prop('checked',false);
          }
        });
      });

      $('input[name="PoolFeature[]"]').click(function(){
        $('input[name="PoolFeature[]"]').each(function() {
          if (!this.checked) {
            $('#selectpool').prop('checked',false);
          }
        });
      });

      $('input[name="StyleOfHome[]"]').click(function(){
        $('input[name="StyleOfHome[]"]').each(function() {
          if (!this.checked) {
            $('#selecthome').prop('checked',false);
          }
        });
      });

      $('input[name="StoryLevel[]"]').click(function(){
        $('input[name="StoryLevel[]"]').each(function() {
          if (!this.checked) {
            $('#selectstory').prop('checked',false);
          }
        });
      });

      $scope.$watch('den', function(value) {
        if(value == undefined) {
          $('#selectroom').prop('checked',false);
        }
      });

      $scope.$watch('IsFamilyRoom', function(value) {
        if(value == undefined) {
          $('#selectroom').prop('checked',false);
        }
      });

      $scope.$watch('IsInLaw', function(value) {
        if(value == undefined) {
          $('#selectroom').prop('checked',false);
        }
      });

      $scope.$watch('IsLibrary', function(value) {
        if(value == undefined) {
          $('#selectroom').prop('checked',false);
        }
      });

      $scope.$watch('IsLoft', function(value) {
        if(value == undefined) {
          $('#selectroom').prop('checked',false);
        }
      });

      $scope.$watch('IsSunRoom', function(value) {
        if(value == undefined) {
          $('#selectroom').prop('checked',false);
        }
      });

      $scope.$watch('IsWorkshop', function(value) {
        if(value == undefined) {
          $('#selectroom').prop('checked',false);
        }
      });
      $timeout(function() {
        $scope.init();
      });
      $(document).ready(function() {
          $("#salesLink,#mrislogo").click(function(){
              restype_tlc = "Sales";
              $scope.changeResidentType();
          });

          $("#rentalsLink").click(function(){
             restype_tlc = "Rentals";
             $scope.changeResidentType();
          });

          $("#terms").keypress(function(e){
            if(e.which == 13){
                 $scope.changeResidentType();
            }
          });

          $('body').on('mouseleave', '.ui-tooltip', function(e)
          {
            $('.question-tooltip.title-tipso').tooltip('close');
          });

          $("#fromDate").datepicker({
              onSelect: function(selected) {
                $("#toDate").datepicker("option","minDate", selected)
              }
          });

          $("#toDate").datepicker({ 
            onSelect: function(selected) {
              $("#fromDate").datepicker("option","maxDate", selected)
            }
          }); 
          
      });

    }]);
