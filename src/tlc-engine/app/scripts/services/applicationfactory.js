'use strict';

/**
 * @ngdoc service
 * @name tlcengineApp.applicationfactory
 * @description
 * # applicationfactory
 * Factory in the tlcengineApp.
 */
angular.module('tlcengineApp')
  .factory('applicationFactory',['$rootScope', 'utilService','localStorageService', 'propertiesService', function ($rootScope, utilService,localStorageService,propertiesService) {
    var $scope = {};
    //$scope.priceRange = { min: 0, max: 0 }; $scope.tlcRange = { min: 0, max: 0 }; $scope.sqftRange = { min: 0, max: 0 }; $scope.acresRange = { min: 0, max: 0 }; $scope.yearBuiltRange = { min: 0, max: 0 }; $scope.tlcRange = { min: 0, max: 0 };
    $scope.bedsRange = { bedsmin: '', bedsmax: '' }; $scope.priceRange = { min: '', max: '' }; $scope.tlcRange = { min: '', max: '' }; $scope.sqftRange = { min: '', max: '' }; $scope.acresRange = { min: '', max: '' }; $scope.yearBuiltRange = { min: '', max: '' }; $scope.tlcRange = { min: '', max: '' };
    var searchUpdateHandlers = [], mapDrawingHandlers = [], onSearchHandlers = function(){};
    var blankSearchObj = {
        beds: 0,
        baths: 0,
        garages: 0,
        propertytype: '',
        tlcmin: $scope.tlcRange.min,
        tlcmax: $scope.tlcRange.max,
        listingpricemin: $scope.priceRange.min,
        listingpricemax: $scope.priceRange.max,
        bedsmin: $scope.bedsRange.bedsmin,
        bedsmax: $scope.bedsRange.bedsmax,
        livingareamin: $scope.sqftRange.min,
        livingareamax: $scope.sqftRange.max,
        acresmin: $scope.acresRange.min,
        acresmax: $scope.acresRange.max,
        yearbuiltmin: $scope.yearBuiltRange.min,
        yearbuiltmax: $scope.yearBuiltRange.max,
        ficoscore: '',
        loantype: '',
        location: '',
        commutes:[],
        status:'All',
        contingent:'All'
    };

    var blankSortParameters = {
        orderby: 'TLC',
        orderbydirection: "ASC"
    }

    $rootScope.emptySearchObj = blankSearchObj;
    $rootScope.searchParameters = angular.copy(blankSearchObj);

    $rootScope.sortParameters = angular.copy(blankSortParameters);

    $rootScope.polygon = undefined;
    $rootScope.locationText = "";
    $rootScope.selectedClient = undefined;
    $rootScope.polygons = [];
    $rootScope.addresses = [];
    $rootScope.polygonCounter = [];

    var applicationFactory = {};

    applicationFactory.MapDrawingStatus = {"Started":"started", "Completed":"completed"};
    applicationFactory.getMapBounds = function(){return 0;};

    applicationFactory.getSearchParameters = function(){
        return $rootScope.searchParameters;
    };

    applicationFactory.setSearchParameters = function(searchParameters, notify){
         $rootScope.searchParameters.length = 0;
      //Add locations to the search parameters
      $rootScope.searchParameters['addresses'] = [];
      if($rootScope.locationText != undefined && $rootScope.locationText != ""){
        var mlsNumberPattern = utilService.getMLSNumberPattern();
        var keywordPattern = utilService.getKeywordPattern();
        var neighborhoodPattern = utilService.getNeighborhoodPattern();

        if (mlsNumberPattern.test($rootScope.locationText) || keywordPattern.test($rootScope.locationText) || neighborhoodPattern.test($rootScope.locationText)) {
          $rootScope.searchParameters.keywords = angular.copy($rootScope.locationText);
        }
      }

      if($rootScope.addresses != undefined && $rootScope.addresses != null && $rootScope.addresses.length > 0){
        $rootScope.searchParameters.addresses = $rootScope.addresses;
      }

      $rootScope.searchParameters['polygons'] = [];
      if($rootScope.polygons != undefined && $rootScope.polygons != null && $rootScope.polygons.length > 0){
        //$rootScope.searchParameters.polygons.push($rootScope.polygon);
        $rootScope.searchParameters.polygons = $rootScope.polygons;
      }

      $rootScope.searchParameters = searchParameters;

    };

    applicationFactory.getSortParameters = function(){
        return $rootScope.sortParameters;
    };

    applicationFactory.setSortParameters = function(sortParameters, notify){
        $rootScope.sortParameters = sortParameters;
    };

    applicationFactory.setMapBoundsMethod = function(method){
        applicationFactory.getMapBounds = method;
    };

    applicationFactory.setAddresses = function(addresses){
      $rootScope.addresses = addresses;
    };

    applicationFactory.addAddress = function(address){
      if($rootScope.addresses.indexOf(address) == -1 ){
        $rootScope.addresses.push(address);
      }
    };

    applicationFactory.removeAddress = function(address){
      var ind = $rootScope.addresses.indexOf(address);
      if (ind > -1){
        $rootScope.addresses.splice(ind, 1);
      }
    };

    applicationFactory.getAddresses = function(){
      return $rootScope.addresses;
    };

    applicationFactory.setPolygon = function(polygon){
        $rootScope.polygon = polygon;
    };

    applicationFactory.addPolygon = function(polygon){
      if($rootScope.polygons.indexOf(polygon) == -1){
        $rootScope.polygons.push(polygon);
        /*Add polygon counter*/
        if($rootScope.polygonCounter.length > 0){
          var lastVal = $rootScope.polygonCounter[$rootScope.polygonCounter.length - 1];
          $rootScope.polygonCounter.push((lastVal + 1));
        }else{
          $rootScope.polygonCounter.push(1);
        }
      }
    };

    applicationFactory.clearPolygon = function(){
      $rootScope.polygons = [];
      $rootScope.polygonCounter = [];
    };

    applicationFactory.removePolygon = function(polygon){
      var ind = $rootScope.polygons.indexOf(polygon);
      if (ind > -1){
        $rootScope.polygons.splice(ind, 1);
        $rootScope.polygonCounter.splice(ind, 1);
      }
      //$rootScope.polygons.push(polygon);
    };

    applicationFactory.getPolygonCounter = function(){
      return $rootScope.polygonCounter;
    };

    applicationFactory.getPolygon = function(){
        return $rootScope.polygon;
    };

    /*It will add sorting parameters and filter the parametrs that are not changed.*/
    applicationFactory.filterAllParameters = function(){
        /*make copy of search filter*/
        var filterParam = angular.copy($rootScope.searchParameters);

        /*Add sort parameters*/
        for(var key in $rootScope.sortParameters){
            filterParam[key] = $rootScope.sortParameters[key];
        }

        /*Filter unnecessary parameters*/
        filterParameters(filterParam);
        return filterParam;
    };

    /*It will generate the url for the given search parameters*/
    applicationFactory.generateSearchURL = function(filterParam){
        /*Remove the location from the url parameter*/
        if(filterParam.location != undefined)
          delete filterParam.location;
                 
        var parameters = "";
        for (var key in filterParam) {            
            if (filterParam[key] && filterParam[key] != "") {                
                if (key == 'addresses' ){
                  parameters = parameters + key + ":" + encodeURIComponent(decodeURIComponent(JSON.stringify(filterParam[key]))) + ";";
                }else if(key == 'polygons') {
                  parameters = parameters + key + ":" + encodeURIComponent(decodeURIComponent(JSON.stringify(filterParam[key]))) + ";";
                }else if(key == 'schoolname' || key == 'contingent' || key == 'storylevel') {
                    parameters = parameters + key + ":" + encodeURIComponent(decodeURIComponent(filterParam[key])) + ";";
                }else if(key == 'keywords') {
                  parameters = parameters + key + ":" + filterParam[key] + ";";
                } else if(key == 'listingpricemax' && key != 'listingpricemin' && filterParam.listingpricemin == undefined) {
                    parameters = parameters + "listingpricemin:0;"+ key + ":" + encodeURIComponent(decodeURIComponent(filterParam[key])) + ";";
                }
                else if(key == 'commutes') {
                  parameters = parameters + key + ":" + encodeURIComponent(decodeURIComponent(JSON.stringify(filterParam[key]))) + ";";
                } else {
                  if(_.isString(filterParam[key]) && key != 'ficoscore' && key != 'lifestyle' && key != 'localelistingstatus' && key != 'coolingtype' && key != 'coolingfuel' && key != 'poolfuture' && key != 'propertystyle' && key != 'storylevel' && key != 'ownershiptype' && key != 'propertysubtype' && key != 'subdivision'){
                    parameters = parameters + key + ":" + utilService.removeCommasFromNumber(filterParam[key]) + ";";
                  }else{
                    parameters = parameters + key + ":" + filterParam[key] + ";";
                  }
                }
            }
        }
        return parameters;
    };

    /*It will retrive parametrs from the given string and set it to the search parameters list*/
    applicationFactory.URLStringToSearchParam = function(parameterString){
        var params = parameterString.split(";");
        for (var i = 0; i < params.length; i++) {
            var keyVal = params[i].split(':');
            if (keyVal.length == 2) {
                if (keyVal[0] == 'location') {
                    setSearchParameters(keyVal[0], decodeURIComponent(keyVal[1]));
                } else {
                    setSearchParameters(keyVal[0], keyVal[1]);
                }
            }
        }
    };


    /* Javascript methods section*/

    /*Remove unnecessary parameters*/
    function filterParameters(filters) {
        for (var key in filters) {
            if (key !=  "forsale" && key != "CommuteLocationIndex" && (filters[key] == undefined || filters[key] == null || filters[key] == '')) {
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
                    case 'commutetimemins':
                    case 'commutemode':
                    case 'CommuteLocationIndex':
                        if ((filters['commutetimemins'] == undefined) || (filters['commutetimemins'] == "") || (filters['commutetimemins'] == 0)  || (filters['commutemode'] == undefined) || (filters['commutemode'] == "") ) {
                            delete filters['commutetimemins'];
                            delete filters['commutemode'];
                            delete filters['CommuteLocationIndex'];
                        }else{
                            /*Validation of location for commute search*/
                            if((filters['location'] == undefined) || (filters['location'] == []) || utilService.getPolygonPattern().test(decodeURIComponent(filters['location']) || utilService.getMLSNumberPattern().test(decodeURIComponent(filters['location'])) )){
                                //delete filters['commutetimemins'];
                                //delete filters['commutemode'];
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

    function  setSearchParameters(key, value) {
        switch (key) {
            case 'beds':
                $rootScope.searchParameters[key] = value;
                break;
            case 'baths':
                $rootScope.searchParameters[key] = value;
                break;
            case 'garages':
                $rootScope.searchParameters[key] = value;
                $("select[name=garages]").val(value);
                break;
            case 'propertytype':
                $rootScope.searchParameters[key] = value;
                if(value == 'residential') {
                    $("select[name=proptype]").val("Residential");
                } else if(value == 'com') {
                    $("select[name=proptype]").val("Commercial");
                }  else if(value == 'multifamily') {
                    $("select[name=proptype]").val("Multi-Family");
                } else if(value == 'land') {
                    $("select[name=proptype]").val("Lot Land");
                }  else {
                    $("select[name=proptype]").val("Residential");
                }
                break;
            case 'location':
                $rootScope.searchParameters[key] = value;
                break;
            case 'orderby':
                $rootScope.sortParameters[key] = value;
                break;
            case 'orderbydirection':
                $rootScope.sortParameters[key] = value;
                break;
            default:
                if(value.indexOf("-") != -1 && key != 'ficoscore' && key != 'lifestyle') {
                    $rootScope.searchParameters[key] = value.replace(/-/g, "");  
                } else {
                    $rootScope.searchParameters[key] = value;
                }                
                /*Load home screen*/
                break;
        }
    }

    applicationFactory.generatePolygonFromString = function(polygonString){
        var stringArray = [];
        var polygon = [];
        stringArray = polygonString.split(',');
        stringArray.forEach(function(obj){
            polygon.push(obj.split(' '));
        });
        return polygon;
    }

    applicationFactory.setSelectedClient = function(client){
        $rootScope.selectedClient = client;
    }

    applicationFactory.getSelectedClient = function(){
        return $rootScope.selectedClient;
    }

    applicationFactory.getSettings = function(){
      if(typeof $rootScope.settings == 'undefined') {        

        //$rootScope.settings = localStorageService.get('settings');
        $rootScope.settings = {"BrokerReciprocityTextLarge":"Information is deemed reliable but is not guaranteed",
                                "latitude":"38.91",
                                "longitude":"-77.01",
                                "initBounds": [
                                    [
                                        39.02,
                                        -77.21
                                    ],
                                    [
                                        38.80,
                                        -76.82
                                    ],
                                    [
                                        38.80,
                                        -77.21
                                    ],
                                    [
                                        39.02, 
                                        -76.82
                                    ]
                                ],                                                         
                                "EnableSchoolDistrictSearch":false,
                                "EnableContingencySearch":false,
                                "EULAText":"",
                                "BingKey":"ApdKryWnQ3Zi2D39-XgoU0gIYiZOC-67sG1GaAaOUd4gvufAkUzMMrljJrDiMRMZ",
                                "DefaultWorkAddress":"Washington, DC, United States",
                                "DefaultLegalContentFile":"https://s3-us-west-2.amazonaws.com/tlc-files/legal-nsmls.html",
                                "BrokerDashboardUrl":" http://brokerdashboarduatv2.tlcengine.com",
                                "PropertyStyles":[{"Title":"(SF) One Story","Value":"ONEST","PropertyType":"SF"},{"Title":"(SF) One 1/2 Stories","Value":"ONEHF","PropertyType":"SF"},{"Title":"(SF) Two Stories","Value":"TWOST","PropertyType":"SF"},{"Title":"(SF) More Than Two Stories","Value":"MRTTS","PropertyType":"SF"},{"Title":"(SF) Modified Two Story","Value":"MODTS","PropertyType":"SF"},{"Title":"(SF) Three Level Split","Value":"THRLS","PropertyType":"SF"},{"Title":"(SF) Four or More Level Split","Value":"FOURM","PropertyType":"SF"},{"Title":"(SF) Split Entry (Bi-Level)","Value":"SPEBI","PropertyType":"SF"},{"Title":"(SF) Other","Value":"OTHER","PropertyType":"SF"},{"Title":"(TH) Quad/4 Corners","Value":"QUAD4","PropertyType":"SF"},{"Title":"(TH) Side x Side","Value":"TWNSS","PropertyType":"SF"},{"Title":"(TH) Detached","Value":"TWNDE","PropertyType":"SF"},{"Title":"(CC) High Rise (4+ Levels)","Value":"HGHRS","PropertyType":"SF"},{"Title":"(CC) Low Rise (3- Levels)","Value":"LOWRS","PropertyType":"SF"},{"Title":"(CC) Manor/Village","Value":"MANVI","PropertyType":"SF"},{"Title":"(CC) Two Unit","Value":"2UNIT","PropertyType":"SF"},{"Title":"(CC) Converted Mansion","Value":"CNVMN","PropertyType":"SF"},{"Title":"(TW) Twin Home","Value":"TWNHM","PropertyType":"SF"},{"Title":"Time Share","Value":"TIMSH","PropertyType":"SF"},{"Title":"(MF) Apartment Flat","Value":"APTFL","PropertyType":"MF"},{"Title":"(MF) One Story","Value":"MF1ST","PropertyType":"MF"},{"Title":"(MF) One 1/2 Stories","Value":"MF1HF","PropertyType":"MF"},{"Title":"(MF) Two Stories","Value":"MF2ST","PropertyType":"MF"},{"Title":"(MF) Cluster/Patio","Value":"CLUPT","PropertyType":"MF"},{"Title":"(MF) More Than Two Stories","Value":"MFMT2","PropertyType":"MF"},{"Title":"(MF) Modified Two-Story","Value":"MFMOD","PropertyType":"MF"},{"Title":"(MF) Three Level Split","Value":"MF3LS","PropertyType":"MF"},{"Title":"(MF) Four Level Split","Value":"FORLS","PropertyType":"MF"},{"Title":"(MF) Split Entry (Bi-Level)","Value":"MFSEB","PropertyType":"MF"},{"Title":"(MF) High Rise (4+ Levels)","Value":"MFHRS","PropertyType":"MF"},{"Title":"(MF) Low Rise (3- Levels)","Value":"MFLRS","PropertyType":"MF"},{"Title":"(MF) Manor/Village","Value":"MFMNR","PropertyType":"MF"},{"Title":"(MF) Quad/4 Corners","Value":"MFQAD","PropertyType":"MF"},{"Title":"(MF) Duplex Side X Side","Value":"DUPSS","PropertyType":"MF"},{"Title":"(MF) Duplex Up and Down","Value":"DUPUD","PropertyType":"MF"},{"Title":"(MF) Duplex Other","Value":"DUPOT","PropertyType":"MF"},{"Title":"(MF) Triplex","Value":"MFTRI","PropertyType":"MF"},{"Title":"(MF) Four Plex","Value":"MFFOUR","PropertyType":"MF"},{"Title":"(MF) Apartments/Multifamily","Value":"APTMU","PropertyType":"MF"},{"Title":"(MF) Other","Value":"MFOTH","PropertyType":"MF"}],
                                "BackgroundImageUrl":"https://s3-us-west-2.amazonaws.com/tlc-imgs/imgs/nsmlsbackground.jpg",
                                "keenObject":{"projectId":"55252fa459949a0825de356f",
                                "writeKey":"4726db80ba83dd39076d6343a365b54bdcb7e180f6889a2f28b5168c85ee8bdcdbd2133d639cd3c7b52069c45b912ccf4988dc2f6e05499dd1ad65f70c488eee87ce03398f71d8c962d25bfae2e74b65d63d71d52d3a51a056a5b27168857f7d796a04c6a4c5f28c0657bac60ee1673d",
                                "readKey":"974073a69426745f4154272ac02aa00b63b1d16370ebd594d0506ed87c46018c823379257aa98d192097d236effc621bb3ae95f69dda5e32c28f0d4269f1fa55f06676ef0c4e0047e2195b91d189dbe5a18161082727e7c75312affc3ef1276808221c86494f9167e81c52b8b67170da",
                                "protocol":"https",
                                "host":"api.keen.io/3.0",
                                "requestType":"jsonp"}};
      }

      return $rootScope.settings;
    }

    applicationFactory.resetSearchParameters = function(){
      $rootScope.searchParameters = angular.copy(blankSearchObj);
      $rootScope.sortParameters = angular.copy(blankSortParameters);
      $rootScope.locationText = "";
      $rootScope.addresses = [];
      $rootScope.polygons = [];
    }

    applicationFactory.setLocationText = function(value){
      $rootScope.locationText = value;
    }

    applicationFactory.getLocations = function(){
      var locations = [];

      //$rootScope.searchParameters['addresses'] = [];
      if($rootScope.searchParameters['addresses'] != undefined && $rootScope.searchParameters['addresses'] != null && $rootScope.searchParameters['addresses'].length > 0){
        for(var i=0; i< $rootScope.searchParameters['addresses'].length; i++){
          locations.push($rootScope.searchParameters['addresses'][i]);
        }
      }

      if($rootScope.searchParameters['addresses'] != undefined && $rootScope.searchParameters['addresses'].length > 1) {
        $rootScope.searchParameters['addresses'].shift();
      }

      if($rootScope.polygons != undefined && $rootScope.polygons != null && $rootScope.polygons.length > 0){
        //$rootScope.searchParameters.polygons.push($rootScope.polygon);
        for(var i=0; i < $rootScope.polygons.length; i++){
          locations.push($rootScope.polygons[i])
        }
      }

      return locations;
    }

    applicationFactory.getPolygons = function(){
      return $rootScope.polygons;
    }

    applicationFactory.setSeavedSearch = function(SearchParameters){
      delete SearchParameters['orderby'];
      delete SearchParameters['orderbydirection'];
      delete SearchParameters['mapbound'];

      applicationFactory.clearPolygon();
      if(SearchParameters.beds){
        SearchParameters.beds = SearchParameters.beds.replace("g","");
      }
      if(SearchParameters.bedsmax){
        SearchParameters.bedsmax = SearchParameters.bedsmax.replace("-","");
      }
      if(SearchParameters.baths){
        SearchParameters.baths = SearchParameters.baths.replace("g","+");
      }
      if(SearchParameters.garages){
        SearchParameters.garages = SearchParameters.garages.replace("g","");
      }

      if (SearchParameters.location) {
        SearchParameters.location = decodeURIComponent(SearchParameters.location);
        if (utilService.getPolygonPattern().test(SearchParameters.location)) {
          applicationFactory.setPolygon(SearchParameters.location);
          SearchParameters.location = undefined;
        }else{
          applicationFactory.setPolygon(undefined);
        }
      }else{
        applicationFactory.setPolygon(undefined);
      }

      if(SearchParameters.keywords){
        SearchParameters.location = SearchParameters.keywords;
        SearchParameters.keywords = undefined;
      }

      applicationFactory.setSearchParameters(SearchParameters, false);

      return SearchParameters;
    }

    applicationFactory.getSearchTimeText = function(search){
      if(search.CreatedForClient != undefined){
        if(search.ClientId != undefined && search.ClientId != null && search.CreatedForClient == true){
          return "Created for " + search.ClientName + " " + search.LastUpdatedHumanTime;
        }
      }else if(search.CreatedByAgent != undefined && search.CreatedByAgent == true){
        return "Created by agent " + search.LastUpdatedHumanTime;
      }else{
        return search.LastUpdatedHumanTime;
      }
      return search.LastUpdatedHumanTime;
    }

    applicationFactory.displayDeleteSavedSearch = function(search){
      if(search.CreatedForClient != undefined){
        if(search.ClientId != undefined && search.ClientId != null && search.CreatedForClient == true){
          return false;
        }
      }else if(search.CreatedByAgent != undefined && search.CreatedByAgent == true){
        return false;
      }else{
        return true;
      }
      return true;
    }

    /*End Javascript methods section*/

    return applicationFactory;
  }]);
