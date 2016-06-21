$(document).ready(function(){

	 

	var properties = [], // cache var for property data
	    pois = [], // cache var for POIs of a specific property
	    currentproperty = null, // cache var for current property data
	    curselmar = null, // cache var for the currently selected marker
	    /** HOX: initialize vars "mapcenter" and "mapzoom" for the default map center and zoom levels

	    For Bing:
	    mapcenter = new Microsoft.Maps.Location(44.983334, -93.266670), mapzoom = 11,
	    */
	    tlcmarkers = {
	    	0: 0,
	    	1000: 1,
	    	2000: 2,
	    	3000: 3,
	    	4000: 4,
	    	5000: 5,
	    	7500: 6,
	    	10000: 7,
	    	20000: 8,
	    	30000: 9,
	    	40000: 10
	    }, // which amount of TLC corresponds to which color marker
	    polygonthreshold = 10; // threshold for how often each drawing event creates a polygon point.
	                           // lower threshold means better polygons when drawing fast, but more points
	                           // higher threshold means simpler polygons, but very jagged when drawing fast

	// formatter functions for templating engine
	// remove if you're replacing the template engine with something else like Angular
	$.addTemplateFormatter({
		ImageFormat: function(v,t){
			if(t == null)
				return "background-image:url(//rwimage.fnisrediv.com/ListingImages/mnrmls/images/0/0/"+v+".jpg)";
			else
				return "background-image:url(//rwimage.fnisrediv.com/ListingImages/mnrmls/addl_picts/120/120/"+v+"-"+t+".jpg)";
		},
		DollarFormat: function(v){
			return "$"+addCommas(parseFloat(v).toFixed(2));
		},
		DollarSup: function(v){
			return addCommas(parseFloat(v).toFixed(2)).replace(".", ".<sup>")+"</sup>";
		},
		Integer: function(v){
			return Math.round(parseInt(v));
		},
		Twintents: function(v) {
			return "https://twitter.com/intent/tweet?url="+encodeURIComponent(v.url)+"&amp;via=tlcengine&amp;text="+encodeURIComponent("Check out "+v.name+"!");
		},
		Distance: function(v,t) {
			return +parseFloat(v).toFixed(2)+" mi";
		},
		CSVToList: function(v) {
			return "<li>"+v.split(",").join("</li><li>")+"</li>";
		}
	});


	/** HOX: recommend initializing map and map methods here.
	Need two methods:
	showAllPois: read the cookie "tlc_mfil", and populate map with the markers for those POIs
	makeDirectionsTo: take the parameters and display a driving directions route on the map based on that

	Refer to code below.


	For Bing:
	var map = new Microsoft.Maps.Map(document.getElementById('map'), {
			credentials: 'AnWQOEQ-b5i8r9PacrTgaus7oVC1TVXAhfM0Ma4yw25guue1C3qj4ezitliTMotQ',
			enableClickableLogo: false,
			enableSearchLogo: false,
			showMapTypeSelector: false,
			showDashboard: false,
			showScalebar: false,

			zoom: mapzoom,
			center: mapcenter
	    }),
	    showAllPois = function(){
			$.each(pois, function(t,m){
				var lccat = m.Category.toLowerCase().replace(/\s/g, "");
				if($.inArray(lccat, JSON.parse($.cookie("tlc_mfil"))) > -1) {
					var pin = new Microsoft.Maps.Pushpin(
						new Microsoft.Maps.Location(Number(m.Latitude), Number(m.Longitude)),
						{icon: '/assets/images/markers/poi-'+lccat+'.png', width: 33, height: 42, typeName: 'pincursor'}
					);
					Microsoft.Maps.Events.addHandler(pin, 'click', function(){
						var poiitem = $("#info-lifestyle a[data-id="+m.ID+"]");
						// get routes
						poiitem.click();
						// goto lifestyle tab
						$("#info").tabs("option", "active", 1);
						// scroll to item and flash
						setTimeout(function(){
							poiitem = $("#info-lifestyle a[data-id="+m.ID+"]");
							$("li.detail").animate({
								scrollTop: poiitem.offset().top+$("li.detail").scrollTop()-250
							}, 500, function(){
								poiitem.parent().addClass("highlight");
								setTimeout(function(){
									poiitem.parent().removeClass("highlight");
								},400);
							});
						},1000);
					});
					map.entities.push(pin);
				}
			});
	    },
	    makeDirectionsTo = function(address, location, dirdiv, mode, tlc){
			render = (typeof dirdiv === "undefined") ? { waypointPushpinOptions: {visible:false} } : {
				waypointPushpinOptions: {visible:false},
				itineraryContainer: $(dirdiv)[0],
				displayTrafficAvoidanceOption: false,
				displayWalkingWarning: false,
				displayManeuverIcons: false,
				displayPostItineraryItemHints: false,
				displayPreItineraryItemHints: false
			};
			destination = (typeof location === "undefined" || location == null) ? { address: address } : { address: address, location: location };
			mode = (typeof mode === "undefined" || mode == null) ? Microsoft.Maps.Directions.RouteMode.driving : mode;
			tlc = (typeof mode === "undefined") ? false : tlc;

			directionsManager.resetDirections();
			// Set Route Mode to driving
			directionsManager.setRequestOptions({ routeMode: mode });
			directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ address: currentproperty.fulladdress }));
			directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint(destination));
			directionsManager.setRenderOptions(render);
			directionsManager.calculateDirections();
			if(tlc){
				Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function(){
					var rr = directionsManager.getRouteResult();
					$("#tlccommute-minutes").text(Math.round(rr[0].routeLegs[0].summary.time / 60));
					$("#tlccommute-miles").text(+parseFloat(rr[0].routeLegs[0].summary.distance).toFixed(2));
				});
			}
	    },
	    directionsManager = false;

	Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: function(){
		directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
		directionsManager.resetDirections();
	}});

	*/


	/* handle drawing stuff */
	var resizeCanvas = function() {
		var canvas = $("#drawing")[0];
		if(canvas) {
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

	// user clicks the draw button
	$("#draw").click(function(){
		if($(this).hasClass("active")) {
			// user was already in draw mode, remove drawing and the helper, return to normalcy
			$("#drawing").remove();
			$("#drawhelp").removeClass("active");
			$(this).removeClass("active").html('<i class="fa fa-pencil"></i> Draw an area');
		} else {
			// user wasn't in draw mode, bring up help, cancel button and create the canvas
			$("#drawhelp").addClass("active");
			$(this).addClass("active").html('<i class="fa fa-times"></i> Cancel drawing');
			var board = $('<canvas id="drawing" />');
			board.appendTo("body");
			resizeCanvas();

			/** HOX: call function here to delete any existing polygon from the map

			For Bing:
			for(var i=map.entities.getLength()-1;i>=0;i--) {
				var polygon= map.entities.get(i);
				if (polygon instanceof Microsoft.Maps.Polygon) {
					map.entities.removeAt(i);
				}
			}
			*/

			// clear polygonpoints
			polygonpoints = [];

			// init the sketch lib for the canvas
			$("#drawing").sketch({
				drawCallback: function(x,y){ // for each draw event
					// get rid of all the markers and stuff
					if(eventcount == 0) {
						/** HOX: Clear map of everything

						For Bing:
						map.entities.clear();
						*/
					}

					// if it's the "polygonthreshold"th event, push a point
					if(eventcount % polygonthreshold == 0) {
						polygonpoints.push(
							/** HOX: call function here to resolve a pixel coordinate of the map element to lat,lng coordinate of the map

							For Bing:
							map.tryPixelToLocation(new Microsoft.Maps.Point(x, y), Microsoft.Maps.PixelReference.control)
							*/
						);
					}

					// increment event count
					eventcount++;
				},
				stopCallback: function(){ // once the user lets go
					// delete the canvas
					$("#drawing").remove();
					// push the first point at the end, so the polygon is properly closed
					polygonpoints.push(polygonpoints[0]);

					/** HOX: call function here to draw a polygon on the map based on an array of lng,lng coordinates as per in previous HOX

					For Bing:
					map.entities.push(
						new Microsoft.Maps.Polygon(polygonpoints, {
							fillColor: new Microsoft.Maps.Color(40,247,148,30),
							strokeColor: new Microsoft.Maps.Color(210,247,148,30),
							strokeThickness: 4
						})
					);
					*/

					// return to normalcy
					$("#drawhelp").removeClass("active");
					$("#draw").removeClass("active").html('<i class="fa fa-pencil"></i> Redraw the area');
					eventcount=0;
				}
			}).on("mousewheel", function(e){
				// handle scrollwheel zooming while drawing

				/** HOX: code here to capture mousewheel usage on top of the drawing canvas, and zooming the map manually to reflect it

				For Bing:
				mapzoom = mapzoom + e.deltaY;
				map.setView({ zoom: mapzoom, center: map.tryPixelToLocation(new Microsoft.Maps.Point(e.offsetX, e.offsetY), Microsoft.Maps.PixelReference.control), animate: true });
				console.log(mapzoom);
				*/
			});
		}
	});

	/* qualifiers */
	$("#qualifiers .dropdown").tlcDropdown();
	$("#qualifiers .range").tlcRange();

	/* handle searching */
	$("#go").click(function(){
		// add results to expand
		// add freeze to prevent unnecessary redraws
		$("body").addClass("results freeze");
		setTimeout(function(){
			$("body").removeClass("freeze");
			// remove more
      $("#search, #logo, #slogan").removeClass("more");
		}, 600);

		/** HOX: replace the timeout below with retrieving data from the server */
		setTimeout(function(){
			// temporary data, acting as a result from the server
			var data = {
				d: {
					PropertyCount: 6,
					PropertyList: [
						{
							StreetNum: "1525",
							Address: "Hunter Dr",
							City: "Wayzata",
							State: "MN",
							ZipCode: "55391",
							Price: 5875000,
							TLC: 28334,
							Beds: 5,
							Baths: 5,
							GarageCap: 3,
							Sqft: 11410,
							Id: 1
						},
						{
							StreetNum: "4909",
							Address: "Bywood St",
							City: "Edina",
							State: "MN",
							ZipCode: "55436",
							Price: 5195000,
							TLC: 26295,
							Beds: 5,
							Baths: 5,
							GarageCap: 4,
							Sqft: 12864,
							Id: 2
						},
						{
							StreetNum: "1525",
							Address: "Hunter Dr",
							City: "Wayzata",
							State: "MN",
							ZipCode: "55391",
							Price: 4995000,
							TLC: 23091,
							Beds: 6,
							Baths: 5,
							GarageCap: 3,
							Sqft: 12127,
							Id: 3
						},
						{
							StreetNum: "1525",
							Address: "Hunter Dr",
							City: "Wayzata",
							State: "MN",
							ZipCode: "55391",
							Price: 5875000,
							TLC: 28334,
							Beds: 5,
							Baths: 5,
							GarageCap: 3,
							Sqft: 11410,
							Id: 4
						},
						{
							StreetNum: "4909",
							Address: "Bywood St",
							City: "Edina",
							State: "MN",
							ZipCode: "55436",
							Price: 5195000,
							TLC: 26295,
							Beds: 5,
							Baths: 5,
							GarageCap: 4,
							Sqft: 12864,
							Id: 5
						},
						{
							StreetNum: "1525",
							Address: "Hunter Dr",
							City: "Wayzata",
							State: "MN",
							ZipCode: "55391",
							Price: 4995000,
							TLC: 23091,
							Beds: 6,
							Baths: 5,
							GarageCap: 3,
							Sqft: 12127,
							Id: 6
						}
					]
				}
			};

			if(data.d.PropertyCount == 0) { // if there are no results for the query
				$(".loader").addClass("nomore"); // display feedback to user
			} else { // if there are results for the query
				$(".loader").addClass("hidden"); // hide the loading message
				// wait until the loading message has gone, then display results
				setTimeout(function(){
					// display title, add the number of results into it
					$("article h2").removeClass("hidden")
						.children("span").text(addCommas(data.d.PropertyCount));

					// cache result set
					$.extend(properties, data.d.PropertyList);

					// reconcile and format data with template slots
					var templateprop = [];
					$.each(properties, function(k,v){
						templateprop.push({
							address1: v.StreetNum+" "+v.Address,
							address2: v.City+", "+v.State+" "+v.ZipCode,
							price: addCommas(Math.round(v.Price / 1000))+"k", // TODO: make this smarter
							price_long: addCommas(v.Price),
							tlc: Math.round(v.TLC / 1000)+"k", // TODO: make this smarter
							tlc_long: addCommas(Math.round(v.TLC)),
							beds: v.Beds,
							baths: v.Baths,
							parking: v.GarageCap,
							sqft: addCommas(Number(v.Sqft)),
							id: v.Id
						});
					});

					// clear previous resultset, load new ones from template
					$("#results").empty().loadTemplate("/templates/card.html", templateprop, {
						prepend: true,
						overwriteCache: true, // TEMP: remove for production
						success: function(){ // once the template has been loaded

							// cycle counter
							var i = 0;

							// cycle through all the cards
							$("#results > li:not(.loader)").each(function(){
								var tcard = $(this),
								    thisprop = $.grep(properties, function(e){ return Number(e.Id) == Number(tcard.data("id")); }), // TODO: sure would love to not grep here
								    v = thisprop[0];

								// cascade showing
								setTimeout(function(){
									tcard.removeClass("hidden");
								},150*i)

								// cycle through TLC levels for different markers
								$.each(tlcmarkers, function(t,m){
									if(v.TLC < t) {
										/** HOX: create a pin on the map with the appropriate TLC-sensitive marker graphic
										Hovering on the pin should display an overlay bubble with quick stats on the property
										Clicking on the pin should open the detail view of that property

										For Bing:
										var pin = new Microsoft.Maps.Pushpin(
											new Microsoft.Maps.Location(Number(v.Lat), Number(v.Lon)),
											{icon: '/assets/images/markers/'+m+'.png', width: 24, height: 24, typeName: 'pincursor'}
										);
										Microsoft.Maps.Events.addHandler(pin, 'click', function(){
											$("#results > li").filter("[data-id="+v.Id+"]").click();
										});
										map.entities.push(pin);
										return false;
										*/
									}
								});
								i++;
							});

							// custom scrollbar lib to make it pretty
							//$("#content > article").scrollbar();

							// after out of view, put the loader back at the end to handle lazyloading
							setTimeout(function(){
								$(".loader").removeClass("hidden initial");
							}, 500);
						}
					})
				}, 200);
			}
		}, 2000);
		return false;
	});

	/* draggable handle */
	$("#handle").draggable({
		axis: "x",
		scroll: false,
		snap: "#l,#r",
		snapMode: "outer",
		snapTolerance: 250,

		start: function(){
			// cursor calmer
			$("body").addClass("dragging");
		},
		stop: function(e,ui){
			// normal cursor
			$("body").removeClass("dragging");
			// also percentify the pos
			$("#handle").css("left", "100%");
			// save position to cookie
			$.cookie("tlc_hpos", (ui.position.left / $(window).width()) * 100, { expires: 365, path: '/' });
		},
		drag: function(e,ui){
			// TODO: don't allow certain pages, like details, to be resized to too small

			// handle percentages
			var content = (ui.position.left / $(window).width()) * 100;

			$("#content").css("width", content+"%");
			$("#map, #drawing").css("width", 100 - content + "%");
			$("#map, #drawing").css("width", "calc("+(100 - content)+"% - 12px)");
			$("#drawhelp").css("width", 100 - content - 2 + "%");
			$("#drawhelp").css("width", "calc("+(100 - content)+"% - 72px)");

			// handle responsive class
			if(ui.position.left <= 310)
				$("#results").attr("class", "grid");
			else if(ui.position.left <= 420)
				$("#results").attr("class", "narrow");
			else if(ui.position.left >= 900)
				$("#results").attr("class", "wide");
			else if(ui.position.left >= 650)
				$("#results").attr("class", "semi");
			else
				$("#results").removeAttr("class");
		}
	});

	/* show qualifiers */
	$("#active_qualifiers .qualitoggle").click(function(){
		$("#search").toggleClass("expanded");
		$("#topactions").toggleClass("hidden"); /* HOX2: #draw replaced with #topactions */
		if($("#search").hasClass("expanded"))
			$(this).html("<span>-</span> Less");
		else
			$(this).html("<span>+</span> More");
		return false;
	});
	$("#qualifiers .qualitoggle").click(function(){
		// expand
		$("#search, #logo, #slogan").addClass("more");
		// animation overflow fix
		$("#search").addClass("contain");
		setTimeout(function(){
			$("#search").removeClass("contain");
		}, 500);
		return false;
	});

	/* auto qualifiers */
	$("#terms").keyup(function(){
		var t = $("#terms").val(),
		    r = {
		    	br: /(\d+-|\d+,|)*\d+(\s|)br/ig
		    };

		// if bedrooms
		if(r.br.test(t)) {
			// reset regex
			r.br.lastIndex = 0;
			// get the number
			var sel = r.br.exec(t)[0].replace("br", "").split(","),
			    selar = [];

			$.each(sel, function(i,v){
				if (v.indexOf("-") > -1) {
					var range = v.split("-");
					if (range[0] < range[1]) {
						for (i = range[0]; i < range[1]; i++)
							selar.push(i);
						selar.push(range[1]);
					} else if (range[1] < range[0]) {
						for (i= range[1]; i < range[0]  ; i++)
							selar.push(i);
						selar.push(range[0]);
					} else
					selar.push(range[0]);
				} else
				selar.push(v);
			});

			// update the field
			$("select[name=bedrooms]").val(selar).tlcDropdown("update");

			// clear from text field
			$("#terms").val(t.replace(r.br, ""));
		}
		// TODO: expand this to cover all possibilities

		/* HOX2: auto-close overlays when typing */
		$("#searchinfo, #filters").removeClass("active");
		/* HOX2: end addition */
	});

	/* load position from cookie */
	if($.cookie("tlc_hpos")) {
		$("#content").css("width", $.cookie("tlc_hpos")+"%");
		$("#map").css("width", 100 - $.cookie("tlc_hpos") + "%");
		$("#map").css("width", "calc("+(100 - $.cookie("tlc_hpos"))+"% - 12px)");
		$("#drawhelp").css("width", 100 - $.cookie("tlc_hpos") - 2 + "%");
		$("#drawhelp").css("width", "calc("+(100 - $.cookie("tlc_hpos"))+"% - 72px)");
	}

	/* populate cookies if they don't exist */
	if($.cookie("tlc_hpos") == undefined) {
		$.cookie("tlc_hpos", 30);
	}
	if($.cookie("tlc_mfil") == undefined) {
		$.cookie("tlc_mfil", '["airports","amusementparks","atms","autoservices","banks","busstations","campgrounds","casinos","cityhall","communitycenters","conventioncenters","ferryterminals","galleries","gasstations","golfcourses","grocerystores","hospitals","hotelsandmotels","landmarks","libraries","marinas","cinemas","museums","nationalparks","nightclubsandtaverns","parks","parking","pharmacies","police","postoffices","rentalcaragencies","restareas","restaurants","schools","shopping","skiresorts","stadiumsandarenas","subwaystation","theaters","trainstations","wineries"]');
	}

	/* place the current responsive state */
	var cwidth = $("#content").outerWidth();
	if(cwidth <= 310)
		$("#results").attr("class", "grid");
	else if(cwidth <= 420)
		$("#results").attr("class", "narrow");
	else if(cwidth >= 900)
		$("#results").attr("class", "wide");
	else if(cwidth >= 650)
		$("#results").attr("class", "semi");
	else
		$("#results").removeAttr("class");


	/* click a result to view detail page */
	$(document).on("click", "#results > li:not(.loader, .detail)", function(){
		if (!$(this).hasClass("noclick")) {
			// lock position
			var original = $(this),
			    dummy = $(this).clone();
			dummy
				.addClass("selected result")
				.removeClass("hidden")
				.css({
					"top": original.position().top + $("#results").position().top + $("#content > div > article").scrollTop(),
					"width": original.outerWidth()
				})
				.prependTo("#content article");

			// fade out others
			$("#results > li").css("opacity", 0)

			// unscroll
			$("#content > div > article").scrollbar("destroy");

			// expand (no callback because multiple agents)
			setTimeout(function(){
				/*$("#content").animate({
					"width": "70%"
				}, 300);
				$("#map").animate({
					"width": "30%"
				}, 300);*/
				dummy.addClass("detail").css("top", $("#content > article").scrollTop());

				setTimeout(function(){
					// show back button
					$("#back").addClass("visible");
					// scroll it
					//dummy.scrollbar();
					// scroll pos
					$("#content > article > div.scroll-wrapper").css({
						"top": $("#content > article").scrollTop()
					});
					dummy.css("top", 0);
					// info view
					var thisprop = $.grep(properties, function(e){ return Number(e.Id) == Number(dummy.data("id")); }),
						v = thisprop[0];

					// get details
					$.ajax({
						type: "POST",
						contentType: "application/json; charset=utf-8",
						url: "http://northstarmls2.tlcengine.com/PropertyService.asmx/GetPropertiesDetail",
						data: '{_searchParameters:{"MLSNUM":"'+v.Id+'","UserID":""}}',
						dataType: "json"
					}).success(function(detaildata){
						console.log("Detail", detaildata);
						var dd = detaildata.d;
						// load map filters based on cookie
						var filters = JSON.parse($.cookie("tlc_mfil")),
						    tfil = {};
						$.each(filters, function(i,f){
							tfil["filter_"+f] = "checked";
						});

						currentproperty = $.extend(v, dd, {
							fulladdress: v.StreetNum+" "+v.Address+", "+v.City+", "+v.State+" "+v.ZipCode,
							downpayment: addCommas(Math.round(v.Price*0.2)),
							sqft: addCommas(Number(v.Sqft)),
							description: dd.REMARKS,
							zipTitle: "ZIP ("+v.ZipCode+")",
							iAvg_jan_high_Temp: dd.iAvg_jan_high_Temp+"&deg;F",
							iAvg_jan_low_Temp: dd.iAvg_jan_low_Temp+"&deg;F",
							iAvg_jul_high_Temp: dd.iAvg_jul_high_Temp+"&deg;F",
							iAvg_jul_low_Temp: dd.iAvg_jul_low_Temp+"&deg;F",
							dPop_Change: parseFloat(dd.dPop_Change).toFixed(2)+"%",
							twitter: {url: "http://tlcengine.com/1234567", name: v.StreetNum+" "+v.Address+" in "+v.City }
						});

						// get template
						dummy.loadTemplate("templates/details.html", $.extend(currentproperty, tfil), {
							append: true,
							overwriteCache: true,
							success: function(){
								// hero buttons
								$("#actions").appendTo("li.detail .address");
								$(".morph-button > span").click(function(e){
									e.stopPropagation();
									$(".morph-button").addClass("open").css("height",140);
								});
								$("body").click(function(){
									$(".morph-button").removeClass("open").css("height",40);
								});

								// make tabs
								$("#info").tabs({
									activate: function(e,ui){
										if(ui.newPanel.attr("id") != "info-lifestyle")
											$("#info-lifestyle a.active").click();
									},
									create: function(){
										//msnry = new Masonry($("#info-details")[0], {
										//	columnWidth: '.detailbox',
										//	itemSelector: '.detailbox'
										//});
									}
								});

								// make checkboxes
								$("#profile input").iCheck();

								// make N/A's gray
								$("#info-neighborhood td").each(function(){
									if($(this).text() == "N/A")
										$(this).addClass("na");
								});

								// number inputs for calculator
								$("#info-calculator").find("input.dollar, #calc_sqft").priceFormat({ prefix: '', centsLimit: 0 });

								// get place markers
								$.ajax({
									type: "POST",
									contentType: "application/json; charset=utf-8",
									url: "http://northstarmls2.tlcengine.com/PropertyService.asmx/GetPOIData_Collection",
									data: '{"_mlsNum":"'+v.Id+'"}',
									dataType: "json"
								}).success(function(poimarkers){
									pois = poimarkers.d;
									console.log("Pois", pois);
									// put them in the tab
									$("#info-lifestyle ul").loadTemplate("templates/poi.html", $.map(pois, function(value, index) { return [value]; }));
									// put them on the map
									showAllPois();
								});

								// details
								// select which keys to display
								var detailkeys = {
									"APPLIANCES": "Appliances",
									"BASEMENT": "Basement",
									"DINE": "Dining room",
									"EXTERIOR": "Exterior",
									"GARAGE": "Parking",
									"MSTBH": "Bathrooms",
									"MSTBR": "Bedrooms",
									"ROOF": "Roof"
								};
								$.each(detailkeys, function(k,t){
									dpieces = currentproperty[k].split(" / ");
									if(currentproperty[k] != ""){
										$("#info-details").loadTemplate("templates/detailbox.html", {
											title: t,
											secondary: (dpieces.length == 2) ? dpieces[0] : "",
											list: (dpieces.length == 2) ? dpieces[1] : dpieces[0]
										}, {
											append: true,
											overwriteCache: true
										});
									}
								});
							}
						});
					});

					// save map
					/** HOX: cache the current center and zoom level of the map to the vars "mapcenter"
					and "mapzoom", respectively.

					For Bing:
					mapcenter = map.getCenter();
					mapzoom = map.getZoom();
					*/

					// handle map
					/** HOX: Clear the map of everything. Create a pushpin in a variable for the currently selected
					property. Display it, and re-focus the map.

					For Bing:
					map.entities.clear();
					curselmar = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(Number(v.Lat), Number(v.Lon)), {icon: '/assets/images/markers/selected.png', width: 46, height: 48});
					map.entities.push(curselmar);
					map.setView({ zoom: 17, center: new Microsoft.Maps.Location(Number(v.Lat), Number(v.Lon)), animate: true });
					*/
				}, 600);
			}, 300);
		}
	});

	/* and back again */
	$("#back").click(function(){

		/* HOX2: added overlay check */
		if($("#content_overlay").hasClass("visible")) { // if we're in an overlay
			// hide back button if there's no detail view underneath
			if($("li.detail").length == 0) {
				$(this).removeClass("visible");

				$("#content").animate({
					"width": $.cookie("tlc_hpos")+"%"
				}, 300);
				$("#map").animate({
					"width": (100 - $.cookie("tlc_hpos"))+"%"
				}, 300);
			} else {
				//$("li.detail").scrollbar();
			}

			$("#content_overlay").scrollbar("destroy");
			$("#content_overlay, #map_overlay").removeClass("visible");
			enableHandle();

		} else { // if we're returning from detail view
			$(this).removeClass("visible");

			// handle map
			/** HOX: Destroy directions if any, clear all markers, and reset the center and zoom.

			For Bing:
			directionsManager.resetDirections();
			map.entities.clear();
			map.setView({ zoom: mapzoom, center: mapcenter, animate: true });
			*/

			// return pins
			$("#results > li:not(.loader)").each(function(){
				var tcard = $(this),
				    thisprop = $.grep(properties, function(e){ return Number(e.Id) == Number(tcard.data("id")); }),
				    v = thisprop[0];

				// create pin
				$.each(tlcmarkers, function(t,m){
					if(v.TLC < t) {
						/** HOX: create a pin on the map with the appropriate TLC-sensitive marker graphic
						Hovering on the pin should display an overlay bubble with quick stats on the property
						Clicking on the pin should open the detail view of that property

						For Bing:
						var pin = new Microsoft.Maps.Pushpin(
							new Microsoft.Maps.Location(Number(v.Lat), Number(v.Lon)),
							{icon: '/assets/images/markers/'+m+'.png', width: 24, height: 24, typeName: 'pincursor'}
						);
						Microsoft.Maps.Events.addHandler(pin, 'click', function(){
							$("#results > li").filter("[data-id="+v.Id+"]").click();
						});
						map.entities.push(pin);
						return false;
						*/
					}
				});
			});

			setTimeout(function(){
				var dummy = $("li.detail"),
				    target = $("#results li[data-id="+dummy.data("id")+"]");

				dummy.scrollbar("destroy").css({
					"top": target.position().top + $("#results").position().top + $("#content > article").scrollTop(),
					"width": target.outerWidth()
				}).removeClass("detail");

				$("#profile, #actions, #request").remove();

				$("#content").animate({
					"width": $.cookie("tlc_hpos")+"%"
				}, 300);
				$("#map").animate({
					"width": (100 - $.cookie("tlc_hpos"))+"%"
				}, 300);

				setTimeout(function(){
					// rescroll
					//$("#content > article").scrollbar();
					// show everything
					$("#results > li").css("opacity", 1);
					setTimeout(function(){
						dummy.remove();
					}, 300);
				}, 600);
			}, 300);
		} /* HOX2: end overlay check */

		return false;
	});

	/* handle filters */
	$(document).on("ifChanged", "#filters input", function(){
		// parse all filters
		var checked = [];
		$("#filters input").each(function(){
			if($(this).is(":checked"))
				checked.push($(this).attr("name"));
		});
		// save selections to cookie
		$.cookie("tlc_mfil", JSON.stringify(checked));

		// reflect it on the map
		/** HOX: Refresh map with the new filters

		For Bing:
		map.entities.clear();
		map.entities.push(curselmar);
		showAllPois();
		*/
	});


	/* toggle additional filters */
	$(document).on("click", "#filter_toggle", function(){
		if($("#filters").hasClass("showall")) {
			$("#filters").removeClass("showall");
			$(this).text("Show more");
		} else {
			$("#filters").addClass("showall");
			$(this).text("Show less");
		}
	});

	/* show POI on map */
	$(document).on("click", "#info-lifestyle a", function(){
		if($(this).hasClass("active")){ // hiding directions
			// reset link
			$(this).text("See on map").removeClass("active");
			// reset map

			/** HOX: Remove directions and markers from map, return the currently selected property marker and POI markers

			For Bing:
			directionsManager.resetDirections();
			map.entities.clear();
			map.entities.push(curselmar);
			showAllPois();
			*/
		} else {
			/** HOX: Clear map, add currently selected property marker, selected POI and directions in between

			For Bing:
			// clear everything
			map.entities.clear();
			// show house
			map.entities.push(curselmar);
			// show selected poi
			var m = pois[$(this).data("id")];
			map.entities.push(new Microsoft.Maps.Pushpin(
				new Microsoft.Maps.Location(Number(m.Latitude), Number(m.Longitude)),
				{icon: '/assets/images/markers/poi-'+m.Category.toLowerCase().replace(/\s/g, "")+'.png', width: 33, height: 42, typeName: 'pincursor'}
			));

			// directions stuff
			makeDirectionsTo(m.Address);
			*/

			// link status
			$("#info-lifestyle a").text("See on map").removeClass("active");
			$(this).text("Hide directions").addClass("active");
		}

		return false;
	});

	/* go to calculator from sidebar */
	$(document).on("click", ".tlc_calculate", function(){
		$("#info").tabs("option", "active", 3);
		$("#content > article > li").delay(100).animate({
			scrollTop: $("#info").offset().top - 100
		}, 300);
		return false;
	});

	/* toggle car panel */
	$(document).on("ifChanged", "#calc_commute_control input", function(){
		if($("#calc_commute_car").is(":checked"))
			$("#calc_car").addClass("visible");
		else
			$("#calc_car").removeClass("visible");
	});

	/** HOX: The following four functions handle the AJAX calls for the car make, model, type and mpg services. Replace as necessary. */
	$(document).on("change", "#calc_caryear", function(){
		var choices = '<option value="" selected disabled></option>';
		$("#calc_carmake, #calc_carmodel, #calc_cartype").html('<option value="" selected disabled></option>');
		$.ajax({
			type: "POST", dataType: "json", contentType: "application/json; charset=utf-8",
			url: "http://northstarmls2.tlcengine.com/Calculator.asmx/Getmake",
			data: "{currYear: " + $("#calc_caryear").val() + "}"
		}).success(function(data){
			$.each(data.d, function(t,c){
				choices += '<option value="'+c.data+'">'+c.data+'</option>';
			});
			$("#calc_carmake").html(choices);
		});
	});
	$(document).on("change", "#calc_carmake", function(){
		var choices = '<option value="" selected disabled></option>';
		$("#calc_carmodel, #calc_cartype").html('<option value="" selected disabled></option>');
		$.ajax({
			type: "POST", dataType: "json", contentType: "application/json; charset=utf-8",
			url: "http://northstarmls2.tlcengine.com/Calculator.asmx/Getmodel",
			data: "{currYear: " + $("#calc_caryear").val() + ", currMake: '" + $("#calc_carmake").val() + "'}"
		}).success(function(data){
			$.each(data.d, function(t,c){
				choices += '<option value="'+c.data+'">'+c.data+'</option>';
			});
			$("#calc_carmodel").html(choices);
		});
	});
	$(document).on("change", "#calc_carmodel", function(){
		var choices = '<option value="" selected disabled></option>';
		$("#calc_cartype").html('<option value="" selected disabled></option>');
		$.ajax({
			type: "POST", dataType: "json", contentType: "application/json; charset=utf-8",
			url: "http://northstarmls2.tlcengine.com/Calculator.asmx/Getcartype",
			data: "{currYear: " + $("#calc_caryear").val() + ", currMake: '" + $("#calc_carmake").val() + "', currModel: '" + $("#calc_carmodel").val() + "'}"
		}).success(function(data){
			$.each(data.d, function(t,c){
				choices += '<option value="'+c.id+'">'+c.trany+'</option>';
			});
			$("#calc_cartype").html(choices);
		});
	});
	$(document).on("change", "#calc_cartype", function(){
		var choices = '<option value="" selected disabled></option>';
		$.ajax({
			type: "POST", dataType: "json", contentType: "application/json; charset=utf-8",
			url: "http://northstarmls2.tlcengine.com/Calculator.asmx/Getcarmpg",
			data: "{carid: " + $("#calc_cartype").val() + "}"
		}).success(function(data){
			$("#calc_carcitympg").val(data.d.citympg);
			$("#calc_carhwympg").val(data.d.hwympg);
		});
	});

	/* submit calculator */
	$(document).on("submit", "#info-calculator form", function(e){
		e.preventDefault();
		// format calculator data
		// can't do serialize, as some fields need special treatment
		var calcdata = {
			PropertyPrice: Number($("#calc_price").unmask()),
			DownPayment: Number($("#calc_down").unmask()),
			DownPercentage: Number($("#calc_down_pct").val()),
			SquareFeet: Number($("#calc_sqft").unmask()),
			MonthlyIncome: Number($("#calc_income").unmask()),
			MonthlyDebt: Number($("#calc_debt").unmask()),
			FicoScore: $("#calc_fico").val(),
			HomeAddress: $("#calc_home").val(),
			WorkAddress: $("#calc_office").val(),
			CarYear: $("#calc_caryear").val(),
			CarMake: $("#calc_carmake").val(),
			CarModel: $("#calc_carmodel").val(),
			CarType: $("#calc_cartype").val(),
			CityMPG: Number($("#calc_carcitympg").val()),
			HwyMPG: Number($("#calc_carhwympg").val()),
			CurrentGasRate: parseFloat($("#calc_cargasprice").val()),
			MLSNUM: $("#calc_id").val(),
			LifeStyle: $("#calc_status").val(),
			UserID: "",
			ParkingCost: Number($("#calc_carparking").val()),
			CommuteByCar: 1,
			CommuteByPublicTransit: 0,
			CommuteByBoth: 0,
			CommuteByNone: 0,
			KnownAPR: $("#calc_loan").val(),
			KnownLoanTerm: $("#calc_loantype").val(),
			IncludeDaycareCost: 0,
			IsProfileCommute: 0
		}, work = $("#calc_office").val(), debt = $("#calc_debt").unmask();


		/** HOX: below, post the calcdata to the calculator */
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://northstarmls2.tlcengine.com/Calculator.asmx/calculateMortgage",
			data: "{_parameters: " + JSON.stringify(calcdata) + "}",
			dataType: "json"
		}).success(function(calculation){
			var cml = calculation.d.MortgageList[0];
			$("#tlcresults").loadTemplate("/templates/tlc.html", $.extend(calculation.d.MortgageList[0], {
				tlc: calculation.d.MortgageList[0].TLCForSingle,
				homeaddress: currentproperty.fulladdress,
				workaddress: work,
				totalbreakdown: +parseFloat(debt + cml.First + cml.Tax + cml.Fees + cml.HomeInsurance + cml.Utilities + cml.CommutePayment + cml.Entertainment).toFixed(2)
			}), {
				overwriteCache: true,
				success: function(){
					$("#info-calculator").addClass("results");
					$("#tlcinfo").tabs({
						activate: function(e,ui){
							if(ui.newPanel.attr("id") == "tlcinfo-commute") {
								// show directions to work
								/** HOX: Clear map, add selected marker and directions

								For Bing:
								map.entities.clear();
								map.entities.push(curselmar);
								makeDirectionsTo(work, null, "#tlc_directions", null, true);
								*/
							} else {
								// reset map
								/** HOX: Clear directions and markers, add selected marker and POIs

								For Bing:
								directionsManager.resetDirections();
								map.entities.clear();
								map.entities.push(curselmar);
								showAllPois();
								*/
							}
						}
					});
					$("#tlccommute").tabs();
					$("#info-calculator").addClass("results");

					var breakdown = new google.visualization.PieChart($("#tlc_breakdown")[0]);
					breakdown.draw(google.visualization.arrayToDataTable([
						['Portion', 'Cost'],
						['Debt', +parseFloat(debt).toFixed(2)],
						['First mortgage', +parseFloat(cml.First).toFixed(2)],
						['Taxes', +parseFloat(cml.Tax).toFixed(2)],
						['Fees', +parseFloat(cml.Fees).toFixed(2)],
						['Insurance', +parseFloat(cml.HomeInsurance).toFixed(2)],
						['Utilities', +parseFloat(cml.Utilities).toFixed(2)],
						['Commute', +parseFloat(cml.CommutePayment).toFixed(2)],
						['Entertainment', +parseFloat(cml.Entertainment).toFixed(2)],
						['Income tax', 0],
						['Savings', 0]
					]), {
						pieHole: 0.4,
						width: 600,
						height: 370,
						chartArea: {left:10,top:10,width:"95%",height:"95%"},
						legend: {
							alignment: "center",
							position: "right",
							textStyle: {
								color: "#444",
								fontName: "'Open Sans', Arial",
								fontSize: "16px"
							}
						}
					});

					var closing = new google.visualization.PieChart($("#tlc_closing")[0]);
					closing.draw(google.visualization.arrayToDataTable([
						['Portion', 'Cost'],
						['Title service fees', 42],
						['Lender title insurance', 22.2],
						['Owner\'s title insurance', 13.9],
						['Mortgage registration tax', 17],
						['Conservation fee', 0.3],
						['Recording fee', 4.6],
					]), {
						pieHole: 0.4,
						width: 600,
						height: 370,
						chartArea: {left:10,top:10,width:"95%",height:"95%"},
						legend: {
							alignment: "center",
							position: "right",
							textStyle: {
								color: "#444",
								fontName: "'Open Sans', Arial",
								fontSize: "16px"
							}
						}
					});
				}
			});
		});
		return false;
	});

	/* edit calculator */
	$(document).on("click", "#showform", function(){
		$("#info-calculator").removeClass("results");
		return false;
	});

	/* request showing */
	$(document).on("click", "#showing", function(){
		$("#back, #actions, #profile").addClass("hide");
		$("li.detail .hero").css("height",200);

		$("li.detail").loadTemplate("/templates/showing.html", {
			address: $("li.detail .address1").text(),
			city: $("li.detail .address2").text(),
			id: $("li.detail").data("id")
		}, {
			append: true,
			overwriteCache: true,
			success: function(){
				// make checkboxes
				$("#request input[type=checkbox]").iCheck();
				// voila, show it
				setTimeout(function(){
					$("#request").css("opacity", 1);
				},10);
			}
		});
		return false;
	});

	/* cancel showing */
	$(document).on("click", "#request_back", function(){
		// hide it
		$("#request").css("opacity", 0);
		setTimeout(function(){
			$("#request").remove();
			// go back
			$("#back, #actions, #profile").removeClass("hide");
			$("li.detail .hero").css("height","40%");
		},300);
		return false;
	});


	/* site footer links */
	$("footer ul a").click(function(){
		// create sidebar
		$("footer ul, #footerback").addClass("active");
		// hide others
		$("#logo, #slogan, #search, #learnmore").addClass("hidden");
	});

	/* return from footer content */
	$("#footerback").click(function(){
		// remove sidebar
		$("footer ul, #footerback").removeClass("active");
		// show others
		$("#logo, #slogan, #search, #learnmore").removeClass("hidden");
	});



	/* HOx2: New lines since 17th below */


	/* open search tips */
	$("#searchinfo").click(function(){
		$(this).toggleClass("active");
		$("#clustering").removeClass("active");
		$("#terms").focus();
		return false;
	});

	/* open clustering menu */
	$("#clustering").click(function(){
		$(this).toggleClass("active");
		$("#searchinfo").removeClass("active");
		return false;
	});

	/* click on a clustering option */
	$("#clustering ul a").click(function(e){
		e.stopPropagation();
		$("#clustering ul a").removeClass("selected");
		$(this).addClass("selected");

		var filtertype = $(this).parent().data("filter");

		/* HOX2: code here to change the type of clustering. filtertype contains the type selected by the user.

		point - cluster by pin proximity
		zip - cluster by ZIP code
		county - cluster by county
		neighborhood - cluster by neighborhood
		school - cluster by school district
		town - cluster by town
		none - no clustering

		*/

		return false;
	});

	/* click on edit profile button */
	$("#editprofile").click(function(){
		// adjust split
		/*$("#content").animate({
			"width": "70%"
		}, 300);
		$("#map").animate({
			"width": "30%"
		}, 300);*/

		// disable handle adjustment
		disableHandle();

		// show back button
		$("#back").addClass("visible");
		$("li.detail").scrollbar("destroy");

		$("#map_overlay").addClass("visible editprofile").loadTemplate("/templates/profile/progress.html", null, {
			success: function(){
				$("#progress").circleProgress({
					value: 0.46, /** HOX2: replace with actual progress percentage */
					size: 190,
					thickness: 33,
					fill: { color: "#f7941e" },
					emptyFill: "#eeeeee",
					startAngle: -Math.PI / 2
				}).on("circle-animation-progress", function(event, progress, stepValue) {
					$(this).find("span").html(parseInt(100 * stepValue) + "<span>%</span>");
				});
			}
		});

		$("#content_overlay").addClass("visible editprofile").loadTemplate("/templates/profile/edit.html", null, {
			success: function(){
				$("#profile_edit").tabs();
			}
		});

		return false;
	});

	/* enable and disable handle adjustment */
	var disableHandle = function(){
		$("#handle").addClass("disabled");
	},
	enableHandle = function(){
		$("#handle").removeClass("disabled");
	};


	/* HOX2: End new lines since 17th */

});
