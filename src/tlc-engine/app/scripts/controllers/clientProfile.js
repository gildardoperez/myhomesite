(function () {
    'use strict';

    angular.module('tlcengineApp').controller('ClientProfileCtrl', ClientProfileCtrl);

    ClientProfileCtrl.$inject = ['$scope', '$location', '$route', '$routeParams', 'propertiesService', '$timeout',
      '$state', '$stateParams', '$filter', '$rootScope', '$window', 'aaNotify', 'appAuth', 'httpServices'];

    function ClientProfileCtrl($scope, $location, $route, $routeParams, propertiesService, $timeout,
                               $state, $stateParams, $filter, $rootScope, $window, aaNotify, appAuth, httpServices) {

        $scope.disabledSubmit = false;
        $scope.init = function () {
            $scope.status = {open: false};

            //if ($stateParams.clientId != undefined && $stateParams.clientId != "") {
            $scope.AudienceType = appAuth.isLoggedIn().AudienceType;
            $scope.clientId = $stateParams.clientId;
            $scope.TLC = 0;
            $scope.client = {};
            $scope.ResidenceAddressDetails = {};

            generateSearchUI();

            $scope.getCarYear();
            $scope.getClientDetail();
            //}
          $(".propertyfixdiv").removeClass('show');
          $(".propertyfixdiv").addClass('hide');
          $('#search').hide();

            $("#content").animate({width: "74%"}, 300),
            $("#map").animate({width: "26%"}, 300);

            $("#content").addClass("client_profile");

            $("#client-info").tabs();
            $("#inner-financial-info").tabs();
            jQuery(document).ready(function () {
                $('#mainClientInfo > li').click(function (event) {
                    $('#mainClientInfo .active').removeClass('active');
                    $(this).addClass('active');
                  $('#client-info > .dd-menu .active-tab').text($('#mainClientInfo .active a').text());
                  $('#client-info > .dd-menu').trigger('click');
                    event.preventDefault();
                });


                $('#financialInfo > li').click(function (event) {
                    $('#financialInfo .active').removeClass('active');
                    $(this).addClass('active');
                  $('#inner-financial-info > .dd-menu .active-tab').text($('#financialInfo .active a').text());
                  $('#inner-financial-info > .dd-menu').trigger('click');
                    event.preventDefault();
                });
              $('.dd-menu').each(function(){
                $(this).on('click',function(e){
                  e.stopPropagation();
                  $(this).next('.client-tab').toggleClass('open');
                });
              });
              $(document).click(function(){
                $('.dd-menu').next('.client-tab').removeClass('open');
              })
                $timeout(function () {
                    $(":radio[name=radioforCommute]").change(function () {
                        $(":radio[name=radioforCommute]").each(function () {
                            $(this).next('i').removeClass('checked');
                        });
                        $(this).next('i').addClass('checked');
                    });
                }, 3000);
            });
            $timeout(function () {
                $('.title-tipso').tipso();

            }, 1000);
            $("#tab-income-md").click(function () {

                $timeout(function () {
                    if ($(".IncomeDetailNetIncome").val().length<1) {
                        aaNotify.danger("Please enter Net Monthly Income.")
                        return;
                    }
                    setFIxedLable();
                    $(".left_lable_display").each(function () {
                        if ($(this).find('div input').val().length > 0) {
                            $(this).addClass('displayFixLabel');
                        }
                    });
                }, 200);
                $(".IncomeDetailNetIncome").focusout(function () {
                    setFIxedLable();
                });



                $(".left_lable_display").keyup(function () {
                    if ($(this).find('div input').val().length > 0) {
                        $(this).addClass('displayFixLabel');
                    }
                    else
                        $(this).removeClass('displayFixLabel');
                });

                $(".OtherPostTax_label_display").keyup(function () {
                    if ($(this).find('div input').val().length > 0) {
                        $(".OtherPostTax_label_display_right").addClass('displayFixLabel');
                    }
                    else
                        $(".OtherPostTax_label_display_right").removeClass('displayFixLabel');
                });

                $(".ProfileFederalTax_label_display").focusout(function () {
                    $timeout(function () {
                        if ($(".ProfileFederalTax_label_display").find('div input').val().length > 0) {
                            $(".ProfileFederalTax_label_display").addClass('displayFixLabel');
                        }
                        else
                            $(".ProfileFederalTax_label_display").removeClass('displayFixLabel');
                    }, 200);
                });

                $(".top_lable_dispplay").focusout(function () {
                    $timeout(function () {
                        topFixedLable();
                        if ($(".ProfileFederalTax_label_display").find('div input').val().length > 0) {
                            $(".ProfileFederalTax_label_display").addClass('displayFixLabel');
                        }
                        else
                            $(".ProfileFederalTax_label_display").removeClass('displayFixLabel');
                    }, 500);
                });
                $(".car-insurance-terms").change(function () {
                    $timeout(function () {
                        topFixedLable();
                    }, 500);
                })
            });

        }

        function topFixedLable() {
            $(".top_lable_dispplay").each(function () {
                if ($(this).find('div input').val() != "" && $(this).find('div input').val() != null) {
                    $(this).addClass('displayFixLabel');
                }
            });
        }
        function setFIxedLable() {
            if ($(".IncomeDetailNetIncome").val().length > 0) {
                $timeout(function () {
                    $(".right_lable_display").each(function () {
                        if ($(this).find('div input').val() != "" && $(this).find('div input').val() != null) {
                            $(this).addClass('displayFixLabel');
                        }
                    });
                }, 600);

            }
        }

        function leftSetFixedlable() {

        }

        $scope.getClientDetail = function () {
            httpServices.getClientDetail($scope.clientId).then(
              function (success) {
                  if (success != undefined) {
                      $scope.client = success;
                      //console.log($scope.client);

                      if ($scope.client.SupportingInformation == null)
                          $scope.client.SupportingInformation = {};

                      if ($scope.client.Profile.BasicData.ChildDetail == null || $scope.client.Profile.BasicData.ChildDetail.length == 0)
                          $scope.client.Profile.BasicData.ChildDetail = [{}];

                      if ($scope.client.Profile.IncomeData.IncomeDetail == null || $scope.client.Profile.IncomeData.IncomeDetail.length == 0) {
                          $scope.client.Profile.IncomeData.IncomeDetail = [{
                              PayPeriod: 'Monthly',
                              NetPayPeriod: 'Monthly',
                              FilingStatus: 'Single',
                              TaxDeferralPlan: 5,
                              StateLocalTaxes: 5.30,
                              NumberOfAllowances: 2,
                              NetTaxBracket: '25'
                          }];
                      }
                      $scope.IsRemoveIncomeDetail = false;
                      if ($scope.client.Profile.IncomeData.IncomeDetail.length > 1)
                          $scope.IsRemoveIncomeDetail = true;
                      else
                          $scope.IsRemoveIncomeDetail = false;

                      _.each($scope.client.Profile.IncomeData.IncomeDetail, function (o) {
                            o.NetTaxBracket = "" + o.NetTaxBracket;
                            $scope.CalculateProfileGrossIncomeTotal(o);
                      });

                      if ($scope.client.Profile.CommuteData.CommuteDetail == null || $scope.client.Profile.CommuteData.CommuteDetail.length == 0)
                          $scope.client.Profile.CommuteData.CommuteDetail = [{}];
                      else {
                          _.each($scope.client.Profile.CommuteData.CommuteDetail, function (o) {
                              $scope.changeCarYear(o.CarYear);
                          });
                      }
                      $scope.IsRemoveCommuteDetail = false;
                      if ($scope.client.Profile.CommuteData.CommuteDetail.length > 1)
                          $scope.IsRemoveCommuteDetail = true;
                      else
                          $scope.IsRemoveCommuteDetail = false;

                      if ($scope.client.Profile.EntertainmentData.Other == null)
                          $scope.client.Profile.EntertainmentData.Other = {};

                      if ($scope.client.Profile.EntertainmentData.Other.OtherDetail == null || $scope.client.Profile.EntertainmentData.Other.OtherDetail.length == 0)
                          $scope.client.Profile.EntertainmentData.Other.OtherDetail = [{}];

                      /*$scope.client.Profile.LifeStyleData.AddGrociers = false;
                       $scope.client.Profile.LifeStyleData.AddSuperStores = false;
                       $scope.client.Profile.LifeStyleData.AddPharmacies = false;
                       $scope.client.Profile.LifeStyleData.AddHousehold = false;
                       $scope.client.Profile.LifeStyleData.AddMovieTheaters = false;
                       $scope.client.Profile.LifeStyleData.AddPublicTransport = false;

                       $scope.client.Profile.LifeStyleData.AddAirport = false;
                       $scope.client.Profile.LifeStyleData.AddGolf = false;
                       $scope.client.Profile.LifeStyleData.AddSkiing = false;
                       $scope.client.Profile.LifeStyleData.AddBeach = false;*/

                      if ($scope.client.Profile.DebtData.DebtDetail == null || $scope.client.Profile.DebtData.DebtDetail.length == 0) {
                          $scope.client.Profile.DebtData.DebtDetail = [{}];
                      }
                      $scope.IsRemoveDebtDetail = false;
                      if ($scope.client.Profile.DebtData.DebtDetail.length > 1)
                          $scope.IsRemoveDebtDetail = true;
                      else
                          $scope.IsRemoveDebtDetail = false;

                      if ($scope.client.Profile.AssetData.CheckingAccounts == null || $scope.client.Profile.AssetData.CheckingAccounts.length == 0)
                          $scope.client.Profile.AssetData.CheckingAccounts = [null];

                      if ($scope.client.Profile.AssetData.SavingAccounts == null || $scope.client.Profile.AssetData.SavingAccounts.length == 0)
                          $scope.client.Profile.AssetData.SavingAccounts = [null];

                      if ($scope.client.Profile.AssetData.CD == null || $scope.client.Profile.AssetData.CD.length == 0)
                          $scope.client.Profile.AssetData.CD = [null];

                      if ($scope.client.Profile.AssetData.RetirementAccounts == null || $scope.client.Profile.AssetData.RetirementAccounts.length == 0)
                          $scope.client.Profile.AssetData.RetirementAccounts = [{}];

                      if ($scope.client.Profile.DebtData.DebtDetail == undefined)
                          $scope.client.Profile.DebtData.DebtDetail = [{}];

                      if ($scope.client.Profile.EntertainmentData.Other == null)
                          $scope.client.Profile.EntertainmentData.Other = {};

                      $("[type=checkbox]").change(function () {
                          if ($(this).next('i').hasClass('checked'))
                              $(this).next('i').removeClass('checked');
                          else
                              $(this).next('i').addClass('checked');
                      });

                      $timeout(function () {
                          $('.title-tipso').tipso();
                      }, 1000);
                  }
              }, function (error) {
                  console.log("error " + error);
              });
        }

        $scope.saveClient = function (isRedirect) {
            $scope.disabledSubmit = true;
            $scope.client.Profile.BasicData.FirstName = $scope.client.FirstName;
            $scope.client.Profile.BasicData.LastName = $scope.client.LastName;
            $scope.client.Profile.BasicData.Email = $scope.client.Email;

            if ($scope.Process.ProfileImageUrl) {
                aaNotify.danger('Client Image are updating.');
                return;
            }

              $scope.client.Profile.BasicData.ChildDetail[0].NeedChildCare = $scope.client.Profile.BasicData.ChildDetail[0].DaycareCost > 0 && $scope.client.Profile.BasicData.ChildDetail[0].AgeOfChild >= 0 ? true : false;

            var client = angular.copy($scope.client);
            var validIncome = false;
            _.each(client.Profile.IncomeData.IncomeDetail, function (o) {
                if (!isNaN(o.NetTaxBracket)) {
                    o.NetTaxBracket = Number(o.NetTaxBracket);
                }

                if(o.NetPay > 0)
                {
                  validIncome = true;
                }

                delete o.ProfileFICASocialSecurity;
                delete o.ProfileFICAMedicare;
                delete o.ProfileFederalTaxValue;
                delete o.ProfileTaxDeferralPlanValue;
                delete o.ProfilePreTaxDeductionsValue;
                delete o.ProfileStateLocalTaxesValue;
                delete o.ProfilePostTaxDeductionsValue;
                delete o.ProfilePostTaxReimbursementsValue;
                delete o.ProfileFederalTaxableGross;
                delete o.ProfileEstGrossPay;
            });

            if($scope.client.Profile.BasicData.AutoCalculateTlcRange == true && validIncome == false)
            {
              aaNotify.danger('To calculate your TLC range, please enter your income information.');
              return;
            }

          //httpServices.trackGoogleEvent('SaveClient','editProfile');

            httpServices.updateClientDetail(client).then(
              function (success) {
                  if ($rootScope.isFromPropDetail) {
                      $rootScope.isFromPropDetail = false;
                      history.back();
                  }
                  if (appAuth.isLoggedIn().AudienceType == 'CLIENT') {
                      if (isRedirect) {
                          $state.go('clientDashboard');
                      }
                      aaNotify.success('Your data has been saved successfully. Page will be reloaded to update the changes throughout the application.');
                  }
                  else {
                      $scope.$emit('getClients');
                      aaNotify.success('Client data has been saved successfully.');
                      if (isRedirect) {
                          $state.go('tlc.clientSummary', { clientId: $scope.clientId });
                      }
                      setTimeout(function() {
                          location.reload();
                      }, 600);
                  }

                  //$window.history.back();
                  $scope.disabledSubmit = false;
              }, function (error) {
                  var errorMessages = [];
                  console.log(error.data);
                  _.each(error.data, function (o) {
                      errorMessages.push("<li>" + o.ErrorMessage + "</li>");
                  });
                  aaNotify.danger("<ul>" + errorMessages.join("") + "</ul>",
                    {
                        showClose: true,                            //close button
                        iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                        allowHtml: true,                            //allows HTML in the message to render as HTML

                        //common to the framework as a whole
                        ttl: 1000 * 10  //time to live in ms
                    });
                  $scope.disabledSubmit = false;
              });
        }


        $scope.addIncomeDetail = function () {
            $scope.client.Profile.IncomeData.IncomeDetail.push({
                PayPeriod: 'Monthly', NetPayPeriod: 'Monthly',
                FilingStatus: 'Single', TaxDeferralPlan: 5, StateLocalTaxes: 5.30, NumberOfAllowances: 2, NetTaxBracket: '25'
            });
            $timeout(function () { $("#tab-income-md").click(); }, 600);

            $scope.IsRemoveIncomeDetail = true;
        }
        $scope.removeIncomeDetail = function (index) {
            $scope.client.Profile.IncomeData.IncomeDetail.splice(index, 1);
            if ($scope.client.Profile.IncomeData.IncomeDetail.length > 1)
                $scope.IsRemoveIncomeDetail = true;
            else
                $scope.IsRemoveIncomeDetail = false;
        }

        $scope.addDebtDetail = function () {
            $scope.client.Profile.DebtData.DebtDetail.push({});
            $scope.IsRemoveDebtDetail = true;
            $timeout(function () {
                $('.title-tipso').tipso();
            }, 10);

        }
        $scope.removeDebtDetail = function (index) {
            $scope.client.Profile.DebtData.DebtDetail.splice(index, 1);
            if ($scope.client.Profile.DebtData.DebtDetail.length > 1)
                $scope.IsRemoveDebtDetail = true;
            else
                $scope.IsRemoveDebtDetail = false;
        }

        $scope.addCommuteDetail = function () {
            /*if($scope.client.Profile.Commutedetail.CommuteDetail == null)
             $scope.client.Profile.Commutedetail.CommuteDetail = [];*/
            $scope.client.Profile.CommuteData.CommuteDetail.push({});
            $scope.IsRemoveCommuteDetail = true;

        }
        $scope.removeCommuteDetail = function (index) {
            $scope.client.Profile.CommuteData.CommuteDetail.splice(index, 1);
            if ($scope.client.Profile.CommuteData.CommuteDetail.length > 1)
                $scope.IsRemoveCommuteDetail = true;
            else
                $scope.IsRemoveCommuteDetail = false;
        }

        // for CheckingAccounts
        $scope.addCheckingAccounts = function () {
            /*if($scope.client.Profile.AssetData.CheckingAccounts == null)
             $scope.client.Profile.AssetData.CheckingAccounts = [];*/
            $scope.client.Profile.AssetData.CheckingAccounts.push(null);
        }
        $scope.removeCheckingAccounts = function (index) {
            $scope.client.Profile.AssetData.CheckingAccounts.splice(index, 1);
        }

        // for saving account
        $scope.addSavingAccounts = function () {
            /*if($scope.client.Profile.AssetData.SavingAccounts == null)
             $scope.client.Profile.AssetData.SavingAccounts = [];*/
            $scope.client.Profile.AssetData.SavingAccounts.push(null);
        }
        $scope.removeSavingAccounts = function (index) {
            $scope.client.Profile.AssetData.SavingAccounts.splice(index, 1);
        }

        // for CD
        $scope.addCD = function () {
            /*if($scope.client.Profile.AssetData.CD == null)
             $scope.client.Profile.AssetData.CD = [];*/
            $scope.client.Profile.AssetData.CD.push(null);
        }
        $scope.removeCD = function (index) {
            $scope.client.Profile.AssetData.CD.splice(index, 1);
        }

        // for retirement account
        $scope.addRetirementAccounts = function () {
            /*if($scope.client.Profile.AssetData.RetirementAccounts == null)
             $scope.client.Profile.AssetData.RetirementAccounts = [];*/
            $scope.client.Profile.AssetData.RetirementAccounts.push({});
        }
        $scope.removeRetirementAccounts = function (index) {
            $scope.client.Profile.AssetData.RetirementAccounts.splice(index, 1);
        }

        // for Entertainment Other
        $scope.addEntertainmentOther = function () {
            if ($scope.client.Profile.EntertainmentData.Other.OtherDetail == null)
                $scope.client.Profile.EntertainmentData.Other.OtherDetail = [];

            $scope.client.Profile.EntertainmentData.Other.OtherDetail.push({});
        }
        $scope.removeEntertainmentOther = function (index) {
            $scope.client.Profile.EntertainmentData.Other.OtherDetail.splice(index, 1);
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

        /*$scope.changeCarYear();
         $scope.changeMakeMake();
         $scope.changeMakeModel();
         $scope.changeCarType();
         $scope.getGasRates();*/

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
            return _.uniq($scope.carYear[commuteDetail.CarYear], function (o) {
                return o.make;
            });
        }

        $scope.getModel = function (commuteDetail) {

            var models = _.chain($scope.carYear[commuteDetail.CarYear])
              .where({ make: commuteDetail.CarMake })
              .uniq(function (o) { return o.model; }).value();

            if (models.length == 1) {
                commuteDetail.CarModel = models[0].model;
            }

            return models;
        }

        $scope.getType = function (commuteDetail) {
            var types = _.chain($scope.carYear[commuteDetail.CarYear])
              .where({ make: commuteDetail.CarMake, model: commuteDetail.CarModel }).value()

            if (types.length == 1) {
                commuteDetail.CarType = types[0].id + '';
                $scope.changeCarType(commuteDetail);
            }

            return types;
        }

        $scope.changeCarType = function (commuteDetail) {

            var selected = _.find($scope.carYear[commuteDetail.CarYear], function (o) {
                return o.id == commuteDetail.CarType
            });
            if (selected) {
                commuteDetail.CityMPG = selected.citympg;
                commuteDetail.HwyMPG = selected.hwympg;

                if (Number(selected.fuelcost) > 0)
                    commuteDetail.GasCost = Number(selected.fuelcost) / 12;
                //commuteDetail.CarMake = selected.make;
                //commuteDetail.CarModel = selected.model;

                if ($scope.GasRates[selected.fuelType.toLowerCase()] != null) {
                    commuteDetail.GasRate = Number($scope.GasRates[selected.fuelType.toLowerCase()]);
                }
            }
        }

        $scope.getGasRates = function () {
            $scope.GasRates = [];
            propertiesService.getGasRates(
              function (success) {
                  $scope.GasRates = success;
              }, function (error) {
                  console.log("error " + error);
              });
        }

        $scope.calculateResidencecost = function () {
            //httpServices.trackGoogleEvent('Calculate-Residence-Cost','editProfile');
            if ($scope.client.Profile.CurrentResidenceData.ResidenceAddress.length == 0) {
                aaNotify.danger("Please enter current residence address.",
                  {
                      showClose: true,                            //close button
                      iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                      allowHtml: true,                            //allows HTML in the message to render as HTML

                      //common to the framework as a whole
                      ttl: 1000 * 10  //time to live in ms
                  });
            }

            if (Number($scope.client.Profile.CurrentResidenceData.Sqft) == 0) {
                aaNotify.danger("Please enter current residence Square Foot.",
                  {
                      showClose: true,                            //close button
                      iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                      allowHtml: true,                            //allows HTML in the message to render as HTML

                      //common to the framework as a whole
                      ttl: 1000 * 10  //time to live in ms
                  });
            }

            var inputObj = {
                ClientId: $scope.client.Id,
                Address: $scope.client.Profile.CurrentResidenceData.ResidenceAddress,
                SquareFeet: $scope.client.Profile.CurrentResidenceData.Sqft
            };

            propertiesService.residencecost(inputObj,
              function (success) {
                  if (success != undefined && success.length > 0) {

                      $scope.client.Profile.CurrentResidenceData.HomeRentInsurance = success[0].HomeRentInsurance;
                      $scope.client.Profile.CurrentResidenceData.LawnCare = success[0].LawnCare;
                      $scope.client.Profile.CurrentResidenceData.Taxes = success[0].Taxes;
                      $scope.client.Profile.CurrentResidenceData.Gas = success[0].Gas;
                      $scope.client.Profile.CurrentResidenceData.WaterAndSewer = success[0].WaterAndSewer;
                      $scope.client.Profile.CurrentResidenceData.WasteRemoval = success[0].WasteRemoval;
                  }
              }, function (error) {
                  console.log("error " + error);
              });

            if ($scope.ResidenceAddressDetails != null) {
                var postalCode = _.find($scope.ResidenceAddressDetails.address_components, function (o) {
                    return o.types[0] == 'postal_code';
                });

                $scope.entertainmentCharges = {};

                if (!postalCode) {
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'location': $scope.ResidenceAddressDetails.geometry.location }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {

                            //console.log(results[0].address_components);
                            postalCode = _.find(results[0].address_components, function (o) {
                                return o.types[0] == 'postal_code';
                            });

                            if (postalCode) {
                                $scope.entertainmentByPostalCode(postalCode.long_name);
                            }
                        }
                    });
                }
                else {
                    $scope.entertainmentByPostalCode(postalCode.long_name);
                }
            }
        }

        $scope.entertainmentByPostalCode = function (postalCode) {
            propertiesService.entertainmentByPostalCode({ postalCode: postalCode },
              function (success) {
                  if (success != undefined) {
                      $scope.client.Profile.EntertainmentData.Internet = success.Internet;
                      $scope.client.Profile.EntertainmentData.Cell = success.Cell;
                      $scope.client.Profile.EntertainmentData.Phone = success.Phone;

                      $scope.entertainmentCharges = success;

                      $scope.TVChargesChanges();
                  }
              }, function (error) {
                  console.log("error " + error);
              });
        }

        $scope.TVChargesChanges = function () {
            if ($scope.entertainmentCharges != null) {
                switch ($scope.client.Profile.EntertainmentData.TV) {
                    case 'Basic':
                        $scope.client.Profile.EntertainmentData.TVCharges = $scope.entertainmentCharges.TV["Limited Basic"];
                        break;
                    case 'Standard':
                        $scope.client.Profile.EntertainmentData.TVCharges = $scope.entertainmentCharges.TV["Digital Starter"];
                        break;
                    case 'Premium':
                        $scope.client.Profile.EntertainmentData.TVCharges = $scope.entertainmentCharges.TV["Digital Premier"];
                        break;
                }
            }
        }

        $scope.$watch(function () {
            return [$scope.client.Profile];
        }, function () {

            if ($scope.client.Profile) {
                var Residence = Number(isNaN($scope.client.Profile.CurrentResidenceData.RentMortgage) ? 0 : $scope.client.Profile.CurrentResidenceData.RentMortgage) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.HomeRentInsurance) ? 0 : $scope.client.Profile.CurrentResidenceData.HomeRentInsurance) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.LawnCare) ? 0 : $scope.client.Profile.CurrentResidenceData.LawnCare) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.Taxes) ? 0 : $scope.client.Profile.CurrentResidenceData.Taxes) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.Electricity) ? 0 : $scope.client.Profile.CurrentResidenceData.Electricity) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.Gas) ? 0 : $scope.client.Profile.CurrentResidenceData.Gas) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.WaterAndSewer) ? 0 : $scope.client.Profile.CurrentResidenceData.WaterAndSewer) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.WasteRemoval) ? 0 : $scope.client.Profile.CurrentResidenceData.WasteRemoval) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.MaintenanceOrRepair) ? 0 : $scope.client.Profile.CurrentResidenceData.MaintenanceOrRepair) +
                  Number(isNaN($scope.client.Profile.CurrentResidenceData.Other) ? 0 : $scope.client.Profile.CurrentResidenceData.Other);

                var Commute = 0;
                _.each($scope.client.Profile.CommuteData.CommuteDetail, function (CommuteDetail) {
                    Commute += Number(isNaN(CommuteDetail.CarInsurancePayment) ? 0 : CommuteDetail.CarInsurancePayment) +
                    Number(isNaN(CommuteDetail.CarMaintenancePayment) ? 0 : CommuteDetail.CarMaintenancePayment) +
                    Number(isNaN(CommuteDetail.GasCost) ? 0 : CommuteDetail.GasCost) +
                    Number(isNaN(CommuteDetail.ParkingCost) ? 0 : CommuteDetail.ParkingCost) +
                    Number(isNaN(CommuteDetail.TollCost) ? 0 : CommuteDetail.TollCost);
                });

                var Entertainment = Number(isNaN($scope.client.Profile.EntertainmentData.Internet) ? 0 : $scope.client.Profile.EntertainmentData.Internet) +
                    Number(isNaN($scope.client.Profile.EntertainmentData.TVCharges) ? 0 : $scope.client.Profile.EntertainmentData.TVCharges) +
                    Number(isNaN($scope.client.Profile.EntertainmentData.Cell) ? 0 : $scope.client.Profile.EntertainmentData.Cell) +
                    Number(isNaN($scope.client.Profile.EntertainmentData.Phone) ? 0 : $scope.client.Profile.EntertainmentData.Phone)
                /* + Number(isNaN($scope.client.Profile.EntertainmentData.Other) ? 0 : $scope.client.Profile.EntertainmentData.Other)*/;

                _.each($scope.client.Profile.EntertainmentData.Other.OtherDetail, function (other) {
                    Entertainment += Number(isNaN(other.Amount) ? 0 : other.Amount);
                });

                var Food = Number(isNaN($scope.client.Profile.FinancialData.FoodGroceries) ? 0 : $scope.client.Profile.FinancialData.FoodGroceries) +
                  Number(isNaN($scope.client.Profile.FinancialData.FoodDiningOut) ? 0 : $scope.client.Profile.FinancialData.FoodDiningOut) +
                  Number(isNaN($scope.client.Profile.FinancialData.FoodOther) ? 0 : $scope.client.Profile.FinancialData.FoodOther);

                var PersonalCare = Number(isNaN($scope.client.Profile.FinancialData.PersonalCareMedical) ? 0 : $scope.client.Profile.FinancialData.PersonalCareMedical) +
                  Number(isNaN($scope.client.Profile.FinancialData.PersonalCareHairNail) ? 0 : $scope.client.Profile.FinancialData.PersonalCareHairNail) +
                  Number(isNaN($scope.client.Profile.FinancialData.PersonalCareClothing) ? 0 : $scope.client.Profile.FinancialData.PersonalCareClothing) +
                  Number(isNaN($scope.client.Profile.FinancialData.PersonalCareDryCleaning) ? 0 : $scope.client.Profile.FinancialData.PersonalCareDryCleaning) +
                  Number(isNaN($scope.client.Profile.FinancialData.PersonalCareHealthClub) ? 0 : $scope.client.Profile.FinancialData.PersonalCareHealthClub) +
                  Number(isNaN($scope.client.Profile.FinancialData.PersonalCareOrganizationDuesOrFees) ? 0 : $scope.client.Profile.FinancialData.PersonalCareOrganizationDuesOrFees) +
                  Number(isNaN($scope.client.Profile.FinancialData.PersonalCareOther) ? 0 : $scope.client.Profile.FinancialData.PersonalCareOther);

                var Insurance = Number(isNaN($scope.client.Profile.FinancialData.InsuranceHealth) ? 0 : $scope.client.Profile.FinancialData.InsuranceHealth) +
                  Number(isNaN($scope.client.Profile.FinancialData.InsuranceLife) ? 0 : $scope.client.Profile.FinancialData.InsuranceLife) +
                  Number(isNaN($scope.client.Profile.FinancialData.InsuranceOther) ? 0 : $scope.client.Profile.FinancialData.InsuranceOther);

                /*var Transportation = Number(isNaN($scope.client.Profile.FinancialData.TransportationBusTaxiFare) ? 0 : $scope.client.Profile.FinancialData.TransportationBusTaxiFare) +
                 Number(isNaN($scope.client.Profile.FinancialData.TransportationLicensing) ? 0 : $scope.client.Profile.FinancialData.TransportationLicensing) +
                 Number(isNaN($scope.client.Profile.FinancialData.TransportationFuel) ? 0 : $scope.client.Profile.FinancialData.TransportationFuel) +
                 Number(isNaN($scope.client.Profile.FinancialData.TransportationMaintenance) ? 0 : $scope.client.Profile.FinancialData.TransportationMaintenance) +
                 Number(isNaN($scope.client.Profile.FinancialData.TransportationTollsPerMonth) ? 0 : $scope.client.Profile.FinancialData.TransportationTollsPerMonth) +
                 Number(isNaN($scope.client.Profile.FinancialData.TransportationOther) ? 0 : $scope.client.Profile.FinancialData.TransportationOther);
                 */

                var Donation = Number(isNaN($scope.client.Profile.FinancialData.DonationCharity) ? 0 : $scope.client.Profile.FinancialData.DonationCharity);

                var Legal = Number(isNaN($scope.client.Profile.FinancialData.LegalAttorney) ? 0 : $scope.client.Profile.FinancialData.LegalAttorney) +
                  Number(isNaN($scope.client.Profile.FinancialData.LegalAlimony) ? 0 : $scope.client.Profile.FinancialData.LegalAlimony) +
                  Number(isNaN($scope.client.Profile.FinancialData.LegalPaymentOnLienOrJudgement) ? 0 : $scope.client.Profile.FinancialData.LegalPaymentOnLienOrJudgement) +
                  Number(isNaN($scope.client.Profile.FinancialData.LegalOther) ? 0 : $scope.client.Profile.FinancialData.LegalOther);

                var DaycareCost = 0;
                if ($scope.client.Profile.BasicData.ChildDetail != null) {
                    _.each($scope.client.Profile.BasicData.ChildDetail, function (o) {
                        DaycareCost += Number(isNaN(o.DaycareCost) ? 0 : o.DaycareCost);
                    });
                }

                var Debt = 0;
                if ($scope.client.Profile.DebtData.DebtDetail != null) {
                    _.each($scope.client.Profile.DebtData.DebtDetail, function (debt) {
                        Debt += Number(isNaN(debt.MonthlyPayment) ? 0 : debt.MonthlyPayment);
                    })
                }

                $scope.TLC = Residence + Entertainment + Commute + Food + PersonalCare + Insurance /*+ Transportation*/ + Donation + Legal + DaycareCost + Debt;

                if ($scope.TLC == 0) {
                    document.getElementById('chartFinancial').style.display = 'none';
                    //$('#chartFinancial').find('.highcharts-container').hide();
                }
                else {
                    document.getElementById('chartFinancial').style.display = '';
                    //$('#chartFinancial').find('.highcharts-container').show();
                }

                $scope.chartFinancialGraphs.title.text = 'TLC' + '<br/>' + $filter('currencyNoDecimal')($scope.TLC);

                var data = [
                  {
                      name: 'Residence',
                      y: Residence,
                      tab: 'tab-residence-md'
                  },
                  {
                      name: 'Entertainment',
                      y: Entertainment,
                      tab: 'tab-entertainment-md'
                  }, {
                      name: 'Commute',
                      y: Commute,
                      tab: 'tab-commute-md'
                  },
                  {
                      name: 'Food',
                      y: Food,
                      tab: 'tab-financial-food-md'
                  }, {
                      name: 'Personal Care',
                      y: PersonalCare,
                      tab: 'tab-financial-personal-care-md'
                  }, {
                      name: 'Insurance',
                      y: Insurance,
                      tab: 'tab-financial-insurance-md'
                  }/*, {
           name: 'Transportation',
           y: Transportation,
           tab: 'tab-financial-transportation-md'
           }*/, {
               name: 'Donation',
               y: Donation,
               tab: 'tab-financial-donation-md'
           }, {
               name: 'Legal',
               y: Legal,
               tab: 'tab-financial-legal-md'
           }, {
               name: 'Day care Cost',
               y: DaycareCost,
               tab: 'tab-client-basic-md'
           }, {
               name: 'Debt',
               y: Debt,
               tab: 'tab-debt-md'
           }
                ];

                $scope.chartFinancialGraphs.series[0].data = data;

                $scope.client.Profile.LifeStyleData.AddGrociers = $scope.client.Profile.LifeStyleData.DistanceFromGrociers > 0;
                $scope.client.Profile.LifeStyleData.AddSuperStores = $scope.client.Profile.LifeStyleData.DistanceFromSuperStores > 0;
                $scope.client.Profile.LifeStyleData.AddPharmacies = $scope.client.Profile.LifeStyleData.DistanceFromPharmacies > 0;
                $scope.client.Profile.LifeStyleData.AddHousehold = $scope.client.Profile.LifeStyleData.DistanceFromHousehold > 0;
                $scope.client.Profile.LifeStyleData.AddMovieTheaters = $scope.client.Profile.LifeStyleData.DistanceFromMovieTheaters > 0;
                $scope.client.Profile.LifeStyleData.AddPublicTransport = $scope.client.Profile.LifeStyleData.DistanceFromPublicTransport > 0;

                //Basic = 25, Income = 12, Commute = 10, Residence= 10, Assets= 10, Financial= 22, Entertainment= 5, Lifestyle = 6;
                var Basic = 25, Income = 0, Commute = 0, Residence = 0, Assets = 0, Financial = 0, Entertainment = 0, Lifestyle = 0;

                //Income = 12
                if ($scope.client.Profile.IncomeData.IncomeDetail != null && $scope.client.Profile.IncomeData.IncomeDetail.length > 0) {
                    /*if (Number($scope.client.Profile.IncomeData.IncomeDetail[0].GrossPay) > 0) {
                        Income += 4;
                    }
                    if ($scope.client.Profile.IncomeData.IncomeDetail[0].PayPeriod && $scope.client.Profile.IncomeData.IncomeDetail[0].PayPeriod.length != 0) {
                        Income += 4;
                    }*/
                    if (Number($scope.client.Profile.IncomeData.IncomeDetail[0].NetPay) > 0) {
                        Income += 10;
                    }
                }

                //Commute = 10
                if ($scope.client.Profile.CommuteData.CommuteDetail != null && $scope.client.Profile.CommuteData.CommuteDetail.length > 0) {
                    if ($scope.client.Profile.CommuteData.CommuteDetail[0].WorkAddress && $scope.client.Profile.CommuteData.CommuteDetail[0].WorkAddress.length != 0) {
                        Commute += 5;
                    }
                    if ($scope.client.Profile.CommuteData.CommuteDetail[0].TransportationType && $scope.client.Profile.CommuteData.CommuteDetail[0].TransportationType.length != 0) {
                        Commute += 3;
                    }
                }

                //Residence = 10
                if ($scope.client.Profile.CurrentResidenceData.ResidenceAddress && $scope.client.Profile.CurrentResidenceData.ResidenceAddress.length != 0) {
                    Residence += 5;
                }
                if (Number($scope.client.Profile.CurrentResidenceData.Sqft) > 0) {
                    Residence += 2;
                }

                //Assets = 10
                if ($scope.client.Profile.AssetData.CashOnHand != null) {
                    Assets += 2;
                }

                if ($scope.client.Profile.AssetData.CheckingAccounts != null && $scope.client.Profile.AssetData.CheckingAccounts.length > 0) {
                    if ($scope.client.Profile.AssetData.CheckingAccounts[0] != null) {
                        Assets += 2;
                    }
                }

                if ($scope.client.Profile.AssetData.SavingAccounts != null && $scope.client.Profile.AssetData.SavingAccounts.length > 0) {
                    if ($scope.client.Profile.AssetData.SavingAccounts[0] != null) {
                        Assets += 2;
                    }
                }

                if ($scope.client.Profile.AssetData.CD != null && $scope.client.Profile.AssetData.CD.length > 0) {
                    if ($scope.client.Profile.AssetData.CD[0] != null) {
                        Assets += 2;
                    }
                }

                if ($scope.client.Profile.AssetData.RetirementAccounts != null && $scope.client.Profile.AssetData.RetirementAccounts.length > 0) {
                    if ($scope.client.Profile.AssetData.RetirementAccounts[0].AccountBalance != null) {
                        Assets += 2;
                    }
                }

                //Financial = 22
                if ($scope.client.Profile.FinancialData.FoodGroceries != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.FoodDiningOut != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.FoodOther != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.PersonalCareMedical != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.PersonalCareHairNail != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.PersonalCareClothing != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.PersonalCareDryCleaning != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.PersonalCareHealthClub != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.PersonalCareOrganizationDuesOrFees != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.PersonalCareOther != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.InsuranceHealth != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.InsuranceLife != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.InsuranceOther != null) {
                    Financial += 2;
                }
                /*if ($scope.client.Profile.FinancialData.TransportationBusTaxiFare != null) {
                    Financial += 1;
                }
                if ($scope.client.Profile.FinancialData.TransportationLicensing != null) {
                    Financial += 1;
                }
                if ($scope.client.Profile.FinancialData.TransportationFuel != null) {
                    Financial += 1;
                }
                if ($scope.client.Profile.FinancialData.TransportationMaintenance != null) {
                    Financial += 1;
                }
                if ($scope.client.Profile.FinancialData.TransportationTollsPerMonth != null) {
                    Financial += 1;
                }
                if ($scope.client.Profile.FinancialData.TransportationOther != null) {
                    Financial += 1;
                }*/
                if ($scope.client.Profile.FinancialData.DonationCharity != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.LegalAttorney != null) {
                    Financial += 2;
                }
                if ($scope.client.Profile.FinancialData.LegalAlimony != null) {
                    Financial += 2;
                }

                //Entertainment = 5
                if ($scope.client.Profile.EntertainmentData.Internet != null) {
                    Entertainment += 2;
                }
                if ($scope.client.Profile.EntertainmentData.TVCharges != null) {
                    Entertainment += 2;
                }
                if ($scope.client.Profile.EntertainmentData.Cell != null) {
                    Entertainment += 2;
                }
                if ($scope.client.Profile.EntertainmentData.Phone != null) {
                    Entertainment += 2;
                }
                /*if($scope.client.Profile.EntertainmentData.Other != null)
                 {
                 Entertainment += 1;
                 }*/

                //Lifestyle = 6
                /*if ($scope.client.Profile.LifeStyleData.DistanceFromGrociers != null) {
                    Lifestyle += 1;
                }
                if ($scope.client.Profile.LifeStyleData.DistanceFromSuperStores != null) {
                    Lifestyle += 1;
                }
                if ($scope.client.Profile.LifeStyleData.DistanceFromPharmacies != null) {
                    Lifestyle += 1;
                }
                if ($scope.client.Profile.LifeStyleData.DistanceFromHousehold != null) {
                    Lifestyle += 1;
                }
                if ($scope.client.Profile.LifeStyleData.DistanceFromMovieTheaters != null) {
                    Lifestyle += 1;
                }
                if ($scope.client.Profile.LifeStyleData.DistanceFromPublicTransport != null) {
                    Lifestyle += 1;
                }*/

                var TotalProfileComplete = Basic + Income + Commute + Residence + Assets + Financial + Entertainment + Lifestyle;
                //console.log(TotalProfileComplete);
                $scope.client.SupportingInformation.ProfileCompletionPercentage = TotalProfileComplete;
                $('#circle').progressCircle({
                    nPercent: TotalProfileComplete
                });
            }

        }, true);

        $scope.chartFinancialGraphs = {
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0
            },
            title: {
                text: 'Financial Breakdown',
                align: 'center',
                verticalAlign: 'middle',
                y: 0
            },
            subtitle: {
                text: ''
            },
            tooltip: {
                formatter: function () {
                    return this.point.name + ': ' + $filter('currency')(this.y) + ' (' + $filter('number')(this.percentage, 1) + '%)';
                }
            },
            /*legend: {
             layout: 'vertical',
             align: 'left',
             verticalAlign: 'bottom',
             x: 0,
             y: 0,
             floating: true,
             borderWidth: 1
             },*/
            /*legend: {

             itemMarginBottom: 25,
             itemMarginRight: 15,
             //itemDistance:30,
             itemWidth: 140,
             itemStyle: {
             width: '130px'
             }
             },*/
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        distance: -20,
                        color: '#000000',
                        style: {
                            fontWeight: 'bold',
                            textShadow: ""
                        },
                        connectorColor: '#000000',
                        //useHTML:true,
                        /*rotation : 15,
                         formatter: function () {
                         return '<b>' + this.point.name + '</b>' + ': ' + $filter('currencyNoDecimal')(this.y);
                         }*/
                        formatter: function () {
                            if (this.percentage != 0) return Math.round(this.percentage) + '%';
                        }
                    },
                    shadow: false,
                    center: ['50%', '50%'],
                    showInLegend: false
                }
            },
            series: [{
                type: 'pie',
                name: '',
                innerSize: '65%',
                size: '100%',
                point: {
                    events: {
                        click: function (event) {
                            //console.log(this.tab);

                            if (this.tab.indexOf('tab-financial-') > -1) {
                                $('#mainClientInfo .active').removeClass('active');
                                $('#tab-financial-md').addClass('active');
                                $('#tab-financial-md').find("a").click();

                                $('#financialInfo .active').removeClass('active');
                                $('#' + this.tab).addClass('active');
                                $('#' + this.tab).find("a").click();
                            }
                            else {
                                $('#mainClientInfo .active').removeClass('active');
                                $('#' + this.tab).addClass('active');
                                $('#' + this.tab).find("a").click();
                            }
                        }
                    }
                }
            }],
            colors: ["#F48384", "#00C38A", "#3E4651", "#7cb5ec", "#90ed7d", "#ff0066", "#eeaaee",
              "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
            //size: {
            //    width: 400,
            //    height: 300
            //},
            exporting: {
                enabled: false
            }
        }

        $scope.changeTLCMinMax = function (type) {
            if (type == 'TLCMax' && $scope.frmClientProfile.TLCMin.$invalid) {
                document.getElementById("TLCMin").focus();
            }
            else if (type == 'TLCMin' && $scope.frmClientProfile.TLCMax.$invalid) {
                document.getElementById("TLCMax").focus();
            }

          $scope.client.Profile.BasicData.AutoCalculateTlcRange = false;
        }

        $scope.emailVerify = function () {
            if (typeof $scope.client.Email != 'undefined' && $scope.client.Email.length > 0) {
                httpServices.clientEmailVerify({ clientId: $scope.client.Id, emailAddress: $scope.client.Email }).then(
                  function (success) {

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

                            //common to the framework as a whole
                            ttl: 500 * 10  //time to live in ms
                        });
                  });
            }
        }

        $scope.Process = { Progress:0,ProfileImageUrl:false,Image:null };
        $scope.uploadImage = function ($files, imageType) {
          //$scope.Process.Progress = -1;

            if ($files.length > 0) {
                var image = $files[0];

                /*$timeout(function() {
                  var fileReader = new FileReader();
                  fileReader.readAsDataURL($files[0]);
                  fileReader.onload = function(e) {
                    $timeout(function() {
                      $scope.Process.Image = e.target.result;
                    });
                  }
                });*/

                AWS.config.update({
                    accessKeyId: 'AKIAJAMN7EQMVI6NMNNQ',
                    secretAccessKey: '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'
                });
                var bucket = new AWS.S3({ params: { Bucket: 'tlcengine' } });

                // Prepend Unique String To Prevent Overwrites
                var randomNumber = String(Math.floor(Math.random() * 9000) + 1000) + "_";
                var uniqueFileName = 'client_' + randomNumber + '_' + image.name;

                var params = {
                    Key: uniqueFileName,
                    ContentType: image.type,
                    Body: image,
                    ServerSideEncryption: 'AES256'
                };

                $scope.Process[imageType] = true;
                bucket.putObject(params, function (err, data) {
                  console.log(err);
                    /*if (err) {
                        //aaNotify.error(err.message, err.code);
                        $scope.client.Profile.BasicData[imageType] = null;
                        $scope.Process[imageType] = false;
                        $scope.$digest();
                    }
                    else {*/
                        $scope.client.Profile.BasicData[imageType] = "https://s3.amazonaws.com/tlcengine/" + uniqueFileName;
                        $scope.Process[imageType] = false;
                        $scope.$digest();
                    //}
                }).on('httpUploadProgress', function (progress) {
                    // Log Progress Information
                    //console.log(Math.min(100, parseInt(progress.loaded / progress.total * 100)));
                    $scope.Process.Progress = Math.min(100, parseInt(progress.loaded / progress.total * 100));
                    $scope.$digest();
                });
            }
        }

        var taxWithholding = {
            "single": [
              { "excessover": 0, "withhold": 0, "percent": 0 },
              { "excessover": 2250, "withhold": 0, "percent": 10 },
              { "excessover": 11325, "withhold": 907.5, "percent": 15 },
              { "excessover": 39150, "withhold": 5081.25, "percent": 25 },
              { "excessover": 91600, "withhold": 18193.75, "percent": 28 },
              { "excessover": 188600, "withhold": 45353.75, "percent": 33 },
              { "excessover": 407350, "withhold": 117541.25, "percent": 35 },
              { "excessover": 409000, "withhold": 118118.75, "percent": 39.6 }
            ],
            "married": [
              { "excessover": 0, "withhold": 0, "percent": 0 },
              { "excessover": 8450, "withhold": 0, "percent": 10 },
              { "excessover": 26600, "withhold": 1815, "percent": 15 },
              { "excessover": 82250, "withhold": 10162.5, "percent": 25 },
              { "excessover": 157300, "withhold": 28925, "percent": 28 },
              { "excessover": 235300, "withhold": 50765, "percent": 33 },
              { "excessover": 413550, "withhold": 109587.5, "percent": 35 },
              { "excessover": 466050, "withhold": 127962.5, "percent": 39.6 }
            ],
            "allowance": [
              { "payperiod": "Weekly", "periodsperyear": 52, "allowance": 76 },
              { "payperiod": "Biweekly", "periodsperyear": 26, "allowance": 151.9 },
              { "payperiod": "Semimonthly", "periodsperyear": 24, "allowance": 164.6 },
              { "payperiod": "Monthly", "periodsperyear": 12, "allowance": 329.2 },
              { "payperiod": "Quarterly", "periodsperyear": 4, "allowance": 987.5 },
              { "payperiod": "Semiannually", "periodsperyear": 2, "allowance": 1975 },
              { "payperiod": "Annually", "periodsperyear": 1, "allowance": 3950 }
            ]
        };

        var _defaultTaxDeferralPlanValue = 5, _defaultStateLocalTaxesValue = 5.3, _defaultAllowances = 2;
        var _FICASocialSecurity = 6.2, _FICAMedicare = 1.45;

        $scope.CalculateProfileGrossIncomeTotal = function (IncomeDetail) {
            //if (isNaN(IncomeDetail.NetPay)) {
            //    alert("Please enter Net Monthly Income.")
            //    return;
            //}

            var _netPay = angular.copy(IncomeDetail.NetPay);
            var _periodPerYear = 0, _oneAllowances = 0, _periodPerYearForMonthly = 0, _federalTaxableGross = 0;
            var _excessOver = 0, _withHold = 0, _plusX = 0;
            $.each(taxWithholding.allowance, function (index, val) {
                if ("Monthly".toLowerCase() == val.payperiod.toLowerCase()) {
                    _periodPerYear = val.periodsperyear;
                    _periodPerYearForMonthly = val.periodsperyear;
                    _oneAllowances = val.allowance;
                    return false;
                }
            });

            if (IncomeDetail.FilingStatus.toLowerCase() == "single") {
                $.each(taxWithholding.single, function (index, val) {
                    if (IncomeDetail.NetTaxBracket == val.percent) {
                        _excessOver = val.excessover;
                        _withHold = val.withhold;
                        _plusX = val.percent;
                        return false;
                    }
                });
            }
            else if (IncomeDetail.FilingStatus.toLowerCase() == "married") {
                $.each(taxWithholding.married, function (index, val) {
                    if (IncomeDetail.NetTaxBracket == val.percent) {
                        _excessOver = val.excessover;
                        _withHold = val.withhold;
                        _plusX = val.percent;
                        return false;
                    }
                });
            }

            var _multiplier = (_periodPerYear / 12).toFixed(2);
            _netPay = _netPay * _multiplier;
            //$("input[name='txtMonthlyIncome']").val((CalculateNetIncomeTotal()));
            var _TDP = 0, _NOA = 0, _OA = 0, _PPY = 0, _PLUS = 0, _W = 0, _EO = 0, _SS = 0, _MED = 0, _SLT = 0, _PRE = 0, _POST = 0, _REIMBUS = 0;
            _TDP = GetPercentageValue(GetValue(IncomeDetail.TaxDeferralPlan));
            _NOA = Number(GetValue(IncomeDetail.NumberOfAllowances));
            _OA = _oneAllowances;
            _PPY = _periodPerYearForMonthly;
            _PLUS = GetPercentageValue(_plusX);
            _W = _withHold;
            _EO = _excessOver;
            _SS = GetPercentageValue(_FICASocialSecurity);
            _MED = GetPercentageValue(_FICAMedicare);
            _SLT = GetPercentageValue(GetValue(IncomeDetail.StateLocalTaxes));
            _PRE = GetOnlyNumber(GetValue(IncomeDetail.OtherPreTaxDeduction));
            _POST = GetOnlyNumber(GetValue(IncomeDetail.OtherPostTaxDeduction));
            _REIMBUS = GetOnlyNumber(GetValue(IncomeDetail.PostTaxReimbursement));

            var _NG = 0, _NA = 0;
            _NG = 1 - _SS - _MED - (((1 - _TDP) * _PPY * _PLUS) / 12) - _TDP - (_SLT * (1 - _TDP));
            _NA = (_W + (((-1 * (_NOA * _OA) * _PPY) - _EO) * _PLUS)) / 12 + Number(_PRE) + Number(_POST) - Number(_REIMBUS) + (_SLT * -1 * _NOA * _OA);
            var _grossPay = (_netPay + _NA) / _NG;

            IncomeDetail.GrossPay = Number(_grossPay);
            IncomeDetail.PayPeriod = 'Monthly';

            IncomeDetail.ProfileEstGrossPay = _grossPay * _periodPerYearForMonthly;
            //_parentWrapper.find("input[name='txtProfileEstGrossPay']").val((_grossPay * _periodPerYearForMonthly));
            _federalTaxableGross = _grossPay
            - Number(GetValue(IncomeDetail.NumberOfAllowances) * _oneAllowances)
            - Number(GetPercentageValue(GetValue(IncomeDetail.TaxDeferralPlan)) * _grossPay)
            - GetOnlyNumber(GetValue(IncomeDetail.OtherPreTaxDeduction));
            if (_federalTaxableGross < 0) {
                _federalTaxableGross = 0;
            }

            IncomeDetail.ProfileFederalTaxableGross = Number(_federalTaxableGross);
            _multiplier = (_periodPerYearForMonthly / 12).toFixed(2);
            _grossPay = _grossPay * _multiplier;
            //$("input[name='txtMonthlyGross']").val((CalculateGrossIncomeTotal()));
            var _federalTax = ((_withHold + (GetPercentageValue(_plusX) * ((_federalTaxableGross * _periodPerYearForMonthly) - _excessOver))) / _periodPerYearForMonthly) * _multiplier;

            IncomeDetail.ProfileFICASocialSecurity = _grossPay * GetPercentageValue(_FICASocialSecurity);
            IncomeDetail.ProfileFICAMedicare = _grossPay * GetPercentageValue(_FICAMedicare);
            IncomeDetail.ProfileFederalTaxValue = _federalTax;
            IncomeDetail.ProfileTaxDeferralPlanValue = GetPercentageValue(GetValue(IncomeDetail.TaxDeferralPlan)) * _grossPay;
            IncomeDetail.ProfilePreTaxDeductionsValue = GetOnlyNumber(GetValue(IncomeDetail.OtherPreTaxDeduction)) * _multiplier;
            IncomeDetail.ProfileStateLocalTaxesValue = _federalTaxableGross * GetPercentageValue(GetValue(IncomeDetail.StateLocalTaxes)) * _multiplier;
            IncomeDetail.ProfilePostTaxDeductionsValue = GetOnlyNumber(GetValue(IncomeDetail.OtherPostTaxDeduction)) * _multiplier;
            IncomeDetail.ProfilePostTaxReimbursementsValue = GetOnlyNumber(GetValue(IncomeDetail.PostTaxReimbursement)) * _multiplier;
        }

        $scope.CalculateProfileNetIncomeTotal = function (IncomeDetail) {
            if (isNaN(IncomeDetail.GrossPay)) {
                return;
            }

            var _grossPay = angular.copy(IncomeDetail.GrossPay);
            var _periodPerYear = 0, _oneAllowances = 0, _federalTaxableGross = 0;
            var _excessOver = 0, _withHold = 0, _plusX = 0;
            $.each(taxWithholding.allowance, function (index, val) {
                if ("monthly".toLowerCase() == val.payperiod.toLowerCase()) {
                    _periodPerYear = val.periodsperyear;
                    _oneAllowances = val.allowance;
                    return false;
                }
            });
            //_parentWrapper.find("input[name='txtProfileEstGrossPay']").val((_grossPay * _periodPerYear));
            IncomeDetail.ProfileEstGrossPay = _grossPay * _periodPerYear;

            _federalTaxableGross = _grossPay
            - Number(GetValue(IncomeDetail.NumberOfAllowances) * _oneAllowances)
            - Number(GetPercentageValue(GetValue(IncomeDetail.TaxDeferralPlan)) * _grossPay)
            - GetOnlyNumber(GetValue(IncomeDetail.OtherPreTaxDeduction));

            if (_federalTaxableGross < 0) {
                _federalTaxableGross = 0;
            }
            IncomeDetail.ProfileFederalTaxableGross = Number(_federalTaxableGross);

            if (IncomeDetail.FilingStatus.toLowerCase() == "single") {
                var _annualFTG = _federalTaxableGross * _periodPerYear;
                $.each(taxWithholding.single, function (index, val) {
                    if (_annualFTG > val.excessover) {
                        _excessOver = val.excessover;
                        _withHold = val.withhold;
                        _plusX = val.percent;
                    }
                    else {
                        return false;
                    }
                });
            }
            else if (IncomeDetail.FilingStatus.toLowerCase() == "married") {
                var _annualFTG = _federalTaxableGross * _periodPerYear;
                $.each(taxWithholding.married, function (index, val) {
                    if (_annualFTG > val.excessover) {
                        _excessOver = val.excessover;
                        _withHold = val.withhold;
                        _plusX = val.percent;
                    }
                    else {
                        return false;
                    }
                });
            }

            IncomeDetail.NetTaxBracket = "" + _plusX;
            //_plusX = GetPercentageValue(IncomeDetail.NetTaxBracket);
            var _multiplier = (_periodPerYear / 12).toFixed(2);
            _grossPay = _grossPay * _multiplier;

            var _federalTax = ((_withHold + (GetPercentageValue(_plusX) * ((_federalTaxableGross * _periodPerYear) - _excessOver))) / _periodPerYear) * _multiplier;
            IncomeDetail.ProfileFICASocialSecurity = _grossPay * GetPercentageValue(_FICASocialSecurity);
            IncomeDetail.ProfileFICAMedicare = _grossPay * GetPercentageValue(_FICAMedicare);
            IncomeDetail.ProfileFederalTaxValue = _federalTax;
            IncomeDetail.ProfileTaxDeferralPlanValue = GetPercentageValue(GetValue(IncomeDetail.TaxDeferralPlan)) * _grossPay;
            IncomeDetail.ProfilePreTaxDeductionsValue = GetOnlyNumber(GetValue(IncomeDetail.OtherPreTaxDeduction)) * _multiplier;
            IncomeDetail.ProfileStateLocalTaxesValue = _federalTaxableGross * GetPercentageValue(GetValue(IncomeDetail.StateLocalTaxes)) * _multiplier;
            IncomeDetail.ProfilePostTaxDeductionsValue = GetOnlyNumber(GetValue(IncomeDetail.OtherPostTaxDeduction)) * _multiplier;
            IncomeDetail.ProfilePostTaxReimbursementsValue = GetOnlyNumber(GetValue(IncomeDetail.PostTaxReimbursement)) * _multiplier;

            var _deductions = (GetOnlyNumber(GetValue(IncomeDetail.ProfileFICASocialSecurity)) + GetOnlyNumber(GetValue(IncomeDetail.ProfileFICAMedicare))
            + GetOnlyNumber(GetValue(IncomeDetail.ProfileFederalTaxValue)) + GetOnlyNumber(GetValue(IncomeDetail.ProfileTaxDeferralPlanValue))
            + GetOnlyNumber(GetValue(IncomeDetail.ProfilePreTaxDeductionsValue)) + GetOnlyNumber(GetValue(IncomeDetail.ProfileStateLocalTaxesValue))
            + GetOnlyNumber(GetValue(IncomeDetail.ProfilePostTaxDeductionsValue)));
            var _reimbursement = GetOnlyNumber(GetValue(IncomeDetail.ProfilePostTaxReimbursementsValue));
            var _netTakeHome = GetOnlyNumber(_grossPay) - GetOnlyNumber(_deductions) + GetOnlyNumber(_reimbursement);
            IncomeDetail.NetPay = _netTakeHome;
            IncomeDetail.NetPayPeriod = 'Monthly';

            //$("input[name='txtMonthlyIncome']").val((CalculateNetIncomeTotal()));
        }

        function GetPercentageValue(_val) {
            return _val / 100;
        }

        function GetValue(_val, _defaultVal) {
            if (!_val) {
                if (!_defaultVal) {
                    return 0;
                }
                else {
                    return (_defaultVal);
                }
            }
            else {
                return (_val);
            }
        }

        function GetOnlyNumber(_val) {
            return Number(parseFloat(_val.toString().replace(/[^0-9\.]+/g, ""), 10).toFixed(2));
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


