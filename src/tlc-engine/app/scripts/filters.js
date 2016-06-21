/**
 * Created by kamal on 2/11/2015.
 */


//<div ng-bind-html="propertyDetail.LISTPRICE  | formatCurrency | to_trusted"></div>
//<span>$</span>5,875,000.<sup>00</sup>
angular.module('tlcengineApp').filter('formatCurrency',
  [ '$filter', '$locale', function($filter, $locale) {
    var formats = $locale.NUMBER_FORMATS;
    var sym = $locale.NUMBER_FORMATS.CURRENCY_SYM;

    return function(amount) {
      if(amount== undefined || amount == '') {
        amount = 0;
      }

      var value = $filter('currency')(amount, '<span>' + sym + '</span>');

      var sep = value.indexOf(formats.DECIMAL_SEP);
      return value.substring(0, sep) + formats.DECIMAL_SEP + '<sup>' + value.substring(sep + 1) + '</sup>';
    };
  } ]);

angular.module('tlcengineApp').filter('currencyNoDecimal',
  [ '$filter', '$locale', function($filter, $locale) {
    var formats = $locale.NUMBER_FORMATS;
    var sym = $locale.NUMBER_FORMATS.CURRENCY_SYM;

    return function(amount) {
      if(amount== undefined || amount == '') {
        amount = 0;
      }

      return $filter('currency')(amount, sym , 0);
    };
  } ]);

angular.module('tlcengineApp')
  .filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
  }]);


angular.module('tlcengineApp')
.directive('numbersMaxMin', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      element.bind("blur", function (event) {
        if (!modelCtrl || !element.val())
        {
          modelCtrl.$setValidity('min', true);
          modelCtrl.$setValidity('max', true);
          return;
        }

        var min = typeof attrs.min != 'undefined' ? Number(attrs.min) : 0;
        var max = typeof attrs.max != 'undefined' ? Number(attrs.max) : 99999999;

        var currentValue = Number(element.val().replace(/[^\d|\-+|\.+]/g, ''));

        if (!(currentValue >= min && currentValue <= max)) {
          //modelCtrl.$setViewValue(attrs.min);
          //modelCtrl.$render();
          if(currentValue < min)
            modelCtrl.$setValidity('min', false);
          if(currentValue > max)
            modelCtrl.$setValidity('max', false);
        }
        else
        {
          modelCtrl.$setValidity('min', true);
          modelCtrl.$setValidity('max', true);
        }
      });
    }
  };
});



angular.module('tlcengineApp')
  .directive('formatcurrency', ['$filter', function ($filter) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        if (!ctrl) return;

        elem.bind('blur', function (viewValue) {
          if (attrs.formatcurrency == 'currency') {
            //if (typeof ctrl.$modelValue == 'undefined' || ctrl.$modelValue == null)
            //    ctrl.$modelValue = 0;
            ctrl.$modelValue = ctrl.$viewValue;
            if (ctrl.$modelValue != 0 && (typeof ctrl.$modelValue == 'undefined' || ctrl.$modelValue == null || ctrl.$modelValue == '')) {
              elem.val("");
            }
            else {
              var plainNumber = ctrl.$modelValue.toString();
              plainNumber = parseFloat(plainNumber.replace(/[^\d|\-+|\.+]/g, ''));
              elem.val($filter(attrs.formatcurrency)(plainNumber.toFixed(2),undefined,2));
            }
          }
          else if (attrs.formatcurrency == 'decimal') {
            ctrl.$modelValue = ctrl.$viewValue;
            if (ctrl.$modelValue != 0 && (typeof ctrl.$modelValue == 'undefined' || ctrl.$modelValue == null || ctrl.$modelValue == '')) {
              elem.val("");
            }
            else {
              var plainNumber = ctrl.$modelValue.toString();
              plainNumber = parseFloat(plainNumber.replace(/[^\d|\-+|\.+]/g, ''));
              elem.val($filter('number')(plainNumber, 2));
            }
          }
          else if (attrs.formatcurrency == 'number') {
            ctrl.$modelValue = ctrl.$viewValue;
            if (ctrl.$modelValue != 0 && (typeof ctrl.$modelValue == 'undefined' || ctrl.$modelValue == null || ctrl.$modelValue == '')) {
              elem.val("");
            }
            else {
              var plainNumber = ctrl.$modelValue.toString();
              plainNumber = parseFloat(plainNumber.replace(/[^\d]/g, ''));
              elem.val($filter('number')(plainNumber, 0));
            }
          }
        });
        //var symbol = "$"; // dummy usage

        ctrl.$formatters.unshift(function (a) {
          if (typeof ctrl.$modelValue != 'undefined' && ctrl.$modelValue != null)
            if (attrs.formatcurrency == 'currency') {
              return $filter(attrs.formatcurrency)(ctrl.$modelValue,undefined,2);
            }
            else if (attrs.formatcurrency == 'decimal') {
              return ($filter('number')(ctrl.$modelValue, 2));
              //$filter(attrs.formatcurrency)(ctrl.$modelValue);
            }
            else if (attrs.formatcurrency == 'number') {
              return ($filter('number')(ctrl.$modelValue, 0));
              //$filter(attrs.formatcurrency)(ctrl.$modelValue);
            }
        });

        /*ctrl.$parsers.unshift(function (viewValue) {
          var plainNumber = viewValue.replace(/[^\d]/g, '');
          //console.log(plainNumber, isNaN(plainNumber), typeof plainNumber == 'undefined', plainNumber == null, plainNumber == '');
          //console.log(isNaN(plainNumber) || typeof plainNumber == 'undefined' || plainNumber == null || plainNumber == '' ? null : Number(plainNumber));
          return isNaN(plainNumber) || typeof plainNumber == 'undefined' || plainNumber == null || plainNumber == '' ? null : Number(plainNumber);
        });*/


        ctrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return '';
          //console.log(typeof inputValue);
          var transformedInput = inputValue.toString().replace(/[^0-9\.]/g, '');
          if (transformedInput!=inputValue) {
            ctrl.$setViewValue(Number(transformedInput));
            ctrl.$render();
          }

          return isNaN(transformedInput) || typeof transformedInput == 'undefined' || transformedInput == null || transformedInput == '' ? null : Number(transformedInput);;
        });
      }
    };
  }]);


