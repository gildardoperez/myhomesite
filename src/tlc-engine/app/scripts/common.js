/**
 * Created by kamal on 2/28/2015.
 */

function generateSearchUI() {
    // add results to expand
    // add freeze to prevent unnecessary redraws
    $("body").addClass("results freeze");
  $(".my-remove-bg").removeClass("removeBG");
  setTimeout(function () {
    //console.log("GENERATE UI REMOVEBG");
    $("body").removeClass("freeze");
        // remove more
        $("#search, #logo, #slogan").removeClass("more");
        initSplitter();

        // selection-box js [S]
        $('#BasicDataCreditScore').ddslick({
            showSubitemDescription: true,
            onSelected: function (selectedData) {
            }
        });

        // selection-box js [E]

        // radio-button and check-box [S]
        setTimeout(function () {
            //$("[type=checkbox]").change(function () {
            //    if ($(this).next('i').hasClass('checked'))
            //        $(this).next('i').removeClass('checked');
            //    else
            //        $(this).next('i').addClass('checked');
            //});

            $(":radio[name=radioForbasicIntro]").change(function () {
                $(":radio[name=radioForbasicIntro]").each(function () {
                    $(this).next('i').removeClass('checked');
                });
                $(this).next('i').addClass('checked');
            });
            $(":radio[name=TransportationType]").change(function () {
                $(":radio[name=TransportationType]").each(function () {
                    $(this).next('i').removeClass('checked');
                });
                $(this).next('i').addClass('checked');
            });
            $(":radio[name=radioforNewClient]").change(function () {
                $(":radio[name=radioforNewClient]").each(function () {
                    $(this).next('i').removeClass('checked');
                });
                $(this).next('i').addClass('checked');
            });
            $(":radio[name=Entertainment-radio]").change(function () {
                $(":radio[name=Entertainment-radio]").each(function () {
                    $(this).next('i').removeClass('checked');
                });
                $(this).next('i').addClass('checked');
            });
        }, 2000);
        // radio-button and check-box [E]

        // ===================== [ E ] DDslick Selected ( JS ): ===================== //

        // ===================== [ S ]  jQuery input spinner ( JS ): ===================== //
        (function ($) {
            "use strict";

            var spinningTimer;
            var Spinning = function (el, options) {
                this.$el = el;
                this.options = $.extend({}, Spinning.rules.defaults, Spinning.rules[options.rule] || {}, options || {});
                this.min = parseFloat(this.options.min) || 0;
                this.max = parseFloat(this.options.max) || 0;

                this.$el
                  .on('focus.spinner', $.proxy(function (e) {
                      e.preventDefault();
                      $(document).trigger('mouseup.spinner');
                      this.oldValue = this.value();
                  }, this))
                  .on('change.spinner', $.proxy(function (e) {
                      e.preventDefault();
                      this.value(this.$el.val());
                  }, this))
                  .on('keydown.spinner', $.proxy(function (e) {
                      var dir = { 38: 'up', 40: 'down' }[e.which];
                      if (dir) {
                          e.preventDefault();
                          this.spin(dir);
                      }
                  }, this));

                //init input value
                this.oldValue = this.value();
                this.value(this.$el.val());
                return this;
            };

            Spinning.rules = {
                defaults: { min: 0, max: 99, step: 1, precision: 0 },
                currency: { min: 0.00, max: null, step: 0.01, precision: 2 },
                quantity: { min: 0, max: 999, step: 1, precision: 0 },
                percent: { min: 0, max: 100, step: 1, precision: 0 },
                month: { min: 0, max: 12, step: 1, precision: 0 },
                day: { min: 0, max: 31, step: 1, precision: 0 },
                hour: { min: 0, max: 23, step: 1, precision: 0 },
                minute: { min: 0, max: 59, step: 1, precision: 0 },
                second: { min: 0, max: 59, step: 1, precision: 0 }
            };

            Spinning.prototype = {
                spin: function (dir) {
                    if (this.$el.attr('disabled') === 'disabled') {
                        return;
                    }

                    this.oldValue = this.value();
                    switch (dir) {
                        case 'up':
                            this.value(this.oldValue + Number(this.options.step, 10));
                            break;
                        case 'down':
                            this.value(this.oldValue - Number(this.options.step, 10));
                            break;
                    }
                },

                value: function (v) {
                    if (v === null || v === undefined) {
                        return this.numeric(this.$el.val());
                    }
                    v = this.numeric(v);

                    var valid = this.validate(v);
                    if (valid !== 0) {
                        v = (valid === -1) ? this.min : this.max;
                    }
                    this.$el.val(v.toFixed(this.options.precision));

                    if (this.oldValue !== this.value()) {
                        //changing.spinner
                        this.$el.trigger('changing.spinner', [this.value(), this.oldValue]);

                        //lazy changed.spinner
                        clearTimeout(spinningTimer);
                        spinningTimer = setTimeout($.proxy(function () {
                            this.$el.trigger('changed.spinner', [this.value(), this.oldValue]);
                        }, this), Spinner.delay);
                    }
                },

                numeric: function (v) {
                    v = this.options.precision > 0 ? parseFloat(v, 10) : parseInt(v, 10);
                    return v || this.options.min || 0;
                },

                validate: function (val) {
                    if (this.options.min !== null && val < this.min) {
                        return -1;
                    }
                    if (this.options.max !== null && val > this.max) {
                        return 1;
                    }
                    return 0;
                }
            };

            var Spinner = function (el, options) {
                this.$el = el;
                this.$spinning = $("[data-spin='spinner']", this.$el);
                if (this.$spinning.length === 0) {
                    this.$spinning = $(":input[type='number']", this.$el);
                }
                this.spinning = new Spinning(this.$spinning, this.$spinning.data());

                this.$el
                  .on('click.spinner', "[data-spin='up'],[data-spin='down']", $.proxy(this.spin, this))
                  .on('mousedown.spinner', "[data-spin='up'],[data-spin='down']", $.proxy(this.spin, this));

                $(document).on('mouseup.spinner', $.proxy(function () {
                    clearTimeout(this.spinTimeout);
                    clearInterval(this.spinInterval);
                }, this));

                options = $.extend({}, options);
                if (options.delay) {
                    this.delay(options.delay);
                }
                if (options.changed) {
                    this.changed(options.changed);
                }
                if (options.changing) {
                    this.changing(options.changing);
                }
            };

            Spinner.delay = 500;

            Spinner.prototype = {
                constructor: Spinner,

                spin: function (e) {
                    var dir = $(e.currentTarget).data('spin');
                    switch (e.type) {
                        case 'click':
                            e.preventDefault();
                            this.spinning.spin(dir);
                            break;

                        case 'mousedown':
                            if (e.which === 1) {
                                this.spinTimeout = setTimeout($.proxy(this.beginSpin, this, dir), 300);
                            }
                            break;
                    }
                },

                delay: function (ms) {
                    var delay = parseInt(ms, 10);
                    if (delay > 0) {
                        this.constructor.delay = delay + 100;
                    }
                },

                value: function () {
                    return this.spinning.value();
                },

                changed: function (fn) {
                    this.bindHandler('changed.spinner', fn);
                },

                changing: function (fn) {
                    this.bindHandler('changing.spinner', fn);
                },

                bindHandler: function (t, fn) {
                    if ($.isFunction(fn)) {
                        this.$spinning.on(t, fn);
                    } else {
                        this.$spinning.off(t);
                    }
                },

                beginSpin: function (dir) {
                    this.spinInterval = setInterval($.proxy(this.spinning.spin, this.spinning, dir), 100);
                }
            };

            $.fn.spinner = function (options, value) {
                return this.each(function () {
                    var self = $(this), data = self.data('spinner');
                    if (!data) {
                        self.data('spinner', (data = new Spinner(self, $.extend({}, self.data(), options))));
                    }
                    if (options === 'delay' || options === 'changed' || options === 'changing') {
                        data[options](value);
                    }
                    if (options === 'spin' && value) {
                        data.spinning.spin(value);
                    }
                });
            };

            $(function () {
                $('[data-trigger="spinner"]').spinner();
            });
        })(jQuery);
        // ===================== [ E ]  jQuery input spinner ( JS ): ===================== //

    }, 600);
}



