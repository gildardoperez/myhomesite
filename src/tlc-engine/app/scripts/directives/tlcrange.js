'use strict';

/**
 * @ngdoc directive
 * @name tlcengineApp.directive:tlcRange
 * @description
 * # tlcRange
 */
angular.module('tlcengineApp')
  .directive('tlcRange', function () {
    return {
      scope:{
        reset: "=",
        onChangeHandler: "=",
        ngMinModel:'=?',
        ngMaxModel:'=?',
        ngChangeValue:'=?'
      },
//      template: '<div></div>',
//      restrict: 'E',
      link: function postLink($scope, element, attrs) {
        $(element).tlcRange();

        $scope.$watch("reset", function(newVal, oldVal){
          if(newVal == true){
            $(element).tlcRange("reset");
            $scope.reset = false;
          }
        });

        $scope.$watch('ngMaxModel', function(newVal, oldVal){
          //console.log($scope.ngMinModel,$scope.ngMaxModel);
          if(oldVal != newVal && $scope.ngMinModel!= undefined && $scope.ngMaxModel!=undefined) {
            var obj ={min:$scope.ngMinModel.replace(/,/g,""),max:$scope.ngMaxModel.replace(/,/g,"")};
            //var obj ={min:angular.copy($scope.ngMinModel.replace(/,/g,"")),max:angular.copy($scope.ngMaxModel.replace(/,/g,""))};
            //console.log(obj);
            $(element).tlcRange("changeValue", obj);
          }
          else if($scope.ngMinModel== undefined && $scope.ngMaxModel==undefined)
          {
            $(element).tlcRange("reset");
          }
        });

        /*$scope.$watch('ngChangeValue', function(newVal, oldVal){
          if(newVal == true && $scope.ngMinModel!= undefined && $scope.ngMaxModel!=undefined) {
            var obj ={min:$scope.ngMinModel,max:$scope.ngMaxModel};
            console.log(obj);
            $(element).tlcRange("changeValue", obj);
          }
        });*/

        if($scope.onChangeHandler != undefined && $scope.onChangeHandler != null){
          $(element).tlcRange("onChange",function(e){
            //console.log("On Range change ", e.min.val(), e.max.val());
            $scope.onChangeHandler(attrs.label || attrs.name,e.min.val() + " - " + e.max.val());
          });
        }
      }
    };
  });



/*
 *  TLC Range selector
 */
