window.ajaxSetup = {
        getAirportsParamsSearch: function (p) {
            var query = {},
                ajaxSetup = {};
            $('.header__airport-container').find('.header__search-box:not(.m-button)').each(function () {
                var $el = $(this);
                if ($el.val().length) {
                    query[$el.data('filter')] = $el.val();
                }
            });
            ajaxSetup = {
                url: '/api/proxy/airports/filter/' + p,
                type: 'get',
                dataType: 'JSON',
                data: query
            };
            return ajaxSetup;
        },
        getFlightsInfo: function (year, month, day, hour) {
            //app.use(route.get('/api/proxy/airport/:airport/:year/:month/:day/:hour/', proxy.requestAirport));
            if (!(year && month && day && hour !== undefined)) {
                year = window.airportDate.year;
                month = window.airportDate.month;
                day = window.airportDate.day;
                hour = window.airportDate.hour;
            }
            var airport = $('.header__search-box').eq(3).val();
            ajaxSetup = {
                url: '/api/proxy/airport/' + airport +'/' + year + '/' + month + '/' + day +'/' + hour + '/',
                type: 'get',
                dataType: 'JSON',
            };
            return ajaxSetup;
        }
    };
window.Handlers = {
        mouseenter: {
            hoverTableColumn:function () {
                var $td = $(this),
                    n = parseInt($(this).index()) + 1;
                $('.content__table-tr td:nth-child(' + n + ')').addClass('m-highlighted');
            }
        },
        mouseleave: {
            hoverLeaveTableColumn: function () {
                var $td = $(this),
                    n = parseInt($(this).index()) + 1;
                $('.content__table-tr td:nth-child(' + n + ')').removeClass('m-highlighted');
            }
        },
        scroll: {
            tableScroll: function () {
               $(document.body).addClass('m-scrolled')
            }
        },
        click: {
            listAirportSuggestions: function () {
                var $input = $(this).parent().find('input'),
                    p = $input.data('filter'),
                    $suggestions = $input.parent().children('.header__search-suggestions'),
                    $allSuggestions=$('.header__search-suggestions');
                $allSuggestions.html('');
                if (!$suggestions.hasClass('m-visible')) {
                    $allSuggestions.removeClass('m-visible');
                    $.ajax($.extend(
                        {},
                        {
                            beforeSend: function () {
                                $input.addClass('m-load');
                            },
                            success: function (data) {
                                $input.removeClass('m-load');
                                if (data.length) {
                                    if (data.length > 300) {
                                        data = {
                                            "name": "To many results",
                                            "count": 0
                                        }

                                    }
                                    $suggestions.html('');
                                    $('#tAirportSearchResult').tmpl(data).appendTo($suggestions);
                                    if (data.length === 1 && data[0].count > 0) {
                                        $suggestions.find('.header__search__result-info').trigger('click');
                                        $input.addClass('m-green');
                                    } else {
                                        $suggestions.addClass('m-visible');
                                        $input.removeClass('m-green');

                                    }
                                }
                            }
                        },
                        ajaxSetup.getAirportsParamsSearch(p)
                    ));
                } else {
                    $suggestions.removeClass('m-visible');
                    $suggestions.html('');
                }
            },
            clearInput: function () {
                var weight = $(this).data('weight'),
                    self = this,
                    $allSuggestions=$('.header__search-suggestions');
                $allSuggestions.removeClass('m-visible');
                $(this).parent().find('input').val('');
                $(this).parent().removeClass('m-filled');
                $('.header__search-box').each(function () {
                    var el = this;
                    if ($(el).next().next().data('weight') >= weight) {
                        $(el).val('');
                        $(el).removeClass('m-green');
                        $(el).parent().removeClass('m-filled');

                    }
                });

            },
            continueAirportSearch: function () {
                var $inputExample = $(this),
                    $input = $(this).closest('.header__search').children('.header__search-box'),
                    count = $inputExample.next().val();
                if (count !== '0') {
                    $input.val($inputExample.val());
                    $input.addClass('m-green');
                    $input.parent().addClass('m-filled');
                    $('.header__search-suggestions').removeClass('m-visible');
                    $input.parent().next().children('.header__search-box').trigger('click').focus();
                }
            },
            acAirportSearch: function () {
                Handlers.keyup.acAirportSearch.call(this);
            },
            showResults: function () {
                var $timeContainer = $('.header__time-container');
                if ($('.header__search-box.m-green').length === 4) {
                    $timeContainer.removeClass('m-hidden');
                    $.ajax($.extend(
                        {},
                        {
                            success: function (data) {
                                $('#airportTime').attr('data-time-offset', data[0].name)
                            }
                        },
                        window.ajaxSetup.getAirportsParamsSearch('offset')
                    ));



                    $.ajax($.extend(
                        {},
                        {
                            beforeSend: function () {
                                $('.content').show().addClass('m-load');
                            },
                            success: function (data) {
                                $('.content').show().removeClass('m-load');
                                $('#flightRow').tmpl(data).appendTo('#contentRow');
                            }
                        },
                        ajaxSetup.getFlightsInfo()
                    ));












                } else {
                    $('.header__search-box:not(.m-green)').each(function () {
                        if (!$(this).hasClass('m-button')) {
                            $(this).animate({backgroundColor: 'red'}, 'slow').animate({backgroundColor: 'white'}, 'slow').queue(function () {
                                $(this).removeAttr('style');
                            });
                        }
                    });
                    $('.header__search-box:not(.m-green)').first().trigger('click');
                }
            },
            showMenu: function () {
                $(document.body).removeClass('m-scrolled')
            }
        },
        keyup: {
            acAirportSearch: function () {
                var $input = $(this).parent().children('input'),
                    $allSuggestions=$('.header__search-suggestions');
                $allSuggestions.removeClass('m-visible');
                if ($input.val().length) {
                    $input.parent().addClass('m-filled');
                } else {
                    $input.parent().removeClass('m-filled');
                }
                $input.removeClass('m-green');
                $input.next().trigger('click');
            }
        }
    };
$(function(){
    Object.keys(Handlers).forEach(function (eve) {
        Object.keys(Handlers[eve]).forEach(function (fun) {
            $(document).on(eve, '[data-bind-'+eve+'*="'+fun+'"]', Handlers[eve][fun]);
        });
    });
    digitalWatch();
    $('section.content').on('scroll' ,function(){
        Handlers.scroll.tableScroll();
    });
    $('.header__search-box').eq(3).val('SVO');
    $('.header__search-box').eq(4).trigger('click');

});

function digitalWatch() {
    var mydate = new Date(),
        offset =  document.getElementById("airportTime").dataset.timeOffset;
    mydate.setUTCMinutes(mydate.getMinutes()+ offset*60);
    var hours = mydate.getUTCHours(),
        minutes = mydate.getUTCMinutes(),
        seconds = mydate.getUTCSeconds();
    window.airportDate = {
        hour: mydate.getUTCHours(),
        day: mydate.getUTCDay(),
        month: mydate.getUTCMonth(),
        year: mydate.getUTCFullYear()
    };
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("airportTime").innerHTML = hours + ":" + minutes + ":" + seconds;
    setTimeout("digitalWatch()", 1000);
}