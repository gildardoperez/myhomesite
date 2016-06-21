'use strict';

/**
 * @ngdoc directive
 * @name tlcengineApp.directive:tlcDropdown
 * @description
 * # tlcDropdown
 */
angular.module('tlcengineApp')
  .directive('tlcDropdown', function () {
    return {
      scope:{
        reset: "=",
        onChangeHandler: "=",
        ngModel:'=?'
      },
//        templateUrl: 'views/templates/tlcDropdown.tpl.html',
//        scope:{
//            $id : "@id",
//            name : "@name",
//            label : "@label",
//            options : "="
//        },
//        restrict: 'E',
      link: function postLink($scope, element, attrs) {
        $(element).tlcDropdown();

        $scope.$watch("reset", function(newVal, oldVal){
          if(newVal == true){
            $(element).tlcDropdown("reset","ANY");
            $scope.reset = false;
          }
        });

        $scope.$watch("ngModel", function(newVal, oldVal){
          //console.log(newVal,oldVal);
          if(newVal != oldVal){
            $(element).tlcDropdown("reset",newVal);
          }
        });

        if($scope.onChangeHandler != undefined && $scope.onChangeHandler != null){
          $(element).tlcDropdown("onChange",function(e){
            //console.log("Change event " + e.element.val());
            $scope.onChangeHandler(attrs.label || attrs.name,e.element.val());
          });
        }

//            $scope.reset = function(){
//                $("#tlc_"+ $scope.$id).remove();
//            }

//            $scope.reset();
//            $("#"+$scope.$id).tlcDropdown();
//            $scope.$watch('options', function(newVal, oldVal){
//                console.log($scope.options);
//                $scope.options = newVal;
//                $scope.selectedOption = $scope.options[0];
////                $scope.reset();
////                $("#"+$scope.$id).tlcDropdown();
//            }, true);
//            $scope.selectedOption;
//            console.log($scope.options);
//            console.log($scope.selectedOption);

//            $scope.$watchCollection($scope.options, function(newValues){
//                $scope.options = newValues;
//                $("#"+$scope.$id).tlcDropdown();
//            });


      }
    };
  });




/*
 *  TLC Dropdown
 */
; (function ($, window, document, undefined) {

  // Create the defaults once
  var pluginName = "tlcDropdown",
    defaults = {
      propertyName: "value"
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = $(element);
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this._init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    _init: function () {
      var t = this, w, l,
        label = t.element.data("label"),
        id = (t.element.attr("id") || t.element.attr("name")),
        className = t.element.attr("class").replace("dropdown", "").trim();
      this.onChangeHandler = function () { };
      this.wrapper = $('<div id="tlc_' + id + '" class="tlc_dropdown tlc_qualifier ' + className + '"><span>ANY</span><i class="data-style">' + label + '</i></div>');
      this.element.hide().after(t.wrapper);

      w = this.wrapper.outerWidth();
      l = this.wrapper.css("left");

      this.element.children().each(function () {
        var o = $(this);
        //if (o.attr("value") != "")
        if (t.element.hasClass("nonnumerical"))
          t.wrapper.append('<div class="choice" data-value="' + o.attr("value") + '"><span>' + o.text() + '</span></div>');
        else
          t.wrapper.append('<div class="choice" data-value="' + o.attr("value") + '">' + o.text() + '</div>');
      });

      this.wrapper.click(function (e) {
        e.stopPropagation();

        // fix width if nonnumerical
        if (t.element.hasClass("nonnumerical") && !t.wrapper.hasClass("active")) {
          var widths = [];
          // loop over choices
          t.wrapper.find("div.choice").each(function () {
            widths.push($(this).children("span").outerWidth());
          });
          t.wrapper.css({
            "width": widths.max() + 30,
            "left": "-=" + Math.abs((w - (widths.max() + 30)) / 2) + "px"
          });
        }

        $(".tlc_qualifier.active").removeClass("active");
        t.wrapper.addClass("active");
        t.wrapper.parents("#qualifiers").addClass("active");
      });

      this.wrapper.children("div").click(function (e) {
        e.stopPropagation();
        t.wrapper.children("div").removeClass("active");
        $(this).addClass("active");
        t._render(w, l);
      });

      $("body").click(function () {
        t.wrapper.removeClass("active");
        t.wrapper.parents("#qualifiers").removeClass("active");

        // fix width if nonnumerical
        if (t.element.hasClass("nonnumerical")) {
          t.wrapper.css({
            "width": w,
            "left": l
          });
        }
      });
    },
    _render: function (w, l) {
      var t = this,
        numbers = [],
        display = "ANY",
        dispprops = {
          "1": "SINGLE",
          "2": "MULTI",
          "3": "CONDO",
          "4": "LAND",
          "5": "COMM.",
          "6": "FARM",
          "7": "MANUF."
        }

      // if we are text-based
      if (t.element.hasClass("nonnumerical")) {
        val = t.wrapper.find("div.active").first().data("value");
        display = dispprops[val];
      } else {
        // get the selections
        t.wrapper.find("div.active").each(function () {
          numbers.push($(this).data("value"));
        });
        // update background
        t.element.val(numbers);
        // make the string
        $.each(numbers, function (i, v) {
          if (i == 0)
            display = v;
          else {
            if (t._c(numbers[i]) - t._c(numbers[i - 1]) > 1)
              display += "," + numbers[i];
            else
            if (i == numbers.length - 1 || t._c(numbers[i + 1]) - t._c(numbers[i]) > 1)
              display += "-" + numbers[i];
          }
        });
      }
      // display it
      t.wrapper.children("span").text(display ? display : "Any");
      // go back
      t.wrapper.removeClass("active");
      t.wrapper.parents("#qualifiers").removeClass("active");

      // fix width if nonnumerical
      if (t.element.hasClass("nonnumerical")) {
        t.wrapper.css({
          "width": w,
          "left": l
        });
      }

      this.fireOnChange(this);
    },
    _c: function (number) {
      return Number(String(number).replace("+", ""));
    },
    update: function () {
      var t = this;
      console.log("It's now ", t.element.val());
    },
    reset: function (value) {
      var t = this;
      t.wrapper.children("span").text(value);
      t.element.val(value == "ANY" ? "" : value);
      t.wrapper.children(".choice").removeClass("active");
    },
    onChange: function (handler) {
      this.onChangeHandler = handler;
    },
    fireOnChange: function (event) {
      this.onChangeHandler(event);
    }
  });

  $.fn[pluginName] = function (options, argument) {
    return this.each(function () {
      if ($.isFunction(Plugin.prototype[options]) && options.charAt(0) != "_") {
        if (arguments.length == 1)
          $.data(this, 'plugin_' + pluginName)[options]();
        else
          $.data(this, 'plugin_' + pluginName)[options](argument);
      } else if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