function initSplitter() {

if ( $(window).width() > 1441 ){
    $('#button1').click(function(){
        console.log('test1');
      $('#content').css("width", "50%");
      $('#results').addClass('semi').removeClass('wide');
      $('#map').css("width", "50%");
      $('#button1Div').css("display", "none");
      $('#leftbuttonDiv').css("display", "block");
      $('#rightbuttonDiv').css("display", "block");
    });

    $('#leftbutton').click(function(){
      $('#content').css("width", "35%");
      $('#results').removeClass('semi').removeClass('wide');
      $('#map').css("width", "65%");
      $('#button1Div').css("display", "block");
      $('#leftbuttonDiv').css("display", "none");
      $('#rightbuttonDiv').css("display", "none");
    });

    $('#rightbutton').click(function(){
      $('#content').css("width", "65%");
      $('#results').addClass('wide').removeClass('semi');
      $('#map').css("width", "35%");
      $('#button3Div').css("display", "block");
      $('#leftbuttonDiv').css("display", "none");
      $('#rightbuttonDiv').css("display", "none");
    });

    $('#button3').click(function(){
      $('#content').css("width", "50%");
      $('#results').addClass('semi').removeClass('wide');
      $('#map').css("width", "50%");
      $('#button3Div').css("display", "none");
      $('#leftbuttonDiv').css("display", "block");
      $('#rightbuttonDiv').css("display", "block");
    });
}
else if($(window).width() <= 1024 && $(window).width() >= 881) {

    if(!$('#results').hasClass('wide'))
    {
      $('#results').addClass('wide');
    }

}
else if($(window).width() <= 880 && $(window).width() >= 575) {
    if(!$('#results').hasClass('semi'))
    {
      $('#results').addClass('semi');
    }
}
else{
    $('#button1').click(function(){
      $('#content').css("width", "50%");
      $('#results').addClass('semi').removeClass('wide');
      $('#map').css("width", "50%");
      $('#button1Div').css("display", "none");
      $('#leftbuttonDiv').css("display", "block");
      $('#rightbuttonDiv').css("display", "block");
    });

    $('#leftbutton').click(function(){
      $('#content').css("width", "35%");
      $('#results').removeClass('semi').removeClass('wide');
      $('#map').css("width", "65%");
      $('#button1Div').css("display", "block");
      $('#leftbuttonDiv').css("display", "none");
      $('#rightbuttonDiv').css("display", "none");
    });

    $('#rightbutton').click(function(){
      $('#content').css("width", "75%");
      $('#results').addClass('wide').removeClass('semi');
      $('#map').css("width", "25%");
      $('#button3Div').css("display", "block");
      $('#leftbuttonDiv').css("display", "none");
      $('#rightbuttonDiv').css("display", "none");
    });

    $('#button3').click(function(){
      $('#content').css("width", "50%");
      $('#results').addClass('semi').removeClass('wide');
      $('#map').css("width", "50%");
      $('#button3Div').css("display", "none");
      $('#leftbuttonDiv').css("display", "block");
      $('#rightbuttonDiv').css("display", "block");
    });
}
    if ($("#handle").hasClass('ui-draggable')) {
        $("#handle").draggable("destroy");
    }
    /* draggable handle */
    $("#handle").draggable({
        axis: "x",
        scroll: false,
        snap: "#l,#r",
        snapMode: "outer",
        snapTolerance: 0,//250

        start: function () {
            // cursor calmer
            $("body").addClass("dragging");
        },
        stop: function (e, ui) {
            // normal cursor
            $("body").removeClass("dragging");
            // also percentify the pos
            $("#handle").css("left", "100%");
            // save position to cookie
            $.cookie("tlc_hpos", (ui.position.left / $(window).width()) * 100, { expires: 365, path: '/' });
        },
        drag: function (e, ui) {
            // TODO: don't allow certain pages, like details, to be resized to too small
            $('.prop-list-scroll,.scrollProperty').perfectScrollbar('update');
            // handle percentages
            var content = (ui.position.left / $(window).width()) * 100;
            $(window).resize();
            $("#content").css("width", content + "%");
            /*$(".bookmark-title").css("width", content + "%");*/
            //$(".property-title").css("width", content + "%");
            //$(".property-result-subtitle").css("width", content + "%");
            $("#map, #drawing").css("width", 100 - content + "%");
            $("#map, #drawing").css("width", "calc(" + (100 - content) + "% - 12px)");
            $("#profile-completion, #drawing").css("width", 100 - content + "%");
            $("#profile-completion, #drawing").css("width", "calc(" + (100 - content) + "% - 12px)");
            $("#drawhelp").css("width", 100 - content - 2 + "%");
            $("#drawhelp").css("width", "calc(" + (100 - content) + "% - 72px)");
            $(".photoGalleryli").css("width", $("#slider").width());
            if ($('#slider').data('flexslider')!=undefined)
                $('#slider').data('flexslider').resize();
          //  console.log("posituioipon:=" + ui.position.left);

          if (ui.position.left <= 807) {
                $(".vartical_tab_menu").addClass("semiSlider");
                $(".vartical_tab_menu").removeClass("wideSlider");
              $(".vartical_tab_menu").removeClass("vertical_tab_1");
            }
            else if (ui.position.left <= 1006 && ui.position.left > 986) {
              $(".vartical_tab_menu").addClass("vertical_tab_1");
              //$(".vartical_tab_menu").removeClass("semiSlider");
            }

            else if (ui.position.left <= 1006 && ui.position.left > 807) {
                $(".vartical_tab_menu").addClass("wideSlider");
              $(".vartical_tab_menu").removeClass("vertical_tab_1");
                $(".vartical_tab_menu").removeClass("semiSlider");
            }
            else {
                $(".vartical_tab_menu").removeClass("semiSlider");
                $(".vartical_tab_menu").removeClass("wideSlider");
              $(".vartical_tab_menu").removeClass("vertical_tab_1");
            }

            var divWidth = parseInt($('#profileDetailInfo').width())+50;
            // handle responsive class
            if (ui.position.left <= 310) {
                //$("#results").attr("class", "grid");
                $("#profile").attr("class", "grid");
                $("#displayPropertySlider").attr("class", "grid");
                $("#client-page").attr("class", "grid");
                $("#client-summary").attr("class", "grid");
                $("#client-profile").attr("class", "grid");
                $("#profile-completion").attr("class", "grid");

                $("#content").css("width", "0%");
                $("#map").css("width", "99%");
                $("#drawhelp").css("width", "99*%");
                $('#askMeQues').css('width',divWidth+"px");

                $("#propDetailImageSlider,.client-infobox").addClass("grid");
                $("#propDetailImageSlider,.client-infobox").removeClass("narrow");
                $("#propDetailImageSlider,.client-infobox").removeClass("wide");
                $("#propDetailImageSlider,.client-infobox").removeClass("semi");
                $("#propDetailImageSlider,.client-infobox").removeClass("small");
            }
            else if (ui.position.left <= 420) {
                $("#results").attr("class", "narrow");
                $("#profile").attr("class", "narrow");
                $("#displayPropertySlider").attr("class", "narrow");
                $("#client-page").attr("class", "narrow");
                $("#client-summary").attr("class", "narrow");
                $("#client-profile").attr("class", "narrow");
                $("#profile-completion").attr("class", "narrow");
                $('#askMeQues').css('width',divWidth+"px");

                $("#propDetailImageSlider,.client-infobox").removeClass("grid");
                $("#propDetailImageSlider,.client-infobox").addClass("narrow");
                $("#propDetailImageSlider,.client-infobox").removeClass("wide");
                $("#propDetailImageSlider,.client-infobox").removeClass("semi");
                $("#propDetailImageSlider,.client-infobox").removeClass("small");
            }
            else if (ui.position.left >= 900) {
                $("#results").attr("class", "wide");
                $("#profile").attr("class", "wide");
                $("#displayPropertySlider").attr("class", "wide");
                $("#client-page").attr("class", "wide");
                $("#client-summary").attr("class", "wide");
                $("#client-profile").attr("class", "wide");
                $("#profile-completion").attr("class", "wide");
                $('#askMeQues').css('width',divWidth+"px");
                $('#askQuesModal').hide();
                $('#askMeQues').show();
                $('#poisDiv').hide();

                $("#propDetailImageSlider,.client-infobox").removeClass("grid");
                $("#propDetailImageSlider,.client-infobox").removeClass("narrow");
                $("#propDetailImageSlider,.client-infobox").addClass("wide");
                $("#propDetailImageSlider,.client-infobox").removeClass("semi");
                $("#propDetailImageSlider,.client-infobox").removeClass("small");
            }
            else if (ui.position.left >= 650) {
                $("#results").attr("class", "semi");
                $("#profile").attr("class", "semi");
                $("#displayPropertySlider").attr("class", "semi");
                $("#client-page").attr("class", "semi");
                $("#client-summary").attr("class", "semi");
                $("#client-profile").attr("class", "semi");
                $("#profile-completion").attr("class", "semi");
                $('#askQuesModal').show();
                $('#askMeQues').hide();
                $('#poisDiv').show();

                $("#propDetailImageSlider,.client-infobox").removeClass("grid");
                $("#propDetailImageSlider,.client-infobox").removeClass("narrow");
                $("#propDetailImageSlider,.client-infobox").removeClass("wide");
                $("#propDetailImageSlider,.client-infobox").addClass("semi");
                $("#propDetailImageSlider,.client-infobox").removeClass("small");
            }
            else {
                $("#results").removeAttr("class");
                $("#profile").attr("class", "small");
                $("#displayPropertySlider").attr("class", "small");
                $("#client-page").attr("class", "small");
                $("#client-summary").attr("class", "small");
                $("#client-profile").attr("class", "small");
                $("#profile-completion").attr("class", "small");

                $("#propDetailImageSlider,.client-infobox").removeClass("grid");
                $("#propDetailImageSlider,.client-infobox").removeClass("narrow");
                $("#propDetailImageSlider,.client-infobox").removeClass("wide");
                $("#propDetailImageSlider,.client-infobox").removeClass("semi");
                $("#propDetailImageSlider,.client-infobox").addClass("small");
            }
        }
    });
}

