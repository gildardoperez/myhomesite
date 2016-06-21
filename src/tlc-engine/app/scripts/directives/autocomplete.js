'use strict';

angular.module('tlcengineApp')
  .directive('autocomplete', function($parse) {
    return function(scope, element, attrs) {
      var setSelection = $parse(attrs.selection).assign;
      scope.$watch(attrs.autocomplete, function(value) {
        element.autocomplete({
          source: value,
          //minLength: 2,
          //delay: 500,
          select: function(event, ui) {
            try {setSelection(scope, ui.item.value);}catch(ex){}
            scope.$apply();
          }
        });
      });
    };
  });
