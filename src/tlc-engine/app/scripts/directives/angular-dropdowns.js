/**
 * @license MIT http://jseppi.mit-license.org/license.html
 */
(function (window, angular, undefined) {
  'use strict';

  var dd = angular.module('ngDropdowns', []);

  dd.run(['$templateCache', function ($templateCache) {
    $templateCache.put('ngDropdowns/templates/dropdownSelect.html', [
      '<div class="tlc_dropdown tlc_qualifier">',
      '<span>{{dropdownModel[labelField]}}</span> {{dropdownLabel}}',
      '<div ng-repeat="item in dropdownSelect"',
      ' ng-click="selectItem(item)"',
      ' ng-class="{\'active\': dropdownModel.value == item.value}">{{item[labelField]}}',
      '</div></div>'
    ].join(''));

  }]);

  dd.directive('dropdownSelect', ['DropdownService',
    function (DropdownService) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          dropdownSelect: '=',
          dropdownModel: '=',
          dropdownItemLabel: '@',
          dropdownOnchange: '&',
          dropdownDisabled: '=',
          dropdownLabel: '@'
        },
        link: function (scope, element, attrs) {

        },
        controller: ['$scope', '$element', function ($scope, $element) {
          $scope.labelField = $scope.dropdownItemLabel || 'text';

          DropdownService.register($element);

          $scope.selectItem = function (selected) {
            if (!angular.equals(selected, $scope.dropdownModel)) {
                $scope.dropdownModel = selected;
            }
            $scope.dropdownOnchange()($scope.dropdownLabel, selected.text);
          };

          $element.bind('click', function (event) {
            event.stopPropagation();
            if (!$scope.dropdownDisabled) {
              DropdownService.toggleActive($element);
            }
          });

          $scope.$on('$destroy', function () {
            DropdownService.unregister($element);
          });
        }],
        templateUrl: 'ngDropdowns/templates/dropdownSelect.html'
      };
    }
  ]);

  dd.factory('DropdownService', ['$document',
    function ($document) {
      var body = $document.find('body'),
        service = {},
        _dropdowns = [];

      body.bind('click', function () {
        angular.forEach(_dropdowns, function (el) {
          el.removeClass('active');
        });
      });

      service.register = function (ddEl) {
        _dropdowns.push(ddEl);
      };

      service.unregister = function (ddEl) {
        var index;
        index = _dropdowns.indexOf(ddEl);
        if (index > -1) {
          _dropdowns.splice(index, 1);
        }
      };

      service.toggleActive = function (ddEl) {
        angular.forEach(_dropdowns, function (el) {
          if (el !== ddEl) {
            el.removeClass('active');
          }
        });

        ddEl.toggleClass('active');
      };

      return service;
    }
  ]);
})(window, window.angular);