// for currency format
function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);
    // Enumerate number abbreviations
    var abbrev = ["k", "m", "b", "t"];
    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);
        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number * decPlaces / size) / decPlaces;
            // Handle special case where we round up to the next abbreviation
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }
            // Add the letter for the abbreviation
            number += abbrev[i];
            // We are done... stop
            break;
        }
    }
    return number;
}


//for set search tag ui
function setSearchTagUI() {
    //setTimeout(function () {
    //    var searchH = $("#search").height();
    //    if (searchH > 50 && searchH < 100) {
    //        $('article').css('margin-top', '40px');
    //        $("#propertyDetail").closest('article').css('margin-top', '');
    //    }
    //    else if (searchH > 100) {
    //        $('article').css('margin-top', '80px');
    //        $("#propertyDetail").closest('article').css('margin-top', '');
    //    }
    //    else
    //        $('article').css('margin-top', '');
    //}, 2000);
}



function changeColor(event) {
    setTimeout(function () {
        $(".collapse.in").each(function () {
           if($(this).parent('.panel').find('.listing-info-hidden-class').length == 0) {
               $(this).parent('.panel').find('.panel-body').html('No data available.');
           }
        });
        $(".collapsing").parent('.panel').find('.panel-heading').each(function () {
        });
    }, 600);

}