/*
angular.module('tlcengineApp')
  .directive('numbersOnly', function(){
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (inputValue) {
        // this next if is necessary for when using ng-required on your input.
        // In such cases, when a letter is typed first, this parser will be called
        // again, and the 2nd time, the value will be undefined
        if (inputValue == undefined) return ''
        var transformedInput = inputValue.replace(/[^0-9]/g, '');
        if (transformedInput!=inputValue) {
          modelCtrl.$setViewValue(Number(transformedInput));
          modelCtrl.$render();
        }

        return transformedInput;
      });
    }
  };
});*/

angular.module('tlcengineApp')
.filter('tel', function () {
  return function (tel) {
    if (!tel) { return '-'; }

    var value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    var country, city, number;

    switch (value.length) {
      case 10: // +1PPP####### -> C (PPP) ###-####
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11: // +CPPP####### -> CCC (PP) ###-####
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12: // +CCCPP####### -> CCC (PP) ###-####
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return tel;
    }

    if (country == 1) {
      country = "";
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + " (" + city + ") " + number).trim();
  };
});


angular.module('tlcengineApp')
  .directive("compareTo", function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
});

//https://github.com/mbenford/ngTagsInput/issues/254
angular.module('tlcengineApp')
  .directive('restrictToMaxTags', function () {
  var KEY_BACKSPACE = 8;
  return {
    require: 'ngModel',
    priority: -10,
    link: function (scope, element, attrs, ngModelController) {
      var tagsInputScope = element.isolateScope(),
        maxTags,
        getTags,
        checkTags,
        getTagsLength,
        checkTagsLength,
        processLength,
        maxTagsReached,
        input = element.find('input'),
        placeholder;

      attrs.$observe('maxTags', function (_maxTags) {
        maxTags = _maxTags;
      });

      getTags = function () {
        return ngModelController.$modelValue;
      };

      getTagsLength = function () {
        return ngModelController.$modelValue ? ngModelController.$modelValue.length : -1;
      };

      processLength = function (len) {
        if (len >= maxTags) {
          if(placeholder == undefined)
            placeholder = input.attr('placeholder');

          input.attr('placeholder', '');
          input.css('width', '10px');
          maxTagsReached = true;
        } else if(maxTagsReached) {
          input.attr('placeholder', placeholder);
          input.css('width', '');
          maxTagsReached = false;
        }
      };

      checkTags = function () {
        var tags = getTags();
        processLength(tags ? tags.length : -1);
      };

      checkTagsLength = function () {
        var length = getTagsLength();
        processLength(length);
      };

      scope.$watch(getTags, checkTags);
      scope.$watch(getTagsLength, checkTagsLength);

      // prevent any keys from being entered into
      // the input when max tags is reached
      input.on('keydown', function (event) {
        if (maxTagsReached && event.keyCode !== KEY_BACKSPACE) {
          event.stopImmediatePropagation();
          event.preventDefault();
        }
      });

      // prevent the autocomplete from being triggered
      input.on('focus', function (event) {
        checkTags();
        if (maxTagsReached) {
          //tagsInputScope.hasFocus = true;
          event.stopImmediatePropagation();
        }
      });
    }
  };
});
angular.module('tlcengineApp').filter('capitalize', function() {
    return function(input) {        
        var i = 0;
        var newString ="";
        var words = input.split(" ");
        do {
            newString += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
            if(i != words.length-1)
                newString += " "
            i++;
        }while (i < words.length)
            return newString;
    }
  });
