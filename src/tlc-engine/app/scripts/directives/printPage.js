angular.module('tlcengineApp')
  .factory('printer', ['$rootScope', '$compile', '$http', '$timeout','$q', function ($rootScope, $compile, $http, $timeout, $q) {
    var printHtml = function (html) {
      /*var deferred = $q.defer();
       var hiddenFrame = $('<iframe style="display: none"></iframe>').appendTo('body')[0];
       hiddenFrame.contentWindow.printAndRemove = function() {
       hiddenFrame.contentWindow.focus();
       hiddenFrame.contentWindow.print();
       $(hiddenFrame).remove();
       };
       var htmlContent = "<!doctype html>"+
       "<html>"+
       '<body onload="printAndRemove();">' +
       html +
       '</body>'+
       "</html>";
       var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
       doc.write(htmlContent);
       deferred.resolve();
       doc.close();
       return deferred.promise;*/

      var deferred = $q.defer();

      var htmlContent = "<!doctype html>"+
        "<html>"+
        '<body onload="printAndRemove();">' +
        html +
        '</body>'+
        "</html>";
      //console.log(htmlContent);
      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 /*|| navigator.userAgent.toLowerCase().indexOf('safari') > -1*/) {
        var hiddenFrame = $('<iframe style="display: none"></iframe>').appendTo('body')[0];
        hiddenFrame.contentWindow.printAndRemove = function() {
          hiddenFrame.contentWindow.focus();
          hiddenFrame.contentWindow.print();
          $(hiddenFrame).remove();
        };

        var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
        doc.write(htmlContent);
        deferred.resolve();
        doc.close();
      }
      else {
        var popupWin = window.open('', '_blank', 'width=800,height=600, scrollbars=yes, resizable=yes');
        popupWin.document.open();
        popupWin.document.write(htmlContent);
        popupWin.print();
        popupWin.document.close();
      }

      return deferred.promise;
    };

    var openNewWindow = function (html) {
      var newWindow = window.open("printTest.html");
      newWindow.addEventListener('load', function(){
        $(newWindow.document.body).html(html);
      }, false);
    };

    var print = function (templateUrl, data) {
      $http.get(templateUrl).success(function(template){
        var printScope = $scope.$new();
        angular.extend(printScope, data);
        var element = $compile($('<div>' + template + '</div>'))(printScope);
        var waitForRenderAndPrint = function() {
          if(printScope.$$phase || $http.pendingRequests.length) {
            $timeout(waitForRenderAndPrint);
          } else {
            // Replace printHtml with openNewWindow for debugging
            printHtml(element.html());
            printScope.$destroy();
          }
        };
        waitForRenderAndPrint();
      });
    };

    var printFromScope = function (templateUrl, scope) {
      $rootScope.isBeingPrinted = true;
      $http.get(templateUrl).success(function(template){
        //var printScope = scope;
        var element = $compile($('<div>' + template + '</div>'))(scope);
        var waitForRenderAndPrint = function() {
          if (scope.$$phase || $http.pendingRequests.length) {
            $timeout(waitForRenderAndPrint);
          } else {
            printHtml(element.html()).then(function() {
              $rootScope.isBeingPrinted = false;
            });

          }
        };

        waitForRenderAndPrint();

      });
    };
    return {
      print: print,
      printFromScope:printFromScope
    }
  }]);