Date.prototype.addDays = function (n) {
  var time = this.getTime();
  var changedDate = new Date(time + (n * 24 * 60 * 60 * 1000));
  this.setTime(changedDate.getTime());
  return this;
};

function setSearchTagWidth(){
  var totalSearchLength = 0;
  var total_search_width=parseFloat($("#search").css('width'));
  $(".search-criteria-container li").each(function () {
    totalSearchLength += (parseFloat($(this).css('width')) + 5);
  });
  totalSearchLength = totalSearchLength - (parseFloat($(".search-criteria-container li:first").css('width')));
  totalSearchLength = totalSearchLength + 20;

  if ($(".search-criteria-container").hasClass('moreSearchcontainer') && $(window).width() > 960) {
    var max_width = (total_search_width * 55) / 100;// set max width 55%. based on search div
    if (totalSearchLength > max_width) {
      totalSearchLength = max_width;
    }
    $(".moreSearchcontainer").css({ 'width': totalSearchLength });
  }
  else if ($(".search-criteria-container").hasClass('moreSearchcontainer') && $(window).width() > 767) {
    var max_width = (total_search_width * 30) / 100;
    if (totalSearchLength > max_width) {
      totalSearchLength = max_width;
    }
    $(".moreSearchcontainer").css({ 'width': totalSearchLength });
  }
  else
    $(".search-criteria-container").css({ 'width': '' });
}


var MobCollapse = true;
function mobFunction(event) {
     MobCollapse = !MobCollapse;
    if (MobCollapse === true ) {
        $(event.target).next('.show-sub').hide();
        $(event.target).find("i.pull-right").addClass("glyphicon-chevron-right").removeClass('glyphicon-chevron-down');
    } else if (MobCollapse === false ) {
        $(event.target).next('.show-sub').show();
        $(event.target).find("i.pull-right").addClass("glyphicon-chevron-down").removeClass('glyphicon-chevron-right');
    }
}