; (function ($, window, document, undefined) {

  // Create the defaults once
  var pluginName = "tlcRange",
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
        max = t.element.find("input[data-role=max]"),
        minval = Number(t.element.data("min")),
        maxval = Number(t.element.data("max")),
        minvallabel = t.element.data("min-label"),
        maxvallabel = t.element.data("max-label"),
        step = t.element.data("slider-step"),
        hn = !(t.element.data("humane")),
        pf = { prefix: '', decimals: 0, hidePrefix: true},
        oldValue;

      if ((step + "").indexOf(".") != -1) {
        pf = { prefix: '', decimals: 2, hidePrefix: true };
      }
      this.wrapper = $('<div id="tlc_' + id + '" class="tlc_range tlc_qualifier ' + className + '"><span>ANY</span> <dt>' + label + '</dt><dd>' + labellong + '</dd></div>');
      this.element.hide().after(t.wrapper);
      this.wrapper.append(this.element);
      this.minval = minval;
      this.maxval = maxval;
      this._id = id;
      this.onChangeHandler = function () { };
      t.min = min;
      t.max = max;

      this.wrapper.click(function (e) {
        if(e.target.innerHTML == "TLC") {
          trackGoogleAnalytics('TLC button in search box', 'Home Page', null, 'TLC button');
        }
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

      /* slider from jquery */
      var sliderwrapper = $('<div class="ui-slider-wrapper"><div></div></div>'),
        slider = sliderwrapper.children("div");      

      sliderwrapper.appendTo(t.element);
      slider.slider({
        range: true,
        min: minval,
        max: maxval,
        step: step,
        values: [minval, maxval],
        slide: function (event, ui) {
          min.val(ui.values[0]);
          //                    if(step != undefined)
          //					    min.val(abbrNum((ui.values[0] * step), step));
          //                    else
          //                        min.val(abbrNum(ui.values[0]));
          if (hn) min.currency(pf);
          max.val(ui.values[1]);
          //                    if(step != undefined)
          //					    max.val(abbrNum(ui.values[1] * step, step));
          //                    else
          //					    max.val(abbrNum(ui.values[1]));
          if (hn) max.currency(pf);
          var sliderFor = $(this).parents('div')[1].id;
          //					console.log(sliderFor);
          //					console.log("abbrNum(ui.values[0], step) " +abbrNum(ui.values[0], step) );
          //					console.log("abbrNum(ui.values[1], step) " +abbrNum(ui.values[1], step) );
          if (step != undefined) {
            min.val(abbrNum(ui.values[0], step));
            max.val(abbrNum(ui.values[1], step));
          }

          if (sliderFor == 'tlc')
            $("#tlc_tlc span").first().html(abbrNum(ui.values[0], 1) + "-" + abbrNum(ui.values[1], 1));
          else if (sliderFor == 'price'){
            $("#tlc_price span").first().html(abbrNum(ui.values[0], 1) + "-" + abbrNum(ui.values[1], 1));
          }
          else if (sliderFor == 'sqft')
            $("#tlc_sqft span").first().html(abbrNum(ui.values[0], 1) + "-" + abbrNum(ui.values[1], 1));
          else if (sliderFor == 'acres')
            $("#tlc_acres span").first().html(abbrNum(ui.values[0], step) + "-" + abbrNum(ui.values[1], step));
          else if (sliderFor == 'year')
            $("#tlc_year span").first().html(ui.values[0] + "-" + ui.values[1]);
           else if (sliderFor == 'bedrooms')
            $("#tlc_bedrooms span").first().html(abbrNum(ui.values[0], 1) + "-" + abbrNum(ui.values[1], 1));
          /*else if (sliderFor == 'commute-time')
           $("#tlc_commute-time span").first().html(ui.values[0] + "-" + ui.values[1]);*/
          t.fireOnChange(t);

        }
      });
      min.val(abbrNum(slider.slider("values", 0)));
      //			min.val(abbrNum(slider.slider("values", 0), step));
      if (hn) min.currency(pf);
      max.val(abbrNum(slider.slider("values", 1)));
      //			max.val(abbrNum(slider.slider("values", 1), step));
      if (hn) max.currency(pf);

      /* handle user changes */
      min.keyup(function (e) {
        /*fire change event if value is changed*/
        if(oldValue != min.val()){
          t.fireOnChange(t);
        }
        var id = ($(e.target).parent().attr("id") || $(e.target).parent().attr("name"));

//        var minimumValue = min.val().replace(/\,/g,'');
//
//         if(minimumValue > max.val() && max.val().trim() != "") {
//             min.val(max.val());
//         }

        if(min.val() > maxval) {
          slider.slider("values", 1, maxval);
          min.val(maxval);
        }

//        if(min.val().trim() == "" && max.val().trim() == ""){
//          min.val(minval);
//          max.val(maxval);
//          //min.currency();
//          //max.currency();
//        }else if(min.val().trim() == ""){
//          min.val(minval);
//          //min.currency();
//        }else if(max.val().trim() == ""){
//          max.val(maxval);
//          //max.currency();
//        }

        if (pf.decimals > 0) {
          slider.slider("values", 0, min.val());
        } else
          slider.slider("values", 0, min.unmask());

        if (id == 'sqft') {
          max.val(maxval);
        }            

      }).keydown(function(e){
        oldValue = min.val();
        rangeNumberValidator(e);
      })
        .blur(function (e) {
          var minLimit = $(e.target).parent().data("min");
          var maxLimit = $(e.target).parent().data("max");
          var id = ($(e.target).parent().attr("id") || $(e.target).parent().attr("name"));
          var finalVar = Number($(e.target).unmask());

          if (id == "year") {
            if (finalVar < minLimit) {
              $(e.target).val(minLimit);
            }
          }

          if (id != "year" && id != "acres") {
            min.val(min.unmask());
            min.currency(pf);
          }
          
          if(min.val() != "" && max.val() != "" && id != 'bedrooms') {
            if (id == 'tlc')
              $("#tlc_tlc span").first().html(abbrNum(Number(min.unmask()), 1) + "-" + abbrNum(Number(max.unmask()), 1));
            else if (id == 'price'){
              $("#tlc_price span").first().html(abbrNum(Number(min.unmask()), 1) + "-" + abbrNum(Number(max.unmask()), 1));
            }
            else if (id == 'sqft')
              $("#tlc_sqft span").first().html(abbrNum(Number(min.unmask()), 1) + "-" + abbrNum(Number(max.unmask()), 1));
            else if (id == 'acres')
              $("#tlc_acres span").first().html(abbrNum(Number(min.val()), step) + "-" + abbrNum(Number(max.val()), step));
            else if (id == 'year') {
              if(max.val().trim() == ""){
                 max.val(maxval);
              }
              $("#tlc_year span").first().html(min.val() + "-" + max.val());
            }            
          } else if (id == 'bedrooms') {
              if(min.val() == "" && max.val() != "") {
                $("#tlc_bedrooms span").first().html(0 + "-" + abbrNum(Number(max.unmask()), 1)); 
              } else if(min.val() != "" && max.val() == "") {
                $("#tlc_bedrooms span").first().html(abbrNum(Number(min.val()), 1));
              } else if(max.val() != "" && min.val() != "") {
                $("#tlc_bedrooms span").first().html(abbrNum(Number(min.val()), 1) + "-" + abbrNum(Number(max.val()), 1));
              } else if(max.val() == "" && min.val() == "") {
                slider.slider("values", 0, 0);
                slider.slider("values", 1, 99);
                $("#tlc_bedrooms span").first().html("ANY");
              }
            }
        });
      max.keyup(function (e) {        
        /*fire change event if value is changed*/
        if(oldValue != max.val()){
          t.fireOnChange(t);
        }

        var id = ($(e.target).parent().attr("id") || $(e.target).parent().attr("name"));         

//          var maximumValue = max.val().replace(/\,/g,'');
//
//          if(maximumValue < min.val() && min.val().trim() != "") {
//              max.val(min.val());
//          }

        if(max.val() > maxval) {
            slider.slider("values", 1, maxval);
            max.val(maxval);
        }

//        if(min.val().trim() == "" ){
//          min.val(minval);
//          // max.val(maxval);
//          //min.currency();
//          //max.currency();
//        }
//        else if(max.val().trim() == ""){
//          max.val(maxval);
//          //max.currency();
//        }

        if (pf.decimals > 0) {
          slider.slider("values", 1, max.val());
        } else
          slider.slider("values", 1, max.unmask());

      }).blur(function (e) {
        var minLimit = $(e.target).parent().data("min");
        var maxLimit = $(e.target).parent().data("max");
        var id = ($(e.target).parent().attr("id") || $(e.target).parent().attr("name"));
        var finalVar = Number($(e.target).unmask());
        
        if (id == "year") {
          if (finalVar > maxLimit) {
            $(e.target).val(maxLimit);
          }
        }

        //if Min is higher than set Max=Min  
        if (Number(min.unmask()) > Number(max.unmask())) {
          if(id != "bedrooms" & id != "price") //For except this id's
          {
            max.val(min.unmask())
          if(hn) {
            max.currency(pf); 
          }  
          if (pf.decimals > 0) {
              slider.slider("values", 1, max.val());
          } else {
              slider.slider("values", 1, max.unmask());
            }
          }
          else if(id == "price"){
            if(hn) {
              max.currency(pf); 
            } 
          }       
        }



        if (id != "year" && id != "acres") {
          max.val(max.unmask());
          max.currency(pf);
        }


        if(min.val() != "" && max.val() != "" && id != 'bedrooms') {
          if (id == 'tlc')
            $("#tlc_tlc span").first().html(abbrNum(Number(min.unmask()), 1) + "-" + abbrNum(Number(max.unmask()), 1));
          else if (id == 'price'){
             $("#tlc_price span").first().html(abbrNum(Number(min.unmask()), 1) + "-" + abbrNum(Number(max.unmask()), 1));
          }
          else if (id == 'sqft')
            $("#tlc_sqft span").first().html(abbrNum(Number(min.unmask()), 1) + "-" + abbrNum(Number(max.unmask()), 1));
          else if (id == 'acres')
            $("#tlc_acres span").first().html(abbrNum(Number(min.val()), step) + "-" + abbrNum(Number(max.val()), step));
          else if (id == 'year')
            $("#tlc_year span").first().html(min.val() + "-" + max.val());          
        } 
        else if (id == 'bedrooms') {
            if(min.val() == "" && max.val() != "") {
             $("#tlc_bedrooms span").first().html(0 + "-" + abbrNum(Number(max.unmask()), 1));
            } else if(min.val() != "" && max.val() == "") {
              $("#tlc_bedrooms span").first().html(abbrNum(Number(min.val()), 1));
            } else if(max.val() != "" && min.val() != "") {
              $("#tlc_bedrooms span").first().html(abbrNum(Number(min.val()), 1) + "-" + abbrNum(Number(max.val()), 1));
            } else if(max.val() == "" && min.val() == "") {
              slider.slider("values", 0, 0);
              slider.slider("values", 1, 99);
              $("#tlc_bedrooms span").first().html("ANY");
            }
        }
        

      }).keydown(function(e){
        oldValue = max.val();
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
      var sliderFor = this._id;
      slider.slider("values", 0, this.minval);
      slider.slider("values", 1, this.maxval);

      if (sliderFor == 'tlc')
        $("#tlc_tlc span").first().html("ANY");
      else if (sliderFor == 'price')
        $("#tlc_price span").first().html("ANY");
      else if (sliderFor == 'sqft')
        $("#tlc_sqft span").first().html("ANY");
      else if (sliderFor == 'acres')
        $("#tlc_acres span").first().html("ANY");
      else if (sliderFor == 'year')
        $("#tlc_year span").first().html("ANY");
      else if (sliderFor == 'bedrooms')
        $("#tlc_bedrooms span").first().html("ANY");
      /*else if (sliderFor == 'commute-time')
       $("#tlc_commute-time span").first().html("ANY");*/
    },
    changeValue: function (objValue) {

      if (Number(objValue.min) <= Number(objValue.max.replace(/-/g, ""))) {
        var slider = this._slider;
        var sliderFor = this._id;
        //console.log(sliderFor, objValue.min, objValue.max);

        slider.slider("values", 0, objValue.min);
        slider.slider("values", 1, objValue.max);        

        if (sliderFor == 'tlc')
          $("#tlc_tlc span").first().html(abbrNum(Number(objValue.min), 1) + "-" + abbrNum(Number(objValue.max), 1));
        else if (sliderFor == 'price'){
          $("#tlc_price span").first().html(abbrNum(Number(objValue.min), 1) + "-" + abbrNum(Number(objValue.max), 1));
        }
        else if (sliderFor == 'sqft')
          $("#tlc_sqft span").first().html(abbrNum(Number(objValue.min), 1) + "-" + abbrNum(Number(objValue.max), 1));
        else if (sliderFor == 'acres')
          $("#tlc_acres span").first().html(abbrNum(Number(objValue.min), 0.25) + "-" + abbrNum(Number(objValue.max), 0.25));
        else if (sliderFor == 'year')
          $("#tlc_year span").first().html(objValue.min + "-" + objValue.max);
        else if (sliderFor == 'bedrooms')
          $("#tlc_bedrooms span").first().html(abbrNum(Number(objValue.min), 1) + "-" + abbrNum(Number(objValue.max.replace(/-/g, "")), 1));
      }
      else if(Number(objValue.max.replace(/-/g, "")) == 0) {
        var slider = this._slider;
        var sliderFor = this._id;
        if (sliderFor == 'bedrooms')
          $("#tlc_bedrooms span").first().html(abbrNum(Number(objValue.min), 1));
      } 
      else 
      {
        this.reset();
      }
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
        if (arguments.length == 1) {
          $.data(this, 'plugin_' + pluginName)[options]();
        } else {
          if ($.data(this, 'plugin_' + pluginName))
            $.data(this, 'plugin_' + pluginName)[options](argument);
        }
      } else if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
