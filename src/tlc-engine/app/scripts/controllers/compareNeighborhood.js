(function () {
  'use strict';

  angular.module('tlcengineApp').controller('compareNeighborhoodCtrl',compareNeighborhoodCtrl);

  compareNeighborhoodCtrl.$inject = ['$scope', '$location', '$route', '$routeParams', 'propertiesService','$timeout','$state', '$stateParams','$filter','$rootScope','$window','aaNotify','appAuth','$interval','utilService','httpServices'];

  function compareNeighborhoodCtrl($scope, $location, $route, $routeParams, propertiesService,$timeout,$state, $stateParams,$filter,$rootScope,$window,aaNotify,appAuth,$interval,utilService,httpServices)
  {
    $(document).ready(function(){
      //$("body").css("background", "transparent");
      $("body").removeClass('results');
      $("body").removeClass('body-dashboard');
    });

    $scope.init = function(){
      $scope.AudienceType = appAuth.isLoggedIn().AudienceType;

      $scope.addressError = false;
      $scope.selectedClient = [];
      $scope.step = 'neighborhood';
      $scope.CompareNeighborhood =[];
      $scope.CompareNeighborhood.push({});
      $scope.CompareNeighborhood.push({});

      $scope.calculator = {LivingAreaSquareFeet:1500,LifeStyle:'single',WorkAddress:{TransportationType:'car'}};

      if ($scope.AudienceType == 'CLIENT') {
        $scope.getClientDetail(appAuth.getAudienceId());
      }
      else {
        $scope.getClients();
      }

      $scope.getGasRates();
      $scope.getCarYear();

      $('.title-tipso').tipso();
    };

    $scope.goToHome = function () {
      //httpServices.trackGoogleEvent('GoToHome','compareneighborhood');

      if ($scope.AudienceType == 'CLIENT')
        $state.go('clientDashboard');
      else
        $state.go('agentDashboard');
    }

    $scope.addNeighborhood = function () {
      $scope.frmNeighborhood.$aaFormExtensions.$clearErrors();
      $scope.CompareNeighborhood.push({});
    }

    $scope.removeNeighborhood = function (index) {
      $scope.frmNeighborhood.$aaFormExtensions.$clearErrors();
      $scope.CompareNeighborhood.splice(index, 1);
    }

    $scope.moveToNext = function(){
      $scope.step = 'selectClient';

     // $timeout(function(){$scope.$broadcast('updatepscrollbar');},100);
    };

    $scope.compareDtails = function (){
      //httpServices.trackGoogleEvent('Compare-Neighborhood-Details','compareneighborhood');

      if(!$scope.calculator.WorkAddress.WorkAddress)
          $scope.calculator.WorkAddress.WorkAddress = "Washington, DC, United States";

      _.each($scope.CompareNeighborhood,function(o){
        o.LivingAreaSquareFeet = $scope.calculator.LivingAreaSquareFeet || 1500;
        o.LifeStyle = $scope.calculator.LifeStyle;
        o.WorkAddress = $scope.calculator.WorkAddress;
      });

      httpServices.compareneighbourhood($scope.CompareNeighborhood).then(
        function (success) {
            $scope.step = 'compareDetails';
            $scope.mortgageDetail = success;
            $scope.addressError = false;
          //$('.compare-info').scrollbar();

        }, function (error) {
          var errorMessages = [];
          var addressError = false;
          _.each(error.data, function (o) {
            if(o.ErrorMessage.indexOf("Invalid address")>-1)
            {
              addressError = true;
            }

            errorMessages.push("<li>" + o.ErrorMessage + "</li>");
          });

          $scope.addressError = addressError;

          aaNotify.danger("<ul>" + errorMessages.join("") + "</ul>",
            {
              showClose: true,                            //close button
              iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
              allowHtml: true,                            //allows HTML in the message to render as HTML

              //common to the framework as a whole
              ttl: 1000 * 10  //time to live in ms
            });
        });
    };

    $scope.menuBtn = function()
    {
        $('.left-col').toggleClass('open');
    }

    $scope.leftNav = function(e,menu)
    {
      $('.left-nav a').removeClass('active');
      $("[href ="+menu+"]").addClass('active');
      //$(".compare-info").scrollbar("destory");
      e.preventDefault();
      e.stopPropagation();
      $('.info-sections').hide();
      $scope.$broadcast('updatepscrollbar');
      $(menu).show();
      /*if($(window).height() <= 640){
        $('.compare-info').height($(window).height()-70);
      }*/

      //$(".compare-info").scrollbar();

    }

    $scope.getClients = function () {
      propertiesService.getClients({ agentId: appAuth.getAudienceId() }
        , function (success) {
          if (success != undefined && success.Count > 0) {
            _.each(success.Clients, function (o) {
              o.FullName = o.FirstName + ' ' + o.LastName;
            });
            $scope.clients = success.Clients;
            //$(".client-list").scrollbar();
          }
        }, function (error) {
          console.log("error " + error);
        });
    };

    $scope.selectClient = function(client)
    {
      if($scope.selectedClient.length > 0) {

        if($scope.selectedClient.length > 1)
          $scope.selectedClient.splice(0, 1);

        //httpServices.trackGoogleEvent('Compare-Neighborhood-SelectClient','compareneighborhood');

        if ($scope.selectedClient[0].Protected) {

        }
        else {
            $scope.getClientDetail($scope.selectedClient[0].Id);
        }
      }
    }

    $scope.getClientDetail = function(clientId)
    {
      httpServices.getClientDetail(clientId).then(function (success) {
        if (success != undefined) {
          $scope.calculator.LifeStyle = success.Profile.BasicData.MStatus || 'single';

          if(success.Profile.CurrentResidenceData && success.Profile.CurrentResidenceData.Sqft > 0)
              $scope.calculator.LivingAreaSquareFeet = success.Profile.CurrentResidenceData.Sqft;

          if (success.Profile.CommuteData.CommuteDetail != null && success.Profile.CommuteData.CommuteDetail.length > 0) {
            $scope.calculator.WorkAddress.WorkAddress = success.Profile.CommuteData.CommuteDetail[0].WorkAddress;
            $scope.calculator.WorkAddress.TransportationType = success.Profile.CommuteData.CommuteDetail[0].TransportationType;

            if($scope.calculator.WorkAddress.TransportationType=='car')
            {
              $scope.calculator.WorkAddress.CarYear = success.Profile.CommuteData.CommuteDetail[0].CarYear;
              $scope.calculator.WorkAddress.CarMake = success.Profile.CommuteData.CommuteDetail[0].CarMake;
              $scope.calculator.WorkAddress.CarModel = success.Profile.CommuteData.CommuteDetail[0].CarModel;
              $scope.calculator.WorkAddress.CarType = success.Profile.CommuteData.CommuteDetail[0].CarType;
              $scope.calculator.WorkAddress.CityMPG = success.Profile.CommuteData.CommuteDetail[0].CityMPG;
              $scope.calculator.WorkAddress.HwyMPG = success.Profile.CommuteData.CommuteDetail[0].HwyMPG;
              $scope.calculator.WorkAddress.CurrentGasRate = success.Profile.CommuteData.CommuteDetail[0].GasRate;
              $scope.calculator.WorkAddress.CommuteParkingCost = success.Profile.CommuteData.CommuteDetail[0].ParkingCost;

              $scope.changeCarYear(success.Profile.CommuteData.CommuteDetail[0].CarYear);
            }
          }
        }
      }, function (error) {
        console.log("error " + error);
      });
    }

    $scope.filterText = function (text) {
      if (text != undefined)
        return text.replace('&ordm;', '&deg;');
    }

    $scope.loadClients = function(query) {
      /*return $scope.clients.filter(function (o) {
        return o;
      });*/
      return $filter('filter')($scope.clients, query)
    };

    $scope.back = function () {
      switch ($scope.step)
      {
        case 'neighborhood':
          $scope.goToHome();
          break;
        case 'selectClient':
          $scope.addressError = false;
          $scope.step = 'neighborhood';
          break;
        case 'compareDetails':
          $scope.step = 'selectClient';
          break;
      }
    }

    $scope.getCarYear = function () {
      var startYear = new Date().getFullYear();
      var currentYear = new Date().getFullYear() - 30;
      $scope.carYear = [];
      $scope.carYearList = [];
      for (var i = startYear; i >= currentYear; i--) {
        $scope.carYear[i] = null;
        $scope.carYearList.push(i);
      }
    }

    $scope.changeCarYear = function (carYear) {
      if ($scope.GasRates == null) {
        $scope.getGasRates();
      }

      if (carYear != undefined) {
        if ($scope.carYear[carYear] == null) {
          propertiesService.getVehicles({ year: carYear }
            , function (success) {
              $scope.carYear[carYear] = success.cardata;
              //$scope.changeCarType(commuteDetail);
            }, function (error) {
              console.log("error " + error);
            });
        }
      }
    }

    $scope.getMake = function (commuteDetail) {
      return _.uniq($scope.carYear[commuteDetail.CarYear], function (o) { return o.make; });
    }

    $scope.getModel = function (commuteDetail) {

      var models =  _.chain($scope.carYear[commuteDetail.CarYear])
        .where({ make: commuteDetail.CarMake })
        .uniq(function (o) { return o.model; }).value();

      if(models.length == 1)
      {
        commuteDetail.CarModel = models[0].model;
      }

      return models;
    }

    $scope.getType = function (commuteDetail) {
      var types = _.chain($scope.carYear[commuteDetail.CarYear])
        .where({ make: commuteDetail.CarMake, model: commuteDetail.CarModel }).value()

      if(types.length == 1)
      {
        commuteDetail.CarType = types[0].id + '';
        $scope.changeCarType(commuteDetail);
      }

      return types;
    }

    $scope.changeCarType = function (commuteDetail) {

      var selected = _.find($scope.carYear[commuteDetail.CarYear], function (o) { return o.id == commuteDetail.CarType });
      if (selected) {
        commuteDetail.CityMPG = selected.citympg;
        commuteDetail.HwyMPG = selected.hwympg;

        if ($scope.GasRates[selected.fuelType.toLowerCase()] != null) {
          commuteDetail.CurrentGasRate = Number($scope.GasRates[selected.fuelType.toLowerCase()]);
        }
      }
    }

    $scope.getGasRates = function () {
      propertiesService.getGasRates(
        function (success) {
          $scope.GasRates = success;
        }, function (error) {
          console.log("error " + error);
        });
    }

    $scope.msaDetail = function(MsaName,MsaNumber)
    {
      if(MsaNumber)
        return MsaName + ' ' + MsaNumber;
      else
        return '';
    }

    $scope.init();
  }

})();
