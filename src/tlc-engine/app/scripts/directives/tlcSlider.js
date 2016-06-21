'use strict';

/**
 * @ngdoc directive
 * @name tlcengineApp.directive:tlcRange
 * @description
 * # tlcRange
 */
angular.module('tlcengineApp')
    .directive('tlcSlider', function ($rootScope,$timeout) {
        return {
          scope:{
            reset: "=",
            onChangeHandler: "="
          },
//      template: '<div></div>',
//      restrict: 'E',
            link: function postLink($scope, element, attrs) {
                //$(element).tlcSlider();

              var t = $(element),
                b = $("body");
              t.click(function (e) {
                if (b.hasClass("results")) {
                    e.stopPropagation();
                    $(".tlc_qualifier.active").removeClass("active");
                    t.addClass("active");
                    t.parents("#qualifiers").addClass("active");
                    //                        if(t.wrapper.hasClass("active")){
                    //                            t.wrapper.removeClass("active");
                    //                            $(".tlc_qualifier.active").removeClass("active");
                    //                        }else{
                    //                            $(".tlc_qualifier.active").removeClass("active");
                    //                            t.wrapper.addClass("active");
                    //                            t.wrapper.parents("#qualifiers").addClass("active");
                    //                        }

                } else {
                  if ($("#search").hasClass("more")) {
                    e.stopPropagation();
                    $(".tlc_qualifier.active").removeClass("active");
                    t.addClass("active");
                    t.parents("#qualifiers").addClass("active");
                    //                        if(t.wrapper.hasClass("active")){
                    //                            t.wrapper.removeClass("active");
                    //                            t.wrapper.parents("#qualifiers").removeClass("active");
                    //                        }else{
                    //                            $(".tlc_qualifier.active").removeClass("active");
                    //                            t.wrapper.addClass("active");
                    //                            t.wrapper.parents("#qualifiers").addClass("active");
                    //                        }

                  }
                }
              });

              b.click(function () {
                $timeout(function(){
                if (b.hasClass("results") && !$rootScope.setAddress) {
                  t.removeClass("active");
                    t.parents("#qualifiers").removeClass("active");
                } else {
                  if ($("#search").hasClass("more") && !$rootScope.setAddress) {
                  //if (!($("#search").hasClass("more")) || b.hasClass("results")) {
                    t.removeClass("active");
                    t.parents("#qualifiers").removeClass("active");
                  }
                }
                },150);
              });

              /*$scope.$watch("reset", function(newVal, oldVal){
                if(newVal == true){
                  $(element).tlcSlider("reset");
                  $scope.reset = false;
                }
              });

              if($scope.onChangeHandler != undefined && $scope.onChangeHandler != null){
                $(element).tlcSlider("onChange",function(e){
                  //console.log("tlc slider on change", e, e.min.val());
                  $scope.onChangeHandler(attrs.label || attrs.name,e.min.val() + " by " + e.radioValue);
                });
              }*/

            }
        };
    });



/*
 *  TLC slider
 */
