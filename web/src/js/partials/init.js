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
            window.digitalWatch();
            if (!(year && month && day && hour !== undefined)) {
                var mydate = new Date(window.airportDefaultDate);
                mydate.setUTCHours(mydate.getUTCHours()-1);
                year = mydate.getUTCFullYear();
                month = mydate.getUTCMonth()+1;
                day = mydate.getUTCDate();
                hour = mydate.getUTCHours();
                window.filterDate = new Date(mydate);
            }
            var airport = $('.header__search-box').eq(3).val(),
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
            filterTableByType: function () {
                var $button = $(this),
                    param = $button.data('filter-param');
                $button.toggleClass('m-filtered');
                $('.content__table').find('.m-'+param).closest('.content__table-tr').toggle()
            },
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
                        window.ajaxSetup.getAirportsParamsSearch(p)
                    ));
                } else {
                    $suggestions.removeClass('m-visible');
                    $suggestions.html('');
                }
            },
            showNext: function () {
                window.filterDate.setUTCHours( window.filterDate.getUTCHours() + 6);
                window.Handlers.click.showResults(
                    window.filterDate.getUTCFullYear(),
                    window.filterDate.getUTCMonth()+1,
                    window.filterDate.getUTCDate(),
                    window.filterDate.getUTCHours()
                );
            },
            showPrev: function () {
                window.filterDate.setUTCHours( window.filterDate.getUTCHours() - 6);
                window.Handlers.click.showResults(
                    window.filterDate.getUTCFullYear(),
                    window.filterDate.getUTCMonth()+1,
                    window.filterDate.getUTCDate(),
                    window.filterDate.getUTCHours()
                );
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
                window.Handlers.keyup.acAirportSearch.call(this);
            },
            showResults: function (year, month, day, hour) {
                var $timeContainer = $('.header__time-container');
                $('.content__filter.m-filtered').trigger('click').removeClass('m-filtered');
                if ($('.header__search-box.m-green').length === 4) {
                    $timeContainer.removeClass('m-hidden');
                    $.ajax($.extend(
                        {},
                        {
                            success: function (data) {
                                $('#airportTime').attr('data-time-offset', data[0].name);
                                $.ajax($.extend(
                                    {},
                                    {
                                        beforeSend: function () {
                                            $('.loader').removeClass('m-hidden');
                                            $('.content').show();
                                        },
                                        success: function (data) {
                                            $('#contentRow').children().remove();
                                            $('.content').removeClass('m-hidden');
                                            $('.loader').addClass('m-hidden');
                                            $('#flightRow').tmpl(data).appendTo('#contentRow');
                                        }
                                    },
                                    window.ajaxSetup.getFlightsInfo(year, month, day, hour)
                                ));
                            }
                        },
                        window.ajaxSetup.getAirportsParamsSearch('offset')
                    ));
                } else {
                    $('.header__search-box:not(.m-green)').first().trigger('click');
                }
            },
            showMenu: function () {
                $(document.body).removeClass('m-scrolled')
            },
            filterResults: function () {
                $('.content__filter-container').toggleClass('m-hidden');
                $('.content__filter-input').focus();
                window.Handlers.click.showMenu();
            },
            clearFilter: function () {
                var $this = $(this),
                    $tags = $('.header__tags-container'),
                    $tbody = $('.content__table-body');
                    $this.remove();
                $tbody.children().show();
                $tags.children().each(function (i, el) {
                    var val = $(el).text();
                    $tbody.find('tr').each(function (i, tr) {
                        $tr = $(tr);
                        if (!~$tr.text().toLowerCase().indexOf(val)) {
                            $tr.hide();
                        }
                    });
                });
                if (!$tags.children().length)
                    $('.content__filter.m-filter ').removeClass('m-filtered');
            },
            addFilterTag: function () {
                var $input = $('.content__filter-input'),
                    $tags = $('.header__tags-container'),
                    $tbody = $('.content__table-body'),
                    filter;
                $('.content__filter.m-filter ').addClass('m-filtered')
                if ($input.val().trim().length && $tags.children().length < 5) {
                    filter = $input.val().trim().toLowerCase();
                    $tbody.find('tr').each(function (i, tr) {
                        $tr = $(tr);
                        if (!~$tr.text().toLowerCase().indexOf(filter)) {
                            $tr.hide();
                        }
                    });
                    $('.content__filter-container').addClass('m-hidden');
                    $input.val('');
                    $('<span/>').addClass('header__tags-span').attr('data-bind-click', 'clearFilter').text(filter).appendTo($tags);
                    window.Handlers.click.showMenu();
                } else {
                    $($input).addClass('m-red');
                    $($tags).addClass('m-red');
                    setTimeout(function () {
                        $($tags).removeClass('m-red');
                    }, 1000);
                    setTimeout(function () {
                        $($input, $tags).removeClass('m-red');
                    }, 1000);
                }
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
    Object.keys(window.Handlers).forEach(function (eve) {
        Object.keys(window.Handlers[eve]).forEach(function (fun) {
            $(document).on(eve, '[data-bind-'+eve+'*="'+fun+'"]', window.Handlers[eve][fun]);
        });
    });
    digitalWatch();
    $('section.content').on('scroll' ,function(){
        window.Handlers.scroll.tableScroll();
    });
});

function digitalWatch() {
    var mydate = new Date(),
        offset =  document.getElementById("airportTime").dataset.timeOffset;
    mydate.setUTCMinutes(mydate.getMinutes()+ offset*60);
    var hours = mydate.getUTCHours(),
        minutes = mydate.getUTCMinutes(),
        seconds = mydate.getUTCSeconds();
    window.airportDefaultDate = mydate;

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("airportTime").innerHTML = hours + ":" + minutes + ":" + seconds;
    setTimeout("digitalWatch()", 1000);
}