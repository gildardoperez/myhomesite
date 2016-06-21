'use strict';

/**
 * @ngdoc directive
 * @name tlcengineApp.directive:mapView
 * @description
 * # mapView
 */
angular.module('tlcengineApp')
  .directive('mapView', ['utilService', '$state', '$timeout', 'applicationFactory', 'aaNotify', 'ngDialog', '$rootScope', 'httpServices', 'appAuth',
    function (utilService, $state, $timeout, applicationFactory, aaNotify, ngDialog, $rootScope, httpServices, appAuth) {
      return {
        template: '<aside id="map"><aside id="map_overlay"></aside><p class="map-disclaimer">* Note that TLCengine is a comparative tool - your actual costs of owing a particular home will vary depending on your personal circumstances, such as your FICO score, type of heating/cooling system, age, others.</p></aside>',
        restrict: 'E',
        scope: {
          properties: '=properties',
          drawing: '=drawing',
          drawingCompleteCallback: '&drawingCompleteCallback',
          clearPolygon: '=clearPolygon',
          bookmarkHandler: "&bookmarkHandler",
          boundaries: '=boundaries',
          addClientFavoritePropertyEvent: '&addClientFavoritePropertyEventHandler',
          removeClientFavoritePropertyEvent: '&removeClientFavoritePropertyEventHandler'
        },
        replace: true,
        link: function postLink($scope, element, attrs) {
          $scope.$watch("properties", function (newValue, oldValue) {
            $scope.properties = newValue;

            if (newValue != oldValue) {
              $scope.drawMarkers();
            }
          }, true);

          $scope.$watch("drawing", function (newValue, oldValue) {
            $scope.drawing = newValue;

            if (newValue != oldValue) {
              //$scope.updateMarkers();
              if (newValue == true) {
                $scope.startDrawing();
              } else {
                $scope.stopDrawing();
              }
            }
          }, true);

          $scope.$watch("clearPolygon", function (newValue, oldValue) {
            $scope.clearPolygon = false;

            if (newValue != oldValue) {
              //$scope.updateMarkers();
              if (newValue == true) {
                $scope.doClearPolygon();
              }
            }
          }, true);

          $scope.$watch("boundaries", function (newValue, oldValue) {
            $scope.doClearPolygon();
            drawBoundary();
          }, true);

          function drawBoundary()
          {
            var setBoundaryZoom = false;
            if(typeof $scope.boundaries != 'undefined' && $scope.boundaries.length > 0) {              
              
              var zoomLevel = 0, maxLat = -85, minLat = 85, maxLon = -180, minLon = 180;

              for (var i = 0; i < $scope.boundaries.length; i++) {
                var boundary = $scope.boundaries[i];

                if(boundary.Latitude && boundary.Longitude ) {
                  if (boundary.Latitude > maxLat) {
                    maxLat = boundary.Latitude;
                  }

                  if (boundary.Latitude < minLat) {
                    minLat = boundary.Latitude;
                  }

                  if (boundary.Longitude > maxLon) {
                    maxLon = boundary.Longitude;
                  }

                  if (boundary.Longitude < minLon) {
                    minLon = boundary.Longitude;
                  }
                }
                

                if (boundary.Polygon != undefined && boundary.Polygon != null && boundary.Polygon.length > 0) {
                  drawPolygon(boundary.Polygon,boundary.Type,boundary.BoundaryName,i);
                }
              }
              
              if(maxLat != -85 && minLat != 85 && maxLon != -180 && minLon != 180) {
                var centerLatitude = (maxLat + minLat) / 2;
                var centerLongitude = (maxLon + minLon) / 2;

                var mpcenter = new Microsoft.Maps.Location(Number(centerLatitude), Number(centerLongitude));
                map.setView({center: mpcenter});

                if (maxLon != minLon && maxLat != minLat) {
                  setBoundaryZoom = true;

                  //best zoom level based on map width
                  var zoom1 = (Math.log(360.0 / 256.0 * ($("#map").outerWidth()) / (maxLon - minLon)) / Math.log(2));
                  //best zoom level based on map height
                  var zoom2 = Math.log(180.0 / 256.0 * ($("#map").outerHeight()) / (maxLat - minLat)) / Math.log(2);

                  var zoomLevel = parseInt((zoom1 < zoom2) ? zoom1 : zoom2);
                  map.setView({zoom: zoomLevel});
                }
              }

            }
            $scope.setBoundaryZoom = setBoundaryZoom;
           
          }

          var settings =applicationFactory.getSettings();
          var mapcenter = new Microsoft.Maps.Location(settings.latitude, settings.longitude), mapzoom = 11

          var map = null;
          var pinInfobox = null;
          var dataLayer = null;
          var infoboxLayer = null;
          var infobox = null;
          var infoboxPolygonLayer = null;
          var infoboxPolygon = null;
          var pinClusterer = null;
          var polygonHighlightLayer = null;

          function loadMap() {
            var keenObject = new Keen(settings.keenObject);

            var analyticEvent = {
              Activity: settings.BingKey,
              ContainerTag: "MapAccess",
              AudienceId: appAuth.getAudienceId(),
              AudienceType: $scope.AudienceType
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
          // $("#map").remove();
          //map = null;
            map = new Microsoft.Maps.Map(element[0], {
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
         
            getMapBounds();            
            //Add data layer
            dataLayer = new Microsoft.Maps.EntityCollection();
            map.entities.push(dataLayer);

            // Add infobox layer
            infoboxLayer = new Microsoft.Maps.EntityCollection();
            map.entities.push(infoboxLayer);

            //Prep InfoBox & add to infobox layer
            var infoboxOptions = {
              width: 10,
              height: 10,
              visible: false,
              offset: new Microsoft.Maps.Point(0, 20)
            };

            infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), infoboxOptions);

            infoboxLayer.push(infobox);

            Microsoft.Maps.Events.addHandler(map, 'click', hideInfobox);


            // Add Polygon infobox layer
            infoboxPolygonLayer = new Microsoft.Maps.EntityCollection();
            map.entities.push(infoboxPolygonLayer);

            var infoboxOptionsPolygon = {
              width:100,
              height:30,
              visible: false,
              offset: new Microsoft.Maps.Point(0, 0)
            };

            infoboxPolygon = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), infoboxOptionsPolygon);

            infoboxPolygonLayer.push(infoboxPolygon);

            polygonHighlightLayer = new Microsoft.Maps.EntityCollection();
            map.entities.push(polygonHighlightLayer);
          }

          loadMap();
          $rootScope.ComaprePropIDList = [];
         
          function displayInfobox(e) {
            
            infobox.setOptions({
              width: 430,
              height: 300,
              title: e.target.Title,
              description: e.target.Description,
              visible: true
              //offset: new Microsoft.Maps.Point(0, 25)
            });
    
            var propid = e.target.id;

            infobox.setLocation(e.target.getLocation());
            $(".Infobox").addClass('hide_polygon');            
            var windowWidth = $(window).width();
            var leftContainerWidth = $("#content").width();
            var bufferWidth = 30;
            var getMarkerOffsetX = e.pageX;
            var mapWidth = $(window).width() - $("#content").width();
            var averageMapWidth = mapWidth/2;
            var startPosition = leftContainerWidth + bufferWidth;
            var mapCenter = leftContainerWidth + averageMapWidth;

             var windowHeight= $(window).height();
            var topContainerheight = $("#search").height();
             var bottomContainerHeight= $(".footer-bottom").height();
             var containerHeight = $("#search").height() + $(".footer-bottom").height();
            var getMarkerOffsetY = e.pageY;
            var mapHeight = $(window).height() - containerHeight;
            var averageMapHeight = mapHeight/2;
            var halfAverageMapHeightWithoutContainer = averageMapHeight/2
            var halfAverageMapHeight = averageMapHeight/2 + containerHeight ;
            var threeByFourthHeight = averageMapHeight + halfAverageMapHeightWithoutContainer - 50;
            var startPositionY = topContainerheight;
            var mapCenteHeight = containerHeight + averageMapHeight;
                 
            if( getMarkerOffsetX <=mapCenter && getMarkerOffsetY > threeByFourthHeight){
              $(".Infobox").addClass('top_right');
               $(".Infobox").removeClass('bottom_right').removeClass('add_right').removeClass('bottom_left').removeClass('top_left').removeClass('add_left').removeClass('add_bottom').removeClass('add_top');              
            }else if( getMarkerOffsetX > mapCenter && getMarkerOffsetY > threeByFourthHeight){
              $(".Infobox").addClass('top_left');
              $(".Infobox").removeClass('top_right').removeClass('add_right').removeClass('bottom_right').removeClass('bottom_left').removeClass('add_left').removeClass('add_bottom').removeClass('add_top');
            }else if( getMarkerOffsetX <=mapCenter && getMarkerOffsetY > halfAverageMapHeight && getMarkerOffsetY < threeByFourthHeight  ){
              $(".Infobox").addClass('add_right');
              $(".Infobox").removeClass('bottom_right').removeClass('top_right').removeClass('bottom_left').removeClass('top_left').removeClass('add_left').removeClass('add_bottom').removeClass('add_top');              
            }else if( getMarkerOffsetX > mapCenter && getMarkerOffsetY > halfAverageMapHeight && getMarkerOffsetY < threeByFourthHeight  ){
              $(".Infobox").addClass('add_left');
              $(".Infobox").removeClass('top_right').removeClass('add_right').removeClass('bottom_right').removeClass('bottom_left').removeClass('top_left').removeClass('add_bottom').removeClass('add_top');
            }else if( getMarkerOffsetX <=mapCenter && getMarkerOffsetY < halfAverageMapHeight){
              $(".Infobox").addClass('bottom_right');
              $(".Infobox").removeClass('top_right').removeClass('add_right').removeClass('bottom_left').removeClass('top_left').removeClass('add_left').removeClass('add_bottom').removeClass('add_top');
            }else if(getMarkerOffsetX > mapCenter && getMarkerOffsetY < halfAverageMapHeight){
              $(".Infobox").addClass('bottom_left');
              $(".Infobox").removeClass('top_right').removeClass('add_right').removeClass('bottom_right').removeClass('top_left').removeClass('add_left').removeClass('add_bottom').removeClass('add_top');
            }

              // if ($("#remove-bookmark_" + this.target.id).hasClass('bookmark-active')) {
            if ($("#remove-bookmark_" + e.target.id)[0] != undefined) {
                if ($("#remove-bookmark_" + e.target.id)[0].style.display == "" || $("#remove-bookmark_" + e.target.id)[0].style.display == "inline-block") {
                    $(".remove-bookmark_" + e.target.id).show();
                    //   $(".remove-bookmark_" + this.target.id).addClass('bookmark-active')
                    $(".add-bookmark_" + e.target.id).hide();
                }
            }

            if ($("#remove-favorite_" + e.target.id)[0] != undefined) {

              var propertyId = e.target.id;
              var property = _.find($scope.properties,function(o){return o.Id == propertyId});

              if(property.IF)
              {
                $(".remove-favorite_" + e.target.id).show();
                $(".add-favorite_" + e.target.id).hide();
              }
              else
              {
                $(".remove-favorite_" + e.target.id).hide();
                $(".add-favorite_" + e.target.id).show();
              }                
            }
            if ((e.target._typeName).match(/cluster/g).length > 1)
                $(".Infobox").addClass('clusterPropPopup');
            if ($("#clusterPopup").attr('class') != undefined) {
                var divClass = $("#clusterPopup").attr('class').split('_')[1];
                $(".clusterPropPopup").addClass("CulsterHeight_" + divClass);
            }
            $(".Infobox").parent('div').parent('div').parent('div').css("z-index", "3");
            $(".bookmarkLink").on("click", function (e) {
              var listingId = $(this).data("id");
              var filterData = $scope.properties.filter(function (element) {
                if (element.Id == listingId) {
                  return element;
                }
              });

              if (filterData && filterData.length > 0) {
                $scope.bookmarkHandler()(filterData[0]);
              }
              if ($(this).data("btype") == "add") {
                $(".add-bookmark_" + listingId).hide();
                $("#add-bookmark_" + listingId).closest('li').addClass('bookmark-active');
                $("#add-bookmark_" + listingId).hide();
                $(".remove-bookmark_" + listingId).show();
                $("#remove-bookmark_" + listingId).show();
              }
              else {
                $(".add-bookmark_" + listingId).show();
                $("#add-bookmark_" + listingId).closest('li').removeClass('bookmark-active');
                $("#add-bookmark_" + listingId).show();
                $(".remove-bookmark_" + listingId).hide();
                $("#remove-bookmark_" + listingId).hide();

              }
            });

            $(".favoriteLink").on("click", function (e) {
                var listingId = $(this).data("id");

                var filterData = $scope.properties.filter(function (element) {
                    if (element.Id == listingId) {
                        return element;
                    }
                });

                if (filterData && filterData.length > 0) {
                  $scope.bookmarkHandler()(filterData[0], true, $(this).data("btype"));
                }
                
            });

            $(".mapPropDetail").on("click", function (e) {
              var listingId = propid;
              if(!listingId) {
                listingId = $(".mapPropDetail").attr("data-property-id");
              }
              $(".bookmark-title").removeClass('newBookmarkdiv');
              if ($state.current.name == 'tlc.search') {
                $state.go('tlc.search.propertydetail', {listingId: listingId});
              }else if ($state.current.name == 'tlcClient.search') {
                $state.go('tlcClient.search.propertydetail', { listingId: listingId });
              } else{
                $state.go('tlc.search.propertydetail', {listingId: listingId});
              }
            });

            $("#carousel_next").on("click", function (event) {
                var thisId = $(".carousel_active").attr("id")
                var thisIdSelector = "#" + thisId;
                var next = (+thisId+1); 
                var nextSelector = "#" + next;
                if($(nextSelector).length) {                
                  $(nextSelector).addClass("carousel_active");                
                  $(nextSelector).removeClass("carousel_inactive");                
                  $(thisIdSelector).removeClass("carousel_active");
                  $(thisIdSelector).addClass("carousel_inactive");
                }
                return false;                
            });

            $("#carousel_previous").on("click", function (event) {
                var thisId = $(".carousel_active").attr("id")
                var thisIdSelector = "#" + thisId;
                var previous = (+thisId-1); 
                var previousSelector = "#" + previous;
                if($(previousSelector).length) {
                  $(previousSelector).addClass("carousel_active");
                  $(previousSelector).removeClass("carousel_inactive");
                  $(thisIdSelector).addClass("carousel_inactive");                 
                  $(thisIdSelector).removeClass("carousel_active");
                }
                return false;
            });   

            $(".mapCompareProp").on("click", function (e) {
              ComapreMapProperty();
            });

            function ComapreMapProperty() {
                $(".propCompareCheckBox_Map").each(function (e) {
                    var propID = $(this).attr('id');
                    if ($(this).next('i').hasClass('checked')) {
                        if ($rootScope.ComaprePropIDList.indexOf(propID) == -1)
                            $rootScope.ComaprePropIDList.push(propID);
                    }
                    else {
                        if ($rootScope.ComaprePropIDList.indexOf(propID) != -1) {
                            var index = $rootScope.ComaprePropIDList.indexOf(propID)
                            $rootScope.ComaprePropIDList.splice(index, 1);
                        }
                    }
                });
                
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

                if ($rootScope.ComaprePropIDList.length < 2) {
                    aaNotify.danger('select atleast two property for comparison');
                }
                else if ($rootScope.ComaprePropIDList.length > 5) {
                    aaNotify.danger('select maximum five property for compare.');
                }
                else {
                    ngDialog.open({
                        template: 'views/templates/propertyComparePopup.html',
                        closeByEscape: false,
                        closeByDocument: false
                    });
                }
            }

            $(".propCompareCheckBox_Map").on("click", function (e) {
                $("#imap_" + $(this).attr('id')).toggleClass('checked');
                $("#i_" + $(this).attr('id')).toggleClass('checked');
                var propID = $(this).attr('id');
                if ($(this).next('i').hasClass('checked')) {
                    if ($rootScope.ComaprePropIDList.indexOf(propID) == -1)
                        $rootScope.ComaprePropIDList.push(propID);
                }
                else {
                    if ($rootScope.ComaprePropIDList.indexOf(propID) != -1) {
                        var index = $rootScope.ComaprePropIDList.indexOf(propID)
                        $rootScope.ComaprePropIDList.splice(index, 1);
                    }
                }
            });

            $(".removePop").on("click", function (e) {
                hideInfobox();
            })
           // A buffer limit to use to specify the infobox must be away from the edges of the map.

            var buffer = 100;
            var infoboxOffset = infobox.getOffset();
          //  console.log(infoboxOffset.x);
           // console.log(infoboxOffset.y);
            var infoboxAnchor = infobox.getAnchor();
           // console.log(infoboxAnchor.x);
           // console.log(infoboxAnchor.y);
            var infoboxLocation = map.tryLocationToPixel(e.target.getLocation(), Microsoft.Maps.PixelReference.control);
            var dx = infoboxLocation.x + infoboxOffset.x - infoboxAnchor.x;
            var dy = infoboxLocation.y - 25 - infoboxAnchor.y;            
            $('.title-tipso').tipso();

          }

          function hideInfobox() {
            infobox.setOptions({
              visible: false
            });
            infoboxPolygon.setOptions({
              visible: false
            });
          }

          $scope.drawMarkers = function () {
            if ($state.current.name.indexOf("propertydetail") > -1) {
              return;
            }
            
            var tempArray = [];
            if($scope.properties){
              for(var i = 0; i< $scope.properties.length; i++){
                var current = $scope.properties[i];
                var a = tempArray.filter(function(e){
                  return e.LG == current.LG && e.LT == current.LT;
                });
                if(a.length > 0){
                  current.LG = (current.LG + ( 0.000010 * a[0].count));
                  current.LT = (current.LT + ( 0.000010 * a[0].count));
                  a[0].count ++;
                }else{
                  tempArray.push({"LG":current.LG, "LT":current.LT, "count": 1});
                }
              }
            }


            dataLayer.clear();
            hideInfobox();
            clearClustering();

            var longitude = { min: 0, max: 0 };
            var latitude = { min: 0, max: 0 };

            for (var i in $scope.properties) {
              var property = $scope.properties[i];

              if (longitude.min == 0 && longitude.max == 0) {
                longitude.min = property.LG;
                longitude.max = property.LG;
              }

              if (latitude.min == 0 && latitude.max == 0) {
                latitude.min = property.LT;
                latitude.max = property.LT;
              }

              if (property.LG < longitude.min) {
                longitude.min = property.LG;
              }

              if (property.LG > longitude.max) {
                longitude.max = property.LG;
              }

              if (property.LT < latitude.min) {
                latitude.min = property.LT;
              }

              if (property.LT > latitude.max) {
                latitude.max = property.LT;
              }

            }

            var avgLongitude = (longitude.min + longitude.max) / 2
            var avgLatitude = (latitude.min + latitude.max) / 2

            var closePopup;
            var locs = [];
            for (var i in $scope.properties) {
              var property = $scope.properties[i];
              var price = getSortPrice($scope.properties[i].LP);
              var iconUrl = property.OH != undefined ? '/images/markers/7.png' :'/images/markers/0.png';
              var largeIconUrl = property.OH != undefined ? '/images/markers/7.png' :'/images/markers/0_Large.png';
              var pin = new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(Number(property.LT), Number(property.LG)),
                { icon: iconUrl, width: 33, height: 42, typeName: 'pincursor show_propIcon zoomOut_map prop_' + property.Id + '' }
              );

              locs.push(new Microsoft.Maps.Location(Number(property.LT), Number(property.LG)));

              pin.id = property.Id;
              pin.Title = "";
             // if($(window).width()<1400){
                pin.Description = getPropertyDetailPopupLaptop(property);
             // }else
             //   pin.Description = getPropertyDetailPopup(property);
              Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
//              dataLayer.push(pin);

              var pin_large = new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(Number(property.LT), Number(property.LG)),
                { icon: largeIconUrl, width: 33, height: 42, typeName: 'pincursor zoomIn_map hide_propIcon prop_' + property.Id + '', text: price }
              );
              pin_large.id = property.id;
              pin_large.Title = "";
             // if($(window).width()<1400){
                pin_large.Description = getPropertyDetailPopupLaptop(property);
              //}else
              //  pin_large.Description = getPropertyDetailPopup(property);
              Microsoft.Maps.Events.addHandler(pin_large, 'click', displayInfobox);
//              dataLayer.push(pin_large);

            }

            setTimeout(function () {
              var pushpin_has_text = false;
              Microsoft.Maps.Events.addHandler(map, 'mousewheel', function (e) {
                hideInfobox();
                if (map.getZoom() >= 14 && !pushpin_has_text) {
                  $(".zoomIn_map").removeClass('hide_propIcon');
                  $(".zoomOut_map").addClass('hide_propIcon');
                  pushpin_has_text = true;
                }
                else if (map.getZoom() < 14 && pushpin_has_text) {
                  $(".zoomIn_map").addClass('hide_propIcon');
                  $(".zoomOut_map").removeClass('hide_propIcon');
                  pushpin_has_text = false;
                }
              });

            }, 1000);
           
            if ($scope.properties != undefined && $scope.properties.length > 0) {

                var propertiesList = angular.copy($scope.properties);
                propertiesList.forEach(function(e){
                    e.longitude = e.LG;
                    e.latitude = e.LT;
                    e.iconPath = e.OH != undefined ? '/images/markers/7.png' :'/images/markers/0.png';
//                    return e;
                });
//                console.log("propertiesList", propertiesList);
            
                pinClusterer = new PinClusterer(map, {
                    gridSize: 40,
                    onClusterToMap: function(pushpin, cluster) {
                        // hideInfobox();
                        if(cluster.length > 1){
                            // console.log("Cluster with ", cluster);
                            /*Display cluster infobox.*/
                            pushpin.Title = "";
                            if(pushpin.data.length > 0){                              
                                pushpin.Description = getPropertyClusterPopup(pushpin.data);
                                
                                 
                                   Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', displayInfobox  );
                                    
                            //   Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', hideInfobox);
                            }                            
                        }
                        else{
                            // console.log("pushpin with ", cluster);
                            /*Display detail Infobox*/
                            pushpin.id = pushpin.data[0].Id;
                            pushpin.Title = "";
                            if(pushpin.data.length > 0){
                              //if($(window).width()<1400)
                                  pushpin.Description = getPropertyDetailPopupLaptop(pushpin.data[0]);
                             // else
                               //   pushpin.Description = getPropertyDetailPopup(pushpin.data[0]);
                            }
                            Microsoft.Maps.Events.addHandler(pushpin, 'click', displayInfobox);
                        }
                    }
                });

                pinClusterer.cluster(propertiesList);

                if ($scope.setBoundaryZoom == false) {
                  /*Set zoom leval */
                  $scope.setMapCenter(avgLatitude, avgLongitude);
                  map.setView({zoom:mapzoom});

                  // var bestview = Microsoft.Maps.LocationRect.fromLocations(locs);
                  // map.setView({bounds:bestview });
                }
            }            

          }

          var eventcount = 0, polygonpoints = [], polygonthreshold = 10;

          var resizeCanvas = function () {
              var canvas = $("#drawing")[0];
              if (canvas) {
                canvas.width = $("#map").outerWidth();
                canvas.height = $("#map").outerHeight();
              }
            }, // make sure the drawing canvas is the appropriate size whenever the window size changes
            eventcount = 0, // cache var for measuring the number of drawing events per draw
            polygonpoints = []; // for each "polygonthreshold" drawing event, push lat,lng coordinate into this array

          // bind resize callback to resize event
          $(window).on("resize", resizeCanvas);
          // resize on page load
          resizeCanvas();

          $scope.addPushpin = function (latitude, longitude) {
            var pin = new Microsoft.Maps.Pushpin(
              new Microsoft.Maps.Location(Number(latitude), Number(longitude)),
              { icon: '/images/markers/marker-pink-32.png', width: 33, height: 42, typeName: 'pincursor zoomOut_map' }
            );

            dataLayer.push(pin);

            var pin_large = new Microsoft.Maps.Pushpin(
              new Microsoft.Maps.Location(Number(latitude), Number(longitude)),
              { icon: '/images/markers/marker-pink-48.png', width: 33, height: 42, typeName: 'pincursor zoomIn_map hide_propIcon', text: price }
            );
            dataLayer.push(pin_large);
            var mpcenter = new Microsoft.Maps.Location(Number(latitude), Number(longitude));
            map.setView({ center: mpcenter });

          }

          $scope.setMapCenter = function (latitude, longitude) {
              var mpcenter = new Microsoft.Maps.Location(Number(latitude), Number(longitude));
              map.setView({ center: mpcenter });
          }

          $scope.startDrawing = function () {
            // user wasn't in draw mode, bring up help, cancel button and create the canvas
            $("#drawhelp").addClass("active");
            //              $(this).addClass("active").html('<i class="fa fa-times"></i> Cancel drawing');


            var board = $('<canvas id="drawing" />');
            board.appendTo("#map");
            resizeCanvas();            

            // clear polygonpoints
            polygonpoints = [];

            // init the sketch lib for the canvas
            $("#drawing").sketch({
              drawCallback: function (x, y) { // for each draw event

                // get rid of all the markers and stuff
                if (eventcount == 0) {
                  /** HOX: Clear map of everything

                   For Bing:             */
                    //map.entities.clear();
                  infobox.setOptions({ visible: false });
                  //dataLayer.clear();
                  //clearClustering();

                }

                // if it's the "polygonthreshold"th event, push a point
                if (eventcount % polygonthreshold == 0) {
                  polygonpoints.push(
                    // * HOX: call function here to resolve a pixel coordinate of the map element to lat,lng coordinate of the map

                    //  For Bing: 
                    map.tryPixelToLocation(new Microsoft.Maps.Point(x, y), Microsoft.Maps.PixelReference.control)

                  );
                }

                // increment event count
                eventcount++;
              },
              stopCallback: function () { // once the user lets go
                // delete the canvas
                $("#drawing").remove();
                // push the first point at the end, so the polygon is properly closed
                polygonpoints.push(polygonpoints[0]);

                // * HOX: call function here to draw a polygon on the map based on an array of lng,lng coordinates as per in previous HOX

                 // For Bing:
                map.entities.push(
                  new Microsoft.Maps.Polygon(polygonpoints, {
                    fillColor: new Microsoft.Maps.Color(40, 247, 148, 30),
                    strokeColor: new Microsoft.Maps.Color(210, 247, 148, 30),
                    strokeThickness: 4
                  })
                );


                // return to normalcy
                $("#drawhelp").removeClass("active");
                //                      $("#draw").removeClass("active").html('<i class="fa fa-pencil"></i> Redraw the area');
                drawingCompletes(polygonpoints);
                eventcount = 0;
              }
            }).on("mousewheel", function (e) {
              // handle scrollwheel zooming while drawing

              /** HOX: code here to capture mousewheel usage on top of the drawing canvas, and zooming the map manually to reflect it

               For Bing: */
              mapzoom = mapzoom + e.deltaY;
              map.setView({ zoom: mapzoom, center: map.tryPixelToLocation(new Microsoft.Maps.Point(e.offsetX, e.offsetY), Microsoft.Maps.PixelReference.control), animate: true });

            });

          }


          $scope.stopDrawing = function () {
            $("#drawing").remove();
            $("#drawhelp").removeClass("active");
            //              $(this).removeClass("active").html('<i class="fa fa-pencil"></i> Draw an area');
          }

          $scope.doClearPolygon = function () {
            if (map) {
              for (var i = map.entities.getLength() - 1; i >= 0; i--) {
                var polygon = map.entities.get(i);
                if (polygon instanceof Microsoft.Maps.Polygon) {
                  map.entities.removeAt(i);
                }
              }
            }
          }

          function drawingCompletes(polygon) {
            var polygonString = '';
            for (var ind in polygon) {
              if (polygon[ind].longitude != undefined && polygon[ind].latitude != undefined) {
                if (polygonString != "") {
                  polygonString = polygonString + ","
                }
                polygonString = polygonString + parseFloat(polygon[ind].longitude).toFixed(3) + " ";
                polygonString = polygonString + parseFloat(polygon[ind].latitude).toFixed(3);
              }
            }

            var data = { "polygon": polygonString };
            //              $scope.drawing = false;
            $scope.drawingCompleteCallback()(data);
          }

          function drawPolygon(polygon,type,boundaryName,index) {
            //$scope.oldpolygon = polygon;
            var polygonPoints = [];
            for (var i = 0; i < polygon.length; i++) {
              polygonPoints.push(new Microsoft.Maps.Location(polygon[i][1], polygon[i][0]));
            }

            if(!index)
              index = 0;

            var color = ["#000080","#F48384", "#00C38A", "#3E4651", "#7cb5ec"];
            var polygon = new Microsoft.Maps.Polygon(polygonPoints, {
              fillColor: new Microsoft.Maps.Color(40, 59, 48, 207) ,
              strokeColor: new Microsoft.Maps.Color.fromHex(color[index]),
              strokeThickness: 4
            });

            if(boundaryName)
            {
              polygon.Metadata = {
                title: boundaryName
              };

              map.entities.push(polygon);

              Microsoft.Maps.Events.addHandler(polygon, 'mouseover', displayPolygonInfobox);
              Microsoft.Maps.Events.addHandler(polygon, 'mouseout', hideInfobox);
            }
            else {
              map.entities.push(polygon);
            }
            /*Change zoom level*/
            //                    var zoomLevel = map.getZoom();
            //                    zoomLevel += 1;
            //                    map.setView({ zoom: zoomLevel });
          }

          function displayPolygonInfobox(e){
            if(e.target){
              var point = new Microsoft.Maps.Point(e.getX(), e.getY());
              var loc = map.tryPixelToLocation(point);
              infoboxPolygon.setLocation(loc);

              var opt = e.target.Metadata;
              opt.visible = true;
              infoboxPolygon.setOptions(opt);

              $(".Infobox").not(".hide_polygon").addClass('infoboxPolygon');
            }
          }

          function getMapBounds() {
            var mapBounds = {};
            var bounds = {};            
            if (map) {
              if($("#terms").val()) {
                bounds = map.getBounds();
                mapBounds.center = bounds.center;
                mapBounds.northwest = { "latitude": Math.round(bounds.getNorthwest().latitude * 100) / 100, "longitude": Math.round(bounds.getNorthwest().longitude * 100) / 100 };
                mapBounds.southeast = { "latitude": Math.round(bounds.getSoutheast().latitude * 100) / 100, "longitude": Math.round(bounds.getSoutheast().longitude * 100) / 100 };
                mapBounds.southwest = { "latitude": Math.round(bounds.getSouth() * 100) / 100, "longitude": Math.round(bounds.getWest()  * 100) / 100 };
                mapBounds.northeast = { "latitude": Math.round(bounds.getNorth() * 100) / 100, "longitude": Math.round(bounds.getEast() * 100) / 100 };                
              } else {
                  var locationList = [];
                  var mapcenter = new Microsoft.Maps.Location(Number(settings.latitude), Number(settings.longitude));
                  settings.initBounds.forEach(function(coordinates) {
                      locationList.push(new Microsoft.Maps.Location(coordinates[0], coordinates[1]));
                  });
                  map.setView({
                    bounds: Microsoft.Maps.LocationRect.fromLocations(locationList),
                    zoom : 13,
                    center : mapcenter
                  });  
                  bounds = map.getBounds();
                  mapBounds.center = bounds.center;
                  mapBounds.northwest = { "latitude": locationList[0].latitude, "longitude": locationList[0].longitude };
                  mapBounds.southeast = { "latitude": locationList[1].latitude, "longitude": locationList[1].longitude };
                  mapBounds.southwest = { "latitude": locationList[2].latitude, "longitude": locationList[2].longitude };
                  mapBounds.northeast = { "latitude": locationList[3].latitude, "longitude": locationList[3].longitude };
              
            }
            return mapBounds;
          }

        }

          applicationFactory.setMapBoundsMethod(getMapBounds);
          

            function getPropertyDetailPopupLaptop(property) {
              $scope.AudienceType = appAuth.isLoggedIn().AudienceType;
              /*     var type= $scope.AudienceType;
               console.log(type);*/

              var Bookmarkbox = "";

              if ($scope.AudienceType == 'MLSAGENT') {

                if(property.DTI == true)
                {
                    Bookmarkbox =
                      '<div class="bookmark-box-laptop">' +
                      '                        <a class="bookmarkLink title-tipso add-bookmark_' + property.Id + '" title="Add Bookmark"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="add"><i class="fa fa-bookmark"></i></a>' +
                      '                        <a style="display:none;" class="bookmarkLink active title-tipso remove-bookmark_' + property.Id + '" title="Remove Bookmark"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="remove"><i class="fa fa-bookmark"></i></a>' +
                    '                    </div>';
                }

              }

              else if ($scope.AudienceType == 'CLIENT' || $scope.AudienceType == 'AnonymousUser') {

                  Bookmarkbox =
                    '<div class="bookmark-box bookmark-box-fav-laptop">' +
                    '   <a class="favoriteLink title-tipso add-favorite_' + property.Id + '" title="Add Favorite"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="add" ><i class="fa fa-heart"></i></a>' +
                    '   <a style="display:none;" class="active title-tipso remove-favorite_' + property.Id + '" title="Favorited"  href="javascript:void(0);" data-id="' + property.Id + '"  data-Btype="remove"><i class="fa fa-heart"></i></a>' +
                    '</div>';
              
              }

            var htmlString =

              '<div class="property-popup-wrapper ">' +
              '    <div class="property-map-pushpin">' +
//              '        <a class="map-pushpin" href="#">'+
//              '            <div class="markerPrimary green-darker-small"></div>'+
//              '        </a>'+
              '        <div class="property-listingBalloon">' +
              '            <div class="ListingBalloonContainer">' +
              '                <div class="property-detail-box property-box">' +
              '                    <div class="property-img-box">' +
              '                        <img data-property-id="' + property.Id + '" src="' + getDefaultUrl(property.Photos) + '" alt="" class="mapPropDetail"/>' +  Bookmarkbox ;

              if(property.OH != undefined){
                  htmlString = htmlString +
                  '                    <div class="open_house_box orange">' +
                  '                        <a href="javascript:void(0)">open house</a>' +
                  '                    </div>';
              }

              var propAdd = "";
              var propCity = "";
              var propState = "";
              if (property.SA != null) { propAdd = property.SA; }
              if (property.CT != null) { propCity = property.CT+", "; }
              if (property.ST != null) { propState = property.ST+", "; }

              htmlString = htmlString +
             

              '                    </div>' +
              '                    <div class="property-info-box ">' +
              '                        <div class="property-description mapPropDetail">' +
              '                            <ul>' ;

              if(property.PT && property.PT == 'MF') {
                htmlString = htmlString +
                  '                                <li ng-if="property.NU !=0">' +
                  '                                    <div class="property-item">' +
                  '                                        <span>UNITS</span>' +
                  '                                        <b> : </b>' +
                  '                                        <h3>' + property.NU + '</h3>' +
                  '                                    </div>' +
                  '                                </li>';
              }else{
                htmlString = htmlString +
                '                                <li ng-if="property.BD !=0">' +
                '                                    <div class="property-item">' +
                '                                        <span>BEDS</span>' +
                '                                        <b> : </b>' +
                '                                        <h3>' + property.BD + '</h3>' +
 
                '                                    </div>' +
                '                                </li>' +
                '                                <li ng-if="property.BDI !=0">' +
                '                                    <div class="property-item">' +
                '                                        <span>BATH</span>' +
                '                                        <b> : </b>' +
                '                                        <h3>' + property.BDI + '</h3>' +
          
                '                                    </div>' +
                '                                </li>';
              }

              htmlString = htmlString +
              '                                <li ng-if="property.LA !=0">' +
              '                                    <div class="property-item">' +
              '                                        <span>SQFT</span>' +
              '                                        <b> : </b>' +
              '                                        <h3>' + formatNumber(property.LA) + '</h3>' +
              '                                    </div>' +
              '                                </li>' +
              '                                <li>' +
              '                                    <div class="property-item irregular-item">' +
              '                                        <span>mls no</span>' +
              '                                        <b> : </b>' +
              '                                        <h3>' + (property.MN) + '</h3>' +
              '                                    </div>' +
              '                                </li>' +
              '                            </ul>' +
              '                        </div>' +
              '<div class="more-function_map">'+
              '<div class="compare-box">' +
              '<label class="checkbox-custom">'+
              '<input id=' + property.Id + ' type="button"  checked="checked" class="propCompareCheckBox_Map">' +
              '<i id="imap_'+property.Id+'" class="fa fa-fw fa-square-o"></i><a href="javascript:void(0)" class="mapCompareProp">Compare</a></label>' +
              '</div>' +              
              '</div>'+
               '                    </div>' +
                '                    <div class="bookmark-box bookmark-box-laptop removePop">' +
              '                        <a title="Close Popup"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="add"><i class="fa fa-times fa-2"></i></a>' +
              '                    </div>' +
               '                        <div data-property-id="'+ property.Id +'" class="property-title-price mapPropDetail">' +
              '                            <div class="property-title-box text-left ">';
               if(!property.DTI && $scope.AudienceType == 'MLSAGENT') {
                htmlString = htmlString +
                  '<div class="tooltipAgent"><img src="/images/dtai.png" class="imgPadding"/>'+
                    '<span class="tooltiptext">Listing will not be shown to the consumers.</span>'+
                   '</div>';
              } else if(!property.DTAI && $scope.AudienceType == 'MLSAGENT') {
                htmlString = htmlString +
                  '<div class="tooltipAgent"><img src="/images/dtai.png" class="imgPadding" />'+
                    '<span class="tooltiptext">Listing address will not be shown to the consumers.</span>'+
                  '</div>';
              }
              htmlString = htmlString +

              '                                <h1><a href="#">' + propAdd + '</a></h1>' +
              '                                <h5>' + propCity + '' + propState + '' + property.PC + '</h5>' +
              '                            </div>' +
              '                            <div class="property-price-box text-right">' +
              '                                <h1><span class="price-dollar">$</span>' + getSortPrice(property.LP) + '</h1>' +
              '                                <h5>TLC: $' + formatNumber(property.TLC) + '</h5>' +
              '                            </div>' +
              '                        </div>' +
              '                </div>' +

             
              '            </div>' +
              '        </div>' +
              '    </div>' +

              '</div>';
            return htmlString;
          }


          function getPropertyDetailPopup(property) {
              $scope.AudienceType = appAuth.isLoggedIn().AudienceType;
              /*     var type= $scope.AudienceType;
               console.log(type);*/

              var Bookmarkbox = "";

              if ($scope.AudienceType == 'MLSAGENT') {

                if(property.DTI == true)
                {
                    Bookmarkbox =
                      '<div class="bookmark-box">' +
                      '                        <a class="bookmarkLink title-tipso add-bookmark_' + property.Id + '" title="Add Bookmark"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="add"><i class="fa fa-bookmark"></i></a>' +
                      '                        <a style="display:none;" class="bookmarkLink active title-tipso remove-bookmark_' + property.Id + '" title="Remove Bookmark"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="remove"><i class="fa fa-bookmark"></i></a>' +
                    '                    </div>';
                }

                Bookmarkbox = Bookmarkbox +
                  '                    <div class="bookmark-box removePop">' +
                  '                        <a title="Close Popup"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="add"><i class="fa fa-times fa-2"></i></a>' +
                  '                    </div>';
              }

              else if ($scope.AudienceType == 'CLIENT' || $scope.AudienceType == 'AnonymousUser') {

                  Bookmarkbox =
                    '<div class="bookmark-box">' +
                    '   <a class="favoriteLink title-tipso add-favorite_' + property.Id + '" title="Add Favorite"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="add" ><i class="fa fa-heart"></i></a>' +
                    '   <a style="display:none;" class="active title-tipso remove-favorite_' + property.Id + '" title="Favorited"  href="javascript:void(0);" data-id="' + property.Id + '"  data-Btype="remove"><i class="fa fa-heart"></i></a>' +
                    '</div>' +
                    '<div class="bookmark-box removePop">' +
                    '   <a title="Close Popup"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="add"><i class="fa fa-times fa-2"></i></a>' +
                    '</div>';
              }

            var htmlString =

              '<div class="property-popup-wrapper ">' +
              '    <div class="property-map-pushpin">' +
//              '        <a class="map-pushpin" href="#">'+
//              '            <div class="markerPrimary green-darker-small"></div>'+
//              '        </a>'+
              '        <div class="property-listingBalloon">' +
              '            <div class="ListingBalloonContainer">' +
              '                <div class="property-detail-box property-box">' +
              '                    <div class="property-img-box">' +
              '                        <img data-property-id="'+ property.Id +'" src="' + getDefaultUrl(property.Photos) + '" alt="" class="mapPropDetail"/>' +  Bookmarkbox ;

              if(property.OH != undefined){
                  htmlString = htmlString +
                  '                    <div class="open_house_box orange">' +
                  '                        <a href="javascript:void(0)">open house</a>' +
                  '                    </div>';
              }

              var propAdd = "";
              var propCity = "";
              var propState = "";
              if (property.SA != null) { propAdd = property.SA; }
              if (property.CT != null) { propCity = property.CT+", "; }
              if (property.ST != null) { propState = property.ST+", "; }

              htmlString = htmlString +
              '                    <div class="bookmark-box removePop">' +
              '                        <a title="Close Popup"  href="javascript:void(0);" data-id="' + property.Id + '" data-Btype="add"><i class="fa fa-times fa-2"></i></a>' +
              '                    </div>' +

              '                    </div>' +
              '                    <div class="property-info-box ">' +
              '                        <div class="property-title-price data-property-id="'+ property.Id +'" mapPropDetail">' +
              '                            <div class="property-title-box text-left ">';
               if(!property.DTI && $scope.AudienceType == 'MLSAGENT') {
                htmlString = htmlString +
                  '<div class="tooltipAgent"><img src="/images/dtai.png" class="imgPadding"/>'+
                    '<span class="tooltiptext">Listing will not be shown to the consumers.</span>'+
                   '</div>';
              } else if(!property.DTAI && $scope.AudienceType == 'MLSAGENT') {
                htmlString = htmlString +
                  '<div class="tooltipAgent"><img src="/images/dtai.png" class="imgPadding" />'+
                    '<span class="tooltiptext">Listing address will not be shown to the consumers.</span>'+
                  '</div>';
              }
              htmlString = htmlString +

              '                                <h1><a href="#">' + propAdd + '</a></h1>' +
              '                                <h5>' + propCity + '' + propState + '' + property.PC + '</h5>' +
              '                            </div>' +
              '                            <div class="property-price-box text-right">' +
              '                                <h1><span class="price-dollar">$</span>' + getSortPrice(property.LP) + '</h1>' +
              '                                <h5>TLC: $' + formatNumber(property.TLC) + '</h5>' +
              '                            </div>' +
              '                        </div>' +

              '                        <div class="property-description data-property-id="'+ property.Id +'" mapPropDetail">' +
              '                            <ul>' ;

              if(property.PT != undefined && property.PT == 'MF') {
                htmlString = htmlString +
                  '                                <li ng-if="property.NU !=0">' +
                  '                                    <div class="property-item">' +
                  '                                        <h3>' + property.NU + '</h3>' +
                  '                                        <span>UNITS</span>' +
                  '                                    </div>' +
                  '                                </li>';
              }else{
                htmlString = htmlString +
                '                                <li ng-if="property.BD !=0">' +
                '                                    <div class="property-item">' +
                '                                        <h3>' + property.BD + '</h3>' +
                '                                        <span>BEDROOMS</span>' +
                '                                    </div>' +
                '                                </li>' +
                '                                <li ng-if="property.BDI !=0">' +
                '                                    <div class="property-item">' +
                '                                        <h3>' + property.BDI + '</h3>' +
                '                                        <span>BATHROOMS</span>' +
                '                                    </div>' +
                '                                </li>';
              }

              htmlString = htmlString +
              '                                <li ng-if="property.LA !=0">' +
              '                                    <div class="property-item">' +
              '                                        <h3>' + formatNumber(property.LA) + '</h3>' +
              '                                        <span>SQFT</span>' +
              '                                    </div>' +
              '                                </li>' +
              '                                <li>' +
              '                                    <div class="property-item irregular-item">' +
              '                                        <h3>' + (property.MN) + '</h3>' +
              '                                        <span>mls no</span>' +
              '                                    </div>' +
              '                                </li>' +
              '                            </ul>' +
              '                        </div>' +
              '<div class="more-function_map">'+
              '<div class="compare-box">' +
              '<label class="checkbox-custom">'+
              '<input id=' + property.Id + ' type="button"  checked="checked" class="propCompareCheckBox_Map">' +
              '<i id="imap_'+property.Id+'" class="fa fa-fw fa-square-o"></i><a href="javascript:void(0)" class="mapCompareProp">Compare</a></label>' +
              '</div>' +              
              '</div>'+
              '                </div>' +

              '                    </div>' +
              '            </div>' +
              '        </div>' +
              '    </div>' +

              '</div>';
            return htmlString;
          }

            function getClusterAddress(clusterData){
                if(clusterData.length > 0){
                    clusterData[0].CT
                }
                return "";
            }
            Array.prototype.max = function() {
              return Math.max.apply(null, this);
            };

            Array.prototype.min = function() {
             return Math.min.apply(null, this);
            };


            var noOfrowsInPopUp = 0;
            function getPropertyClusterPopup(clusterData) {
                // console.log("clusterin"); 
                // var totalCount = clusterData.length;
                // var totalAvgSqft = 0;
                // var totalAvgPrice = 0;
                // var totalAvgTlc = 0;
                // var blankObj = {"bedCount":0, "totalCount":0,"totalSqft":0,"totalPrice":0,"totalTlc":0};
                // var bedsAvg = [];
                // var propertyId = 0;
                // var arrayOfBedsCount = [];
                // var arrayOfSqrftCount = [];
                // var arrayOfPriceCount = [];
                // var arrayOfTlcPriceCount = [];
                // var minBedsCount;
                // var maxBedsCount;
                // var minSqrftCount;
                // var maxSqrftCount;
                // var minPriceCount;
                // var maxPriceCount;
                // var minTlcPriceCount;
                // var maxTlcPriceCount;
                // clusterData.forEach(function(property, ind){
                //      propertyId = property.Id;
                //     if(property != undefined){

                //         totalAvgSqft = totalAvgSqft + property.LA;
                //         totalAvgPrice = totalAvgPrice + property.LP;
                //         totalAvgTlc = totalAvgTlc + property.TLC;

                //         for(var i=0; i<8; i++){
                //             if(bedsAvg[i] == undefined)
                //                 bedsAvg[i] = angular.copy(blankObj);

                //             if(property.BD == (i)){
                //                 bedsAvg[i].totalCount++;
                //                 bedsAvg[i].bedCount = (i);
                //                 bedsAvg[i].totalSqft = bedsAvg[i].totalSqft + property.LA;
                //                 bedsAvg[i].totalPrice = bedsAvg[i].totalPrice + property.LP;
                //                 bedsAvg[i].totalTlc = bedsAvg[i].totalTlc + property.TLC;
                //                 break;
                //             }else {
                //                 if(i == 7 && property.BD > 8){
                //                     bedsAvg[i].totalCount++;
                //                     bedsAvg[i].bedCount = (i);
                //                     bedsAvg[i].totalSqft = bedsAvg[i].totalSqft + property.LA;
                //                     bedsAvg[i].totalPrice = bedsAvg[i].totalPrice + property.LP;
                //                     bedsAvg[i].totalTlc = bedsAvg[i].totalTlc + property.TLC;
                //                     break;
                //                 }
                //             }
                //         }
                //     }
                // });

                // for(var j = 0; j<bedsAvg.length;j++){
                //   if(bedsAvg[j].totalCount == 0){
                //       bedsAvg.splice(j,1);
                //       j = -1;
                //   }
                // }

                // for(var j = 0; j<bedsAvg.length;j++){
                //   bedsAvg[j].totalSqft = (bedsAvg[j].totalSqft / bedsAvg[j].totalCount).toFixed(2);
                //   bedsAvg[j].totalPrice = (bedsAvg[j].totalPrice / bedsAvg[j].totalCount).toFixed(2);
                //   bedsAvg[j].totalTlc = (bedsAvg[j].totalTlc / bedsAvg[j].totalCount).toFixed(2);
                //   arrayOfBedsCount.push(bedsAvg[j].bedCount); 
                //   arrayOfSqrftCount.push(bedsAvg[j].totalSqft);
                //   arrayOfPriceCount.push(bedsAvg[j].totalPrice);
                //   arrayOfTlcPriceCount.push(bedsAvg[j].totalTlc);
                // }
                //  minBedsCount = arrayOfBedsCount.min();
                //  maxBedsCount = arrayOfBedsCount.max();
                //  minSqrftCount =arrayOfSqrftCount.min().toFixed(2);
                //  maxSqrftCount =arrayOfSqrftCount.max().toFixed(2);
                //  minPriceCount =utilService.getSortPrice(formatNumberWithoutComma(arrayOfPriceCount.min().toFixed(2)));
                //  maxPriceCount =utilService.getSortPrice(formatNumberWithoutComma(arrayOfPriceCount.max().toFixed(2)));
                //  minTlcPriceCount = utilService.getSortPrice(formatNumberWithoutComma(arrayOfTlcPriceCount.min().toFixed(2)));
                //  maxTlcPriceCount =utilService.getSortPrice(formatNumberWithoutComma(arrayOfTlcPriceCount.max().toFixed(2)));

                // totalAvgSqft = (totalAvgSqft / totalCount).toFixed(2);
                // totalAvgPrice = (totalAvgPrice / totalCount).toFixed(2);
                // totalAvgTlc = (totalAvgTlc / totalCount).toFixed(2);

                // var htmlString =
                //     '<div class="property-popup-wrapper ">' +
                //     '    <div class="property-map-pushpin">' +
                //     '        <div class="property-listingBalloon">' +
                //     '            <div class="ListingBalloonContainer">' +
                //     '                <div class="property-detail-box property-box property_pop2">' +
                //     '                    <div class="property_pop_up">'+
                //     '<div class="img_box">'+
                //     '<img src="' + getDefaultUrl(clusterData[0].Photos) + '" />'+
                //     '<div class="property_title_name">'+
                //     '<h3>'+ clusterData[0].CT +'</h3>'+
                //     '</div>'+
                //     '</div>'+
                //     '<div class="property_all_detail">'+
                //     '<div class="bottom_detail">'+
                //     '<table>'+
                //     '<tbody>'+
                //         '<tr class="clusterPopupForMobile">'+                       
                //         '<td><b>Total</b></td>'+
                //         '<td>:</td>'+
                //         '<td>'+ totalCount + '</td>'+                        
                //         '</tr>'+
                //         '<tr class="clusterPopupForMobile">'+                       
                //         '<td><b>Beds</b></td>'+
                //         '<td>:</td>'+
                //         '<td>'+ minBedsCount + '<span> - </span>' + maxBedsCount + '</td>'+                        
                //         '</tr>'+
                //         '<tr class="clusterPopupForMobile">'+    
                //         '<td><b>SQFT</b></td>'+
                //         '<td>:</td>'+
                //         '<td>'+ minSqrftCount + '<span> - </span>' + maxSqrftCount + '</td>'+
                //         '</tr>'+  
                //         '<tr class="clusterPopupForMobile">'+    
                //         '<td><b>Price</b>'+
                //         '<td>:</td>'+
                //         '<td>$'+minPriceCount + '<span> - </span>' +"$"+maxPriceCount + '</td>'+              
                //         '</tr>'+  
                //         '<tr class="clusterPopupForMobile" >'+    
                //         '<td><b>TLC</b>&nbsp;&nbsp;</td>'+
                //         '<td>:</td>'+
                //         '<td>$'+minTlcPriceCount + '<span> - </span>' +"$"+maxTlcPriceCount + '</td>'+
                //         '</tr>'+   
                //         '</tr>'+  
                //     '           </tbody>'+
                //     '          </table>'+
                //     '         </div>'+
                //     '<div class="bookmark-box bookmark-box-mobile removePop">' +
                //     '<a title="Close Popup"  href="javascript:void(0);" data-id="' + propertyId + '" data-Btype="add"><i class="fa fa-times fa-2"></i></a>' +
                //     '</div>' +
                //     '</div>'+
                //     '<div class="property_title_name_mobile"><h3>BALTIMORE</h3></div>'+
                //     '</div>'+

                //     '                    </div>' +
                //     '            </div>' +
                //     '        </div>' +
                //     '    </div>' +

                //     '</div>';
                var htmlString = '<div id="carousel_container">', count = 0, carousel_class;
                clusterData.forEach(function(property, ind){
                    count++;
                    if(count == 1) {
                      carousel_class = "carousel_active";
                    } else {
                      carousel_class = "carousel_inactive";
                    }
                    htmlString = htmlString + '<div id="' + count + '"  class="' + carousel_class + '">' + getPropertyDetailPopupLaptop(property) + '</div>';
                })

                return htmlString + ' <i id="carousel_previous" class="fa fa-chevron-circle-left carousel_button" aria-hidden="true"></i>  <i id="carousel_next" class="fa fa-chevron-circle-right carousel_button" aria-hidden="true"></i> </div>';
            }

          function propertyDetail(listingId) {
            $(".bookmark-title").removeClass('newBookmarkdiv');
            if ($state.current.name == 'tlc.search')
              $state.go('tlc.search.propertydetail', { listingId: listingId });
            else if ($state.current.name == 'tlc.clientSummary')
              $state.go('tlc.clientSummary.propertydetail', { listingId: listingId });
          }

          function getDefaultUrl(items) {
            if (items != undefined && items.length > 0) {
              var imgUrl = items[0];
              var firstPart = imgUrl.split("images");
              var urlPart1 = firstPart[0];
              var urlPart2 = firstPart[1].split("/");
              var lastpart = urlPart2.length;
              var imageName = urlPart2[lastpart-1];
              var updatedImageUrl = urlPart1+"images/150/0/"+imageName;
              return updatedImageUrl;             
            }

            return "images/No-property.png";
          }

          function getSortPrice(price) {
            return utilService.getSortPrice(price);
          }

          function formatNumber(value) {
            return utilService.formatNumber(value);
          }
          function formatNumberWithoutComma(value) {
            return utilService.formatNumberWithoutComma(value);
          }
          $scope.$on('setPoisMap', function (e, args) {
            //console.log(args.isAdd,args.pins);

            if($state.current.name == 'tlc.search.propertydetail' ||
              $state.current.name == 'tlc.PropertyDirect.MLS' ||
              $state.current.name == 'tlc.clientSummary.propertydetail' ||
              $state.current.name == 'tlcClient.search.propertydetail')
            {
              _.each(args.pins, function (pin) {
                if (args.isAdd) {
                  map.entities.push(pin);
                  //Microsoft.Maps.Events.addHandler(pin, 'mouseover', pinMouseOver);
                  map.setView({zoom: 13});
                }
                else
                  map.entities.remove(pin);
              });
            }
          });
          
          var isRepeat = false;
          $scope.$on('setPropertyDetailMap', function (e, args) {
            map.entities.clear();
            var property = args.property;
            var price = getSortPrice(property.ListingDetail.Listing.LISTPRICE);

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
              { icon: largeIconUrl, width: 33, height: 42, typeName: largeIconClass, text: getSortPrice(property.ListingDetail.Listing.LISTPRICE) }
            );
            map.entities.push(pin);
            map.entities._location = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(_latitude, _longitude));
            isRepeat = false;
            map.entities.Description = getPropertyDetailPopupDetailPage(property);
            Microsoft.Maps.Events.addHandler(map.entities, 'entityadded', displayInfoboxForDetailPage);

          });

          $scope.$on('onPropListMouseover', function (e, args) {
            $(".pincursor").each(function () {
              $(this).removeClass('ToggelPropIcon');
              $(this).removeClass('OHPropbox');
              $('div.PropboxMapToggle').remove();
            });
            var OHToggleClass = args.property.OH != undefined ? " OHPropbox" : "";
            $(".prop_" + args.property.Id).addClass('ToggelPropIcon');
            if(OHToggleClass != ""){
              $(".prop_" + args.property.Id).addClass('OHPropbox');
            }
            var loc = new Microsoft.Maps.Location(args.property.LT, args.property.LG);

            var tooltipFormapIcon = '<div class="PropboxMapToggle'+ OHToggleClass +'" >TLC: $' + formatNumber(args.property.TLC) + ' / $' + formatNumber(args.property.LP) + ' / ';
            /*Unit Check for multi-family*/
            if(args.property.PT != undefined && args.property.PT == "MF"){
              tooltipFormapIcon = tooltipFormapIcon + + args.property.NU + ' Units';
            }else{
              tooltipFormapIcon = tooltipFormapIcon + + args.property.BD + 'bd / ' + args.property.BDI + 'ba</div>';
            }

            $(".prop_" + args.property.Id).append(tooltipFormapIcon);

            //map.setView({ center: loc });
          });

          $scope.$on('setPropertyList', function (e, args) {
            //map.entities.clear();
            loadMap();
            $scope.drawMarkers();

            $timeout(function () {
              $scope.doClearPolygon();              
              drawBoundary();
            }, 1000);
          });

          $scope.$on('clickOnPropDetailMapIcon', function (e, args) {
            $(".propDetailMapIcon").click();
          });

          var directionsManager;
          var type, origin, destination;
          $scope.$on('setCommuteInfoMap', function (e, args) {
            //                console.log(args.type,args.origin,args.destination);

            type = args.type;
            origin = args.origin;
            destination = args.destination;

            Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: createDrivingRoute });
          });

          function createDrivingRoute() {
            // Initialize the DirectionsManager
            if (!directionsManager) {
              directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

              var directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function (arg) {/* alert(arg.message) */
                
                document.getElementById('tlc_directionsMessage').innerHTML = arg.message;
              })

              var directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function (arg) {/* alert(arg.message) */

              })
            }

            document.getElementById('tlc_directionsMessage').innerHTML = '';
            directionsManager.resetDirections();
            if (type == 'driving') {
              directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });
            }
            else {
              directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.transit });
            }

            // Create start and end waypoints
            var startWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: origin });
            var endWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: destination });

            directionsManager.addWaypoint(startWaypoint);
            directionsManager.addWaypoint(endWaypoint);

            // Set the element in which the itinerary will be rendered
            $("#tlc_directions").html("")
            directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('tlc_directions') });

            directionsManager.calculateDirections();
          }

          function getPropertyDetailPopupDetailPage(property) {
            if (!isRepeat) {
              var htmlString =

                '<div class="property-popup-wrapper initialInfoBox hide">' +
                '    <div class="property-map-pushpin">' +
                '        <div class="property-listingBalloon">' +
                '            <div class="ListingBalloonContainer">' +
                '                <div class="property-detail-box property-box">' +


                '                    <div class="property-img-box">' +

                '                    </div>' +

                '                    <div class="property-info-box">' +

                '                        <div class="property-title-price">' +
                '                            <div class="property-title-box text-left">' +
                '                                <h1><a href="#">' + property.ListingDetail.Listing.STREETNUMBERNUMERIC + ' ' + property.ListingDetail.Listing.STREETDIRPREFIX + ' ' + property.ListingDetail.Listing.STREETNAME + ' ' + property.ListingDetail.Listing.STREETSUFFIX + '</a></h1>' +
                '                                <h5>' + property.ListingDetail.Listing.CITY + ', ' + property.ListingDetail.Listing.STATEORPROVINCE + ', ' + property.ListingDetail.Listing.POSTALCODE + '</h5>' +
                '                            </div>' +
                '                            <div class="property-price-box text-right">' +
                '                                <h1><span class="price-dollar">$</span>' + getSortPrice(property.ListingDetail.Listing.LISTPRICE) + '</h1>' +
                '                                <h5>TLC: $' + getSortPrice(property.TLCInfo[0].TLC) + '</h5>' +
                '                            </div>' +
                '                        </div>' +

                '                        <div class="property-description">' +
                '                            <ul>' +
                '                                <li>' +
                '                                    <div class="property-item">' +
                '                                        <h3>' + property.ListingDetail.Listing.BEDROOMSTOTAL + '</h3>' +
                '                                        <span>BEDROOMS</span>' +
                '                                    </div>' +
                '                                </li>' +
                '                                <li>' +
                '                                    <div class="property-item">' +
                '                                        <h3>' + property.ListingDetail.Listing.BATHROOMSTOTALINTEGER + '</h3>' +
                '                                        <span>BATHROOMS</span>' +
                '                                    </div>' +
                '                                </li>' +
                '                                <li>' +
                '                                    <div class="property-item">' +
                '                                        <h3>' + formatNumber(property.ListingDetail.Listing.LIVINGAREA) + '</h3>' +
                '                                        <span>SQFT</span>' +
                '                                    </div>' +
                '                                </li>' +
                '                                <li>' +
                '                                    <div class="property-item irregular-item">' +
                '                                        <h3>' + (property.ListingDetail.Listing.LOTSIZEDIMENSIONS || '-') + '</h3>' +
                '                                        <span>LOT SIZE</span>' +
                '                                    </div>' +
                '                                </li>' +
                '                            </ul>' +
                '                        </div>' +
                '<div class="more-function_map">'+              
              '                </div>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +

                '</div>';
              $(".propDetailMapIcon").append(htmlString);
              $(".propDetailMapIcon").append('<div class="infobox-stalk hide" style="width: 0px !important; height: 0px; overflow: hidden; position: absolute; z-index: 1; left: 3px !important; top: -24px !important;border-style: solid;border-width: 25px 20px 0 20px;border-color: #fff transparent transparent transparent;"></div>');
              isRepeat = true;
              return htmlString;
            }
          }


          function displayInfoboxForDetailPage(e) {
            infobox.setOptions({
              width: 430,
              height: 300,
              description: this.target.Description,
              visible: true,
              offset: new Microsoft.Maps.Point(15, 25)
            });
            infobox.setLocation(this.target._location);
            //infobox.setLocation(this.target.getLocation());
            isRepeat = true;
          }

          function clearClustering(){
              if(pinClusterer != undefined && pinClusterer != null)
                  pinClusterer.clearAll();
          }

          function drawPolygonHighlight(polygon) {
            //$scope.oldpolygon = polygon;
            var polygonPoints = [];
            for (var i = 0; i < polygon.length; i++) {
              polygonPoints.push(new Microsoft.Maps.Location(polygon[i][1], polygon[i][0]));
            }

            var color = ["#43EE0B"];
            var polygon = new Microsoft.Maps.Polygon(polygonPoints, {
              fillColor: new Microsoft.Maps.Color(94, 134, 240, 53) ,
              strokeColor: new Microsoft.Maps.Color.fromHex(color[0]),
              strokeThickness: 4
            });

            polygonHighlightLayer.push(polygon);

          }

          $scope.$on('highlightPolygon', function (e, polygon) {
            var latlogs = polygon.split(',');
            var larlongs = [];
            for(var j=0; j<latlogs.length; j++){
              var geoLocation = latlogs[j].split(' ');
              larlongs.push([geoLocation[0], geoLocation[1]]);
            }
            drawPolygonHighlight(larlongs);
          });

          $scope.$on('RemoveHighlightedPolygon', function (e, polygon) {
            polygonHighlightLayer.clear();
          });

          /*Resest page event handler*/
          $rootScope.$on("resetPage", function () {
            polygonHighlightLayer.clear();
            $scope.doClearPolygon();
          });

        }
      };
    }]);
