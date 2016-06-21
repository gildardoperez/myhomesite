/**
 * Created by  on 2/24/2016.
 */

'use strict';

/**
 * @ngdoc function
 * @name tlcengineApp.controller:SendInvitation
 * @description
 * # Send Invitation Controller
 * Controller of the tlcengineApp
 */

angular.module('tlcengineApp').controller('SendInvitation', ['$rootScope','$scope','utilService', 'propertiesService', 'aaNotify', function($rootScope,$scope,utilService, propertiesService, aaNotify) {

    $scope.successResponse = false;
    $scope.data  = {};

    $scope.openWindow = function(dataItem) {
        $scope.data  = dataItem;
        if(document.getElementById("captureUserName").innerHTML == "Login or Register") {
            janrain.capture.ui.start();
            window.scrollTo(0,0);
        } else {
            $('#connectWithAgentLogin').modal('show');
        }
    }

    $scope.makeInviteAgentRequest = function() {
       $scope.successResponse = true;
        var sso_id = localStorage.janrainCaptureProfileData;
        if(typeof(Storage) !== "undefined") {
            if(localStorage.janrainCaptureProfileData) {
                sso_id = JSON.parse(sso_id);
                sso_id = sso_id['uuid'];
            }
        }

        var request = {
                "UserSsoId": sso_id,
                "AgentSsoId": $scope.data.MemberNrdsId,
                "ForceInvite": true
            };

        propertiesService.inviteAgent(request
            , function (success) {
              $scope.successResponse = false;
                var message = JSON.parse(success.response)['message'];
                if(message.indexOf('You have a pending invitation for same agent') >= 0) {
                    aaNotify.info('You have a pending invitation for same agent.',{
                        showClose: true,                            //close button
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 3                              //time to live in ms
                    });
                } else if(message.indexOf('Your invitation was sent successfully!') >= 0){
                    aaNotify.success('Your invitation was sent successfully!',{
                        showClose: true,                            //close button
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 3                              //time to live in ms
                    });
                } else {
                    aaNotify.warning(message,{
                        showClose: true,                            //close button
                        iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 3                              //time to live in ms
                    });
                }
                $scope.closeWindow();
            }, function (error) {
                console.log(error);
                $scope.successResponse = false;
                aaNotify.warning('Error while sending invitation!',{
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                              //time to live in ms
                });
            });
    }

    $scope.closeWindow = function() {
        $('#connectWithAgentLogin').modal('hide');
    }

    $rootScope.$on("CallOpenWorkWithMePopup",  function(scope, data){
        $scope.openWindow(data);
    });


}]);