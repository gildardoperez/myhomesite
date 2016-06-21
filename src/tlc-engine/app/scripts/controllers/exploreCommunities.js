'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:exploreCommunitiesCtrl
 * @description - City Page Content
 * # exploreCommunitiesCtrl
 * Controller of the tlcengineApp
 */


angular.module('tlcengineApp')
  .controller('exploreCommunitiesCtrl', ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope', '$window', 'aaNotify','$q','appAuth','httpServices','applicationFactory','utilService',
    function ($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, $window, aaNotify,$q,appAuth,httpServices,applicationFactory,utilService) {

    	$scope.stateName = $stateParams.state;
        $scope.onclickOnViewPrptySubmit=1;
        if( $stateParams.city != undefined) {
            $scope.city = $stateParams.city.replace(/\s+/g, '-');
            $scope.city = $stateParams.city.replace('-',' ');
            $scope.city = $filter('titleCase')($scope.city);
        } 

        if($stateParams.zipcode != undefined) {
            $scope.zipcode = $stateParams.zipcode;
            $scope.city = $scope.zipcode+","+$scope.city;
        }

        if ($('body').hasClass('results')) {
            $('body').removeClass('results');
        }

        $rootScope.searchParameters['listingpricemin'] = '';
        $rootScope.searchParameters['listingpricemax'] = '';

        $scope.exploreProptype = 'Residential';
        $scope.heading = "";

        /* Initilize the angular function */
    	$scope.init = function () {
    		$scope.nearCityOffice = 'nearest';

            if($scope.stateName) {
                $scope.getCity();
                $scope.getCityBoundary();
                $scope.getCitySchools();
                $scope.getCityDemographics();
            }

            var city = $scope.city.trim();
            switch (city) {
                case "Washington":
                    $scope.placeHolder = "Washington, District of Columbia, United States";
                    $scope.heading = "History, heritage and utterly unique urban living.";
                    $scope.exploreContent = "<p>There are so many things you know about Washington, D.C. It&#39;s the nation&#39;s capital, an international focal point, and city where history is made every second of the day. But did you know it&#39;s also a fantastic place to live? With its fast pace, international influences, and dynamic power players, it&#39;s just the place for an adrenaline-filled lifestyle</p><p>Washington, D.C also offers miles of greenbelt, jogging, biking trails and parks where you can work out, escape the hubbub and enjoy natural beauty, anytime. You can find condos, townhouses, rentals and single family real estate for sale in fashionable Foggy Bottom, hip and happening Georgetown, casual DuPont Circle and elsewhere throughout the city. You could even opt for suburbs like Alexandria, VA if you want a more relaxed pace and traditional residential feel.</p><p>Finding real estate for sale in Washington, D.C. can be challenging, but you&#39;re not alone! At MRIShomes, you can find a local real estate professional to show you every dimension of D.C.   living and every residential real estate listing on the market. For information, contact a Washington D.C expert at MRIShomes today!";
                    $scope.className = "wash-banner";
                break;
                case "Annapolis":
                    $scope.placeHolder = "Annapolis, Maryland, United States";
                    $scope.heading = "Historic charm meets contemporary style.";
                    $scope.exploreContent = "<p>With a heritage of more than 350 years, Maryland&#39;s capital, Annapolis, is one of America&#39;s oldest cities and is known best as the home of The United States Naval Academy. Despite its long history, the attitude is distinctly young and contemporary. Annapolis is a paradise for sailing, sightseeing and sophisticated dining and entertainment. Throughout Annapolis, you&#39;ll find waterways, walking trails and seacoast sights that make every day like a vacation.</p><p>Love city life? You can find historic single family real estate and rentals at more reasonable prices than many other large cities. Like the quiet of suburban living? Annapolis, Maryland has many charming outlying towns and cities that are an easy commute. Wherever you find yourself in Annapolis, it&#39;s a fantastic place to settle down!</p><p>In the shadow of Washington, D.C., Baltimore and other major metro areas, Annapolis is a hidden gem you have to see to appreciate. At MRIShomes, you can find a local real estate professional that can show you every benefit of Annapolis life, as well as all prime real estate to buy or rent. For information on everything from rustic homes to city real estate, contact an Annapolis, Maryland expert at MRIShomes today!";
                    $scope.className = "annapolis-banner";
                break;
                case "Baltimore":
                    $scope.placeHolder = "Baltimore, Maryland, United States";
                    $scope.heading = "A magnificent harbor. With home values to match.";
                    $scope.exploreContent = "<p>It&#39;s amazing what you can find in Baltimore, Maryland, especially when it comes to home values. Smart single family homes, swank condos, tempting townhomes and fetching fixer-uppers are all remarkably affordable compared to nearby cities. You&#39;ll also find a city you&#39;ll fall in love with that&#39;s rich in character, history and activities of every variety.</p><p>Baltimore&#39;s Inner Harbor has gained a worldwide reputation for it shops, restaurants, museums, entertainment and natural beauty. It&#39;s no accident. This thoughtfully planned attraction isn&#39;t just for tourists; it&#39;s a rich resource for residents, too, with easy access to vibrant nightlife. If you like your action on the sports fields, the Baltimore Orioles and Baltimore Ravens provide big league diamond and gridiron thrills.</p><p>Baltimore, Maryland is a city on the move that just keeps getting better every day. At MRIShomes, you can find a local real estate professional to show you the best of Baltimore living, as well as all the homes for sale and available rentals. For information, contact a Baltimore expert at MRIShomes today!</p>";
                    $scope.className = "baltimore-banner";
                break;
                case "Bel-air":
                    $scope.placeHolder = "Bel Air, Maryland, United States";                
                    $scope.exploreContent = "<p>"+$scope.city+" is located in Maryland. Bel Air, Maryland has a population of 11,270. Bel Air is more family-centric than the surrounding county with 26.32% of the households containing married families with children. The county average for households married with children is 26.13%.</p><p>The median household income in Bel Air, Maryland is $61,347. The median household income for the surrounding county is $39,087 compared to the national median of $53,046. The median age of people living in Bel Air is 41.7 years.</p><p>The average high temperature in July is 84.65 degrees, with an average low temperature in January of 20.9 degrees. The average rainfall is approximately 43.6 inches per year, with 37.3 inches of snow per year. No weather information available.</p>";
                    $scope.className = "bel-banner";
                break;
                case "Bowie":
                    $scope.placeHolder = "Bowie, Maryland, United States";
                    $scope.heading = "Not too big. Not too small. Just right!";
                    $scope.exploreContent = "<p>Looking for real estate in Maryland that is family-friendly and affordable for a wide range of incomes? You&#39;ll find it in Bowie, Maryland! Built around the railroad revolution of the 1800&#39;s, Bowie has historic charm to spare. But don&#39;t let its rich history fool you, Bowie, Maryland is a booming little city with great dining, entertainment and attractions like the Orioles minor league baseball affiliate the Bowie Bay Sox, The Bowie Center for the Performing Arts and much more.</p><p>This family-oriented center also boasts 72 ball fields, three community centers and an ice arena, so kids will never have a shortage of wholesome activities. Growth has spurred development of single family homes and rental properties if you value modern amenities most. Of course old charm abounds, from fixer-upper diamonds-in-the-rough to carefully preserved historic real estate.</p><p>If you want to be near big cities, but live in a charming small city that is growing with employment and real estate opportunities, Bowie may be just the place for you. At MRIShomes, you can find a local real estate professional to show you every benefit of Bowie, Maryland, as well as all the real estate for sale or rent. For information on Bowie and nearby areas, contact a Bowie expert at MRIShomes today!</p>";
                    $scope.className = "bowie-banner";
                break;
                case "Columbia":
                    $scope.placeHolder = "Columbia, Maryland, United States";
                    $scope.exploreContent = "<p>Columbia is located in Maryland. Columbia, Maryland has a population of 100,735. Columbia is less family-centric than the surrounding county with 35.55% of the households containing married families with children. The county average for households married with children is 41.53%.</p><p>The median household income in Columbia, Maryland is $98,529. The median household income for the surrounding county is $107,821 compared to the national median of $53,046. The median age of people living in Columbia is 37.6 years.</p><p>The average high temperature in July is 87 degrees, with an average low temperature in January of 21.5 degrees. The average rainfall is approximately 44.4 inches per year, with 19.7 inches of snow per year. No weather information available.</p>";
                    $scope.className = "columbia-banner";
                break;
                case "Rockville":
                    $scope.placeHolder = "Rockville, Maryland, United States";
                    $scope.heading = "History, heritage and utterly unique urban living.";
                    $scope.exploreContent = "<p>Rockville is located in Maryland. Rockville, Maryland has a population of 60,960. Rockville is less family-centric than the surrounding county with 36.14% of the households containing married families with children. The county average for households married with children is 38.53%.</p><p>The median household income in Rockville, Maryland is $97,667. The median household income for the surrounding county is $96,985 compared to the national median of $53,046. The median age of people living in Rockville is 39.9 years.</p><p>The average high temperature in July is 87 degrees, with an average low temperature in January of 25 degrees. The average rainfall is approximately 40.4 inches per year, with 19 inches of snow per year. No weather information available.</p>";
                    $scope.className = "rockville-banner";
                break;
                case "Alexandria":
                    $scope.placeHolder = "Alexandria, Virginia, United States";
                    $scope.heading = "The perfect commute. An extraordinary community!";
                    $scope.exploreContent = "<p>You just got a job in Washington, D.C. And you&#39;re excited! But you want to live in a more relaxed place than the nation&#39;s capital. Join your neighbors in Alexandria, Virginia! It&#39;s The Beltway&#39;s most renowned bedroom community, with every genre of real estate you can imagine.</p><p>Alexandria, Virginia is about much more than convenience. Fine dining, chic boutiques and wonderful walks await you in its charming Old Town neighborhood. Perched on the Potomac, Alexandria offers simple pleasures like boating, fishing and scenic natural beauty to complement its stylish vibe.</p><p>So whether your tastes are seashore, smartly suburban, small city, or a little of each, you&#39;ll find optimal real estate in Alexandria, Virginia. Especially with help from MRIShomes! At MRIShomes, you can find a local real estate professional that can show you every amenity of Alexandria, as well as all the real estate for sale or rent on the market. For information on Alexandria, Virginia and nearby areas, contact an Alexandria expert at MRIShomes today!</p>";
                    $scope.className = "alex-banner";
                break;
                case "Annandale":
                    $scope.placeHolder = "Annandale, Virginia, United States";                
                    $scope.exploreContent = "<p>Annandale is located in Virginia. Annandale, Virginia has a population of 39,669. Annandale is less family-centric than the surrounding county with 33.99% of the households containing married families with children. The county average for households married with children is 41.73%.</p><p>The median household income in Annandale, Virginia is $77,151. The median household income for the surrounding county is $109,383 compared to the national median of $53,046. The median age of people living in Annandale is 38.4 years.</p><p>The average high temperature in July is 89 degrees, with an average low temperature in January of 24.3 degrees. The average rainfall is approximately 43.6 inches per year, with 7.2 inches of snow per year. No weather information available.</p>";
                    $scope.className = "annandale-banner";
                break;
                case "Arlington":
                    $scope.placeHolder = "Arlington, Virginia, United States";                
                    $scope.exploreContent = "<p>Arlington is located in Virginia. Arlington, Virginia has a population of 209,077. Arlington is less family-centric than the surrounding county with 35.18% of the households containing married families with children. The county average for households married with children is 35.18%.</p><p>The median household income in Arlington, Arlington is $102,459. The median household income for the surrounding county is $102,459 compared to the national median of $53,046. The median age of people living in Arlington is 33.7 years.</p><p>The average high temperature in July is 89 degrees, with an average low temperature in January of 24.3 degrees. The average rainfall is approximately 43.6 inches per year, with 7.2 inches of snow per year. No weather information available.</p>";
                    $scope.className = "arlington-banner";
                break;
                case "Fairfax":
                    $scope.placeHolder = "Fairfax, Virginia, United States";                
                    $scope.exploreContent = "<p>Fairfax is located in Virginia. Fairfax, Virginia has a population of 22,712. Fairfax is less family-centric than the surrounding county with 35.07% of the households containing married families with children. The county average for households married with children is 35.07%.</p><p>The median household income in Fairfax, Virginia is $98,563. The median household income for the surrounding county is $98,563 compared to the national median of $53,046. The median age of people living in Fairfax is 38.5 years.</p><p>The average high temperature in July is 89 degrees, with an average low temperature in January of 24.3 degrees. The average rainfall is approximately 43.6 inches per year, with 7.2 inches of snow per year. No weather information available.</p>";
                    $scope.className = "fairfax-banner";
                break;
                case "Falls Church":
                    $scope.placeHolder = "Falls Church, Virginia, United States";                
                    $scope.exploreContent = "<p>Falls Church is located in Virginia. Falls Church, Virginia has a population of 12,300. Falls Church is less family-centric than the surrounding county with 43.83% of the households containing married families with children. The county average for households married with children is 43.83%.</p><p>The median household income in Falls Church, Virginia is $122,844. The median household income for the surrounding county is $122,844 compared to the national median of $53,046. The median age of people living in Falls Church is 36.9 years.</p><p>The average high temperature in July is 89 degrees, with an average low temperature in January of 24.3 degrees. The average rainfall is approximately 43.6 inches per year, with 7.2 inches of snow per year. No weather information available.</p>";
                    $scope.className = "falls-banner";
                break;
                case "McLean":
                    $scope.placeHolder = "McLean, Virginia, United States";                
                    $scope.exploreContent = "<p>McLean is located in Virginia. McLean, Virginia has a population of 48,221. McLean is more family-centric than the surrounding county with 43.94% of the households containing married families with children. The county average for households married with children is 41.73%.</p><p>The median household income in McLean, Virginia is $179,066. The median household income for the surrounding county is $109,383 compared to the national median of $53,046. The median age of people living in McLean is 45.1 years.</p><p>The average high temperature in July is 89 degrees, with an average low temperature in January of 24.3 degrees. The average rainfall is approximately 43.6 inches per year, with 7.2 inches of snow per year. No weather information available.</p>";
                    $scope.className = "McLean-banner";
                break;
                case "Chambersburg":
                    $scope.placeHolder = "Chambersburg, Pennsylvania, United States";                
                    $scope.exploreContent = "<p>Chambersburg is located in Pennsylvania. Chambersburg, Pennsylvania has a population of 20,217. Chambersburg is less family-centric than the surrounding county with 27.32% of the households containing married families with children. The county average for households married with children is 30.8%.</p><p>The median household income in Chambersburg, Pennsylvania is $39,491. The median household income for the surrounding county is $52,167 compared to the national median of $53,046. The median age of people living in Chambersburg is 36.1 years.</p><p>The average high temperature in July is 85 degrees, with an average low temperature in January of 21 degrees. The average rainfall is approximately 40.8 inches per year, with 33.1 inches of snow per year. No weather information available.</p>";
                    $scope.className = "chamber-banner";
                break;
                default:
                    $scope.placeHolder = city+", "+$scope.stateName+", United States";
                    if($scope.stateName.trim() == 'MD') {
                        $scope.stateFullName = 'Maryland';
                    } else if($scope.stateName.trim() == 'VA') {
                        $scope.stateFullName = 'Virginia';
                    } else if($scope.stateName.trim() == 'PA') {
                        $scope.stateFullName = 'Pennsylvania';
                    } else if($scope.stateName.trim() == 'DC') {
                        $scope.stateFullName = 'D.C.';
                    }
                    $scope.heading = "History, heritage and utterly unique urban living.";
                    $scope.exploreContent = "<p>There are so many things you know about "+city+", "+$scope.stateFullName+" It&#39;s the nation&#39;s capital, an international focal point, and city where history is made every second of the day. But did you know it&#39;s also a fantastic place to live? With its fast pace, international influences, and dynamic power players, it&#39;s just the place for an adrenaline-filled lifestyle</p><p>"+city+", "+$scope.stateFullName+" also offers miles of greenbelt, jogging, biking trails and parks where you can work out, escape the hubbub and enjoy natural beauty, anytime. You can find condos, townhouses, rentals and single family real estate for sale in fashionable Foggy Bottom, hip and happening Georgetown, casual DuPont Circle and elsewhere throughout the city. You could even opt for suburbs like Alexandria, VA if you want a more relaxed pace and traditional residential feel.</p><p>Finding real estate for sale in "+city+", "+$scope.stateFullName+" can be challenging, but you&#39;re not alone! At MRIShomes, you can find a local real estate professional to show you every dimension of "+$scope.stateFullName+" living and every residential real estate listing on the market. For information, contact a "+city+", "+$scope.stateFullName+" expert at MRIShomes today!";
                    $scope.className = "wash-banner";
                break;
            }
            $("#location").attr("data", $scope.placeHolder);
            $scope.locationInfo = $scope.placeHolder;
	    }

        /* function to get boundary and polygon for respective city */
	    $scope.getCityBoundary = function() {
	    	 httpServices.getCityBoundaryDetails($scope.stateName,$scope.city).then(
                function (success) {
                    console.log(success,"success");
         			var mapDiv = document.getElementById('mapBound');
         			$scope.Latitude = success.Latitude;
         			$scope.Longitude = success.Longitude;
			        var map = new google.maps.Map(mapDiv, { center: {lat: success.Latitude, lng: success.Longitude}, zoom: 8});
                    var bounds = new google.maps.LatLngBounds();
                    var triangleCoords = [];
                    for(var i = 0; i < success.Polygon.length; i++) {
                        triangleCoords.push({lat: success.Polygon[i][1], lng: success.Polygon[i][0]});
                        bounds.extend(new google.maps.LatLng(success.Polygon[i][1], success.Polygon[i][0]));
                    }
                    var polygon = new google.maps.Polygon({
                        paths: triangleCoords,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35
                    });
                    polygon.setMap(map);
                    map.fitBounds(bounds);
                    $scope.getNearByOffice($scope.Latitude,$scope.Longitude);
                    $scope.getNearByCity($scope.Latitude,$scope.Longitude);

                }, function (error) {
                    return null;
            });

        }

        /* function to get demograhics and polygon for respective city */
	    $scope.getCityDemographics = function() {
	    	 httpServices.getCityDemographicsDetails($scope.stateName,$scope.city).then(
                function (success) {
                  if(success.alldemo && success.alldemo.length > 0) {
                    $scope.alldemo = success.alldemo[0];
                  }
         		}, function (error) {
                return null;
            });

	    }

        /* function to get school for respective city */
	    $scope.getCitySchools = function() {
	    	 httpServices.getCitySchoolsDetails($scope.stateName,$scope.city).then(
                function (success) {
                	$scope.schools = success;
                }, function (error) {
                return null;
            });
	    }

        /* function to get city detials for respective city */
	    $scope.getCity = function() {
	    	 httpServices.getCity($scope.stateName,$scope.city).then(
                function (success) {
         			$scope.ActiveListings = formatNumber(success.ActiveListings);
         			$scope.MedianSalePrice = success.MedianSalePrice;
         			$scope.ZipCodes = success.ZipCodes;
                }, function (error) {
                return null;
            });
	    }

        /* function to get near by office details for respective city */
	    $scope.getNearByOffice = function(Latitude,Longitude) {

            $scope.Latitude = $scope.Latitude ? $scope.Latitude : Latitude;
            $scope.Longitude = $scope.Longitude ? $scope.Longitude : Longitude;

	    	httpServices.getNearByOfficeDetails($scope.Latitude,$scope.Longitude,$scope.nearCityOffice).then(
                function (success) {
                    $scope.nearoffices = success;
                }, function (error) {
                return null;
            });
	    }

        /* function to get near by city details for respective city */
	    $scope.getNearByCity = function(Latitude,Longitude) {

            $scope.Latitude = $scope.Latitude ? $scope.Latitude : Latitude;
            $scope.Longitude = $scope.Longitude ? $scope.Longitude : Longitude;

	    	httpServices.getNearByCityDetails($scope.Latitude,$scope.Longitude,$scope.nearCityOffice,$scope.city).then(
                function (success) {
         			$scope.nearcities = success;
                }, function (error) {
                return null;
            });
	    }

        $scope.totalCountElementary = 0;
        $scope.countInitElementary = function() {
            return $scope.totalCountElementary++;
        }

        $scope.totalCountMiddle = 0;
        $scope.countInitMiddle = function() {
            return $scope.totalCountMiddle++;
        }

        $scope.totalCountHigh = 0;
        $scope.countInitHigh = function() {
            return $scope.totalCountHigh++;
        }

        $scope.totalCountUngraded = 0;
        $scope.countInitUngraded = function() {
            return $scope.totalCountUngraded++;
        }

        $scope.totalCountPrivate = 0;
        $scope.countInitPrivate = function() {
            return $scope.totalCountPrivate++;
        }

        $scope.totalCountColleges = 0;
        $scope.countInitColleges = function() {
            return $scope.totalCountColleges++;
        }

        $scope.getSearchResults = function (locationName) {
            $scope.locationName = $filter('titleCase')(locationName);
            $scope.location = [$scope.locationName+","+$scope.stateName+",United States"];
            $scope.searchData($scope.location);
        }

        $scope.getSearchResultsForHomeSale = function (city,state) {
            // $scope.locationName = $filter('titleCase')(locationName);
            $scope.location = [city+","+state+",United States"];
            $scope.searchData($scope.location);
        }

        $scope.getLocation = function() {
          $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?')
         .done (function(location)
         {
            $scope.currentlocationText = location.city+", "+location.state+", "+location.country_name;
         });


        }   

        $scope.complete=function() {
          var noResultLabel = "No results found";
          $( "#location" ).autocomplete({
              response: function(event, ui) {
                  if (!ui.content.length && ($scope.locationInfo.indexOf(",")==-1)) {
                      var noResult = { value: "", label: noResultLabel};
                      ui.content.push(noResult);
                  }
              },         
            focus: function (event, ui) {
                $scope.locationInfo = ui.item.value;
                $("#location").attr("data",ui.item.value);
                if(ui.item.label == noResultLabel) {
                 event.preventDefault();
                }
            },
            select: function (event, ui) {
                $scope.locationInfo = ui.item.value;
                $("#location").attr("data",ui.item.value);
                if(ui.item.label == noResultLabel){
                 event.preventDefault();
                }
            },
            change:function(event,ui){
                if(!ui.item){
                 event.preventDefault();
                }else{
                 $("#location").attr("data",ui.item.value);
                 event.preventDefault();
                }
            }
          }).autocomplete( "widget" ).addClass( "communitiesPageDropdown" );
          var citySuggestion = document.getElementById('location').value;
          if(citySuggestion) {
            httpServices.getCityDetails(citySuggestion).then(  
            function (success) {   
              if(success.length > 0) {
                $( "#location" ).autocomplete( "option", "source", success.map( function( el ) {
                  return el.city + ", " + el.state;
                }) ); 
              } else {
                $( "#location" ).autocomplete( "option", "source", success);  
              }

             $( "#location" ).autocomplete( "search" );

            }, function (error) {
              $( "#location" ).autocomplete( "option", "source", success);
            }); 
          }
        }

        $scope.searchData = function (location) {

            if( $scope.currentlocationText) {
                $rootScope.searchParameters['addresses'] = [$scope.currentlocationText];
            } else {
                $rootScope.searchParameters['addresses'] = location;
            }

            $scope.searchParameters.forsale = 1;
            $scope.searchParameters.location = applicationFactory.getLocations();
            $scope.searchParameters.localelistingstatus = "ACTIVE,CNTG/KO,CNTG/NO KO";

            var filterParam = angular.copy($scope.searchParameters);
            var parameters = applicationFactory.generateSearchURL(filterParam);
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
        }

        /* function to search properties */
        $scope.viewProperties = function () {        
        if ($scope.onclickOnViewPrptySubmit===1 && !$(".aa-notification").is(':visible')) {
            var isSelectedText = $("#location").attr("data");
            if(!$scope.locationInfo || (isSelectedText != $scope.locationInfo &&  !$scope.currentLocation)) {
            aaNotify.warning('Please select city from suggestion list', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                             //time to live in ms
            });
            $timeout(function() 
                    {
                        $scope.onclickOnViewPrptySubmit=1;
                    }, 3);
            return false;
         }
            $scope.exploreLocation = $scope.locationInfo;
            $scope.location = [$scope.exploreLocation];
            if($scope.exploreProptype == 'Residential') {
                $rootScope.searchParameters['propertytype'] = 'residential';
            } else if($scope.exploreProptype == 'Commercial') {
                $rootScope.searchParameters['propertytype'] = 'com';
            } else if($scope.exploreProptype == 'Lot-Land') {
                $rootScope.searchParameters['propertytype'] = 'land';
            } else if($scope.exploreProptype == 'Multi-Family') {
                $rootScope.searchParameters['propertytype'] = 'multifamily';
            }

            var isValidMin = /^[0-9,]*$/.test($scope.priceMin);
            var isValidMax = /^[0-9,]*$/.test($scope.priceMax);

            if((!isValidMin && $scope.priceMin != undefined) || (!isValidMax && $scope.priceMax != undefined)) {
                    aaNotify.error('The price range should be numbers.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                    $timeout(function() 
                    {
                        $scope.onclickOnViewPrptySubmit=1;
                    }, 3);
                    return false;
            }

            if($scope.priceMin && $scope.priceMax == undefined) {
                $rootScope.searchParameters['listingpricemin'] = formatNumber($scope.priceMin);
            } else if($scope.priceMin == undefined && $scope.priceMax) {
                $rootScope.searchParameters['listingpricemin'] = formatNumber(0);
                $rootScope.searchParameters['listingpricemax'] = formatNumber($scope.priceMax);
            } else if($scope.priceMin != undefined && $scope.priceMax != undefined) {

                 if(parseInt($scope.priceMin.replace(/,/g, "")) > parseInt($scope.priceMax.replace(/,/g, ""))) {
                    aaNotify.error('Minimum price should not exceed Maximum price.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                    $timeout(function() 
                    {
                        $scope.onclickOnViewPrptySubmit=1;
                    }, 3);
                    return false;
                } else if((!isValidMin && $scope.priceMin != undefined) || (!isValidMax && $scope.priceMax != undefined)) {
                    aaNotify.error('The price range should be numbers.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                    $timeout(function() 
                    {
                        $scope.onclickOnViewPrptySubmit=1;
                    }, 3);
                    return false;
                } else if((parseInt($scope.priceMin.replace(/,/g, "")) > 20000000 && $scope.priceMin != undefined) || (parseInt($scope.priceMax.replace(/,/g, "")) > 20000000 && $scope.priceMax != undefined) || (parseInt($scope.priceMin.replace(/,/g, "")) > parseInt($scope.priceMax.replace(/,/g, "")))) {
                    aaNotify.error('The price range should be between 0 and 20M.',{ showClose: true,iconClass: 'fa fa-exclamation-triangle'});
                    $timeout(function() 
                    {
                        $scope.onclickOnViewPrptySubmit=1;
                    }, 3);
                    return false;
                }

                $rootScope.searchParameters['listingpricemin'] = formatNumber($scope.priceMin);
                $rootScope.searchParameters['listingpricemax'] = formatNumber($scope.priceMax);
            }

            $scope.searchData($scope.location);
            return false;
            }
            else {
                return false;
            }
        }

        $scope.showOfficeDetails = function (officeAddress) {
            showCurrentAgentOfficeDetails(null,officeAddress);
        }

        $scope.getLocationInfo = function() {
            var isChromium = window.chrome,
            winNav = window.navigator,
            vendorName = winNav.vendor,
            isOpera = winNav.userAgent.indexOf("OPR") > -1,
            isIEedge = winNav.userAgent.indexOf("Edge") > -1,
            isIOSChrome = winNav.userAgent.match("CriOS");
            if (navigator.geolocation) {
                if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
                    $scope.showAddressFromLatLong();
                }else{
                    navigator.geolocation.getCurrentPosition($scope.getLocationString, $scope.showGetLocationError);
                }
            }
            else {
                $scope.showAddressFromLatLong();
            }
        }

      $scope.getLocationString = function(position) {      
        $scope.currentLocationLat = position.coords.latitude;
        $scope.currentLocationLon = position.coords.longitude;
        $scope.success = true;
        $scope.showAddressFromLatLong();
      }

      $scope.showAddressFromLatLong = function(){
         $.ajaxSetup({
            async: false
         });
         $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?')
          .done(function (location) {
            if($scope.currentLocation){
              $scope.locationInfo =  $scope.locationText = location.city + ", " + location.state + ", " + location.country_name + " (Current Location)";
               $scope.currentLocationLat = location.latitude;
               $scope.currentLocationLon = location.longitude;
            }else{
               $scope.locationInfo = "";
               $scope.locationText = "";
          } 
          $scope.chooseErrorPostion();
          $scope.$apply();
          });

      }

      $scope.chooseErrorPostion = function(){
        if(typeof $scope.error != "undefined" && $scope.error != "") {  
              $scope.errorNotificationTop();
          }
      }
      $scope.errorNotificationTop = function(){
           if(!$(".aa-notification").is(':visible') && $("#checkbox-id-control" ).is(':checked')){
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

      /* function to check secure for geo location */
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
    	$scope.init();
}]);

/* filter for title uppercase at first letter*/
angular.module('tlcengineApp').filter('titleCase', function() {
    return function(input) {
        input = input || '';
        return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
});
//angular.module('tlcengineApp', []).filter('titleCase', function() {
//    return function(input) {
//        input = input || '';
//        return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
//    };
//})

/* function for format the number */
function formatNumber (num) {
    if(num != undefined) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
}
