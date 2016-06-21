'use strict';

angular.module('tlcengineApp')
  .directive('pscrollbar',function(){
    return {
      link: function(scope, element, attrs){
        $(element).perfectScrollbar(scope.$eval(attrs.pscrollbar));


        scope.$on('updatepscrollbar',function(){
          //console.log('updatepscrollbar');
          $(element).perfectScrollbar('update');
        });
        if(attrs.rebuildtotop){
          scope.$watch(attrs.rebuildtotop,function(){
              $(element).scrollTop(0);
              scope.$broadcast('updatepscrollbar');
          });
        }
        //element.perfectScrollbar(); - doesn't work
        //angular.element(element).perfectScrollbar(); - doesn't work
      }
    };
  });
