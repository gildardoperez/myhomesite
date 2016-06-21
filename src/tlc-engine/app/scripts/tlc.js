Array.prototype.max = function () {
    return Math.max.apply(Math, this);
};


var mozaic_projectID;
var mozaic_listingId;
var mozaic_userId;
var currentLat = '';
var currentLong = '';
var showOrHide = true;
var currentAgent;
var LoggedInAgent = {};
var restype_tlc = "Sales";

function rangeNumberValidator(e) {
    //console.log("e.target", e.target, $(e.target).parent().data("slider-step"), $(e.target).val(), $(e.target).val().indexOf("."));
    var isFloat = false;
    var minLimit = $(e.target).parent().data("min");
    var maxLimit = $(e.target).parent().data("max");
    var id = ($(e.target).parent().attr("id") || $(e.target).parent().attr("name"));

    var slider_step = $(e.target).parent().data("slider-step");
    if (slider_step != undefined && (slider_step + "").indexOf(".") != -1) {
        isFloat = true;
    }

    if (e.shiftKey && (e.keyCode == 190 || (e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 185 && e.keyCode < 193) || (e.keyCode > 218 && e.keyCode < 221) || e.keyCode==53)) {
        e.preventDefault();
    }
    //console.log($(e.target).val().indexOf("."));
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||

        (($.inArray(e.keyCode, [110, 190]) !== -1) && isFloat && $(e.target).unmask().indexOf(".") == -1) ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {

        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
    var finalVal = Number($(e.target).unmask() + "" + e.key);
    if (isFloat) {
        finalVal = Number($(e.target).val() + "" + e.key);
    }

    //console.log(finalVal);
    //check for min and max value
    if (id != "year") {
        if ((finalVal < minLimit) || (finalVal > maxLimit)) {
            //console.log(finalVal, minLimit, maxLimit);
            e.preventDefault();
        }
    }
}

/*---- logo onclick --- */
$(document).ready(function() {
    
    // var mozaicBannerHeight = $(".footer-banner>img").height();    

    // $(".mozaicBannerClick").height('mozaicBannerHeight');
    $('[data-toggle="tooltip"]').tooltip();  

    $(".logo,.navbar-left").click(function(){
        if($('body').hasClass('results')){
            $('body').removeClass('results');
            $('#resetSearch').trigger('click');
        }
    });
    
    // $("#captureUserName").click(function(){
    //     $('html, body').animate({
    //         scrollTop: 0
    //     },100);
    // })

    $('body').click(function(evt){ 
        if(window.innerWidth<767){
            if($(evt.target).closest('button.navbar-toggle').length)
                return;              
            else{                
            $("#bs-example-navbar-collapse-1").removeClass('in');
            // Jaya - added
            $(".usabilla_live_button_container").css({"display":"none"});
            }
        }

    });
    
    $("button.navbar-toggle").click(function(){ 
        // Jaya - added 1 line  
        $(".usabilla_live_button_container").css({"display":"none"});  
        if($("#bs-example-navbar-collapse-1").hasClass('in')){    
            $(".usabilla_live_button_container").css({"display":"none"});
            $('.blue-back').removeClass('slideUp');
        }
        else{
            $(".usabilla_live_button_container").css({"display":"block"});  
        }
    });

  

    $(".splitter-button").click(function(){
        showOrHide = !showOrHide;
        if ( showOrHide === true ) {
            $( "#footer" ).show();
            $("html, body").animate({ scrollTop: $(document).height() }, 1000);
            $(".splitter-button").removeClass("uparrow");
            $(".white-background").css("min-height","86%");
            $(".splitter-arrow").css("display","none");
            $("footer .lower-bar").css("padding-left","15px");

        } else if ( showOrHide === false ) {
            $("#footer").hide();
            $(".splitter-button").addClass("uparrow");
            $(".white-background").css("min-height","93%");
            $(".splitter-arrow").css("display","block");
            $("footer .lower-bar").css("padding-left","150px");
        }
    });
    var insidDv = false;
    var abbrClicked = 0, saveSearch=0;
     $(document).on('click','#topactions .black_overlay',function(){
       insidDv = true;
         if(abbrClicked != 0)
                $('#light').toggleClass('display-none');
         abbrClicked++;
    });
    $(document).on('click','#saved-search-opetion',function(){
       insidDv = true;
        if(saveSearch != 0)
            $('.saved-data').toggleClass('display-none');
        saveSearch++;
    });
    $(document).on('click','#topactions',function(){
        if(insidDv){
            insidDv = false;
            return;
        }
        showOrHide = !showOrHide;
        if ( showOrHide === true ) {           
            $( ".more_topactions, #light, .saved-data").addClass("display-none");
            $(".more_topactions").removeClass("my-save-css"); 
        } else if ( showOrHide === false ) {
            $(".more_topactions").addClass("my-save-css"); 
            $( ".more_topactions").removeClass("display-none");           
        }
    });

    // width: 280px;
    // right: -10px;
    // min-height: 170px;

    // var moreOrless = true;
    //   $(document).on('click',".more-show-hide", function(){
    //     moreOrless = !moreOrless;
    //     if ( moreOrless === true ) {
    //         $(".show-container").hide();
    //         $(".less-button").hide();
    //         $(".more-button").show();
    //         $("#search.more").css("height","940px");
    //     } else if ( moreOrless === false ) {
    //         $(".show-container").show();
    //         $(".less-button").show();
    //         $(".more-button").hide();
    //         $("#search.more").css("height","1280px");
    //         // $("#search.more").height(SearchHeightChange() + "px");
    //         // console.log('SearchHeight',SearchHeightChange());
    //     }
    // });


    var HeaderToggle = true;
    $(document).on('click', "#header-splitter, #header-splitter-mob, #header-splitter-mob-2", function() {
        HeaderToggle = !HeaderToggle;
        trackGoogleAnalytics('Button that collapses and expands floating bar at top of screen', 'Search Results', null, 'Expand/collapse bar')
        if ( HeaderToggle === true ) {
            $( ".results .navbar-default" ).show();
            $( ".results #footer" ).show();
            $("#header-splitter, #header-splitter-mob, #header-splitter-mob-2 ").removeClass("top-bottom-arrow");
            $(".white-background").css("min-height","87%");
            $("body.results #search").css("top","60px");
            exitFullscreen();
        } else if ( HeaderToggle === false ) {
            $( ".results .navbar-default" ).hide();
            $( ".results #footer" ).hide();
            $("#header-splitter, #header-splitter-mob, #header-splitter-mob-2").addClass("top-bottom-arrow");
            $(".white-background").css("min-height","100%");
            $("body.results #search").css("top","1px");
            launchIntoFullscreen(document.documentElement); // the whole page
        }

    });

    $('#connectWithAgent').on('show.bs.modal', function () {
        $('#connectAgentLabel').css('color','#84B643');
        $('#invitationFormWOLogin .col-md-6 label').addClass('col-md-6 col-sm-12').removeClass('col-sm-2');
        $('#invitationFormWOLogin .col-md-6 label').css('color','#777');
        $('#invitationFormWOLogin .col-md-12 label').addClass('col-md-12 col-sm-12').removeClass('col-sm-2');
        $('#invitationFormWOLogin .col-md-12 label').css('color','#777');
        $('#invitationFormWOLogin .col-md-6 .form-group .col-sm-3').addClass('col-md-12 col-sm-12').removeClass('col-sm-3');
        $('#invitationFormWOLogin .col-md-12 .form-group .col-sm-3').addClass('col-md-12 col-sm-12').removeClass('col-sm-3');
        $('.modal-footer').css('border','none');
    });


    fitWindow();


});

$( window ).resize(function() {
    fitWindow();
});

// window.onscroll = function(ev)
// {
//     var B= document.body; //IE 'quirks'
//         var D= document.documentElement; //IE with doctype
//         D= (D.clientHeight)? D: B;

//     if (D.scrollTop == 0)
//         {
//             $("#mozaic-footer-widget").css("bottom","0px");
//         }
// };


// function SearchHeightChange(){
//    var SearchHeight = $("#search.more").height() + $(".more-option").height();
//    return SearchHeight;
//    console.log('SearchHeight',SearchHeight,$(".more-option").height());
// }




function fitWindow(){
    
    $(".dropdown-toggle").click(function(){
        console.log("tes");
        var NavDropHeight = $("#bs-example-navbar-collapse-1").height() + $(".navbar-header").height() + $("#login-dp").height();
        if(window.innerHeight<552){
            if($("#login-dp").is(":visible")){
                $('.blue-back').addClass('slideUp');
            }else{
                $('.blue-back').removeClass('slideUp');
            }
            $("body").click(function(){
                $('.blue-back').removeClass('slideUp');
            });
        }   
        $("body").scrollTop(0);
    });


    var moreOrless = true;
      $(document).on('click',".more-show-hide", function(){
        moreOrless = !moreOrless;
        if ( moreOrless === true ) {
            $(".show-container").hide();
            $(".less-button").hide();
            $(".more-button").show();
            // $("#search.more").css("height","940px");
            $("#search.more").removeClass('more-height')
        } else if ( moreOrless === false ) {
            $(".show-container").show();
            $(".less-button").show();
            $(".more-button").hide();
            $("#search.more").addClass('more-height')
            // $("#search.more").height(SearchHeightChange() + "px");
            // console.log('SearchHeight',SearchHeightChange());
        }
    });

}

function myFunction_heart(heart){
    if($(heart).hasClass('glyphicon-heart-empty')){
        $(heart).removeClass('glyphicon-heart-empty');
        $(heart).addClass('glyphicon-heart');
    } else if($(heart).hasClass('glyphicon-heart')) {
        $(heart).removeClass('glyphicon-heart');
        $(heart).addClass('glyphicon-heart-empty');
    }
}

function myFunction_star(id){
    var star = $(id);
    if($(star).hasClass('glyphicon-star-empty')){
        $(star).removeClass('glyphicon-star-empty');
        $(star).addClass('glyphicon-star');
    } else if($(star).hasClass('glyphicon-star')) {
        $(star).removeClass('glyphicon-star');
        $(star).addClass('glyphicon-star-empty');
    }
}

function getAgentId() {
    return globalSettings.agentId;
}

/***
 Simple jQuery Slideshow Script
 Released by Jon Raasch (jonraasch.com) under FreeBSD license: free to use or modify, not responsible for anything, etc.  Please link out to me if you like it :)
 ***/

function slideSwitch() {
    var $active = $('#slideshow IMG.active');
    if ( $active.length == 0 ) $active = $('#slideshow IMG:last');
    // use this to pull the images in the order they appear in the markup
    var $next =  $active.next().length ? $active.next()
        : $('#slideshow IMG:first');

    $active.addClass('last-active');
    $next.css({opacity: 0.0})
        .addClass('active')
        .animate({opacity: 1.0}, 1000, function() {
            $active.removeClass('active last-active');
        });
}
/* Footer alignment on resize */
//var count =0;
//$(window).load(function() {
//    setInterval(function(){
//        if($('.white-background').height()>0){
//            if(count == 0){
//                fitWindow();
//            }
//
//        }
//    });
//});
//
//function fitWindow() {
//    var contentHeight = $('.white-background').height() + 350;
//    count++;
//    if(window.innerHeight > contentHeight){
//        $('.footer-bottom').addClass("footer-juery");
//        $('.white-background').addClass("white-background-jquery");
//    }
//    else{
//        $('.footer-bottom').removeClass("footer-juery");
//        $('.white-background').removeClass("white-background-jquery");
//    }
//
//}

function applyfavorite(pID) {
    $("#add-favorite_" + pID).hide();
    $("#remove-favorite_" + pID).show();
    $("#add-favorite_" + pID).closest('li').addClass('bookmark-active');
    $(".add-favorite_" + pID).hide();
    $(".remove-favorite_" + pID).show();
}

function signupPopup() {
    if (document.getElementById("captureUserName").innerHTML == "Login or Register") {
        janrain.capture.ui.start();
        window.scrollTo(0,0)
    }
}

function logoutuser() {
    var injector = angular.element(document).injector();
    var utilser = injector.get('utilService');
    utilser.logout();
    var $rootScope = injector.get('$rootScope');
    $rootScope.$digest();
}

/** Full screen Code
 * https://davidwalsh.name/fullscreen
 * **/
function launchIntoFullscreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function trackGoogleAnalytics(eventName, category, value, label) {
    var injector = angular.element(document).injector();
    var httpServices = injector.get('httpServices');
    httpServices.trackGoogleEvent(eventName, category, value, label);
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}