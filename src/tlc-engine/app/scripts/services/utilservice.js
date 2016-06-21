'use strict';

/**
 * @ngdoc service
 * @name tlcengineApp.utilService
 * @description
 * # utilService
 * Factory in the tlcengineApp.
 */

angular.module('tlcengineApp').factory('utilService', ['propertiesService', 'appAuth', 'httpServices', '$injector', 'aaNotify',  function (propertiesService, appAuth, httpServices, $injector, aaNotify) {

    var Utils = {

        productList: [],

//        setDataForConnectWithAgent: function (data) {
//            this.productList = data;
//        },
//
//        getDataForConnectWithAgent: function () {
//            return this.productList;
//        },

        getSortPriceforSearch: function (price) {
            if (price != undefined) {
                if ((parseInt(price) + "" ).length <= 7){
                        return addCommas((price / 1000)) + "k";
                }else{
                        return addCommas((price / 1000000)) + "M";
                }
            }
            else
                return price;
        },
        getSortPrice: function (price) {
            if (price != undefined) {
                if ((parseInt(price) + "" ).length <= 7){
                        return addCommas((price / 1000)) + "k";
                }else{
                        return addCommas((price / 1000000)) + "M";
                }
            }else
                return price;
        },

        formatNumber : function(number){
            return addCommas(Math.round(number));
        },

        formatNumberWithoutComma : function(number){
            return Math.round(number);
        },

        removeCommasFromNumber : function(number){
            if(number.indexOf(',') != -1){
                number = number.replace(/,/g, '');
            }
            return number;
        },

        getMLSNumberPattern : function(){
            return /^#/;
        },

        getKeywordPattern : function(){
            return /^@/;
        },

        getPolygonPattern : function(){
            return /^(([-+]?([1-9]*\d(\.\d+)?|90(\.0+)?)[ ]+\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]*\d))(\.\d+)?))[,]*)+$/;
        },
        getNeighborhoodPattern : function(){
          //return /^:/;
          return /\(Neighborhood\)/g;
        },
        getCurrentLocationPattern : function(){
          //return /^:/;
          return /\(Current Location\)/g;
        },
        decimalPlaces : function (num) {
            var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) { return 0; }
            return Math.max(
                0,
                // Number of digits right of decimal point.
                    (match[1] ? match[1].length : 0)
                    // Adjust for scientific notation.
                    - (match[2] ? +match[2] : 0));
        },

        /*This will return the current week start date (monday), end date (sunday) and current date in YYYY-mm-dd*/
        getCurrentWeek : function (){
            var value = [];
            Date.prototype.getWeek = function(start)
            {
                //Calculating the starting point
                start = start || 1;
                var today = new Date(Utils.setHours(0, 0, 0, 0));
                var day = today.getDay() - start;
                var date = today.getDate() - day;

                // Grabbing Start/End Dates
                var StartDate = new Date(today.setDate(date));
                var EndDate = new Date(today.setDate(date + 6));
                var NextWeekEndDate = new Date(today.setDate(date + 13));//(this week sunday + next week sunday that is 6 + 7 )
                return [StartDate, EndDate, NextWeekEndDate];
            }

            var currentWeek = new Date().getWeek();
            var today = new Date();
            var fromDate = currentWeek[0].getFullYear() + "-"+ (currentWeek[0].getMonth() + 1) + "-" + currentWeek[0].getDate();
            var toDate = currentWeek[1].getFullYear() + "-"+ (currentWeek[1].getMonth() +1) + "-" + currentWeek[1].getDate();
            var currentDate = today.getFullYear() + "-"+ (today.getMonth() +1) + "-" + today.getDate();
            var nextWeekEndDate = currentWeek[2].getFullYear() + "-"+ (currentWeek[2].getMonth() +1) + "-" + currentWeek[2].getDate();

            value.push(fromDate);
            value.push(toDate);
            value.push(currentDate);
            value.push(nextWeekEndDate);
            return value;
        },

        loginUser : function(janRainUserAuth) {
            propertiesService.clientLogin(janRainUserAuth,
            function (success) {
                console.log(success);
                if (success != undefined) {
                    appAuth.login(success);
                    Utils.onLoginSuccess(success);
                    var sso_id = localStorage.janrainCaptureProfileData;
                    if (typeof(Storage) !== "undefined") {
                        if (localStorage.janrainCaptureProfileData) {
                            sso_id = JSON.parse(sso_id);
                            sso_id = sso_id['uuid'];
                        }
                    }
                    Utils.validateAgentBetweenTLCAndMozaic(success.Audience.Id, sso_id, success.Audience.FirstName);
                }
            }, function (error) {
                console.log(error);
//                aaNotify.warning('User does not exist in TLC Engine. Please sign out from JanRain </br> and use a valid account or create a new account!',{
//                  showClose: true,                            //close button
//                  iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
//                  allowHtml: true,                            //allows HTML in the message to render as HTML
//                  ttl: 1000 * 10                              //time to live in ms
//                });
            });
        },

        registerUser: function(result) {
            console.log(result);
            var audi_id = getAgentId();
            var dName = result.userData.displayName;
            var fName = result.userData.displayName;
            var lName = result.userData.displayName;
            if(dName.indexOf(' ') > -1) {
                fName = dName.substring(0, dName.indexOf(' '));
                lName = dName.substring(dName.indexOf(' ') + 1, dName.length);
            }
            var email = result.userData.email;
            var IsJanrain = 1;

            var userData = '{"Id":0,"AgentId":"'+ audi_id + '","Profile":{"BasicData":{"MStatus":"single","CellPhone":"","WorkingWithTCOAgent":false,"HidePersonalDetailFromAgent":false,"FirstName":"' + fName + '","LastName":"' + lName + '","Email":"' + email + '"},"IncomeData":{},"CommuteData":{},"CurrentResidenceData":{},"DebtData":{},"AssetData":{},"FinancialData":{},"LifeStyleData":{"AddGrociers":false,"AddSuperStores":false,"AddPharmacies":false,"AddHousehold":false,"AddMovieTheaters":false,"AddPublicTransport":false,"AddAirport":false,"AddGolf":false,"AddSkiing":false,"AddBeach":false},"EntertainmentData":{"Other":{}},"OtherTLCData":{}},"SupportingInformation":{"ProfileCompletionPercentage":25},"IsJanrain":1,"FirstName":"'+ fName + '","LastName":"' + lName + '","Email":"' + email + '"}';
            var userData = JSON.parse(userData);
            var janRainUserAuth = {Username: email, IsJanrain:1, FirstName:fName, LastName:lName, AgentId:audi_id };

            propertiesService.agentNewClient({agentId:audi_id}, userData
            , function (success) {
                console.log(success)
                console.log('Social login user creation success!');
                Utils.loginUser(janRainUserAuth);
            }, function (error) {
                console.log(error);
            });
        },

        validateAgentBetweenTLCAndMozaic : function(clientId, userSSOId, FirstName) {
            propertiesService.getMozaicAgent({"UserSsoId":userSSOId},
                function (success) {
                    console.log(success);
                    currentAgent = success.response;
                    var agents = JSON.parse(success.response).agents;
                    if (agents != undefined) {
                        var agentId = "";
                        var guid = "";
                        if (agents.length != 0) {
                            agentId = agents[0].agentId;
                            console.log(agentId);
                        } else {
                            guid = getAgentId();
                            console.log('No agents associated/pending invitation')
                        }
                        Utils.saveAgentId(clientId, agentId, guid, FirstName);
                    }
                }, function (error) {
                    console.log(error);
                }
            );
        },

        saveAgentId: function(clientId, agentId, guid, FirstName) {
            propertiesService.saveAgentId({"agentId":agentId, "clientId": clientId, "AgentGuid": guid },
                function (success) {
                    console.log(success);
                    if(success.Message == "Client and agent are associated successfully!" ) {
//                        aaNotify.success(' Hello ' + FirstName + '! <br> You have been associated with your agent now! You can see your agent details in your Dashboard. <br><br> <b>Page will be reloaded in 5 seconds!</b>',{
//                          showClose: true,                            //close button
//                          iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
//                          allowHtml: true,                            //allows HTML in the message to render as HTML
//                          ttl: 1000 * 10                              //time to live in ms
//                        });
//                        setTimeout(function(){ location.reload(); }, 5000);
                    }
                }, function (error) {
                    console.log(error);
                }
            );
        },

        logout: function() {
            console.log('Logout to be initiated');

            httpServices.logoutUser();
            appAuth.logout();
            Utils.onLogoutSuccess();

            var $state = $injector.get("$state");
            $state.go('searchHome');
            if($('body').hasClass('results')){
              $('body').removeClass('results');
            }
        },

        /*This will initiate the Janrain plugin and register capture events*/
        initJanRain : function() {
            console.log('JanRain Initiated');
            janrain.events.onCaptureLoginSuccess.addHandler(function(result) { //login
                janrain.capture.ui.modal.close();
                if (window.console && window.console.log)
                    console.log("onCaptureLoginSuccess", result);
                var audi_id = getAgentId();
                var dName = result.userData.displayName;
                var fName = result.userData.displayName;
                var lName = result.userData.displayName;
                if(dName.indexOf(' ') > -1) {
                    fName = dName.substring(0, dName.indexOf(' '));
                    lName = dName.substring(dName.indexOf(' ') + 1, dName.length);
                }
                var email = result.userData.email;
                var janRainUserAuth = {Username: email, IsJanrain:1, FirstName:fName, LastName:lName, AgentId:audi_id };
                Utils.loginUser(janRainUserAuth);
                //Utils.onLoginSuccess(result);
                var $state = $injector.get("$state");
                if($state.current.name != 'AgentsSearch') {
                    $state.reload();
                }
            });


            janrain.events.onCaptureSessionFound.addHandler(function(result) { //refresh
                janrain.capture.ui.modal.close();
                if (window.console && window.console.log)
                    console.log("onCaptureSessionFound", result);

                if(typeof(Storage) !== "undefined") {
                    if(localStorage.janrainCaptureProfileData) {
                        var ls = localStorage.janrainCaptureProfileData;
                        ls = JSON.parse(ls);
                        console.log(ls);
                        var audi_id = getAgentId();
                        var fName = ls['displayName'];
                        var lName = ls['displayName'];
                        var email = ls['email'];
                        var janRainUserAuth = {Username: email, IsJanrain:1, FirstName:fName, LastName:lName, AgentId:audi_id };
                        Utils.loginUser(janRainUserAuth);
                        var result = {authProfileData:{name:{formatted: ls['displayName']} } };
                        //Utils.onLoginSuccess(result);
                    }
                }
            });

            janrain.events.onCaptureRegistrationSuccess.addHandler(function(result) { //registration
                janrain.capture.ui.modal.close();
                if (window.console && window.console.log)
                    console.log("onCaptureRegistrationSuccess", result);
                Utils.registerUser(result);
                //Utils.onLoginSuccess(result);
            });

            janrain.events.onCaptureSessionEnded.addHandler(function(result) { // logout
                Utils.logout();
            });

            janrain.events.onCaptureScreenShow.addHandler(function(result) { // Pop up pops up
                if (result.screen == "returnTraditional") {
                    //janrainReturnExperience();
                }
            });

            // should be the last line in janrainCaptureWidgetOnLoad()
            janrain.capture.ui.start();
        },

        onLoginSuccess: function(result) {
            document.getElementById("captureUserName").innerHTML = 'Welcome ' + result.Audience.FirstName.charAt(0).toUpperCase().trim() + result.Audience.FirstName.slice(1) + '!<span class="caret"></span>';
            document.getElementById("captureUserName").setAttribute("data-toggle", "dropdown");
            $('li.blue-back').removeClass('open');
            $('#login-menu-height-control').removeClass('login-menu-height-control');
            $('#agent-login-ui-sref').hide();
            $("#savedSearchButtonId").html("My saved search");  //For Saved Search button changes
            $(".saved-data").removeClass("login-opt-saved-srch");     
            var $rootScope = angular.element(document).injector().get('$rootScope');
            $rootScope.$broadcast("searchSaved");
        },

        onLogoutSuccess: function() {
            document.getElementById("captureUserName").innerHTML = 'Login or Register';
            document.getElementById("captureUserName").removeAttribute("data-toggle");
            currentAgent = null;
            $('li.blue-back').removeClass('open');
            $('#login-menu-height-control').addClass('login-menu-height-control');
            $('.dropdown-menu').hide();
            $('#agent-login-ui-sref').show();
            $('li.blue-back').removeClass('agent-bar');
            $("#savedSearchButtonId").html("Save search");  //For Saved Search button changes
            $(".saved-data").addClass("login-opt-saved-srch");
        }

    };
    // Public API here
    return Utils;
  }]);
