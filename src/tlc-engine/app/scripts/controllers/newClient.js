(function () {
  'use strict';

angular.module('tlcengineApp').controller('NewClientCtrl',NewClientCtrl);

NewClientCtrl.$inject =  ['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state', '$stateParams','$filter','$rootScope','$window','aaNotify','appAuth','httpServices','getAgentDetail'];

function NewClientCtrl($scope, $location, $route, $routeParams, propertiesService,$timeout,$state, $stateParams,$filter,$rootScope,$window,aaNotify,appAuth,httpServices,getAgentDetail)
{
      $scope.init = function()
      {
          generateSearchUI();
          $("#handle").hide();
          $("#content").animate({
            width: "100%"
          }, 300);

        $('#search').addClass('hide').removeClass('show');

        $scope.status = {open: false};

        $scope.agent = getAgentDetail;

        $scope.client= {Id:0, AgentId:appAuth.getAudienceId(),
            Profile:{
              BasicData:{MStatus:"single", CellPhone:"", WorkingWithTCOAgent:false, HidePersonalDetailFromAgent:false},
              IncomeData:{},
              CommuteData:{},
              CurrentResidenceData:{},
              DebtData:{},
              AssetData:{},
              FinancialData:{},
              LifeStyleData:{AddGrociers:false,AddSuperStores:false,AddPharmacies:false,AddHousehold:false,AddMovieTheaters:false,
                AddPublicTransport:false,AddAirport:false,AddGolf:false,AddSkiing:false,AddBeach:false},
              EntertainmentData:{Other:{}},
              OtherTLCData:{}
            },
            SupportingInformation:{ ProfileCompletionPercentage: 25}
          };
      }

      $scope.saveClient = function()
      {
        //httpServices.trackGoogleEvent('SaveClient','newClient');

        $scope.client.Profile.BasicData.FirstName = $scope.client.FirstName;
        $scope.client.Profile.BasicData.LastName = $scope.client.LastName;
        $scope.client.Profile.BasicData.Email = $scope.client.Email;

        $scope.client.Profile.BasicData.HomePhone = $scope.client.Profile.BasicData.HomePhone ? $scope.client.Profile.BasicData.HomePhone : "";
        $scope.client.Profile.BasicData.CellPhone = $scope.client.Profile.BasicData.CellPhone ? $scope.client.Profile.BasicData.CellPhone : "";
        $scope.client.Profile.BasicData.CreditScore = $scope.client.Profile.BasicData.CreditScore ? $scope.client.Profile.BasicData.CreditScore : "";
        $scope.client.Profile.BasicData.TLCMin = $scope.client.Profile.BasicData.TLCMin ? $scope.client.Profile.BasicData.TLCMin : "";
        $scope.client.Profile.BasicData.TLCMax = $scope.client.Profile.BasicData.TLCMax ? $scope.client.Profile.BasicData.TLCMax : "";
        $scope.client.Profile.BasicData.IsVeteran = $scope.client.Profile.BasicData.IsVeteran ? $scope.client.Profile.BasicData.IsVeteran : "";

        var requestJson = {
          "AgentId": appAuth.getAudienceId(),
          "FirstName": $scope.client.FirstName,
          "LastName": $scope.client.LastName,
          "DisplayName": $scope.client.FirstName+" "+$scope.client.LastName,
          "Email": $scope.client.Email,
          "AgentEmail": $scope.agent.Email,
          "Id": 0,
          "Profile": {
            "BasicData": {
              "MStatus": $scope.client.Profile.BasicData.MStatus,
              "CellPhone": $scope.client.Profile.BasicData.CellPhone,
              "WorkingWithTCOAgent": false,
              "HidePersonalDetailFromAgent": false,
              "HomePhone": $scope.client.Profile.BasicData.HomePhone,
              "CreditScore": $scope.client.Profile.BasicData.CreditScore,
              "TLCMin": $scope.client.Profile.BasicData.TLCMin,
              "TLCMax": $scope.client.Profile.BasicData.TLCMax,
              "IsVeteran": $scope.client.Profile.BasicData.IsVeteran,
              "FirstName": $scope.client.FirstName,
              "LastName": $scope.client.LastName,
              "Email": $scope.client.Email
            },
            "IncomeData": {},
            "CommuteData": {},
            "CurrentResidenceData": {},
            "DebtData": {},
            "AssetData": {},
            "FinancialData": {},
            "LifeStyleData": {
              "AddGrociers": false,
              "AddSuperStores": false,
              "AddPharmacies": false,
              "AddHousehold": false,
              "AddMovieTheaters": false,
              "AddPublicTransport": false,
              "AddAirport": false,
              "AddGolf": false,
              "AddSkiing": false,
              "AddBeach": false
            },
            "EntertainmentData": {
              "Other": {}
            },
            "OtherTLCData": {}
          },
          "SupportingInformation": {
            "ProfileCompletionPercentage": 25
          }
        };

        propertiesService.agentNewClient(requestJson
          , function (success) {
              aaNotify.success('New Client has been saved successfully.');
              $state.go('agentDashboard');
          }, function (error) {
            var errorMessages = [];
            _.each(error.data, function (o) {
                errorMessages.push("<li>" + o.ErrorMessage + "</li>");
                if (o.ErrorMessage == "Email Id already exist with another client.") {
                    $("#Email").focus();
                    $("#Email").addClass('ng-invalid aa-had-focus');
                }
            });

            aaNotify.danger("<ul>" + errorMessages.join("") + "</ul>",
              {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 10  //time to live in ms
              });
         });
      }

      $scope.changeTLCMinMax = function(type)
      {
          if(type=='TLCMax' && $scope.frmNewClient.TLCMin.$invalid)
          {
            document.getElementById("TLCMin").focus();
          }
          else if(type=='TLCMin' && $scope.frmNewClient.TLCMax.$invalid)
          {
            document.getElementById("TLCMax").focus();
          }
      }

      $scope.emailVerify = function()
      {
        if(typeof $scope.client.Email != 'undefined' && $scope.client.Email.length > 0) {
          propertiesService.agentClientEmailValidate({agentId:appAuth.getAudienceId()},{ clientId:0, emailAddress: $scope.client.Email }
            , function (success) {

            }, function (error) {
              var errorMessages = [];
              _.each(error.data, function (o) {
                errorMessages.push("<li>" + o.ErrorMessage + "</li>");
                /*if (o.ErrorMessage == "Email Id already exist with another client.") {
                  $("#Email").focus();
                  $("#Email").addClass('ng-invalid aa-had-focus');
                }*/
              });

              aaNotify.danger("<ul>" + errorMessages.join("") + "</ul>",
                {
                  showClose: true,                            //close button
                  iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                  allowHtml: true,                            //allows HTML in the message to render as HTML
                  ttl: 500 * 10  //time to live in ms
                });
            });
        }
      }

        $scope.back = function(){
            //$state.go("tlc.search");
            $window.history.back();
            $("#back").removeClass("visible");
            $(".bookmark-title").addClass('newBookmarkdiv');
            //$rootScope.$broadcast('setPropertyList');
        }

      $scope.init();
    };
})();

