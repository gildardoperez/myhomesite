angular.module('tlcengineApp')
  .controller('AgentEditProfileCtrl', ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout', '$state', '$stateParams', '$filter', '$rootScope', '$window', 'aaNotify','$q','appAuth','httpServices',
    function ($scope, $location, $route, $routeParams, propertiesService, $timeout, $state, $stateParams, $filter, $rootScope, $window, aaNotify,$q,appAuth,httpServices) {

      $scope.init = function () {
        $scope.AudienceType = appAuth.isLoggedIn().AudienceType;
        generateSearchUI();
        $("#handle").hide();

        $("#content").animate({
          width: "100%"
        }, 300), $("#map").animate({
          width: "0%"
        }, 300);

        $scope.getAgentDetail();
        $scope.notification = {allnotifications:false,clinetwelcome:false,propertiesfavoritedclient:false,clientsearch:false,clientloggedin:false,unsuccessfullogin:false,clientcomments:false,webminarstraining:false,newsletters:false};
        $('.title-tipso').tipso();

        if ($state.current.name == 'agentNotifications') {
          $scope.activeTab = {isProfile : false,isNotifications:true};
        }
        else if ($state.current.name == 'agentEditProfile') {
          $scope.activeTab = {isProfile : true,isNotifications:false};
        }
      }

      $scope.changeTab = function(tab)
      {
        if (tab == 'Notifications') {
          $scope.activeTab = {isProfile : false,isNotifications:true};
        }
        else if (tab == 'Profile') {
          $scope.activeTab = {isProfile : true,isNotifications:false};
        }
      }

      $scope.back = function(){
        $state.go("agentDashboard");
      }

      $scope.getAgentDetail = function () {
        httpServices.getAgentDetail().then(
          function (success) {
            if (success != undefined) {
              $scope.agent = success;
              $scope.agent.MyListingType = $scope.agent.MyListingType || "none";
            }
          }, function (error) {
            console.log("error " + error);
          });
      }

      $scope.saveAgent = function () {
          if ($scope.Process.ProfileImageName.Process || $scope.Process.BannerImageName.Process) {
              aaNotify.error('Agent Images are updating.');
              return;
          }
          if ($scope.agent.Profile.AgentVanityURLName != "" && $scope.agent.Profile.AgentVanityURLName != null) {
              if (!/^((http|https):\/\/)?(?:www\.)?[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/.test($scope.agent.Profile.AgentVanityURLName)) {
                  aaNotify.error('Enter valid website url');
                  return;
              }
          }
          if ($scope.agent.Profile.LinkedInPageURL != "" && $scope.agent.Profile.LinkedInPageURL != null) {
              if (!/((http|https):\/\/)?(?:www\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test($scope.agent.Profile.LinkedInPageURL)) {
                  aaNotify.error('Enter valid linkedIn url');
                  return;
              }
          }
          if ($scope.agent.Profile.FacebookPageURL != "" && $scope.agent.Profile.FacebookPageURL != null) {
              if (!/^((http|https)?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test($scope.agent.Profile.FacebookPageURL)) {
                  aaNotify.error('Enter valid facebook url');
                  return;
              }
          }
          if ($scope.agent.Profile.TwitterPageURL != "" && $scope.agent.Profile.TwitterPageURL != null) {
              if (!/(^@?(\w){1,15}$)|(^(http(s)?:\/\/)?((w{3}\.)?)twitter\.com\/(#!\/)?[a-z0-9_@!#~]+$)/i.test($scope.agent.Profile.TwitterPageURL)) {
                  aaNotify.error('Enter valid twitter url');
                  return;
              }
          }

          //httpServices.trackGoogleEvent('SaveAgent','editProfile');

          propertiesService.updateAgentDetail({ agentId: $scope.agent.AgentId }, $scope.agent
            , function (success) {
                aaNotify.success('Agent profile has been saved successfully.');

                $state.go('agentDashboard');

            }, function (error) {
                //console.log("error " + error);
                var errorMessages = [];
                console.log(error.data);
                _.each(error.data, function (o) { errorMessages.push("<li>" + o.ErrorMessage + "</li>"); });
                aaNotify.error("<ul>" + errorMessages.join("") + "</ul>",
                  {
                      showClose: true,                            //close button
                      iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                      allowHtml: true,                            //allows HTML in the message to render as HTML

                      //common to the framework as a whole
                      ttl: 1000 * 10  //time to live in ms
                  });
            });
      }

      $scope.sendiFrameVendorInstruction = function(){
        //httpServices.trackGoogleEvent('Send-iFrame-Vendor-Instruction','editProfile');

        propertiesService.sendiFrameVendorInstruction({agentId: $scope.agent.AgentId },{}
          , function (success) {
            aaNotify.success('iFrame instructions have been sent successfully.');
          }, function (error) {

          });
      }

      $scope.Process = {ProfileImageName:{Progress:0,Process:false,Image:null},BannerImageName:{Progress:0,Process:false,Image:null}};
      $scope.uploadImage = function ($files, imageType) {
        //$scope.Process[imageType].Progress = -1;

        if($files.length > 0) {
          var image = $files[0];
          /*$timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL($files[0]);
            fileReader.onload = function(e) {
              $timeout(function() {
                $scope.Process[imageType].Image = e.target.result;
              });
            }
          });*/

          AWS.config.update({
            accessKeyId: 'AKIAJAMN7EQMVI6NMNNQ',
            secretAccessKey: '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'
          });
          var bucket = new AWS.S3({params: {Bucket: 'tlcengine'}});

          // Prepend Unique String To Prevent Overwrites
          var randomNumber = String(Math.floor(Math.random() * 9000) + 1000) + "_";
          var uniqueFileName = 'agent_' + $scope.agent.AgentId + '_' + randomNumber + '_' + image.name;

          var params = {
            Key: uniqueFileName,
            ContentType: image.type,
            Body: image,
            ServerSideEncryption: 'AES256'
          };

          $scope.Process[imageType].Process = true;
          bucket.putObject(params, function (err, data) {
            /*if (err) {
              //aaNotify.error(err.message, err.code);
              console.log(err.message, err.code);
              $scope.agent.Profile[imageType] = null;
              $scope.Process[imageType].Process = false;
              $scope.$digest();
            }
            else {*/
              $scope.agent.Profile[imageType] = "https://s3.amazonaws.com/tlcengine/" + uniqueFileName;
              $scope.Process[imageType].Process = false;
              //console.log($scope.agent.Profile[imageType]);
              $scope.$digest();
            //}
          }).on('httpUploadProgress',function(progress) {
            // Log Progress Information
            //console.log(Math.min(100, parseInt(progress.loaded / progress.total * 100)));
            $scope.Process[imageType].Progress  = Math.min(100, parseInt(progress.loaded / progress.total * 100));
            $scope.$digest();
          });
        }
      }

      $scope.unsubscribeNotifications = function()
      {
        /*propertiesService.unsubscribeNotifications({ agentId: $scope.agent.AgentId }, $scope.notification
          , function (success) {
            aaNotify.success('Successfully unsubscribe from selected notifications.');
          }, function (error) {

          });*/
      }

      $scope.changeAllNotifications = function()
      {
        $scope.notification.savedsearches = $scope.notification.allnotifications;
        $scope.notification.clinetwelcome = $scope.notification.allnotifications;
        $scope.notification.propertiesfavoritedclient = $scope.notification.allnotifications;
        $scope.notification.clientsearch = $scope.notification.allnotifications;
        $scope.notification.clientloggedin = $scope.notification.allnotifications;
        $scope.notification.unsuccessfullogin = $scope.notification.allnotifications;
        $scope.notification.clientcomments = $scope.notification.allnotifications;
        $scope.notification.webminarstraining = $scope.notification.allnotifications;
        $scope.notification.newsletters = $scope.notification.allnotifications;
      }

      $scope.copyIFrameUrl = function()
      {
        aaNotify.success('Copied to Clipboard.');
      }

       $scope.init();
    }]);
