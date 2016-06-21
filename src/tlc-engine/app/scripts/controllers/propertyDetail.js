'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:PropertydetailCtrl
 * @description
 * # PropertydetailCtrl
 * Controller of the tlcengineApp
 */
angular.module('tlcengineApp')
  .controller('PropertyDetailCtrl', ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope', 'aaNotify', 'printer', 'appAuth', 'httpServices', 'utilService','applicationFactory', 'ngDialog', '$window','$anchorScroll',
    function ($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, aaNotify, printer, appAuth, httpServices, utilService, applicationFactory, ngDialog, $window,$anchorScroll) {
        $scope.map = {};
        var map = null;
        
        $scope.init = function() {
          $('body').addClass("detailpage");
          $('#draw').hide();
          try {
              $scope.mlsRedirectNumber = $state.params.mlsNumber;
            } catch (e) {
              console.log(e);
            }

            if(($stateParams.listingid == undefined || $stateParams.listingid == "" ) && $scope.mlsRedirectNumber != undefined && $scope.mlsRedirectNumber != "") {
              httpServices.getPropertylistingId($scope.mlsRedirectNumber).then(
                function (success) {                  
                  $scope.listingId = success[0].Id;
                  $scope.loadInit();                
                }, function (error) {
                  console.log("error " + error);
                });
            } else {
              $scope.loadInit();
            }
            $scope.getPOIS();
        }


        $scope.loadInit = function () {
            $scope.isAgent = $('#isagentUser').val();
            $scope.isLoggedIn =  true;
            $scope.askaquestionAgents = [];
            $scope.selecteAgentFromList;
            $scope.dateText =  '';
            $scope.timeText = '';
            $scope.showAddress = true;


            if (($stateParams.listingId != undefined && $stateParams.listingId != "") || ($stateParams.mlsNumber != undefined && $stateParams.mlsNumber != "") || ($scope.listingId != undefined && $scope.listingId != "")) {
                //$scope.previewUrl = "images/property-md-1.jpg";
                $scope.previewUrl = "images/No-property-big.png";
                try {
                  if($scope.listingId == undefined || $scope.listingId == "") {
                    $scope.listingId = $stateParams.listingId;
                  }
                } catch (e) {
                  console.log(e);
                }

                $('#handle').hide();
                $('#arrowButton').show();
                if($state.current.name == 'tlcClient.search.propertydetail' || $state.current.name == 'tlc.search.propertydetail' || $state.current.name == 'tlc.PropertyDirect.MLS') {                  
                  $('#handle').show();
                  $('#arrowButton').hide();
                }

                try {
                  $scope.mlsNumber = $stateParams.mlsNumber ? $stateParams.mlsNumber : $state.params.mlsNumber;
                } catch (e) {
                  console.log(e);
                }

                $scope.getPropertyDetail(true);
                $scope.getCarYear();
              if ($scope.AudienceType == 'CLIENT') {
                $scope.getFavorites();
              }
                $scope.Search = { client: '', TLCType: 'manual' };
                $scope.checkNextPreProperty();
                $scope.IsshowPhotoGallery = false;
                $scope.printOption = { propertyDetail: true, neighborhood: false, TLC: false };
                $scope.IsDisplayDownPayment= true;
                if ($scope.AudienceType == 'MLSAGENT') {
                    $scope.printOption.PrintView = 'AgentView';
                }
                $scope.mozaic_projectID = "";
                $scope.mozaic_userId = "";
                $scope.mozaic_listingId = "";
                $(".property-title").hide();

                $scope.POISCheckbox = [{ text: 'Airports', isAdditional: true, id: 'Airports' },
                  { text: 'Amusement parks', isAdditional: true, id: 'AmusementParks' },
                  { text: 'ATMs', isAdditional: false, id: 'ATMs',checked:true },
                  { text: 'Auto services', isAdditional: false, id: 'AutoServices' },
                  { text: 'Banks', isAdditional: false, id: 'Banks' },
                  { text: 'Bus stations', isAdditional: true, id: 'BusStations' },
                  { text: 'Campgrounds', isAdditional: true, id: 'Campgrounds' },
                  { text: 'Casinos', isAdditional: true, id: 'Casinos' },
                  { text: 'City/town halls', isAdditional: false, id: 'CityTownhalls' },
                  { text: 'Community centers', isAdditional: true, id: 'CommunityCenters' },
                  { text: 'Convention centers', isAdditional: true, id: 'ConventionCenters' },
                  { text: 'Ferry terminals', isAdditional: true, id: 'FerryTerminals' },
                  { text: 'Galleries', isAdditional: true, id: 'Galleries' },
                  { text: 'Gas stations', isAdditional: false, id: 'GasStations' },
                  { text: 'Golf courses', isAdditional: false, id: 'GolfCourses' },
                  { text: 'Grocery stores', isAdditional: false, id: 'GroceryStores',checked:true },
                  { text: 'Hospitals', isAdditional: true, id: 'Hospitals' },
                  { text: 'Hotels', isAdditional: true, id: 'Hotels' },
                  { text: 'Landmarks', isAdditional: true, id: 'Landmarks' },
                  { text: 'Libraries', isAdditional: false, id: 'Libraries' },
                  { text: 'Marinas', isAdditional: true, id: 'Marinas' },
                  { text: 'Movie theaters', isAdditional: true, id: 'MovieTheaters' },
                  { text: 'Museums', isAdditional: true, id: 'Museums' },
                  { text: 'National parks', isAdditional: true, id: 'NationalParks' },
                  { text: 'Nightclubs', isAdditional: false, id: 'Nightclubs' },
                  { text: 'Parks', isAdditional: false, id: 'Parks' },
                  { text: 'Parking', isAdditional: true, id: 'Parking' },
                  { text: 'Pharmacies', isAdditional: false, id: 'Pharmacies' },
                  { text: 'Police stations', isAdditional: false, id: 'PoliceStations' },
                  { text: 'Post offices', isAdditional: false, id: 'PostOffices' },
                  { text: 'Rental car agencies', isAdditional: true, id: 'RentalCarAgencies' },
                  { text: 'Rest areas', isAdditional: true, id: 'RestAreas' },
                  { text: 'Restaurants', isAdditional: false, id: 'Restaurants',checked:true },
                  { text: 'Schools', isAdditional: false, id: 'Schools',checked:true },
                  { text: 'Shopping', isAdditional: false, id: 'Shopping' },
                  { text: 'Ski resorts', isAdditional: true, id: 'SkiResorts' },
                  { text: 'Stadiums and arenas', isAdditional: true, id: 'StadiumsArenas' },
                  { text: 'Subway stations', isAdditional: true, id: 'SubwayStations' },
                  { text: 'Theaters', isAdditional: true, id: 'Theaters' },
                  { text: 'Train stations', isAdditional: true, id: 'TrainStations' },
                  { text: 'Wineries', isAdditional: true, id: 'Wineries' }
                ];

                $scope.tlcOnOff = {
                    CommuteCost: true, CommuteGasCost: true, CommuteParkingCost: true, CommuteTollCost: true, CommuteTransitCost: true, CarMaintenance: true,
                    CarInsurance: true, Utilities: true, HeatingCoolingCost: true, WaterSewerCharge: true, GarbageCost: true, LawnSnowCare: true,
                    OtherUtilitiesCost: true, Entertainment: true, PhoneCharge: true, InternetCharge: true, TelevisionCharge: true, CellPhoneCharge: true, OtherCharge: true,Custom:true,Daycare:true
                };

                $scope.propertyDetailOnOff = globalSettings.propertyDetailOnOff;

                $timeout(function () {
                    detail();
                }, 10);
            }

            $scope.accordion = {
                agentGroupOpen: false,
                generalGroupOpen: false,
                taxGroupOpen: false,
                interiorGroupOpen: false,
                roomGroupOpen: false,
                featureGroupOpen: false,
                remarksGroupOpen: false,
                exteriorGroupOpen: false,
                parkingGroupOpen: false,
                utilitiesGroupOpen: false,
                waterGroupOpen: false,
                vacationGroupOpen: false,
                financeGroupOpen: false,
                hoaGroupOpen: false,
                legalGroupOpen: false,
                propertyGroupOpen: false,
                soldGroupOpen: false,
                farmGroupOpen: false
            }
        }

      $scope.getFavorites = function () {
        propertiesService.getFavoritesForClient({ clientId: appAuth.getAudienceId() }
          , function (success) {
            $timeout(function() {
              $scope.favorites = success;
              if ($.grep($scope.favorites.Listings, function (e) {
                  return e.Id == $scope.listingId;
                }).length > 0) {
                $scope.IsFavourite = true;
              } else {
                $scope.IsFavourite = false;
              }
              ;
            });
          }, function (error) {
          });
      }

      $rootScope.$on("checkFavMethod", function(){
           $scope.getFavorites();
      });

      $rootScope.$on("addPropertyDetailAskQuestion", function(){
           $scope.onClickAskAQuestionModalPopup();
      });

      $rootScope.$on("addPropertyDetailFavMehtod", function(scope, listingid){
           $scope.addClientFavoriteDetailPage(listingid);
        });

      $scope.addClientToFavorite = function (Id) {
       
        $scope.$emit("CallOpenMozaicFavoritePopup", $scope.property);
      }
      $rootScope.$on("CallApplyFavorite", function (scope, data) {
        $scope.IsFavourite = true;
        //$scope.IsAddToFavorite = !$scope.IsFavourite;
      });
     
      $scope.removeClientFromFavorite = function (Id) {
        //httpServices.trackGoogleEvent('RemoveClientFavorite', 'property-list');
        var listingIds = [Id];
        httpServices.deletefavoritesClient(listingIds).then(
          function (success) {
            $scope.IsFavourite = false;
            $("#add-favorite_" + Id).show();
            //$scope.$apply();
            //$scope.IsAddToFavorite = !$scope.IsFavourite;
            aaNotify.success('Property successfully removed from favorite.');
          }, function (error) {
            console.log("error " + error);
          });
      }

        $scope.$on("doSearch",function(event, obj){          
            $scope.searchParameters = applicationFactory.filterAllParameters();
            $rootScope.$broadcast("doSearch", $scope.searchParameters);
        });

      $scope.getPropertyDetail = function (bLoadOther) {

          httpServices.getPropertyDetail($scope.listingId, $scope.mlsNumber).then(
               function (success) {
               
                 $scope.propertyDetail = success.ListingDetail.Listing;     

                  var d = new Date();
                  var year = d.getFullYear(); 
                  $scope.age = parseInt(year-success.ListingDetail.Listing.YEARBUILT);
                 
                   $scope._listtrac_trackEvent(_eventType.view);
                  if(success.TLCInfo) {
                    $scope.hoaFee = success.TLCInfo[0].HOAFees;
                  }                  

                  $scope.showingText = "I am interested in " +$scope.propertyDetail.STREETNUMBERNUMERIC+" "+$scope.propertyDetail.STREETNAME+" "+$scope.propertyDetail.STREETSUFFIX+" "+$scope.propertyDetail.CITY+", "+$scope.propertyDetail.STATEORPROVINCE+", "+$scope.propertyDetail.POSTALCODE + ".";

                   if($scope.AudienceType == 'MLSAGENT' && $scope.agent != null && $scope.agent.MemberKey != null && $scope.agent.MemberKey == success.ListingDetail.Listing.LISTAGENTMLSID) {
                     $scope.allowEditTLC = true;
                     $scope.editTLCValues = {};
                   }
                   else
                       $scope.allowEditTLC = false;
                 $rootScope.propertyDetailFix = success.ListingDetail.Listing;
                 $scope.unitNumber = "";
                 if($scope.propertyDetail.UNITNUMBER != "") {
                    $scope.unitNumberForHover = ", #"+$scope.propertyDetail.UNITNUMBER;
                    $scope.unitNumber = "#"+$scope.propertyDetail.UNITNUMBER; 
                 }
                 
                 if($scope.AudienceType != 'MLSAGENT' && success.ListingDetail.Listing.DISTRIBUTEADDRESSTOINTERNET == "0") {
                   $scope.showAddress = false;
                   success.ListingDetail.Listing.STREETNAME = "";
                   success.ListingDetail.Listing.STREETNUMBER = "";
                   success.ListingDetail.Listing.STREETNUMBERNUMERIC = "";
                   success.ListingDetail.Listing.STREETDIRPREFIX = "";
                   success.ListingDetail.Listing.STREETSUFFIX = "";

                   $scope.propertyDetail.STREETNAME = "";
                   $scope.propertyDetail.STREETNUMBER = "";
                   $scope.propertyDetail.STREETNUMBERNUMERIC = "";
                   $scope.propertyDetail.STREETDIRPREFIX = "";
                   $scope.propertyDetail.STREETSUFFIX = "";

                   $rootScope.propertyDetailFix.STREETNAME = "";
                   $rootScope.propertyDetailFix.STREETNUMBER = "";
                   $rootScope.propertyDetailFix.STREETNUMBERNUMERIC = "";
                   $rootScope.propertyDetailFix.STREETDIRPREFIX = "";
                   $rootScope.propertyDetailFix.STREETSUFFIX = "";

                   $scope.showingText = "I am interested in " + $scope.propertyDetail.CITY+", "+$scope.propertyDetail.STATEORPROVINCE+", "+$scope.propertyDetail.POSTALCODE + ".";
                 }
                   $('.askMeQuestion-address').val($scope.showingText);
                  $scope.listingId = success.Id;
                  $scope.propertyDetail.Id = success.Id;
                  $scope.propertyDetail.MLSId = success.MLSId;
                  $scope.OpenHouse = success.ListingDetail.OpenHouse;

                 $scope.checkHOAInclude();

                var MLSSTATUS = success.ListingDetail.Listing.MLSSTATUS;
                if (MLSSTATUS == 'Pending') {
                  $(".MLSStatus").addClass('MLSSTATUSPENDING');
                }
                else if (MLSSTATUS == 'Active') {
                  $(".MLSStatus").addClass('MLSSTATUSACTIVE');
                }

                  //$rootScope.$broadcast('setPropertyDetailMap', { property: success });
                  var obj = {};
                  obj.property = success;
                  $scope.setPropertyDetailMap(obj);
                  $scope.Photos = success.Photos;
                  $rootScope.PhotosFix = success.Photos;
                  $scope.UlRepeatLength = Math.ceil(parseInt(success.Photos.length) / 3);
                  $scope.UlRepeatLengthForDiv = Math.ceil(parseInt(success.Photos.length) / 6);
                  $scope.UlRepeatLengthARR = [];
                  $scope.UlRepeatLengthForDivARR = [];
                  for (var i = 0; i < $scope.UlRepeatLength; i++) {
                      $scope.UlRepeatLengthARR.push(i);
                  }
                  for (var i = 0; i < $scope.UlRepeatLengthForDiv; i++) {
                      $scope.UlRepeatLengthForDivARR.push(i);

                  }
                  $timeout(function () {
                      for (var i = 0; i < $scope.UlRepeatLengthForDiv; i++) {
                          $('#tile-wrapper_' + i).tiles();
                      }
                      hideThumbButton();
                  }, 1000);
                  if ($scope.propertyDetail != undefined && $scope.propertyDetail.PHOTOSCOUNT > 0 && $scope.Photos != null && $scope.Photos.length > 0) {
                      $scope.selectPreview($scope.Photos[0]);
                      $("#propDisplayImage").removeClass("propDisplayImage");
                      $(".side-thumb-slider").show();
                  }
                  else {
                      $scope.previewUrl = "images/No-property-big.png";
                      $("#propDisplayImage").addClass("propDisplayImage");
                      $(".side-thumb-slider").hide();
                  }

                 var settings = applicationFactory.getSettings();
                  $scope.calculator = {
                      Id: $scope.propertyDetail.Id,
                      //MLSNumber:$scope.propertyDetail.LISTINGID,
                      //MlsId:$scope.propertyDetail.MLSId,
                      PropertyPrice: $scope.propertyDetail.LISTPRICE,
                      LivingAreaSquareFeet: $scope.propertyDetail.LIVINGAREA,
                      //HomeAddress: $scope.propertyDetail.STREETNUMBERNUMERIC + ' ' + $scope.propertyDetail.STREETDIRPREFIX + ' ' + $scope.propertyDetail.STREETNAME + ' ' + $scope.propertyDetail.CITY + ', ' + $scope.propertyDetail.STATEORPROVINCE + ', ' + $scope.propertyDetail.POSTALCODE,
                      DownPercentage: 20,
                      TaxBracket: "25",
                      WorkAddressList: [{ TransportationType: 'car',WorkAddress:settings.DefaultWorkAddress }],
                      LoanType:'30YrFixed',
                      FicoScore : '760-850'
                  };

                   if ($stateParams.searchParams != undefined && $stateParams.searchParams != "") {
                     var filters = applicationFactory.filterAllParameters();

                     if(filters["ficoscore"])
                       $scope.calculator.FicoScore = filters["ficoscore"];
                     if(filters["loantype"])
                       $scope.calculator.LoanType = filters["loantype"];
                     if(filters["lifestyle"])
                       $scope.calculator.LifeStyle = filters["lifestyle"];
                     if(filters["commutes"] && filters["commutes"].length > 0)
                       $scope.calculator.WorkAddressList[0].WorkAddress = filters["commutes"][0].commuteaddress;
                   }

                  if ($scope.client != null) {
                      $scope.calculator.LifeStyle = $scope.client.Profile.BasicData.MStatus;
                      $scope.calculator.FicoScore = $scope.client.Profile.BasicData.CreditScore;
                  }

                  $scope.ChangeLoanType();
                  $scope.changeDownPercentage();

                  if($scope.AudienceType == 'CLIENT' || $scope.AudienceType == 'AnonymousUser') {
                    $scope.onClickAskAQuestion();
                  }

                  if (($scope.AudienceType == 'CLIENT' && $scope.client != null) || ($scope.AudienceType == 'MLSAGENT' && $scope.client != null)) {
                      $scope.Search.TLCType = 'client';
                      $scope.TLCClient = $scope.client;
                      if($scope.AudienceType == 'CLIENT')
                          $scope.TLCClient.Protected = false;
                      $scope.TLCClientInformation();
                      $scope.CalculateMortgage();
                      $("#lifeStyleClientDetail").addClass('active');
                      $("#lifeStylePropDetail").removeClass('active');                      
                  }
                  else if ($scope.AudienceType == 'MLSAGENT' && applicationFactory.getSelectedClient()) {
                      $scope.TLCClient = applicationFactory.getSelectedClient();
                      $scope.tlcForClient(applicationFactory.getSelectedClient());
                      $scope.CalculateMortgage();
                      $("#lifeStyleClientDetail").addClass('active');
                      $("#lifeStylePropDetail").removeClass('active');
                  }
                  else if (success.TLCInfo != undefined && success.TLCInfo.length > 0) {
                      $scope.mortgageDetail = { TLCInfo: success.TLCInfo };

                      $scope.GetDownPaymentPercentages();
                  }

                  if(bLoadOther) {
                    $scope.getDemographicsDetail();
                    //$scope.getPOIS();
                    $scope.getSchools();
                  }
              }, function (error) {
                console.log(error);
              });
        }

        $scope.loadAgentsForListings = function(memberNrdsId) {
            if(memberNrdsId && memberNrdsId!= "") {
                propertiesService.getAgentSearchResult({MemberNrdsID: memberNrdsId},
                    function (success) {
                        for (var i=0; i<success.Clients.length; i++){
                            $scope.askaquestionAgents.push(success.Clients[i]);
                        }
                        if($scope.askaquestionAgents.length == 1) {
                            $('#aaq-select-box-form').hide();
                            $('#aaq-select-box-pop').hide();
                            $scope.selectedAgent = $scope.askaquestionAgents[0];
                        } else{
                            $scope.selectedAgent = null;
                            $('#aaq-select-box-form').show();
                            $('#aaq-select-box-pop').show();
                            $scope.selectedAgent = $scope.askaquestionAgents[0];
                        }
                        $scope.update_agent_select();
                    }, function (error) {
                        aaNotify.warn("Error while loading agent details.", { ttl: 5000 });
                    }
                );
            }
        }

        $scope.onClickAskAQuestion = function () {
            $scope.agentDetails();
        }


        $scope.resetAskAQuestion = function () {
            $('.askMeQuestion-firstname').val('');
            $('.askMeQuestion-lastname').val('');
            $('.askMeQuestion-email').val('');
            $('.scheduleDate').datepicker('setDate', null);
            $('.showingTime').val('any');
            $('.askMeQuestion-address').val($scope.showingText);
            $('.scheduleCheckBox').prop('checked', false);
            $('.scheduleVisitTIme').css("display","none");
            $('.scheduleVisitTImeModal').css("display","none");
            if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
                $('.askMeQuestion-firstname').val(appAuth.isLoggedIn().Audience.FirstName);
                $('.askMeQuestion-lastname').val(appAuth.isLoggedIn().Audience.LastName);
                var email = localStorage.janrainCaptureProfileData;
                if (typeof(Storage) !== "undefined") {
                    if (localStorage.janrainCaptureProfileData) {
                        email = JSON.parse(email);
                        email = email['email'];
                    }
                }
                $('.askMeQuestion-email').val(email);
            }
        }

        $scope.agentDetails = function() {
            $scope.resetAskAQuestion();
            $scope.askaquestionAgents = [];
            var agents = [];
            if(currentAgent) {
              agents = JSON.parse(currentAgent).agents;
              if(agents.length != 0) {
                $scope.loadAgentsForListings(agents[0].agentId);
              } else {
                $scope.loadAgentsForListings($scope.propertyDetail.LISTAGENTMLSID);
                $scope.loadAgentsForListings($scope.propertyDetail.UNMAPPED.ALTAGENTID);
              }
            } else {
                $scope.loadAgentsForListings($scope.propertyDetail.LISTAGENTMLSID);
                $scope.loadAgentsForListings($scope.propertyDetail.UNMAPPED.ALTAGENTID);
            }            
            $('.askMeQuestion-address').val($scope.showingText);
        }

        $scope.onClickAskAQuestionModalPopup = function () {
          $scope.trackGA('Clicked Ask a Question','Listing Detail page', $scope.propertyDetail.LISTINGID, 'Ask a Question');
          $scope.agentDetails();
          $('#askMeQuestion').modal('show');
        }

        $scope.closeAskAQuestionForm = function() {
            $('#askMeQuestion').modal('hide');
        }

        $scope.update_agent_select = function () {
            if($scope.selectedAgent) {
                if(isJson($scope.selectedAgent.Profile)) {
                    $scope.selectedAgent.Profile = JSON.parse($scope.selectedAgent.Profile).ProfileImageName;
                }
                $('#aaq-selcted-agent-popup').show();
                $('#aaq-selcted-agent').show();
            } else {
                $('#aaq-selcted-agent-popup').hide();
                $('#aaq-selcted-agent').hide();
            }
            $scope.selecteAgentFromList = $scope.selectedAgent;
        }

        $scope.submitAskAQuestion = function () {
          if(!$(".aa-notification").is(':visible')){
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if($scope.selecteAgentFromList == null) {
                aaNotify.warning('Please choose an agent!', {
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                              //time to live in ms
                });
            } else if($('.askMeQuestion-firstname').val().trim() == '') {
                aaNotify.warning('First name is required!', {
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                              //time to live in ms
                });
            } else if($('.askMeQuestion-lastname').val().trim() == '') {
                aaNotify.warning('Last name is required!', {
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                              //time to live in ms
                });
            } else if($('.askMeQuestion-email').val().trim() == '' ) {
                aaNotify.warning('Email is required!', {
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                              //time to live in ms
                });
            } else if(!filter.test($('.askMeQuestion-email').val().trim())) {
                aaNotify.warning('Invalid email address!', {
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                              //time to live in ms
                });
            } else {
                var mailToAgent = "Hi " + $scope.selecteAgentFromList.MemberFullName;
                if($('.askMeQuestion-address').val().trim() != '') {
                    mailToAgent += "<br/><br/>" + $('.askMeQuestion-address').val().trim() + "<br/><br/>";
                } else {
                    mailToAgent += "<br/><br/>I am interested in the following property.<br/><br/>";
                }
                mailToAgent += "Link to the Property:" + window.location.href + "<br/><br/>";
                mailToAgent += "Please write back to me.<br/>";
                mailToAgent += "<br/>Thanks,<br/>";
                mailToAgent += $('.askMeQuestion-firstname').val();
                $scope.sendEmailToAgent($('.askMeQuestion-email').val(), $scope.selecteAgentFromList.MemberEmail, "Interested on the Property", mailToAgent);
            }
          }

        }

        $scope.sendEmailToAgent = function(From, To, Subject, Body){            
            propertiesService.sendEmailToagent({ "From":From, "To":To, "Subject":Subject, "Body":Body },
                function (success) {
                  if(!$(".aa-notification").is(':visible')){
                    aaNotify.success('Agent notified successfully.', {
                        showClose: true,                            //close button
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 3                              //time to live in ms
                    });
                  }
                    $scope.resetAskAQuestion();
                    $scope.closeAskAQuestionForm();
                },
                function (error) {                    
                    aaNotify.warning('Error while trying to submit. Please try later!.', {
                        showClose: true,                            //close button
                        iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 3                              //time to live in ms
                    });
                }
            );
        }

        $scope.checkHOAInclude = function() {
          var HOAInclude = {HeatingCooling: false, WaterSewer: false, Garbage: false, LawnSnowCare: false};

          if ($scope.propertyDetail.ASSOCIATIONFEEINCLUDES) {
            if ($scope.propertyDetail.ASSOCIATIONFEEINCLUDES.indexOf('Heating') > -1)
              HOAInclude.HeatingCooling = true;

            if ($scope.propertyDetail.ASSOCIATIONFEEINCLUDES.indexOf('Water/Sewer') > -1)
              HOAInclude.WaterSewer = true;

            if ($scope.propertyDetail.ASSOCIATIONFEEINCLUDES.indexOf('Snow/Lawn Care') > -1)
              HOAInclude.Garbage = true;

            if ($scope.propertyDetail.ASSOCIATIONFEEINCLUDES.indexOf('Sanitation') > -1)
              HOAInclude.LawnSnowCare = true;
          }

          $scope.HOAInclude = HOAInclude;
        }

        $rootScope.$on("_listtrac_trackEvent", function(eventtype){
            $scope._listtrac_trackEvent(eventtype);
        });

        $scope._listtrac_trackEvent = function(eventtype) {

            if(eventtype == 'vTour') {
                eventtype = _eventType['vTour'];
            }
            var listingId = $scope.listingId;
            listingId = (listingId != 'undefined' && listingId != '') ? listingId : null;

            var zipcode = $scope.propertyDetail.POSTALCODE;
            zipcode = (zipcode != 'undefined' && zipcode != '') ? zipcode : null;

            var agentId = $scope.propertyDetail.LISTAGENTMLSID;
            agentId = (agentId != 'undefined' && agentId != '') ? agentId : null;

            var userId = 'Client';
            if(appAuth.isLoggedIn().AudienceType == '"MLSAGENT"') {
                userId = LoggedInAgent.MemberNrdsID;
            }
            userId = (userId != 'undefined' && userId != '') ? userId : null;

            var report = 'Single Photo Report';

            if (typeof(_LT) != 'undefined' && _LT != null ) {
                _LT._trackEvent(eventtype, listingId, zipcode, agentId, userId, report);
            }
        }

        $scope.getDemographicsDetail = function () {
            propertiesService.getDemographicsDetail({ zipcode: $scope.propertyDetail.POSTALCODE }
              , function (success) {
                  if (success != undefined && success.alldemo[0]) {
                      $scope.demographics = success.alldemo[0];
                  }
              }, function (error) {
                  console.log("error " + error);
              });
        }


        $scope.getDemographicsDetail = function () {
            propertiesService.getDemographicsDetail({ zipcode: $scope.propertyDetail.POSTALCODE }
                , function (success) {
                    if (success != undefined && success.alldemo[0]) {
                        $scope.demographics = success.alldemo[0];
                    }
                }, function (error) {
                    console.log("error " + error);
                });
        }


        $scope.getPOISModal = function() {
          $('#getPoisModal').modal('show');
        }

        $scope.setBingMap = function() {
            var settings =applicationFactory.getSettings();
          var mapcenter = new Microsoft.Maps.Location(settings.latitude, settings.longitude), mapzoom = 10
          map = new Microsoft.Maps.Map(document.getElementById("mapPOIS"), {
              //                  credentials: 'AnWQOEQ-b5i8r9PacrTgaus7oVC1TVXAhfM0Ma4yw25guue1C3qj4ezitliTMotQ',
              credentials: settings.BingKey,
              enableClickableLogo: false,
              enableSearchLogo: false,
              showMapTypeSelector: true,
              showDashboard: true,
              showScalebar: false,
              disableKeyboardInput: true,
              zoom: mapzoom,
              center: mapcenter
            });
        }

        $scope.setPoisMap1 = function (args) {            
              _.each(args.pins, function (pin) {
                if (args.isAdd) {
                  map.entities.push(pin);
                  //Microsoft.Maps.Events.addHandler(pin, 'mouseover', pinMouseOver);
                  map.setView({zoom: 10});
                }
                else
                  map.entities.remove(pin);
              });
            }
          
            $scope.setPropertyDetailMap = function (args) {
            map.entities.clear();
            var property = args.property;
            var price = utilService.getSortPrice(property.ListingDetail.Listing.LISTPRICE);

            var _latitude = Number(property.ListingDetail.Listing.LATITUDE);
            var _longitude = Number(property.ListingDetail.Listing.LONGITUDE);

            var loc = new Microsoft.Maps.Location(_latitude, _longitude);
            // Center the map on the location
            map.setView({ center: loc, zoom: 19 });
            var largeIconUrl = (property.ListingDetail.OpenHouse != undefined && property.ListingDetail.OpenHouse.length > 0) ? '/images/markers/8_Large.png' :'/images/markers/0_Large.png';
            var largeIconClass = 'pincursor zoomIn_map propDetailMapIcon';
            largeIconClass+=(property.ListingDetail.OpenHouse != undefined && property.ListingDetail.OpenHouse.length > 0) ? ' open_house_large8' :'';
            var pin = new Microsoft.Maps.Pushpin(
              new Microsoft.Maps.Location(_latitude, _longitude),
              { icon: largeIconUrl, width: 33, height: 42, typeName: largeIconClass, text: utilService.getSortPrice(property.ListingDetail.Listing.LISTPRICE) }
            );
            map.entities.push(pin);
            map.entities._location = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(_latitude, _longitude));
            //isRepeat = false;
           // map.entities.Description = getPropertyDetailPopupDetailPage(property);
            //Microsoft.Maps.Events.addHandler(map.entities, 'entityadded', displayInfoboxForDetailPage);

          }
        $scope.getPOIS = function () {
            $scope.setBingMap();
            propertiesService.getPOIS({ id: $scope.listingId }
              , function (success) {
                  if (success != undefined && success.PoisCount > 0) {
                      //$scope.pois = success.Pois;
                      var pois = {};
                      _.each(success.Pois, function (pin) {
                          if (pois[pin.Type] == undefined)
                              pois[pin.Type] = [];

                          var NewPin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(pin.Latitude, pin.Longitude), {
                              icon: '/images/markers/poi-' + pin.Type.replace(" ", "").replace("/", "") + '.png', width: 33, height: 42, typeName: 'pincursor marker poiIcon HideTXT', text: pin.Name
                          });
                          pois[pin.Type].push(NewPin);
                      });

                      $scope.pois = pois;
                      
                      var ATMs = _.find($scope.POISCheckbox,function(o){return o.id == 'ATMs'});
                      $scope.setPoisMap(ATMs);

                      var GroceryStores = _.find($scope.POISCheckbox,function(o){return o.id == 'GroceryStores'});
                      $scope.setPoisMap(GroceryStores);

                      var Schools = _.find($scope.POISCheckbox,function(o){return o.id == 'Schools'});
                      $scope.setPoisMap(Schools);

                      var Restaurants = _.find($scope.POISCheckbox,function(o){return o.id == 'Restaurants'});
                      $scope.setPoisMap(Restaurants);

                      $timeout(function () {
                          $("a.poiIcon").each(function () {
                              $(this).attr("id", "null");
                              if (!$(this).hasClass('TempMapFilter')) {
                                  $(this).click(function () {
                                      $(this).toggleClass('HideTXT');
                                  });
                                  $(this).addClass('TempMapFilter');
                              }
                          });
                      }, 5000);
                  }
              }, function (error) {
                  console.log("error " + error);
              });
        }

        $scope.getSchools = function () {
          if ($scope.propertyDetail.HIGHSCHOOLDISTRICT != null) {
            var schools = $scope.propertyDetail.HIGHSCHOOLDISTRICT.split('-');
            if(schools.length > 0 && Number(schools[0]) > 0) {
              propertiesService.getSchoolsDetail({listingId: $scope.listingId, number: Number(schools[0])}
                , function (success) {
                 $scope.schools = success;
                }, function (error) {
                });
            }
          }
        }

        $scope.getCarYear = function () {
            var startYear = new Date().getFullYear();
            var currentYear = new Date().getFullYear() - 30;
            $scope.carYear = [];
            $scope.carYearList = [];
            for (var i = startYear; i >= currentYear; i--) {
                $scope.carYear[i] = null;
                $scope.carYearList.push(i);
            }
        }

        $scope.changeCarYear = function (carYear) {
            if ($scope.GasRates == null) {
                $scope.getGasRates();
            }

            if (carYear != undefined) {
                if ($scope.carYear[carYear] == null) {
                    propertiesService.getVehicles({ year: carYear }
                      , function (success) {
                          $scope.carYear[carYear] = success.cardata;
                          //$scope.changeCarType(commuteDetail);
                      }, function (error) {
                      });
                }
            }
        }

        $scope.getMake = function (commuteDetail) {
            return _.uniq($scope.carYear[commuteDetail.CarYear], function (o) { return o.make; });
        }

        $scope.getModel = function (commuteDetail) {

          var models =  _.chain($scope.carYear[commuteDetail.CarYear])
              .where({ make: commuteDetail.CarMake })
              .uniq(function (o) { return o.model; }).value();

          if(models.length == 1)
            commuteDetail.CarModel = models[0].model;

          return models;
        }

        $scope.getType = function (commuteDetail) {
          var types = _.chain($scope.carYear[commuteDetail.CarYear])
            .where({ make: commuteDetail.CarMake, model: commuteDetail.CarModel }).value()

          if(types.length == 1)
          {
            commuteDetail.CarType = types[0].id + '';
            $scope.changeCarType(commuteDetail);
          }

          return types;
        }

        $scope.changeCarType = function (commuteDetail) {
            var selected = _.find($scope.carYear[commuteDetail.CarYear], function (o) { return o.id == commuteDetail.CarType });
            if (selected) {
                commuteDetail.CityMPG = selected.citympg;
                commuteDetail.HwyMPG = selected.hwympg;

                if ($scope.GasRates[selected.fuelType.toLowerCase()] != null) {
                    commuteDetail.CurrentGasRate = Number($scope.GasRates[selected.fuelType.toLowerCase()]);
                }
            }
        }

        $scope.getGasRates = function () {
            propertiesService.getGasRates(
               function (success) {
                   $scope.GasRates = success;
               }, function (error) {
               });
        }

        $scope.getAPRRates = function () {
          propertiesService.getAPRRates({ stateCode: $scope.propertyDetail.STATEORPROVINCE }
              , function (success) {                
                $scope.AllAPRRates = success.aprdata;
              }, function (error) {
                  console.log("error " + error);
              });
        }

        $scope.ChangeLoanType = function () {          
          $scope.APRRates = _.filter($scope.AllAPRRates, function (o) {            
            return o.StateName == $scope.propertyDetail.STATEORPROVINCE && o.LoanType == $scope.calculator.LoanType 
          });          
          $scope.ChangeFicoScore();
        }

        $scope.ChangeFicoScore = function () {
          var findObject = _.find($scope.AllAPRRates, function (o) { return o.StateName == $scope.propertyDetail.STATEORPROVINCE && o.LoanType == $scope.calculator.LoanType && o.FicoScore == $scope.calculator.FicoScore });

          if(findObject)
            $scope.calculator.KnownAPR = findObject.APR;
        }

        $scope.changeDownPayment = function () {
            if (!isNaN($scope.calculator.DownPayment))
                $scope.calculator.DownPercentage = (($scope.calculator.DownPayment * 100) / $scope.calculator.PropertyPrice).toFixed(2);
        }

        $scope.changeDownPercentage = function () {
            if (!isNaN($scope.calculator.DownPercentage))
                $scope.calculator.DownPayment = (($scope.calculator.DownPercentage * $scope.calculator.PropertyPrice) / 100).toFixed(2);
        }

        $scope.$watch('calculator.DownPercentage', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            $scope.changeDownPercentage();
          }
        })

        $scope.tlc_calculate = function () {
            //httpServices.trackGoogleEvent('MoveToTLCSection','property-detail');

            $("#info").tabs("option", "active", 3), $("#propertyDetail").delay(100).animate({
                scrollTop: $("#info").offset().top - 100
            }, 300), !1;
        }

        $scope.changeTransportType = function () {
            $timeout(function () {
                $('.title-tipso').tipso();
            }, 1000);
        };

        $scope.CalculateMortgage = function (eventTrack) {

            if (eventTrack) {
              //httpServices.trackGoogleEvent('CalculateMortgage','property-detail');
            }
            $("#tlcresults").addClass('fullUlVertical_tab');
            var objCalculator = {};
            var clientId = null;
            if ($scope.Search.TLCType == 'manual') {
                if ($scope.calculator.WorkAddressList[0].TransportationType == 'transit') {
                    $scope.calculator.WorkAddressList[0].CarYear = 0;
                    $scope.calculator.WorkAddressList[0].CarMake = '';
                    $scope.calculator.WorkAddressList[0].CarModel = '';
                    $scope.calculator.WorkAddressList[0].CarType = '';
                    $scope.calculator.WorkAddressList[0].CityMPG = 0;
                    $scope.calculator.WorkAddressList[0].HwyMPG = 0;
                    $scope.calculator.WorkAddressList[0].CommuteParkingCost = 0;
                    $scope.calculator.WorkAddressList[0].CurrentGasRate = 0;
                }

                $scope.calculator.CommuteParkingCost = $scope.calculator.WorkAddressList[0].CommuteParkingCost;
                $scope.calculator.TransportationType = $scope.calculator.WorkAddressList[0].TransportationType;

                objCalculator = angular.copy($scope.calculator);
            }
            else {
                objCalculator = {
                    PropertyPrice: $scope.calculator.PropertyPrice, DownPayment: $scope.calculator.DownPayment
                  , DownPercentage: $scope.calculator.DownPercentage, LivingAreaSquareFeet: $scope.calculator.LivingAreaSquareFeet
                };

                clientId = $scope.TLCClient.Id;
            }

            if ($scope.OtherCustomFields != null) {
              objCalculator.CustomFields = _.filter($scope.OtherCustomFields,function(o){return o.Amount > 0 });
            }

            httpServices.tlcCalculator($scope.Search.TLCType, $scope.listingId, objCalculator, clientId).then(
              function (success) {
                  if (success != undefined && success.TLCInfo.length > 0) {
                      $scope.mortgageDetail = success;

                    $scope.IsDisplayDownPayment=true;
                     
                      $scope.GetDownPaymentPercentages();

                  }
              }, function (error) {
                  var errorMessages = [];
                  _.each(error.data, function (o) {
                      errorMessages.push("<li>" + o.ErrorMessage + "</li>");
                  });
                  aaNotify.danger("<ul>" + errorMessages.join("") + "</ul>",
                    {
                        showClose: true,                            //close button
                        iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                        allowHtml: true,                            //allows HTML in the message to render as HTML

                        //common to the framework as a whole
                        ttl: 1000 * 10  //time to live in ms
                    });
              });
        }

        $scope.chartMortgageGraphs = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: 'Payment Breakdown',
                align: 'center',
                verticalAlign: 'middle',
                y: -50
            },
            subtitle: {
                text: ''
            },
            tooltip: {
                formatter: function () {
                    return this.point.name + ': ' + $filter('currencyNoDecimal')(this.y) + ' (' + $filter('number')(this.percentage, 1) + '%)';
                }
            },
            /*legend: {
              layout: 'vertical',
              align: 'left',
              verticalAlign: 'bottom',
              x: 0,
              y: 0,
              floating: true,
              borderWidth: 1
            },*/
            legend: {
                /*itemDistance:30,*/

                /*itemMarginBottom: 25,
                itemMarginRight: 15,
                itemWidth: 140,
                itemStyle: {
                    width: '130px'
                }*/
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        distance: -30,
                        color: '#000000',
                        connectorColor: '#000000',
                        useHTML: true,
                        /*color: 'white',*/
                        /*rotation : 15,
                        formatter: function () {
                          return '<b>' + this.point.name + '</b>' + ': ' + $filter('currencyNoDecimal')(this.y);
                        }*/
                        formatter: function () {
                            if (this.percentage != 0) return Math.round(this.percentage) + '%';
                        }
                    },
                    shadow: false,
                    center: ['50%', '50%'],
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '',
                innerSize: '65%',
                size: '100%'
            }],
            colors: ["#F48384", "#00C38A", "#3E4651", "#7cb5ec", "#90ed7d", "#ff0066", "#eeaaee",
              "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
            //size: {
            //    width: 400,
            //    height: 300
            //},
            exporting: {
                enabled: false
            }
        }

        $scope.showCalculator = function () {
          $scope.ChangeLoanType();
          //httpServices.trackGoogleEvent('Personalize-Calculation','property-detail');

            $("#info-calculator").removeClass("results");
          $scope.IsDisplayDownPayment=false;
            $("ul.propDetailClient li").click(function () {
                $(".PropDetailSearchClient").addClass('active');
                $("#lifeStylePropDetail").removeClass('active');
            });
        }

        $scope.selectPreview = function (imageUrl) {
            $scope.previewUrl = $scope.getPhotoUrl(imageUrl, 'default');
        };

        $scope.getPhotoUrl = function (item, type) {
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




        function detail() {
            var detail = $("#propertyDetail");

            $timeout(function () {
                //$("#actions div ul").scrollbar();
                //$("#actions1 div ul").scrollbar();
                //$("#actions2 div ul").scrollbar();
            }, 1000);

            $("#results > li").css("opacity", 0)/*, $("#content > div > article").scrollbar("destroy")*/;
            detail.parent().addClass("selected result detail").css("top", $("#content > article").scrollTop());
            if($(window).width() >= 768) {
              $("#content").animate({
                width: "74%"
              }, 300), $("#map").animate({
                width: "26%"
              }, 300), detail.addClass("detail").css("top", $("#content > article").scrollTop());
            }
            $("#back").addClass("visible"), $("#content > article > div.scroll-wrapper").css({
                top: $("#content > article").scrollTop()
            }), detail.css("top", 0);

            $("#actions").appendTo("li.detail .address"), $(".morph-button > span").click(function (a) {
                a.stopPropagation(), $(".morph-button").addClass("open").css("height", 140);
            }), $("body").click(function () {
                $(".morph-button").removeClass("open").css("height", 40);
            }), $("#info").tabs({
                activate: function (a, b) {
                    "info-lifestyle" != b.newPanel.attr("id") && $("#info-lifestyle a.active").click();
                },
                create: function () { }
            })/*, $("#profile input").iCheck()*/, $("#info-neighborhood td").each(function () {
                "N/A" == $(this).text() && $(this).addClass("na");
            })/*, $("#info-calculator").find("input.dollar, #calc_sqft").priceFormat({
         prefix: "",
         centsLimit: 0
         })*/;

            // ===================== [ S ] Switch: ===================== //
            /**
     *  a jQuery plugin for creating simple, user-friendly, 508-compliant,
     *  iPhone-style slider-toggles using a mix of HTML, CSS, and Javascript.
     *
     *  @author rees.byars
     */ (function ($) {

         var sliderTogglePluginName = "sliderToggle";

         /**
          * values for keycodes, mainly for use in 508
          */
         var keyCodes = {
             tab: 9,
             enter: 13,
             space: 15,
             left: 37,
             up: 38,
             right: 39,
             down: 40
         };

         var defaults = {
             height: 13,
             width: 78,
             ballwidth: 18,
             tabindex: 0,
             speed: 100
         };

         function SliderToggle(element, options) {
             this.element = element;
             this.options = $.extend({}, defaults, options);
             this.options = $.extend({}, this.options, $(element).data());
             this.init();
         }

         SliderToggle.prototype = {

             init: function () {

                 var $container = $(this.element);
                 var $choices = $container.children('input[type=radio]');

                 if ($choices.length != 2) {
                     alert("Error:  the slider toggle container [" + $container.attr('id') + "] must contain exactly 2 radio inputs");
                     return;
                 }

                 // get the two radio options and hide them since we are "replacing" them with our own
                 var $leftRadio = $($choices[0]).hide();
                 var $rightRadio = $($choices[1]).hide();

                 // get the text to display on the left and right sides of the slider, use label if present, use radio value otherwise
                 function getText($radio) {
                     var $label = $('label[for="' + $radio.attr('id') + '"]');
                     if ($label.length <= 0) {
                         return $radio.val();
                     }
                     $label.hide();
                     return $label.text();
                 }
                 var onText = getText($leftRadio);
                 var offText = getText($rightRadio);

                 /*
                  setup rest the values to be used
                  */

                 var height = this.options.height;
                 var width = this.options.width;
                 var ballWidth = this.options.ballwidth;
                 var ballRight = width - ballWidth; //2 due to the border
                 var hideWidth = ballWidth / 2;
                 var showWidth = width - hideWidth;
                 var speed = this.options.speed;
                 var tabIndex = $leftRadio.attr('tabindex');
                 if (!tabIndex) {
                     tabIndex = this.options.tabindex;
                 }

                 /*
                  style and/or create all the elements
                  */

                 var $label = $container.children('.slider-toggle-label-text')
                     .css({
                         'line-height': height + 'px'
                     })
                     .height(height);

                 var $leftP = $('<p></p>')
                     .height(height)
                     .css({
                         'line-height': height + 'px',
                         'margin-left': 10 + 'px'
                     });
                 var $rightP = $('<p></p>')
                     .height(height)
                     .css({
                         'line-height': height + 'px',
                         'margin-right': 10 + 'px'
                     });

                 var $leftTextSpan = $('<span role="radio"></span>')
                     .addClass('slider-toggle-text')
                     .addClass('left')
                     .append($leftP)
                     .height(height);
                 var $rightTextSpan = $('<span role="radio"></span>')
                     .addClass('slider-toggle-text')
                     .addClass('right')
                     .append($rightP)
                     .height(height);

                 var $ballSpan = $('<span></span>')
                     .addClass('slider-toggle-ball')
                     .height(height - 1)
                     .width(ballWidth);

                 var $frame = $('<div role="radiogroup"></div>')
                     .addClass('slider-toggle-frame')
                     .height(height)
                     .width(width)
                     .append($leftTextSpan)
                     .append($rightTextSpan)
                     .append($ballSpan)
                     .attr('aria-labelledby', $label.attr('id'))
                     .attr('id', $container.attr('id') + '_frame');

                 // make the toggle container an ARIA application if it is not already part of one
                 if ($container.parents('*[role=application]').length == 0) {
                     $container.attr('role', 'application');
                 }

                 $container
                     .height(height)
                     .append($frame);

                 /*
                  functions for toggling the slider left and right
                  */

                 var moveBallRight = function () {
                     $leftRadio.prop('checked', true);
                     $rightRadio.prop('checked', false);
                     $leftTextSpan.attr('aria-checked', 'true').attr('tabindex', tabIndex);
                     $rightTextSpan.attr('aria-checked', 'false').attr('tabindex', -1);
                     $leftP.text(onText);
                     $rightP.text(offText);
                     $leftTextSpan.removeClass('super');
                     $rightTextSpan.addClass('super');
                     $ballSpan.stop().animate({
                         left: ballRight
                     }, speed);
                     $leftTextSpan.stop().animate({
                         width: showWidth
                     }, speed);
                     $rightTextSpan.stop().animate({
                         width: hideWidth
                     }, {
                         duration: speed,
                         done: function () {
                             $rightP.text("");
                         }
                     });
                 };

                 var moveBallLeft = function () {
                     $leftRadio.prop('checked', false);
                     $rightRadio.prop('checked', true);
                     $leftTextSpan.attr('aria-checked', 'false').attr('tabindex', -1);
                     $rightTextSpan.attr('aria-checked', 'true').attr('tabindex', tabIndex);
                     $leftP.text(onText);
                     $rightP.text(offText);
                     $leftTextSpan.addClass('super');
                     $rightTextSpan.removeClass('super');
                     $ballSpan.stop().animate({
                         left: 0
                     }, speed);
                     $rightTextSpan.stop().animate({
                         width: showWidth
                     }, speed);
                     $leftTextSpan.stop().animate({
                         width: hideWidth
                     }, {
                         duration: speed,
                         done: function () {
                             $leftP.text("");
                         }
                     });
                 };

                 /*
                  bind event handling to the slider components
                  */

                 $ballSpan.draggable({
                     containment: "parent",
                     scrollSpeed: speed,
                     drag: function (event, ui) {
                         $leftTextSpan.width(function () {
                             var w = ui.position.left + hideWidth;
                             if (w < width / 2) {
                                 $leftTextSpan.removeClass('super');
                                 $rightTextSpan.addClass('super');
                             } else {
                                 $leftTextSpan.addClass('super');
                                 $rightTextSpan.removeClass('super');
                             }
                             return w;
                         });
                         $rightTextSpan.width(function () {
                             return showWidth - ui.position.left;
                         });
                     },
                     start: function () {
                         $leftP.text(onText);
                         $rightP.text(offText);
                     },
                     stop: function (event, ui) {
                         if (ui.position.left < (width / 2) - (ballWidth / 2)) {
                             moveBallLeft();
                         } else {
                             moveBallRight();
                         }
                     }
                 });

                 $ballSpan.on(
                     "touchstart touchmove touchend touchcancel", function (event) {

                         if (event.originalEvent.touches.length > 1) {
                             return;
                         }

                         event.preventDefault();

                         var touch = event.originalEvent.changedTouches[0],
                             simulatedEvent = document.createEvent('MouseEvents');

                         var simulatedEvent = document.createEvent("MouseEvent");
                         simulatedEvent.initMouseEvent({
                             touchstart: "mousedown",
                             touchmove: "mousemove",
                             touchend: "mouseup"
                         }[event.type], true, true, window, 1,
                         touch.screenX, touch.screenY,
                         touch.clientX, touch.clientY, false,
                         false, false, false, 0, null);

                         event.target.dispatchEvent(simulatedEvent);

                     });

                 $frame.focus(function () {
                     if ($leftRadio.is(':checked')) {
                         $leftTextSpan.focus();
                     } else {
                         $rightTextSpan.focus();
                     }
                 });

                 $frame.keydown(function (e) {

                     if (e.altKey) {
                         return true;
                     }

                     if (e.keyCode == keyCodes.left || e.keyCode == keyCodes.up || e.keyCode == keyCodes.right || e.keyCode == keyCodes.down) {

                         if (e.shiftKey) {
                             // do nothing
                             return true;
                         }
                         if (!$leftRadio.is(':checked')) {
                             moveBallRight();
                             $leftTextSpan.focus();
                         } else {
                             moveBallLeft();
                             $rightTextSpan.focus();
                         }

                         e.preventDefault();
                         e.stopPropagation();
                         return false;

                     } else if (e.keyCode == keyCodes.space || e.keyCode == keyCodes.enter) {
                         $frame.focus();
                         e.preventDefault();
                         e.stopPropagation();
                         return false;
                     }

                     return true;

                 });

                 $frame.click(function () {
                     if (!$leftRadio.is(':checked')) {
                         moveBallRight();
                     } else {
                         moveBallLeft();
                     }
                 });


                 /*
                  initialize the state of the slider
                  */

                 var checked = $container.data('initialvalue') == $leftRadio.val();
                 if (checked) {
                     $leftRadio.prop('checked', true);
                     $leftP.text(onText);
                     $rightP.text("");
                     $leftTextSpan.attr('aria-checked', 'true').attr('tabindex', tabIndex);
                     $leftTextSpan.width(showWidth);
                     $ballSpan.css({
                         left: ballRight
                     });
                 } else {
                     $rightRadio.prop('checked', true);
                     $leftP.text("");
                     $rightP.text(offText);
                     $rightTextSpan.attr('aria-checked', 'true').attr('tabindex', tabIndex);
                     $rightTextSpan.width(showWidth);
                     $ballSpan.css({
                         left: 0
                     });
                 }

             }

         };


         $.fn.sliderToggle = function (options) {

             return this.each(function () {

                 if (!$.data(this, "plugin_" + sliderTogglePluginName)) {
                     $.data(this, "plugin_" + sliderTogglePluginName, new SliderToggle(this, options));
                 }

             });

         };

         $.fn.sliderToggleVal = function () {

             var val = $(this).children(':checked').val();

             if (val === undefined) {
                 val = $(this).data('initialvalue');
             }

             return val;

         };

     })(jQuery);

            jQuery(document).ready(function () {

                jQuery('.slider-toggle-container').sliderToggle();


            });
            // ===================== [ E ] Switch: ===================== //


            $timeout(function () {

                $(document).on("ifChanged", "#filters input", function () {
                    var a = [];
                    $("#filters input").each(function () {
                        $(this).is(":checked") && a.push($(this).attr("name"));
                    }), $.cookie("tlc_mfil", JSON.stringify(a));
                }), $(document).on("click", "#filter_toggle", function () {
                    $("#filters").hasClass("showall") ? ($("#filters").removeClass("showall"), $(this).text("Show more")) : ($("#filters").addClass("showall"),
                      $(this).text("Show less"));
                }), $(document).on("click", "#info-lifestyle a", function () {
                    return $(this).hasClass("active") ? $(this).text("See on map").removeClass("active") : ($("#info-lifestyle a").text("See on map").removeClass("active"),
                      $(this).text("Hide directions").addClass("active")), !1;
                })

            }, 10);


          $("#info").tabs("option", "active", 0);

          $("#info").tabs({
            activate: function (e, ui) {
              $scope.currentTabIndex =ui.newTab.index().toString();       
            }
          });

        }

        $scope.expandAll = function () {
          setTimeout(function () {
            $(".panel-collapse").each(function () {
              if($(this).parent('.panel').find('.listing-info-hidden-class').length == 0) {
                 $(this).parent('.panel').find('.panel-body').html('No data available.');
              }
            });
             }, 600);
            $('#infoDetails .accordion-toggle').addClass('tabSelectClass');
            $scope.toggleOpen(true);
            $('#closeTab').css("display","block");
            $('#openTab').css("display","none");
            $('#infoDetails .glyphicon').removeClass("glyphicon-plus").addClass("glyphicon-minus");
        };

        $scope.collapseAll = function () {
            $('#infoDetails .accordion-toggle').removeClass('tabSelectClass');
            $scope.toggleOpen(false);
            $('#openTab').css("display","block");
            $('#closeTab').css("display","none");
            $('#infoDetails .glyphicon').removeClass("glyphicon-minus").addClass("glyphicon-plus");
        };

        $scope.toggleOpen = function (openAll) {
            $scope.accordion.agentGroupOpen = openAll;
            $scope.accordion.generalGroupOpen = openAll;
            $scope.accordion.taxGroupOpen = openAll;
            $scope.accordion.interiorGroupOpen = openAll;
            $scope.accordion.roomGroupOpen = openAll;
            $scope.accordion.featureGroupOpen = openAll;
            $scope.accordion.remarksGroupOpen = openAll;
            $scope.accordion.exteriorGroupOpen = openAll;
            $scope.accordion.utilitiesGroupOpen = openAll;
            $scope.accordion.waterGroupOpen = openAll;
            $scope.accordion.vacationGroupOpen = openAll;
            $scope.accordion.financeGroupOpen = openAll;
            $scope.accordion.hoaGroupOpen = openAll;
            $scope.accordion.legalGroupOpen = openAll;
            $scope.accordion.propertyGroupOpen = openAll;
            $scope.accordion.soldGroupOpen = openAll;
            $scope.accordion.parkingGroupOpen = openAll;
            $scope.accordion.farmGroupOpen = openAll;
        };

        //added by manish. for image slider
        $scope.prevImage = function () {
            var indexno = $scope.previewUrl.split("=");
            var no = indexno[indexno.length - 1];
            if (no == 0) { no = $scope.Photos.length; }
            no = parseInt(no) - 1;
            $scope.selectPreview($scope.Photos[no]);
        }
        $scope.nextImage = function () {
            var indexno = $scope.previewUrl.split("=");
            var no = indexno[indexno.length - 1];
            if (no == ($scope.Photos.length - 1)) { no = -1; }
            no = parseInt(no) + 1;
            $scope.selectPreview($scope.Photos[no]);
        }
        var imageThumbNo = 0;
        $scope.prev_thumb_slide = function () {
            imageThumbNo--;
            $(".tile-wrapper").each(function () {
                $(this).hide();
            });
            $("#tile-wrapper_" + imageThumbNo).show();
            hideThumbButton();
        }

        $scope.next_thumb_slide = function () {
            imageThumbNo++;
            $(".tile-wrapper").each(function () {
                $(this).hide();
            });
            $("#tile-wrapper_" + imageThumbNo).show();
            hideThumbButton();
        }

        function hideThumbButton() {
           if (imageThumbNo == 0) {
                $(".thumb_slider_arrow").find('li .flex-prev').hide();
                $(".slider_arrow").find('li .flex-prev').hide();
            }
            else {
                $(".thumb_slider_arrow").find('li .flex-prev').show();
                $(".slider_arrow").find('li .flex-prev').show();
            }
            if (imageThumbNo >= ($scope.UlRepeatLengthForDivARR.length - 1)) {
                $(".thumb_slider_arrow").find('li .flex-next').hide();
            }
            else {
                $(".thumb_slider_arrow").find('li .flex-next').show();
            }

            if (imageThumbNo >= ($scope.Photos.length - 1)) {
              $(".slider_arrow").find('li .flex-next').hide();
            }
            else {
              $(".slider_arrow").find('li .flex-next').show();
            }
        }       

        $scope.$on("bookmarkClientSuccess", function (event, client, parent) {
            if (parent == "detail") {
                $scope.Search.client = '';
                aaNotify.success('Property successfully bookmarked.');
            }
        });

        $scope.$on("bookmarkClientError", function (event, client, parent) {
            if (parent == "detail") {
                $scope.Search.client = '';
                console.log("error " + error);
            }
        });

        $scope.sendNoteAndBookmarkClient = function (client) {
            //httpServices.trackGoogleEvent('sendNoteAndBookmarkClient','property-detail');

            var bookamarkDialog = ngDialog.open({
                template: 'views/templates/bookmarkPropertyEmail.html',
                plain: false,
                scope: $scope,
                controller: 'BookmarkPropertyEmailCtrl',
                data: {
                    client: client,
                    parent: "detail",
                    bookmarkProperty: $scope.propertyDetail
                }
            });
        }

        $scope.tlcForClient = function (client) {
            //httpServices.trackGoogleEvent('TLCForClient','property-detail');

            $scope.Search.client = '';

            $scope.Search.TLCType = 'client';

            if (client.Protected) {
              $scope.TLCClient = client;
            }
            else {
                propertiesService.agentClientDetail({ clientId: client.Id, agentId: client.AgentId }
                  , function (success) {
                      if (success != undefined) {
                          $scope.TLCClient = success;

                          $scope.TLCClientInformation();
                      }
                  }, function (error) {
                      console.log("error " + error);
                  });
            }
        }


        $scope.TLCClientInformation = function () {
            var Residence = Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.RentMortgage) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.RentMortgage) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.HomeRentInsurance) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.HomeRentInsurance) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.LawnCare) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.LawnCare) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.Taxes) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.Taxes) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.Electricity) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.Electricity) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.Gas) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.Gas) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.WaterAndSewer) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.WaterAndSewer) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.WasteRemoval) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.WasteRemoval) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.MaintenanceOrRepair) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.MaintenanceOrRepair) +
              Number(isNaN($scope.TLCClient.Profile.CurrentResidenceData.Other) ? 0 : $scope.TLCClient.Profile.CurrentResidenceData.Other);

            var Commute = 0;
            _.each($scope.TLCClient.Profile.CommuteData.CommuteDetail, function (CommuteDetail) {
                Commute += Number(isNaN(CommuteDetail.CarInsurancePayment) ? 0 : CommuteDetail.CarInsurancePayment) +
                Number(isNaN(CommuteDetail.CarMaintenancePayment) ? 0 : CommuteDetail.CarMaintenancePayment) +
                Number(isNaN(CommuteDetail.GasCost) ? 0 : CommuteDetail.GasCost) +
                Number(isNaN(CommuteDetail.ParkingCost) ? 0 : CommuteDetail.ParkingCost) +
                Number(isNaN(CommuteDetail.TollCost) ? 0 : CommuteDetail.TollCost);
            });

            var Income = 0;
            _.each($scope.TLCClient.Profile.IncomeData.IncomeDetail, function (IncomeDetail) {
                Income += Number(isNaN(IncomeDetail.NetPay) ? 0 : IncomeDetail.NetPay);
            });

            var Food = Number(isNaN($scope.TLCClient.Profile.FinancialData.FoodGroceries) ? 0 : $scope.TLCClient.Profile.FinancialData.FoodGroceries) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.FoodDiningOut) ? 0 : $scope.TLCClient.Profile.FinancialData.FoodDiningOut) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.FoodOther) ? 0 : $scope.TLCClient.Profile.FinancialData.FoodOther);

            var PersonalCare = Number(isNaN($scope.TLCClient.Profile.FinancialData.PersonalCareMedical) ? 0 : $scope.TLCClient.Profile.FinancialData.PersonalCareMedical) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.PersonalCareHairNail) ? 0 : $scope.TLCClient.Profile.FinancialData.PersonalCareHairNail) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.PersonalCareClothing) ? 0 : $scope.TLCClient.Profile.FinancialData.PersonalCareClothing) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.PersonalCareDryCleaning) ? 0 : $scope.TLCClient.Profile.FinancialData.PersonalCareDryCleaning) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.PersonalCareHealthClub) ? 0 : $scope.TLCClient.Profile.FinancialData.PersonalCareHealthClub) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.PersonalCareOrganizationDuesOrFees) ? 0 : $scope.TLCClient.Profile.FinancialData.PersonalCareOrganizationDuesOrFees) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.PersonalCareOther) ? 0 : $scope.TLCClient.Profile.FinancialData.PersonalCareOther);

            var Insurance = Number(isNaN($scope.TLCClient.Profile.FinancialData.InsuranceHealth) ? 0 : $scope.TLCClient.Profile.FinancialData.InsuranceHealth) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.InsuranceLife) ? 0 : $scope.TLCClient.Profile.FinancialData.InsuranceLife) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.InsuranceOther) ? 0 : $scope.TLCClient.Profile.FinancialData.InsuranceOther);           

            var Donation = Number(isNaN($scope.TLCClient.Profile.FinancialData.DonationCharity) ? 0 : $scope.TLCClient.Profile.FinancialData.DonationCharity);

            var Legal = Number(isNaN($scope.TLCClient.Profile.FinancialData.LegalAttorney) ? 0 : $scope.TLCClient.Profile.FinancialData.LegalAttorney) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.LegalAlimony) ? 0 : $scope.TLCClient.Profile.FinancialData.LegalAlimony) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.LegalPaymentOnLienOrJudgement) ? 0 : $scope.TLCClient.Profile.FinancialData.LegalPaymentOnLienOrJudgement) +
              Number(isNaN($scope.TLCClient.Profile.FinancialData.LegalOther) ? 0 : $scope.TLCClient.Profile.FinancialData.LegalOther);

            var Expenses = Food + PersonalCare + Insurance /*+ Transportation*/ + Donation + Legal;

            var Entertainment = Number(isNaN($scope.TLCClient.Profile.EntertainmentData.Internet) ? 0 : $scope.TLCClient.Profile.EntertainmentData.Internet) +
                Number(isNaN($scope.TLCClient.Profile.EntertainmentData.TVCharges) ? 0 : $scope.TLCClient.Profile.EntertainmentData.TVCharges) +
                Number(isNaN($scope.TLCClient.Profile.EntertainmentData.Cell) ? 0 : $scope.TLCClient.Profile.EntertainmentData.Cell) +
                Number(isNaN($scope.TLCClient.Profile.EntertainmentData.Phone) ? 0 : $scope.TLCClient.Profile.EntertainmentData.Phone)
            /* + Number(isNaN($scope.TLCClient.Profile.EntertainmentData.Other) ? 0 : $scope.TLCClient.Profile.EntertainmentData.Other)*/;

            if ($scope.TLCClient.Profile.EntertainmentData.Other != null) {
              _.each($scope.TLCClient.Profile.EntertainmentData.Other.OtherDetail, function (other) {
                Entertainment += Number(isNaN(other.Amount) ? 0 : other.Amount);
              });
            }

            var Debt = 0;
            if ($scope.TLCClient.Profile.DebtData.DebtDetail != null) {
                _.each($scope.TLCClient.Profile.DebtData.DebtDetail, function (debt) {
                    Debt += Number(isNaN(debt.MonthlyPayment) ? 0 : debt.MonthlyPayment);
                });
            }

            var DaycareCost = 0;
            if ($scope.TLCClient.Profile.BasicData.ChildDetail != null) {
                _.each($scope.TLCClient.Profile.BasicData.ChildDetail, function (o) {
                    DaycareCost += Number(isNaN(o.DaycareCost) ? 0 : o.DaycareCost);
                });
            }

            $scope.TLCClient.IncomeTotal = Income;
            $scope.TLCClient.ExpensesTotal = Expenses;
            $scope.TLCClient.EntertainmentTotal = Entertainment;
            $scope.TLCClient.CommuteCostTotal = Commute;
            $scope.TLCClient.Residence = Residence;
            $scope.TLCClient.DaycareCost = DaycareCost;
            $scope.TLCClient.Debt = Debt;

            var Total = /*Income +*/ Expenses + Entertainment + Commute + Residence + DaycareCost + Debt;
            $scope.showChartFinancial = Total > 0;

            $scope.chartFinancialGraphs.title.text = 'TLC' + '<br/>' + $filter('currencyNoDecimal')(Total);

            var data = [
              {
                  name: 'Debt',
                  y: $scope.TLCClient.Debt
              },
              {
                  name: 'Expenses',
                  y: $scope.TLCClient.ExpensesTotal
              }, {
                  name: 'Entertainment',
                  y: $scope.TLCClient.EntertainmentTotal
              },
              {
                  name: 'Commute Cost',
                  y: $scope.TLCClient.CommuteCostTotal
              },
              {
                  name: 'Residence',
                  y: $scope.TLCClient.Residence,
                  visible: Debt > 0 ? true : false
              },
              {
                  name: 'Day care Cost',
                  y: $scope.TLCClient.DaycareCost,
                  visible: DaycareCost > 0 ? true : false
              }];

            $scope.chartFinancialGraphs.series[0].data = data;

            $timeout(function () {
                $('#circleForPropDetail').progressCircle({
                    nPercent: Number($scope.TLCClient.SupportingInformation.ProfileCompletionPercentage)
                });
            }, 100);
        }

        $scope.setPoisMap = function (type,eventTrack) {
            var mapText = type.text;
            if (mapText == "City/town halls") {
                mapText = "City town halls";
            }
          if($scope.pois === undefined) {
            $scope.getPOIS();
          }
          var _waitCount = 0;
          var waitForPOIs = function() {
            if ($scope.pois === undefined && _waitCount < 100) {
              _waitCount++;
              $timeout(waitForPOIs, 100);
            } else {
              if ($scope.pois != undefined && $scope.pois[mapText] != undefined) {
                if (eventTrack) {
                  //httpServices.trackGoogleEvent('POI-' + (type.checked ? 'Add-' : 'Remove-') + mapText, 'property-detail');
                }
                var args = $scope.pois[mapText];
                var data = {}
                data.isAdd = type.checked
                data.pins = args;
                $scope.setPoisMap1(data);
               //$rootScope.$broadcast('setPoisMap', {isAdd: type.checked, pins: $scope.pois[mapText]});
                $("a.poiIcon").each(function () {
                  $(this).attr("id", "null");
                  if (!$(this).hasClass('TempMapFilter')) {
                    $(this).click(function () {
                      $(this).toggleClass('HideTXT');
                    });
                    $(this).addClass('TempMapFilter');
                  }
                });
              }
            }
          }
          waitForPOIs();
        }

      $scope.GetDownPaymentPercentages = function()
      {
        /*var uniqueList = _.uniq($scope.mortgageDetail.TLCInfo, function(item, key, DownPaymentPercentage) {
          return item.DownPaymentPercentage;
        });*/

        var DownPaymentPercentages = [];
        angular.forEach($scope.mortgageDetail.TLCInfo,function(obj){
          //if(!$.inArray(obj.DownPaymentPercentage, DownPaymentPercentages))
          if(_.contains(DownPaymentPercentages,obj.DownPaymentPercentage) == false)
            DownPaymentPercentages.push(obj.DownPaymentPercentage);
        });

        $scope.DownPaymentPercentages = DownPaymentPercentages;

        if($scope.mortgageDetail.Input != undefined) {
          $scope.TLCLoanType = $scope.mortgageDetail.Input.LoanType || null;
          $scope.TLCDownPayment = $scope.mortgageDetail.Input.DownPercentage;// || '20';
        }
        else
        {
          $scope.TLCLoanType = null;
          $scope.TLCDownPayment = '20';
        }

        $scope.changeMortgageYear();
      }
      $scope.isOpenDD = false;
      $scope.isdpDD = false;
      $scope.openDD = function(ddName){
        if(ddName == "dpDD"){
          $scope.isdpDD = !$scope.isdpDD;
          $scope.isOpenDD = false;
        }else{
          $scope.isOpenDD = !$scope.isOpenDD;
          $scope.isdpDD = false;
        }
      }
      $scope.changeTLCLoanType = function (LoanType) {
        $scope.TLCLoanType = LoanType;
        $scope.changeMortgageYear(true);
        $scope.isOpenDD = false;
      }

      $scope.changeTLCDownPayment = function (DownPayment) {
        $scope.TLCLoanType = null;
        $scope.TLCDownPayment = DownPayment;
        $scope.changeMortgageYear(true);
        $scope.isdpDD = false;
      }

        $scope.changeMortgageYear = function (eventTrack) {
            if (eventTrack) {
              //httpServices.trackGoogleEvent('ChangeMortgageYear','property-detail');
            }

            $("#info-calculator").addClass("results"), $("#tlcinfo").tabs({
                activate: function (a, b) {
                    "tlcinfo-commute" == b.newPanel.attr("id");
                }
            }), $("#info-calculator").addClass("results");

            var LoanTypes = _.filter($scope.mortgageDetail.TLCInfo,function(o){return o.DownPaymentPercentage == $scope.TLCDownPayment});

            if(LoanTypes.length == 0)
            {
              $scope.TLCDownPayment = $scope.mortgageDetail.TLCInfo[0].DownPaymentPercentage;
               LoanTypes = _.filter($scope.mortgageDetail.TLCInfo,function(o){return o.DownPaymentPercentage == $scope.TLCDownPayment});
            }
            $scope.LoanTypes = _.chain(LoanTypes).each(function (o) {o.LoanTypeYear = parseInt(o.LoanType)}).sortBy('LoanTypeYear').reverse().value();
            
            if($scope.TLCLoanType == null)
            {
              $scope.TLCLoanType = $scope.LoanTypes[0].LoanType;
            }

            var calcDetail = _.find($scope.LoanTypes,function(o){return o.LoanType == $scope.TLCLoanType && o.DownPaymentPercentage == $scope.TLCDownPayment});

            if(calcDetail == null)
            {
              $scope.TLCLoanType = $scope.TLCLoanType.replace("Fixed","") + "Jumbo";
              calcDetail = _.find($scope.LoanTypes,function(o){return o.LoanType == $scope.TLCLoanType && o.DownPaymentPercentage == $scope.TLCDownPayment});
            }

            if(calcDetail == null)
            {
              $scope.TLCLoanType = $scope.LoanTypes[0].LoanType;
              calcDetail = _.find($scope.LoanTypes,function(o){return o.LoanType == $scope.TLCLoanType && o.DownPaymentPercentage == $scope.TLCDownPayment});
            }

            $scope.calcDetail = calcDetail;
            $scope.changetlcOnOff();

            //$scope.PaymentBreakdownGraph();

          $scope.changeLineGraphs();
          $scope.calculateClosingCost();
        }

        $scope.newClient = function () {
            //httpServices.trackGoogleEvent('NewClient','property-detail');

            $state.go('tlc.newClient');
        }

        $scope.changetlcOnOff = function (type) {
            if (type == 'CommuteCost') {
                $scope.tlcOnOff.CommuteGasCost = $scope.tlcOnOff.CommuteParkingCost = $scope.tlcOnOff.CommuteTollCost
                    = $scope.tlcOnOff.CommuteTransitCost = $scope.tlcOnOff.CarMaintenance = $scope.tlcOnOff.CarInsurance = $scope.tlcOnOff.CommuteCost;
            }
            else if (type == 'Utilities') {
                $scope.tlcOnOff.HeatingCoolingCost = $scope.tlcOnOff.WaterSewerCharge = $scope.tlcOnOff.GarbageCost = $scope.tlcOnOff.LawnSnowCare = $scope.tlcOnOff.OtherUtilitiesCost = $scope.tlcOnOff.Utilities;
            }
            else if (type == 'Entertainment') {
                $scope.tlcOnOff.PhoneCharge = $scope.tlcOnOff.InternetCharge = $scope.tlcOnOff.TelevisionCharge = $scope.tlcOnOff.CellPhoneCharge = $scope.tlcOnOff.OtherCharge = $scope.tlcOnOff.Entertainment;
            }

            if ($scope.tlcOnOff.CommuteGasCost == true && $scope.tlcOnOff.CommuteParkingCost == true && $scope.tlcOnOff.CommuteTollCost == true
              && $scope.tlcOnOff.CommuteTransitCost == true && $scope.tlcOnOff.CarMaintenance == true && $scope.tlcOnOff.CarInsurance == true) {
                $scope.tlcOnOff.CommuteCost = true;
            }
            else {
                $scope.tlcOnOff.CommuteCost = false;
            }

            if ($scope.tlcOnOff.HeatingCoolingCost == true && $scope.tlcOnOff.WaterSewerCharge == true && $scope.tlcOnOff.GarbageCost == true &&
              $scope.tlcOnOff.LawnSnowCare == true && $scope.tlcOnOff.OtherUtilitiesCost == true) {
                $scope.tlcOnOff.Utilities = true;
            }
            else {
                $scope.tlcOnOff.Utilities = false;
            }

            if ($scope.tlcOnOff.PhoneCharge == true && $scope.tlcOnOff.InternetCharge == true && $scope.tlcOnOff.TelevisionCharge == true &&
              $scope.tlcOnOff.CellPhoneCharge == true && $scope.tlcOnOff.OtherCharge == true) {
                $scope.tlcOnOff.Entertainment = true;
            }
            else {
                $scope.tlcOnOff.Entertainment = false;
            }

            var b = $scope.calcDetail;

            var CalculatedTLC = b.TLC;

          b.CommuteGasCostNew = b.CommuteGasCostNew != null && b.CommuteGasCostNew >= 0 ? b.CommuteGasCostNew : b.CommuteGasCost;
          b.CommuteParkingCostNew = b.CommuteParkingCostNew != null && b.CommuteParkingCostNew >= 0 ? b.CommuteParkingCostNew : b.CommuteParkingCost;
          b.CommuteTollCostNew = b.CommuteTollCostNew != null && b.CommuteTollCostNew >= 0 ? b.CommuteTollCostNew : b.CommuteTollCost;
          b.TransitCostNew = b.TransitCostNew != null && b.TransitCostNew >= 0 ? b.TransitCostNew : b.TransitCost;
          b.CarMaintenanceNew = b.CarMaintenanceNew != null && b.CarMaintenanceNew >= 0 ? b.CarMaintenanceNew : b.CarMaintenance;
          b.CarInsuranceNew = b.CarInsuranceNew != null && b.CarInsuranceNew >= 0 ? b.CarInsuranceNew : b.CarInsurance;
          b.HeatingCoolingCostNew = b.HeatingCoolingCostNew != null && b.HeatingCoolingCostNew >= 0 ? b.HeatingCoolingCostNew : b.HeatingCoolingCost;
          b.WaterSewerChargeNew = b.WaterSewerChargeNew != null && b.WaterSewerChargeNew >= 0 ? b.WaterSewerChargeNew : b.WaterSewerCharge;
          b.GarbageCostNew = b.GarbageCostNew != null && b.GarbageCostNew >= 0 ? b.GarbageCostNew : b.GarbageCost;
          b.LawnSnowCareNew = b.LawnSnowCareNew != null && b.LawnSnowCareNew >= 0 ? b.LawnSnowCareNew : b.LawnSnowCare;
          b.OtherUtilitiesCostNew = b.OtherUtilitiesCostNew != null && b.OtherUtilitiesCostNew >= 0 ? b.OtherUtilitiesCostNew : b.OtherUtilitiesCost;
          b.PhoneChargeNew = b.PhoneChargeNew != null && b.PhoneChargeNew >= 0 ? b.PhoneChargeNew : b.PhoneCharge;
          b.InternetChargeNew = b.InternetChargeNew != null && b.InternetChargeNew >= 0 ? b.InternetChargeNew : b.InternetCharge;
          b.TelevisionChargeNew = b.TelevisionChargeNew != null && b.TelevisionChargeNew >= 0 ? b.TelevisionChargeNew : b.TelevisionCharge;
          b.CellPhoneChargeNew = b.CellPhoneChargeNew != null && b.CellPhoneChargeNew >= 0 ? b.CellPhoneChargeNew : b.CellPhoneCharge;
          b.OtherChargeNew = b.OtherChargeNew != null && b.OtherChargeNew >= 0 ? b.OtherChargeNew : b.OtherCharge;



            var CommutePayment = b.CommuteGasCostNew + b.CommuteParkingCostNew + b.CommuteTollCostNew + b.TransitCostNew + b.CarMaintenanceNew + b.CarInsuranceNew;//b.CommuteCost + b.CarMaintenance + b.CarInsurance;
            var Utilities = b.HeatingCoolingCostNew + b.WaterSewerChargeNew + b.GarbageCostNew + b.LawnSnowCareNew + b.OtherUtilitiesCostNew;//b.Utilities;
            var Entertainment = b.PhoneChargeNew + b.InternetChargeNew + b.TelevisionChargeNew + b.CellPhoneChargeNew + b.OtherChargeNew; //b.Entertainment;

            /*if($scope.tlcOnOff.CommuteCost == false) {
              CalculatedTLC -= b.CommuteCost;
              CommutePayment -= b.CommuteCost;
            }*/
            if ($scope.tlcOnOff.CommuteGasCost == false) {
                CalculatedTLC -= b.CommuteGasCostNew;
                CommutePayment -= b.CommuteGasCostNew;
            }
            if ($scope.tlcOnOff.CommuteParkingCost == false) {
                CalculatedTLC -= b.CommuteParkingCostNew;
                CommutePayment -= b.CommuteParkingCostNew;
            }
            if ($scope.tlcOnOff.CommuteTollCost == false) {
                CalculatedTLC -= b.CommuteTollCostNew;
                CommutePayment -= b.CommuteTollCostNew;
            }

            if ($scope.tlcOnOff.CommuteTransitCost == false) {
                CalculatedTLC -= b.TransitCostNew;
                CommutePayment -= b.TransitCostNew;
            }

            if ($scope.tlcOnOff.CarMaintenance == false) {
                CalculatedTLC -= b.CarMaintenanceNew;
                CommutePayment -= b.CarMaintenanceNew;
            }
            if ($scope.tlcOnOff.CarInsurance == false) {
                CalculatedTLC -= b.CarInsuranceNew;
                CommutePayment -= b.CarInsuranceNew;
            }

            b.CommutePaymentTotal = CommutePayment;
            /*if($scope.tlcOnOff.Utilities == false) {
              CalculatedTLC -= b.Utilities;
              Utilities -= b.Utilities;
            }*/
            if ($scope.tlcOnOff.HeatingCoolingCost == false) {
                CalculatedTLC -= b.HeatingCoolingCostNew;
                Utilities -= b.HeatingCoolingCostNew;
            }
            if ($scope.tlcOnOff.WaterSewerCharge == false) {
                CalculatedTLC -= b.WaterSewerChargeNew;
                Utilities -= b.WaterSewerChargeNew;
            }
            if ($scope.tlcOnOff.GarbageCost == false) {
                CalculatedTLC -= b.GarbageCostNew;
                Utilities -= b.GarbageCostNew;
            }
            if ($scope.tlcOnOff.LawnSnowCare == false) {
                CalculatedTLC -= b.LawnSnowCareNew;
                Utilities -= b.LawnSnowCareNew;
            }
            if($scope.tlcOnOff.OtherUtilitiesCost == false) {
              CalculatedTLC -= b.OtherUtilitiesCostNew;
              Utilities -= b.OtherUtilitiesCostNew;
            }
            b.UtilitiesTotal = Utilities;

            /*if($scope.tlcOnOff.Entertainment == false) {
              CalculatedTLC -= b.Entertainment;
              Entertainment -= b.Entertainment;
            }*/

            if ($scope.tlcOnOff.PhoneCharge == false) {
                CalculatedTLC -= b.PhoneChargeNew;
                Entertainment -= b.PhoneChargeNew;
            }
            if ($scope.tlcOnOff.InternetCharge == false) {
                CalculatedTLC -= b.InternetChargeNew;
                Entertainment -= b.InternetChargeNew;
            }
            if ($scope.tlcOnOff.TelevisionCharge == false) {
                CalculatedTLC -= b.TelevisionChargeNew;
                Entertainment -= b.TelevisionChargeNew;
            }
            if ($scope.tlcOnOff.CellPhoneCharge == false) {
                CalculatedTLC -= b.CellPhoneChargeNew;
                Entertainment -= b.CellPhoneChargeNew;
            }
            if($scope.tlcOnOff.OtherCharge == false) {
              CalculatedTLC -= b.OtherChargeNew;
              Entertainment -= b.OtherChargeNew;
            }
            b.EntertainmentTotal = Entertainment;

            var CalculatedSavings = b.Savings;
            if($scope.tlcOnOff.Custom == false)
            {
              CalculatedTLC -= b.CustomCost;
              CalculatedSavings += b.CustomCost;
            }

            var Daycare = b.Daycare;
            if($scope.tlcOnOff.Daycare == false)
            {
              CalculatedTLC -= b.Daycare;
              CalculatedSavings += b.Daycare;
            }

            //b.CalculatedTLC = CalculatedTLC;
            $scope.CalculatedTLC = CalculatedTLC;
            $rootScope.CalculatedTLC = CalculatedTLC;
            $scope.CalculatedSavings = CalculatedSavings;

            var MortagageTaxes = b.MortgagePayment + b.SecondMortgagePayment + b.PropertyTax + b.Pmi20Rate + b.HOAFees;
            var HomeInsurance = b.HomeInsurance;
            var Debt = b.MonthlyDebt ? b.MonthlyDebt : 0;
            //var CarInsurance = b.CarInsurance;
            //var CarMaintenance = b.CarMaintenance;
            //var AssociationFees = b.AssociationFees;
            var FinancialCost = b.FinancialCost;

            var data = [["Mortagage & Taxes", MortagageTaxes],
              ["Home insurance", HomeInsurance],
              ["Utilities", Utilities],
              ["Commute", CommutePayment],
              ["Entertainment", Entertainment],
              //["Debt", Debt],
              ["Day care Cost", Daycare],
              ["Other Financial Cost", FinancialCost]];
            //["Car Insurance", CarInsurance],
            //["Car Maintenance", CarMaintenance]];

            $scope.chartMortgageGraphs.title.text = 'TLC' + '<br/>' + $filter('currencyNoDecimal')(MortagageTaxes + HomeInsurance + Utilities +
                                            CommutePayment + Entertainment + Daycare + FinancialCost/*+ CarInsurance + CarMaintenance*/);
            $scope.chartMortgageGraphs.series[0].data = data;

          $scope.IsChangedEditTLC = $scope.changedEditTLC();
        }



        jQuery(document).ready(function () {
          $("#proplistpage").css({'top':'','height':'','overflow-y':''});
          $("#content").addClass("PropDetailPage");
          $(".mapList-toggle").hide();
          $("#map").addClass("PropDetailMap");
            $timeout(function () {
                $('.title-tipso').tipso();
              $("#content").removeClass("property_list");

                $(":radio[name=TransportationType]").change(function () {
                    $(":radio[name=TransportationType]").each(function () {
                        $(this).next('i').removeClass('checked');
                    });
                    $(this).next('i').addClass('checked');
                });
                $("#calc_secondcommute").change(function () {
                    if ($(this).next('i').hasClass('checked')) {
                        $scope.IsSecondCommute = true;
                    }
                    else {
                        $scope.IsSecondCommute = false;
                    }
                });
                
                $("#lifeStylePropDetail").addClass('active');

            }, 2000);

            $(window).resize();
            $("#tlcinfo ul li").click(function () {
                $(window).resize();
            });
          $("#tlc_details li span").on('click',function(){

            $(this).addClass('edit');
            $('.form-control',this).focus();
          });

          $(document).on("blur", "#tlc_details li span .form-control", function () {
            $(this).parents('span').removeClass('edit');
          });

          $timeout(function () {
            $('.title-tipso').tipso();
          }, 1000);
        });

        $scope.filterText = function (text) {
            if (text != undefined)
                return text.replace('&ordm;', '&deg;');
        }        

        $scope.setNextPreProperty = function (ListingId) {

            //httpServices.trackGoogleEvent('NextPreProperty','property-detail');

            if (ListingId > 0) {
                if ($state.current.name.indexOf("tlc.clientSummary") > -1) {
                    $state.go('tlc.clientSummary.propertydetail', { listingId: ListingId });
                }
                else {
                    $state.go('tlc.search.propertydetail', { listingId: ListingId });
                }
            }            
        }

        $scope.closeBookmarkwindow = function() {
            $('#AddMozaicBookmarkModal').modal('hide');
        }

        $scope.addClientFavoriteDetailPage = function (mlsNumber) {
          $scope.trackGA('Clicked Add Favorite','Listing Detail page', $scope.propertyDetail.LISTINGID, 'Add Favorite');
          var propertyDetail = {};
          propertyDetail = {
            "Id" : $stateParams.listingId,
            "MN" : mlsNumber
          };
          
          //e.stopPropagation();
          $scope.$emit("CallOpenMozaicFavoritePopup", propertyDetail);
        }

        /* send the server call for remove from favorite for client MT-559*/
        $scope.removeClientFavoriteDetailPage = function (e) {
          e.stopPropagation();
          $scope.removeClientFavoritePropertyEvent()(propertyDetail);
          removefavorite($stateParams.listingId);
        }

        $scope.openBookmarkWindow = function(listing_id) {
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
                    var parsedSuccess = JSON.parse(success.Id);                  
                    if(parsedSuccess["response_code"] == 200) {
                      $scope.mozaic_projectID = parsedSuccess["show_favorites"]["favorite_list"][0]["projectId"];
                      $scope.mozaic_userId = parsedSuccess["show_favorites"]["loggedin_user"]["userId"];
                      $scope.favorites = [{
                        favorite: parsedSuccess["notification_setting"]
                      },{
                        favorite: parsedSuccess["notification_event"][0]["value"]
                      }, {
                        favorite: parsedSuccess["notification_event"][1]["value"]
                      }, {
                        favorite: parsedSuccess["notification_event"][2]["value"]
                      }];

                      $rootScope.$broadcast('myFavorites', $scope.favorites);
                    }
                  $scope.mozaic_listingId = listing_id;
                }, function (error) {
                    //aaNotify.info("Listing is added to Mozaic successfully!", { ttl: 5000 });
                    console.log("error " + error);
                });
            }
        }

        $scope.showBookmarks = function(listing_id) {

        }

        $scope.setBookmark = function() {

        }        

        $scope.checkNextPreProperty = function () {
            $scope.preListingId = $scope.nextListingId = 0;
            var properties = [];

            if ($state.current.name.indexOf("tlc.clientSummary") > -1 && $scope.Listings) {
                properties = _.chain($scope.Listings).pluck('ListingId').sortBy(function (o) {
                    return o
                }).value();
            }
            else if ($scope.page && $scope.page.results) {
                properties = _.chain($scope.page.results).pluck('ListingId').sortBy(function (o) {
                    return o
                }).value();
            }

            var index = _.indexOf(properties, Number($stateParams.listingId));

            if (index > -1) {
                $scope.nextListingId = index != properties.length - 1 ? properties[index + 1] : 0;
                $scope.preListingId = index > 0 ? properties[index - 1] : 0;
            }
        }

        $scope.mapCommuteInfo = function (type) {
          if(!$(".aa-notification").is(':visible')){
            var destination = "";
           if($scope.mortgageDetail.Input != null && $scope.mortgageDetail.Input.WorkAddressList != null && $scope.mortgageDetail.Input.WorkAddressList.length > 0)
           {
             destination = $scope.mortgageDetail.Input.WorkAddressList[0].WorkAddress;
           }
           else if($scope.calculatorWorkAddress && $scope.calculatorWorkAddress != '')
           {
             destination = $scope.calculatorWorkAddress;
           }
           else
           {
             aaNotify.danger("Please enter work address.",{
              showClose: true,                            //close button
              iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
              allowHtml: true,                            //allows HTML in the message to render as HTML
              ttl: 1000 * 3                               //time to live in ms
           });          
             return false;
           }

            //httpServices.trackGoogleEvent(type + '-mapCommuteInfo','property-detail');

            var origin = $scope.calcDetail.StreetAddress + ' ' + $scope.calcDetail.City + ', ' + $scope.calcDetail.State + ', ' + $scope.calcDetail.PostalCode;

            $rootScope.$broadcast('setCommuteInfoMap', { type: type, origin: origin, destination: destination });
          }
        }

        $scope.changeIncludeSecondCommute = function () {
          var settings = applicationFactory.getSettings();
            if ($scope.calculator.IncludeSecondCommute && $scope.calculator.WorkAddressList.length == 1) {
                $scope.calculator.WorkAddressList.push({ TransportationType: 'car',WorkAddress:settings.DefaultWorkAddress });
            }
            else if ($scope.calculator.WorkAddressList.length == 2) {
                $scope.calculator.WorkAddressList.splice(1, 1);
            }
            $timeout(function () {
                $('.title-tipso').tipso();
            }, 1000);

        }

        $scope.changeLineGraphs = function () {
          var categories = [];

            var seriesData = [];
            var i = 0;

            _.each($scope.mortgageDetail.TLCInfo, function (o) {
              if(o.DownPaymentPercentage == $scope.TLCDownPayment) {
                //categories.push(o.LoanTypeDisplay + '- ' + o.DownPaymentPercentage + ' Down %');
                categories.push(o.LoanTypeDisplay);
                if (i == 0) {
                  seriesData.push({name: 'Mortgage Payment', data: []});

                  seriesData.push({name: 'Total monthly TLC', data: []});

                  if (typeof o.Savings != 'undefined')
                    seriesData.push({name: 'Monthly Saving', data: []});

                  if (typeof o.EstimatedTaxAdjustment != 'undefined')
                    seriesData.push({name: 'Yearly Estimated Tax Adjustment', data: []});
                }
                i += 1;

                seriesData[0].data.push(o.PITI);

                seriesData[1].data.push(o.TLC);

                if (typeof o.Savings != 'undefined')
                  seriesData[2].data.push(o.Savings || 0);

                if (typeof o.EstimatedTaxAdjustment != 'undefined')
                  seriesData[3].data.push((o.EstimatedTaxAdjustment || 0) * 12);
              }
            });

            $scope.chartLineGraphs.xAxis.categories = categories;
            $scope.chartLineGraphs.series = seriesData;

        }

        $scope.chartLineGraphs = {
            chart: {
                borderWidth: 1,
                marginLeft: 2
            },
            options: {
                chart: {
                    type: 'column',
                    /*options3d: {
                      enabled: true,
                      alpha: 10,
                      beta: 10,
                      depth: 50,
                      viewDistance: 25
                    }*/
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br>' + this.x + ': ' + $filter('currencyNoDecimal')(this.y);
                }
            },
            legend: {
                /*align: 'left',
                layout: 'vertical',
                verticalAlign: 'top',
                x: 40,
                y: 0*/
                /* layout: 'vertical',
                 align: 'right',
                 verticalAlign: 'top',
                 x: -40,
                 y: 100,
                 floating: true,
                 borderWidth: 1,
                 backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),*/
                //shadow: true
            },
            xAxis: {
                categories: [],
                crosshair: true,
                title: {
                    text: null
                },
                labels: {
                    //staggerLines : 1,
                    /*formatter: function () {
                      var text = this.value,
                        formatted = text.length > 25 ? text.substring(0, 25) + '...' : text;

                      return '<div class="js-ellipse" style="width:150px; overflow:hidden" title="' + text + '">' + formatted + '</div>';
                    },
                    style: {
                      width: '50px'
                    },*/
                    //useHTML: true
                }
            },
            yAxis: {
                title: {
                    text: 'Amount'
                },
                min: 0
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
                /*bar: {
                  dataLabels: {
                    enabled: false
                  },
                  style: {
                    fontWeight:'bold',
                    textShadow: ""
                  }
                }*/
            },
            series: [],
            colors: ["#f7a35c", "#90ed7d", "#434348", "#7cb5ec"],
            //colors: ["#7cb5ec","#434348","#90ed7d","#f7a35c","#8085e9","#f15c80","#e4d354","#2b908f","#f45b5b","#91e8e1"],
            //size: {
            //    width: 400,
            //    height: 300
            //},
            exporting: {
                enabled: false
            }
        }

        $scope.chartFinancialGraphs = {
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0
            },
            title: {
                text: '',
                align: 'center',
                verticalAlign: 'middle',
                y: 0
            },
            subtitle: {
                text: ''
            },
            tooltip: {
                formatter: function () {
                    return this.point.name + ': ' + $filter('currency')(this.y) + ' (' + $filter('number')(this.percentage, 1) + '%)';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        distance: -30,
                        color: '#000000',
                        style: {
                            fontWeight: 'bold',
                            textShadow: ""
                        },
                        connectorColor: '#000000',
                        //useHTML:true,
                        /*rotation : 15,
                         formatter: function () {
                         return '<b>' + this.point.name + '</b>' + ': ' + $filter('currencyNoDecimal')(this.y);
                         }*/
                        formatter: function () {
                            if (this.percentage != 0) return Math.round(this.percentage) + '%';
                        }
                    },
                    shadow: false,
                    center: ['50%', '50%'],
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '',
                innerSize: '65%',
                size: '100%',
            }],
            colors: ["#F48384", "#00C38A", "#3E4651", "#7cb5ec", "#90ed7d", "#ff0066", "#eeaaee",
              "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
            //size: {
            //    width: 400,
            //    height: 300
            //},
            exporting: {
                enabled: false
            }
        }

        $scope.urlPath = function () {
          return {'background-image':'url(' + $scope.previewUrl + ')'};
        }

        $("#prpertyFoundList").hide();
        $("#bookmarkprpertyFoundList").hide();
        $("ul#results").hide();
        $("#results").css('margin-top', '0');

        $(".propDetail").click(function () {
            $rootScope.$broadcast("clickOnPropDetailMapIcon");
        });

        $("#lifeStylePropDetail").click(function () {
          $timeout(function(){
          $('.title-tipso').tipso();
          },10);
            $(this).addClass('active');
            $(".PropDetailSearchClient").removeClass('active');
            $(".propDetailClientList").removeClass('active');
            $("#lifeStyleClientDetail").removeClass('active');
        });

        $("#lifeStyleClientDetail").click(function () {
            $(this).addClass('active');
            $("#lifeStylePropDetail").removeClass('active');
        });

        $(".propDetailClientList").mouseover(function () {
            $(this).addClass('active');
            $("#lifeStylePropDetail").removeClass('active');
        });

        $scope.trackGA = function(eventName, category, value, label) {
          httpServices.trackGoogleEvent(eventName, category, value, label);
        }

        $scope.showPhotoGallery = function (e) {
            //httpServices.trackGoogleEvent('ShowPhotoGallery','property-detail');
            $scope._listtrac_trackEvent(_eventType.gallery);
            $scope.IsshowPhotoGallery = true;            
            $("#profile,#actions,#back,#displayPropertySlider").hide();

            var url = e;
            var urlImageNo = e.split("Number=")[1];
            urlImageNo = parseInt(urlImageNo);

            $timeout(function () {
              $('#carousel').flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: true,
                    slideshow: false,
                    itemWidth: 38,
                    itemMargin: 5,
                    startAt: urlImageNo,
                    asNavFor: '#slider',
                });

                $('#slider').flexslider({
                    animation: "slide",
                    prevText: "",
                    nextText: "",
                    controlNav: false,
                    animationLoop: true,
                    slideshow: false,
                    sync: "#carousel",
                    startAt: 0,
                    start: function (slider) {                        
                        window.flexslider = slider;
                        $('body').removeClass('loading');
                    },

                });
                $('#slider .flex-direction-nav .flex-prev').addClass('fa fa-angle-left');
                $('#slider .flex-direction-nav .flex-next').addClass('fa fa-angle-right');
                $('#slider').flexslider(0);

                imageThumbNo = 0;
                hideThumbButton();
            }, 10);
        }

        $scope.closePhotoGallery = function () {
            $timeout(function () {
                //var flex = $('.flexslider').detach(); //detach
                //$('body').append(flex); //reattach

                $("#profile,#actions,#back,.tile-wrapper,#displayPropertySlider").show();
                imageThumbNo = 0;
                $(".thumb_slider_arrow").find('li .flex-prev').hide();
                $(".thumb_slider_arrow").find('li .flex-next').show();

            }, 100);
            $scope.IsshowPhotoGallery = false;
        }

         $rootScope.$on("printPropertyDetailMethod", function(){
           $scope.printPropertyDetail();
        });


        $scope.printPropertyDetail = function () {

          var settings =applicationFactory.getSettings();
          var keenObject = new Keen(settings.keenObject);

          var activityName = $scope.AudienceType == 'CLIENT' ? "Client printed out Property Listing - MLS#" + $scope.propertyDetail.LISTINGID
            : "Agent printed out Property Listing - MLS#" + $scope.propertyDetail.LISTINGID;

          var analyticEvent = {
            Activity: activityName,
            ContainerTag: "PRINT",
            AudienceId: appAuth.getAudienceId(),
            AudienceType: $scope.AudienceType,
            EventData: { listingid: $scope.listingId },
            EventParameters: {
              mlskey: "",
              listingid: $scope.listingId
            }
          };

          // Send it to the "purchases" collection
          keenObject.addEvent("activity", analyticEvent, function (err, res) {
            if (err) {
              //console.log(err);
            }
            else {
              //console.log(res);
            }
          });
          httpServices.trackGoogleEvent('Clicked Print','Listing Detail page', $scope.propertyDetail.LISTINGID, 'Print');
            if ($scope.printOption.PrintView == 'AgentView') {
              //httpServices.trackGoogleEvent('Print-AgentView','property-detail', $scope.propertyDetail.LISTINGID);
            }
            else if ($scope.printOption.PrintView == 'ClientView') {
              //httpServices.trackGoogleEvent('Print-ClientView','property-detail', $scope.propertyDetail.LISTINGID);
            }
            else {
              //httpServices.trackGoogleEvent('Print-Property','property-detail', $scope.propertyDetail.LISTINGID);
            }

          $scope.selectedClientName='';
          if($scope.TLCClient)
            $scope.selectedClientName='Customized for ' + $scope.TLCClient.FirstName + ' ' + $scope.TLCClient.LastName;

            //$scope.print = {propertydetail:true,neighborhood:true, TLC:true};
            if ($("#PrintTLC").next('i').hasClass('checked'))
                $scope.printOption.TLC = true;
            else
                $scope.printOption.TLC = false;

            if ($("#PrintNeighborhood").next('i').hasClass('checked'))
                $scope.printOption.neighborhood = true;
            else
                $scope.printOption.neighborhood = false;


            printer.printFromScope('views/templates/printPropertyDetail.html', $scope);

            /*List Track Ocde*/
            $scope._listtrac_trackEvent(_eventType.printListing);

        }        

        $scope.editClientProfile = function () {
            //httpServices.trackGoogleEvent('Edit-Profile','property-detail');

           if($scope.AudienceType == 'CLIENT')
             $state.go('clientEditProfile');
           else
            $state.go('tlc.editClientProfile', { clientId: $scope.TLCClient.Id });
        }

        $rootScope.$on("selectClient", function (evvent, client) {
            if ($scope.client == null && $scope.AudienceType == 'MLSAGENT' && applicationFactory.getSelectedClient()) {
                $scope.TLCClient = applicationFactory.getSelectedClient();
                $scope.tlcForClient(applicationFactory.getSelectedClient());
                $scope.CalculateMortgage();
                //$("#lifeStyleClientDetail").click();
                $("#lifeStyleClientDetail").addClass('actfive');
                $("#lifeStylePropDetail").removeClass('active');
            }
        });

      $scope.getOpenHouseDateTime = function(){
        if($scope.OpenHouse && $scope.OpenHouse.length > 0) {
          if ($filter('date')($scope.OpenHouse[0].FromDate, 'longDate') == $filter('date')($scope.OpenHouse[0].ToDate, 'longDate')) {
            return $filter('date')($scope.OpenHouse[0].FromDate, 'longDate') + ' ' + $filter('date')($scope.OpenHouse[0].FromDate, 'shortTime') + ' - ' + $filter('date')($scope.OpenHouse[0].ToDate, 'shortTime');
          }
          else {
            return $filter('date')($scope.OpenHouse[0].FromDate, 'longDate') + ' ' + $filter('date')($scope.OpenHouse[0].FromDate, 'shortTime') + ' - ' + $filter('date')($scope.OpenHouse[0].ToDate, 'longDate') + ' ' + $filter('date')($scope.OpenHouse[0].ToDate, 'shortTime');
          }
        }
      }
      // for Entertainment Other
      $scope.addOtherCost = function () {
        if ($scope.OtherCustomFields == null)
          $scope.OtherCustomFields = [];

        if($scope.OtherCustomFields.length >= 10)
        {
          aaNotify.error('You can add maximum 10 fields.');
          return;
        }

        $scope.OtherCustomFields.push({});
      }

      $scope.removeOtherCost = function (index) {
        $scope.OtherCustomFields.splice(index, 1);
      }

      $scope.calculateClosingCost = function() {

          var conservationFee = 5.0, titleServiceFee = 840.0, closingCostTaxRate = 0.0023, recordingFee = 92;
          var salePrice = $scope.propertyDetail.LISTPRICE;
          var mortgageAmount = $scope.calcDetail.LoanAmount;
          var lenderPolicy;

          if (mortgageAmount <= 150000) {
            var amount_remainder = mortgageAmount % 1000;
            if (amount_remainder == 0) {
              lenderPolicy = (mortgageAmount * 3) / 1000;
            }
            else {
              lenderPolicy = (Math.floor(mortgageAmount / 1000) + 1) * 3;
            }
          }
          if (mortgageAmount > 150000 && mortgageAmount <= 300000) {
            var amount_remainder = mortgageAmount % 1000;
            if (amount_remainder == 0) {
              lenderPolicy = (150000 * 3 + (mortgageAmount - 150000) * 2.5) / 1000;
            } else {
              lenderPolicy = 150 * 3 + (Math.floor((mortgageAmount - 150000) / 1000) + 1) * 2.5;
            }
          }
          if (mortgageAmount > 300000 && mortgageAmount <= 500000) {
            var amount_remainder = mortgageAmount % 1000;
            if (amount_remainder == 0) {
              lenderPolicy = (150000 * 3 + 150000 * 2.5 + (mortgageAmount - 300000) * 2.25) / 1000;
            } else {
              lenderPolicy = 150 * 3 + 150 * 2.5 + (Math.floor((mortgageAmount - 300000) / 1000) + 1) * 2.25;
            }
          }
          if (mortgageAmount > 500000 && mortgageAmount < 1000000) {
            var amount_remainder = mortgageAmount % 1000;
            if (amount_remainder == 0) {
              lenderPolicy = (150000 * 3 + 150000 * 2.5 + 200000 * 2.25 + (mortgageAmount - 500000) * 2) / 1000;
            } else {
              lenderPolicy = 150 * 3 + 150 * 2.5 + 200 * 2.25 + (Math.floor((mortgageAmount - 500000) / 1000) + 1) * 2;
            }
          }


          var ownerPolicy;
          if (salePrice <= 150000) {
            var amount_remainder = salePrice % 1000;
            if (amount_remainder == 0) {
              ownerPolicy = (salePrice * 3.5) / 1000 - lenderPolicy + 100;
            } else {
              ownerPolicy = (Math.floor((salePrice) / 1000) + 1) * 3.5 - lenderPolicy + 100;
            }
          }
          if (salePrice > 150000 && salePrice <= 300000) {
            var amount_remainder = salePrice % 1000;
            if (amount_remainder == 0) {
              ownerPolicy = (150000 * 3.5 + (salePrice - 150000) * 2.75) / 1000 - lenderPolicy + 100;
            } else {
              ownerPolicy = 150 * 3.5 + (Math.floor((salePrice - 150000) / 1000) + 1) * 2.75 - lenderPolicy + 100;
            }
          }
          if (salePrice > 300000 && salePrice <= 1000000) {
            var amount_remainder = salePrice % 1000;
            if (amount_remainder == 0) {
              ownerPolicy = (150000 * 3.5 + 150000 * 2.75 + (salePrice - 300000) * 2) / 1000 - lenderPolicy + 100
            } else {
              ownerPolicy = 150 * 3.5 + 150 * 2.75 + (Math.floor((salePrice - 300000) / 1000) + 1) * 2 - lenderPolicy + 100;
            }
          }

          if (ownerPolicy < 100) {
            ownerPolicy = 100;
          }

          if (lenderPolicy == null || ownerPolicy == null) {
            lenderPolicy = 0;
            ownerPolicy = 0;
          }
          var registrationTax = mortgageAmount * closingCostTaxRate;
          var _defaultClosingCost = (Number(titleServiceFee.toFixed(2)) + Number(lenderPolicy.toFixed(2)) + Number(ownerPolicy.toFixed(2)) + Number(registrationTax.toFixed(2)) + Number(conservationFee.toFixed(2)) + Number(recordingFee.toFixed(2))).toFixed(2);

        $scope.closingCostChart.title.text = 'Closing Cost' + '<br/>' + $filter('currencyNoDecimal')(_defaultClosingCost);
        $scope.ClosingCost = _defaultClosingCost;

        $scope.closingCostChart.series[0].data = [
            {name: 'Recording Fee',y: Number(recordingFee.toFixed(2)),legendIndex: 5},
            {name: 'Conservation Fee',y: Number(conservationFee.toFixed(2)),legendIndex: 4},
            {name: 'Mortgage Registration Tax',y: Number(registrationTax.toFixed(2)),legendIndex: 3},
            {name: "Owner's Title Insurance",y: Number(ownerPolicy.toFixed(2)),legendIndex: 2},
            {name: 'Lender Title Insurance',y: Number(lenderPolicy.toFixed(2)),legendIndex: 1},
            {name: 'Title Service Fees',y: Number(titleServiceFee.toFixed(2)),legendIndex: 0}
        ];
      }

      $scope.closingCostChart = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        title: {
          text: '',
          align: 'center',
          verticalAlign: 'middle',
          y: -50
        },
        subtitle: {
          text: ''
        },
        tooltip: {
          formatter: function () {
            return this.point.name + ': ' + $filter('currencyNoDecimal')(this.y) + ' (' + $filter('number')(this.percentage, 1) + '%)';
          }
        },
        /*legend: {
         layout: 'vertical',
         align: 'left',
         verticalAlign: 'bottom',
         x: 0,
         y: 0,
         floating: true,
         borderWidth: 1
         },*/
        legend: {
          /*itemDistance:30,*/

          /*itemMarginBottom: 25,
           itemMarginRight: 15,
           itemWidth: 140,
           itemStyle: {
           width: '130px'
           }*/
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              distance: -30,
              color: '#000000',
              connectorColor: '#000000',
              useHTML: true,
              /*color: 'white',*/
              /*rotation : 15,
               formatter: function () {
               return '<b>' + this.point.name + '</b>' + ': ' + $filter('currencyNoDecimal')(this.y);
               }*/
              formatter: function () {
                if (this.percentage != 0) return Math.round(this.percentage) + '%';
              }
            },
            shadow: false,
            center: ['50%', '50%'],
            showInLegend: true
          }
        },
        series: [{
          type: 'pie',
          name: '',
          innerSize: '65%',
          size: '100%'
        }],
        colors: ["#F48384", "#00C38A", "#3E4651", "#7cb5ec", "#90ed7d", "#ff0066", "#eeaaee",
          "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        //size: {
        //    width: 400,
        //    height: 300
        //},
        exporting: {
          enabled: false
        }
      }        

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

      $scope.updateLifestyledata = function () {
        if ($scope.Process.TLCDocument) {
          aaNotify.danger('Client Image are updating.');
          return;
        }

        $scope.editTLCValues.Detail = {
          "HeatingCoolingCost": $scope.calcDetail.HeatingCoolingCostNew >= 0 ? $scope.calcDetail.HeatingCoolingCostNew : $scope.calcDetail.HeatingCoolingCost,
          "WaterSewerCharge": $scope.calcDetail.WaterSewerChargeNew >= 0 ? $scope.calcDetail.WaterSewerChargeNew : $scope.calcDetail.WaterSewerCharge,
          "GarbageCost": $scope.calcDetail.GarbageCostNew >= 0 ? $scope.calcDetail.GarbageCostNew : $scope.calcDetail.GarbageCost,
          "LawnSnowCare": $scope.calcDetail.LawnSnowCareNew >= 0 ? $scope.calcDetail.LawnSnowCareNew : $scope.calcDetail.LawnSnowCare,
          /*"OtherUtilitiesCost": $scope.calcDetail.OtherUtilitiesCostNew >= 0 ? $scope.calcDetail.OtherUtilitiesCostNew : $scope.calcDetail.OtherUtilitiesCost,*/
          "PhoneCharge": $scope.calcDetail.PhoneChargeNew >= 0 ? $scope.calcDetail.PhoneChargeNew : $scope.calcDetail.PhoneCharge,
          "InternetCharge": $scope.calcDetail.InternetChargeNew >= 0 ? $scope.calcDetail.InternetChargeNew : $scope.calcDetail.InternetCharge,
          "TelevisionCharge": $scope.calcDetail.TelevisionChargeNew >= 0 ? $scope.calcDetail.TelevisionChargeNew : $scope.calcDetail.TelevisionCharge,
          "CellPhoneCharge": $scope.calcDetail.CellPhoneChargeNew >= 0 ? $scope.calcDetail.CellPhoneChargeNew : $scope.calcDetail.CellPhoneCharge
          /*",OtherCharge": $scope.calcDetail.OtherChargeNew >= 0 ? $scope.calcDetail.OtherChargeNew : $scope.calcDetail.OtherCharge*/
        };

        propertiesService.updateLifestyledata({ listingId: $scope.listingId, agentId: appAuth.getAudienceId() },$scope.editTLCValues
          ,function (success) {
            aaNotify.success('TLC values updated successfully.');
            $scope.IsChangedEditTLC = false;
            $scope.editTLCValues = {};
            $scope.Process.Progress = 0;
            $scope.getPropertyDetail(false);
            //$scope.CalculateMortgage();
          }, function (error) {

          });
      };

      $scope.cancelUpdateLifestyledata = function () {
        $scope.editTLCValues = {};
        $scope.Process.Progress = 0;

        $scope.calcDetail.HeatingCoolingCostNew = null;
        $scope.calcDetail.WaterSewerChargeNew = null;
        $scope.calcDetail.GarbageCostNew = null;
        $scope.calcDetail.LawnSnowCareNew = null;
        $scope.calcDetail.OtherUtilitiesCostNew = null;
        $scope.calcDetail.PhoneChargeNew = null;
        $scope.calcDetail.InternetChargeNew = null;
        $scope.calcDetail.TelevisionChargeNew = null;
        $scope.calcDetail.CellPhoneChargeNew = null;
        $scope.calcDetail.OtherChargeNew = null;

        $scope.changetlcOnOff();
      }

      $scope.changedEditTLC = function()
      {
         return $scope.calcDetail.HeatingCoolingCostNew != $scope.calcDetail.HeatingCoolingCost ||
                $scope.calcDetail.WaterSewerChargeNew != $scope.calcDetail.WaterSewerCharge ||
                $scope.calcDetail.GarbageCostNew != $scope.calcDetail.GarbageCost ||
                $scope.calcDetail.LawnSnowCareNew != $scope.calcDetail.LawnSnowCare ||
                $scope.calcDetail.OtherUtilitiesCostNew != $scope.calcDetail.OtherUtilitiesCost ||
                $scope.calcDetail.PhoneChargeNew != $scope.calcDetail.PhoneCharge ||
                $scope.calcDetail.InternetChargeNew != $scope.calcDetail.InternetCharge ||
                $scope.calcDetail.TelevisionChargeNew != $scope.calcDetail.TelevisionCharge ||
                $scope.calcDetail.CellPhoneChargeNew != $scope.calcDetail.CellPhoneCharge ||
                $scope.calcDetail.OtherChargeNew != $scope.calcDetail.OtherCharge;
      }

      $scope.Process = { Progress:0,TLCDocument:false };
      $scope.uploadImage = function ($files) {
        if($files.length > 0) {
          var image = $files[0];

          AWS.config.update({
            accessKeyId: 'AKIAJAMN7EQMVI6NMNNQ',
            secretAccessKey: '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'
          });
          var bucket = new AWS.S3({params: {Bucket: 'tlcengine'}});

          // Prepend Unique String To Prevent Overwrites
          var randomNumber = String(Math.floor(Math.random() * 9000) + 1000) + "_";
          var uniqueFileName = 'TLCUpdateDocument_' + $scope.listingId + '_' + randomNumber + '_' + image.name;

          var params = {
            Key: uniqueFileName,
            ContentType: image.type,
            Body: image,
            ServerSideEncryption: 'AES256'
          };

          $scope.Process.TLCDocument = true;
          bucket.putObject(params, function (err, data) {
            $scope.editTLCValues.DocumentUrl = "https://s3.amazonaws.com/tlcengine/" + uniqueFileName;
            $scope.Process.TLCDocument = false;
            $scope.$digest();
          }).on('httpUploadProgress',function(progress) {
            $scope.Process.Progress  = Math.min(100, parseInt(progress.loaded / progress.total * 100));
            $scope.$digest();
          });
        }
      }

      $scope.savingTooltip = function()
      {
        if($scope.calculator && $scope.Search && $scope.calculator.NetMonthlyIncome > 0 && $scope.Search.TLCType == 'manual')
          return $filter('currencyNoDecimal')($scope.calculator.NetMonthlyIncome) + "(Income) - " + $filter('currencyNoDecimal')($scope.CalculatedTLC)  + "(TLC) - " + $filter('currencyNoDecimal')($scope.calcDetail.MonthlyDebt) + "(Debt) = " + $filter('currencyNoDecimal')($scope.CalculatedSavings) + "(Saving)";
        else
          return "Income - TLC - Debt = Saving";
      }

      $scope.otherEntertainment = function()
      {
        if($scope.TLCClient != null && $scope.TLCClient.Profile.EntertainmentData != null && $scope.TLCClient.Profile.EntertainmentData.Other != null && $scope.TLCClient.Profile.EntertainmentData.Other.OtherDetail != null) {
          var otherEntertainment = [];

          _.each($scope.TLCClient.Profile.EntertainmentData.Other.OtherDetail, function (other) {
            otherEntertainment.push(other.Title + ' - ' + $filter('currencyNoDecimal')(other.Amount));
          });

          return '<div style="text-align:left;">' + otherEntertainment.join('<br />') + '</div>';
        }
        else
          return '';
      }

      $('#propertyDetail').scroll(function(){

        if ($state.current.name == 'tlcClient.search.propertydetail' || $state.current.name == 'tlc.search.propertydetail'
        || $state.current.name == 'tlc.clientSummary.propertydetail' || $state.current.name == 'tlc.PropertyDirect.MLS' || $state.current.name == 'tlcClient.search.propertydetail.mls'){
          if($(window).width()>= 768){

            if($(this).scrollTop() > 360){
              $(".propertyfixdiv").addClass('show');
              $("body.results #search").hide();
              $("body.results #search").removeClass('show');
              $("#login-dp").hide();
            }else {
              $(".propertyfixdiv").removeClass('show');
              $("body.results #search").show();
              $("body.results #search").addClass('show');              
            }      
            if($( window ).width() <= 1024){
              if($(this).scrollTop() > 200){
                $(".propertyfixdiv").addClass('show');
                $("body.results #search").hide();
                $("body.results #search").removeClass('show');
              }else {
                $(".propertyfixdiv").removeClass('show');
                $("body.results #search").show();
                $("body.results #search").addClass('show');
              }  
            }

          }

           var divWidth = parseInt($('#profileDetailInfo').width())+50;
           
           var divHeight = parseInt($('#bs-example-navbar-collapse-1').height())+parseInt($('.propertyfixdiv').height());

            if($(this).scrollTop() > 460){
              $('#askMeQues').addClass('fixedAskQuestion');
              $('#askMeQues').css({'width' : divWidth+'px', 'top' : divHeight+'px', 'height' :'auto', 'overflow': 'auto'});

            }else {
              $('#askMeQues').removeClass('fixedAskQuestion');
              $('#askMeQues').css({'width' : '', 'top' : '', 'height' :'', 'overflow': ''});
            }
            
        }

      });
      $( window ).resize(function() {
        var divWidth = parseInt($('#profileDetailInfo').width())+50;           
           var divHeight = parseInt($('#bs-example-navbar-collapse-1').height())+parseInt($('.propertyfixdiv').height());
          if($('#propertyDetail').scrollTop() > 460){            
              $('#askMeQues').addClass('fixedAskQuestion');
              $('#askMeQues').css({'width' : divWidth+'px', 'top' : divHeight+'px', 'height' :'77%', 'overflow': 'auto'});
            }else {              
              $('#askMeQues').removeClass('fixedAskQuestion');
              $('#askMeQues').css({'width' : '', 'top' : '', 'height' :'', 'overflow': ''});
            }
      });

      $scope.scrollToQMRMessage = function()
      {
          //$anchorScroll.yOffset = 250;
          if ($location.hash() !== 'info-calculator') {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash('info-calculator');
          } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
          }

        /*setTimeout(function(){
          window.scrollTo(window.pageXOffset, window.pageYOffset + 250);
        },300);*/
      }

       $scope.$watch('messageToAgent', function (newValue, oldValue) {
          if(newValue) {
              var indexOfSB = newValue.indexOf('[');
              var indexOfDQ = newValue.indexOf('"');
              if(indexOfDQ - indexOfSB != 1) {
                indexOfSB = newValue.replace("[", "").indexOf('[');
                indexOfDQ = newValue.indexOf('"');
              }
              if(indexOfSB > -1) {
                  $scope.showingText = newValue.substring(0, indexOfDQ - 1);
              } else {
                  $scope.showingText = newValue;
              }
          } else {
            $scope.showingText = '';
          }
        });

      $scope.showScheduleVisit = function() {
          $('.showingTime').val('any');
          $scope.showingTime = 'any';
          if($('.scheduleCheckBox').prop('checked')) {
            $('.scheduleVisitTIme').css("display","block");
            $('.scheduleVisitTImeModal').css("display","block");
            $( ".scheduleDate" ).datepicker({
              minDate: 0,
              onSelect: function (dateText, inst) {
                $scope.dateText = dateText;
                $scope.timeText = $('.showingTime option:selected').text();
                $('.askMeQuestion-address').val($scope.showingText + ' ["My preferred date and time is: ' + $scope.dateText + ' - ' + $scope.timeText + '"]');
              }
            });
          } else {
            $('.scheduleVisitTIme').css("display","none");
            $('.scheduleVisitTImeModal').css("display","none");
            $('.scheduleDate').datepicker('setDate', null);
            $('.askMeQuestion-address').val($scope.showingText);
          }
      }

      $scope.appendSelctValue = function () {
        $scope.timeText = $('.showingTime option:selected').text();
          $('.askMeQuestion-address').val($scope.showingText + ' ["My preferred date and time is: ' + $scope.dateText + ' - ' + $scope.timeText + '"]');
      }
       $scope.appendSelctValue1 = function () {
        $scope.timeText = $('.showingTime1 option:selected').text();
          $('.askMeQuestion-address').val($scope.showingText + ' ["My preferred date and time is: ' + $scope.dateText + ' - ' + $scope.timeText + '"]');
      }

      $scope.formatNumber = function(num) {
        if(num != undefined) {
          return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        }
      }

      $('#getPoisModal').on('show.bs.modal', function() {
        $('#getPoisModal').appendTo("body");

      })

       $('#askMeQuestion').on('show.bs.modal', function() {
        $('#askMeQuestion').appendTo("body");

      })


      $scope.testPhoneNumber = 2025542456;

      $scope.formatPhone = function(value) {
        value = '' + value + '';
        var numbers = value.replace(/\D/g, ''),
        char = {0: '(', 3: ') ', 6: ' - '};
        value = '';
        for (var i = 0; i < numbers.length; i++) {
          value += (char[i] || '') + numbers[i];
        }
        return value;
      }



      $scope.init();
    }]);



// for accordin
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/accordion/accordion-group.html",
      "<div class=\"panel panel-default\" onclick=\"changeColor(event)\">\n" +
      "  <div class=\"panel-heading\" \"collapse-heading\" ng-click=\"toggleOpen()\">\n" +
      "    <h4 class=\"panel-title\">\n" +
      "      <a href class=\"accordion-toggle\" ng-class=\"{'tabSelectClass':isOpen,'':!isOpen}\" accordion-transclude=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a><i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-minus':isOpen,'glyphicon-plus':!isOpen}\"></i>\n" +
      "    </h4>\n" +
      "  </div>\n" +
      "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
      "      <div class=\"panel-body\" style=\"cursor: default;\" ng-transclude></div>\n" +
      "  </div>\n" +
      "</div>\n" +
      "");
}]);