'use strict';

/**
 * @ngdoc directive
 * @name tlcengineApp.directive:scrollbar
 * @description
 * # scrollbar
 */
angular.module('tlcengineApp')
  .directive('scrollbar', function () {
    return {
      link: function postLink(scope, element, attrs) {
          // custom scrollbar lib to make it pretty
          $(element).scrollbar();
      }
    };
  });
 