; (function ($, window, document, undefined) {

  // Create the defaults once
  var pluginName = "tlcSlider",
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
      var t = this,
        b = $("body"),
        label = t.element.data("label"),
        labellong = t.element.data("label-long"),
        id = (t.element.attr("id") || t.element.attr("name")),
        className = t.element.attr("class").replace("range", "").trim(),
        min = t.element.find("input[data-role=min]"),
//                max = t.element.find("input[data-role=max]"),
        minval = Number(t.element.data("min")),
        maxval = Number(t.element.data("max")),
        minvallabel = t.element.data("min-label"),
        maxvallabel = t.element.data("max-label"),
        step = t.element.data("slider-step"),
        hn = !(t.element.data("humane")),
        pf = { prefix: '', centsLimit: 0 },
        radioinputs = t.element.find("input[type=radio]"),
        oldValue;
      this.minval = minval;
      this._id = id;
      this.onChangeHandler = function () { };
      t.min = min;

      this.wrapper = $('<div id="tlc_' + id + '" class="tlc_range tlc_qualifier ' + className + '"><span>ANY</span> <dt>' + label + '</dt><dd>' + labellong + '</dd></div>');
      this.element.hide().after(t.wrapper);
      this.wrapper.append(this.element);

      this.wrapper.click(function (e) {
        if (b.hasClass("results")) {
          if (!t.element.data("expand")) {
            e.stopPropagation();
            $(".tlc_qualifier.active").removeClass("active");
            t.wrapper.addClass("active");
            t.wrapper.parents("#qualifiers").addClass("active");
            //                        if(t.wrapper.hasClass("active")){
            //                            t.wrapper.removeClass("active");
            //                            $(".tlc_qualifier.active").removeClass("active");
            //                        }else{
            //                            $(".tlc_qualifier.active").removeClass("active");
            //                            t.wrapper.addClass("active");
            //                            t.wrapper.parents("#qualifiers").addClass("active");
            //                        }

          }
        } else {
          if (!$("#search").hasClass("more") || ($("#search").hasClass("more") && !t.element.data("expand"))) {
            e.stopPropagation();
            $(".tlc_qualifier.active").removeClass("active");
            t.wrapper.addClass("active");
            t.wrapper.parents("#qualifiers").addClass("active");
            //                        if(t.wrapper.hasClass("active")){
            //                            t.wrapper.removeClass("active");
            //                            t.wrapper.parents("#qualifiers").removeClass("active");
            //                        }else{
            //                            $(".tlc_qualifier.active").removeClass("active");
            //                            t.wrapper.addClass("active");
            //                            t.wrapper.parents("#qualifiers").addClass("active");
            //                        }

          }
        }
      });

      b.click(function () {
        if (b.hasClass("results")) {
          if (!t.element.data("expand")) {
            t.wrapper.removeClass("active");
            t.wrapper.parents("#qualifiers").removeClass("active");
          }
        } else {
          if (!$("#search").hasClass("more") || ($("#search").hasClass("more") && !t.element.data("expand"))) {
            t.wrapper.removeClass("active");
            t.wrapper.parents("#qualifiers").removeClass("active");
          }
        }
      });

      if (radioinputs) {
        for (var i = 0; i < radioinputs.length; i++) {
          $(radioinputs[i]).bind("click", function (e) {
            var radioValue = "";
            $("#tlc_" + id + " li .checkbox").removeClass('active');
            for (var ind in radioinputs) {
              if (radioinputs[ind].checked == true) {
                $(radioinputs[ind]).parents('.checkbox').addClass('active');
                if (radioinputs[ind].value == "transit,walk") {
                  radioValue = "walk";
                } else
                  radioValue = radioinputs[ind].value;
              }
            }
            if (id.indexOf('commute-time') > -1) {
              //if (min.val() == 0) {
              //    $("#tlc_" + id + " span").html("ANY");
              //}
              //else {
              $("#tlc_" + id + " span:first").css('height', '62px');
              $("#tlc_" + id + " span").next('dt').hide();
              var minute_val = "0 min";
              if (min.val().length > 1) {
                minute_val = min.val();
              }
              if (radioValue == 'car') {
                $("#tlc_" + id + " span:first").html('<i class="fa fa-car commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + minute_val + '</span>');
              }
              else if (radioValue == 'transit') {
                $("#tlc_" + id + " span:first").html('<i class="fa fa-subway commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + minute_val + '</span>');
              }
              else if (radioValue == 'walk') {
                $("#tlc_" + id + " span:first").html('<img src="/images/walking.png" class="commuteSearchImage"><br><span class="commuteSearchSpan">' + minute_val + '</span>');
              }
              else if (radioValue == 'bike') {
                $("#tlc_" + id + " span:first").html('<i class="fa fa-motorcycle commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + minute_val + '</span>');
              }

              //}

              //                                $("#tlc_"+id+" span").html(radioValue + "<br/>" +min.val() + "min");
            } else
              $("#tlc_" + id + " span").html(min.val());

            t.radioValue = radioValue;
            t.fireOnChange(t);
          })
        }

      }

      /* slider from jquery */
      var sliderwrapper = $('<div class="ui-slider-wrapper"><div></div></div>'),
        slider = sliderwrapper.children("div");

      sliderwrapper.appendTo(t.element);
      slider.slider({
        range: "min",
        min: minval,
        max: maxval,
        step: step,
        values: [minval],
        slide: function (event, ui) {
          min.val(ui.values[0] + " min");
          if (hn) min.priceFormat(pf);
          var sliderFor = $(this).parents('div')[1].id;

          var radioValue = "";
          if (radioinputs) {
            for (var ind in radioinputs) {
              if (radioinputs[ind].checked == true) {
                if (radioinputs[ind].value == "transit,walk") {
                  radioValue = "walk";
                } else
                  radioValue = radioinputs[ind].value;
              }
            }
          }

          if (sliderFor.indexOf('commute-time') > -1) {
            if (min.val() == 0) {
              $("#tlc_" + id + " span:first").html("ANY");
            } else {
              $("#tlc_" + id + " span:first").css('height', '62px');
              $("#tlc_" + id + " span").next('dt').hide();
              if (radioValue == 'car') {
                $("#tlc_" + id + " span:first").html('<i class="fa fa-car commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + ui.values[0] + ' min</span>');
              }
              else if (radioValue == 'transit') {
                $("#tlc_" + id + " span:first").html('<i class="fa fa-subway commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + ui.values[0] + ' min</span>');
              }
              else if (radioValue == 'walk') {
                $("#tlc_" + id + " span:first").html('<img src="/images/walking.png" class="commuteSearchImage"><br><span class="commuteSearchSpan">' + ui.values[0] + ' min</span>');
              }
              else if (radioValue == 'bike') {
                $("#tlc_" + id + " span:first").html('<i class="fa fa-motorcycle commuteSearchIcon"></i><br><span class="commuteSearchSpan">' + ui.values[0] + ' min</span>');
              }
              else {
                $("#tlc_" + id + " span:first").html('<span class="value">' + min.val() + '</span><dt>Commute time</dt>');
              }
            }
            //                            $("#tlc_"+id+" span").html(radioValue + "<br/>" +ui.values[0] + "min");

          } else
            $("#tlc_" + id + " span").html(ui.values[0]);

          setTimeout(function () {
            var leftt = $("#commute-time div.ui-slider-wrapper div.ui-slider-horizontal span.ui-slider-handle")[0].style.left;
            $("#commute-time div.ui-slider-wrapper div.ui-slider-horizontal div.ui-slider-range").css({ 'width': leftt });
          }, 100);
          t.radioValue = radioValue;
          t.fireOnChange(t);
        }
      });
      min.val(abbrNum(slider.slider("values", 0)));
      min.val(abbrNum(slider.slider("values", 0), step));
      if (hn) min.priceFormat(pf);

      /* handle user changes */
      min.keyup(function (e) {
        console.log('keyup slider');
        /*fire change event if value is changed*/
        if(oldValue != min.val()){
          t.fireOnChange(t);
        }

        slider.slider("values", 0, min.unmask());

        if ($.inArray(e.keyCode, [46, 8]) !== -1 ) {
          var value = min.val();
          if(value.indexOf("mi") != -1 || value.indexOf("m") != -1){
            value = value.substr(0, 2);
            min.val(value);
          }
        }else{
          var value = min.unmask() + "";
          if(value.length > 1){
            value = value.substr(0, 2);
            min.val(value + " min");
          }
        }
      }).blur(function () {
        min.val(min.unmask())
      }).keydown(function(e){
        oldValue = min.val();
        rangeNumberValidator(e);
      });

      /* slider labels */
      slider.after('<label class="ui-slider-label-left">' + minvallabel + '</label><label class="ui-slider-label-right">' + maxvallabel + '</label>')

      /* possible info */
      if (this.element.data("info"))
        this.element.append("<p>" + this.element.data("info") + "</p>");
      this._slider = slider;
    },
    reset: function () {
      var slider = this._slider;
      var id = this._id;
      slider.slider("values", 0, this.minval);

      $("#tlc_" + id + " span:first").html('ANY <br><span class="commuteSearchSpan"> Commute Time</span>');
      $("#commute-time div.ui-slider-wrapper div.ui-slider-horizontal div.ui-slider-range").css({'width': 0 });
      $("#tlc_" + id + " li .checkbox").removeClass('active');
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
