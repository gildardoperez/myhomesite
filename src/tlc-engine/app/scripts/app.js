'use strict';

/**
 * @ngdoc overview
 * @name tlcengineApp
 * @description
 * # tlcengineApp
 *
 * Main module of the application.
 */
angular
    .module('tlcengineApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'infinite-scroll',
        'ui.router',
        'ui.bootstrap',
        'highcharts-ng',
        'aa.formExtensions', 'aa.notify', 'angular-loading-bar', 'nouislider','ui.mask','LocalStorageModule','ngAutocomplete','google.places',
        'ngFileUpload', 'ngDialog','angulartics', 'angulartics.google.analytics'/*,'angulartics.debug'*/,'ngTagsInput','ngClipboard','ngDropdowns','am.multiselect', 'oc.lazyLoad'  
    ])
    .config(function ($stateProvider, $urlRouterProvider, aaFormExtensionsProvider,$locationProvider,$analyticsProvider,$urlMatcherFactoryProvider,ngClipProvider) {
        /*$locationProvider.html5Mode({
         enabled: true,
         requireBase: true
         });*/

        /*$urlRouterProvider.rule(function ($injector, $location) {
         //what this function returns will be set as the $location.url
         var path = $location.path(), normalized = path.toLowerCase();
         if (path != normalized) {
         //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
         $location.replace().path(normalized);
         }
         // because we've returned nothing, no state change occurs
         });*/
        $urlMatcherFactoryProvider.caseInsensitive(true);

        $urlRouterProvider.deferIntercept();

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/searchHome");

        aaFormExtensionsProvider.onNavigateAwayStrategies.none = function (rootFormScope, rootForm, $injector) {/*...*/ };
        aaFormExtensionsProvider.defaultOnNavigateAwayStrategy = 'none';

        ngClipProvider.setPath("//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf");

        /***Google Analytics***/
        $analyticsProvider.firstPageview(false); /* Records pages that don't use $state or $route */
        $analyticsProvider.withAutoBase(true);  /* Records full path */
        $analyticsProvider.virtualPageviews(false);
        $stateProvider
            .state('searchHome', {
                url: "/searchHome",
                templateUrl: "views/master.html",
                controller: 'MasterCtrl',
                title: 'Search',
                resolve:{
                    getAgentDetail : function(httpServices){
                        angular.element('#search').removeClass('show');
                        angular.element('#search').addClass('hide');
                        return httpServices.getAgentDetail().then(
                            function (success) {
                                if (success != undefined) {
                                    return success;
                                }
                                else {
                                    return null;
                                }
                            }, function (error) {
                                return null;
                            });
                    },
                    getClientDetail : function(){
                        return null;
                    }
                }
            })

            .state('AgentsSearch', {
                url: "/search/agentOfficeSearch",
                templateUrl: "views/agentSearch.html",
                controller: 'AgentSearchCtrl',
                title: 'Agents Search',
                access: {
                    requiresLogin: false
                },
               resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([ {
                            name: 'kendo',
                            files: [
                                'scripts/kendo.all.min.js'
                            ] 
                        }]);
                    }]
                }
            })
            .state('agentLogin', {
                url: "/agents/login",
                templateUrl: "views/agentLogin.html",
                controller: 'AgentLoginCtrl',
                title: 'Agent Login',
                resolve: {
                    authenticationDetail : function(httpServices,$state){
                        return httpServices.getAuthentication().then(function (success) {
                            if (success != undefined) {
                                if(success.AuthenticationMechanism[0].AuthenticationMechanism == 'SSO-SAML')
                                {
                                    $state.go('samlLogin');
                                }
                                else {
                                    return success;
                                }
                            }
                            else {
                                return null;
                            }
                        }, function (error) {
                            console.log(error);
                            return null;
                        });
                    }
                }
            })
            .state('agentForgotPassword', {
                url: "/agents/forgotpassword",
                templateUrl: "views/agentForgotPassword.html",
                controller: 'AgentForgotPasswordCtrl',
                title: 'Agent Forgot Password'
            })
            .state('agentDashboard', {
                url: "/agents/dashboard",
                templateUrl: "views/agentDashboard.html",
                controller: 'AgentDashboardCtrl',
                title: 'Agent Dashboard',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('agentEditProfile', {
                url: "/agents/edit",
                templateUrl: "views/agentEditProfile.html",
                controller: 'AgentEditProfileCtrl',
                title: 'Agent Edit Profile',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('agentNotifications', {
                url: "/agents/notifications",
                templateUrl: "views/agentEditProfile.html",
                controller: 'AgentEditProfileCtrl',
                title: 'Agent Edit Profile',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('agentChangePassword', {
                url: "/agents/changepassword",
                templateUrl: "views/changePassword.html",
                controller: 'ChangePasswordCtrl',
                title: 'Agent Change Password',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc', {
                url: "/agents",
                abstract: true,
                templateUrl: "views/master.html",
                controller: 'MasterCtrl',
                title: 'Search',
                resolve:{
                    getAgentDetail : function(httpServices){
                        return httpServices.getAgentDetail().then(
                            function (success) {
                                if (success != undefined) {
                                    return success;
                                }
                                else {
                                    return null;
                                }
                            }, function (error) {
                                return null;
                            });
                    },
                    getClientDetail : function(){
                        return null;
                    }
                }
            })
            .state('tlc.home', {
                url: "/home",
                templateUrl: "views/home.html",
                controller: 'HomeCtrl',
                title: 'Agent Search Home',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc.search', {
                url: "/search/:searchParams",
                templateUrl: "views/propertyList.html",
                controller: 'PropertyListCtrl',
                title: 'Agent Property Listings',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc.search.propertydetail', {
                url: "/detail/:listingId",
                templateUrl: "views/propertyDetail.html",
                controller: 'PropertyDetailCtrl',
                title: 'Agent Property Detail',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc.PropertyDirect', {
                url: "/details",
                templateUrl: "views/PropertyDirect.html",
                controller: 'PropertyDirectCtrl',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc.search.propertydetail.mls', {
                url: "mls/:mlsNumber",
                templateUrl: "views/propertyDetail.html",
                controller: 'PropertyDetailCtrl',
                title: 'Agent Property Detail',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc.PropertyDirect.MLS', {
                url: "/mls/:mlsNumber",
                templateUrl: "views/propertyDetail.html",
                controller: 'PropertyDetailCtrl',
                title: 'Agent MLS Property Detail',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlcClient', {
                url: "/clients",
                abstract: true,
                templateUrl: "views/master.html",
                controller: 'MasterCtrl',
                title: 'Search Property',
                resolve:{
                    getAgentDetail : function(httpServices){
                        return httpServices.getAgentDetail().then(
                            function (success) {
                                console.log(success,"success on appjs in clients state");
                                if (success != undefined) {
                                    return success;
                                }
                                else {
                                    return null;
                                }
                            }, function (error) {
                                return null;
                            });
                    },
                    getClientDetail : function(appAuth,httpServices){
                        if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
                            return httpServices.getClientDetail().then(function (success) {
                                if (success != undefined) {
                                    return success;
                                }
                                else {
                                    return null;
                                }
                            }, function (error) {
                                return null;
                            });
                        }
                        else
                            return null;
                    }
                }
            })
            .state('tlc.newClient', {
                url: "/clients/new",
                templateUrl: "views/newClient.html",
                controller: 'NewClientCtrl',
                title: 'Agent Add New Client',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc.clientSummary', {
                url: "/clients/:clientId?IsNew",
                templateUrl: "views/clientSummary.html",
                controller: 'ClientSummaryCtrl',
                title: 'Agent View Client Summary',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc.clientSummary.propertydetail', {
                url: "/detail/:listingId",
                templateUrl: "views/propertyDetail.html",
                controller: 'PropertyDetailCtrl',
                title: 'Agent Client Property Detail',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlc.editClientProfile', {
                url: "/clients/:clientId/profile?IsNew",
                templateUrl: "views/clientProfile.html",
                controller: 'ClientProfileCtrl',
                title: 'Agent Update Client',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('tlcClient.home', {
                url: "/home",
                templateUrl: "views/home.html",
                controller: 'HomeCtrl',
                title: 'Client Search Home',
                access: {
                    requiresLogin: false
//              ,
//            permissionType: 'Client'
                }
            })
            .state('tlcClient.search', {
                url: "/search/:searchParams?IsBookmark&IsFavorite",
                templateUrl: "views/propertyList.html",
                controller: 'PropertyListCtrl',
                title: 'Client Property Listings',
                access: {
                    requiresLogin: false
//              ,
//            permissionType: 'Client'
                }
            })
            .state('tlcClient.search.propertydetail', {
                url: "/detail/:listingId",
                templateUrl: "views/propertyDetail.html",
                controller: 'PropertyDetailCtrl',
                title: 'Client Property Detail',
                access: {
                    requiresLogin: false
                }
            })
            .state('mls', {
                url: "/mls",
                templateUrl: "views/propertyDetail.html",
                controller: 'PropertyDetailCtrl',
                title: 'Client Property Detail',
                access: {
                    requiresLogin: false
                }
            })
            .state('tlcClient.search.propertydetail.mls', {
                url: "mls/:mlsNumber",
                templateUrl: "views/propertyDetail.html",
                controller: 'PropertyDetailCtrl',
                title: 'Client Property Detail',
                access: {
                    requiresLogin: false
                }
            })
            .state('clientDashboard', {
                url: "/clients/dashboard",
                templateUrl: "views/clientDashboard.html",
                controller: 'ClientDashboardCtrl',
                title: 'Client Dashboard',
                access: {
                    requiresLogin: true,
                    permissionType: 'Client'
                }
            })
            .state('clientEditProfile', {
                url: "/clients/profile",
                templateUrl: "views/clientProfile.html",
                controller: 'ClientProfileCtrl',
                title: 'Client Edit Profile',
                access: {
                    requiresLogin: true,
                    permissionType: 'Client'
                }
            })
            .state('clientChangePassword', {
                url: "/clients/changepassword",
                templateUrl: "views/changePassword.html",
                controller: 'ChangePasswordCtrl',
                title: 'Client Change Password',
                access: {
                    requiresLogin: false
//              ,
//            permissionType: 'Client'
                }
            })
            .state('clientNotifications', {
                url: "/clients/notifications",
                templateUrl: "views/clientNotifications.html",
                controller: 'ClientNotificationsCtrl',
                title: 'Client Notifications',
                access: {
                    requiresLogin: false
//              ,
//            permissionType: 'Client'
                }
            })
            .state('tlcClient.legal', {
                url: "/legal",
                templateUrl: "views/legal.html",
                controller: 'LegalCtrl',
                title: 'Legal',
                access: {
                    requiresLogin: false
//              ,
//            permissionType: 'Client'
                }
            })
            .state('tlc.legal', {
                url: "/legal",
                templateUrl: "views/legal.html",
                controller: 'LegalCtrl',
                title: 'Legal'
            })
            .state('emailtemplate', {
                url: "/emailtemplate",
                templateUrl: "views/templates/emailtemplate.html",
                controller: 'EmailtemplateCtrl'
            })
            .state('forgetpasswordtemplate', {
                url: "/forgetpasswordtemplate",
                templateUrl: "views/templates/forgetpasswordtemplate.html",
                controller: 'ForgetpasswordtemplateCtrl'
            })
            .state('samlLogin', {
                url: "/sso/saml2/login",
                templateUrl: "views/samlLogin.html",
                controller: 'SamlLoginCtrl',
                title: 'Saml Login'
            })
            .state('samlAssertion', {
                url: "/sso/saml2/assertion/:t/:audienceType/:audienceId",
                templateUrl: "views/samlAssertion.html",
                controller: 'SamlAssertionCtrl',
                title: 'Saml Assertion'
            })
            .state('compareNeighborhood', {
                url: "/agents/compareNeighborhood",
                templateUrl: "../views/compareNeighborhood.html",
                controller: 'compareNeighborhoodCtrl',
                title: 'Compare Neighborhood',
                access: {
                    requiresLogin: true,
                    permissionType: 'MLSAgent'
                }
            })
            .state('clientCompareNeighborhood', {
                url: "/clients/compareNeighborhood",
                templateUrl: "../views/compareNeighborhood.html",
                controller: 'compareNeighborhoodCtrl',
                title: 'Compare Neighborhood',
                access: {
                    requiresLogin: true,
                    permissionType: 'Client'
                }
            })
            .state('mozaicBanner', {
              url: "/pages/mozaic-info",
              templateUrl: "views/mozaicVideoPage.html",
              title: 'Mozaic Info',
              access: {
                requiresLogin: false
              }
            })
            .state('exploreCommunities', {
              url: "/communities/:state/:city",
              templateUrl: "views/templates/exploreCommunities.html",
              controller: 'exploreCommunitiesCtrl',
              title: 'Explore Communities',
              access: {
                requiresLogin: false
              },
              resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([ {
                            name: 'kendo',
                            files: [
                                'scripts/kendo.all.min.js'
                            ] 
                        }]);
                    }]
                }
            })
             .state('zipcode', {
                url: "/cityzipcode/:city/:state/:zipcode",
                templateUrl: "views/templates/exploreCommunities.html",
                controller: 'exploreCommunitiesCtrl',
                title:'Explore Communities',
                access: {
                    requiresLogin: false
                }
            })
             .state('virginia', {
              url: "/realestate/virginia/:state/:city",
              templateUrl: "views/templates/virginia.html",
              controller: 'exploreCommunitiesCtrl',
              title: 'Explore Communities',
              access: {
                requiresLogin: false
              }
            })
             .state('maryland', {
              url: "/realestate/maryland/:state/:city",
              templateUrl: "views/templates/maryland.html",
              controller: 'exploreCommunitiesCtrl',
              title: 'Explore Communities',
              access: {
                requiresLogin: false
              }
            })
             .state('westvirginia', {
              url: "/realestate/westvirginia/:state/:city",
              templateUrl: "views/templates/westvirginia.html",
              controller: 'exploreCommunitiesCtrl',
              title: 'Explore Communities',
              access: {
                requiresLogin: false
              }
            })
              .state('pennsylvania', {
              url: "/realestate/pennsylvania/:state/:city",
              templateUrl: "views/templates/pennsylvania.html",
              controller: 'exploreCommunitiesCtrl',
              title: 'Explore Communities',
              access: {
                requiresLogin: false
              }
            })
            .state('WIP', {
                url: "/pages/work-in-progress",
                templateUrl: "views/templates/work-in-progress.html",
                title: 'Work in Progress',
                access: {
                    requiresLogin: false
                }
            })
            .state('PrivacyPolicy', {
                url: "/pages/privacy-policy",
                templateUrl: "views/templates/privacy-policy.html",
                title: 'Privacy Policy',
                access: {
                    requiresLogin: false
                }
            })
            .state('TermsOfUse', {
                url: "/pages/terms-of-use",
                templateUrl: "views/templates/terms-of-use.html",
                title: 'Terms of Use',
                access: {
                    requiresLogin: false
                }
            })
            .state('Copyrights', {
                url: "/pages/copyrights",
                templateUrl: "views/templates/copyrights.html",
                title: 'Copyrights',
                access: {
                    requiresLogin: false
                }
            })
            .state('ContactSync', {
                url: "/pages/contactsync",
                templateUrl: "views/contactSync.html",
                controller: 'contactSyncCtrl',
                title: 'Client Data',
                access: {
                    requiresLogin: false
                }
            })
    })
    .run(function ($rootScope, $location, $state, $stateParams, appAuth, $urlRouter, $analytics,applicationFactory,httpServices,$timeout) {

        //appAuth.logout();
        /*if ($location.path() == '/') {
         $location.path('/agents/Dashboard');
         }


         if (!appAuth.isLoggedIn()) {
         appAuth.saveAttemptUrl();
         $location.path('/agents/Login');
         }*/

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ui-sref-active="active }"> will set the <li> // to active whenever
        // 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeSuccess',function(){
            $("html, body").animate({ scrollTop: 0 }, 200);
        })

        $rootScope.$watch(function () {
                return $location.path();
            },
            function (a) {
                if (a.indexOf("search") != -1 && a.indexOf("detail") == -1) {
                    //$rootScope.$broadcast('browserBack');
                    if($rootScope.browserBack)
                        $rootScope.browserBack();
                }
                if ($state.current.name == "tlc.clientSummary" && a.indexOf("detail") == -1){
                    if($rootScope.ClientSummeryBack)
                        $rootScope.ClientSummeryBack();
                }
                if (a.indexOf("legal") != -1)
                    $rootScope.IsSearchCriteriaDisplay = false;
                else
                    $rootScope.IsSearchCriteriaDisplay = true;
                setSearchTagUI();
            });

        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
            /*var permission = next.$$route.permission;
             if(_.isString(permission) && !permissions.hasPermission(permission)) {
             $location.path('/unauthorized');
             }*/
            //appAuth.logout();

          if(to.name.toLowerCase() == "agentLogin".toLowerCase() || to.name.toLowerCase() == "samlLogin".toLowerCase()) {
              appAuth.saveAttemptUrl();
           }
            $('.modal').modal('hide');
            if(to.access !== undefined && to.access.requiresLogin == true && appAuth.isLoggedIn().AudienceType == 'AnonymousUser') {
                //appAuth.saveAttemptUrl();
                ev.preventDefault();
                if(to.access.permissionType == 'Client') {
                    $state.go('searchHome');
                    janrain.capture.ui.start();
                } else if(to.access.permissionType == 'MLSAgent') {
                    $state.go('agentLogin');
                }
            }
            else if(to.access !== undefined && to.access.requiresLogin == true && to.access.permissionType == 'Client'
                && appAuth.isLoggedIn() && appAuth.isLoggedIn().AudienceType == 'MLSAGENT')
            {
                ev.preventDefault();
                $state.go('agentDashboard');
            }
            else if(to.access !== undefined && to.access.requiresLogin == true && to.access.permissionType == 'MLSAgent'
                && appAuth.isLoggedIn() && appAuth.isLoggedIn().AudienceType == 'CLIENT')
            {
                ev.preventDefault();
                $state.go('clientDashboard');
            } else {
                console.log('In state 4');
            }

            if($state.current.name == 'tlcClient.search.propertydetail' || $state.current.name == 'tlc.search.propertydetail' || $state.current.name == 'tlc.PropertyDirect.MLS' || $state.current.name == 'tlcClient.search.propertydetail.mls') {
                $("#content_overlay").hasClass("visible") ? (0 == $("li.detail").length ? ($(this).removeClass("visible"),
                  $("#content").animate({
                    width: $.cookie("tlc_hpos") + "%"
                  }, 300), $("#map").animate({
                  width: 100 - $.cookie("tlc_hpos") + "%"
                }, 300)) :
                  $("#content_overlay, #map_overlay").removeClass("visible"), k()) : ($(this).removeClass("visible"),
                  setTimeout(function () {
                    setTimeout(function () {
                      $("#results > li").css("opacity", 1);
                    }, 600);
                    var a = $("li.detail"), b = $("#results li[ListingId=" + $stateParams.listingId + "]");
                    if($(window).width() >= 768) {
                      $("#content").animate({
                        width: "74%"//$.cookie("tlc_hpos") + "%"
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


                $("#content").removeClass("PropDetailPage");
                $("#map").removeClass("PropDetailMap");
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
                $('#handle').hide();
                $('#arrowButton').show();
                $("#content").addClass("property_list");
            }
		      //if(to.name != 'tlcClient.search.propertydetail' && to.name != 'tlc.search.propertydetail' && to.name != 'tlc.PropertyDirect.MLS' && to.name != 'tlcClient.search.propertydetail.mls' && (from.name == "tlc.search" || from.name == "tlcClient.search")) {
          if(from.name != "tlc.search" && from.name != "tlcClient.search" && from.name != "searchHome" && from.name.toLowerCase() != 'tlc.home'.toLowerCase()
            && from.name.toLowerCase() != 'tlcClient.home'.toLowerCase() && from.name.toLowerCase() != 'tlc'.toLowerCase() && from.name.toLowerCase() != 'tlcClient'.toLowerCase() && from.name != ""
          && to.name != 'searchHome' && to.name != 'tlcClient.search.propertydetail' && to.name != 'tlc.search.propertydetail' && to.name != 'tlc.PropertyDirect.MLS' && to.name != 'tlcClient.search.propertydetail.mls') {
            //console.log(from.name);
            //console.log("APP STATE STARTING ADD REMOVEBG");
            //$("#search").addClass("removeBG");
            $rootScope.removeBGClass = "removeBG";
          }

        });


        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                if(toState.title !== undefined) {
                    $rootScope.title = 'TLCengine - ' + toState.title;
                }

                if(toState.name.indexOf('tlc.') > -1 || toState.name.indexOf('tlcClient.') > -1)
                {
                    var settings = applicationFactory.getSettings();
                    //document.body.style.backgroundImage = "url("+ $rootScope.BackgroundImageUrl +")";
                    // $('body').css({background : 'url('+settings.BackgroundImageUrl+') no-repeat center center fixed'});
                }
                else
                {
                    $('body').css({background :''});
                }

                if ($state.current.name != 'tlcClient.search' && $state.current.name != 'tlc.search' && $state.current.name != 'tlcClient.search.propertydetail' && $state.current.name != 'tlc.search.propertydetail' && $state.current.name != 'tlc.PropertyDirect.MLS' && $state.current.name != 'tlcClient.search.propertydetail.mls') {
                  if ($('body').hasClass('results')) {                    
                    $('body').removeClass('results');                    
                  }
                  $('body').removeClass('detailpage'); 
                  $('#draw').show();  
                  $('#slideshow').show();
                  $('.footer-home').show();                                                         
                }             
                else{
                    if($state.current.name != 'tlcClient.search' || $state.current.name != 'tlc.search') {
                        if ($('body').hasClass('detailpage')) {
                            $('body').removeClass('detailpage');
                            $('#draw').show();
                        }
                    }
                    setTimeout(function(){
                        $('#slideshow').hide();
                        $('.footer-home').hide();
                    },1000);
                }
                if ($("#bs-example-navbar-collapse-1").hasClass('in')) {
                    $("#bs-example-navbar-collapse-1").removeClass('in');
                }

                if($state.current.name != 'tlc.search.propertydetail' && $state.current.name != 'tlcClient.search.propertydetail') {                    
                    $rootScope.searchParameters = [];
                    $rootScope.searchParameters = angular.copy($rootScope.emptySearchObj);
                }

                if(!showOrHide) {
                    $( "#footer" ).show();
                    $(".splitter-button").removeClass("uparrow");
                    $(".white-background").css("min-height","86%");
                    $(".splitter-arrow").css("display","none");
                }

                setTimeout(function(){$analytics.pageTrack($location.path())}, 0);
                $timeout(function() {
                  $rootScope.display_search_form = true;
                  /*console.log($state.current.name);
                  if ($state.current.name == 'searchHome') {
                    console.log("REMOVE IN STATE CHANGE SUCCESS");
                    $(".my-remove-bg").removeClass("removeBG");
                    $rootScope.removeBGClass = "";
                  }*/
                });
            })

        $rootScope.$on('$stateNotFound',
            function(event, unfoundState, fromState, fromParams){
                console.log("State Not Found");
                $location.path('/');
            })

        /*$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
         if (error.status == 401) {
         $state.go("agentLogin", { returnUrl: $location.url() });
         }
         })*/

        $rootScope.$on('$locationChangeSuccess',function(e, newUrl, oldUrl){
            e.preventDefault();

//          if ($state.current.name === 'tlc.search') {
//              // your stuff
//              console.log("newUrl ", newUrl);
//              console.log("oldUrl ", oldUrl);
//              console.log("newUrl ", newUrl.indexOf("/agents/search"));
//              console.log("oldUrl ", oldUrl.indexOf("/agents/search"));
//              var newIndex = newUrl.indexOf("/agents/search");
//              var oldIndex = oldUrl.indexOf("/agents/search");
//
//              if(newIndex == oldIndex){
//                 //Don't sync
//                  console.log("Do not sync ");
//              }else{
//                  console.log("inner else");
//                  $urlRouter.sync();
//              }
//          } else {
//              console.log("outer else");
          $urlRouter.sync();
//          }

        });

        $rootScope.$on('$viewContentLoaded', function () {
            var audience =  appAuth.isLoggedIn();

            if (document.getElementById("usabillaCustom")) {
                $("#usabillaCustom").remove();
            }

            if(audience) {

                var innerHtml = 'window.usabilla_live("data", {"email": "","custom":{"AudienceType": "' + audience.AudienceType + '",'
                    + '"AudienceId": "' + audience.Audience.Id + '",'
                    + '"Name": "' + audience.Audience.FirstName + ' ' + audience.Audience.LastName + '",'
                    + '}});';

                var audience = appAuth.isLoggedIn();
                var script = document.createElement('script');
                script.id = "usabillaCustom";
                script.type = 'text/javascript';
                script.innerHTML = innerHtml;

                document.body.appendChild(script);
            }

            if(appAuth.isLoggedIn().AudienceType == 'MLSAGENT') {
                httpServices.getAgentDetail().then(
                    function (success) {
                        if (success != undefined) {
                            LoggedInAgent = success;
                            document.getElementById("captureUserName").innerHTML = success.FirstName;
                            $('#isagentUser').val('true');
                            $('#agent-login-ui-sref').css("display","none"); //TO REMOVE AGENT LOGIN BUTTON
                            $("#savedSearchButtonId").html("My saved search");  //For Saved Search button changes
                            $(".saved-data").removeClass("login-opt-saved-srch");
                            var agentName = success.FirstName;
                            if(success.FirstName) {
                                document.getElementById("captureUserName").innerHTML = 'Welcome ' + success.FirstName + '!<span class="caret"></span><span style="font-size:initial;">&nbsp;&nbsp;(Agent)</span>';
                                $('#agentName').val(agentName);
                            } else {
                                document.getElementById("captureUserName").innerHTML = 'Agent User<span class="caret"></span>';
                                $('#agentName').val('Agent User');
                            }
                            $('li.blue-back').addClass('agent-bar');
                            document.getElementById("captureUserName").setAttribute("data-toggle", "dropdown");
                        }
                        else {
                            return null;
                        }
                    }, function (error) {
                    return null;
                });
            }
          $timeout(function() {
            if ($state.current.name == 'searchHome' || $state.current.name.toLowerCase() == 'tlc.home'.toLowerCase() || $state.current.name.toLowerCase() == 'tlcClient.home'.toLowerCase()
              || $state.current.name.toLowerCase() == 'tlc'.toLowerCase() || $state.current.name.toLowerCase() == 'tlcClient'.toLowerCase()) {
              //console.log("REMOVE IN VIEW CONTENT LOADED");
              $(".my-remove-bg").removeClass("removeBG");
              $rootScope.removeBGClass = "";
            }
          });
        });

        // Configures $urlRouter's listener *after* your custom listener
        $urlRouter.listen();
    })
    .config(function ($httpProvider,$compileProvider,cfpLoadingBarProvider) {
        $httpProvider.interceptors.push('httpInterceptorService');

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        //cfpLoadingBarProvider.spinnerTemplate = '<div class="loader-wrapper"><i class="fa fa-spinner fa-4x fa-spin"></i></div>';
        /*$httpProvider.defaults.withCredentials = true;
         $httpProvider.defaults.useXDomain = true;
         $httpProvider.defaults.headers.common = 'Content-Type: application/json';
         delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

        $httpProvider.defaults.cache = false;
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache, no-store';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        $compileProvider.debugInfoEnabled(false);
        $httpProvider.useApplyAsync(true);
    });

/*.config(function ($routeProvider) {
 $routeProvider
 .when('/', {
 templateUrl: 'views/home.html',
 controller: 'HomeCtrl',
 action: 'load'
 })
 .when('/search/:searchParams', {
 templateUrl: 'views/home.html',
 controller: 'HomeCtrl',
 action: 'search'
 })
 .when('/about', {
 templateUrl: 'views/about.html',
 controller: 'AboutCtrl'
 })
 .otherwise({
 redirectTo: '/'
 });
 });*/
